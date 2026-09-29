alter table products add column if not exists shipping_fee int check(shipping_fee between 0 and 100000000);
alter table product_images add column if not exists media_type text not null default 'image' check(media_type in ('image','video'));
update storage.buckets set file_size_limit=26214400,allowed_mime_types=array['image/jpeg','image/png','image/webp','video/mp4','video/webm'] where id='product-media';
create or replace function place_order(p jsonb,p_receipt_hash text) returns jsonb language plpgsql security definer set search_path=public as $$
declare o orders;prod products;v product_variants;item jsonb;config jsonb;amount bigint:=0;base_delivery int;delivery int:=0;unit int;qty int;title text;code text;new_id uuid;fingerprint text:=encode(extensions.digest(p::text,'sha256'),'hex');
begin
perform pg_advisory_xact_lock(hashtextextended(p->>'key',0));
select * into o from orders where idempotency_key=(p->>'key')::uuid;
if found then if o.request_hash<>fingerprint or o.receipt_hash<>p_receipt_hash then raise exception 'Order request changed. Start a new checkout.';end if;return jsonb_build_object('order_number',o.order_number);end if;
if jsonb_array_length(p->'items') not between 1 and 50 then raise exception 'Invalid cart';end if;
select value into config from store_settings where id=1;
if not coalesce((config->>'policies_reviewed')::boolean,false) then raise exception 'The store is not accepting orders yet.';end if;
if not (p->>'phone' ~ coalesce(config->>'phone_pattern','^(\+92|0)3[0-9]{9}$')) then raise exception 'Enter a valid mobile number.';end if;
select fee into base_delivery from shipping_rules where active and (region='' or lower(region)=lower(p->>'region')) and (city='' or lower(city)=lower(p->>'city')) order by (city<>'') desc,(region<>'') desc,fee desc limit 1;
if base_delivery is null then raise exception 'Delivery is not available for this destination.';end if;
insert into orders(idempotency_key,request_hash,receipt_hash,name,phone,email,region,city,address,landmark,notes,subtotal,shipping,total,currency,delivery_estimate) values((p->>'key')::uuid,fingerprint,p_receipt_hash,p->>'name',p->>'phone',p->>'email',p->>'region',p->>'city',p->>'address',p->>'landmark',p->>'notes',0,0,0,coalesce(config->>'currency','PKR'),coalesce(config->>'delivery_estimate','We will confirm your delivery details.')) returning id into new_id;
for item in select value from jsonb_array_elements(p->'items') order by value->>'product_id',value->>'variant_id' loop
qty:=(item->>'quantity')::int;if qty not between 1 and 99 then raise exception 'Invalid quantity';end if;
select * into prod from products where id=(item->>'product_id')::uuid for update;
if not found or prod.status<>'active' then raise exception 'An item is no longer available.';end if;
unit:=prod.price;title:=prod.name;code:=prod.sku;delivery:=greatest(delivery,coalesce(prod.shipping_fee,base_delivery));
if item->>'variant_id' is not null then
select * into v from product_variants where id=(item->>'variant_id')::uuid and product_id=prod.id and active for update;
if not found or v.stock<qty then raise exception 'An option has insufficient stock.';end if;
update product_variants set stock=stock-qty where id=v.id;unit:=v.price;title:=title||' / '||v.name;code:=v.sku;
else
if exists(select 1 from product_variants where product_id=prod.id and active) then raise exception 'Choose a product option.';end if;
if prod.stock<qty then raise exception 'An item has insufficient stock.';end if;
update products set stock=stock-qty where id=prod.id;
end if;
amount:=amount+unit::bigint*qty;
insert into order_items(order_id,product_id,variant_id,name,sku,price,quantity) values(new_id,prod.id,(item->>'variant_id')::uuid,title,code,unit,qty);
end loop;
update orders set subtotal=amount,shipping=delivery,total=amount+delivery where id=new_id returning * into o;
insert into order_status_history(order_id,status) values(new_id,'Pending');
return jsonb_build_object('order_number',o.order_number);
end$$;
revoke all on function place_order(jsonb,text) from public,anon,authenticated;
grant execute on function place_order(jsonb,text) to service_role;

import fs from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const products=JSON.parse(await fs.readFile('scripts/import-selection.json','utf8'));
const stock=[5,4,5];
const copy=['Rechargeable warmth designed for comfortable period-pain relief.','A playful cat backpack with a built-in meow sound.','Wide-neck baby bottles in practical sizes and cheerful designs.'];
const checked=({data,error})=>{if(error)throw Error(error.message);return data};
const before=checked(await db.from('products').select('*'));
await fs.writeFile('scripts/products-before-import.json',JSON.stringify(before,null,2));
const ids=[];
for(const [i,p] of products.entries()){
  const category=checked(await db.from('categories').upsert({name:p.category,slug:p.category.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),active:true},{onConflict:'slug'}).select('id').single());
  const product=checked(await db.from('products').upsert({name:p.name,slug:p.handle,short_description:copy[i],description:p.description.slice(0,10000),specifications:'',category_id:category.id,price:p.price,compare_at:p.compare_at>p.price?p.compare_at:null,sku:p.sku,stock:stock[i],status:'active',featured:i<3,bestseller:false,seo_title:p.name.slice(0,160),seo_description:copy[i]},{onConflict:'slug'}).select('id').single());
  ids.push(product.id);
  const existing=checked(await db.from('product_images').select('url').eq('product_id',product.id));
  const images=p.images.filter(url=>!existing.some(e=>e.url===url)).map((url,position)=>({product_id:product.id,url,alt:p.name,position}));
  if(images.length)checked(await db.from('product_images').insert(images));
}
for(const old of before.filter(p=>!ids.includes(p.id)))checked(await db.from('products').update({status:'archived'}).eq('id',old.id));
const settings=checked(await db.from('store_settings').select('value').eq('id',1).single());
await fs.writeFile('scripts/settings-before-import.json',JSON.stringify(settings.value,null,2));
checked(await db.from('store_settings').update({value:{...settings.value,announcement:'Fresh finds for comfort, care and everyday joy.',hero_title:'WARM COMFORT',hero_copy:'Rechargeable relief, ready when you need it.',hero_image:products[0].images[0],hero_link:'/products/'+products[0].handle,poster_title:'Featured pick',poster_eyebrow:'PLAYFUL EVERYDAY',poster_headline:'CAT BACKPACK',poster_image:products[1].images[0],poster_link:'/products/'+products[1].handle}}).eq('id',1));
console.log(JSON.stringify(checked(await db.from('products').select('name,price,stock').eq('status','active')),null,2));

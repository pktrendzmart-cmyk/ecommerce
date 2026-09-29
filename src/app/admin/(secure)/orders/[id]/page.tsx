import {notFound} from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {requireAdmin} from '@/lib/db';
import {money,canTransition,statuses} from '@/lib/model';
import {StatusEditor} from '@/components/admin';

type Item={id:string;product_id:string|null;name:string;sku:string;quantity:number;price:number};
type History={id:string;status:string;created_at:string;changed_by:string|null};
type ProductImage={product_id:string;url:string;alt:string;position:number};

export default async function Order({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const db=await requireAdmin();
  const [{data:o,error},{data:items,error:itemError},{data:history,error:historyError}]=await Promise.all([
    db.from('orders').select('*').eq('id',id).maybeSingle(),
    db.from('order_items').select('*').eq('order_id',id),
    db.from('order_status_history').select('*').eq('order_id',id).order('created_at'),
  ]);
  if(error||itemError||historyError||!o)notFound();
  const productIds=[...new Set((items as Item[]).map(item=>item.product_id).filter((value):value is string=>Boolean(value)))];
  const {data:images}=productIds.length?await db.from('product_images').select('product_id,url,alt,position').in('product_id',productIds).order('position'):{data:[]};
  const productImages=(images||[]) as ProductImage[];
  return <div className="stack"><Link href="/admin/orders">← All orders</Link><h1>Manage order</h1><p className="break-all">{o.order_number} · <strong>{o.status}</strong></p><div className="checkout-grid"><div className="panel stack"><h2>Items ordered</h2>{(items as Item[]).map(item=>{const image=productImages.find(media=>media.product_id===item.product_id&&!media.url.match(/\.(mp4|webm)(\?|$)/i));return <div className="row between order-admin-item" key={item.id}><div className="row">{image&&<Image unoptimized src={image.url} alt={image.alt} width={64} height={64}/>}<div><strong>{item.name}</strong><p className="muted">{item.sku} · Quantity {item.quantity}</p></div></div><span>{money(item.price*item.quantity,o.currency)}</span></div>})}<div className="row between"><span>Subtotal</span><span>{money(o.subtotal,o.currency)}</span></div><div className="row between"><span>Shipping</span><span>{money(o.shipping,o.currency)}</span></div><div className="row between"><strong>Cash due</strong><strong>{money(o.total,o.currency)}</strong></div></div><div className="panel stack"><h2>Delivery</h2><p>{o.name}<br/>{o.phone}<br/>{o.email}</p><p className="break-words">{o.address}<br/>{o.city}, {o.region}<br/>{o.landmark}</p><p>Notes: {o.notes||'None'}</p></div></div>{statuses.some(status=>canTransition(o.status,status))&&<div className="panel"><StatusEditor id={id} status={o.status}/></div>}<div className="panel stack"><h2>Status history</h2>{(history as History[]).map(entry=><p key={entry.id}>{entry.status} · {new Date(entry.created_at).toLocaleString()}<span className="muted block break-all">{entry.changed_by?'Administrator '+entry.changed_by:'Order placed by customer'}</span></p>)}</div></div>;
}

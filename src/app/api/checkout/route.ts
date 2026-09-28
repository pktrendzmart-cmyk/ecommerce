import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {checkoutSchema,money} from '@/lib/model';
import {privileged} from '@/lib/db';
import {hash,rate,sameOrigin} from '@/lib/security';
import {sendOrderWhatsApp} from '@/lib/whatsapp';
export async function POST(request:Request){try{await sameOrigin();const raw=await request.json();const p=checkoutSchema.parse(raw);p.phone=p.phone.replace(/[\s()-]/g,'');await rate('checkout',p.phone,10);if(typeof raw.receipt!=='string'||!/^[a-f0-9]{64}$/.test(raw.receipt))throw new Error('Invalid checkout session. Reload and retry.');const {data,error}=await privileged().rpc('place_order',{p,p_receipt_hash:hash(raw.receipt)});if(error){console.error('Checkout RPC failed',error.code);return NextResponse.json({error:'Your order could not be confirmed. Please retry shortly.',rejected:true},{status:400});}(await cookies()).set('receipt_'+data.order_number,raw.receipt,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/order-confirmation',maxAge:86400});const {data:order}=await privileged().from('orders').select('phone,total,currency').eq('order_number',data.order_number).single();if(order)await sendOrderWhatsApp({phone:order.phone,orderNumber:data.order_number,total:money(order.total,order.currency),trackingUrl:`${process.env.SITE_URL||new URL(request.url).origin}/track`}).catch(()=>false);return NextResponse.json(data);}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Order could not be placed. Please retry.'},{status:400});}}


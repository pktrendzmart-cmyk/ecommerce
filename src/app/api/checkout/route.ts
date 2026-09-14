import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {checkoutSchema} from '@/lib/model';
import {privileged} from '@/lib/db';
import {hash,rate,sameOrigin} from '@/lib/security';
export async function POST(request:Request){try{await sameOrigin();const raw=await request.json();const p=checkoutSchema.parse(raw);p.phone=p.phone.replace(/[\s()-]/g,'');await rate('checkout',p.phone,10);if(typeof raw.receipt!=='string'||!/^[a-f0-9]{64}$/.test(raw.receipt))throw new Error('Invalid checkout session. Reload and retry.');const {data,error}=await privileged().rpc('place_order',{p,p_receipt_hash:hash(raw.receipt)});if(error)return NextResponse.json({error:error.message,rejected:true},{status:400});(await cookies()).set('receipt_'+data.order_number,raw.receipt,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/order-confirmation',maxAge:86400});return NextResponse.json(data);}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Order could not be placed. Please retry.'},{status:400});}}


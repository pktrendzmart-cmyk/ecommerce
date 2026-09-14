import 'server-only';
import {createHash,createHmac} from 'crypto';
import {headers} from 'next/headers';
import {privileged} from './db';
export const hash=(s:string)=>createHash('sha256').update(s).digest('hex');
export async function rate(scope:string,identity:string,limit=8){const secret=process.env.RATE_LIMIT_SECRET;if(!secret)throw new Error('Request protection is not configured.');const key=createHmac('sha256',secret).update(scope+':'+identity).digest('hex');const {data,error}=await privileged().rpc('consume_rate',{p_key:key,p_limit:limit,p_seconds:900});if(error)throw new Error('Request protection is unavailable. Retry shortly.');if(!data)throw new Error('Too many attempts. Please try again in 15 minutes.');}
export async function sameOrigin(){const h=await headers();const origin=h.get('origin');if(!origin||origin!==new URL(process.env.SITE_URL||'http://localhost:3000').origin)throw new Error('Invalid request origin.');}

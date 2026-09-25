import 'server-only';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {cache} from 'react';
import {defaults,type Settings} from './model';
export const configured=()=>!!(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
export async function db(){if(!configured())throw new Error('Store connection is not configured.');const jar=await cookies();return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{cookies:{getAll:()=>jar.getAll(),setAll(values){try{values.forEach(({name,value,options})=>jar.set(name,value,options));}catch{ /* Server components cannot refresh cookies; proxy handles refresh. */ }}}});}
export function privileged(){if(!process.env.SUPABASE_SERVICE_ROLE_KEY)throw new Error('Order service is not configured.');return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});}
export async function isAdmin(){if(!configured())return false;const client=await db();const {data:{user}}=await client.auth.getUser();if(!user)return false;const {data}=await client.from('profiles').select('role').eq('id',user.id).single();return data?.role==='admin';}
export async function requireAdmin(){if(!await isAdmin())redirect('/admin/login');return db();}
function unreachable(error:unknown){return error&&typeof error==='object'&&'message'in error&&String(error.message).includes('fetch failed');}
async function resilient<T>(query:()=>PromiseLike<{data:T;error:unknown}>){let result=await query();for(let attempt=1;result.error&&attempt<3;attempt++){await new Promise(resolve=>setTimeout(resolve,150*attempt));result=await query();}return result;}
export const settings=cache(async():Promise<Settings>=>{if(!configured())return defaults;const client=await db();const {data,error}=await resilient(()=>client.from('store_settings').select('value').eq('id',1).single());if(error){if(unreachable(error))return defaults;throw new Error('Settings could not be loaded. Please retry.');}return {...defaults,...data?.value};});
export async function catalog(){if(!configured())return [];const client=await db();const {data,error}=await resilient(()=>client.from('products').select('*,product_images(*),product_variants(*)').eq('status','active').order('created_at',{ascending:false}));if(error)throw new Error('The collection could not be loaded. Please retry.');return data??[];}
export async function categories(){if(!configured())return [];const client=await db();const {data,error}=await resilient(()=>client.from('categories').select('*').eq('active',true).order('position'));if(error)throw new Error('Collections could not be loaded.');return data??[];}

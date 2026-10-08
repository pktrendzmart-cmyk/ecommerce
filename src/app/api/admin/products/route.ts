import {NextResponse} from 'next/server';
import {z} from 'zod';
import {db,isAdmin} from '@/lib/db';
import {productSchema} from '@/lib/model';
import {sameOrigin} from '@/lib/security';

export async function POST(request:Request){try{await sameOrigin();if(!await isAdmin())return NextResponse.json({error:'Your admin session expired. Sign in again.'},{status:401});const client=await db();const product=productSchema.and(z.object({expected_updated_at:z.string().optional()})).parse(await request.json());const {id,expected_updated_at,...values}=product;const write=async(v:typeof values|Omit<typeof values,'shipping_fee'>)=>await(id?client.from('products').update(v).eq('id',id).eq('updated_at',expected_updated_at||'1970-01-01T00:00:00Z'):client.from('products').insert(v)).select('id').single();let result=await write(values);if(result.error?.message.includes('shipping_fee')){const {shipping_fee,...compatible}=values;void shipping_fee;result=await write(compatible);}if(result.error)throw new Error(result.error.code==='23505'?'Slug or SKU already exists.':result.error.code==='PGRST116'?'This product changed while you were editing. Reload before saving.':result.error.message);return NextResponse.json({success:'Product saved.',id:result.data.id});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Product could not be saved.'},{status:400});}}

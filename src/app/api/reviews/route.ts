import {NextResponse} from 'next/server';
import {reviewSchema} from '@/lib/model';
import {privileged} from '@/lib/db';
import {rate,sameOrigin} from '@/lib/security';

export async function POST(request:Request){try{await sameOrigin();const review=reviewSchema.parse(await request.json());await rate('review',review.product_id+':'+review.name.toLowerCase(),3);const client=privileged();const entry={...review,id:crypto.randomUUID(),created_at:new Date().toISOString()};const {error}=await client.from('product_reviews').insert(entry);if(error){const {data:settings,error:readError}=await client.from('store_settings').select('value').eq('id',1).single();if(readError)throw readError;const current=Array.isArray(settings.value?.product_reviews)?settings.value.product_reviews:[];const {error:writeError}=await client.from('store_settings').update({value:{...settings.value,product_reviews:[entry,...current].slice(0,500)}}).eq('id',1);if(writeError)throw writeError;}return NextResponse.json({ok:true});}catch(error){console.error('Review submission failed',error);return NextResponse.json({error:'Review could not be submitted. Please retry.'},{status:400});}}

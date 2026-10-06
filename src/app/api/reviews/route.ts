import {NextResponse} from 'next/server';
import {reviewSchema} from '@/lib/model';
import {privileged} from '@/lib/db';
import {rate,sameOrigin} from '@/lib/security';

export async function POST(request:Request){try{await sameOrigin();const review=reviewSchema.parse(await request.json());await rate('review',review.product_id+':'+review.name.toLowerCase(),3);const {error}=await privileged().from('product_reviews').insert(review);if(error)throw new Error('Review could not be submitted.');return NextResponse.json({ok:true});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Review could not be submitted.'},{status:400});}}

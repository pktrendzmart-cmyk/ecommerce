import fs from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';

const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const assets={
  'vintage-t9-rechargeable-hair-trimmer':'vintage-t9-trimmer-hd.png',
  'automatic-electric-water-blaster-toy':'electric-water-blaster-hd.png',
  'dancing-talking-cactus-toy':'dancing-cactus-hd.png',
  '5-in-1-rechargeable-blackhead-remover':'blackhead-remover-hd.png',
  'nova-2-in-1-hair-straightener-curler':'nova-styler-hd.png',
  '2-in-1-electric-straightener-brush':'straightener-brush-hd.png',
};
const ok=({data,error})=>{if(error)throw error;return data};
for(const [slug,file] of Object.entries(assets)){
  const product=ok(await db.from('products').select('id,name').eq('slug',slug).single());
  const path='products/hd/'+file;
  const upload=await db.storage.from('product-media').upload(path,await fs.readFile('public/imported/ad-products/'+file),{contentType:'image/png',upsert:true});if(upload.error)throw upload.error;
  const url=db.storage.from('product-media').getPublicUrl(path).data.publicUrl;
  ok(await db.from('product_images').delete().eq('product_id',product.id));
  ok(await db.from('product_images').insert({product_id:product.id,url,alt:product.name,position:0}));
}
const settings=ok(await db.from('store_settings').select('value').eq('id',1).single());
ok(await db.from('store_settings').update({value:{...settings.value,brand_name:'PK Trendz Mart',announcement:'Smart finds, delivered across Pakistan.'}}).eq('id',1));
console.log('Brand name and six HD product images updated');

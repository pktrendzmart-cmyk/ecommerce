import fs from 'node:fs/promises';
import {createClient} from '@supabase/supabase-js';
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}});
const {data,error}=await db.from('store_settings').select('value').eq('id',1).single();if(error)throw error;
await fs.writeFile('scripts/settings-before-poster.json',JSON.stringify(data.value,null,2));
const assets={};
for(const [key,file] of Object.entries({hero:'heating-pad-hero-v2.png',poster:'cat-backpack-poster-v2.png'})){
  const path='campaigns/'+file;
  const upload=await db.storage.from('product-media').upload(path,await fs.readFile('public/'+file),{contentType:'image/png',upsert:true});if(upload.error)throw upload.error;
  assets[key]=db.storage.from('product-media').getPublicUrl(path).data.publicUrl;
}
const saved=await db.from('store_settings').update({value:{...data.value,hero_image:assets.hero,hero_title:'SOOTHING WARMTH',hero_copy:'Comfort that moves with you.',hero_link:'/products/rechargeable-electric-heating-pad-for-period-pain-relief-heated-waist-belly-belt-for-women-girls',poster_image:assets.poster,poster_title:'Best seller',poster_eyebrow:'PLAYFUL EVERYDAY',poster_headline:'CAT BACKPACK',poster_link:'/products/🐱-cute-cat-backpack-with-built-in-meow-sound-🔊'}}).eq('id',1);if(saved.error)throw saved.error;
console.log('Banner settings saved.');

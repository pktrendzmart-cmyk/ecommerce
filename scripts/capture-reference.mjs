import {chromium} from 'playwright';
import fs from 'node:fs/promises';
await fs.mkdir('design-reference',{recursive:true});
const browser=await chromium.launch({channel:'msedge'});
for(const [name,width,height] of [['desktop',1440,1100],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  await page.goto('https://bahriastores.com/',{waitUntil:'networkidle',timeout:90000});
  for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=Math.floor(height*.7)){await page.evaluate(v=>scrollTo(0,v),y);await page.waitForTimeout(350)}
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(500);
  await page.screenshot({path:`design-reference/bahria-${name}-top.png`});
  await page.evaluate(v=>scrollTo(0,v),height*.8);await page.waitForTimeout(400);
  await page.screenshot({path:`design-reference/bahria-${name}-products.png`});
}
await browser.close();

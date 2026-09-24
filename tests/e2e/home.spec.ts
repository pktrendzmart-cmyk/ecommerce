import {test,expect} from '@playwright/test';

for(const width of [375,430,768,1024,1440]){
  test(`campaign homepage fits ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    await expect(page.locator('.campaign-hero h1')).toBeVisible();
    await expect(page.getByRole('link',{name:'Store home'})).toBeVisible();
    await expect(page.getByRole('heading',{name:'Latest products'})).toBeVisible();
    await expect(page.locator('.category-mosaic a')).toHaveCount(3);
    await expect(page.locator('.home-trust')).toBeVisible();
    await expect(page.locator('.store-footer')).toBeVisible();
    await expect(page.locator('.feature-card')).toHaveCount(0);
    await expect(page.locator('.arrival-card')).toHaveCount(8);
    await expect(page.getByText('Demo product',{exact:true})).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    await page.locator('.campaign-main img').evaluate((img:HTMLImageElement)=>img.decode());
    await page.screenshot({path:`test-results/redesign-${width}.png`,fullPage:true});
    await page.getByRole('link',{name:'Shop featured product'}).click();
    await expect(page).toHaveURL(/\/products\//);
  });
}
test('product card opens its matching product',async({page})=>{
  await page.goto('/');
  const card=page.locator('.arrival-card').first();
  const title=(await card.locator('h3').textContent())!.trim();
  await card.getByRole('link',{name:'View product',exact:true}).click();
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible({timeout:30000});
});

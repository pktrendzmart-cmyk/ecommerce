import {test,expect} from '@playwright/test';

for(const width of [375,430,768,1024,1440]){
  test(`campaign homepage fits ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    await expect(page.locator('.tech-banner h1')).toBeVisible();
    await expect(page.getByRole('heading',{name:'New arrivals'})).toBeVisible();
    await expect(page.locator('.explore-now svg')).toHaveCount(0);
    await expect(page.locator('.tech-home .trust')).toHaveCount(0);
    await expect(page.locator('.store-footer')).toBeVisible();
    await expect(page.locator('.feature-card')).toHaveCount(0);
    await expect(page.locator('.bestseller-poster')).toBeVisible();
    await expect(page.locator('.poster-link')).toHaveAttribute('href','/products/rgb-flame-humidifier-and-aroma-diffuser');
    await expect(page.locator('.arrival-card')).toHaveCount(6);
    await expect(page.getByText('Demo product',{exact:true})).toHaveCount(0);
    expect(await page.locator('.arrival-grid').evaluate(el=>getComputedStyle(el).scrollbarWidth)).toBe('none');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    await page.locator('.bestseller-poster img').evaluate((img:HTMLImageElement)=>img.decode());
    await page.screenshot({path:`test-results/redesign-${width}.png`,fullPage:true});
    await page.getByRole('link',{name:'Explore now'}).click();
    await expect(page).toHaveURL(/\/products\/rgb-flame-humidifier-and-aroma-diffuser$/);
    await expect(page.getByRole('heading',{name:'RGB Flame Humidifier and Aroma Diffuser'})).toBeVisible({timeout:30000});
    await expect(page.locator('.addly-button').first()).toBeEnabled();
  });
}
test('product card opens its matching product',async({page})=>{
  await page.goto('/');
  const card=page.locator('.arrival-card').first();
  const title=(await card.locator('h3').textContent())!.trim();
  await card.getByRole('link',{name:'Buy now',exact:true}).click();
  await expect(page.getByRole('heading',{name:title,exact:true})).toBeVisible({timeout:30000});
});

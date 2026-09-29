import type {Metadata} from 'next';
import {Footer} from '@/components/footer';
import './globals.css';
import {settings} from '@/lib/db';
import {Header} from '@/components/store';
import {GoogleAds} from '@/components/google-ads';
import {MetaPixel} from '@/components/meta-pixel';
export async function generateMetadata():Promise<Metadata>{const s=await settings();const title=s.brand_name||'PK Trendz Mart';const description='Shop useful beauty, grooming and family products with cash on delivery across Pakistan.';return {metadataBase:new URL(process.env.SITE_URL||'http://localhost:3000'),title:{default:title,template:`%s | ${title}`},description,keywords:['online shopping Pakistan','cash on delivery Pakistan','beauty products','grooming products','kids toys'],alternates:{canonical:'/'},icons:s.favicon?{icon:s.favicon}:undefined,openGraph:{title,description,type:'website',siteName:title,locale:s.locale.replace('-','_'),images:s.hero_image?[{url:s.hero_image,alt:title}]:undefined},twitter:{card:'summary_large_image',title,description,images:s.hero_image?[s.hero_image]:undefined},robots:{index:true,follow:true}};}
export default async function Layout({children}:{children:React.ReactNode}){const s=await settings();const jsonLd={'@context':'https://schema.org','@type':'OnlineStore',name:s.brand_name||'PK Trendz Mart',url:process.env.SITE_URL||'http://localhost:3000',email:s.support_email||undefined,telephone:s.support_phone||undefined};return <html lang={s.locale.split('-')[0]}><body><GoogleAds/><MetaPixel/><a className="skip" href="#main">Skip to content</a><Header settings={s}/><main id="main">{children}</main><Footer settings={s}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,'\\u003c')}}/></body></html>;}

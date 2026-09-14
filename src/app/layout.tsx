import type {Metadata} from 'next';
import {Footer} from '@/components/footer';
import './globals.css';
import {settings} from '@/lib/db';
import {Header} from '@/components/store';
export async function generateMetadata():Promise<Metadata>{const s=await settings();return {metadataBase:new URL(process.env.SITE_URL||'http://localhost:3000'),title:{default:s.brand_name||'The collection',template:`%s | ${s.brand_name||'The collection'}`},description:s.hero_copy,icons:s.favicon?{icon:s.favicon}:undefined,openGraph:{title:s.brand_name||'The collection',description:s.hero_copy,type:'website'}};}
export default async function Layout({children}:{children:React.ReactNode}){const s=await settings();return <html lang={s.locale.split('-')[0]}><body><a className="skip" href="#main">Skip to content</a><Header settings={s}/><main id="main">{children}</main><Footer settings={s}/></body></html>;}

import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{return {rules:{userAgent:'*',allow:'/',disallow:['/admin','/api','/checkout','/cart','/track','/order-confirmation']},sitemap:(process.env.SITE_URL||'http://localhost:3000')+'/sitemap.xml'};}

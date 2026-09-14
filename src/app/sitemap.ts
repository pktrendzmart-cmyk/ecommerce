import type {MetadataRoute} from 'next';
import {catalog,categories} from '@/lib/db';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const base=process.env.SITE_URL||'http://localhost:3000';const [products,collections]=await Promise.all([catalog(),categories()]);return ['','/shop','/collections','/about','/contact','/faq','/shipping-returns','/privacy','/terms',...products.map(p=>'/products/'+p.slug),...collections.map(c=>'/collections/'+c.slug)].map(path=>({url:base+path}));}

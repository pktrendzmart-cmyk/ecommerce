import {notFound} from 'next/navigation';
import {categories} from '@/lib/db';
import {Catalog} from '@/components/catalog';
export default async function Collection({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<Record<string,string>>}){const {slug}=await params;const category=(await categories()).find(c=>c.slug===slug);if(!category)notFound();return <><div className="wrap page-head"><h1>{category.name}</h1><p>{category.description}</p></div><Catalog category={category} query={await searchParams}/></>;}

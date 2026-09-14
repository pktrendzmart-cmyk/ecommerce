import {Catalog} from '@/components/catalog';
export const metadata={title:'Shop',alternates:{canonical:'/shop'}};
export default async function Shop({searchParams}:{searchParams:Promise<Record<string,string>>}){return <><div className="wrap page-head"><p className="eyebrow">Made for discovery</p><h1>All products</h1><p>A considered selection, ready to become part of your everyday.</p></div><Catalog query={await searchParams}/></>;}

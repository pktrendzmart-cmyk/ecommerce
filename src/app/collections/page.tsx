import Link from 'next/link';
import {categories} from '@/lib/db';
import {Empty} from '@/components/store';
export const metadata={title:'Collections',alternates:{canonical:'/collections'}};
export default async function Collections(){const cats=await categories();return <div className="wrap section stack"><h1>Collections</h1>{cats.length?<div className="product-grid">{cats.map(c=><Link className="panel stack" key={c.id} href={'/collections/'+c.slug}><h2>{c.name}</h2><p>{c.description}</p><span>Explore ↗</span></Link>)}</div>:<Empty/>}</div>;}

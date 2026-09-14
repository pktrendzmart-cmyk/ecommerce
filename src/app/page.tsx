import Image from 'next/image';
import Link from 'next/link';
import {ShoppingCart} from 'lucide-react';
import {catalog,settings} from '@/lib/db';
import {money} from '@/lib/model';

export default async function Home(){
  const [s,products]=await Promise.all([settings(),catalog()]);
  return <div className="home-redesign tech-home">
    <section className="tech-banner wrap" aria-label="Featured collection">
      <Image unoptimized src={s.hero_image||'/humidifier-banner.png'} alt={s.hero_title} fill priority sizes="100vw"/>
      <div className="tech-banner-copy"><h1>{s.hero_title}</h1><p>{s.hero_copy}</p></div>
      <Link className="explore-now" href={s.hero_link.startsWith('/products/')?s.hero_link:'/shop'}>Explore now</Link>
    </section>
    <section className="arrival-section wrap" aria-labelledby="arrivals-title">
      <div className="section-heading"><h2 id="arrivals-title">New arrivals</h2><Link className="arrival-view-all" href="/shop">View all</Link></div>
      <div className="arrival-grid">{products.slice(0,8).map(p=>{
        const href='/products/'+p.slug;
        return <article className="arrival-card" key={p.id}>
          <Link href={href} className="arrival-image" aria-label={'View '+p.name}>{p.product_images[0]?<Image unoptimized src={p.product_images[0].url} alt={p.name} fill sizes="(max-width:767px) 75vw, 25vw"/>:<span>Image coming soon</span>}</Link>
          <div className="arrival-info"><span className="arrival-badge">New arrival</span><Link href={href}><h3>{p.name}</h3></Link><p className="arrival-description">{p.short_description}</p>
          <div className="arrival-meta"><span>{p.stock>0?'In stock':'Currently unavailable'}</span></div>
          <div className="arrival-price"><div><strong>{money(p.price,s.currency)}</strong>{p.compare_at&&<del>{money(p.compare_at,s.currency)}</del>}</div><Link className="arrival-buy" href={href}><ShoppingCart size={16}/>Buy now</Link></div></div>
        </article>;
      })}</div>
    </section>
    {s.poster_image&&<section className="bestseller-poster wrap" aria-label={s.poster_title}>
      <Image unoptimized src={s.poster_image} alt={s.poster_headline} fill sizes="100vw"/>
      <h2 className="poster-label">{s.poster_title}</h2>
      <div className="poster-copy"><p>{s.poster_eyebrow}</p><h3>{s.poster_headline}</h3><Link className="poster-link" href={s.poster_link.startsWith('/products/')?s.poster_link:'/shop'}>Explore product</Link></div>
    </section>}
  </div>;
}

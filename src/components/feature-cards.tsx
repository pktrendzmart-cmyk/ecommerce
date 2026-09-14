import Image from 'next/image';
import Link from 'next/link';
import type {Product} from '@/lib/model';

export function FeatureCards({products}:{products:Product[]}){return <section className="feature-cards wrap" aria-label="Explore featured products">{products.map(product=><Link key={product.id} className="feature-card real-feature" href={'/products/'+product.slug} aria-label={'Explore '+product.name}>{product.product_images[0]&&<Image unoptimized src={product.product_images[0].url} alt={product.name} fill sizes="(max-width:767px) 100vw, 33vw"/>}<div className="feature-card-copy"><span>Everyday essentials</span><h2>{product.name}</h2><span className="feature-card-cta">Explore product</span></div></Link>)}</section>}

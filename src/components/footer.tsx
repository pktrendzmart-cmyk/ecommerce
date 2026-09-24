import Image from 'next/image';
import Link from 'next/link';
import {Mail,Phone} from 'lucide-react';
import type {Settings} from '@/lib/model';

export function Footer({settings:s}:{settings:Settings}){
  return <footer className="store-footer">
    <div className="store-footer-grid">
      <div><h2>Shop</h2><nav aria-label="Footer shop"><Link href="/shop">All products</Link><Link href="/collections/beauty-care">Beauty & care</Link><Link href="/collections/kids-toys">Kids & toys</Link><Link href="/collections/grooming">Grooming</Link></nav></div>
      <div><h2>Company</h2><nav aria-label="Footer company"><Link href="/about">About us</Link><Link href="/contact">Contact us</Link><Link href="/privacy">Privacy policy</Link><Link href="/terms">Terms and conditions</Link></nav></div>
      <div><h2>Care</h2><nav aria-label="Footer care"><Link href="/track">Track your order</Link><Link href="/faq">Frequently asked questions</Link><Link href="/shipping-returns">Shipping & returns</Link><Link href="/contact">Customer support</Link></nav></div>
      <div className="store-footer-contact"><Link className="wordmark brand-logo footer-logo" href="/"><Image unoptimized src={s.logo||'/pk-trendz-mart-logo.svg'} alt={s.brand_name||'PK Trendz Mart'} width={220} height={48}/></Link><h3>We’re here to help.</h3>{s.support_phone&&<a href={'tel:'+s.support_phone.replace(/[^+\d]/g,'')}><Phone size={21} aria-hidden="true"/><span>Call us: {s.support_phone}</span></a>}{s.support_email&&<a href={'mailto:'+s.support_email}><Mail size={21} aria-hidden="true"/><span>Email us: {s.support_email}</span></a>}<p>Questions about a product or your order? Get in touch with our team.</p><Link className="footer-contact-link" href="/contact">Contact us</Link></div>
    </div>
    <div className="store-footer-bottom"><span>© {new Date().getFullYear()} {s.brand_name||'The collection'}</span><span>Cash on delivery</span></div>
  </footer>;
}

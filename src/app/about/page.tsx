import type {Metadata} from 'next';
import Image from 'next/image';
import {PackageCheck,ShieldCheck,Truck} from 'lucide-react';

export const metadata:Metadata={title:'Our Story',description:'Discover PK Trendz Mart—thoughtfully selected everyday products with cash on delivery and nationwide delivery across Pakistan.',alternates:{canonical:'/about'}};

export default function About(){return <div className="about-page">
  <section className="about-editorial wrap">
    <div className="about-title"><p className="eyebrow">Our story</p><h1>Naveed Zafar</h1><p className="about-subtitle">(Founder, PK Trendz Mart)</p></div>
    <div className="about-intro"><p>We bring useful, joyful and affordable products together in one focused collection for everyday life in Pakistan.</p><p>Every item is selected to make shopping feel clearer, easier and more dependable—from discovering a product to receiving it at your door.</p></div>
    <div className="about-logo-card about-portrait"><Image unoptimized src="/naveed-zafar.jpg" alt="Naveed Zafar, founder of PK Trendz Mart" fill priority sizes="(max-width:767px) 88vw, 34vw"/></div>
  </section>
  <section className="about-story wrap"><div><p className="eyebrow">Why we started</p><h2>Online shopping should feel simple and trustworthy.</h2></div><div><p>We built PK Trendz Mart around clear product information, fair pricing and a checkout that respects your time. Our current collection focuses on personal care, grooming and playful family finds.</p><p>Orders use cash on delivery, stock is checked securely during checkout, and every order receives a private tracking reference.</p></div></section>
  <section className="about-values wrap" aria-label="Our commitments"><div><ShieldCheck/><h3>Carefully selected</h3><p>A focused catalog with useful details and clear pricing.</p></div><div><Truck/><h3>Delivered nationwide</h3><p>Serving customers across Pakistan with delivery updates.</p></div><div><PackageCheck/><h3>Secure ordering</h3><p>Protected checkout and private order tracking.</p></div></section>
</div>}

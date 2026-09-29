/* eslint-disable @next/next/no-img-element */
'use client';
import Script from 'next/script';
import {usePathname} from 'next/navigation';
import {useEffect,useRef} from 'react';

declare global{interface Window{fbq?:(...args:unknown[])=>void;_fbq?:unknown}}
export const metaEvent=(name:string,data?:Record<string,unknown>)=>window.fbq?.('track',name,data);

export function MetaPixel(){const id=process.env.NEXT_PUBLIC_META_PIXEL_ID;const pathname=usePathname();const first=useRef(true);useEffect(()=>{if(first.current){first.current=false;return;}if(id)metaEvent('PageView');},[id,pathname]);if(!id)return null;return <><Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`}</Script><noscript><img height="1" width="1" style={{display:'none'}} src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`} alt=""/></noscript></>}
export function MetaViewContent({id,name,value,currency}:{id:string;name:string;value:number;currency:string}){useEffect(()=>metaEvent('ViewContent',{content_ids:[id],content_name:name,content_type:'product',value:value/100,currency}),[id,name,value,currency]);return null;}
export function MetaCheckout({value,currency,items}:{value:number;currency:string;items:number}){useEffect(()=>metaEvent('InitiateCheckout',{value:value/100,currency,num_items:items}),[value,currency,items]);return null;}
export function MetaPurchase({order,value,currency}:{order:string;value:number;currency:string}){useEffect(()=>{const key='meta-purchase-'+order;if(sessionStorage.getItem(key))return;metaEvent('Purchase',{value:value/100,currency,order_id:order});sessionStorage.setItem(key,'1');},[order,value,currency]);return null;}

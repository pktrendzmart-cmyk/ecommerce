'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <div className="wrap section narrow stack"><h1>Let’s try that again.</h1><p role="alert">We couldn’t load this page. Your saved bag is still here.</p><button className="button" onClick={reset}>Retry</button></div>;}

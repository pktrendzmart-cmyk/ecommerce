import {settings} from '@/lib/db';
import {Checkout} from '@/components/checkout';
export const metadata={title:'Checkout',robots:{index:false}};
export default async function CheckoutPage(){return <div className="wrap section stack"><div><p className="eyebrow">A few details, then it’s yours</p><h1 className="mt-3">Checkout</h1></div><Checkout settings={await settings()}/></div>;}

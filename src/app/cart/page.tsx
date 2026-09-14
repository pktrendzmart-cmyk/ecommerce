import {CartContent} from '@/components/store';
import {settings} from '@/lib/db';
export const metadata={title:'Your bag',robots:{index:false}};
export default async function Cart(){const s=await settings();return <div className="wrap narrow section stack"><h1>Your bag</h1><CartContent currency={s.currency}/></div>;}

import {LoginForm} from '@/components/admin';
import {configured,isAdmin} from '@/lib/db';
import {redirect} from 'next/navigation';
export const metadata={title:'Administrator sign in',robots:{index:false,follow:false}};
export default async function Login(){if(await isAdmin())redirect('/admin');return <div className="wrap narrow section stack"><p className="eyebrow">Store administration</p><h1>Welcome back.</h1><p className="muted">Sign in with your authorized administrator account.</p><LoginForm configured={configured()}/></div>;}

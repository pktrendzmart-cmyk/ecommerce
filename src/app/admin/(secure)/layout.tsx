import Link from 'next/link';
import {requireAdmin} from '@/lib/db';
import {logout} from '../actions';
import {Drawer} from '@/components/store';
export const metadata={robots:{index:false,follow:false}};
export default async function AdminLayout({children}:{children:React.ReactNode}){await requireAdmin();const navigation=<><nav aria-label="Administration">{[['','Overview'],['/products','Products'],['/categories','Categories'],['/orders','Orders'],['/settings','Settings']].map(([path,title])=><Link key={path} href={'/admin'+path}>{title}</Link>)}</nav><form action={logout}><button className="text-button mt-8">Sign out</button></form></>;return <div className="admin-shell"><aside className="admin-nav desktop"><p className="eyebrow text-white mb-6">Store workspace</p>{navigation}</aside><div className="mobile admin-mobile"><Drawer label="Store workspace" trigger={<button className="text-button">Open admin navigation</button>}><div className="stack text-ink">{navigation}</div></Drawer></div><div className="admin-main">{children}</div></div>;}

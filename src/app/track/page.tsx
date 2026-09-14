import {TrackingForm} from '@/components/tracking';
export const metadata={title:'Track your order',robots:{index:false}};
export default function Track(){return <div className="wrap narrow section stack"><p className="eyebrow">From us to you</p><h1>Follow your order.</h1><p className="muted">Enter your order number and the mobile number you used at checkout.</p><TrackingForm/></div>;}

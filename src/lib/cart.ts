'use client';
import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {CartLine} from './model';
type Cart={items:CartLine[];open:boolean;setOpen:(open:boolean)=>void;add:(item:CartLine)=>void;quantity:(index:number,quantity:number)=>void;clear:()=>void};
export const useCart=create<Cart>()(persist((set)=>({items:[],open:false,setOpen:open=>set({open}),add:item=>set(s=>{const index=s.items.findIndex(i=>i.product_id===item.product_id&&i.variant_id===item.variant_id);const items=[...s.items];if(index<0)items.push(item);else items[index]={...item,quantity:Math.min(99,items[index].quantity+item.quantity)};return{items,open:true};}),quantity:(index,quantity)=>set(s=>({items:s.items.flatMap((i,n)=>n!==index?[i]:quantity>0?[{...i,quantity:Math.min(99,quantity)}]:[])})),clear:()=>set({items:[]})}),{name:'store-cart-v1',partialize:s=>({items:s.items}),skipHydration:true}));

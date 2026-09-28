import 'server-only';

const cleanPhone=(phone:string)=>{const digits=phone.replace(/\D/g,'');return digits.startsWith('0')?'92'+digits.slice(1):digits;};

export async function sendOrderWhatsApp(order:{phone:string;orderNumber:string;total:string;trackingUrl:string}){
  const token=process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId=process.env.WHATSAPP_PHONE_NUMBER_ID;
  if(!token||!phoneId)return false;
  const response=await fetch(`https://graph.facebook.com/${process.env.WHATSAPP_GRAPH_API_VERSION||'v23.0'}/${phoneId}/messages`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',to:cleanPhone(order.phone),type:'template',template:{name:process.env.WHATSAPP_ORDER_TEMPLATE||'order_confirmation',language:{code:process.env.WHATSAPP_TEMPLATE_LANGUAGE||'en'},components:[{type:'body',parameters:[order.orderNumber,order.total,order.trackingUrl].map(text=>({type:'text',text}))}]}}),cache:'no-store',signal:AbortSignal.timeout(5000)});
  if(!response.ok)console.error('WhatsApp order confirmation failed',response.status);
  return response.ok;
}

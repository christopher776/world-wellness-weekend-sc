import { NextResponse } from "next/server";
import { claimMarketplaceItem, fetchMarketplaceItems } from "@/lib/marketplace";
import { marketplacePrice } from "@/lib/marketplace-pricing";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { itemId?: string; name?: string; email?: string; phone?: string; accepted?: boolean; website?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 }); }
  if (body.website?.trim()) return NextResponse.json({ ok: true });
  const itemId=body.itemId?.trim()||"";const name=body.name?.trim()||"";const email=body.email?.trim()||"";const phone=body.phone?.trim()||"";
  if(!itemId||!name||!email||!phone||!body.accepted)return NextResponse.json({ok:false,error:"Name, email, mobile number and purchase agreement are required."},{status:400});
  if(!/^\S+@\S+\.\S+$/.test(email))return NextResponse.json({ok:false,error:"Enter a valid email address."},{status:400});
  if(phone.replace(/\D/g,"").length<10)return NextResponse.json({ok:false,error:"Enter a valid mobile number."},{status:400});
  try{
    const items=await fetchMarketplaceItems({publishedOnly:true});const item=items.find(candidate=>candidate.ID===itemId);
    if(!item)return NextResponse.json({ok:false,error:"This marketplace item is no longer available."},{status:404});
    const pricing=marketplacePrice(item);if(!pricing.started)return NextResponse.json({ok:false,error:"This price drop has not started yet."},{status:409});if(pricing.ended)return NextResponse.json({ok:false,error:"This price drop has ended."},{status:409});
    const result=await claimMarketplaceItem(item,{name,email,phone});if(!result.ok)return NextResponse.json(result,{status:409});
    return NextResponse.json({ok:true,orderId:result.orderId,price:result.price,remaining:result.remaining,message:"Reserved at the locked price pending payment. SC Wellness Weekend will send secure payment and fulfillment instructions."});
  }catch(error){return NextResponse.json({ok:false,error:error instanceof Error?error.message:"Could not reserve this item."},{status:502});}
}

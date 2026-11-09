
import { createClient } from 'npm:@supabase/supabase-js@2.119.0';
const url = Deno.env.get("SUPABASE_URL")!;
const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const sb = createClient(url,secret,{auth:{autoRefreshToken:false,persistSession:false}});
const json=(obj:unknown,status=200,origin="*")=> new Response(JSON.stringify(obj),{status,headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Access-Control-Allow-Origin":origin,"Vary":"Origin","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"content-type, apikey, authorization, x-client-info"}});
const valid=(v:unknown,max:number)=> typeof v==="string" && v.trim().length<=max ? v.trim() : "";
const hash=async (value:string)=> Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(secret + "|" + value)))).map(x=>x.toString(16).padStart(2,"0")).join("");
const validBirthDate=(s:string)=>{
 if(!/^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/.test(s)) return false;
 if (s < "1800-01-01" || s > "2026-11-01") return false;
 const [year,month,day]=s.split("-").map(Number);
 const d=new Date(Date.UTC(year,month-1,day));
 return d.getUTCFullYear()===year && d.getUTCMonth()+1===month && d.getUTCDate()===day;
};
Deno.serve(async req => {
 const origin=req.headers.get("origin")||"*";
 const allowed=origin==="*" || origin.startsWith("http://localhost:") || /^https:\/\/suivi-colis-test-[a-z0-9-]+\.vercel\.app$/.test(origin) || /^https:\/\/suivi-colis-projet-corrige2(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);
 if(!allowed) return json({error:"Origine non autorisée."},403,"null");
 if(req.method==="OPTIONS") return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"content-type, apikey, authorization, x-client-info","Access-Control-Allow-Methods":"POST, OPTIONS"}});
 if(req.method!=="POST") return json({error:"Méthode non autorisée."},405,origin);
 const raw=await req.text();
 if(raw.length>4096) return json({error:"Requête trop volumineuse."},413,origin);
 let payload:Record<string,unknown>;
 try{payload=JSON.parse(raw);}catch{return json({error:"JSON invalide."},400,origin);}
 const ip=(req.headers.get("cf-connecting-ip")||req.headers.get("x-real-ip")||"unknown").trim();
 try{
  if(payload.kind==="delete"){
   const id=valid(payload.id,36);
   const token=valid(payload.token,100);
   if(!/^[0-9a-f-]{36}$/i.test(id) || token.length<40) return json({error:"Référence de suppression invalide."},400,origin);
   const tokenHash=await hash(token);
   const {data,error}=await sb.from("tracking_submissions").delete().eq("id",id).eq("delete_token_hash",tokenHash).select("id");
   if(error) throw error;
   return json({deleted:(data||[]).length>0},200,origin);
  }
  const limitKey=await hash(ip);
  const {data:permitted,error:limitError}=await sb.rpc("consume_demo_rate_limit",{p_hash:limitKey});
  if(limitError) throw limitError;
  if(!permitted) return json({error:"Trop de demandes de test. Réessayez dans une heure."},429,origin);
  if(payload.kind!=="submit"||payload.demo!==true||payload.consent!==true||payload.fictional_data!==true) return json({error:"Test fictif et consentement requis."},400,origin);
  const tracking_number=valid(payload.tracking_number,32).toUpperCase();
  const postal_code=valid(payload.postal_code,5);
  const full_name=valid(payload.full_name,100);
  const address=valid(payload.address,200);
  const city=valid(payload.city,100);
  const phone=valid(payload.phone,20);
  const email=valid(payload.email,200).toLowerCase();
  if(!/^[A-Z0-9_-]{5,32}$/.test(tracking_number)|| !/^\d{5}$/.test(postal_code)
   ||full_name.length<2||address.length<5|| (payload.city!==undefined && city.length<2)|| !/^[+0-9().\s-]{8,20}$/.test(phone)
   || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
    return json({error:"Certains champs ne sont pas valides."},422,origin);
  const birth_date=valid(payload.birth_date,10);
  if (!validBirthDate(birth_date)) return json({error:"Date de naissance invalide."},422,origin);
  const token=crypto.randomUUID()+"-"+crypto.randomUUID();
  const delete_token_hash=await hash(token);
  const {data,error}=await sb.from("tracking_submissions").insert({tracking_number,postal_code,full_name,address,city:city||null,phone,email,birth_date,status:"test",consent_version:"demo-fictional-dob-v1",delete_token_hash}).select("id,created_at").single();
  if(error) throw error;
  return json({id:data.id,created_at:data.created_at,delete_token:token},201,origin);
 }catch(error){
  console.error("demo-endpoint failure",error instanceof Error?error.message:"unknown");
  return json({error:"Enregistrement indisponible. Réessayez."},503,origin);
 }
});

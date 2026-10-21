import Landing from '@/components/Landing';
import { fallbackSite, fallbackServices } from '@/lib/config';
import { getDb } from '@/lib/db';
export const dynamic='force-dynamic';

async function siteData(){
 const sql=getDb();
 if(!sql)return {site:fallbackSite,services:fallbackServices,testimonials:[],faqs:[]};
 try{
  const [s,v,t,f]=await Promise.all([
   sql`SELECT * FROM cf_site WHERE id='main' LIMIT 1`,
   sql`SELECT * FROM cf_services WHERE is_published=TRUE ORDER BY position`,
   sql`SELECT * FROM cf_testimonials WHERE is_published=TRUE AND permission_confirmed=TRUE ORDER BY position`,
   sql`SELECT * FROM cf_faqs WHERE is_published=TRUE ORDER BY position`
  ]);
  return {site:s[0]||fallbackSite,services:v,testimonials:t,faqs:f};
 }catch(err){
  console.error('Neon site data unavailable',err?.code||'not-ready');
  return {site:fallbackSite,services:fallbackServices,testimonials:[],faqs:[]};
 }
}
export async function generateMetadata(){
 const {site:s}=await siteData();
 return {title:s.seo_title||s.brand,description:s.seo_description,openGraph:{title:s.seo_title||s.brand,description:s.seo_description,type:'website'},robots:{index:true,follow:true}};
}
export default async function Home(){
 const data=await siteData();
 return <Landing {...data}/>;
}

import { createClient } from '@supabase/supabase-js';
import Landing from '@/components/Landing';
import { configured, PROJECT_URL, PUBLISHABLE_KEY, fallbackSite, fallbackServices } from '@/lib/config';
export const dynamic='force-dynamic';
export default async function Home(){
  let site=fallbackSite, services=fallbackServices, testimonials=[], faqs=[];
  if(configured){
    try {
      const db=createClient(PROJECT_URL,PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
      const [s,v,t,f]=await Promise.all([
        db.from('cf_site').select('*').eq('id','main').maybeSingle(),
        db.from('cf_services').select('*').eq('is_published',true).order('position'),
        db.from('cf_testimonials').select('*').eq('is_published',true).eq('permission_confirmed',true).order('position'),
        db.from('cf_faqs').select('*').eq('is_published',true).order('position')
      ]);
      if(s.data) site=s.data;
      if(v.data?.length) services=v.data;
      if(t.data) testimonials=t.data;
      if(f.data) faqs=f.data;
    } catch { /* fallback until DB is connected */ }
  }
  return <Landing site={site} services={services} testimonials={testimonials} faqs={faqs}/>;
}

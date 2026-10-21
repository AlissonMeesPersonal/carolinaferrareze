import 'server-only';
import { neon } from '@neondatabase/serverless';

export function getDb() {
 const uri=process.env.DATABASE_URL;
 if(!uri) return null;
 return neon(uri);
}
export function requireDb(){
 const sql=getDb();
 if(!sql) throw new Error('DATABASE_NOT_CONFIGURED');
 return sql;
}
export async function rateLimit(sql,bucket,maximum,windowMinutes=15) {
 const [row]=await sql.query(`INSERT INTO cf_request_limits (bucket,window_start,hits)
 VALUES ($1, to_timestamp(floor(extract(epoch from now())/($2::integer * 60))*($2::integer * 60)),1)
 ON CONFLICT(bucket,window_start) DO UPDATE SET hits=cf_request_limits.hits+1
 RETURNING hits`,[bucket,windowMinutes]);
 return row.hits<=maximum;
}

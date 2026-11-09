import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error('Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans Vercel/.env');
}

export const sb = createClient(url, key, { auth: { autoRefreshToken: true, persistSession: true } });
export const edgeUrl = `${url.replace(/\/$/, '')}/functions/v1/demo-submission-dob-test`;
export const storageUrl = (path: string) => `${url.replace(/\/$/, '')}/storage/v1/object/public/site-logos/${path.split('/').map(encodeURIComponent).join('/')}`;

export type SiteSettings = { id: boolean; logo_path: string | null; logo_width: number; updated_at?: string };
export type Submission = {
  id: string; tracking_number: string; postal_code: string;
  full_name: string; address: string; city: string | null; phone: string; email: string; birth_date: string | null;
  created_at: string; status: string; consent_version: string;
};

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || localStorage.getItem('tg_supabase_url');
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || localStorage.getItem('tg_supabase_key');

  if (!url || !key) return null;

  try {
    supabaseInstance = createClient(url, key);
    return supabaseInstance;
  } catch (e) {
    console.error('Failed to init Supabase:', e);
    return null;
  }
};

export const resetSupabase = () => {
  supabaseInstance = null;
};

export const syncProfileToCloud = async (profile: any) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('profiles')
    .upsert({ 
      id: profile.id || 'usr_' + Date.now(), 
      name: profile.name,
      phone: profile.phone,
      updated_at: new Date().toISOString()
    })
    .select();

  if (error) throw error;
  return data;
};

export const syncVehiclesToCloud = async (vehicles: any[]) => {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('vehicles')
    .upsert(vehicles.map(v => ({ ...v, updated_at: new Date().toISOString() })))
    .select();

  if (error) throw error;
  return data;
};

export const fetchCloudData = async () => {
  const client = getSupabase();
  if (!client) return null;

  const [profileRes, vehiclesRes] = await Promise.all([
    client.from('profiles').select('*').limit(1).single(),
    client.from('vehicles').select('*')
  ]);

  return {
    profile: profileRes.data,
    vehicles: vehiclesRes.data
  };
};

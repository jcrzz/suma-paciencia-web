export const env = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ?? '',
  WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER ?? '5493442000000',
  CONTACT_EMAIL: import.meta.env.VITE_CONTACT_EMAIL ?? 'contacto@sumapaciencia.com.ar',
  ALIAS_TRANSFERENCIA: import.meta.env.VITE_ALIAS_TRANSFERENCIA ?? 'SUMA.PACIENCIA.MERCADO.PAGO',
  DEMO_ADMIN_EMAIL: import.meta.env.VITE_DEMO_ADMIN_EMAIL ?? 'admin@sumapaciencia.com',
  DEMO_ADMIN_PASSWORD: import.meta.env.VITE_DEMO_ADMIN_PASSWORD ?? 'suma2026',
  MP_ENABLED: import.meta.env.VITE_MP_ENABLED === 'true',
  MP_PREFERENCE_ENDPOINT: import.meta.env.VITE_MP_PREFERENCE_ENDPOINT ?? '/api/create-preference',
  SITE_NAME: 'Suma Paciencia',
};

export const isSupabaseConfigured = Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY && !env.SUPABASE_URL.includes('your-'));
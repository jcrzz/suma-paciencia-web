import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env, isSupabaseConfigured } from '@/lib/config';

/**
 * Cliente de Supabase.
 *
 * - Con credenciales en `.env` apunta al proyecto real.
 * - Sin credenciales devuelve un stub: la app cae automaticamente en modo demo
 *   (datos en localStorage) y nunca rompe el render.
 */
function createSupabaseClient(): SupabaseClient {
  if (isSupabaseConfigured) {
    return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }

  const notConfigured = async () => ({ data: [], error: null }) as never;
  const stub = {
    from: () => ({
      select: () => ({ order: () => notConfigured() }),
      insert: () => ({ select: () => ({ single: () => notConfigured() }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: () => notConfigured() }) }) }),
      delete: () => ({ eq: () => notConfigured() }),
      eq: () => ({ order: () => notConfigured() }),
      order: () => notConfigured(),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ error: null }),
        remove: async () => ({ error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: path } }),
      }),
    },
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => undefined } } }),
      signInWithPassword: async () => ({ data: { user: null }, error: { message: 'Supabase no configurado' } }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
    },
    rpc: async () => ({ data: null, error: { message: 'Supabase no configurado' } }),
  };

  return stub as unknown as SupabaseClient;
}

export const supabase: SupabaseClient = createSupabaseClient();
export { isSupabaseConfigured };

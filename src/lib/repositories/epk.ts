import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getDemoState, updateDemo } from '@/lib/demo-store';
import type { EpkInfo } from '@/types';

export async function getEpkInfo(): Promise<EpkInfo> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('epk_info').select('*').eq('id', 1).single();
    if (error) throw error;
    return data as EpkInfo;
  }
  return getDemoState().epk;
}

export async function updateEpkInfo(input: Partial<EpkInfo>): Promise<EpkInfo> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('epk_info')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', 1)
      .select()
      .single();
    if (error) throw error;
    return data as EpkInfo;
  }
  let updated: EpkInfo = getDemoState().epk;
  updateDemo((draft) => {
    draft.epk = { ...draft.epk, ...input, updated_at: new Date().toISOString() };
    updated = draft.epk;
  });
  return updated;
}

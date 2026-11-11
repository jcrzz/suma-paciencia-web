import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getDemoState, updateDemo } from '@/lib/demo-store';
import type { Show, ShowStatus } from '@/types';

export type ShowInput = {
  show_date: string;
  city: string;
  venue: string;
  province: string;
  country?: string | null;
  ticket_url?: string | null;
  status: ShowStatus;
  is_published: boolean;
};

export async function getPublishedShows(): Promise<Show[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .eq('is_published', true)
      .order('show_date', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Show[];
  }
  return getDemoState()
    .shows.filter((s) => s.is_published)
    .sort((a, b) => a.show_date.localeCompare(b.show_date));
}

export async function getAllShows(): Promise<Show[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .order('show_date', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Show[];
  }
  return [...getDemoState().shows].sort((a, b) => b.show_date.localeCompare(a.show_date));
}

export async function createShow(input: ShowInput): Promise<Show> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase.from('shows').insert(input).select().single();
    if (error) throw error;
    return data as Show;
  }
  const now = new Date().toISOString();
  const show: Show = {
    id: crypto.randomUUID(),
    ...input,
    country: input.country ?? 'Argentina',
    ticket_url: input.ticket_url ?? null,
    created_at: now,
    updated_at: now,
  };
  updateDemo((draft) => {
    draft.shows.push(show);
  });
  return show;
}

export async function updateShow(id: string, input: Partial<ShowInput>): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('shows')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return;
  }
  updateDemo((draft) => {
    const show = draft.shows.find((s) => s.id === id);
    if (show) Object.assign(show, input, { updated_at: new Date().toISOString() });
  });
}

export async function deleteShow(id: string): Promise<void> {
  if (isSupabaseConfigured) {
    const { error } = await supabase.from('shows').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  updateDemo((draft) => {
    draft.shows = draft.shows.filter((s) => s.id !== id);
  });
}

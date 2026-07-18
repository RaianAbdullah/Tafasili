import { Session } from '../types';
import { isSupabaseConfigured, supabase } from './supabase';

type SessionRow = {
  id: number;
  user_id?: string | null;
  activity: string;
  start_time: string;
  end_time: string;
  duration: string;
  duration_seconds: number | null;
  session_date: string;
  details: Session['details'] | null;
};

const toSession = (row: SessionRow): Session => ({
  id: row.id,
  activity: row.activity,
  start: row.start_time,
  end: row.end_time,
  duration: row.duration,
  durationSeconds: row.duration_seconds ?? undefined,
  date: row.session_date,
  details: row.details ?? undefined,
});

const toRow = (session: Session) => ({
  id: session.id,
  activity: session.activity,
  start_time: session.start,
  end_time: session.end,
  duration: session.duration,
  duration_seconds: session.durationSeconds ?? null,
  session_date: session.date,
  details: session.details ?? null,
});

const getCurrentUserId = async () => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user?.id ?? null;
};

export const loadCloudSessions = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('activity_sessions')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as SessionRow[]).map(toSession);
};

export const saveCloudSession = async (session: Session) => {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error('Sign in before saving cloud history.');
  }

  const { error } = await supabase
    .from('activity_sessions')
    .upsert({
      ...toRow(session),
      user_id: userId,
    }, { onConflict: 'user_id,id' });

  if (error) {
    throw error;
  }
};

export const deleteCloudSession = async (sessionId: number) => {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const { error } = await supabase
    .from('activity_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    throw error;
  }
};

export const clearCloudSessions = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const { error } = await supabase
    .from('activity_sessions')
    .delete()
    .gte('id', 0);

  if (error) {
    throw error;
  }
};

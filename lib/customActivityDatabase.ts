import { isSupabaseConfigured, supabase } from './supabase';

export type CloudCustomActivity = {
  name: string;
  category: string;
  fields: string[];
};

type CustomActivityRow = {
  name: string;
  category: string;
  fields: unknown;
};

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

const normalizeFields = (fields: unknown): string[] => {
  if (!Array.isArray(fields)) {
    return [];
  }

  return fields.filter((field): field is string => typeof field === 'string');
};

export const loadCloudCustomActivities = async (): Promise<CloudCustomActivity[] | null> => {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('custom_activities')
    .select('name,category,fields')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data as CustomActivityRow[]).map((row) => ({
    name: row.name,
    category: row.category,
    fields: normalizeFields(row.fields),
  }));
};

export const saveCloudCustomActivity = async (activity: CloudCustomActivity) => {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error('Sign in before saving a cloud activity.');
  }

  const { error } = await supabase
    .from('custom_activities')
    .upsert(
      {
        user_id: userId,
        name: activity.name,
        category: activity.category,
        fields: activity.fields,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,name' }
    );

  if (error) {
    throw error;
  }
};

export const deleteCloudCustomActivity = async (name: string) => {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return;
  }

  const { error } = await supabase
    .from('custom_activities')
    .delete()
    .eq('user_id', userId)
    .eq('name', name);

  if (error) {
    throw error;
  }
};

export const clearCloudCustomActivities = async () => {
  if (!isSupabaseConfigured || !supabase) {
    return;
  }

  const userId = await getCurrentUserId();

  if (!userId) {
    return;
  }

  const { error } = await supabase
    .from('custom_activities')
    .delete()
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
};

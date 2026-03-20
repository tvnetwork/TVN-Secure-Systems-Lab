import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface AdminState {
  theme: string;
  setTheme: (theme: string) => void;
  loadTheme: () => Promise<void>;
}

export const useAdminThemeStore = create<AdminState>((set) => ({
  theme: 'blue',
  setTheme: async (theme) => {
    set({ theme });
    // Optimistically update, optionally persist to Supabase
    const { data: adminSettings } = await supabase.from('admin_settings').select('id').limit(1).single();
    if (adminSettings) {
      await supabase.from('admin_settings').update({ theme }).eq('id', adminSettings.id);
    } else {
        await supabase.from('admin_settings').insert({ theme });
    }
  },
  loadTheme: async () => {
    const { data } = await supabase.from('admin_settings').select('theme').limit(1).single();
    if (data?.theme) {
      set({ theme: data.theme });
    }
  }
}));

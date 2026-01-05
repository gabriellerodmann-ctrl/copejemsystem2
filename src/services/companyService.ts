import { supabase } from '../lib/supabase';
import type { Company } from '../types';

export const CompanyService = {
    getAll: async (): Promise<Company[]> => {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    create: async (company: Omit<Company, 'id' | 'createdAt'>): Promise<Company> => {
        const { data, error } = await supabase
            .from('companies')
            .insert([company])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    getById: async (id: string): Promise<Company | undefined> => {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return undefined;
        return data;
    },

    update: async (id: string, updatedData: Partial<Company>): Promise<void> => {
        const { error } = await supabase
            .from('companies')
            .update(updatedData)
            .eq('id', id);

        if (error) throw error;
    }
};


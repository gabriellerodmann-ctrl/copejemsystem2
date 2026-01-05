import { supabase } from '../lib/supabase';
import type { Project } from '../types';

export const ProjectService = {
    getAll: async (): Promise<Project[]> => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    getById: async (id: string): Promise<Project | undefined> => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return undefined;
        return data;
    },

    create: async (project: Omit<Project, 'id'>): Promise<Project> => {
        const { data, error } = await supabase
            .from('projects')
            .insert([project])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    update: async (id: string, updatedData: Partial<Project>): Promise<void> => {
        const { error } = await supabase
            .from('projects')
            .update(updatedData)
            .eq('id', id);

        if (error) throw error;
    },

    delete: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};


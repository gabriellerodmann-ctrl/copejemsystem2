import { supabase } from '../lib/supabase';
import type { Member } from '../types';

export const MemberService = {
    getAll: async (): Promise<Member[]> => {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    },

    getById: async (id: string): Promise<Member | undefined> => {
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return undefined;
        return data;
    },

    create: async (member: Omit<Member, 'id'>): Promise<Member> => {
        const { data, error } = await supabase
            .from('members')
            .insert([member])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    update: async (id: string, updatedData: Partial<Member>): Promise<void> => {
        const { error } = await supabase
            .from('members')
            .update(updatedData)
            .eq('id', id);

        if (error) throw error;
    },

    delete: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('members')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    authenticate: async (emailOrCpf: string, password: string): Promise<Member | null> => {
        // NOTE: This is NOT secure production authentication. 
        // Ideally we should use supabase.auth.signInWithPassword.
        // For now, we mimic the existing logic checking columns.
        const { data, error } = await supabase
            .from('members')
            .select('*')
            .or(`email.eq.${emailOrCpf},cpf.eq.${emailOrCpf}`)
            .eq('password', password)
            .maybeSingle();

        if (error) {
            console.error('Auth check failed', error);
            return null;
        }
        return data;
    }
};


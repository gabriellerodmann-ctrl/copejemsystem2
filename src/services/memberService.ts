import type { Member } from '../types';

const STORAGE_KEY = 'copejem_members';

const INITIAL_DATA: Member[] = [
    email: 'email@makework.tech',
    password: 'Teste@123',
    cpf: '000.000.000-00',
    status: 'active',
    admissionYear: 2024,
    avatarUrl: 'https://ui-avatars.com/api/?name=Gabrielle+Elias&background=purple&color=fff'
    }
];

export const MemberService = {
    getAll: (): Member[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
            return INITIAL_DATA;
        }
        let parsedData = JSON.parse(data);

        // Ensure test user exists (for dev convenience)
        if (!parsedData.find((m: Member) => m.email === 'email@makework.tech')) {
            const testUser = INITIAL_DATA.find(m => m.email === 'email@makework.tech');
            if (testUser) {
                parsedData.push(testUser);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
            }
        }

        // Migration: Ensure status exists if coming from legacy data
        return parsedData.map((m: any) => ({
            ...m,
            status: m.status || (m.active ? 'active' : 'inactive')
        }));
    },

    getById: (id: string): Member | undefined => {
        return MemberService.getAll().find(m => m.id === id);
    },

    create: (member: Omit<Member, 'id'>): Member => {
        const members = MemberService.getAll();
        const newMember: Member = {
            ...member,
            id: crypto.randomUUID()
        };
        members.push(newMember);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
        return newMember;
    },

    update: (id: string, updates: Partial<Member>): Member => {
        const members = MemberService.getAll();
        const index = members.findIndex(m => m.id === id);
        if (index === -1) throw new Error('Member not found');

        const updatedMember = { ...members[index], ...updates };
        members[index] = updatedMember;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
        return updatedMember;
    },

    login: (identifier: string, password: string): Member | null => {
        const members = MemberService.getAll();
        const member = members.find(m =>
            (m.email === identifier || m.cpf === identifier) && m.password === password
        );
        return member || null;
    }
};

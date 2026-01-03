import type { Member } from '../types';

const STORAGE_KEY = 'copejem_members';

const INITIAL_DATA: Member[] = [
    {
        id: '1',
        name: 'Gabrielle Rodmann Elias',
        companyName: 'MakeWork',
        role: 'Conselheiro',
        email: 'gabrielle@makework.tech',
        phone: '44998034088',
        status: 'active',
        admissionYear: 2024,
        avatarUrl: 'https://ui-avatars.com/api/?name=Gabrielle+Elias&background=random',
        cpf: '08662655971',
        password: '123',
        isAdmin: true
    }
];

export const MemberService = {
    getAll: (): Member[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
            return INITIAL_DATA;
        }
        return JSON.parse(data);
    },

    getById: (id: string): Member | undefined => {
        const members = MemberService.getAll();
        return members.find(m => m.id === id);
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

    update: (id: string, updatedData: Partial<Member>): void => {
        const members = MemberService.getAll();
        const index = members.findIndex(m => m.id === id);
        if (index !== -1) {
            members[index] = { ...members[index], ...updatedData };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
        }
    },

    delete: (id: string): void => {
        const members = MemberService.getAll();
        const filtered = members.filter(m => m.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    authenticate: (emailOrCpf: string, password: string): Member | null => {
        const members = MemberService.getAll();
        return members.find(m =>
            (m.email === emailOrCpf || m.cpf === emailOrCpf) && m.password === password
        ) || null;
    }
};

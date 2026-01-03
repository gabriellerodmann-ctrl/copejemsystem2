import type { Company } from '../types';

const STORAGE_KEY = 'copejem_companies';

const INITIAL_DATA: Company[] = [
    {
        id: '1',
        name: 'MakeWork',
        cnpj: '',
        industry: 'Tecnologia',
        createdAt: new Date().toISOString()
    }
];

export const CompanyService = {
    getAll: (): Company[] => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
            return INITIAL_DATA;
        }
        return JSON.parse(data);
    },

    create: (company: Omit<Company, 'id' | 'createdAt'>): Company => {
        const companies = CompanyService.getAll();
        const newCompany: Company = {
            ...company,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        };
        companies.push(newCompany);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
        return newCompany;
    },

    getById: (id: string): Company | undefined => {
        const companies = CompanyService.getAll();
        return companies.find(c => c.id === id);
    },

    update: (id: string, updatedData: Partial<Company>): void => {
        const companies = CompanyService.getAll();
        const index = companies.findIndex(c => c.id === id);
        if (index !== -1) {
            companies[index] = { ...companies[index], ...updatedData };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
        }
    }
};

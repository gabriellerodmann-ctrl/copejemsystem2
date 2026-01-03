import type { Project } from '../types';

const STORAGE_KEY = 'copejem_projects';

// Mock initial data
const INITIAL_DATA: Project[] = [
    {
        id: '1',
        year: 2024,
        name: 'Copejem Day',
        coordinatorId: '101',
        coordinatorName: 'João Silva',
        eventDate: '2024-05-15',
        planningStartDate: '2024-02-01',
        planningEndDate: '2024-05-01',
        teamMembers: ['Ana', 'Carlos', 'Beatriz'],
        description: 'Um dia de imersão e networking para jovens empresários.',
        status: 'COMPLETED',
        type: 'EVENT',
        targetAudience: ['YOUNG_ENTREPRENEURS', 'COPEJEM_MEMBERS'],
        partners: [
            { name: 'ACIM', type: 'ACIM' },
            { name: 'Sicredi', type: 'SPONSOR' }
        ],
        results: {
            participantsCount: 150,
            estimatedReach: 500,
            satisfactionScore: 4.8,
            satisfactionFeedback: 'Excelente feedback sobre os palestrantes'
        },
        createdBy: 'admin',
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-05-20T10:00:00Z',
    },
    {
        id: '2',
        year: 2024,
        name: 'Feirão do Imposto',
        coordinatorId: '102',
        coordinatorName: 'Maria Souza',
        eventDate: '2024-09-20',
        planningStartDate: '2024-06-01',
        planningEndDate: '2024-09-10',
        teamMembers: ['João', 'Pedro'],
        description: 'Ação de conscientização tributária.',
        status: 'EXECUTING',
        type: 'INSTITUTIONAL_ACTION',
        targetAudience: ['EXTERNAL_PUBLIC'],
        partners: [],
        createdBy: 'admin',
        createdAt: '2024-05-01T09:00:00Z',
        updatedAt: '2024-05-01T09:00:00Z',
    }
];

export const ProjectService = {
    getAll: (): Project[] => {
        const data = loc(STORAGE_KEY);
        if (!data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
            return INITIAL_DATA;
        }
        return JSON.parse(data);
    },

    getById: (id: string): Project | undefined => {
        const projects = ProjectService.getAll();
        return projects.find(p => p.id === id);
    },

    create: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Project => {
        const projects = ProjectService.getAll();
        const newProject: Project = {
            ...project,
            id: crypto.randomUUID(),
            createdBy: 'currentUser', // Mock user
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        projects.push(newProject);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        return newProject;
    },

    update: (id: string, updates: Partial<Project>): Project => {
        const projects = ProjectService.getAll();
        const index = projects.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Project not found');

        // Immutable History Logic Check (Simulated)
        const project = projects[index];
        const currentYear = new Date().getFullYear();
        // Allow editing if it's the current year OR if we are 'admin' (mocked bypass)
        // In a real app, strict backend rules would apply.
        if (project.year < currentYear) {
            console.warn("Editing past year project - logging this action for audit.");
        }

        const updatedProject = { ...project, ...updates, updatedAt: new Date().toISOString() };
        projects[index] = updatedProject;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        return updatedProject;
    },

    delete: (id: string): void => {
        const projects = ProjectService.getAll();
        const project = projects.find(p => p.id === id);
        if (project && project.year < new Date().getFullYear()) {
            throw new Error("Cannot delete projects from previous years. Institutional memory must be preserved.");
        }

        const newProjects = projects.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    }
};

function loc(key: string): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
}

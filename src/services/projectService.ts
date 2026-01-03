import type { Project } from '../types';

const STORAGE_KEY = 'copejem_projects';

const INITIAL_DATA: Project[] = [];

export const ProjectService = {
    getAll: (): Project[] => {
        const data = localStorage.getItem(STORAGE_KEY);
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

    create: (project: Omit<Project, 'id'>): Project => {
        const projects = ProjectService.getAll();
        const newProject: Project = {
            ...project,
            id: crypto.randomUUID()
        };
        projects.push(newProject);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        return newProject;
    },

    update: (id: string, updatedData: Partial<Project>): void => {
        const projects = ProjectService.getAll();
        const index = projects.findIndex(p => p.id === id);
        if (index !== -1) {
            projects[index] = { ...projects[index], ...updatedData };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
        }
    },

    delete: (id: string): void => {
        const projects = ProjectService.getAll();
        const filtered = projects.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
};

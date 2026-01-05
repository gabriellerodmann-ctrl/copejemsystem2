import { useState, useEffect } from 'react';
import { ProjectService } from '../../services/projectService';
import type { Project, ProjectStatus, ProjectType } from '../../types';
import { Badge } from '../../components/ui/Badge';
import { Plus, Calendar, Users, Target, ArrowRight, Search } from 'lucide-react';

const STATUS_MAP: Record<ProjectStatus, { label: string, variant: 'default' | 'success' | 'warning' | 'error' | 'secondary' }> = {
    'PLANNED': { label: 'Planejado', variant: 'secondary' },
    'EXECUTING': { label: 'Em Execução', variant: 'warning' },
    'COMPLETED': { label: 'Concluído', variant: 'success' },
    'CANCELLED': { label: 'Cancelado', variant: 'error' },
};

const TYPE_MAP: Record<ProjectType, string> = {
    'EVENT': 'Evento',
    'TRAINING': 'Capacitação',
    'INSTITUTIONAL_ACTION': 'Ação Institucional',
    'SOCIAL_PROJECT': 'Projeto Social',
    'EXTERNAL_PARTNERSHIP': 'Parceria Externa',
};

export default function ProjectList({ onNavigate }: { onNavigate: (path: string, id?: string) => void }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await ProjectService.getAll();
            setProjects(data);
        };
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(project => {
        const matchesYear = selectedYear === 'all' || project.year === selectedYear;
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.coordinatorName.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesYear && matchesSearch;
    });

    const years = Array.from(new Set(projects.map(p => p.year))).sort((a, b) => b - a);
    if (!years.includes(new Date().getFullYear())) {
        years.unshift(new Date().getFullYear());
    }

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Projetos</h1>
                    <p className="text-gray-500 mt-1">Gerencie e preserve a história dos projetos do conselho.</p>
                </div>
                <button
                    onClick={() => onNavigate('create-project')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-all shadow-blue-200">
                    <Plus size={20} className="mr-2" />
                    Novo Projeto
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm items-center">
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome do projeto ou coordenador..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    <Calendar size={20} className="text-gray-400" />
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                        className="pl-3 pr-8 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                        <option value="all">Todos os Anos</option>
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                        Nenhum projeto encontrado para este filtro.
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <div key={project.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col overflow-hidden">

                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant={STATUS_MAP[project.status].variant as any}>
                                        {STATUS_MAP[project.status].label}
                                    </Badge>
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded">{project.year}</span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {project.name}
                                </h3>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="space-y-3 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Users size={16} className="mr-2 text-gray-400" />
                                        <span>Coord: {project.coordinatorName}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar size={16} className="mr-2 text-gray-400" />
                                        <span>{new Date(project.eventDate).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Target size={16} className="mr-2 text-gray-400" />
                                        <span>{TYPE_MAP[project.type]}</span>
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => onNavigate('edit-project', project.id)}
                                className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center group-hover:bg-blue-50/50 transition-colors cursor-pointer"
                            >
                                <span className="text-xs text-gray-500 font-medium">Ver detalhes / Editar</span>
                                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

import { useState, useEffect } from 'react';
import { ProjectService } from '../../services/projectService';
import { MemberService } from '../../services/memberService';
import type { ProjectStatus, ProjectType, Member, ProjectTask, ProjectSponsor } from '../../types';
import { ArrowLeft, Save, Trash2, Plus } from 'lucide-react';

interface CreateProjectProps {
    onNavigate: (path: string, id?: string) => void;
    projectId?: string | null;
}


export default function CreateProject({ onNavigate, projectId }: CreateProjectProps) {
    const [availableMembers, setAvailableMembers] = useState<Member[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        year: new Date().getFullYear(),
        description: '',
        status: 'PLANNED' as ProjectStatus,
        type: 'EVENT' as ProjectType,
        eventDate: new Date().toISOString().split('T')[0],
        coordinatorId: '',
        coordinatorName: '',
        teamMembers: [] as string[], // Changed to array of IDs or names
        budgetPlanned: 0,
        budgetReached: 0,
        lessonsLearned: '',
        images: '', // Comma separated for mock
        files: '', // Comma separated for mock
        schedule: [] as ProjectTask[],
        sponsors: [] as ProjectSponsor[],
    });

    useEffect(() => {
        setAvailableMembers(MemberService.getAll());
    }, []);

    useEffect(() => {
        if (projectId) {
            const project = ProjectService.getById(projectId);
            if (project) {
                setFormData({
                    name: project.name,
                    year: project.year,
                    description: project.description,
                    status: project.status,
                    type: project.type,
                    eventDate: project.eventDate,
                    coordinatorId: project.coordinatorId,
                    coordinatorName: project.coordinatorName,
                    teamMembers: project.teamMembers, // Already an array of strings (names)
                    budgetPlanned: project.budgetPlanned || 0,
                    budgetReached: project.budgetReached || 0,
                    lessonsLearned: project.lessonsLearned || '',
                    images: (project.images || []).join(', '),
                    files: (project.files || []).map(f => f.url).join(', '),
                    schedule: project.schedule || [],
                    sponsors: project.sponsors || [],
                });
            }
        }
    }, [projectId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.coordinatorName) {
            alert('Por favor preencha os campos obrigatórios');
            return;
        }

        const projectData: any = {
            ...formData,
            teamMembers: formData.teamMembers, // Already array
            images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
            files: formData.files.split(',').map(s => s.trim()).filter(Boolean).map(url => ({ name: 'File', url })),
            eventDate: formData.eventDate,
            schedule: formData.schedule,
            sponsors: formData.sponsors,
        };

        try {
            if (projectId) {
                ProjectService.update(projectId, projectData);
            } else {
                ProjectService.create({
                    ...projectData,
                    coordinatorId: formData.coordinatorId || 'mock-id',
                    planningStartDate: new Date().toISOString(),
                    planningEndDate: new Date().toISOString(),
                    partners: [],
                    targetAudience: [],
                });
            }
            onNavigate('projects');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar projeto');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name === 'year' || name.startsWith('budget')) ? (value ? parseFloat(value) : 0) : value
        }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => onNavigate('projects')}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Voltar para Projetos
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h1 className="text-xl font-bold text-gray-900">{projectId ? 'Editar Projeto (Completo)' : 'Novo Projeto'}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {projectId ? 'Edição completa de todas as informações do projeto.' : 'Preencha as informações básicas para registrar um novo projeto.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Basic Info Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Informações Básicas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nome do Projeto *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Ano de Referência</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Coordenador *</label>
                                <select
                                    name="coordinatorId"
                                    value={formData.coordinatorId}
                                    onChange={(e) => {
                                        const selectedMember = availableMembers.find(m => m.id === e.target.value);
                                        setFormData(prev => ({
                                            ...prev,
                                            coordinatorId: e.target.value,
                                            coordinatorName: selectedMember ? selectedMember.name : ''
                                        }));
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                >
                                    <option value="">Selecione um coordenador...</option>
                                    {availableMembers.map(member => (
                                        <option key={member.id} value={member.id}>{member.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Equipe</label>
                                <div className="border border-gray-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 bg-gray-50/50">
                                    {availableMembers.map(member => (
                                        <label key={member.id} className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.teamMembers.includes(member.name)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        teamMembers: checked
                                                            ? [...prev.teamMembers, member.name]
                                                            : prev.teamMembers.filter(name => name !== member.name)
                                                    }));
                                                }}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 mr-2 overflow-hidden flex-shrink-0">
                                                    {member.avatarUrl && <img src={member.avatarUrl} alt="" className="w-full h-full object-cover" />}
                                                </div>
                                                <span className="text-sm text-gray-700">{member.name}</span>
                                            </div>
                                        </label>
                                    ))}
                                    {availableMembers.length === 0 && (
                                        <div className="text-sm text-gray-500 text-center py-2">
                                            Nenhum membro encontrado. Cadastre membros primeiro.
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-400">Selecione os membros que participarão deste projeto.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Data do Evento</label>
                                <input
                                    type="date"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="PLANNED">Planejado</option>
                                    <option value="EXECUTING">Em Execução</option>
                                    <option value="COMPLETED">Concluído</option>
                                    <option value="CANCELLED">Cancelado</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Tipo</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="EVENT">Evento</option>
                                    <option value="TRAINING">Capacitação</option>
                                    <option value="INSTITUTIONAL_ACTION">Ação Institucional</option>
                                    <option value="SOCIAL_PROJECT">Projeto Social</option>
                                    <option value="EXTERNAL_PARTNERSHIP">Parceria Externa</option>
                                </select>
                            </div>

                            {/* Schedule Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className="text-lg font-semibold text-gray-900">Cronograma</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newTask: ProjectTask = {
                                                id: crypto.randomUUID(),
                                                title: '',
                                                responsible: '',
                                                startDate: '',
                                                endDate: '',
                                                status: 'PENDING'
                                            };
                                            setFormData(prev => ({ ...prev, schedule: [...prev.schedule, newTask] }));
                                        }}
                                        className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 flex items-center"
                                    >
                                        <Plus size={16} className="mr-1" /> Adicionar Tarefa
                                    </button>
                                </div>

                                {formData.schedule.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">Nenhuma tarefa adicionada.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-gray-500 bg-gray-50">
                                                <tr>
                                                    <th className="p-2 rounded-tl-lg">Tarefa</th>
                                                    <th className="p-2">Responsável</th>
                                                    <th className="p-2">Início</th>
                                                    <th className="p-2">Fim</th>
                                                    <th className="p-2">Status</th>
                                                    <th className="p-2 rounded-tr-lg w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {formData.schedule.map((task, index) => (
                                                    <tr key={task.id}>
                                                        <td className="p-2">
                                                            <input
                                                                type="text"
                                                                value={task.title}
                                                                onChange={(e) => {
                                                                    const newSchedule = [...formData.schedule];
                                                                    newSchedule[index].title = e.target.value;
                                                                    setFormData(prev => ({ ...prev, schedule: newSchedule }));
                                                                }}
                                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                                                placeholder="Descrição da tarefa"
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <select
                                                                value={task.responsible}
                                                                onChange={(e) => {
                                                                    const newSchedule = [...formData.schedule];
                                                                    newSchedule[index].responsible = e.target.value;
                                                                    setFormData(prev => ({ ...prev, schedule: newSchedule }));
                                                                }}
                                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                                            >
                                                                <option value="">Selecione...</option>
                                                                {formData.teamMembers.map(member => (
                                                                    <option key={member} value={member}>{member}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="p-2">
                                                            <input
                                                                type="date"
                                                                value={task.startDate}
                                                                onChange={(e) => {
                                                                    const newSchedule = [...formData.schedule];
                                                                    newSchedule[index].startDate = e.target.value;
                                                                    setFormData(prev => ({ ...prev, schedule: newSchedule }));
                                                                }}
                                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <input
                                                                type="date"
                                                                value={task.endDate}
                                                                onChange={(e) => {
                                                                    const newSchedule = [...formData.schedule];
                                                                    newSchedule[index].endDate = e.target.value;
                                                                    setFormData(prev => ({ ...prev, schedule: newSchedule }));
                                                                }}
                                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <select
                                                                value={task.status}
                                                                onChange={(e) => {
                                                                    const newSchedule = [...formData.schedule];
                                                                    newSchedule[index].status = e.target.value as any;
                                                                    setFormData(prev => ({ ...prev, schedule: newSchedule }));
                                                                }}
                                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                                            >
                                                                <option value="PENDING">Pendente</option>
                                                                <option value="IN_PROGRESS">Em Andamento</option>
                                                                <option value="COMPLETED">Concluído</option>
                                                                <option value="CANCELLED">Cancelado</option>
                                                            </select>
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newSchedule = formData.schedule.filter(t => t.id !== task.id);
                                                                    setFormData(prev => ({ ...prev, schedule: newSchedule }));
                                                                }}
                                                                className="text-red-400 hover:text-red-600"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Sponsors Section */}
                            <div>
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <h2 className="text-lg font-semibold text-gray-900">Patrocinadores</h2>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newSponsor: ProjectSponsor = {
                                                id: crypto.randomUUID(),
                                                name: '',
                                                contact: '',
                                                value: 0,
                                                observation: ''
                                            };
                                            setFormData(prev => ({ ...prev, sponsors: [...prev.sponsors, newSponsor] }));
                                        }}
                                        className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-100 flex items-center"
                                    >
                                        <Plus size={16} className="mr-1" /> Adicionar Patrocinador
                                    </button>
                                </div>

                                {formData.sponsors.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">Nenhum patrocinador registrado.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-gray-500 bg-gray-50">
                                                <tr>
                                                    <th className="p-2 rounded-tl-lg">Patrocinador</th>
                                                    <th className="p-2">Contato</th>
                                                    <th className="p-2">Valor (R$)</th>
                                                    <th className="p-2">Observação</th>
                                                    <th className="p-2 rounded-tr-lg w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {formData.sponsors.map((sponsor, index) => (
                                                    <tr key={sponsor.id}>
                                                        <td className="p-2">
                                                            <input
                                                                type="text"
                                                                value={sponsor.name}
                                                                onChange={(e) => {
                                                                    const newSponsors = [...formData.sponsors];
                                                                    newSponsors[index].name = e.target.value;
                                                                    setFormData(prev => ({ ...prev, sponsors: newSponsors }));
                                                                }}
                                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                                                placeholder="Nome da empresa"
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <input
                                                                type="text"
                                                                value={sponsor.contact}
                                                                onChange={(e) => {
                                                                    const newSponsors = [...formData.sponsors];
                                                                    newSponsors[index].contact = e.target.value;
                                                                    setFormData(prev => ({ ...prev, sponsors: newSponsors }));
                                                                }}
                                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                                                placeholder="Nome/Telefone"
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <input
                                                                type="number"
                                                                value={sponsor.value}
                                                                onChange={(e) => {
                                                                    const newSponsors = [...formData.sponsors];
                                                                    newSponsors[index].value = parseFloat(e.target.value);
                                                                    setFormData(prev => ({ ...prev, sponsors: newSponsors }));
                                                                }}
                                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-2">
                                                            <input
                                                                type="text"
                                                                value={sponsor.observation}
                                                                onChange={(e) => {
                                                                    const newSponsors = [...formData.sponsors];
                                                                    newSponsors[index].observation = e.target.value;
                                                                    setFormData(prev => ({ ...prev, sponsors: newSponsors }));
                                                                }}
                                                                className="w-full px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-2 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newSponsors = formData.sponsors.filter(s => s.id !== sponsor.id);
                                                                    setFormData(prev => ({ ...prev, sponsors: newSponsors }));
                                                                }}
                                                                className="text-red-400 hover:text-red-600"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-gray-700">Descrição</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Financial Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Financeiro</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Orçamento Previsto (R$)</label>
                                <input
                                    type="number"
                                    name="budgetPlanned"
                                    value={formData.budgetPlanned}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Orçamento Atingido (R$)</label>
                                <input
                                    type="number"
                                    name="budgetReached"
                                    value={formData.budgetReached}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Assets & Results Section */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Anexos e Resultados</h2>
                        <div className="space-y-4">
                            <div className="space-y-4">
                                <label className="text-sm font-medium text-gray-700">Imagens do Projeto</label>

                                {/* Image Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            files.forEach(file => {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        images: prev.images ? `${prev.images},${reader.result}` : `${reader.result}`
                                                    }));
                                                };
                                                reader.readAsDataURL(file);
                                            });
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="space-y-2">
                                        <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium">Clique para fazer upload de imagens</p>
                                        <p className="text-xs text-gray-400">JPG, PNG (Max 5MB)</p>
                                    </div>
                                </div>

                                {/* Carousel Preview */}
                                {formData.images && (
                                    <div className="mt-4">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Pré-visualização</h3>
                                        <div className="relative bg-black rounded-xl overflow-hidden aspect-video group">
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <img
                                                    src={formData.images.split(',')[0]}
                                                    alt="Preview"
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            </div>

                                            {/* Simple carousel info if multiple images */}
                                            {formData.images.split(',').length > 1 && (
                                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                                    {formData.images.split(',').map((_, idx) => (
                                                        <div key={idx} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/50'}`} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Thumbnails */}
                                        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                                            {formData.images.split(',').filter(Boolean).map((img, idx) => (
                                                <div key={idx} className="w-16 h-16 flex-shrink-0 rounded-lg border border-gray-200 overflow-hidden relative group cursor-pointer">
                                                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newImages = formData.images.split(',').filter((_, i) => i !== idx).join(',');
                                                            setFormData(prev => ({ ...prev, images: newImages }));
                                                        }}
                                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Arquivos (URLs ref, separar por vírgula - PDF, DOC)</label>
                                <input
                                    type="text"
                                    name="files"
                                    value={formData.files}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="http://site.com/doc.pdf"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Lições Aprendidas (Melhoria Contínua)</label>
                                <textarea
                                    name="lessonsLearned"
                                    value={formData.lessonsLearned}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="O que funcionou bem? O que pode melhorar para o próximo ano?"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-all shadow-blue-200"
                        >
                            <Save size={20} className="mr-2" />
                            Salvar Projeto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

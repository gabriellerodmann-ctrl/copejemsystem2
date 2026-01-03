import { useState, useEffect } from 'react';
import { MemberService } from '../../services/memberService';
import { CompanyService } from '../../services/companyService';
import type { Company, Member } from '../../types';
import { ArrowLeft, Save, Building as BuildingIcon, Shield } from 'lucide-react';

interface CreateMemberProps {
    onNavigate: (path: string, id?: string) => void;
    memberId?: string | null;
}

export default function CreateMember({ onNavigate, memberId }: CreateMemberProps) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [showNewCompany, setShowNewCompany] = useState(false);
    const [currentUser, setCurrentUser] = useState<Member | null>(null);
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        password: '',
        role: 'Membro',
        admissionYear: new Date().getFullYear(),
        exitYear: '' as number | '',
        companyId: '',
        status: 'active' as 'active' | 'inactive',
        isAdmin: false,
        // For new company creation
        newCompanyName: '',
        newCompanyIndustry: ''
    });

    useEffect(() => {
        setCompanies(CompanyService.getAll());

        // Get current user for permissions
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }

        if (memberId) {
            const member = MemberService.getById(memberId);
            if (member) {
                setFormData({
                    name: member.name,
                    email: member.email,
                    phone: member.phone || '',
                    cpf: member.cpf || '',
                    password: '', // Don't load password security wise, or load but keep hidden
                    role: member.role,
                    admissionYear: member.admissionYear,
                    exitYear: member.exitYear || '',
                    companyId: member.companyId || '',
                    status: member.status,
                    isAdmin: member.isAdmin || false,
                    newCompanyName: '',
                    newCompanyIndustry: ''
                });
            }
        } else {
            // New user: show password input by default
            setShowPasswordInput(true);
        }
    }, [memberId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let finalCompanyId = formData.companyId;
            let finalCompanyName = '';

            // Handle new company creation inline if selected
            if (showNewCompany) {
                if (!formData.newCompanyName) {
                    alert('Nome da empresa é obrigatório');
                    return;
                }
                const newCompany = CompanyService.create({
                    name: formData.newCompanyName,
                    industry: formData.newCompanyIndustry
                });
                finalCompanyId = newCompany.id;
                finalCompanyName = newCompany.name;
            } else {
                const selectedCompany = companies.find(c => c.id === formData.companyId);
                if (selectedCompany) {
                    finalCompanyName = selectedCompany.name;
                }
            }

            // Prepare data. Only include password if it was changed/set
            const memberData: any = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                cpf: formData.cpf,
                role: formData.role,
                admissionYear: formData.admissionYear,
                exitYear: formData.exitYear ? Number(formData.exitYear) : undefined,
                companyId: finalCompanyId,
                companyName: finalCompanyName,
                status: formData.status,
                isAdmin: formData.isAdmin,
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
            };

            if (formData.password) {
                memberData.password = formData.password;
            } else if (!memberId) {
                alert('Senha é obrigatória para novos usuários');
                return;
            }

            if (memberId) {
                MemberService.update(memberId, memberData);
            } else {
                MemberService.create(memberData);
            }

            onNavigate('members');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar membro');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // @ts-ignore
        setFormData(prev => ({ ...prev, [name]: name === 'isAdmin' ? e.target.checked : value }));
    };

    const canChangePassword = !memberId || (currentUser?.isAdmin || currentUser?.id === memberId);
    const canSetAdmin = currentUser?.isAdmin;

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => onNavigate('members')}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Voltar para Membros
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{memberId ? 'Editar Membro' : 'Novo Membro'}</h1>
                        <p className="text-sm text-gray-500 mt-1">{memberId ? 'Atualize os dados e acesso do membro.' : 'Cadastre um novo membro e vincule a uma empresa.'}</p>
                    </div>
                    {memberId && (
                        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, status: 'active' }))}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${formData.status === 'active' ? 'bg-green-100 text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Ativo
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(p => ({ ...p, status: 'inactive' }))}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${formData.status === 'inactive' ? 'bg-red-100 text-red-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Inativo
                            </button>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-2">Dados Pessoais</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / Celular</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="000.000.000-00"
                                    required={!memberId}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ano de Admissão</label>
                                <input
                                    type="number"
                                    name="admissionYear"
                                    value={formData.admissionYear}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <div className="flex items-center mb-4">
                                <Shield size={16} className="text-gray-500 mr-2" />
                                <h3 className="text-sm font-medium text-gray-900">Segurança e Acesso</h3>
                            </div>

                            <div className="space-y-4">
                                {/* Admin Toggle */}
                                {canSetAdmin && (
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isAdmin"
                                            checked={formData.isAdmin}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Conceder privilégios de Administrador</span>
                                    </label>
                                )}

                                {/* Password Field */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700">Senha de Acesso</label>
                                        {!showPasswordInput && memberId && canChangePassword && (
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordInput(true)}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Alterar Senha
                                            </button>
                                        )}
                                    </div>

                                    {showPasswordInput ? (
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                            placeholder={memberId ? "Nova senha..." : "Definir senha..."}
                                        />
                                    ) : (
                                        <input
                                            type="password"
                                            value="********"
                                            disabled
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className="pt-4 border-t border-gray-100">
                            <h2 className="text-sm uppercase tracking-wider text-gray-400 font-semibold mb-4">Vínculo Institucional</h2>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="Membro">Membro</option>
                                    <option value="Conselheiro">Conselheiro</option>
                                    <option value="Presidente">Presidente</option>
                                    <option value="Diretor">Diretor</option>
                                    <option value="Trainee">Trainee</option>
                                </select>
                            </div>

                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-medium text-gray-700">Empresa Associada</label>
                                <button
                                    type="button"
                                    onClick={() => setShowNewCompany(!showNewCompany)}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                                >
                                    {showNewCompany ? 'Selecionar existente' : '+ Nova Empresa'}
                                </button>
                            </div>

                            {showNewCompany ? (
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-3">
                                    <div className="flex items-center text-blue-800 font-medium text-sm mb-2">
                                        <BuildingIcon size={16} className="mr-2" />
                                        Cadastrando Nova Empresa
                                    </div>
                                    <input
                                        type="text"
                                        name="newCompanyName"
                                        placeholder="Nome da Empresa"
                                        value={formData.newCompanyName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <input
                                        type="text"
                                        name="newCompanyIndustry"
                                        placeholder="Ramo de Atividade (Opcional)"
                                        value={formData.newCompanyIndustry}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            ) : (
                                <select
                                    name="companyId"
                                    value={formData.companyId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Selecione uma empresa...</option>
                                    {companies.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-all shadow-blue-200"
                        >
                            <Save size={20} className="mr-2" />
                            {memberId ? 'Atualizar Membro' : 'Criar Membro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

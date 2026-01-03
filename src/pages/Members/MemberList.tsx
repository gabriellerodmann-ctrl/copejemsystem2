import { useState, useEffect } from 'react';
import { MemberService } from '../../services/memberService';
import { CompanyService } from '../../services/companyService';
import type { Member, Company } from '../../types';
import { Plus, Search, Filter, Building, User, Mail } from 'lucide-react';

export default function MemberList({ onNavigate }: { onNavigate: (path: string, id?: string) => void }) {
    const [members, setMembers] = useState<Member[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    useEffect(() => {
        setMembers(MemberService.getAll());
        setCompanies(CompanyService.getAll());
    }, []);

    const filteredMembers = members.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCompany = selectedCompany === 'all' || member.companyId === selectedCompany;
        const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;

        return matchesSearch && matchesCompany && matchesStatus;
    });

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Membros</h1>
                    <p className="text-gray-500 mt-1">Gerencie os membros e suas empresas associadas.</p>
                </div>
                <button
                    onClick={() => onNavigate('create-member')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-all shadow-blue-200">
                    <Plus size={20} className="mr-2" />
                    Novo Membro
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex gap-4">
                    <div className="md:w-48 relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="all">Todos Status</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                        </select>
                    </div>
                    <div className="md:w-64 relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="all">Todas as Empresas</option>
                            {companies.map(company => (
                                <option key={company.id} value={company.id}>{company.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                        Nenhum membro encontrado.
                    </div>
                ) : (
                    filteredMembers.map((member) => (
                        <div key={member.id} className="relative bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-start space-x-4 hover:shadow-md transition-shadow group">
                            <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                {member.avatarUrl ? (
                                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User size={24} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-bold text-gray-900 truncate pr-2">{member.name}</h3>
                                    <span className={`px - 2 py - 0.5 rounded - full text - xs font - medium ${member.status === 'active'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        } `}>
                                        {member.status === 'active' ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                <p className="text-sm text-blue-600 font-medium mb-1">{member.role}</p>

                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                    <Building size={14} className="mr-1.5 flex-shrink-0" />
                                    <span className="truncate">{member.companyName}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Mail size={14} className="mr-1.5 flex-shrink-0" />
                                    <span className="truncate">{member.email}</span>
                                </div>
                            </div>

                            {/* Hover Edit Button */}
                            <button
                                onClick={() => onNavigate('create-member', member.id)}
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-200 shadow-sm p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:border-blue-200"
                                title="Editar Membro"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

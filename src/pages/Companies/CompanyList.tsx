import { useState, useEffect } from 'react';
import { CompanyService } from '../../services/companyService';
import { Company } from '../../types';
import { Plus, Building, Search, Filter } from 'lucide-react';

export default function CompanyList({ onNavigate }: { onNavigate: (path: string, id?: string) => void }) {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

    useEffect(() => {
        setCompanies(CompanyService.getAll());
    }, []);

    const filteredCompanies = companies.filter(company => {
        const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (company.cnpj && company.cnpj.includes(searchTerm));
        const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
        return matchesSearch && matchesIndustry;
    });

    const industries = Array.from(new Set(companies.map(c => c.industry).filter(Boolean)));

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Empresas</h1>
                    <p className="text-gray-500 mt-1">Gerencie as empresas parceiras e associadas.</p>
                </div>
                <button
                    onClick={() => onNavigate('create-company')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-all shadow-blue-200">
                    <Plus size={20} className="mr-2" />
                    Nova Empresa
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou CNPJ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="md:w-64 relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                        <option value="all">Todos os Ramos</option>
                        {industries.map(industry => (
                            <option key={industry} value={industry}>{industry}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500">
                        Nenhuma empresa encontrada.
                    </div>
                ) : (
                    filteredCompanies.map((company) => (
                        <div key={company.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Building size={20} />
                                </div>
                                <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">{company.industry}</span>
                            </div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{company.name}</h3>
                                <button
                                    onClick={() => onNavigate('edit-company', company.id)}
                                    className="text-gray-400 hover:text-blue-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Editar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{company.cnpj || 'CNPJ não informado'}</p>

                            {company.website && (
                                <a href={company.website} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                                    Visitar site
                                </a>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}

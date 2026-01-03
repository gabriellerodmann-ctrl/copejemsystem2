import { useState, useEffect } from 'react';
import { CompanyService } from '../../services/companyService';
import { ArrowLeft, Save } from 'lucide-react';

interface CreateCompanyProps {
    onNavigate: (path: string, id?: string) => void;
    companyId?: string | null;
}

export default function CreateCompany({ onNavigate, companyId }: CreateCompanyProps) {
    const [formData, setFormData] = useState({
        name: '',
        cnpj: '' as string,
        industry: '',
        website: '' as string
    });

    useEffect(() => {
        if (companyId) {
            const company = CompanyService.getById(companyId);
            if (company) {
                setFormData({
                    name: company.name,
                    cnpj: company.cnpj ?? '',
                    industry: company.industry ?? '',
                    website: company.website ?? ''
                });
            }
        }
    }, [companyId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (companyId) {
                CompanyService.update(companyId, formData);
            } else {
                CompanyService.create(formData);
            }
            onNavigate('companies');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar empresa');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-2xl mx-auto">
            <button
                onClick={() => onNavigate('companies')}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" />
                Voltar para Empresas
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h1 className="text-xl font-bold text-gray-900">{companyId ? 'Editar Empresa' : 'Nova Empresa'}</h1>
                    <p className="text-sm text-gray-500 mt-1">{companyId ? 'Edite as informações da empresa.' : 'Cadastre uma nova empresa parceira ou associada.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                            <input
                                type="text"
                                name="cnpj"
                                value={formData.cnpj}
                                onChange={handleChange}
                                placeholder="00.000.000/0000-00"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ramo de Atividade</label>
                            <input
                                type="text"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center font-medium shadow-sm transition-all shadow-blue-200"
                        >
                            <Save size={20} className="mr-2" />
                            Salvar Empresa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

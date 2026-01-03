import React from 'react';
import { FolderKanban, Users, Building, LogOut } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    onNavigate: (path: string) => void;
    currentPath: string;
    onLogout: () => void;
}

export function Layout({ children, onNavigate, currentPath, onLogout }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        COPEJEM
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavItem
                        icon={<FolderKanban size={20} />}
                        label="Projetos"
                        active={currentPath === 'projects'}
                        onClick={() => onNavigate('projects')}
                    />
                    <NavItem
                        icon={<Users size={20} />}
                        label="Membros"
                        active={currentPath === 'members'}
                        onClick={() => onNavigate('members')}
                    />
                    <NavItem
                        icon={<Building size={20} />}
                        label="Empresas"
                        active={currentPath === 'companies'}
                        onClick={() => onNavigate('companies')}
                    />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={onLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <LogOut size={18} className="mr-3" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-800">Gerenciamento de Projetos</h2>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                            JS
                        </div>
                    </div>
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}>
            <span className="mr-3">{icon}</span>
            {label}
        </button>
    );
}

import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import ProjectList from './pages/Projects/ProjectList';
import CreateProject from './pages/Projects/CreateProject';
import MemberList from './pages/Members/MemberList';
import CreateMember from './pages/Members/CreateMember';
import CompanyList from './pages/Companies/CompanyList';
import CreateCompany from './pages/Companies/CreateCompany';
import Login from './pages/Login';

function App() {
  const [currentRoute, setCurrentRoute] = useState('projects');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleNavigate = (path: string, id?: string) => {
    setCurrentRoute(path);
    if (id) {
      setEditingId(id);
    } else if (path !== 'edit-project' && path !== 'create-member' && path !== 'edit-company') {
      // Note: checking 'create-member' too because we might reuse it for editing
      setEditingId(null);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout onNavigate={handleNavigate} currentPath={currentRoute} onLogout={handleLogout}>
      {currentRoute === 'projects' && <ProjectList onNavigate={handleNavigate} />}
      {currentRoute === 'create-project' && <CreateProject onNavigate={handleNavigate} />}
      {currentRoute === 'edit-project' && <CreateProject onNavigate={handleNavigate} projectId={editingId} />}
      {currentRoute === 'members' && <MemberList onNavigate={handleNavigate} />}
      {currentRoute === 'create-member' && <CreateMember onNavigate={handleNavigate} memberId={editingId} />}
      {currentRoute === 'companies' && <CompanyList onNavigate={handleNavigate} />}
      {currentRoute === 'create-company' && <CreateCompany onNavigate={handleNavigate} />}
      {currentRoute === 'edit-company' && <CreateCompany onNavigate={handleNavigate} companyId={editingId} />}
    </Layout>
  );
}

export default App;

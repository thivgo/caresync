import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profiles } from './pages/Profiles';
import { Settings } from './pages/Settings';
import { Tasks } from './pages/Tasks';
import { UsersManagement } from './pages/UsersManagement';

const ProtectedRoute = () => {
  const { currentUser, isLoading } = useApp();
  
  if (isLoading) return <div className="h-screen flex items-center justify-center dark:bg-slate-900 text-gray-400">Carregando...</div>;
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
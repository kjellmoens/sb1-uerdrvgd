import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CVProvider } from './contexts/CVContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EditCV from './pages/EditCV';
import ViewCV from './pages/ViewCV';
import Companies from './pages/Companies';
import Skills from './pages/Skills';

const Private: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Add authentication check logic here if needed
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <CVProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <Private>
                  <Layout />
                </Private>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="edit/:id" element={<EditCV />} />
              <Route path="view/:id" element={<ViewCV />} />
              <Route path="companies" element={<Companies />} />
              <Route path="skills" element={<Skills />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </CVProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
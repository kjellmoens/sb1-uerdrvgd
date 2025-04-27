import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CVProvider } from './contexts/CVContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import EditCV from './pages/EditCV';
import ViewCV from './pages/ViewCV';
import Companies from './pages/Companies';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <CVProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/edit/:id" element={<EditCV />} />
            <Route path="/view/:id" element={<ViewCV />} />
            <Route path="/companies" element={<Companies />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CVProvider>
    </Router>
  );
}

export default App;
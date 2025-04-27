import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
      <footer className="py-4 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-white">
        <div className="text-center text-sm text-gray-500">
          CV Builder &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
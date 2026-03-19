'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import LandingPage from '@/components/LandingPage';
import Dashboard from '@/components/Dashboard';
import Login from '@/components/Login';

export default function Page() {
  const { isAuthenticated } = useStore();
  const [showLogin, setShowLogin] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
    const handleHashChange = () => {
      setShowLogin(window.location.hash === '#login');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (!hydrated) {
    return (
        <div className="fixed inset-0 bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard />;
  }

  if (showLogin) {
    return <Login />;
  }

  return <LandingPage />;
}

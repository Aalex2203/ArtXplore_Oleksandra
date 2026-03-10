import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout.jsx';
import Auth from '@/pages/Auth.jsx';
import Profile from '@/pages/Profile.jsx';
import Map from '@/pages/Map.jsx';
import Discover from '@/pages/Discover.jsx';
import Landing from '@/components/Landing/Landing.jsx';
import Catalog from '@/components/Catalog/Catalog.jsx';

const NAV_ITEMS = [
  { id: 'landing', label: 'Home', path: '/' },
  { id: 'catalog', label: 'Catalog', path: '/catalog' },
  { id: 'discover', label: 'Discover', path: '/discover' },
  { id: 'map', label: 'Venues', path: '/map' },
  { id: 'profile', label: 'Profile', path: '/profile' },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  const handleNavigate = (pageId) => {
    const target = NAV_ITEMS.find((item) => item.id === pageId);
    if (!target) return;
    if (pageId === 'profile' && !currentUser) {
      navigate('/auth');
      return;
    }
    navigate(target.path);
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    navigate('/profile');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/auth');
  };

  const activePage =
    NAV_ITEMS.find((item) => item.path === location.pathname)?.id ||
    (location.pathname === '/auth' ? 'auth' : 'landing');

  return (
    <Layout
      navItems={NAV_ITEMS}
      activePage={activePage}
      onNavigate={handleNavigate}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/discover" element={<Discover currentUser={currentUser} />} />
        <Route path="/map" element={<Map />} />
        <Route path="/profile" element={<Profile currentUser={currentUser} />} />
        <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </Layout>
  );
}


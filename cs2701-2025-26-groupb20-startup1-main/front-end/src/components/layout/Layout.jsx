import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/layout/Navbar.jsx';

export default function Layout({ 
    children, 
    navItems = [], 
    activePage = 'home', 
    onNavigate,
    currentUser,
    onLogout 
}) {
    const preferredTheme = useMemo(() => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    }, []);

    const [theme, setTheme] = useState(preferredTheme);

    useEffect(() => {
        if (typeof document === 'undefined') return;
        const root = document.documentElement;
        root.dataset.theme = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme((current) => (current === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className="page">
            <Navbar
                theme={theme}
                onToggleTheme={toggleTheme}
                navItems={navItems}
                activePage={activePage}
                onNavigate={onNavigate}
                currentUser={currentUser}
                onLogout={onLogout}
            />
            <main className="page__main" id="main-content">
                {children}
            </main>
            <footer className="page__footer" style={{ background: 'var(--c-bg-surface)', borderTop: '1px solid var(--c-border)' }}>
                <div className="container">
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '3rem', paddingBottom: '2rem' }}>
                        <div style={{ maxWidth: '300px' }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--c-text-primary)' }}>ArtXPlore</h3>
                            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                                The operating system for modern residencies. Connecting artists, venues, and audiences through a unified platform.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
                            <div>
                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', color: 'var(--c-text-secondary)' }}>Platform</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                                    <a href="#" style={{ color: 'var(--c-text-secondary)' }}>About Us</a>
                                    <a href="#" style={{ color: 'var(--c-text-secondary)' }}>Browse Venues</a>
                                    <a href="#" style={{ color: 'var(--c-text-secondary)' }}>For Artists</a>
                                    <a href="#" style={{ color: 'var(--c-text-secondary)' }}>For Galleries</a>
                                </div>
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem', color: 'var(--c-text-secondary)' }}>Legal</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                                    <a href="#" style={{ color: 'var(--c-text-secondary)' }}>Privacy Policy</a>
                                    <a href="#" style={{ color: 'var(--c-text-secondary)' }}>Terms of Service</a>
                                    <a href="#" style={{ color: 'var(--c-text-secondary)' }}>Cookie Policy</a>
                                    <a href="#" style={{ color: 'var(--c-text-secondary)' }}>Security</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ 
                        borderTop: '1px solid var(--c-border)', 
                        paddingTop: '1.5rem', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        flexWrap: 'wrap', 
                        gap: '1rem',
                        fontSize: '0.875rem',
                        color: 'var(--c-text-tertiary)'
                    }}>
                        <span>&copy; {new Date().getFullYear()} ArtXPlore Inc. All rights reserved.</span>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <a href="https://github.com/BrunelCS/cs2701-2025-26-groupb20-startup1/tree/main" aria-label="GitHub" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

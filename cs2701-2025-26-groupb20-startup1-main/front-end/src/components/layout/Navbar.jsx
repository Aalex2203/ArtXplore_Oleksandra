import { useState } from 'react';

export default function Navbar({
    theme = 'light',
    onToggleTheme,
    navItems = [],
    activePage = 'home',
    onNavigate,
    currentUser,
    onLogout,
}) {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen((open) => !open);
    };

    const handleNavigate = (pageId) => {
        if (typeof onNavigate === 'function') {
            onNavigate(pageId);
        }
        setMenuOpen(false);
    };

    const handleBrandClick = () => {
        const defaultPage = navItems[0]?.id || 'home';
        handleNavigate(defaultPage);
    };

    return (
        <header className="page__header" id="top">
            <div className="container navbar">
                <div className="navbar__identity">
                    <button className="navbar__brand" type="button" onClick={handleBrandClick}>
                        ArtXPlore
                    </button>
                    <span className="navbar__eyebrow">Artist venues &amp; community</span>
                </div>
                
                <button
                    className="nav-toggle"
                    type="button"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                </button>

                <nav className={`navbar__menu${isMenuOpen ? ' is-open' : ''}`}>
                    <ul className="navbar__list">
                        {navItems.map((item) => (
                            <li key={item.id}>
                                <button 
                                    className={`nav-item ${item.id === activePage ? 'is-active' : ''}`}
                                    onClick={() => handleNavigate(item.id)}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="flex items-center gap-4">
                        <button
                            className="theme-toggle"
                            type="button"
                            onClick={onToggleTheme}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? (
                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                 </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>
                        
                        {currentUser && (
                            <button 
                                onClick={onLogout} 
                                className="btn btn-ghost" 
                                style={{ padding: '0.5rem', fontSize: '0.875rem' }}
                            >
                                Sign Out
                            </button>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
}
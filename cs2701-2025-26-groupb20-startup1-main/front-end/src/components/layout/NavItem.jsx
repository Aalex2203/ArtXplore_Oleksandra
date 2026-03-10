export default function NavItem({ id, label, onSelect, isActive = false }) {
    const handleClick = () => {
        if (typeof onSelect === 'function') {
            onSelect(id);
        }
    };

    return (
        <li className="navbar__item">
            <button
                type="button"
                className={`navbar__link${isActive ? ' is-active' : ''}`}
                onClick={handleClick}
            >
                {label}
            </button>
        </li>
    );
}

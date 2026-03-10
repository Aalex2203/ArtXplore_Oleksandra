import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input 
        ref={ref} 
        className={`input-field ${error ? 'input-error' : ''}`} 
        {...props} 
      />
      {error && <span style={{ color: 'var(--c-error)', fontSize: '0.75rem' }}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
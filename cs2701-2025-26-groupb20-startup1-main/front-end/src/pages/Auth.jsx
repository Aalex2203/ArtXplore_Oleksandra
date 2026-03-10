import { useState, useEffect } from 'react';
import { submitSignIn, submitSignUp } from '@/lib/api.js';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

const DEMO_USER = {
  fullName: 'Alex Rivera',
  role: 'Visual Artist',
  location: 'East London',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60',
  bio: 'Multidisciplinary artist exploring the intersection of digital landscapes and physical spaces. Currently working on a series of light installations for urban environments.',
  website: 'https://alexrivera.art',
  email: 'alex@artxplore.com'
};

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.title = isLogin ? 'Sign In · ArtXPlore' : 'Join · ArtXPlore';
    setError('');
    setSuccess('');
  }, [isLogin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // clear error on type
  };

  const handleDemoLogin = () => {
      setIsLoading(true);
      // Simulate loading
      setTimeout(() => {
          onLogin(DEMO_USER);
      }, 600);
  };

  const validate = () => {
    if (!formData.email || !formData.password) return 'Email and password are required.';
    if (!isLogin) {
      if (!formData.fullName) return 'Full name is required.';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
      if (formData.password.length < 8) return 'Password must be at least 8 characters.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const res = await submitSignIn({ 
          email: formData.email, 
          password: formData.password 
        });
        setSuccess(res.message || 'Welcome back!');
        setTimeout(() => {
             onLogin({
                 email: formData.email,
                 fullName: 'Demo User', 
             });
        }, 800);

      } else {
        const res = await submitSignUp({ 
          email: formData.email, 
          password: formData.password, 
          fullName: formData.fullName,
          role: 'artist' 
        });
        setSuccess(res.message || 'Account created successfully.');
        setTimeout(() => {
            onLogin({
                email: formData.email,
                fullName: formData.fullName,
                role: 'artist'
            });
        }, 800);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      console.error(err);
      setIsLoading(false);
    } 
  };

  return (
    <div className="page flex items-center justify-center" style={{ minHeight: '80vh' }}>
      <div className="container flex justify-center w-full">
        <Card className="w-full fade-in" style={{ maxWidth: '400px' }}>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-muted">
              {isLogin ? 'Enter your credentials to access your workspace.' : 'Join ArtXPlore to manage your creative journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <Input
                label="Full Name"
                name="fullName"
                placeholder="Jane Doe"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
              />
            )}
            
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />

            {!isLogin && (
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
            )}

            {error && (
              <div className="fade-in" style={{ 
                padding: '0.75rem', 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                color: 'var(--c-error)', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {success && (
              <div className="fade-in" style={{ 
                padding: '0.75rem', 
                backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                color: 'var(--c-success)', 
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {success}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              isLoading={isLoading}
              style={{ marginTop: '0.5rem' }}
            >
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          
          {/* Demo Login Divider */}
          <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              margin: '1.5rem 0', 
              color: 'var(--c-text-tertiary)', 
              fontSize: '0.8rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
          }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }}></div>
              <span style={{ padding: '0 1rem' }}>Or</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--c-border)' }}></div>
          </div>

          <Button 
              variant="secondary" 
              className="w-full" 
              onClick={handleDemoLogin}
              disabled={isLoading}
          >
              View Demo Profile
          </Button>

          <div className="text-center" style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--c-text-secondary)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--c-brand-primary)', 
                fontWeight: 600, 
                cursor: 'pointer',
                padding: 0
              }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
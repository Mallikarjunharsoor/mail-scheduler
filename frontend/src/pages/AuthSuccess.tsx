import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      login(token);
      window.history.replaceState({}, '', '/dashboard');
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [login, navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f8fafc' }}>
      <div style={{ width: 360, padding: 32, borderRadius: 24, background: '#fff', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 24, textAlign: 'center' }}>Signing you in...</h1>
        <p style={{ color: '#64748b', textAlign: 'center' }}>Finalizing your Google sign-in and taking you to the dashboard.</p>
      </div>
    </div>
  );
}

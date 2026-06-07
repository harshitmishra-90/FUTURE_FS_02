import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '2.5rem', width: 360, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>LeadCRM</h1>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Sign in to your account</p>
        {error && <p style={{ color: '#e24b4a', fontSize: 14, marginBottom: 16 }}>{error}</p>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 5 }}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} required
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 5 }}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handle} required
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '10px', background: '#378ADD', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, cursor: 'pointer', fontWeight: 500 }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

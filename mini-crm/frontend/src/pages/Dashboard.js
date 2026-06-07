import { useState, useEffect, useCallback } from 'react';
import api from '../api';
import LeadModal from '../components/LeadModal';
import { useAuth } from '../components/AuthContext';

const STATUSES = ['New', 'Contacted', 'Converted', 'Lost'];
const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Email', 'Other'];
const badgeStyle = { New:'#E6F1FB:#0C447C', Contacted:'#FAEEDA:#633806', Converted:'#EAF3DE:#27500A', Lost:'#FCEBEB:#791F1F' };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [leads, setLeads] = useState([]);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSource, setFilterSource] = useState('');

  const fetchLeads = useCallback(async () => {
    const params = {};
    if (search) params.search = search;
    if (filterStatus) params.status = filterStatus;
    if (filterSource) params.source = filterSource;
    const res = await api.get('/leads', { params });
    setLeads(res.data);
  }, [search, filterStatus, filterSource]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const saveLead = async (form) => {
    if (modal?._id) await api.put(`/leads/${modal._id}`, form);
    else await api.post('/leads', form);
    fetchLeads();
  };

  const deleteLead = async (id) => {
    if (window.confirm('Delete this lead?')) { await api.delete(`/leads/${id}`); fetchLeads(); }
  };

  const changeStatus = async (id, status) => {
    await api.patch(`/leads/${id}/status`, { status });
    fetchLeads();
  };

  const stats = STATUSES.map(s => ({ label: s, count: leads.filter(l => l.status === s).length }));

  return (
    <div style={{ minHeight: '100vh', background: '#f5f6fa', fontFamily: 'system-ui, sans-serif' }}>
      {/* Navbar */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600, fontSize: 18 }}>Lead<span style={{ color: '#378ADD' }}>CRM</span></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 14, color: '#555' }}>👤 {user?.name}</span>
          <button onClick={logout} style={{ fontSize: 13, color: '#e24b4a', background: 'none', border: '1px solid #e24b4a', padding: '5px 12px', borderRadius: 6, cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
          {[{ label: 'Total Leads', count: leads.length, color: '#378ADD' }, ...stats].map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', border: '1px solid #eee' }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 600, color: s.color || '#222' }}>{s.count}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <input placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 180, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
            <option value="">All sources</option>
            {SOURCES.map(s => <option key={s}>{s}</option>)}
          </select>
          <button onClick={() => setModal({})}
            style={{ padding: '8px 18px', background: '#378ADD', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
            + Add Lead
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #eee', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fb' }}>
                {['Name','Email','Source','Status','Notes','Added','Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '11px 14px', fontSize: 12, color: '#888', fontWeight: 500, borderBottom: '1px solid #eee' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#aaa', fontSize: 14 }}>No leads found</td></tr>
              )}
              {leads.map(lead => {
                const [bg, color] = (badgeStyle[lead.status] || '#eee:#333').split(':');
                return (
                  <tr key={lead._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '11px 14px', fontSize: 14, fontWeight: 500 }}>{lead.name}</td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: '#378ADD' }}>{lead.email}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ background: '#f0f2f5', fontSize: 12, padding: '3px 9px', borderRadius: 20 }}>{lead.source}</span>
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <select value={lead.status} onChange={e => changeStatus(lead._id, e.target.value)}
                        style={{ background: bg, color, border: 'none', borderRadius: 20, padding: '4px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 13, color: '#666', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {lead.notes || <span style={{ color: '#bbb' }}>—</span>}
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: 12, color: '#aaa' }}>
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => setModal(lead)} title="Edit"
                          style={{ background: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 13 }}>✏️</button>
                        <button onClick={() => deleteLead(lead._id)} title="Delete"
                          style={{ background: 'none', border: '1px solid #fdd', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: 13 }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal !== null && <LeadModal lead={modal} onSave={saveLead} onClose={() => setModal(null)} />}
    </div>
  );
}

import { useState, useEffect } from 'react';

const SOURCES = ['Website', 'Referral', 'LinkedIn', 'Email', 'Other'];
const STATUSES = ['New', 'Contacted', 'Converted', 'Lost'];

export default function LeadModal({ lead, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', source: 'Website', status: 'New', notes: '', followUpDate: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (lead) setForm({
      name: lead.name || '',
      email: lead.email || '',
      source: lead.source || 'Website',
      status: lead.status || 'New',
      notes: lead.notes || '',
      followUpDate: lead.followUpDate ? lead.followUpDate.slice(0, 10) : ''
    });
  }, [lead]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.email.trim()) { setError('Name and email required'); return; }
    try { await onSave(form); onClose(); }
    catch (err) { setError(err.response?.data?.message || 'Save failed'); }
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '1.75rem', width: 440, maxWidth: '95vw' }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>{lead?._id ? 'Edit lead' : 'Add lead'}</h2>
        {error && <p style={{ color: '#e24b4a', fontSize: 13, marginBottom: 14 }}>{error}</p>}
        <form onSubmit={submit}>
          {[['name','Name','text'],['email','Email','email']].map(([name, label, type]) => (
            <div key={name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>{label}</label>
              <input name={name} type={type} value={form[name]} onChange={handle}
                style={{ width: '100%', padding: '8px 11px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
            </div>
          ))}
          {[['source','Source',SOURCES],['status','Status',STATUSES]].map(([name,label,opts]) => (
            <div key={name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>{label}</label>
              <select name={name} value={form[name]} onChange={handle}
                style={{ width: '100%', padding: '8px 11px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Follow-up date</label>
            <input name="followUpDate" type="date" value={form.followUpDate} onChange={handle}
              style={{ width: '100%', padding: '8px 11px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#666', display: 'block', marginBottom: 5 }}>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handle} rows={3}
              style={{ width: '100%', padding: '8px 11px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose}
              style={{ padding: '8px 18px', border: '1px solid #ddd', borderRadius: 8, background: 'none', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
            <button type="submit"
              style={{ padding: '8px 20px', background: '#378ADD', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>Save lead</button>
          </div>
        </form>
      </div>
    </div>
  );
}

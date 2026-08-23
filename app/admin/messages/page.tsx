import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function MessagesPage() {
  const supabase = await createClient();
  
  const { data: messages, error } = await supabase
    .from('contact_messages')
    .select(`
        *,
        admin_users:replied_by ( username )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
  }

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'responded': return <span className="badge" style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>RESPONDED</span>;
          default: return <span className="badge" style={{ background: '#eff6ff', color: '#2563eb', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>NEW</span>;
      }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--text-dark)' }}>Contact Messages</h2>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Sender</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th className="actions-column">Actions</th>
                </tr>
            </thead>
            <tbody>
                {(!messages || messages.length === 0) ? (
                    <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                            No messages found.
                        </td>
                    </tr>
                ) : (
                    messages.map((msg: any) => (
                        <tr key={msg.message_id} style={{ background: msg.status === 'new' ? '#f8fafc' : 'white', fontWeight: msg.status === 'new' ? 600 : 400 }}>
                            <td>{new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td>
                                <div>{msg.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 400 }}>{msg.email}</div>
                            </td>
                            <td>{msg.subject || 'No Subject'}</td>
                            <td>{getStatusBadge(msg.status)}</td>
                            <td className="actions-cell">
                                <a href={`/admin/messages/${msg.message_id}`} className="action-btn" style={{ padding: '0.5rem', background: 'var(--bg-light)', border: 'none', borderRadius: '6px', color: 'var(--primary-color)', textDecoration: 'none', display: 'inline-block' }}>
                                    Read
                                </a>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

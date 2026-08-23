import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { markAsReplied } from '../actions';

export default async function MessageViewPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const messageId = (await params).id;
  
  const { data: msg, error } = await supabase
    .from('contact_messages')
    .select(`
        *,
        admin_users:replied_by ( username )
    `)
    .eq('message_id', messageId)
    .single();

  if (error || !msg) {
    return <div style={{ padding: '2rem' }}>Message not found.</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/admin/messages" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back to Messages
        </a>
      </div>

      <div className="form-card" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <h2 style={{ margin: '0 0 1rem 0', fontWeight: 800 }}>{msg.subject || 'No Subject'}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>From</div>
                    <div style={{ fontWeight: 600 }}>{msg.name}</div>
                    <div style={{ fontSize: '0.9rem' }}><a href={`mailto:${msg.email}`} style={{ color: '#2563eb' }}>{msg.email}</a></div>
                    {msg.phone && <div style={{ fontSize: '0.9rem' }}>{msg.phone}</div>}
                </div>
                <div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Received</div>
                    <div style={{ fontWeight: 600 }}>{new Date(msg.created_at).toLocaleString('en-US')}</div>
                </div>
            </div>
        </div>

        <div style={{ padding: '2rem 1.5rem', minHeight: '200px', fontSize: '1.05rem', lineHeight: '1.6', color: '#334155', whiteSpace: 'pre-wrap' }}>
            {msg.message}
        </div>

        <div style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {msg.status === 'responded' ? (
                <div style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-check-circle"></i>
                    Marked as replied by {msg.admin_users?.username || 'Admin'} on {new Date(msg.replied_at).toLocaleDateString()}
                </div>
            ) : (
                <>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        To reply, click the email address above to open your email client.
                    </div>
                    <form action={markAsReplied}>
                        <input type="hidden" name="message_id" value={msg.message_id} />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                            <i className="fas fa-check"></i> Mark as Replied
                        </button>
                    </form>
                </>
            )}
        </div>
      </div>
    </div>
  );
}

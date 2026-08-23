import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { unsubscribe, permanentDelete } from './actions';

export default async function NewsletterPage() {
  const supabase = await createClient();
  
  const { data: subscribers, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscribers:', error);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--text-dark)' }}>Newsletter Subscribers</h2>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Subscribed Date</th>
                    <th>Status</th>
                    <th className="actions-column">Actions</th>
                </tr>
            </thead>
            <tbody>
                {(!subscribers || subscribers.length === 0) ? (
                    <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                            No subscribers found.
                        </td>
                    </tr>
                ) : (
                    subscribers.map((sub: any) => (
                        <tr key={sub.subscriber_id}>
                            <td><strong>{sub.email}</strong></td>
                            <td>{sub.first_name} {sub.last_name}</td>
                            <td>{new Date(sub.subscribed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td>
                                <span className={`status-indicator ${sub.is_active ? 'active' : 'inactive'}`}>
                                    {sub.is_active ? 'Subscribed' : 'Unsubscribed'}
                                </span>
                            </td>
                            <td className="actions-cell">
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {sub.is_active && (
                                        <form action={unsubscribe}>
                                            <input type="hidden" name="subscriber_id" value={sub.subscriber_id} />
                                            <button type="submit" className="action-btn" title="Unsubscribe" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                                <i className="fas fa-ban"></i> Unsubscribe
                                            </button>
                                        </form>
                                    )}
                                    <form action={permanentDelete}>
                                        <input type="hidden" name="subscriber_id" value={sub.subscriber_id} />
                                        <button type="submit" className="action-btn delete-btn" title="Permanent Delete" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}>
                                            <i className="fas fa-trash"></i> Delete
                                        </button>
                                    </form>
                                </div>
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

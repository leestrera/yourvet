import React from 'react';
import { createClient } from '@/utils/supabase/server';
import DeleteFaqButton from './DeleteFaqButton';

export default async function FaqsPage() {
  const supabase = await createClient();
  
  const { data: faqs, error } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching FAQs:', error);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--text-dark)' }}>Frequently Asked Questions</h2>
        <a href="/admin/faqs/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          <i className="fas fa-plus"></i> Add New FAQ
        </a>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Question</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th className="actions-column">Actions</th>
                </tr>
            </thead>
            <tbody>
                {(!faqs || faqs.length === 0) ? (
                    <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                            No FAQs found. Create your first FAQ above.
                        </td>
                    </tr>
                ) : (
                    faqs.map((faq: any) => (
                        <tr key={faq.faq_id}>
                            <td>{faq.display_order}</td>
                            <td><strong>{faq.question}</strong></td>
                            <td>{faq.category || 'General'}</td>
                            <td>
                                <span className={`status-indicator ${faq.is_active ? 'active' : 'inactive'}`}>
                                    {faq.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="actions-cell">
                                <a href={`/admin/faqs/${faq.faq_id}/edit`} className="action-btn">
                                    <i className="fas fa-edit"></i> Edit
                                </a>
                                <DeleteFaqButton id={faq.faq_id} />
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

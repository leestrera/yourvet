import React from 'react';
import { createClient } from '@/utils/supabase/server';
import DeleteTestimonialButton from './DeleteTestimonialButton';

export default async function TestimonialsPage() {
  const supabase = await createClient();
  
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--text-dark)' }}>Client Testimonials</h2>
        <a href="/admin/testimonials/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          <i className="fas fa-plus"></i> Add Testimonial
        </a>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Client / Pet</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th className="actions-column">Actions</th>
                </tr>
            </thead>
            <tbody>
                {(!testimonials || testimonials.length === 0) ? (
                    <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                            No testimonials found.
                        </td>
                    </tr>
                ) : (
                    testimonials.map((t: any) => (
                        <tr key={t.testimonial_id}>
                            <td>{new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td>
                                <div><strong>{t.client_name}</strong></div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Pet: {t.pet_name || 'N/A'}</div>
                            </td>
                            <td style={{ color: '#f59e0b' }}>
                                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span className={`status-indicator ${t.is_approved ? 'active' : 'inactive'}`}>
                                        {t.is_approved ? 'Approved' : 'Pending'}
                                    </span>
                                    {t.is_featured && (
                                        <span className="badge" style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Featured</span>
                                    )}
                                </div>
                            </td>
                            <td className="actions-cell">
                                <a href={`/admin/testimonials/${t.testimonial_id}/edit`} className="action-btn">
                                    <i className="fas fa-edit"></i> Edit
                                </a>
                                <DeleteTestimonialButton id={t.testimonial_id} />
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

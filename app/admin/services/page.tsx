import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { deleteService } from './actions';
import DeleteButton from './DeleteButton';

export default async function ServicesPage() {
  const supabase = await createClient();
  
  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })
    .order('category', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--text-dark)' }}>Clinic Services</h2>
        <a href="/admin/services/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          <i className="fas fa-plus"></i> Add New Service
        </a>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Service Name</th>
                    <th>Category</th>
                    <th>Duration</th>
                    <th>Base Price</th>
                    <th>Status</th>
                    <th className="actions-column">Actions</th>
                </tr>
            </thead>
            <tbody>
                {(!services || services.length === 0) ? (
                    <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                            No services found. Add your first service to get started.
                        </td>
                    </tr>
                ) : (
                    services.map((service: any) => (
                        <tr key={service.service_id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className={service.icon || 'fas fa-stethoscope'}></i>
                                    </div>
                                    <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{service.name}</div>
                                </div>
                            </td>
                            <td>
                                <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                    {service.category}
                                </span>
                            </td>
                            <td>
                                {service.duration_min ? `${service.duration_min} mins` : '-'}
                            </td>
                            <td>
                                <strong style={{ color: 'var(--text-dark)' }}>
                                    ${Number(service.base_price).toFixed(2)}
                                </strong>
                            </td>
                            <td>
                                <span className="badge" style={{ background: service.is_active ? '#dcfce7' : '#fee2e2', color: service.is_active ? '#166534' : '#991b1b', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                                    {service.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="actions-cell">
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <a href={`/admin/services/${service.service_id}/edit`} className="action-btn" style={{ padding: '0.5rem', background: 'var(--white)', border: '1px solid var(--system-border)', borderRadius: '6px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit Service">
                                        <i className="fas fa-edit"></i>
                                    </a>
                                    <form action={deleteService} style={{ margin: 0 }}>
                                        <input type="hidden" name="service_id" value={service.service_id} />
                                        <DeleteButton />
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

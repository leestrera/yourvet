import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function AdminClients() {
  const supabase = await createClient();
  
  const { data: clients, error } = await supabase
    .from('owners')
    .select(`
      *,
      pets (count)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="dashboard-section" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Manage Clients</h2>
          <a href="/admin/clients/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '8px' }}>
              <i className="fas fa-user-plus"></i> Register New Client
          </a>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact Info</th>
              <th>Pets</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients?.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  No clients registered yet.
                </td>
              </tr>
            )}
            {clients?.map((client: any) => {
              const petCount = client.pets[0]?.count || 0;
              return (
                <tr key={client.owner_id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' }}>
                            {client.first_name[0]}{client.last_name[0]}
                        </div>
                        <div>
                            <strong>{client.last_name}, {client.first_name}</strong><br/>
                            <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>ID #{client.owner_id}</span>
                        </div>
                    </div>
                  </td>
                  <td>
                    <div><i className="fas fa-envelope"></i> {client.email}</div>
                    <div style={{ marginTop: '0.25rem' }}><i className="fas fa-phone"></i> {client.phone}</div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                        <i className="fas fa-paw"></i> {petCount} Pets
                    </span>
                  </td>
                  <td>
                    {new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <a href={`/admin/clients/${client.owner_id}`} className="action-btn" title="View Profile" style={{ color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                            <i className="fas fa-eye"></i>
                        </a>
                        <a href={`/admin/clients/${client.owner_id}/edit`} className="action-btn" title="Edit Client" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                            <i className="fas fa-edit"></i>
                        </a>
                        <a href={`/admin/clients/${client.owner_id}/pets/new`} className="action-btn" title="Add Pet" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '6px' }}>
                            <i className="fas fa-plus-circle"></i>
                        </a>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import { createClient } from '@/utils/supabase/server';
import DeleteStaffButton from './DeleteStaffButton';

export default async function TeamPage() {
  const supabase = await createClient();
  
  const { data: staff, error } = await supabase
    .from('staff')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching staff:', error);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--text-dark)' }}>Veterinary Team</h2>
        <a href="/admin/team/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          <i className="fas fa-plus"></i> Add Staff Member
        </a>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Name</th>
                    <th>Role & Speciality</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th className="actions-column">Actions</th>
                </tr>
            </thead>
            <tbody>
                {(!staff || staff.length === 0) ? (
                    <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                            No staff members found.
                        </td>
                    </tr>
                ) : (
                    staff.map((member: any) => (
                        <tr key={member.staff_id}>
                            <td>{member.display_order}</td>
                            <td>
                                <div><strong>{member.first_name} {member.last_name}</strong> {member.credentials && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{member.credentials}</span>}</div>
                            </td>
                            <td>
                                <div>{member.role}</div>
                                {member.specialization && <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{member.specialization}</div>}
                            </td>
                            <td>
                                <div style={{ fontSize: '0.85rem' }}><a href={`mailto:${member.email}`}>{member.email}</a></div>
                                {member.phone && <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{member.phone}</div>}
                            </td>
                            <td>
                                <span className={`status-indicator ${member.is_active ? 'active' : 'inactive'}`}>
                                    {member.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="actions-cell">
                                <a href={`/admin/team/${member.staff_id}/edit`} className="action-btn">
                                    <i className="fas fa-edit"></i> Edit
                                </a>
                                <DeleteStaffButton id={member.staff_id} />
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

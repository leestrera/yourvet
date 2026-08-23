import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function FinancePage() {
  const supabase = await createClient();
  
  // Fetch billing with related appointment, pet, and owner
  const { data: invoices, error } = await supabase
    .from('billing')
    .select(`
        *,
        appointments:appointment_id (
            appointment_date,
            pets:pet_id (
                name,
                owners:owner_id (
                    first_name,
                    last_name
                )
            )
        )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
  }

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'paid': return <span className="badge" style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>PAID</span>;
          case 'partial': return <span className="badge" style={{ background: '#fffbeb', color: '#d97706', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>PARTIAL</span>;
          default: return <span className="badge" style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>UNPAID</span>;
      }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--text-dark)' }}>Finance & Billing</h2>
        <a href="/admin/finance/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          <i className="fas fa-file-invoice"></i> Create Invoice
        </a>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Invoice ID</th>
                    <th>Date</th>
                    <th>Client / Patient</th>
                    <th>Subtotal</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="actions-column">Actions</th>
                </tr>
            </thead>
            <tbody>
                {(!invoices || invoices.length === 0) ? (
                    <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                            No invoices found. Create one from an appointment.
                        </td>
                    </tr>
                ) : (
                    invoices.map((inv: any) => {
                        const ownerName = inv.appointments?.pets?.owners ? `${inv.appointments.pets.owners.first_name} ${inv.appointments.pets.owners.last_name}` : 'Unknown';
                        const petName = inv.appointments?.pets?.name || 'Unknown';
                        const date = inv.appointments?.appointment_date || inv.created_at.split('T')[0];

                        return (
                        <tr key={inv.billing_id}>
                            <td><strong>INV-{inv.billing_id}</strong></td>
                            <td>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td>
                                <div style={{ fontWeight: 600 }}>{ownerName}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Patient: {petName}</div>
                            </td>
                            <td>${Number(inv.subtotal).toFixed(2)}</td>
                            <td><strong style={{ color: 'var(--text-dark)' }}>${Number(inv.total_amount).toFixed(2)}</strong></td>
                            <td>{getStatusBadge(inv.payment_status)}</td>
                            <td className="actions-cell">
                                <a href={`/admin/finance/${inv.billing_id}`} className="action-btn" style={{ padding: '0.5rem', background: 'var(--bg-light)', border: 'none', borderRadius: '6px', color: 'var(--primary-color)', textDecoration: 'none', display: 'inline-block' }}>
                                    View Details
                                </a>
                            </td>
                        </tr>
                        );
                    })
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

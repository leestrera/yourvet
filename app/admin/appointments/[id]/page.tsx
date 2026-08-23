import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id: appointmentId } = await params;
  
  const [
    { data: appointment },
    { data: assignedServices },
    { data: billing }
  ] = await Promise.all([
    supabase
      .from('appointments')
      .select(`
        *,
        pet:pets(name, species, breed, owners(first_name, last_name, phone, email)),
        staff:staff(first_name, last_name)
      `)
      .eq('appointment_id', appointmentId)
      .single(),
    supabase
      .from('appointment_services')
      .select('service_price_snapshot, service:services(name, category)')
      .eq('appointment_id', appointmentId),
    supabase
      .from('billing')
      .select('billing_id, subtotal, payment_status')
      .eq('appointment_id', appointmentId)
      .single()
  ]);

  if (!appointment) return notFound();

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return <span className="badge badge-success">Completed</span>;
      case 'pending': return <span className="badge badge-warning">Pending</span>;
      case 'confirmed': return <span className="badge badge-info">Confirmed</span>;
      case 'in_progress': return <span className="badge badge-info">In Progress</span>;
      case 'cancelled': return <span className="badge badge-danger">Cancelled</span>;
      default: return <span className="badge badge-secondary">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '1.25rem' }}>
                <i className="fas fa-calendar-check"></i>
            </div>
            <div>
                <h2 style={{ fontWeight: 800, color: 'var(--text-dark)', margin: 0, fontSize: '1.35rem', letterSpacing: '-0.5px' }}>Appointment #{appointment.appointment_id}</h2>
                <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>
                    Created: {new Date(appointment.created_at).toLocaleDateString()}
                </div>
            </div>
        </div>
        <a href="/admin/appointments" className="btn btn-secondary" style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, background: '#f8fafc', borderColor: '#e2e8f0', color: '#475569', textDecoration: 'none' }}>
            <i className="fas fa-arrow-left"></i> Back to List
        </a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Main Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Overview Card */}
            <div className="admin-card" style={{ padding: '2rem', borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-info-circle" style={{ color: 'var(--primary-color)' }}></i> Overview
                    </h3>
                    {getStatusBadge(appointment.status)}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Patient</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{appointment.pet?.name}</div>
                        <div style={{ fontSize: '0.9rem', color: '#475569' }}>{appointment.pet?.species} - {appointment.pet?.breed}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Owner</div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>{appointment.pet?.owners?.first_name} {appointment.pet?.owners?.last_name}</div>
                        <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                            <i className="fas fa-phone" style={{ width: '16px' }}></i> {appointment.pet?.owners?.phone || 'N/A'}<br/>
                            <i className="fas fa-envelope" style={{ width: '16px' }}></i> {appointment.pet?.owners?.email || 'N/A'}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Schedule</div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                            {new Date(appointment.appointment_date).toLocaleDateString()} at {appointment.appointment_time}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#475569', textTransform: 'capitalize' }}>
                            Type: {appointment.visit_type?.replace('_', '-')}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Attending Staff</div>
                        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                            {appointment.staff ? `Dr. ${appointment.staff.first_name} ${appointment.staff.last_name}` : 'Unassigned'}
                        </div>
                    </div>
                </div>

                {appointment.notes && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>Notes</div>
                        <div style={{ fontSize: '0.95rem', color: '#334155', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                            {appointment.notes}
                        </div>
                    </div>
                )}
            </div>

            {/* Services Card */}
            <div className="admin-card" style={{ padding: '2rem', borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-stethoscope" style={{ color: 'var(--primary-color)' }}></i> Assigned Services
                </h3>
                
                {assignedServices && assignedServices.length > 0 ? (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Service Name</th>
                                <th>Category</th>
                                <th style={{ textAlign: 'right' }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignedServices.map((as: any, i: number) => (
                                <tr key={i}>
                                    <td style={{ fontWeight: 600 }}>{as.service?.name}</td>
                                    <td>{as.service?.category}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                                        ₱{Number(as.service_price_snapshot).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            <tr style={{ background: '#f8fafc' }}>
                                <td colSpan={2} style={{ textAlign: 'right', fontWeight: 700, color: '#475569' }}>Subtotal</td>
                                <td style={{ textAlign: 'right', fontWeight: 800, color: '#1e293b', fontSize: '1.1rem' }}>
                                    ₱{billing?.subtotal ? Number(billing.subtotal).toFixed(2) : '0.00'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '8px' }}>
                        No services assigned to this appointment.
                    </div>
                )}
            </div>

        </div>

        {/* Sidebar Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="admin-card" style={{ padding: '1.5rem', borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-dark)' }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <a href={`/admin/appointments/${appointmentId}/edit`} className="btn btn-primary" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', borderRadius: '8px', background: 'var(--primary-color)', color: 'white', textDecoration: 'none', fontWeight: 600 }}>
                        <i className="fas fa-edit"></i> Edit Appointment
                    </a>
                    
                    {billing && (
                        <a href={`/admin/finance/${billing.billing_id}`} className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', color: '#475569', textDecoration: 'none', fontWeight: 600 }}>
                            <i className="fas fa-file-invoice-dollar"></i> View Invoice
                        </a>
                    )}

                    <a href={`/admin/records/new`} className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0', color: '#475569', textDecoration: 'none', fontWeight: 600 }}>
                        <i className="fas fa-notes-medical"></i> Create Medical Record
                    </a>
                </div>
            </div>

            {billing && (
                <div className="admin-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-dark)' }}>Billing Status</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, color: '#475569' }}>Status:</span>
                        <span className={`badge ${billing.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`} style={{ textTransform: 'uppercase' }}>
                            {billing.payment_status}
                        </span>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}

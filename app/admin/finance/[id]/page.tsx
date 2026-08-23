import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AddServiceForm from './AddServiceForm';
import RecordPaymentForm from './RecordPaymentForm';
import { addServiceToInvoice, recordPayment } from '../actions';

export default async function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const invoiceId = (await params).id;
  
  // 1. Fetch Invoice
  const { data: invoice, error } = await supabase
    .from('billing')
    .select(`
        *,
        appointments:appointment_id (
            appointment_date,
            pets:pet_id (
                name,
                species,
                breed,
                owners:owner_id (
                    first_name,
                    last_name,
                    email,
                    phone,
                    address
                )
            )
        )
    `)
    .eq('billing_id', invoiceId)
    .single();

  if (error || !invoice) {
    return <div style={{ padding: '2rem' }}>Invoice not found.</div>;
  }

  // 2. Fetch rendered services
  const { data: renderedServices } = await supabase
    .from('appointment_services')
    .select(`
        *,
        services:service_id (name, category)
    `)
    .eq('appointment_id', invoice.appointment_id);

  // 3. Fetch all active services for the dropdown
  const { data: allServices } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('category')
    .order('name');

  // 4. Fetch payments
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('billing_id', invoiceId)
    .order('payment_date', { ascending: false });

  const owner = invoice.appointments?.pets?.owners;
  const pet = invoice.appointments?.pets;
  
  const totalPaid = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const balance = Number(invoice.total_amount) - totalPaid;

  const getStatusBadge = (status: string) => {
    switch(status) {
        case 'paid': return <span className="badge" style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.85rem', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: 'bold' }}>PAID</span>;
        case 'partial': return <span className="badge" style={{ background: '#fffbeb', color: '#d97706', fontSize: '0.85rem', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: 'bold' }}>PARTIAL</span>;
        default: return <span className="badge" style={{ background: '#fef2f2', color: '#dc2626', fontSize: '0.85rem', padding: '0.35rem 0.85rem', borderRadius: '8px', fontWeight: 'bold' }}>UNPAID</span>;
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <a href="/admin/finance" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
                    <i className="fas fa-arrow-left"></i>
                </a>
                <h2 style={{ margin: 0, fontWeight: 800 }}>
                    <i className="fas fa-file-invoice-dollar" style={{ color: '#6366f1', marginRight: '0.5rem' }}></i>
                    Invoice #{invoice.billing_id}
                </h2>
                {getStatusBadge(invoice.payment_status)}
            </div>
        </div>

        {/* Financial Summary Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Subtotal</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>${Number(invoice.subtotal).toFixed(2)}</div>
            </div>
            <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Tax</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>${Number(invoice.tax_amount).toFixed(2)}</div>
            </div>
            <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Discount</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626' }}>-${Number(invoice.discount_amount).toFixed(2)}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Total</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>${Number(invoice.total_amount).toFixed(2)}</div>
            </div>
            <div style={{ background: balance <= 0 ? '#ecfdf5' : '#fffbeb', border: `2px solid ${balance <= 0 ? '#10b981' : '#f59e0b'}`, padding: '1.25rem', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Balance Due</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: balance <= 0 ? '#059669' : '#d97706' }}>${balance.toFixed(2)}</div>
            </div>
        </div>

        {/* Main Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Services Card */}
                <div className="inv-card" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div className="inv-card-header" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-stethoscope" style={{ color: '#6366f1' }}></i>
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 750, color: '#1e293b' }}>Services Rendered</h3>
                    </div>
                    <div className="inv-card-body" style={{ padding: '1.25rem' }}>
                        {(!renderedServices || renderedServices.length === 0) ? (
                            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No services added to this invoice yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {renderedServices.map((svc: any) => (
                                    <div key={svc.appointment_service_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{svc.services?.name || 'Unknown Service'}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{svc.services?.category}</div>
                                        </div>
                                        <div style={{ fontWeight: 700, color: '#059669' }}>
                                            ${Number(svc.service_price_snapshot).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {invoice.payment_status !== 'paid' && (
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                                <AddServiceForm 
                                    action={addServiceToInvoice} 
                                    services={allServices || []} 
                                    billingId={invoice.billing_id} 
                                    appointmentId={invoice.appointment_id} 
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment History */}
                <div className="inv-card" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div className="inv-card-header" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-money-bill-wave" style={{ color: '#6366f1' }}></i>
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 750, color: '#1e293b' }}>Payment History</h3>
                    </div>
                    {(!payments || payments.length === 0) ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                            <i className="fas fa-receipt" style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#cbd5e1' }}></i>
                            <div>No payments recorded yet.</div>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Method</th>
                                    <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Ref</th>
                                    <th style={{ textAlign: 'right', padding: '1rem', borderBottom: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p: any) => (
                                    <tr key={p.payment_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{new Date(p.payment_date).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}><span style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{p.payment_method}</span></td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{p.reference_no || '-'}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.85rem', textAlign: 'right', fontWeight: 600, color: '#059669' }}>${Number(p.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Record Payment Form */}
                {balance > 0 && (
                    <RecordPaymentForm 
                        action={recordPayment}
                        billingId={invoice.billing_id}
                        balance={balance}
                    />
                )}

                {/* Client Info */}
                <div className="inv-card" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div className="inv-card-header" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-user" style={{ color: '#6366f1' }}></i>
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 750, color: '#1e293b' }}>Client Details</h3>
                    </div>
                    <div className="inv-card-body" style={{ padding: '1.25rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}><strong>Name:</strong> {owner?.first_name} {owner?.last_name}</div>
                        <div style={{ marginBottom: '0.5rem' }}><strong>Phone:</strong> {owner?.phone || 'N/A'}</div>
                        <div style={{ marginBottom: '0.5rem' }}><strong>Email:</strong> {owner?.email || 'N/A'}</div>
                        <div style={{ marginBottom: '0.5rem' }}><strong>Address:</strong> {owner?.address || 'N/A'}</div>
                    </div>
                </div>

                {/* Patient Info */}
                <div className="inv-card" style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div className="inv-card-header" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-paw" style={{ color: '#6366f1' }}></i>
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 750, color: '#1e293b' }}>Patient Details</h3>
                    </div>
                    <div className="inv-card-body" style={{ padding: '1.25rem' }}>
                        <div style={{ marginBottom: '0.5rem' }}><strong>Patient:</strong> {pet?.name}</div>
                        <div style={{ marginBottom: '0.5rem' }}><strong>Species:</strong> {pet?.species}</div>
                        <div style={{ marginBottom: '0.5rem' }}><strong>Breed:</strong> {pet?.breed || 'N/A'}</div>
                        <div style={{ marginBottom: '0.5rem' }}><strong>Appt Date:</strong> {new Date(invoice.appointments?.appointment_date).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  );
}

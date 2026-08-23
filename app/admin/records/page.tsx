import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function RecordsPage() {
  const supabase = await createClient();
  
  const { data: records, error } = await supabase
    .from('medical_records')
    .select(`
      record_id,
      diagnosis,
      created_at,
      appointment:appointments (
        appointment_date,
        staff:staff (
          first_name,
          last_name
        )
      ),
      pet:pets (
        name,
        owner:owners (
          first_name,
          last_name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching records:', error);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--text-dark)' }}>Clinical Records</h2>
        <a href="/admin/records/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          <i className="fas fa-plus-circle"></i> New Clinical Entry
        </a>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Header Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 2fr 1.5fr 1fr 120px', gap: '2rem', padding: '0 2rem 1rem', color: 'var(--text-light)', fontSize: '0.7rem', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '1px' }}>
            <div>Clinical Subject</div>
            <div>Diagnostic Assessment</div>
            <div>Consultation Meta</div>
            <div>Attending</div>
            <div style={{ textAlign: 'right' }}>Operations</div>
        </div>

        {(!records || records.length === 0) ? (
            <div style={{ padding: '4rem', textAlign: 'center', background: 'var(--white)', borderRadius: '12px', border: '1px dashed var(--system-border)' }}>
                <i className="fas fa-folder-open" style={{ fontSize: '3rem', color: 'var(--text-light)', opacity: 0.2, marginBottom: '1.5rem' }}></i>
                <h3 style={{ color: 'var(--text-dark)', fontWeight: 800 }}>No clinical records found</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Start by creating a new session assessment.</p>
            </div>
        ) : (
            records.map((record: any) => {
                const petName = record.pet?.name || 'Unknown Pet';
                const ownerName = record.pet?.owner ? `${record.pet.owner.first_name} ${record.pet.owner.last_name}` : 'Unknown Owner';
                const vetName = record.appointment?.staff ? `Dr. ${record.appointment.staff.last_name}` : 'Staff';
                const appointmentDate = record.appointment?.appointment_date || record.created_at;

                return (
                    <div key={record.record_id} className="admin-list-card" style={{ padding: '1.25rem 2rem', display: 'grid', gridTemplateColumns: '2.5fr 2fr 1.5fr 1fr 120px', alignItems: 'center', gap: '2rem', background: 'var(--white)', borderRadius: '12px', border: '1px solid var(--system-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        {/* Patient & Owner */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ width: '44px', height: '44px', background: 'var(--bg-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: 'var(--primary-color)' }}>
                                <i className="fas fa-paw"></i>
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.2rem' }}>
                                    <span style={{ fontWeight: 800, color: 'var(--text-dark)', fontSize: '1rem' }}>{petName}</span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>Owner: <span style={{ color: 'var(--text-dark)' }}>{ownerName}</span></div>
                            </div>
                        </div>

                        {/* Diagnosis */}
                        <div style={{ paddingRight: '1.5rem' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-dark)', fontWeight: 600, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {record.diagnosis}
                            </div>
                        </div>

                        {/* Date & Badge */}
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.25rem' }}>
                                {new Date(appointmentDate).toLocaleDateString()}
                            </div>
                            <div className="badge" style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.55rem', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                                <i className="fas fa-file-medical"></i> CLINICAL RECORD
                            </div>
                        </div>

                        {/* Vet */}
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '24px', height: '24px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#64748b' }}>
                                <i className="fas fa-user-md"></i>
                            </div>
                            {vetName}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <a href={`/admin/records/${record.record_id}`} className="btn" style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)', border: '1px solid var(--system-border)', color: 'var(--text-light)', borderRadius: '8px', textDecoration: 'none' }} title="Full Review">
                                <i className="fas fa-expand-alt" style={{ fontSize: '0.85rem' }}></i>
                            </a>
                            <a href={`/admin/records/${record.record_id}/edit`} className="btn" style={{ width: '36px', height: '36px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', textDecoration: 'none' }} title="Modify Case">
                                <i className="fas fa-edit" style={{ fontSize: '0.9rem' }}></i>
                            </a>
                        </div>
                    </div>
                );
            })
        )}
      </div>
    </div>
  );
}

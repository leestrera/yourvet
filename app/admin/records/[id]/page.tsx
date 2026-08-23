import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function ViewRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  
  const { data: record, error } = await supabase
    .from('medical_records')
    .select(`
      *,
      appointment:appointments (
        appointment_date,
        staff:staff (first_name, last_name)
      ),
      pet:pets (
          name, 
          species, 
          breed, 
          gender, 
          date_of_birth,
          owner:owners(first_name, last_name, phone)
      )
    `)
    .eq('record_id', (await params).id)
    .single();

  if (error || !record) {
    return <div style={{ padding: '2rem' }}>Record not found.</div>;
  }

  const petName = record.pet?.name || 'Unknown Pet';
  const ownerName = record.pet?.owner ? `${record.pet.owner.first_name} ${record.pet.owner.last_name}` : 'Unknown Owner';
  const vetName = record.appointment?.staff ? `Dr. ${record.appointment.staff.last_name}` : 'Staff';
  const apptDate = new Date(record.appointment?.appointment_date || record.created_at).toLocaleDateString();

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--primary-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.25rem' }}>
                <i className="fas fa-file-medical"></i>
            </div>
            <div>
                <h2 style={{ fontWeight: 800, color: 'var(--text-dark)', margin: 0, fontSize: '1.35rem', letterSpacing: '-0.5px' }}>Clinical Record Review</h2>
                <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>
                    {apptDate} • Administered by {vetName}
                </div>
            </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a href="/admin/records" className="btn btn-secondary" style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, background: '#f8fafc', borderColor: '#e2e8f0', color: '#475569', textDecoration: 'none' }}>
                <i className="fas fa-arrow-left"></i> Back
            </a>
            <a href={`/admin/records/${record.record_id}/edit`} className="btn btn-primary" style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, background: 'var(--primary-color)', color: 'white', textDecoration: 'none', border: 'none' }}>
                <i className="fas fa-edit"></i> Edit Record
            </a>
            <button className="btn btn-secondary" style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, background: '#f8fafc', borderColor: '#e2e8f0', color: '#475569' }} onClick={() => window.print()}>
                <i className="fas fa-print"></i> Print
            </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          {/* Left sidebar: Meta info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-paw" style={{ color: 'var(--primary-color)' }}></i> Patient Info
                  </h3>
                  <div style={{ fontSize: '0.9rem' }}>
                      <strong style={{ fontSize: '1.1rem' }}>{petName}</strong><br/>
                      <span style={{ color: 'var(--text-light)' }}>{record.pet?.species} • {record.pet?.breed}</span><br/><br/>
                      <strong>Gender:</strong> {record.pet?.gender}<br/>
                      <strong>Owner:</strong> {ownerName}<br/>
                      <strong>Contact:</strong> {record.pet?.owner?.phone}
                  </div>
              </div>

              <div className="form-card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-heartbeat" style={{ color: 'var(--primary-color)' }}></i> Vitals
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-light)' }}>Weight:</span>
                          <strong>{record.weight_kg ? `${record.weight_kg} kg` : 'N/A'}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-light)' }}>Temperature:</span>
                          <strong>{record.temperature_c ? `${record.temperature_c} °C` : 'N/A'}</strong>
                      </div>
                  </div>
              </div>

              {record.follow_up_date && (
                <div className="form-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary-color)' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-calendar-alt" style={{ color: 'var(--primary-color)' }}></i> Follow-up
                    </h3>
                    <div style={{ fontSize: '0.9rem' }}>
                        <strong>{new Date(record.follow_up_date).toLocaleDateString()}</strong><br/>
                        <span style={{ color: 'var(--text-light)' }}>{record.follow_up_notes}</span>
                    </div>
                </div>
              )}
          </div>

          {/* Right main: Clinical Data */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="form-card" style={{ padding: '2rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--primary-color)' }}>Primary Assessment / Diagnosis</h3>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-dark)' }}>{record.diagnosis}</p>
              </div>

              {record.treatment && (
                  <div className="form-card" style={{ padding: '2rem' }}>
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Procedures & Treatment</h3>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-dark)' }}>{record.treatment}</p>
                  </div>
              )}

              {record.prescribed_meds && (
                  <div className="form-card" style={{ padding: '2rem' }}>
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Medications</h3>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-dark)' }}>{record.prescribed_meds}</p>
                  </div>
              )}

              {record.vet_remarks && (
                  <div className="form-card" style={{ padding: '2rem', background: '#fafafa', borderStyle: 'dashed' }}>
                      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: 'var(--text-light)' }}>Internal Team Notes</h3>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--text-light)' }}>{record.vet_remarks}</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}

import React from 'react';
import { editRecord } from '../../actions';
import { createClient } from '@/utils/supabase/server';

export default async function EditRecordPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  
  const { data: record, error } = await supabase
    .from('medical_records')
    .select(`
      *,
      appointment:appointments (
        appointment_date,
        staff:staff (last_name)
      ),
      pet:pets (name, owner:owners(first_name, last_name))
    `)
    .eq('record_id', (await params).id)
    .single();

  if (error || !record) {
    return <div style={{ padding: '2rem' }}>Record not found.</div>;
  }

  const petName = record.pet?.name || 'Unknown Pet';
  const apptDate = new Date(record.appointment?.appointment_date || record.created_at).toLocaleDateString();

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '1.25rem' }}>
                <i className="fas fa-edit"></i>
            </div>
            <div>
                <h2 style={{ fontWeight: 800, color: 'var(--text-dark)', margin: 0, fontSize: '1.35rem', letterSpacing: '-0.5px' }}>Modify Clinical Record</h2>
                <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>
                    {petName} • {apptDate}
                </div>
            </div>
        </div>
        <a href="/admin/records" className="btn btn-secondary" style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, background: '#f8fafc', borderColor: '#e2e8f0', color: '#475569', textDecoration: 'none' }}>
            <i className="fas fa-arrow-left"></i> Back to List
        </a>
      </div>

      <form action={editRecord} className="admin-form">
        <input type="hidden" name="record_id" value={record.record_id} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem', marginBottom: '2rem' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div className="form-card" style={{ padding: '1.75rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
                        <i className="fas fa-info-circle" style={{ color: 'var(--primary-color)' }}></i> Reference
                    </h4>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                        <strong>Patient:</strong> {petName} <br/>
                        <strong>Owner:</strong> {record.pet?.owner?.first_name} {record.pet?.owner?.last_name} <br/>
                        <strong>Date:</strong> {apptDate}
                    </div>
                </div>

                <div className="form-card" style={{ padding: '1.75rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
                        <i className="fas fa-heartbeat" style={{ color: 'var(--primary-color)' }}></i> Clinical Vitals
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Patient Weight (kg)</label>
                            <input type="number" name="weight_kg" step="0.01" min="0.1" max="200" defaultValue={record.weight_kg} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Body Temperature (°C)</label>
                            <input type="number" name="temperature_c" step="0.1" min="30" max="45" defaultValue={record.temperature_c} />
                        </div>
                    </div>
                </div>

                <div className="form-card" style={{ padding: '1.75rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
                        <i className="fas fa-calendar-alt" style={{ color: 'var(--primary-color)' }}></i> Follow-up
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Target Date</label>
                            <input type="date" name="follow_up_date" defaultValue={record.follow_up_date} />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Clinical Focus</label>
                            <input type="text" name="follow_up_notes" defaultValue={record.follow_up_notes} />
                        </div>
                    </div>
                </div>

            </div>

            {/* Right Column */}
            <div className="form-card" style={{ padding: '2.5rem' }}>
                <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
                    <i className="fas fa-notes-medical" style={{ color: 'var(--primary-color)' }}></i> Assessment & Clinical Plan
                </h4>
                
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label style={{ color: 'var(--primary-color)' }}>Primary Assessment Findings <span className="required">*</span></label>
                    <textarea name="diagnosis" rows={5} required defaultValue={record.diagnosis} style={{ width: '100%', minHeight: '150px' }}></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label>Procedures & Care Administered</label>
                    <textarea name="treatment" rows={4} defaultValue={record.treatment} style={{ width: '100%' }}></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                    <label>Medications & Active Prescriptions</label>
                    <textarea name="prescribed_meds" rows={4} defaultValue={record.prescribed_meds} style={{ width: '100%' }}></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                    <label>Internal Team Notes</label>
                    <textarea name="vet_remarks" rows={2} defaultValue={record.vet_remarks} style={{ width: '100%', background: '#fafafa', borderStyle: 'dashed' }}></textarea>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.1rem', borderRadius: '10px', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer' }}>
                        <i className="fas fa-save"></i> UPDATE MEDICAL RECORD
                    </button>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
}

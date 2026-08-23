import React from 'react';
import { addRecord } from '../actions';
import { createClient } from '@/utils/supabase/server';

export default async function NewRecordPage() {
  const supabase = await createClient();
  
  // Fetch only appointments without an existing medical record
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      appointment_id,
      appointment_date,
      pet:pets (name),
      staff:staff (first_name, last_name)
    `)
    .in('status', ['pending', 'confirmed'])
    .order('appointment_date', { ascending: false });

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '1.25rem' }}>
                <i className="fas fa-plus-circle"></i>
            </div>
            <div>
                <h2 style={{ fontWeight: 800, color: 'var(--text-dark)', margin: 0, fontSize: '1.35rem', letterSpacing: '-0.5px' }}>Initialize Clinical Record</h2>
                <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>
                    Assess New Visit • <span style={{ color: 'var(--primary-color)' }}>Step 2 of 2</span>
                </div>
            </div>
        </div>
        <a href="/admin/records" className="btn btn-secondary" style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, background: '#f8fafc', borderColor: '#e2e8f0', color: '#475569', textDecoration: 'none' }}>
            <i className="fas fa-arrow-left"></i> Back to List
        </a>
      </div>

      <form action={addRecord} className="admin-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem', marginBottom: '2rem' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div className="form-card" style={{ padding: '1.75rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
                        <i className="fas fa-calendar-check" style={{ color: 'var(--primary-color)' }}></i> Registration
                    </h4>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Linked Appointment <span className="required">*</span></label>
                        <select name="appointment_id" required>
                            <option value="">Select visit assessment...</option>
                            {appointments?.map((appt: any) => (
                                <option key={appt.appointment_id} value={appt.appointment_id}>
                                    {new Date(appt.appointment_date).toLocaleDateString()} - {appt.pet?.name || 'Unknown'} (Dr. {appt.staff?.last_name || 'Staff'})
                                </option>
                            ))}
                        </select>
                        <p style={{ fontSize: '0.7rem', color: 'var(--primary-color)', marginTop: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <i className="fas fa-info-circle"></i> Only pending/confirmed assessments listed.
                        </p>
                    </div>
                </div>

                <div className="form-card" style={{ padding: '1.75rem' }}>
                    <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)' }}>
                        <i className="fas fa-heartbeat" style={{ color: 'var(--primary-color)' }}></i> Clinical Vitals
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Patient Weight (kg)</label>
                            <input type="number" name="weight_kg" step="0.01" min="0.1" max="200" placeholder="0.00" />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Body Temperature (°C)</label>
                            <input type="number" name="temperature_c" step="0.1" min="30" max="45" placeholder="38.5" />
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
                            <input type="date" name="follow_up_date" />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Clinical Focus</label>
                            <input type="text" name="follow_up_notes" placeholder="Objective..." />
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
                    <textarea name="diagnosis" rows={5} required placeholder="Enter clinical assessment..." style={{ width: '100%', minHeight: '150px' }}></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label>Procedures & Care Administered</label>
                    <textarea name="treatment" rows={4} placeholder="Treatment protocols applied..." style={{ width: '100%' }}></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                    <label>Medications & Active Prescriptions</label>
                    <textarea name="prescribed_meds" rows={4} placeholder="List medications..." style={{ width: '100%' }}></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                    <label>Internal Team Notes</label>
                    <textarea name="vet_remarks" rows={2} placeholder="Confidential clinical notes..." style={{ width: '100%', background: '#fafafa', borderStyle: 'dashed' }}></textarea>
                </div>

                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.1rem', borderRadius: '10px', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: 'var(--primary-color)', color: 'white', border: 'none', cursor: 'pointer' }}>
                        <i className="fas fa-check-circle"></i> INITIALIZE MEDICAL RECORD
                    </button>
                    <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', opacity: 0.7 }}>
                        <span className="badge" style={{ background: '#dcfce7', color: '#166534', fontSize: '0.65rem' }}>
                            <i className="fas fa-history"></i> LIFELONG SYNC
                        </span>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', margin: 0, fontWeight: 600 }}>Record will be instantly committed to patient history.</p>
                    </div>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
}

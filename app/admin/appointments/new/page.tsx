import React from 'react';
import { createAppointment } from '../actions';
import { createClient } from '@/utils/supabase/server';

export default async function NewAppointmentPage() {
  const supabase = await createClient();
  
  const [{ data: pets }, { data: staff }, { data: services }] = await Promise.all([
    supabase.from('pets').select('pet_id, name, owners(first_name, last_name)').order('name'),
    supabase.from('staff').select('staff_id, first_name, last_name, specialization').order('last_name'),
    supabase.from('services').select('service_id, name, category, base_price').eq('is_active', true).order('name')
  ]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '1.25rem' }}>
                <i className="fas fa-calendar-plus"></i>
            </div>
            <div>
                <h2 style={{ fontWeight: 800, color: 'var(--text-dark)', margin: 0, fontSize: '1.35rem', letterSpacing: '-0.5px' }}>New Appointment</h2>
                <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>
                    Create a new appointment for walk-ins, emergencies, or scheduled visits.
                </div>
            </div>
        </div>
        <a href="/admin/appointments" className="btn btn-secondary" style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, background: '#f8fafc', borderColor: '#e2e8f0', color: '#475569', textDecoration: 'none' }}>
            <i className="fas fa-arrow-left"></i> Back to Appointments
        </a>
      </div>

      <form action={createAppointment} className="admin-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '2rem' }}>
            
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div className="form-card" style={{ padding: '1.75rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)', fontSize: '1rem', fontWeight: 700 }}>
                        <i className="fas fa-paw" style={{ color: 'var(--primary-color)' }}></i> Patient & Visit Information
                    </h4>
                    
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Select Pet / Owner <span style={{ color: '#ef4444' }}>*</span></label>
                        <select name="pet_id" required style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem' }}>
                            <option value="">-- Search for a pet --</option>
                            {pets?.map((pet: any) => (
                                <option key={pet.pet_id} value={pet.pet_id}>
                                    {pet.name} — Owner: {pet.owners?.first_name} {pet.owners?.last_name}
                                </option>
                            ))}
                        </select>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Can't find the pet? <a href="/admin/clients/new" style={{ color: 'var(--primary-color)' }}>Add a new client/pet first</a>.</p>
                    </div>

                    <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Visit Type <span style={{ color: '#ef4444' }}>*</span></label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <label className="visit-type-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <input type="radio" name="visit_type" value="scheduled" defaultChecked style={{ display: 'none' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <i className="fas fa-calendar-alt" style={{ display: 'block', fontSize: '1.25rem', marginBottom: '0.25rem', color: '#64748b' }}></i>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Scheduled</span>
                                </div>
                            </label>
                            <label className="visit-type-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <input type="radio" name="visit_type" value="walk_in" style={{ display: 'none' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <i className="fas fa-walking" style={{ display: 'block', fontSize: '1.25rem', marginBottom: '0.25rem', color: '#64748b' }}></i>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Walk-in</span>
                                </div>
                            </label>
                            <label className="visit-type-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                <input type="radio" name="visit_type" value="emergency" style={{ display: 'none' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <i className="fas fa-ambulance" style={{ display: 'block', fontSize: '1.25rem', marginBottom: '0.25rem', color: '#64748b' }}></i>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Emergency</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Date <span style={{ color: '#ef4444' }}>*</span></label>
                            <input type="date" name="appointment_date" required defaultValue={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Time <span style={{ color: '#ef4444' }}>*</span></label>
                            <input type="time" name="appointment_time" required defaultValue="10:00" style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px' }} />
                        </div>
                    </div>
                </div>

                <div className="form-card" style={{ padding: '1.75rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)', fontSize: '1rem', fontWeight: 700 }}>
                        <i className="fas fa-tasks" style={{ color: 'var(--primary-color)' }}></i> Assignment & Status
                    </h4>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Assign Staff (Optional)</label>
                        <select name="staff_id" style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem' }}>
                            <option value="">-- No assignment --</option>
                            {staff?.map((member: any) => (
                                <option key={member.staff_id} value={member.staff_id}>
                                    {member.first_name} {member.last_name} ({member.specialization})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Initial Status <span style={{ color: '#ef4444' }}>*</span></label>
                        <select name="status" required style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem' }}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Internal Notes (Optional)</label>
                        <textarea name="notes" rows={3} placeholder="Symptoms, reason for visit, or instructions..." style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px' }}></textarea>
                    </div>
                </div>

            </div>

            {/* Right Column */}
            <div className="form-card" style={{ padding: '1.75rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)', fontSize: '1rem', fontWeight: 700 }}>
                    <i className="fas fa-stethoscope" style={{ color: 'var(--primary-color)' }}></i> Services Selection
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>Select all services that apply. Billing will be auto-calculated.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {services?.map((service: any) => (
                        <label key={service.service_id} className="service-option" style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <input type="checkbox" name="service_ids" value={service.service_id} data-price={service.base_price} className="service-checkbox" style={{ width: '20px', height: '20px', marginRight: '1rem', accentColor: '#6366f1' }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{service.name}</div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{service.category}</div>
                            </div>
                            <div style={{ fontWeight: 700, color: '#059669' }}>₱{Number(service.base_price).toFixed(2)}</div>
                        </label>
                    ))}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-check-circle"></i>
                        Create Appointment & Invoice
                    </button>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
}

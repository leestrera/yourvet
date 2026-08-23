import React from 'react';
import { updateAppointment } from '../../actions';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';

export default async function EditAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id: appointmentId } = await params;
  
  const [
    { data: appointment },
    { data: staff },
    { data: services },
    { data: assignedServices }
  ] = await Promise.all([
    supabase.from('appointments').select('*, pet:pets(name, owners(first_name, last_name))').eq('appointment_id', appointmentId).single(),
    supabase.from('staff').select('staff_id, first_name, last_name, specialization').order('last_name'),
    supabase.from('services').select('service_id, name, category, base_price').eq('is_active', true).order('name'),
    supabase.from('appointment_services').select('service_id').eq('appointment_id', appointmentId)
  ]);

  if (!appointment) return notFound();

  const assignedServiceIds = assignedServices?.map((s: any) => s.service_id) || [];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '1.25rem' }}>
                <i className="fas fa-edit"></i>
            </div>
            <div>
                <h2 style={{ fontWeight: 800, color: 'var(--text-dark)', margin: 0, fontSize: '1.35rem', letterSpacing: '-0.5px' }}>Edit Appointment</h2>
                <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>
                    {appointment.pet?.name} (Owner: {appointment.pet?.owners?.first_name} {appointment.pet?.owners?.last_name})
                </div>
            </div>
        </div>
        <a href={`/admin/appointments/${appointmentId}`} className="btn btn-secondary" style={{ padding: '0.65rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, background: '#f8fafc', borderColor: '#e2e8f0', color: '#475569', textDecoration: 'none' }}>
            <i className="fas fa-arrow-left"></i> Back to Details
        </a>
      </div>

      <form action={updateAppointment} className="admin-form">
        <input type="hidden" name="appointment_id" value={appointmentId} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '2rem' }}>
            
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                
                <div className="form-card" style={{ padding: '1.75rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)', fontSize: '1rem', fontWeight: 700 }}>
                        <i className="fas fa-paw" style={{ color: 'var(--primary-color)' }}></i> Visit Information
                    </h4>
                    
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Visit Type <span style={{ color: '#ef4444' }}>*</span></label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <label className="visit-type-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', background: appointment.visit_type === 'scheduled' ? '#e0e7ff' : 'transparent', borderColor: appointment.visit_type === 'scheduled' ? '#6366f1' : '#e2e8f0' }}>
                                <input type="radio" name="visit_type" value="scheduled" defaultChecked={appointment.visit_type === 'scheduled'} style={{ display: 'none' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <i className="fas fa-calendar-alt" style={{ display: 'block', fontSize: '1.25rem', marginBottom: '0.25rem', color: appointment.visit_type === 'scheduled' ? '#4f46e5' : '#64748b' }}></i>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: appointment.visit_type === 'scheduled' ? '#4f46e5' : '#475569' }}>Scheduled</span>
                                </div>
                            </label>
                            <label className="visit-type-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', background: appointment.visit_type === 'walk_in' ? '#e0e7ff' : 'transparent', borderColor: appointment.visit_type === 'walk_in' ? '#6366f1' : '#e2e8f0' }}>
                                <input type="radio" name="visit_type" value="walk_in" defaultChecked={appointment.visit_type === 'walk_in'} style={{ display: 'none' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <i className="fas fa-walking" style={{ display: 'block', fontSize: '1.25rem', marginBottom: '0.25rem', color: appointment.visit_type === 'walk_in' ? '#4f46e5' : '#64748b' }}></i>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: appointment.visit_type === 'walk_in' ? '#4f46e5' : '#475569' }}>Walk-in</span>
                                </div>
                            </label>
                            <label className="visit-type-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', background: appointment.visit_type === 'emergency' ? '#fee2e2' : 'transparent', borderColor: appointment.visit_type === 'emergency' ? '#ef4444' : '#e2e8f0' }}>
                                <input type="radio" name="visit_type" value="emergency" defaultChecked={appointment.visit_type === 'emergency'} style={{ display: 'none' }} />
                                <div style={{ textAlign: 'center' }}>
                                    <i className="fas fa-ambulance" style={{ display: 'block', fontSize: '1.25rem', marginBottom: '0.25rem', color: appointment.visit_type === 'emergency' ? '#dc2626' : '#64748b' }}></i>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: appointment.visit_type === 'emergency' ? '#dc2626' : '#475569' }}>Emergency</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Date <span style={{ color: '#ef4444' }}>*</span></label>
                            <input type="date" name="appointment_date" required defaultValue={appointment.appointment_date} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px' }} />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Time <span style={{ color: '#ef4444' }}>*</span></label>
                            <input type="time" name="appointment_time" required defaultValue={appointment.appointment_time} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px' }} />
                        </div>
                    </div>
                </div>

                <div className="form-card" style={{ padding: '1.75rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)', fontSize: '1rem', fontWeight: 700 }}>
                        <i className="fas fa-tasks" style={{ color: 'var(--primary-color)' }}></i> Assignment & Status
                    </h4>
                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Assign Staff (Optional)</label>
                        <select name="staff_id" defaultValue={appointment.staff_id || ''} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem' }}>
                            <option value="">-- No assignment --</option>
                            {staff?.map((member: any) => (
                                <option key={member.staff_id} value={member.staff_id}>
                                    {member.first_name} {member.last_name} ({member.specialization})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Status <span style={{ color: '#ef4444' }}>*</span></label>
                        <select name="status" required defaultValue={appointment.status} style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px', fontSize: '0.95rem' }}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="no_show">No Show</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Internal Notes (Optional)</label>
                        <textarea name="notes" rows={3} defaultValue={appointment.notes || ''} placeholder="Symptoms, reason for visit, or instructions..." style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '10px' }}></textarea>
                    </div>
                </div>

            </div>

            {/* Right Column */}
            <div className="form-card" style={{ padding: '1.75rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dark)', fontSize: '1rem', fontWeight: 700 }}>
                    <i className="fas fa-stethoscope" style={{ color: 'var(--primary-color)' }}></i> Services Selection
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>Modify the selected services. Billing will be automatically updated.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {services?.map((service: any) => {
                        const isSelected = assignedServiceIds.includes(service.service_id);
                        return (
                            <label key={service.service_id} className="service-option" style={{ display: 'flex', alignItems: 'center', padding: '1rem', border: `2px solid ${isSelected ? '#6366f1' : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', background: isSelected ? '#e0e7ff' : 'transparent' }}>
                                <input type="checkbox" name="service_ids" value={service.service_id} defaultChecked={isSelected} className="service-checkbox" style={{ width: '20px', height: '20px', marginRight: '1rem', accentColor: '#6366f1' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{service.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{service.category}</div>
                                </div>
                                <div style={{ fontWeight: 700, color: '#059669' }}>₱{Number(service.base_price).toFixed(2)}</div>
                            </label>
                        );
                    })}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', justifyContent: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-save"></i>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
      </form>
    </div>
  );
}

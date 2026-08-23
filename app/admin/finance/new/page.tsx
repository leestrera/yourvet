import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { createInvoice } from '../actions';

export default async function NewInvoicePage() {
  const supabase = await createClient();
  
  // Fetch appointments that DO NOT already have a billing record
  // We can do this by getting all appointments and filtering out ones that exist in billing
  const { data: billedAppts } = await supabase.from('billing').select('appointment_id');
  const billedIds = billedAppts?.map(b => b.appointment_id) || [];

  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
        appointment_id,
        appointment_date,
        pets:pet_id (
            name,
            owners:owner_id (
                first_name,
                last_name
            )
        )
    `)
    .order('appointment_date', { ascending: false });

  const unbilledAppointments = appointments?.filter(a => !billedIds.includes(a.appointment_id)) || [];

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/admin/finance" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back
        </a>
        <h2 style={{ margin: 0, fontWeight: 800 }}>Create New Invoice</h2>
      </div>

      <div className="form-card">
        <form action={createInvoice} className="admin-form">
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-calendar-check"></i> Select Appointment</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                Select an appointment to generate a billing statement. Once created, you can add services and record payments.
            </p>
            <div className="form-group form-group-full">
              <label>Appointment <span className="required">*</span></label>
              <select name="appointment_id" required>
                  <option value="">-- Choose an appointment --</option>
                  {unbilledAppointments.map((appt: any) => (
                      <option key={appt.appointment_id} value={appt.appointment_id}>
                          {new Date(appt.appointment_date).toLocaleDateString()} - {appt.pets?.name} ({appt.pets?.owners?.first_name} {appt.pets?.owners?.last_name})
                      </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="form-card-actions">
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Initialize Invoice <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

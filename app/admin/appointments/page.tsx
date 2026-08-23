import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { updateAppointmentStatus } from './actions';
import ClientSearch from './ClientSearch';
import StatusSelect from './StatusSelect';
import DeleteAppointmentButton from './DeleteAppointmentButton';

export default async function AdminAppointments() {
  const supabase = await createClient();
  
  const { data: appointments, error } = await supabase
    .from('appointments')
    .select(`
      appointment_id,
      appointment_date,
      appointment_time,
      status,
      visit_type,
      notes,
      created_at,
      pets (
        name,
        species,
        owners (
          first_name,
          last_name,
          email,
          phone
        )
      )
    `)
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="admin-list-container">
      <ClientSearch />

      <div id="appointmentList">
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment: any) => {
            const ownerName = appointment.pets?.owners ? `${appointment.pets.owners.first_name} ${appointment.pets.owners.last_name}` : 'Unknown Owner';
            const petName = appointment.pets?.name || 'Unknown Pet';
            const searchContent = `${ownerName} ${petName} ${appointment.status || ''}`.toLowerCase();
            const status = appointment.status || 'pending';
            const visitType = appointment.visit_type || 'scheduled';
            
            return (
              <div 
                key={appointment.appointment_id} 
                className={`admin-list-card ${status === 'pending' ? 'unread' : ''} appointment-item`} 
                data-search-content={searchContent}
              >
                <div className="list-card-header">
                  <div className="list-card-info">
                      <div className="list-card-title">{ownerName}</div>
                      <div className="list-card-subtitle">Pet: {petName} • ID #{appointment.appointment_id}</div>
                  </div>
                  <div className="list-card-status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {visitType !== 'scheduled' && (
                          <span className="badge" style={{ 
                            background: visitType === 'emergency' ? '#fef2f2' : '#fffbeb', 
                            color: visitType === 'emergency' ? '#dc2626' : '#d97706',
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '6px', 
                            fontSize: '0.7rem', 
                            fontWeight: 600 
                          }}>
                            {visitType.charAt(0).toUpperCase() + visitType.slice(1)}
                          </span>
                      )}
                      <StatusSelect appointmentId={appointment.appointment_id} currentStatus={status} />
                  </div>
                </div>
                
                <div className="list-card-meta">
                  <div className="list-card-meta-item">
                      <i className="fas fa-calendar"></i>
                      <span>{new Date(appointment.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {appointment.appointment_time && (
                      <div className="list-card-meta-item">
                          <i className="fas fa-clock"></i>
                          <span>{appointment.appointment_time.substring(0, 5)}</span>
                      </div>
                  )}
                  {appointment.pets?.owners?.email && (
                      <div className="list-card-meta-item">
                          <i className="fas fa-envelope"></i>
                          <span>{appointment.pets.owners.email}</span>
                      </div>
                  )}
                </div>
                
                <div className="list-card-actions">
                  <a href={`/admin/appointments/${appointment.appointment_id}`} className="action-btn action-btn-view">
                      <i className="fas fa-eye"></i> View Details
                  </a>
                  <a href={`/admin/appointments/${appointment.appointment_id}/edit`} className="action-btn action-btn-edit">
                      <i className="fas fa-edit"></i> Edit
                  </a>
                  <DeleteAppointmentButton appointmentId={appointment.appointment_id} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="dashboard-empty">
              <i className="fas fa-calendar-plus"></i>
              <p>No appointments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

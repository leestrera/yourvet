'use client';
import React from 'react';
import { updateAppointmentStatus } from './actions';

export default function DeleteAppointmentButton({ appointmentId }: { appointmentId: number }) {
    return (
        <form 
            action={updateAppointmentStatus} 
            style={{ display: 'inline' }} 
            onSubmit={(e) => {
                if (!window.confirm('Are you sure you want to delete this appointment?')) {
                    e.preventDefault();
                }
            }}
        >
            <input type="hidden" name="action" value="delete" />
            <input type="hidden" name="appointment_id" value={appointmentId} />
            <button type="submit" className="action-btn action-btn-delete">
                <i className="fas fa-trash"></i> Delete
            </button>
        </form>
    );
}

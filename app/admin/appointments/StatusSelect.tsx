'use client';
import React from 'react';
import { updateAppointmentStatus } from './actions';

export default function StatusSelect({ appointmentId, currentStatus }: { appointmentId: number, currentStatus: string }) {
    return (
        <form action={updateAppointmentStatus} style={{ display: 'inline' }}>
            <input type="hidden" name="appointment_id" value={appointmentId} />
            <select 
                name="status" 
                defaultValue={currentStatus} 
                onChange={(e) => e.target.form?.requestSubmit()} 
                className="inline-status-select"
            >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </form>
    );
}

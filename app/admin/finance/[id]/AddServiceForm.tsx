'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="btn btn-secondary" disabled={pending} style={{ padding: '0.6rem 1rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: pending ? 'not-allowed' : 'pointer' }}>
            {pending ? 'Adding...' : 'Add'}
        </button>
    );
}

export default function AddServiceForm({ action, services, billingId, appointmentId }: any) {
    return (
        <form action={action} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="hidden" name="billing_id" value={billingId} />
            <input type="hidden" name="appointment_id" value={appointmentId} />
            
            <select name="service_id" required style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <option value="">-- Add a service --</option>
                {services.map((s: any) => (
                    <option key={s.service_id} value={s.service_id}>{s.name} - ${s.base_price}</option>
                ))}
            </select>
            
            <SubmitButton />
        </form>
    );
}

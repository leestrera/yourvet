'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="inv-record-btn" disabled={pending} style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.7 : 1 }}>
            {pending ? 'Recording...' : 'Record Payment'}
        </button>
    );
}

export default function RecordPaymentForm({ action, billingId, balance }: any) {
    return (
        <div className="inv-card">
            <div className="inv-card-header" style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-hand-holding-usd" style={{ color: '#10b981' }}></i>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 750, color: '#1e293b' }}>Record Payment</h3>
            </div>
            <div className="inv-card-body" style={{ padding: '1.25rem' }}>
                <form action={action}>
                    <input type="hidden" name="billing_id" value={billingId} />
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Amount ($)</label>
                        <input type="number" name="amount" step="0.01" min="0.01" max={balance} defaultValue={balance.toFixed(2)} required style={{ width: '100%', padding: '0.7rem', border: '2px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }} />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Payment Method</label>
                        <select name="payment_method" required style={{ width: '100%', padding: '0.7rem', border: '2px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }}>
                            <option value="Cash">Cash</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Debit Card">Debit Card</option>
                            <option value="Online Transfer">Online Transfer</option>
                            <option value="Insurance">Insurance</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>Reference (Optional)</label>
                        <input type="text" name="reference_no" placeholder="Transaction ID" style={{ width: '100%', padding: '0.7rem', border: '2px solid #e2e8f0', borderRadius: '8px', boxSizing: 'border-box' }} />
                    </div>

                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}

import React from 'react';
import { createStaff } from '../actions';

export default function NewStaffPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/admin/team" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back to Team
        </a>
        <h2 style={{ margin: 0, fontWeight: 800 }}>Add Staff Member</h2>
      </div>

      <div className="form-card">
        <form action={createStaff} className="admin-form">
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-user-md"></i> Staff Details</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input type="text" name="first_name" required />
              </div>
              
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input type="text" name="last_name" required />
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input type="email" name="email" required />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input type="text" name="phone" />
              </div>
              
              <div className="form-group">
                <label>Role <span className="required">*</span></label>
                <input type="text" name="role" required placeholder="e.g. Veterinarian, Technician" />
              </div>

              <div className="form-group">
                <label>Specialization</label>
                <input type="text" name="specialization" placeholder="e.g. Surgery, Dentistry" />
              </div>

              <div className="form-group">
                <label>Credentials</label>
                <input type="text" name="credentials" placeholder="e.g. DVM, Ph.D." />
              </div>

              <div className="form-group">
                <label>Display Order</label>
                <input type="number" name="display_order" defaultValue="0" />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="is_active" name="is_active" defaultChecked style={{ width: 'auto', height: '1.2rem', accentColor: 'var(--primary-color)' }} />
                <label htmlFor="is_active" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>Active (Visible on website and in appointment scheduling)</label>
            </div>
          </div>

          <div className="form-card-actions">
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <i className="fas fa-save"></i> Save Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

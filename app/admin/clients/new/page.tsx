import React from 'react';
import { addClient } from '../actions';

export default function NewClientPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/admin/clients" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back
        </a>
        <h2 style={{ margin: 0 }}>Register New Client</h2>
      </div>

      <div className="form-card">
        <form action={addClient} className="admin-form">
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-user"></i> Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input type="text" name="first_name" required placeholder="John" />
              </div>
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input type="text" name="last_name" required placeholder="Doe" />
              </div>
              <div className="form-group">
                <label>Email Address <span className="required">*</span></label>
                <input type="email" name="email" required placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <input type="tel" name="phone" required placeholder="(555) 123-4567" />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-map-marker-alt"></i> Address</h3>
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label>Street Address</label>
                <input type="text" name="address" placeholder="123 Main St" />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" placeholder="City" />
              </div>
              <div className="form-group">
                <label>State / Province</label>
                <input type="text" name="province" placeholder="State" />
              </div>
              <div className="form-group">
                <label>ZIP / Postal Code</label>
                <input type="text" name="zip_code" placeholder="12345" />
              </div>
            </div>
          </div>

          <div className="form-card-actions">
            <a href="/admin/clients" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
              Cancel
            </a>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <i className="fas fa-save"></i> Save Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { createTestimonial } from '../actions';

export default function NewTestimonialPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/admin/testimonials" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back
        </a>
        <h2 style={{ margin: 0, fontWeight: 800 }}>Add Testimonial</h2>
      </div>

      <div className="form-card">
        <form action={createTestimonial} className="admin-form">
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-star"></i> Testimonial Details</h3>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Client Name <span className="required">*</span></label>
                <input type="text" name="client_name" required placeholder="e.g. Jane Doe" />
              </div>
              
              <div className="form-group">
                <label>Pet Name</label>
                <input type="text" name="pet_name" placeholder="e.g. Max" />
              </div>
              
              <div className="form-group form-group-full">
                <label>Testimonial Content <span className="required">*</span></label>
                <textarea name="testimonial" required rows={5} placeholder="Write the client's feedback here..."></textarea>
              </div>

              <div className="form-group">
                <label>Rating (1-5) <span className="required">*</span></label>
                <select name="rating" required defaultValue="5">
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="is_approved" name="is_approved" defaultChecked style={{ width: 'auto', height: '1.2rem', accentColor: 'var(--primary-color)' }} />
                    <label htmlFor="is_approved" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>Approve (Visible on website)</label>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="is_featured" name="is_featured" style={{ width: 'auto', height: '1.2rem', accentColor: 'var(--primary-color)' }} />
                    <label htmlFor="is_featured" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>Feature on Homepage</label>
                </div>
            </div>
          </div>

          <div className="form-card-actions">
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <i className="fas fa-save"></i> Save Testimonial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

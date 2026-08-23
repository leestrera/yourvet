import React from 'react';
import { createFaq } from '../actions';

export default function NewFaqPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/admin/faqs" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back to FAQs
        </a>
        <h2 style={{ margin: 0, fontWeight: 800 }}>Add New FAQ</h2>
      </div>

      <div className="form-card">
        <form action={createFaq} className="admin-form">
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-question-circle"></i> FAQ Details</h3>
            
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label>Question <span className="required">*</span></label>
                <input type="text" name="question" required placeholder="e.g. What are your opening hours?" />
              </div>
              
              <div className="form-group form-group-full">
                <label>Answer <span className="required">*</span></label>
                <textarea name="answer" required rows={5} placeholder="Provide the detailed answer here..."></textarea>
              </div>

              <div className="form-group">
                <label>Category</label>
                <input type="text" name="category" placeholder="e.g. General, Medical, Billing" />
              </div>

              <div className="form-group">
                <label>Display Order</label>
                <input type="number" name="display_order" defaultValue="0" />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="is_active" name="is_active" defaultChecked style={{ width: 'auto', height: '1.2rem', accentColor: 'var(--primary-color)' }} />
                <label htmlFor="is_active" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>Publish to website immediately</label>
            </div>
          </div>

          <div className="form-card-actions">
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <i className="fas fa-save"></i> Save FAQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

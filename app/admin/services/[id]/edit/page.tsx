import React from 'react';
import { editService } from '../../actions';
import { createClient } from '@/utils/supabase/server';

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  
  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('service_id', (await params).id)
    .single();

  if (error || !service) {
    return <div style={{ padding: '2rem' }}>Service not found.</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/admin/services" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back to Services
        </a>
        <h2 style={{ margin: 0, fontWeight: 800 }}>Edit Service: {service.name}</h2>
      </div>

      <div className="form-card">
        <form action={editService} className="admin-form">
          <input type="hidden" name="service_id" value={service.service_id} />
          
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-info-circle"></i> General Information</h3>
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label>Service Name <span className="required">*</span></label>
                <input type="text" name="name" required defaultValue={service.name} />
              </div>
              <div className="form-group">
                <label>Category <span className="required">*</span></label>
                <select name="category" required defaultValue={service.category}>
                    <option value="Preventive Care">Preventive Care</option>
                    <option value="Dental">Dental</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Grooming">Grooming</option>
                    <option value="Boarding">Boarding</option>
                    <option value="Diagnostics">Diagnostics</option>
                    <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Display Icon</label>
                <select name="icon" defaultValue={service.icon}>
                    <option value="fas fa-stethoscope">Stethoscope (General)</option>
                    <option value="fas fa-syringe">Syringe (Vaccine)</option>
                    <option value="fas fa-tooth">Tooth (Dental)</option>
                    <option value="fas fa-scalpel">Scalpel (Surgery)</option>
                    <option value="fas fa-ambulance">Ambulance (Emergency)</option>
                    <option value="fas fa-bath">Bath (Grooming)</option>
                    <option value="fas fa-home">Home (Boarding)</option>
                    <option value="fas fa-microscope">Microscope (Labs)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-dollar-sign"></i> Pricing & Duration</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Base Price ($) <span className="required">*</span></label>
                <input type="number" step="0.01" name="base_price" required defaultValue={service.base_price} />
              </div>
              <div className="form-group">
                <label>Estimated Duration (mins)</label>
                <input type="number" name="duration_min" defaultValue={service.duration_min || ''} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-align-left"></i> Details</h3>
            <div className="form-group">
                <label>Description</label>
                <textarea name="description" rows={4} defaultValue={service.description || ''}></textarea>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-cog"></i> Settings</h3>
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="is_active" defaultChecked={service.is_active} id="is_active" style={{ width: 'auto' }} />
              <label htmlFor="is_active" style={{ margin: 0 }}>Active (Available for booking)</label>
            </div>
            <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Display Order</label>
                <input type="number" name="display_order" defaultValue={service.display_order} style={{ maxWidth: '150px' }} />
            </div>
          </div>

          <div className="form-card-actions">
            <a href="/admin/services" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
              Cancel
            </a>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <i className="fas fa-save"></i> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

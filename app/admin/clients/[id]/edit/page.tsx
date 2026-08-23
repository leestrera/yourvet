import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { editClient } from '../../actions';

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: client, error } = await supabase
    .from('owners')
    .select('*')
    .eq('owner_id', (await params).id)
    .single();

  if (error || !client) {
    return <div>Client not found.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href={`/admin/clients/${(await params).id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back to Profile
        </a>
        <h2 style={{ margin: 0 }}>Edit Client: {client.first_name} {client.last_name}</h2>
      </div>

      <div className="form-card">
        <form action={editClient} className="admin-form">
          <input type="hidden" name="owner_id" value={client.owner_id} />
          
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-user"></i> Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name <span className="required">*</span></label>
                <input type="text" name="first_name" required defaultValue={client.first_name} />
              </div>
              <div className="form-group">
                <label>Last Name <span className="required">*</span></label>
                <input type="text" name="last_name" required defaultValue={client.last_name} />
              </div>
              <div className="form-group">
                <label>Email Address <span className="required">*</span></label>
                <input type="email" name="email" required defaultValue={client.email} />
              </div>
              <div className="form-group">
                <label>Phone Number <span className="required">*</span></label>
                <input type="tel" name="phone" required defaultValue={client.phone} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-map-marker-alt"></i> Address</h3>
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label>Street Address</label>
                <input type="text" name="address" defaultValue={client.address || ''} />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" defaultValue={client.city || ''} />
              </div>
              <div className="form-group">
                <label>State / Province</label>
                <input type="text" name="province" defaultValue={client.province || ''} />
              </div>
              <div className="form-group">
                <label>ZIP / Postal Code</label>
                <input type="text" name="zip_code" defaultValue={client.zip_code || ''} />
              </div>
            </div>
          </div>

          <div className="form-card-actions">
            <a href={`/admin/clients/${(await params).id}`} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
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

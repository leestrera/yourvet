import React from 'react';
import { addPet } from '../../../actions';
import { createClient } from '@/utils/supabase/server';

export default async function NewPetPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: client } = await supabase
    .from('owners')
    .select('first_name, last_name')
    .eq('owner_id', (await params).id)
    .single();

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href={`/admin/clients/${(await params).id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back to Profile
        </a>
        <h2 style={{ margin: 0 }}>Register New Pet {client ? `for ${client.first_name} ${client.last_name}` : ''}</h2>
      </div>

      <div className="form-card">
        <form action={addPet} className="admin-form">
          <input type="hidden" name="owner_id" value={(await params).id} />
          
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-paw"></i> Pet Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Pet Name <span className="required">*</span></label>
                <input type="text" name="name" required placeholder="Buddy" />
              </div>
              <div className="form-group">
                <label>Species <span className="required">*</span></label>
                <select name="species" required>
                    <option value="">Select Species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Reptile">Reptile</option>
                    <option value="Small Mammal">Small Mammal</option>
                    <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Breed</label>
                <input type="text" name="breed" placeholder="Golden Retriever" />
              </div>
              <div className="form-group">
                <label>Gender <span className="required">*</span></label>
                <select name="gender" required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-file-medical"></i> Medical Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" name="date_of_birth" />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" step="0.1" name="weight_kg" placeholder="15.5" />
              </div>
              <div className="form-group form-group-full">
                <label>Microchip Number</label>
                <input type="text" name="microchip_number" placeholder="Enter 15-digit microchip number" />
              </div>
            </div>
          </div>

          <div className="form-card-actions">
            <a href={`/admin/clients/${(await params).id}`} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
              Cancel
            </a>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <i className="fas fa-save"></i> Register Pet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

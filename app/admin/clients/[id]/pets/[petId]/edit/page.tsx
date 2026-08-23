import React from 'react';
import { editPet } from '../../../../actions';
import { createClient } from '@/utils/supabase/server';

export default async function EditPetPage({ params }: { params: Promise<{ id: string, petId: string }> }) {
  const supabase = await createClient();
  const { data: pet, error } = await supabase
    .from('pets')
    .select('*')
    .eq('pet_id', (await params).petId)
    .single();

  if (error || !pet) {
    return <div>Pet not found.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href={`/admin/clients/${(await params).id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back to Profile
        </a>
        <h2 style={{ margin: 0 }}>Edit Pet: {pet.name}</h2>
      </div>

      <div className="form-card">
        <form action={editPet} className="admin-form">
          <input type="hidden" name="pet_id" value={pet.pet_id} />
          <input type="hidden" name="owner_id" value={pet.owner_id} />
          
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-paw"></i> Pet Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Pet Name <span className="required">*</span></label>
                <input type="text" name="name" required defaultValue={pet.name} />
              </div>
              <div className="form-group">
                <label>Species <span className="required">*</span></label>
                <select name="species" required defaultValue={pet.species}>
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
                <input type="text" name="breed" defaultValue={pet.breed || ''} />
              </div>
              <div className="form-group">
                <label>Gender <span className="required">*</span></label>
                <select name="gender" required defaultValue={pet.gender}>
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
                <input type="date" name="date_of_birth" defaultValue={pet.date_of_birth || ''} />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" step="0.1" name="weight_kg" defaultValue={pet.weight_kg || ''} />
              </div>
              <div className="form-group form-group-full">
                <label>Microchip Number</label>
                <input type="text" name="microchip_number" defaultValue={pet.microchip_number || ''} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-cog"></i> Settings</h3>
            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" name="is_active" defaultChecked={pet.is_active} id="is_active" style={{ width: 'auto' }} />
              <label htmlFor="is_active" style={{ margin: 0 }}>Active Profile</label>
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

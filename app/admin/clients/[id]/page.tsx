import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: client, error } = await supabase
    .from('owners')
    .select(`
      *,
      pets (*)
    `)
    .eq('owner_id', (await params).id)
    .single();

  if (error || !client) {
    return <div style={{ padding: '2rem' }}>Client not found.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="/admin/clients" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
            <i className="fas fa-arrow-left"></i> Back to Clients
            </a>
            <h2 style={{ margin: 0 }}>Client Profile</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
            <a href={`/admin/clients/${client.owner_id}/edit`} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)', textDecoration: 'none' }}>
                <i className="fas fa-edit"></i> Edit Client
            </a>
            <a href={`/admin/clients/${client.owner_id}/pets/new`} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', border: 'none' }}>
                <i className="fas fa-paw"></i> Add Pet
            </a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Sidebar: Client Info */}
        <div className="form-card" style={{ padding: '2rem', position: 'sticky', top: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 'bold' }}>
                    {client.first_name[0]}{client.last_name[0]}
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{client.first_name} {client.last_name}</h3>
                <span className="badge" style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem' }}>
                    <i className="fas fa-check-circle"></i> Active Client
                </span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <li style={{ display: 'flex', gap: '1rem' }}>
                    <i className="fas fa-envelope" style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}></i>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Email</div>
                        <div style={{ wordBreak: 'break-all' }}>{client.email}</div>
                    </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem' }}>
                    <i className="fas fa-phone" style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}></i>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Phone</div>
                        <div>{client.phone}</div>
                    </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}></i>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Address</div>
                        <div>
                            {client.address ? (
                                <>
                                    {client.address}<br/>
                                    <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                        {[client.city, client.province, client.zip_code].filter(Boolean).join(', ')}
                                    </span>
                                </>
                            ) : (
                                <span style={{ color: 'var(--text-light)' }}>No address provided</span>
                            )}
                        </div>
                    </div>
                </li>
                <li style={{ display: 'flex', gap: '1rem' }}>
                    <i className="fas fa-calendar-alt" style={{ color: 'var(--text-light)', marginTop: '0.25rem' }}></i>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Registered</div>
                        <div>{new Date(client.created_at).toLocaleDateString()}</div>
                    </div>
                </li>
            </ul>
        </div>

        {/* Main Content: Pets Grid */}
        <div className="dashboard-section" style={{ padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-paw" style={{ color: 'var(--primary-color)' }}></i> Registered Pets
            </h3>

            {(!client.pets || client.pets.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    <i className="fas fa-paw" style={{ fontSize: '3rem', color: '#cbd5e1', marginBottom: '1rem' }}></i>
                    <p style={{ color: 'var(--text-light)' }}>No pets registered for this client yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {client.pets.map((pet: any) => {
                        let icon = 'paw';
                        const species = (pet.species || '').toLowerCase();
                        if (species.includes('dog')) icon = 'dog';
                        if (species.includes('cat')) icon = 'cat';
                        if (species.includes('bird')) icon = 'crow';
                        if (species.includes('fish')) icon = 'fish';

                        return (
                            <div key={pet.pet_id} style={{ background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bg-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                            <i className={`fas fa-${icon}`}></i>
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{pet.name}</h4>
                                            <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{pet.breed || pet.species}</div>
                                        </div>
                                    </div>
                                    <span className="badge" style={{ background: pet.is_active ? '#dcfce7' : '#fee2e2', color: pet.is_active ? '#166534' : '#991b1b', padding: '0.25rem 0.5rem', borderRadius: '20px', fontSize: '0.75rem' }}>
                                        {pet.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                                    <div>
                                        <div style={{ color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>Gender</div>
                                        <div><i className="fas fa-venus-mars" style={{ opacity: 0.5 }}></i> {pet.gender}</div>
                                    </div>
                                    <div>
                                        <div style={{ color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>Weight</div>
                                        <div><i className="fas fa-weight-hanging" style={{ opacity: 0.5 }}></i> {pet.weight_kg ? `${pet.weight_kg} kg` : 'N/A'}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                    <a href={`/admin/clients/${client.owner_id}/pets/${pet.pet_id}/edit`} className="action-btn" title="Edit Pet" style={{ flex: 1, textAlign: 'center', padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '6px', textDecoration: 'none' }}>
                                        <i className="fas fa-edit"></i> Edit
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

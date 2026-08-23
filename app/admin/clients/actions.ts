'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addClient(formData: FormData) {
  const supabase = await createClient();
  
  const clientData = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    city: formData.get('city'),
    province: formData.get('province'),
    zip_code: formData.get('zip_code'),
  };

  const { data, error } = await supabase
    .from('owners')
    .insert([clientData])
    .select()
    .single();

  if (error) {
    console.error('Error adding client:', error);
    throw new Error('Failed to add client');
  }

  revalidatePath('/admin/clients');
  redirect(`/admin/clients/${data.owner_id}`);
}

export async function editClient(formData: FormData) {
  const supabase = await createClient();
  const owner_id = formData.get('owner_id') as string;
  
  const clientData = {
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
    city: formData.get('city'),
    province: formData.get('province'),
    zip_code: formData.get('zip_code'),
  };

  const { error } = await supabase
    .from('owners')
    .update(clientData)
    .eq('owner_id', owner_id);

  if (error) {
    console.error('Error updating client:', error);
    throw new Error('Failed to update client');
  }

  revalidatePath('/admin/clients');
  revalidatePath(`/admin/clients/${owner_id}`);
  redirect(`/admin/clients/${owner_id}`);
}

export async function addPet(formData: FormData) {
  const supabase = await createClient();
  const owner_id = formData.get('owner_id') as string;
  
  const petData = {
    owner_id: parseInt(owner_id),
    name: formData.get('name'),
    species: formData.get('species'),
    breed: formData.get('breed') || null,
    date_of_birth: formData.get('date_of_birth') || null,
    gender: formData.get('gender'),
    weight_kg: formData.get('weight_kg') ? parseFloat(formData.get('weight_kg') as string) : null,
    microchip_number: formData.get('microchip_number') || null,
    is_active: true
  };

  const { error } = await supabase
    .from('pets')
    .insert([petData]);

  if (error) {
    console.error('Error adding pet:', error);
    throw new Error('Failed to add pet');
  }

  revalidatePath(`/admin/clients/${owner_id}`);
  redirect(`/admin/clients/${owner_id}`);
}

export async function editPet(formData: FormData) {
  const supabase = await createClient();
  const pet_id = formData.get('pet_id') as string;
  const owner_id = formData.get('owner_id') as string;
  
  const petData = {
    name: formData.get('name'),
    species: formData.get('species'),
    breed: formData.get('breed') || null,
    date_of_birth: formData.get('date_of_birth') || null,
    gender: formData.get('gender'),
    weight_kg: formData.get('weight_kg') ? parseFloat(formData.get('weight_kg') as string) : null,
    microchip_number: formData.get('microchip_number') || null,
    is_active: formData.get('is_active') === 'on'
  };

  const { error } = await supabase
    .from('pets')
    .update(petData)
    .eq('pet_id', pet_id);

  if (error) {
    console.error('Error updating pet:', error);
    throw new Error('Failed to update pet');
  }

  revalidatePath(`/admin/clients/${owner_id}`);
  redirect(`/admin/clients/${owner_id}`);
}

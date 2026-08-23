'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addService(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");


  const rawData = {
    name: formData.get('name'),
    description: formData.get('description') || null,
    category: formData.get('category') || 'Other',
    icon: formData.get('icon') || 'fas fa-stethoscope',
    base_price: parseFloat(formData.get('base_price') as string) || 0.00,
    duration_min: parseInt(formData.get('duration_min') as string) || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: formData.get('is_active') === 'on',
  };

  const { error } = await supabase
    .from('services')
    .insert([rawData]);

  if (error) {
    console.error('Error adding service:', error);
    throw new Error('Failed to add service');
  }

  revalidatePath('/admin/services');
  redirect('/admin/services');
}

export async function editService(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  
  const service_id = formData.get('service_id');

  const rawData = {
    name: formData.get('name'),
    description: formData.get('description') || null,
    category: formData.get('category') || 'Other',
    icon: formData.get('icon') || 'fas fa-stethoscope',
    base_price: parseFloat(formData.get('base_price') as string) || 0.00,
    duration_min: parseInt(formData.get('duration_min') as string) || null,
    display_order: parseInt(formData.get('display_order') as string) || 0,
    is_active: formData.get('is_active') === 'on',
  };

  const { error } = await supabase
    .from('services')
    .update(rawData)
    .eq('service_id', service_id);

  if (error) {
    console.error('Error updating service:', error);
    throw new Error('Failed to update service');
  }

  revalidatePath('/admin/services');
  redirect('/admin/services');
}

export async function deleteService(formData: FormData) {
    const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

    const service_id = formData.get('service_id');
  
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('service_id', service_id);
  
    if (error) {
      console.error('Error deleting service:', error);
      throw new Error('Failed to delete service');
    }
  
    revalidatePath('/admin/services');
}

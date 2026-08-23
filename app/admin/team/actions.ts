'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createStaff(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const first_name = formData.get('first_name');
  const last_name = formData.get('last_name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const role = formData.get('role');
  const specialization = formData.get('specialization');
  const credentials = formData.get('credentials');
  const display_order = formData.get('display_order');
  const is_active = formData.get('is_active') === 'on';

  const { error } = await supabase.from('staff').insert([{
    first_name,
    last_name,
    email,
    phone,
    role,
    specialization,
    credentials,
    display_order: parseInt(display_order as string) || 0,
    is_active
  }]);

  if (error) {
    console.error('Error creating staff:', error);
    throw new Error('Failed to create staff member');
  }

  revalidatePath('/admin/team');
  redirect('/admin/team');
}

export async function updateStaff(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const staff_id = formData.get('staff_id');
  const first_name = formData.get('first_name');
  const last_name = formData.get('last_name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const role = formData.get('role');
  const specialization = formData.get('specialization');
  const credentials = formData.get('credentials');
  const display_order = formData.get('display_order');
  const is_active = formData.get('is_active') === 'on';

  const { error } = await supabase.from('staff').update({
    first_name,
    last_name,
    email,
    phone,
    role,
    specialization,
    credentials,
    display_order: parseInt(display_order as string) || 0,
    is_active
  }).eq('staff_id', staff_id);

  if (error) {
    console.error('Error updating staff:', error);
    throw new Error('Failed to update staff member');
  }

  revalidatePath('/admin/team');
  redirect('/admin/team');
}

export async function deleteStaff(staff_id: string) {
    const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from('staff').delete().eq('staff_id', staff_id);
    if (error) {
        console.error('Error deleting staff:', error);
        throw new Error('Failed to delete staff member');
    }
    revalidatePath('/admin/team');
}

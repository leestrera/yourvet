'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTestimonial(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const client_name = formData.get('client_name');
  const pet_name = formData.get('pet_name');
  const testimonial = formData.get('testimonial');
  const rating = formData.get('rating');
  const is_featured = formData.get('is_featured') === 'on';
  const is_approved = formData.get('is_approved') === 'on';

  const { error } = await supabase.from('testimonials').insert([{
    client_name,
    pet_name,
    testimonial,
    rating: parseInt(rating as string) || 5,
    is_featured,
    is_approved
  }]);

  if (error) {
    console.error('Error creating testimonial:', error);
    throw new Error('Failed to create testimonial');
  }

  revalidatePath('/admin/testimonials');
  redirect('/admin/testimonials');
}

export async function updateTestimonial(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const testimonial_id = formData.get('testimonial_id');
  const client_name = formData.get('client_name');
  const pet_name = formData.get('pet_name');
  const testimonial = formData.get('testimonial');
  const rating = formData.get('rating');
  const is_featured = formData.get('is_featured') === 'on';
  const is_approved = formData.get('is_approved') === 'on';

  const { error } = await supabase.from('testimonials').update({
    client_name,
    pet_name,
    testimonial,
    rating: parseInt(rating as string) || 5,
    is_featured,
    is_approved
  }).eq('testimonial_id', testimonial_id);

  if (error) {
    console.error('Error updating testimonial:', error);
    throw new Error('Failed to update testimonial');
  }

  revalidatePath('/admin/testimonials');
  redirect('/admin/testimonials');
}

export async function deleteTestimonial(testimonial_id: string) {
    const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from('testimonials').delete().eq('testimonial_id', testimonial_id);
    if (error) {
        console.error('Error deleting testimonial:', error);
        throw new Error('Failed to delete testimonial');
    }
    revalidatePath('/admin/testimonials');
}

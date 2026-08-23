'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createFaq(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const question = formData.get('question');
  const answer = formData.get('answer');
  const category = formData.get('category');
  const display_order = formData.get('display_order');
  const is_active = formData.get('is_active') === 'on';

  const { error } = await supabase.from('faqs').insert([{
    question,
    answer,
    category,
    display_order: parseInt(display_order as string) || 0,
    is_active
  }]);

  if (error) {
    console.error('Error creating FAQ:', error);
    throw new Error('Failed to create FAQ');
  }

  revalidatePath('/admin/faqs');
  redirect('/admin/faqs');
}

export async function updateFaq(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const faq_id = formData.get('faq_id');
  const question = formData.get('question');
  const answer = formData.get('answer');
  const category = formData.get('category');
  const display_order = formData.get('display_order');
  const is_active = formData.get('is_active') === 'on';

  const { error } = await supabase.from('faqs').update({
    question,
    answer,
    category,
    display_order: parseInt(display_order as string) || 0,
    is_active
  }).eq('faq_id', faq_id);

  if (error) {
    console.error('Error updating FAQ:', error);
    throw new Error('Failed to update FAQ');
  }

  revalidatePath('/admin/faqs');
  redirect('/admin/faqs');
}

export async function deleteFaq(faq_id: string) {
    const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from('faqs').delete().eq('faq_id', faq_id);
    if (error) {
        console.error('Error deleting FAQ:', error);
        throw new Error('Failed to delete FAQ');
    }
    revalidatePath('/admin/faqs');
}

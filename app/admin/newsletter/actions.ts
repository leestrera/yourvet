'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function unsubscribe(formData: FormData) {
    const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

    const subscriber_id = formData.get('subscriber_id');

    const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
            is_active: false,
            unsubscribed_at: new Date().toISOString()
        })
        .eq('subscriber_id', subscriber_id);

    if (error) {
        console.error('Error unsubscribing:', error);
        throw new Error('Failed to unsubscribe');
    }

    revalidatePath('/admin/newsletter');
}
export async function permanentDelete(formData: FormData) {
    const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

    const subscriber_id = formData.get('subscriber_id');

    const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('subscriber_id', subscriber_id);

    if (error) {
        console.error('Error deleting subscriber:', error);
        throw new Error('Failed to delete subscriber');
    }

    revalidatePath('/admin/newsletter');
}

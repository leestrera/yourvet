'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function unsubscribe(formData: FormData) {
    const supabase = await createClient();
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

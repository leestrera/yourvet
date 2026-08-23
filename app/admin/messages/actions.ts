'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function markAsReplied(formData: FormData) {
    const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

    const message_id = formData.get('message_id');
    const { data: { user } } = await supabase.auth.getUser();

    // Get the admin user id
    let admin_id = null;
    if (user) {
        const { data: adminData } = await supabase.from('admin_users').select('admin_id').eq('email', user.email).single();
        if (adminData) admin_id = adminData.admin_id;
    }

    const { error } = await supabase
        .from('contact_messages')
        .update({
            status: 'responded',
            replied_by: admin_id,
            replied_at: new Date().toISOString()
        })
        .eq('message_id', message_id);

    if (error) {
        console.error('Error updating message status:', error);
        throw new Error('Failed to update message status');
    }

    revalidatePath('/admin/messages');
    revalidatePath(`/admin/messages/${message_id}`);
}

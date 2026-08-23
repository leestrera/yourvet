import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;

    if (!email) {
      // In a real app we might return JSON, but since the form is a standard HTML form without JS interception, 
      // it might be better to redirect back with an error or return a simple response.
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let firstName = '';
    let lastName = '';
    
    if (name) {
      const parts = name.trim().split(' ');
      firstName = parts[0];
      if (parts.length > 1) {
        lastName = parts.slice(1).join(' ');
      }
    }

    const supabase = await createClient();
    
    // Check if they already exist
    const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('subscriber_id')
        .eq('email', email)
        .single();

    if (existing) {
        // If they exist, make sure they are active
        await supabase
            .from('newsletter_subscribers')
            .update({ is_active: true })
            .eq('email', email);
    } else {
        // Insert new subscriber
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert([
                { 
                    email, 
                    first_name: firstName || null, 
                    last_name: lastName || null,
                    is_active: true
                }
            ]);
            
        if (error) {
            console.error('Error inserting subscriber:', error);
            return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
        }
    }

    // Since it's a standard form submit, we'll redirect back to the page they came from (or a thank you page)
    const referer = request.headers.get('referer') || '/resources';
    const redirectUrl = new URL(referer);
    redirectUrl.searchParams.set('subscribed', 'true');
    
    return NextResponse.redirect(redirectUrl.toString(), 303);
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

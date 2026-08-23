import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const supabase = await createClient();
    
    const { error } = await supabase
        .from('contact_messages')
        .insert([
            { 
                name, 
                email, 
                phone: phone || null,
                subject: subject || 'General Inquiry',
                message,
                status: 'new'
            }
        ]);
        
    if (error) {
        console.error('Error saving contact message:', error);
        return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
    }

    // Since it's a standard form submit from contact/page.tsx, redirect back with success param
    const referer = request.headers.get('referer') || '/contact';
    const redirectUrl = new URL(referer);
    redirectUrl.searchParams.set('success', 'true');
    
    return NextResponse.redirect(redirectUrl.toString(), 303);
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

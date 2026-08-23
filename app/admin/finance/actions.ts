'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createInvoice(formData: FormData) {
  const supabase = await createClient();
  const appointment_id = formData.get('appointment_id');
  
  if (!appointment_id) {
      throw new Error("Appointment ID is required");
  }

  // Create an empty billing record
  const { data: billing, error } = await supabase
    .from('billing')
    .insert([{
        appointment_id: parseInt(appointment_id as string),
        subtotal: 0,
        discount_amount: 0,
        tax_amount: 0,
        total_amount: 0,
        payment_status: 'unpaid'
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating invoice:', error);
    throw new Error('Failed to create invoice');
  }

  revalidatePath('/admin/finance');
  redirect(`/admin/finance/${billing.billing_id}`);
}

export async function addServiceToInvoice(formData: FormData) {
    const supabase = await createClient();
    const appointment_id = formData.get('appointment_id');
    const service_id = formData.get('service_id');
    const billing_id = formData.get('billing_id');

    // Get current price of service
    const { data: service } = await supabase
        .from('services')
        .select('base_price')
        .eq('service_id', service_id)
        .single();
        
    if (!service) throw new Error("Service not found");

    const { error } = await supabase
        .from('appointment_services')
        .insert([{
            appointment_id: parseInt(appointment_id as string),
            service_id: parseInt(service_id as string),
            service_price_snapshot: service.base_price
        }]);

    if (error) {
        console.error('Error adding service to invoice:', error);
        throw new Error('Failed to add service to invoice');
    }

    revalidatePath(`/admin/finance/${billing_id}`);
}

export async function recordPayment(formData: FormData) {
    const supabase = await createClient();
    const billing_id = formData.get('billing_id');
    const amount = parseFloat(formData.get('amount') as string);
    const payment_method = formData.get('payment_method');
    const reference_no = formData.get('reference_no') || null;

    const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
            billing_id: parseInt(billing_id as string),
            amount,
            payment_method,
            reference_no
        }]);

    if (paymentError) {
        console.error('Error recording payment:', paymentError);
        throw new Error('Failed to record payment');
    }

    // Recalculate status
    const { data: billing } = await supabase.from('billing').select('total_amount').eq('billing_id', billing_id).single();
    const { data: payments } = await supabase.from('payments').select('amount').eq('billing_id', billing_id);
    
    if (billing && payments) {
        const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        let newStatus = 'unpaid';
        if (totalPaid >= billing.total_amount) newStatus = 'paid';
        else if (totalPaid > 0) newStatus = 'partial';
        
        await supabase.from('billing').update({ payment_status: newStatus }).eq('billing_id', billing_id);
    }

    revalidatePath(`/admin/finance/${billing_id}`);
}

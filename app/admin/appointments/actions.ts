'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateAppointmentStatus(formData: FormData) {
  const action = formData.get('action') as string;
  const appointmentId = formData.get('appointment_id') as string;
  
  if (!appointmentId) return;

  const supabase = await createClient();
  
  if (action === 'delete') {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('appointment_id', appointmentId);
      
    if (error) console.error('Error deleting appointment:', error);
  } else {
    const status = formData.get('status') as string;
    if (!status) return;

    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('appointment_id', appointmentId);

    if (error) console.error('Error updating status:', error);
  }

  revalidatePath('/admin/appointments');
  revalidatePath('/admin');
}

export async function createAppointment(formData: FormData) {
  const supabase = await createClient();
  
  const rawData = {
    pet_id: formData.get('pet_id'),
    staff_id: formData.get('staff_id') || null,
    appointment_date: formData.get('appointment_date'),
    appointment_time: formData.get('appointment_time'),
    status: formData.get('status') || 'pending',
    visit_type: formData.get('visit_type') || 'scheduled',
    notes: formData.get('notes') || null,
  };

  const { data: newAppt, error: apptError } = await supabase
    .from('appointments')
    .insert([rawData])
    .select('appointment_id')
    .single();

  if (apptError || !newAppt) {
    console.error('Error creating appointment:', apptError);
    throw new Error('Failed to create appointment');
  }

  // Handle Services
  const serviceIds = formData.getAll('service_ids');
  if (serviceIds.length > 0) {
    await assignServicesAndBilling(supabase, newAppt.appointment_id, serviceIds as string[]);
  } else {
    // Generate empty billing record anyway
    await supabase.from('billing').insert([{
      appointment_id: newAppt.appointment_id,
      subtotal: 0,
      total_amount: 0
    }]);
  }

  revalidatePath('/admin/appointments');
  redirect('/admin/appointments');
}

export async function updateAppointment(formData: FormData) {
  const supabase = await createClient();
  
  const appointmentId = formData.get('appointment_id') as string;
  
  const rawData = {
    staff_id: formData.get('staff_id') || null,
    appointment_date: formData.get('appointment_date'),
    appointment_time: formData.get('appointment_time'),
    status: formData.get('status'),
    visit_type: formData.get('visit_type'),
    notes: formData.get('notes') || null,
  };

  const { error: apptError } = await supabase
    .from('appointments')
    .update(rawData)
    .eq('appointment_id', appointmentId);

  if (apptError) {
    console.error('Error updating appointment:', apptError);
    throw new Error('Failed to update appointment');
  }

  // Handle Services
  const serviceIds = formData.getAll('service_ids');
  
  // Remove existing services
  await supabase
    .from('appointment_services')
    .delete()
    .eq('appointment_id', appointmentId);

  if (serviceIds.length > 0) {
    await assignServicesAndBilling(supabase, appointmentId, serviceIds as string[]);
  } else {
    // Zero out billing
    await supabase
      .from('billing')
      .update({ subtotal: 0, total_amount: 0 })
      .eq('appointment_id', appointmentId);
  }

  revalidatePath('/admin/appointments');
  redirect(`/admin/appointments/${appointmentId}`);
}

async function assignServicesAndBilling(supabase: any, appointmentId: string | number, serviceIds: string[]) {
  // Fetch prices for selected services
  const { data: services } = await supabase
    .from('services')
    .select('service_id, base_price')
    .in('service_id', serviceIds);

  if (services && services.length > 0) {
    let subtotal = 0;
    const servicesToInsert = services.map((svc: any) => {
      subtotal += Number(svc.base_price);
      return {
        appointment_id: appointmentId,
        service_id: svc.service_id,
        service_price_snapshot: svc.base_price
      };
    });

    // Insert new services
    await supabase.from('appointment_services').insert(servicesToInsert);

    // Check if billing exists
    const { data: existingBilling } = await supabase
      .from('billing')
      .select('billing_id')
      .eq('appointment_id', appointmentId)
      .single();

    if (existingBilling) {
      await supabase
        .from('billing')
        .update({ 
          subtotal: subtotal,
          total_amount: subtotal // Add tax logic here if needed
        })
        .eq('billing_id', existingBilling.billing_id);
    } else {
      await supabase.from('billing').insert([{
        appointment_id: appointmentId,
        subtotal: subtotal,
        total_amount: subtotal
      }]);
    }
  }
}

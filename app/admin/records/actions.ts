'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addRecord(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  
  const appointment_id = formData.get('appointment_id');
  let pet_id = formData.get('pet_id');

  // If pet_id is missing, auto-fetch it from the appointment
  if (!pet_id && appointment_id) {
    const { data: appt } = await supabase
        .from('appointments')
        .select('pet_id')
        .eq('appointment_id', appointment_id)
        .single();
    if (appt) pet_id = appt.pet_id;
  }

  const rawData = {
    appointment_id,
    pet_id,
    weight_kg: formData.get('weight_kg') || null,
    temperature_c: formData.get('temperature_c') || null,
    diagnosis: formData.get('diagnosis'),
    treatment: formData.get('treatment') || null,
    prescribed_meds: formData.get('prescribed_meds') || null,
    follow_up_date: formData.get('follow_up_date') || null,
    follow_up_notes: formData.get('follow_up_notes') || null,
    vet_remarks: formData.get('vet_remarks') || null,
  };

  const { error } = await supabase
    .from('medical_records')
    .insert([rawData]);

  if (error) {
    console.error('Error adding medical record:', error);
    throw new Error('Failed to add medical record');
  }

  revalidatePath('/admin/records');
  redirect('/admin/records');
}

export async function editRecord(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  
  const record_id = formData.get('record_id');

  const rawData = {
    weight_kg: formData.get('weight_kg') || null,
    temperature_c: formData.get('temperature_c') || null,
    diagnosis: formData.get('diagnosis'),
    treatment: formData.get('treatment') || null,
    prescribed_meds: formData.get('prescribed_meds') || null,
    follow_up_date: formData.get('follow_up_date') || null,
    follow_up_notes: formData.get('follow_up_notes') || null,
    vet_remarks: formData.get('vet_remarks') || null,
  };

  const { error } = await supabase
    .from('medical_records')
    .update(rawData)
    .eq('record_id', record_id);

  if (error) {
    console.error('Error updating medical record:', error);
    throw new Error('Failed to update medical record');
  }

  revalidatePath('/admin/records');
  redirect(`/admin/records/${record_id}`);
}

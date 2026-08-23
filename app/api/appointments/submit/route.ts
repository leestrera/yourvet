import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const ownerName = formData.get('owner_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    
    const petName = formData.get('pet_name') as string
    const petType = formData.get('pet_type') as string
    
    // Multiple services can be selected
    const serviceTypes = formData.getAll('service_types[]')
    const preferredDate = formData.get('preferred_date') as string
    const preferredTime = formData.get('preferred_time') as string
    const message = formData.get('message') as string

    if (!ownerName || !email || !phone || !petName || !preferredDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()
    
    // 1. Upsert Owner (Check if email exists)
    let { data: owner, error: ownerError } = await supabase
      .from('owners')
      .select('owner_id')
      .eq('email', email)
      .single()

    if (ownerError && ownerError.code !== 'PGRST116') {
      console.error('Error fetching owner:', ownerError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    let ownerId = owner?.owner_id
    if (!ownerId) {
      // Create new owner
      const parts = ownerName.split(' ')
      const firstName = parts[0]
      const lastName = parts.slice(1).join(' ') || '-'
      
      const { data: newOwner, error: insertOwnerErr } = await supabase
        .from('owners')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone
        })
        .select('owner_id')
        .single()
        
      if (insertOwnerErr) throw insertOwnerErr
      ownerId = newOwner.owner_id
    }

    // 2. Find or Create Pet
    let { data: pet, error: petError } = await supabase
      .from('pets')
      .select('pet_id')
      .eq('owner_id', ownerId)
      .eq('name', petName)
      .single()

    let petId = pet?.pet_id
    if (!petId) {
      const { data: newPet, error: insertPetErr } = await supabase
        .from('pets')
        .insert({
          owner_id: ownerId,
          name: petName,
          species: petType || 'Dog'
        })
        .select('pet_id')
        .single()
        
      if (insertPetErr) throw insertPetErr
      petId = newPet.pet_id
    }

    // 3. Create Appointment
    const { data: appointment, error: apptError } = await supabase
      .from('appointments')
      .insert({
        pet_id: petId,
        appointment_date: preferredDate,
        appointment_time: preferredTime || '09:00:00',
        status: 'pending',
        notes: `Services requested: ${serviceTypes.join(', ')}\n\nMessage: ${message || 'None'}`
      })
      .select('appointment_id')
      .single()

    if (apptError) throw apptError

    // Success! Redirect to status page with success message
    return NextResponse.redirect(new URL('/appointments/status?success=true', request.url), 303)
    
  } catch (error) {
    console.error('Booking submission error:', error)
    return NextResponse.json({ error: 'Failed to submit appointment' }, { status: 500 })
  }
}

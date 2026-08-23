import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const petName = searchParams.get('pet_name')

    if (!email || !petName) {
      return NextResponse.json({ error: 'Email and Pet Name are required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Find the owner
    const { data: owner, error: ownerErr } = await supabase
      .from('owners')
      .select('owner_id')
      .eq('email', email.toLowerCase())
      .single()

    if (ownerErr || !owner) {
      return NextResponse.json({ error: 'No appointments found' }, { status: 404 })
    }

    // Find the pet
    const { data: pet, error: petErr } = await supabase
      .from('pets')
      .select('pet_id, species')
      .eq('owner_id', owner.owner_id)
      .ilike('name', petName)
      .single()

    if (petErr || !pet) {
      return NextResponse.json({ error: 'No appointments found for this pet' }, { status: 404 })
    }

    // Find the most recent appointment for this pet
    const { data: appointment, error: apptErr } = await supabase
      .from('appointments')
      .select('*, appointment_services(services(name))')
      .eq('pet_id', pet.pet_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (apptErr || !appointment) {
      return NextResponse.json({ error: 'No appointments found' }, { status: 404 })
    }

    // Format the response to match what the frontend expects
    const formatted = {
      status: appointment.status,
      pet_name: petName,
      pet_type: pet.species,
      service_type: appointment.notes?.split('\n')[0] || 'Checkup', // We extract from notes or join services
      preferred_date: appointment.appointment_date,
      preferred_time: appointment.appointment_time,
      created_at: appointment.created_at,
      message: appointment.notes
    }

    return NextResponse.json(formatted)

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

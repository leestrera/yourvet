const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
let url = '', serviceKey = '';
envFile.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) serviceKey = line.split('=')[1].trim();
});

const supabase = createClient(url, serviceKey);

const correctServices = [
  { name: 'Wellness Exams', description: 'Comprehensive health checkups for your pet including physical examination, vaccinations, and health counseling.', category: 'Preventive Care', display_order: 1, base_price: 85.00, is_active: true },
  { name: 'Vaccinations', description: 'Core and non-core vaccinations to protect your pet from common diseases.', category: 'Preventive Care', display_order: 2, base_price: 45.00, is_active: true },
  { name: 'Dental Care', description: 'Professional dental cleaning, extractions, and oral health maintenance.', category: 'Dental', display_order: 3, base_price: 300.00, is_active: true },
  { name: 'Surgery', description: 'Routine and emergency surgical procedures performed in our state-of-the-art surgical suite.', category: 'Surgery', display_order: 4, base_price: 0.00, is_active: true },
  { name: 'Emergency Care', description: '24/7 emergency veterinary services for urgent medical needs.', category: 'Emergency', display_order: 5, base_price: 0.00, is_active: true },
  { name: 'Pet Grooming', description: 'Full-service grooming including bathing, nail trimming, and styling.', category: 'Grooming', display_order: 6, base_price: 50.00, is_active: true },
  { name: 'Boarding', description: 'Safe and comfortable overnight boarding with personalized care.', category: 'Boarding', display_order: 7, base_price: 40.00, is_active: true },
  { name: 'Laboratory Services', description: 'In-house blood work, urinalysis, and diagnostic testing.', category: 'Diagnostics', display_order: 8, base_price: 75.00, is_active: true }
];

async function fix() {
  console.log('Fetching existing services...');
  const { data: existing, error: fetchErr } = await supabase.from('services').select('service_id, name');
  
  if (fetchErr) {
    console.error('Fetch Error:', fetchErr);
    return;
  }
  
  console.log(`Found ${existing.length} services currently in database.`);
  
  if (existing.length > 0) {
    console.log('Deleting all existing services one by one...');
    for (let s of existing) {
       const { error: delErr } = await supabase.from('services').delete().eq('service_id', s.service_id);
       if (delErr) {
         console.error(`Failed to delete service_id ${s.service_id}:`, delErr);
       }
    }
  }

  console.log('Inserting exactly 8 pristine services...');
  const { error: insertErr } = await supabase.from('services').insert(correctServices);
  
  if (insertErr) {
    console.error('Insert Error:', insertErr);
    return;
  }
  
  console.log('SUCCESS: Database has been perfectly reset with exactly 1 copy of each service.');
}

fix();

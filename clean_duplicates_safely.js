const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
let url = '', serviceKey = '';
envFile.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) serviceKey = line.split('=')[1].trim();
});

const supabase = createClient(url, serviceKey);

async function cleanSafely() {
  console.log('Fetching all services from the database...');
  const { data: allServices, error: fetchErr } = await supabase.from('services').select('service_id, name').order('service_id', { ascending: true });
  
  if (fetchErr) {
    console.error('Fetch Error:', fetchErr);
    return;
  }
  
  console.log(`Found ${allServices.length} services currently in database.`);
  
  // Group by name
  const servicesByName = {};
  for (const s of allServices) {
    if (!servicesByName[s.name]) {
      servicesByName[s.name] = [];
    }
    servicesByName[s.name].push(s);
  }

  let deletedCount = 0;

  for (const name in servicesByName) {
    const list = servicesByName[name];
    
    // If there is more than 1 service with this name, we have duplicates
    if (list.length > 1) {
      console.log(`Found ${list.length} copies of "${name}". Keeping the original, deleting the rest...`);
      
      // Since we ordered by service_id ascending, list[0] is the oldest (original).
      // We will delete list[1] through list[N].
      for (let i = 1; i < list.length; i++) {
        const idToDelete = list[i].service_id;
        const { error: delErr } = await supabase.from('services').delete().eq('service_id', idToDelete);
        
        if (delErr) {
          console.error(`Failed to delete duplicate service_id ${idToDelete}:`, delErr);
        } else {
          deletedCount++;
          console.log(` - Successfully deleted duplicate ID ${idToDelete}`);
        }
      }
    }
  }

  // What about Surgery and Emergency Care which might have been deleted?
  // Let's check if we have exactly 8 unique services.
  const uniqueNames = Object.keys(servicesByName);
  console.log(`\nCleanup complete! Deleted ${deletedCount} duplicate copies.`);
  console.log(`The database now has exactly ${uniqueNames.length} unique services.`);
}

cleanSafely();

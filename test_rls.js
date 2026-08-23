const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
let url = '', anonKey = '', serviceKey = '';
envFile.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) url = line.split('=')[1].trim();
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) anonKey = line.split('=')[1].trim();
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) serviceKey = line.split('=')[1].trim();
});

async function run() {
    const anonClient = createClient(url, anonKey);
    const serviceClient = createClient(url, serviceKey);
    
    console.log('Fetching with ANON key...');
    const { data: anonData, error: anonError } = await anonClient.from('services').select('*');
    console.log('Anon Data Length:', anonData?.length, 'Error:', anonError);
    
    console.log('Fetching with SERVICE key...');
    const { data: serviceData, error: serviceError } = await serviceClient.from('services').select('*');
    console.log('Service Data Length:', serviceData?.length, 'Error:', serviceError);
}
run();

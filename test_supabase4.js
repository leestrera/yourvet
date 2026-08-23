const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    process.env[key] = val;
  }
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data: d1, error: e1 } = await supabase.from('staff').select('*').eq('is_active', 1);
  console.log('Staff (1) Error:', e1?.message);
  console.log('Staff (1) Count:', d1 ? d1.length : 0);

  const { data: d2, error: e2 } = await supabase.from('staff').select('*').eq('is_active', true);
  console.log('Staff (true) Error:', e2?.message);
  console.log('Staff (true) Count:', d2 ? d2.length : 0);
}
test();

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('services').select('*').eq('is_active', 1).order('category', { ascending: true }).order('display_order', { ascending: true });
  console.log("Error:", error);
  console.log("Data:", data);
}
test();

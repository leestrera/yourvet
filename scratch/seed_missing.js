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
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const testimonials = [
  { testimonial_id: 1, client_name: 'Jennifer Smith', pet_name: 'Max', testimonial: 'The team took such great care of Max during his surgery.', rating: 5, is_featured: true, is_approved: true, created_at: '2026-03-03 16:04:47' },
  { testimonial_id: 2, client_name: 'Robert Martinez', pet_name: 'Luna', testimonial: 'Dr. Johnson made Luna feel comfortable immediately. Highly recommend!', rating: 5, is_featured: true, is_approved: true, created_at: '2026-03-03 16:04:47' },
  { testimonial_id: 3, client_name: 'Emily Davis', pet_name: 'Charlie', testimonial: 'Professional, caring, and knowledgeable. 3 years and counting.', rating: 5, is_featured: true, is_approved: true, created_at: '2026-03-03 16:04:47' },
  { testimonial_id: 4, client_name: 'Lorenz Estrera', pet_name: 'Jose', testimonial: 'Im tell\'n you guys this is the best vet clinic in the world!', rating: 5, is_featured: true, is_approved: true, created_at: '2026-03-06 05:53:04' }
];

const blog_posts = [
  { post_id: 1, title: '10 Essential Tips for New Pet Owners', slug: '10-essential-tips-for-new-pet-owners', content: 'Bringing home a new pet is exciting but can also be overwhelming. Here are 10 essential tips to help you and your new companion start off on the right paw...', excerpt: 'Essential guidance for new pet parents to ensure a smooth transition for their furry friends.', author: 'Dr. Sarah Johnson', is_published: true, is_featured: true, published_at: '2026-03-03 08:29:38', created_at: '2026-03-03 16:04:47' },
  { post_id: 2, title: 'The Importance of Regular Dental Care for Pets', slug: 'importance-of-regular-dental-care-for-pets', content: 'Just like humans, pets need regular dental care to maintain good health. Learn why dental hygiene is crucial for your pets overall well-being...', excerpt: 'Understanding why dental care is essential for your pets health and happiness.', author: 'Dr. Michael Chen', is_published: true, is_featured: true, published_at: '2025-08-20 02:15:41', created_at: '2026-03-03 16:04:47' },
  { post_id: 3, title: 'Preparing Your Pet for Emergency Situations', slug: 'preparing-your-pet-for-emergency-situations', content: 'Emergencies can happen when we least expect them. Being prepared can make all the difference in your pet\'s outcome...', excerpt: 'Learn how to prepare for and handle pet emergencies before they happen.', author: 'Lisa Rodriguez', is_published: true, is_featured: true, published_at: '2025-08-20 02:15:41', created_at: '2026-03-03 16:04:47' },
  { post_id: 4, title: 'Toxic Foods for Dogs and Cats', slug: 'toxic-foods-for-dogs-and-cats', content: 'A comprehensive list of foods that are dangerous for pets, including chocolate, grapes, onions, and more.', excerpt: 'A comprehensive list of foods that are dangerous for pets, including chocolate, grapes, onions, and more.', author: 'External Source', external_url: 'https://www.petpoisonhelpline.com/poisons/', is_published: true, is_featured: false, published_at: '2025-08-20 09:39:19', created_at: '2026-03-03 16:04:47' },
  { post_id: 5, title: 'Spaying and Neutering Your Pet', slug: 'spaying-and-neutering-your-pet', content: 'Learn about the benefits of spaying and neutering, including health advantages and population control.', excerpt: 'Learn about the benefits of spaying and neutering, including health advantages and population control.', author: 'External Source', external_url: 'https://www.aspca.org/pet-care/general-pet-care/spayneuter-your-pet', is_published: true, is_featured: false, published_at: '2025-08-20 09:39:19', created_at: '2026-03-03 16:04:47' },
  { post_id: 6, title: 'Microchipping Your Pet: What You Need to Know', slug: 'microchipping-your-pet-what-you-need-to-know', content: 'Everything about pet microchips - how they work, the procedure, and why they\'re important for pet recovery.', excerpt: 'Everything about pet microchips - how they work, the procedure, and why they\'re important for pet recovery.', author: 'External Source', external_url: 'https://www.avma.org/resources-tools/pet-owners/petcare/microchipping-animals', is_published: true, is_featured: false, published_at: '2025-08-20 09:39:19', created_at: '2026-03-03 16:04:47' }
];

async function seed() {
  const { data: d1, error: e1 } = await supabase.from('testimonials').upsert(testimonials);
  console.log('Testimonials Insert Error:', e1);
  
  const { data: d2, error: e2 } = await supabase.from('blog_posts').upsert(blog_posts);
  console.log('Blog Posts Insert Error:', e2);
  
  console.log('Done!');
}
seed();

'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get('title');
  const slug = formData.get('slug');
  const content = formData.get('content');
  const excerpt = formData.get('excerpt');
  const author = formData.get('author');
  const is_published = formData.get('is_published') === 'on';
  const is_featured = formData.get('is_featured') === 'on';
  const external_url = formData.get('external_url') || null;

  const { data: { user } } = await supabase.auth.getUser();
  let admin_id = null;
  if (user) {
      const { data: adminData } = await supabase.from('admin_users').select('admin_id').eq('email', user.email).single();
      if (adminData) admin_id = adminData.admin_id;
  }

  const payload: any = {
    admin_id,
    title,
    slug,
    content,
    excerpt,
    author,
    external_url,
    is_published,
    is_featured
  };

  if (is_published) {
      payload.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from('blog_posts').insert([payload]);

  if (error) {
    console.error('Error creating blog post:', error);
    throw new Error('Failed to create blog post');
  }

  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

export async function updateBlogPost(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const post_id = formData.get('post_id');
  const title = formData.get('title');
  const slug = formData.get('slug');
  const content = formData.get('content');
  const excerpt = formData.get('excerpt');
  const author = formData.get('author');
  const is_published = formData.get('is_published') === 'on';
  const is_featured = formData.get('is_featured') === 'on';
  const external_url = formData.get('external_url') || null;

  const payload: any = {
    title,
    slug,
    content,
    excerpt,
    author,
    external_url,
    is_published,
    is_featured
  };

  // If it was just published, set published_at
  const { data: existing } = await supabase.from('blog_posts').select('is_published, published_at').eq('post_id', post_id).single();
  if (is_published && existing && !existing.is_published) {
      payload.published_at = new Date().toISOString();
  }

  const { error } = await supabase.from('blog_posts').update(payload).eq('post_id', post_id);

  if (error) {
    console.error('Error updating blog post:', error);
    throw new Error('Failed to update blog post');
  }

  revalidatePath('/admin/blog');
  redirect('/admin/blog');
}

export async function deleteBlogPost(post_id: string) {
    const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from('blog_posts').delete().eq('post_id', post_id);
    if (error) {
        console.error('Error deleting blog post:', error);
        throw new Error('Failed to delete blog post');
    }
    revalidatePath('/admin/blog');
}

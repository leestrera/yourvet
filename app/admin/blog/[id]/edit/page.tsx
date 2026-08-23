import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { updateBlogPost } from '../../actions';

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const postId = (await params).id;
  
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('post_id', postId)
    .single();

  if (error || !post) {
    return <div style={{ padding: '2rem' }}>Blog post not found.</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/admin/blog" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back to Blog
        </a>
        <h2 style={{ margin: 0, fontWeight: 800 }}>Edit Blog Post</h2>
      </div>

      <div className="form-card">
        <form action={updateBlogPost} className="admin-form">
          <input type="hidden" name="post_id" value={post.post_id} />
          
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-pen-alt"></i> Post Content</h3>
            
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label>Title <span className="required">*</span></label>
                <input type="text" name="title" defaultValue={post.title} required />
              </div>
              
              <div className="form-group form-group-full">
                <label>Slug (URL Friendly) <span className="required">*</span></label>
                <input type="text" name="slug" defaultValue={post.slug} required />
              </div>

              <div className="form-group">
                <label>Author</label>
                <input type="text" name="author" defaultValue={post.author || ''} />
              </div>

              <div className="form-group">
                <label>External URL (Optional)</label>
                <input type="url" name="external_url" defaultValue={post.external_url || ''} />
              </div>

              <div className="form-group form-group-full">
                <label>Excerpt <span className="required">*</span></label>
                <textarea name="excerpt" defaultValue={post.excerpt} required rows={3}></textarea>
              </div>
              
              <div className="form-group form-group-full">
                <label>Full Content <span className="required">*</span></label>
                <textarea name="content" defaultValue={post.content} required rows={12}></textarea>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="is_published" name="is_published" defaultChecked={post.is_published} style={{ width: 'auto', height: '1.2rem', accentColor: 'var(--primary-color)' }} />
                    <label htmlFor="is_published" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>Published</label>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="is_featured" name="is_featured" defaultChecked={post.is_featured} style={{ width: 'auto', height: '1.2rem', accentColor: 'var(--primary-color)' }} />
                    <label htmlFor="is_featured" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>Feature this post</label>
                </div>
            </div>
          </div>

          <div className="form-card-actions">
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <i className="fas fa-save"></i> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

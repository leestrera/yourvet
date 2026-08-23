import React from 'react';
import { createBlogPost } from '../actions';

export default function NewBlogPostPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <a href="/admin/blog" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', textDecoration: 'none', background: 'var(--white)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-dark)' }}>
          <i className="fas fa-arrow-left"></i> Back to Blog
        </a>
        <h2 style={{ margin: 0, fontWeight: 800 }}>Write New Post</h2>
      </div>

      <div className="form-card">
        <form action={createBlogPost} className="admin-form">
          <div className="form-section">
            <h3 className="section-title"><i className="fas fa-pen-alt"></i> Post Content</h3>
            
            <div className="form-grid">
              <div className="form-group form-group-full">
                <label>Title <span className="required">*</span></label>
                <input type="text" name="title" required placeholder="e.g. 10 Essential Tips for New Pet Owners" />
              </div>
              
              <div className="form-group form-group-full">
                <label>Slug (URL Friendly) <span className="required">*</span></label>
                <input type="text" name="slug" required placeholder="e.g. 10-essential-tips-for-new-pet-owners" />
                <small style={{ color: 'var(--text-light)', marginTop: '0.25rem', display: 'block' }}>This will be used in the URL: /blog/your-slug</small>
              </div>

              <div className="form-group">
                <label>Author</label>
                <input type="text" name="author" placeholder="e.g. Dr. Sarah Johnson" />
              </div>

              <div className="form-group">
                <label>External URL (Optional)</label>
                <input type="url" name="external_url" placeholder="https://..." />
                <small style={{ color: 'var(--text-light)', marginTop: '0.25rem', display: 'block' }}>If provided, clicking the post will link here.</small>
              </div>

              <div className="form-group form-group-full">
                <label>Excerpt <span className="required">*</span></label>
                <textarea name="excerpt" required rows={3} placeholder="A short summary of the post..."></textarea>
              </div>
              
              <div className="form-group form-group-full">
                <label>Full Content <span className="required">*</span></label>
                <textarea name="content" required rows={12} placeholder="Write your full blog post here (HTML/Markdown supported depending on your frontend setup)..."></textarea>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="is_published" name="is_published" defaultChecked style={{ width: 'auto', height: '1.2rem', accentColor: 'var(--primary-color)' }} />
                    <label htmlFor="is_published" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>Publish immediately</label>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="is_featured" name="is_featured" style={{ width: 'auto', height: '1.2rem', accentColor: 'var(--primary-color)' }} />
                    <label htmlFor="is_featured" style={{ margin: 0, cursor: 'pointer', fontWeight: 600 }}>Feature this post</label>
                </div>
            </div>
          </div>

          <div className="form-card-actions">
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              <i className="fas fa-save"></i> Save Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

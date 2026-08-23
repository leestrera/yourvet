import React from 'react';
import { createClient } from '@/utils/supabase/server';
import DeleteBlogButton from './DeleteBlogButton';

export default async function BlogPage() {
  const supabase = await createClient();
  
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: 'var(--text-dark)' }}>Blog & Articles</h2>
        <a href="/admin/blog/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
          <i className="fas fa-pen"></i> Write Post
        </a>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Title & Author</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th className="actions-column">Actions</th>
                </tr>
            </thead>
            <tbody>
                {(!posts || posts.length === 0) ? (
                    <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                            No blog posts found. Write your first post!
                        </td>
                    </tr>
                ) : (
                    posts.map((post: any) => (
                        <tr key={post.post_id}>
                            <td>
                                <div><strong>{post.title}</strong></div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>By {post.author || 'Admin'}</div>
                            </td>
                            <td>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <span className={`status-indicator ${post.is_published ? 'active' : 'inactive'}`}>
                                        {post.is_published ? 'Published' : 'Draft'}
                                    </span>
                                    {post.is_featured && (
                                        <span className="badge" style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Featured</span>
                                    )}
                                </div>
                            </td>
                            <td className="actions-cell">
                                <a href={`/admin/blog/${post.post_id}/edit`} className="action-btn">
                                    <i className="fas fa-edit"></i> Edit
                                </a>
                                <DeleteBlogButton id={post.post_id} />
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}

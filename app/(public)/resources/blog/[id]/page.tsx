import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import '../../resources.css';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('post_id', (await params).id)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found | Your Vet',
    };
  }

  return {
    title: `${post.title} | Your Vet Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('post_id', (await params).id)
    .eq('is_published', true)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <>
      <section className="page-header">
          <div className="container">
              <div className="page-header-content">
                  <div style={{ marginBottom: '1rem' }}>
                      <a href="/resources/blog" style={{ color: 'var(--primary-light)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <i className="fas fa-arrow-left"></i> Back to Blog
                      </a>
                  </div>
                  <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{post.title}</h1>
                  <div className="article-meta" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
                      <span className="article-author">
                          <i className="fas fa-user"></i> {post.author || 'PawCare Team'}
                      </span>
                      <span className="article-date">
                          <i className="fas fa-calendar"></i> {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      {post.category && (
                          <span className="article-category">
                              <i className="fas fa-tag"></i> {post.category}
                          </span>
                      )}
                  </div>
              </div>
          </div>
      </section>

      <article className="blog-post-content" style={{ padding: '4rem 0' }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
              {post.featured_image && (
                  <div className="featured-image" style={{ marginBottom: '3rem', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        style={{ width: '100%', height: 'auto', display: 'block' }} 
                      />
                  </div>
              )}
              
              {post.excerpt && (
                  <div className="post-excerpt" style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', fontStyle: 'italic', marginBottom: '2rem', paddingLeft: '1rem', borderLeft: '4px solid var(--primary-color)' }}>
                      {post.excerpt}
                  </div>
              )}
              
              {/* Note: The content here might be rich text (HTML) from a CMS editor. */}
              {/* In a real app we'd use a safe HTML parser, but for this demo we'll use dangerouslySetInnerHTML */}
              <div 
                  className="post-body" 
                  style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-color)' }}
                  dangerouslySetInnerHTML={{ __html: post.content }} 
              />
          </div>
      </article>

      <section className="newsletter-cta">
          <div className="container">
              <div className="newsletter-content">
                  <div className="newsletter-text">
                      <h2>Enjoyed this article?</h2>
                      <p>Subscribe to our newsletter to get the latest pet care tips delivered to your inbox.</p>
                  </div>
                  
                  <form className="newsletter-signup-form" action="/api/newsletter/subscribe" method="POST">
                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <input type="email" name="email" placeholder="Your email address" required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                      </div>
                      <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <input type="text" name="name" placeholder="Your name (optional)" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ddd' }} />
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                          <i className="fas fa-envelope"></i> Subscribe
                      </button>
                  </form>
              </div>
          </div>
      </section>
    </>
  );
}

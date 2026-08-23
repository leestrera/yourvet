import React from 'react';
import { createClient } from '@/utils/supabase/server';
import '../resources.css';

export const metadata = {
  title: 'Pet Care Blog | Your Vet',
  description: 'Expert articles on pet health, nutrition, behavior, and care tips from our experienced veterinary team.',
};

export default async function BlogPage() {
  const supabase = await createClient();
  
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
  }

  return (
    <>
      <section className="page-header">
          <div className="container">
              <div className="page-header-content">
                  <h1>Pet Care Blog</h1>
                  <p>Expert articles and tips from our experienced veterinary team</p>
              </div>
          </div>
      </section>

      <section className="featured-articles" style={{ padding: '4rem 0', background: 'var(--bg-light)' }}>
          <div className="container">
              <div className="articles-grid">
                  {(!posts || posts.length === 0) ? (
                      <div className="text-center" style={{ gridColumn: '1 / -1', padding: '3rem 0' }}>
                          <p>No articles published yet. Check back soon!</p>
                      </div>
                  ) : (
                      posts.map((post: any) => {
                          const linkUrl = `/resources/blog/${post.post_id}`;
                          
                          return (
                              <article key={post.post_id} className="article-card">
                                  {/* Using a placeholder if no image exists for now */}
                                  <div className="article-image">
                                      <img 
                                        src={post.featured_image || `https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop`} 
                                        alt={post.title} 
                                        loading="lazy" 
                                      />
                                  </div>
                                  <div className="article-content">
                                      {post.category && (
                                          <div style={{ marginBottom: '10px' }}>
                                              <span className="badge" style={{ background: 'var(--primary-color)', color: 'white', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                                  {post.category}
                                              </span>
                                          </div>
                                      )}
                                      <h3>
                                          <a href={linkUrl}>
                                              {post.title}
                                          </a>
                                      </h3>
                                      <p className="article-excerpt">{post.excerpt || (post.content?.substring(0, 120) + '...')}</p>
                                      <div className="article-meta">
                                          <span className="article-author">
                                              <i className="fas fa-user"></i>
                                              {post.author || 'PawCare Team'}
                                          </span>
                                          <span className="article-date">
                                              <i className="fas fa-calendar"></i>
                                              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                          </span>
                                      </div>
                                      <a href={linkUrl} className="read-more">
                                          Read More <i className="fas fa-arrow-right"></i>
                                      </a>
                                  </div>
                              </article>
                          );
                      })
                  )}
              </div>
          </div>
      </section>
    </>
  );
}

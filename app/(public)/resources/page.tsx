import React from 'react';
import './resources.css';
import { createClient } from '@/utils/supabase/server';

export const metadata = {
  title: 'Pet Care Resources | Your Vet',
  description: 'Expert advice and helpful information for keeping your pets healthy and happy.',
};

const blogPosts = [
  { id: 1, title: "10 Tips for a Happy, Healthy Dog", excerpt: "Learn the essential habits to keep your canine companion thriving for years to come.", author: "Dr. Sarah Johnson", created_at: "2023-10-15", featured_image: "dog-tips.jpg", external_url: "" },
  { id: 2, title: "Understanding Feline Behavior", excerpt: "Is your cat acting strange? Decode their mysterious behavior with our comprehensive guide.", author: "Dr. Michael Chen", created_at: "2023-09-28", featured_image: "cat-behavior.jpg", external_url: "" },
  { id: 3, title: "The Importance of Pet Dental Care", excerpt: "Why regular dental checkups are crucial for your pet's overall health and longevity.", author: "Dr. Emily Davis", created_at: "2023-09-10", featured_image: "pet-dental.jpg", external_url: "" }
];

export default async function Resources() {
  const supabase = await createClient();
  
  // Fetch active FAQs from Supabase, ordered by display_order
  const { data: faqsData } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(6);
    
  const faqs = faqsData || [];

  return (
    <>
      <section className="page-header">
          <div className="container">
              <div className="page-header-content">
                  <h1>Pet Care Resources</h1>
                  <p>Expert advice and helpful information for keeping your pets healthy and happy</p>
                  <div className="page-header-actions">
                      <a href="/resources/blog" className="btn btn-primary">
                          <i className="fas fa-newspaper"></i>
                          Read Our Blog
                      </a>
                      <a href="/resources/faq" className="btn btn-outline">
                          <i className="fas fa-question-circle"></i>
                          View FAQ
                      </a>
                  </div>
              </div>
          </div>
      </section>

      <section className="resources-overview">
          <div className="container">
              <div className="resources-grid">
                  <div className="resource-category">
                      <div className="category-icon">
                          <i className="fas fa-blog"></i>
                      </div>
                      <h3>Pet Care Blog</h3>
                      <p>Expert articles on pet health, nutrition, behavior, and care tips from our experienced veterinary team.</p>
                      <a href="/resources/blog" className="btn btn-secondary">Read Articles</a>
                  </div>
                  
                  <div className="resource-category">
                      <div className="category-icon">
                          <i className="fas fa-question-circle"></i>
                      </div>
                      <h3>FAQ</h3>
                      <p>Quick answers to the most commonly asked questions about our services, pet care, and clinic policies.</p>
                      <a href="/resources/faq" className="btn btn-secondary">View FAQ</a>
                  </div>
                  
                  <div className="resource-category">
                      <div className="category-icon">
                          <i className="fas fa-calendar-check"></i>
                      </div>
                      <h3>Health Reminders</h3>
                      <p>Stay on top of your pet's health with our vaccination and wellness schedules and reminder guides.</p>
                      <a href="/appointments" className="btn btn-secondary">Schedule Visit</a>
                  </div>
                  
                  <div className="resource-category">
                      <div className="category-icon">
                          <i className="fas fa-phone"></i>
                      </div>
                      <h3>Emergency Guide</h3>
                      <p>Know what to do in pet emergencies and when to seek immediate veterinary care for your pet.</p>
                      <a href="/contact" className="btn btn-secondary">Emergency Info</a>
                  </div>
              </div>
          </div>
      </section>

      <section className="featured-articles">
          <div className="container">
              <div className="section-header">
                  <h2>Featured Articles</h2>
                  <p>Latest insights and tips from our veterinary experts</p>
              </div>
              
              <div className="articles-grid">
                  {blogPosts.map((post) => {
                      const linkUrl = post.external_url ? post.external_url : `/resources/blog/${post.id}`;
                      const isExternal = !!post.external_url;
                      
                      return (
                          <article key={post.id} className="article-card">
                              {post.featured_image && (
                                  <div className="article-image">
                                      <img 
                                        src={`https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop`} 
                                        alt={post.title} 
                                        loading="lazy" 
                                      />
                                  </div>
                              )}
                              <div className="article-content">
                                  <h3>
                                      <a href={linkUrl} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined}>
                                          {post.title}
                                      </a>
                                  </h3>
                                  <p className="article-excerpt">{post.excerpt}</p>
                                  <div className="article-meta">
                                      <span className="article-author">
                                          <i className="fas fa-user"></i>
                                          {post.author}
                                      </span>
                                      <span className="article-date">
                                          <i className="fas fa-calendar"></i>
                                          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                      </span>
                                  </div>
                                  <a href={linkUrl} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className="read-more">
                                      {isExternal ? 'Read Full Article' : 'Read More'} <i className={isExternal ? "fas fa-external-link-alt" : "fas fa-arrow-right"}></i>
                                  </a>
                              </div>
                          </article>
                      );
                  })}
              </div>
              
              <div className="text-center">
                  <a href="/resources/blog" className="btn btn-primary">
                      <i className="fas fa-newspaper"></i>
                      View All Articles
                  </a>
              </div>
          </div>
      </section>

      <section className="quick-faq">
          <div className="container">
              <div className="section-header">
                  <h2>Quick Answers</h2>
                  <p>Frequently asked questions about pet care</p>
              </div>
              
              <div className="faq-grid">
                  {faqs.map((faq, index) => (
                      <div key={index} className="faq-item">
                          <h4 className="faq-question">
                              <i className="fas fa-question-circle"></i>
                              {faq.question}
                          </h4>
                          <p className="faq-answer">{faq.answer}</p>
                      </div>
                  ))}
              </div>
              
              <div className="text-center">
                  <a href="/resources/faq" className="btn btn-secondary">
                      <i className="fas fa-question-circle"></i>
                      View All FAQ
                  </a>
              </div>
          </div>
      </section>

      <section className="pet-care-tips">
          <div className="container">
              <div className="section-header">
                  <h2>Essential Pet Care Tips</h2>
                  <p>Basic guidelines for keeping your pet healthy</p>
              </div>
              
              <div className="tips-grid">
                  <div className="tip-card">
                      <div className="tip-icon">
                          <i className="fas fa-heartbeat"></i>
                      </div>
                      <h3>Regular Checkups</h3>
                      <p>Schedule annual wellness exams for adult pets and biannual visits for senior pets to catch health issues early.</p>
                  </div>
                  
                  <div className="tip-card">
                      <div className="tip-icon">
                          <i className="fas fa-syringe"></i>
                      </div>
                      <h3>Stay Current on Vaccines</h3>
                      <p>Keep your pet's vaccinations up to date to protect against serious diseases and maintain their immunity.</p>
                  </div>
                  
                  <div className="tip-card">
                      <div className="tip-icon">
                          <i className="fas fa-tooth"></i>
                      </div>
                      <h3>Dental Care</h3>
                      <p>Brush your pet's teeth regularly and schedule professional cleanings to prevent dental disease and pain.</p>
                  </div>
                  
                  <div className="tip-card">
                      <div className="tip-icon">
                          <i className="fas fa-apple-alt"></i>
                      </div>
                      <h3>Proper Nutrition</h3>
                      <p>Feed high-quality food appropriate for your pet's age, size, and health needs. Avoid overfeeding.</p>
                  </div>
                  
                  <div className="tip-card">
                      <div className="tip-icon">
                          <i className="fas fa-running"></i>
                      </div>
                      <h3>Exercise Daily</h3>
                      <p>Provide regular exercise appropriate for your pet's breed and age to maintain physical and mental health.</p>
                  </div>
                  
                  <div className="tip-card">
                      <div className="tip-icon">
                          <i className="fas fa-bug"></i>
                      </div>
                      <h3>Parasite Prevention</h3>
                      <p>Use year-round flea, tick, and heartworm prevention as recommended by your veterinarian.</p>
                  </div>
              </div>
          </div>
      </section>

      <section className="newsletter-cta">
          <div className="container">
              <div className="newsletter-content">
                  <div className="newsletter-text">
                      <h2>Stay Informed with Our Newsletter</h2>
                      <p>Get the latest pet care tips, health advice, and clinic updates delivered to your inbox monthly.</p>
                      <ul className="newsletter-benefits">
                          <li><i className="fas fa-check"></i> Monthly pet health tips</li>
                          <li><i className="fas fa-check"></i> Seasonal care reminders</li>
                          <li><i className="fas fa-check"></i> Special offers and promotions</li>
                          <li><i className="fas fa-check"></i> Expert veterinary advice</li>
                      </ul>
                  </div>
                  
                  <form className="newsletter-signup-form" action="/api/newsletter/subscribe" method="POST">
                      <h3>Subscribe Now</h3>
                      <div className="form-group">
                          <input type="email" name="email" placeholder="Your email" required />
                      </div>
                      <div className="form-group">
                          <input type="text" name="name" placeholder="Name (optional)" />
                      </div>
                      <button type="submit" className="btn btn-primary btn-large">
                          <i className="fas fa-envelope"></i>
                          Subscribe
                      </button>
                      <p className="privacy-note">We respect your privacy and will never share your email address.</p>
                  </form>
              </div>
          </div>
      </section>
    </>
  );
}

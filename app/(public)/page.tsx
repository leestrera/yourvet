import React from 'react';
import { createClient } from '@/utils/supabase/server';
import SalePopup from '@/components/SalePopup';
import ScrollIndicator from '@/components/ScrollIndicator';
import PawTrailReveal from '@/components/PawTrailReveal';

export default async function Home() {
  const supabase = await createClient();

  // Fetch Team
  const { data: teamData } = await supabase
    .from('staff')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(4);

  // Fetch Testimonials
  const { data: testimonialsData } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .eq('is_featured', true)
    .limit(10);

  // Fetch Blog Posts
  const { data: blogPostsData } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(3);

  const team = teamData || [];
  const testimonials = testimonialsData || [];
  const blogPosts = blogPostsData || [];

  return (
    <>
      <SalePopup />
      <PawTrailReveal />
      <section className="hero">
        <div className="hero-content">
          <div className="container">
            <div className="hero-content-flex">
              <div className="hero-logo-left">
                <img src="/assets/images/logo/logo.png" alt="Your Vet Logo" className="hero-main-logo" />
              </div>
              <div className="hero-text-right">
                <img src="/assets/images/logo/text-logo.png" alt="Your Vet" className="hero-text-logo" />
                <p>Where pets come first.</p>
              </div>
            </div>
            <div className="hero-buttons">
              <a href="/appointments/book" className="btn btn-primary btn-large">
                <i className="fas fa-calendar-plus"></i>
                Book Appointment
              </a>
              <a href="/services" className="btn btn-secondary btn-large">
                <i className="fas fa-paw"></i>
                Our Services
              </a>
            </div>

            <ScrollIndicator />
          </div>
        </div>
      </section>

      <section className="service-features">
        <div className="paw-trail-overlay">
          <i className="fas fa-paw paw-print paw-8"></i>
          <i className="fas fa-paw paw-print paw-9"></i>
          <i className="fas fa-paw paw-print paw-10"></i>
          <i className="fas fa-paw paw-print paw-11"></i>
          <i className="fas fa-paw paw-print paw-12"></i>
          <i className="fas fa-paw paw-print paw-13"></i>
          <i className="fas fa-paw paw-print paw-14"></i>
          <i className="fas fa-paw paw-print paw-15"></i>
        </div>
        <div className="services-bg-particles"></div>
        <div className="container">
          <div className="section-header">
            <h2>Comprehensive Veterinary Services</h2>
            <p>From routine wellness exams to emergency care, we provide complete veterinary services for your beloved pets with state-of-the-art facilities and compassionate expertise</p>
          </div>

          <div className="paw-trail-wellness">
            {[...Array(15)].map((_, i) => (
              <i key={i} className={`fas fa-paw paw-print paw-w${i + 1}`}></i>
            ))}
          </div>

          {/* Service Section 1: Wellness Care */}
          <div className="service-section service-layout-right">
            <div className="service-content">
              <div className="service-badge wellness-badge">WELLNESS</div>
              <h3>Preventive Care</h3>
              <p>Comprehensive wellness exams and vaccination programs designed to keep your pet healthy throughout their life. Regular checkups help detect issues early and maintain optimal health.</p>
              <ul className="service-features">
                <li><span className="feature-icon">🛡️</span> Comprehensive Exams</li>
                <li><span className="feature-icon">💉</span> Vaccination Programs</li>
                <li><span className="feature-icon">📋</span> Health Monitoring</li>
              </ul>
              <div className="service-actions">
                <a href="/appointments" className="btn btn-primary">Book Appointment</a>
                <a href="/services" className="btn btn-secondary">Learn More</a>
              </div>
            </div>
            <div className="service-images-container">
              <div className="main-image">
                <img src="/assets/images/features/wellness/wellness1.jpg" alt="Wellness exams" loading="lazy" />
              </div>
              <div className="floating-image floating-1">
                <img src="/assets/images/features/wellness/wellness2.jpg" alt="Pet vaccination" loading="lazy" />
              </div>
              <div className="floating-image floating-2">
                <img src="/assets/images/features/wellness/wellness3.jpg" alt="Pet checkup" loading="lazy" />
              </div>
              <div className="floating-image floating-3">
                <img src="/assets/images/features/wellness/wellness4.jpg" alt="Healthy pets" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="paw-trail-diagnostic">
            {[...Array(10)].map((_, i) => (
              <i key={i} className={`fas fa-paw paw-print paw-d${i + 1}`}></i>
            ))}
          </div>

          <div className="paw-trail-diagnostic">
            {[...Array(10)].map((_, i) => (
              <i key={i} className={`fas fa-paw paw-print paw-d${i + 1}`}></i>
            ))}
          </div>

          {/* Service Section 2: Diagnostics */}
          <div className="service-section service-layout-left">
            <div className="service-images-container">
              <div className="main-image">
                <img src="/assets/images/features/diagnostic/diagnostic1.jpg" alt="Laboratory diagnostics" loading="lazy" />
              </div>
              <div className="floating-image floating-1">
                <img src="/assets/images/features/diagnostic/diagnostic2.jpg" alt="Lab equipment" loading="lazy" />
              </div>
              <div className="floating-image floating-2">
                <img src="/assets/images/features/diagnostic/diagnostic3.jpg" alt="Medical testing" loading="lazy" />
              </div>
              <div className="floating-image floating-3">
                <img src="/assets/images/features/diagnostic/diagnostic4.jpg" alt="Veterinary lab" loading="lazy" />
              </div>
            </div>
            <div className="service-content">
              <div className="service-badge diagnostics-badge">DIAGNOSTICS</div>
              <h3>Advanced Testing</h3>
              <p>Rapid diagnostic testing with same-day results using our in-house laboratory. Quick, accurate diagnostics help us provide the best treatment for your pet.</p>
              <ul className="service-features">
                <li><span className="feature-icon">🔬</span> In-house Laboratory</li>
                <li><span className="feature-icon">⏱️</span> Same-day Results</li>
                <li><span className="feature-icon">🎯</span> Accurate Diagnostics</li>
              </ul>
              <div className="service-actions">
                <a href="/appointments" className="btn btn-primary">Schedule Testing</a>
                <a href="/services" className="btn btn-secondary">Learn More</a>
              </div>
            </div>
          </div>

          <div className="paw-trail-dental">
            {[...Array(10)].map((_, i) => (
              <i key={i} className={`fas fa-paw paw-print paw-t${i + 1}`}></i>
            ))}
          </div>

          {/* Service Section 3: Dental */}
          <div className="service-section service-layout-right">
            <div className="service-content">
              <div className="service-badge dental-badge">DENTAL</div>
              <h3>Dental Health</h3>
              <p>Professional dental care and oral health maintenance to prevent disease and maintain your pet's overall health. Clean teeth contribute to a longer, healthier life.</p>
              <ul className="service-features">
                <li><span className="feature-icon">🦷</span> Professional Cleaning</li>
                <li><span className="feature-icon">🔍</span> Oral Health Assessment</li>
                <li><span className="feature-icon">🛡️</span> Disease Prevention</li>
              </ul>
              <div className="service-actions">
                <a href="/appointments" className="btn btn-primary">Book Appointment</a>
                <a href="/services" className="btn btn-secondary">Learn More</a>
              </div>
            </div>
            <div className="service-images-container">
              <div className="main-image">
                <img src="/assets/images/features/dental/dental5.jpg" alt="Dental care" loading="lazy" />
              </div>
              <div className="floating-image floating-1">
                <img src="/assets/images/features/dental/dental2.jpg" alt="Pet dental exam" loading="lazy" />
              </div>
              <div className="floating-image floating-2">
                <img src="/assets/images/features/dental/dental3.jpg" alt="Dental tools" loading="lazy" />
              </div>
              <div className="floating-image floating-3">
                <img src="/assets/images/features/dental/dental4.jpg" alt="Happy healthy pet" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="paw-trail-surgery">
            {[...Array(10)].map((_, i) => (
              <i key={i} className={`fas fa-paw paw-print paw-s${i + 1}`}></i>
            ))}
          </div>

          {/* Service Section 4: Surgery */}
          <div className="service-section service-layout-left">
            <div className="service-images-container">
              <div className="main-image">
                <img src="/assets/images/features/surgery/surgery1.jpg" alt="Surgical procedures" loading="lazy" />
              </div>
              <div className="floating-image floating-1">
                <img src="/assets/images/features/surgery/surgery2.jpg" alt="Surgical instruments" loading="lazy" />
              </div>
              <div className="floating-image floating-2">
                <img src="/assets/images/features/surgery/surgery3.jpg" alt="Operating room" loading="lazy" />
              </div>
              <div className="floating-image floating-3">
                <img src="/assets/images/features/surgery/surgery4.jpg" alt="Surgery recovery" loading="lazy" />
              </div>
            </div>
            <div className="service-content">
              <div className="service-badge surgery-badge">SURGERY</div>
              <h3>Surgical Excellence</h3>
              <p>Advanced surgical procedures with precision monitoring in our state-of-the-art surgical suite. From routine spays to complex procedures, your pet receives expert care.</p>
              <ul className="service-features">
                <li><span className="feature-icon">⚕️</span> Advanced Procedures</li>
                <li><span className="feature-icon">📊</span> Precision Monitoring</li>
                <li><span className="feature-icon">🏥</span> State-of-the-art Suite</li>
              </ul>
              <div className="service-actions">
                <a href="/appointments" className="btn btn-primary">Schedule Consultation</a>
                <a href="/services" className="btn btn-secondary">Learn More</a>
              </div>
            </div>
          </div>

          <div className="paw-trail-emergency">
            {[...Array(10)].map((_, i) => (
              <i key={i} className={`fas fa-paw paw-print paw-e${i + 1}`}></i>
            ))}
          </div>

          {/* Service Section 5: Emergency Care */}
          <div className="service-section service-layout-right">
            <div className="service-content">
              <div className="service-badge emergency-badge">EMERGENCY</div>
              <h3>24/7 Emergency Care</h3>
              <p>When every second counts, our emergency team is here. State-of-the-art critical care facility with advanced life support systems for immediate response and trauma surgery.</p>
              <ul className="service-features">
                <li><span className="feature-icon">⚡</span> Immediate Response</li>
                <li><span className="feature-icon">🏥</span> ICU Monitoring</li>
                <li><span className="feature-icon">🚑</span> Trauma Surgery</li>
              </ul>
              <div className="service-actions">
                <a href="tel:555-123-4567" className="btn btn-emergency">
                  Emergency Call Now
                </a>
                <a href="/services" className="btn btn-secondary">Learn More</a>
              </div>
            </div>
            <div className="service-images-container">
              <div className="main-image">
                <img src="/assets/images/features/emergency/emergency1.jpg" alt="24/7 Emergency veterinary care" loading="lazy" />
              </div>
              <div className="floating-image floating-1">
                <img src="/assets/images/features/emergency/emergency2.jpg" alt="Emergency equipment" loading="lazy" />
              </div>
              <div className="floating-image floating-2">
                <img src="/assets/images/features/emergency/emergency3.jpg" alt="Veterinary emergency room" loading="lazy" />
              </div>
              <div className="floating-image floating-3">
                <img src="/assets/images/features/emergency/emergency4.jpg" alt="Emergency care team" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <div className="section-header">
              <h2>What Pet Parents Say</h2>
              <p>Real stories from our satisfied clients</p>
          </div>
          <div className="testimonials-carousel">

            <div className="testimonials-wrapper">
              <div className="testimonials-track">
                {[...testimonials, ...testimonials].map((t, idx) => (
                  <div key={idx} className="testimonial-card">
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star ${i < t.rating ? 'active' : ''}`}></i>
                      ))}
                    </div>
                    <blockquote>"{t.testimonial}"</blockquote>
                    <div className="testimonial-author">
                      <strong>{t.client_name}</strong>
                      {t.pet_name && <span>&amp; {t.pet_name}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="team-preview">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Team</h2>
            <p>Experienced professionals dedicated to your pet's well-being</p>
          </div>
          <div className="team-grid">
            {team.map((member, idx) => (
              <div key={idx} className="team-card">
                <div className="team-photo">
                  <img src={member.photo ? `/assets/uploads/team/${member.photo}` : "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face"} alt={member.name || member.first_name} loading="lazy" />
                </div>
                <div className="team-info">
                  <h3>{member.name || `${member.first_name} ${member.last_name}`}</h3>
                  <p className="team-title">{member.role}</p>
                  <p className="team-bio">
                    {member.credentials 
                      ? (member.credentials.length > 120 ? `${member.credentials.substring(0, 120)}...` : member.credentials)
                      : ''}
                  </p>
                  {member.specialization && <p className="team-credentials">{member.specialization}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a href="/about" className="btn btn-secondary">Meet the Full Team</a>
          </div>
        </div>
      </section>

      <section className="blog-preview">
        <div className="container">
          <div className="section-header">
            <h2>Pet Care Resources</h2>
            <p>Expert tips and advice for keeping your pets healthy and happy</p>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <article key={post.post_id} className="blog-card">
                {post.featured_image && (
                  <div className="blog-image">
                    <img src={`/assets/images/blog/${post.featured_image}`} alt={post.title} loading="lazy" />
                  </div>
                )}
                <div className="blog-content">
                  <h3><a href={post.external_url || `/resources/blog/${post.slug || post.post_id}`}>{post.title}</a></h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-meta">
                    <span className="blog-author">By {post.author || 'Admin'}</span>
                    <span className="blog-date">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center">
            <a href="/resources/blog" className="btn btn-secondary">Read More Articles</a>
          </div>
        </div>
      </section>

      <section className="newsletter-signup-modern">
        <div className="newsletter-paw-trail">
          <i className="fas fa-paw paw-print paw-n1"></i>
          <i className="fas fa-paw paw-print paw-n2"></i>
          <i className="fas fa-paw paw-print paw-n3"></i>
          <i className="fas fa-paw paw-print paw-n4"></i>
          <i className="fas fa-paw paw-print paw-n5"></i>
          <i className="fas fa-bone bone-print bone-b1"></i>
          <i className="fas fa-bone bone-print bone-b2"></i>
          <i className="fas fa-bone bone-print bone-b3"></i>
          <i className="fas fa-bone bone-print bone-b4"></i>
        </div>
        <div className="container">
          <div className="section-header">
            <h2>Stay Connected with Pet Care Updates</h2>
            <p>Join our newsletter for expert tips, health reminders, and exclusive offers for your beloved pets</p>
          </div>
          <div className="newsletter-card">
            <div className="newsletter-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="newsletter-content-modern">
              <div className="newsletter-text">
                <h3>Never Miss Important Pet Care Information</h3>
                <p>Get weekly expert tips, seasonal care reminders, and special offers delivered right to your inbox.</p>
              </div>
              <form className="newsletter-form-modern" method="POST">
                <div className="form-row">
                  <div className="form-group">
                    <input type="email" name="email" placeholder="Enter your email address" required />
                  </div>
                  <div className="form-group">
                    <input type="text" name="name" placeholder="Your name (optional)" />
                  </div>
                  <button type="button" className="btn btn-primary newsletter-submit">
                    <i className="fas fa-paper-plane"></i>
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

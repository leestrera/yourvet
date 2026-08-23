import React from 'react';
import './services.css';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Helpers
const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
        'Preventive Care': 'shield-alt',
        'Dental': 'tooth',
        'Surgery': 'cut',
        'Emergency': 'ambulance',
        'Grooming': 'cut',
        'Boarding': 'home',
        'Diagnostics': 'microscope'
    };
    return icons[category] || 'paw';
};

const getCategoryDescription = (category: string) => {
    const descriptions: Record<string, string> = {
        'Preventive Care': 'Keep your pet healthy with regular checkups and preventive treatments',
        'Dental': 'Maintain your pet\'s oral health with professional dental care',
        'Surgery': 'Expert surgical procedures in a safe, modern environment',
        'Emergency': 'Immediate care for urgent medical situations',
        'Grooming': 'Keep your pet looking and feeling their best',
        'Boarding': 'Safe and comfortable accommodations when you\'re away',
        'Diagnostics': 'Advanced testing and imaging for accurate diagnoses'
    };
    return descriptions[category] || 'Professional veterinary services for your pet';
};

export default async function Services() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  // Fetch Services
  const { data: servicesData } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });

  let services = servicesData || [];
  
  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
      const category = service.category || 'Other';
      if (!acc[category]) acc[category] = [];
      acc[category].push(service);
      return acc;
  }, {} as Record<string, typeof services>);

  return (
    <>
      <section className="services-intro">
          <div className="services-paw-trail">
              <i className="fas fa-paw paw-print paw-s1"></i>
              <i className="fas fa-paw paw-print paw-s2"></i>
              <i className="fas fa-paw paw-print paw-s3"></i>
              <i className="fas fa-paw paw-print paw-s4"></i>
              <i className="fas fa-paw paw-print paw-s6"></i>
              <i className="fas fa-paw paw-print paw-s9"></i>
              <i className="fas fa-paw paw-print paw-s10"></i>
              <i className="fas fa-bone bone-print bone-s1"></i>
              <i className="fas fa-bone bone-print bone-s2"></i>
              <i className="fas fa-bone bone-print bone-s4"></i>
              <i className="fas fa-bone bone-print bone-s6"></i>
          </div>
          
          <div className="container">
              <div className="intro-grid">
                  <div className="intro-main">
                      <h1>Veterinary Services</h1>
                      <p>Professional healthcare for your pets with compassionate care and modern facilities.</p>
                      <div className="intro-actions">
                          <Link href="/appointments" className="btn btn-primary">
                              <i className="fas fa-calendar"></i>
                              Book Now
                          </Link>
                          <Link href="/contact" className="btn btn-outline">
                              <i className="fas fa-phone"></i>
                              Call Us
                          </Link>
                      </div>
                  </div>
                  
                  <div className="intro-highlights">
                      <div className="highlight-card">
                          <div className="highlight-icon">
                              <i className="fas fa-clock"></i>
                          </div>
                          <h4>24/7 Emergency</h4>
                          <p>Round-the-clock emergency care when your pet needs it most</p>
                      </div>
                      
                      <div className="highlight-card">
                          <div className="highlight-icon">
                              <i className="fas fa-award"></i>
                          </div>
                          <h4>15+ Years</h4>
                          <p>Experienced team with decades of veterinary expertise</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section className="services-detailed">
          <div className="container">
              {Object.entries(servicesByCategory).map(([category, categoryServices]: [any, any]) => (
                  <div key={category} className="service-category">
                      <div className="category-header">
                          <h2>
                              <i className={`fas fa-${getCategoryIcon(category)}`}></i>
                              {category}
                          </h2>
                          <p>{getCategoryDescription(category)}</p>
                      </div>
                      
                      <div className="services-grid">
                          {categoryServices.map((service: any) => (
                              <div key={service.service_id} className="service-detail-card">
                                  <div className="service-header">
                                      <h3 className="service-title">
                                          <i className={service.icon || 'fas fa-paw'}></i>
                                          {service.name}
                                      </h3>
                                      {service.base_price && (
                                          <span className="service-price">{Number(service.base_price).toFixed(2)}</span>
                                      )}
                                  </div>
                                  <p className="service-description">{service.description}</p>
                                  <div className="service-actions">
                                      <Link href={`/appointments?service=${encodeURIComponent(service.name)}`} className="btn btn-primary btn-sm">
                                          <i className="fas fa-calendar"></i>
                                          Book This Service
                                      </Link>
                                      <Link href={`/contact?subject=${encodeURIComponent('Question about ' + service.name)}`} className="btn btn-secondary btn-sm">
                                          <i className="fas fa-info-circle"></i>
                                          Learn More
                                      </Link>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      </section>

      <section className="service-features">
          <div className="container">
              <div className="section-header">
                  <h2>Why Choose Our Veterinary Services?</h2>
                  <p>We're committed to providing the highest quality care for your pets</p>
              </div>
              
              <div className="features-grid">
                  <div className="feature-card">
                      <div className="feature-icon">
                          <i className="fas fa-user-md"></i>
                      </div>
                      <h3>Experienced Team</h3>
                      <p>Our veterinarians and staff have years of experience in providing compassionate care for pets of all kinds.</p>
                  </div>
                  
                  <div className="feature-card">
                      <div className="feature-icon">
                          <i className="fas fa-hospital"></i>
                      </div>
                      <h3>Modern Facility</h3>
                      <p>State-of-the-art equipment and facilities ensure your pet receives the most advanced care available.</p>
                  </div>
                  
                  <div className="feature-card">
                      <div className="feature-icon">
                          <i className="fas fa-clock"></i>
                      </div>
                      <h3>24/7 Emergency Care</h3>
                      <p>We're here when your pet needs us most, with round-the-clock emergency services.</p>
                  </div>
                  
                  <div className="feature-card">
                      <div className="feature-icon">
                          <i className="fas fa-heart"></i>
                      </div>
                      <h3>Compassionate Care</h3>
                      <p>We treat every pet as if they were our own, with gentle handling and personalized attention.</p>
                  </div>
                  
                  <div className="feature-card">
                      <div className="feature-icon">
                          <i className="fas fa-dollar-sign"></i>
                      </div>
                      <h3>Transparent Pricing</h3>
                      <p>No surprise costs - we provide clear, upfront pricing and payment options to fit your budget.</p>
                  </div>
                  
                  <div className="feature-card">
                      <div className="feature-icon">
                          <i className="fas fa-graduation-cap"></i>
                      </div>
                      <h3>Continuing Education</h3>
                      <p>Our team stays current with the latest veterinary advances through ongoing training and education.</p>
                  </div>
              </div>
          </div>
      </section>

      <section className="emergency-services">
          <div className="container">
              <div className="emergency-content">
                  <div className="emergency-text">
                      <h2>Emergency Services Available 24/7</h2>
                      <p>Pet emergencies don't wait for business hours. Our experienced emergency team is available around the clock to provide urgent care when your pet needs it most.</p>
                      
                      <div className="emergency-situations">
                          <h4>Common Emergency Situations:</h4>
                          <ul>
                              <li><i className="fas fa-exclamation-triangle"></i> Trauma or injuries</li>
                              <li><i className="fas fa-exclamation-triangle"></i> Difficulty breathing</li>
                              <li><i className="fas fa-exclamation-triangle"></i> Persistent vomiting or diarrhea</li>
                              <li><i className="fas fa-exclamation-triangle"></i> Suspected poisoning</li>
                              <li><i className="fas fa-exclamation-triangle"></i> Seizures or loss of consciousness</li>
                              <li><i className="fas fa-exclamation-triangle"></i> Severe allergic reactions</li>
                          </ul>
                      </div>
                      
                      <div className="emergency-actions">
                          <a href="tel:555-0199" className="btn btn-emergency">
                              <i className="fas fa-phone"></i>
                              Call Emergency Line
                          </a>
                          <p className="emergency-note">
                              <i className="fas fa-info-circle"></i>
                              If possible, please call ahead so we can prepare for your arrival
                          </p>
                      </div>
                  </div>
                  
                  <div className="emergency-image">
                      <img src="/assets/images/features/emergency/emergency1.jpg" alt="Emergency veterinary care" loading="lazy" />
                  </div>
              </div>
          </div>
      </section>

      <section className="service-cta">
          <div className="container">
              <div className="cta-content">
                  <h2>Ready to Schedule Your Pet's Care?</h2>
                  <p>Book an appointment today and give your pet the quality care they deserve</p>
                  <div className="cta-actions">
                      <Link href="/appointments" className="btn btn-primary">
                          <i className="fas fa-calendar-plus"></i>
                          Book Appointment
                      </Link>
                      <Link href="/contact" className="btn btn-secondary">
                          <i className="fas fa-phone"></i>
                          Call Us Today
                      </Link>
                  </div>
              </div>
          </div>
      </section>
    </>
  );
}

import React from 'react';
import './about.css';
import { createClient } from '@/utils/supabase/server';

export default async function About() {
  const supabase = await createClient();
  
  // Fetch Team
  const { data: teamData } = await supabase
    .from('staff')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  const team = teamData || [];

  return (
    <>
      <section className="page-hero">
          <div className="container">
              <div className="hero-content">
                  <div className="hero-text">
                      <h1>About Your Vet</h1>
                      <p>Dedicated to providing compassionate, comprehensive veterinary care for your beloved pets since 2010.</p>
                  </div>
                  <div className="hero-image">
                      <img src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop" alt="Our veterinary clinic" loading="lazy" />
                  </div>
              </div>
          </div>
      </section>

      <section className="mission-vision">
          <div className="container">
              <div className="mission-grid">
                  <div className="mission-card">
                      <div className="mission-icon">
                          <i className="fas fa-heart"></i>
                      </div>
                      <h3>Our Mission</h3>
                      <p>To provide exceptional veterinary care with compassion, integrity, and respect for both pets and their families. We strive to enhance the human-animal bond through personalized service and advanced medical care.</p>
                  </div>
                  
                  <div className="mission-card">
                      <div className="mission-icon">
                          <i className="fas fa-eye"></i>
                      </div>
                      <h3>Our Vision</h3>
                      <p>To be the most trusted veterinary clinic in our community, known for our commitment to excellence, innovation, and the highest standards of animal care and client service.</p>
                  </div>
                  
                  <div className="mission-card">
                      <div className="mission-icon">
                          <i className="fas fa-star"></i>
                      </div>
                      <h3>Our Values</h3>
                      <ul>
                          <li>Compassionate care for every pet</li>
                          <li>Honest and transparent communication</li>
                          <li>Continuous learning and improvement</li>
                          <li>Respect for pets, clients, and colleagues</li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      <section className="clinic-story">
          <div className="container">
              <div className="story-content">
                  <div className="story-text">
                      <h2>Our Story</h2>
                      <p>Your Vet was founded in 2010 with a simple yet profound mission: to provide the highest quality veterinary care while treating every pet as if they were our own family members.</p>
                      
                      <p>What started as a small practice has grown into a full-service veterinary hospital, but our core values remain unchanged. We believe that every pet deserves compassionate care, and every pet owner deserves honest, clear communication about their pet's health.</p>
                      
                      <p>Over the years, we've had the privilege of caring for thousands of pets and building lasting relationships with their families. From routine wellness visits to complex surgical procedures, we approach each case with the same level of dedication and attention to detail.</p>
                      
                      <div className="story-stats">
                          <div className="stat">
                              <div className="stat-number">15+</div>
                              <div className="stat-label">Years of Service</div>
                          </div>
                          <div className="stat">
                              <div className="stat-number">10,000+</div>
                              <div className="stat-label">Pets Treated</div>
                          </div>
                          <div className="stat">
                              <div className="stat-number">24/7</div>
                              <div className="stat-label">Emergency Care</div>
                          </div>
                          <div className="stat">
                              <div className="stat-number">5,000+</div>
                              <div className="stat-label">Happy Families</div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="story-image">
                      <img src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=500&h=600&fit=crop" alt="Our clinic building" loading="lazy" />
                  </div>
              </div>
          </div>
      </section>

      <section className="team-section">
          <div className="container">
              <div className="section-header">
                  <h2>Meet Our Dedicated Team</h2>
                  <p>Experienced professionals who are passionate about animal care</p>
              </div>
              
              <div className="team-detailed">
                  {team.map((member, index) => (
                      <div key={index} className={`team-member ${index % 2 === 0 ? 'member-left' : 'member-right'}`}>
                          <div className="member-photo">
                              <img src={member.photo ? `/assets/uploads/team/${member.photo}` : "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face"} 
                                   alt={member.name || member.first_name} loading="lazy" />
                          </div>
                          <div className="member-details">
                              <h3>{member.name || `${member.first_name} ${member.last_name}`}</h3>
                              <p className="member-title">{member.role}</p>
                              {member.specialization && (
                                  <p className="member-credentials">{member.specialization}</p>
                              )}
                              <p className="member-bio">{member.credentials}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <section className="facility-tour">
          <div className="container">
              <div className="section-header">
                  <h2>Our State-of-the-Art Facility</h2>
                  <p>Modern equipment and comfortable spaces designed with your pet's well-being in mind</p>
              </div>
              
              <div className="facility-grid">
                  <div className="facility-card">
                      <div className="facility-image">
                          <img src="/assets/images/facility/examination-room.jpg" alt="Examination room" loading="lazy" />
                      </div>
                      <div className="facility-content">
                          <h3>Examination Rooms</h3>
                          <p>Comfortable, well-equipped examination rooms designed to reduce stress for both pets and their owners.</p>
                      </div>
                  </div>
                  
                  <div className="facility-card">
                      <div className="facility-image">
                          <img src="/assets/images/facility/surgical-suite.jpg" alt="Surgery suite" loading="lazy" />
                      </div>
                      <div className="facility-content">
                          <h3>Surgical Suite</h3>
                          <p>Modern surgical facilities with advanced monitoring equipment ensure the safest possible procedures.</p>
                      </div>
                  </div>
                  
                  <div className="facility-card">
                      <div className="facility-image">
                          <img src="/assets/images/facility/dental-care-station.jpg" alt="Dental care station" loading="lazy" />
                      </div>
                      <div className="facility-content">
                          <h3>Dental Care Station</h3>
                          <p>Specialized equipment for comprehensive dental cleanings and oral health maintenance.</p>
                      </div>
                  </div>
                  
                  <div className="facility-card">
                      <div className="facility-image">
                          <img src="/assets/images/facility/in-house-laboratory.jpg" alt="Laboratory" loading="lazy" />
                      </div>
                      <div className="facility-content">
                          <h3>In-House Laboratory</h3>
                          <p>Advanced diagnostic equipment allows us to get results quickly and accurately.</p>
                      </div>
                  </div>
                  
                  <div className="facility-card">
                      <div className="facility-image">
                          <img src="/assets/images/facility/boarding-facilities.jpg" alt="Boarding area" loading="lazy" />
                      </div>
                      <div className="facility-content">
                          <h3>Boarding Facilities</h3>
                          <p>Clean, comfortable accommodations with individual attention for each boarding guest.</p>
                      </div>
                  </div>
                  
                  <div className="facility-card">
                      <div className="facility-image">
                          <img src="/assets/images/facility/comfortable-waiting-area.jpg" alt="Waiting area" loading="lazy" />
                      </div>
                      <div className="facility-content">
                          <h3>Comfortable Waiting Area</h3>
                          <p>Welcoming spaces designed to help you and your pet feel relaxed during your visit.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section className="commitment">
          <div className="container">
              <div className="commitment-content">
                  <h2>Our Commitment to Excellence</h2>
                  <div className="commitment-grid">
                      <div className="commitment-item">
                          <div className="commitment-icon">
                              <i className="fas fa-graduation-cap"></i>
                          </div>
                          <h4>Continuing Education</h4>
                          <p>Our team regularly attends conferences and training sessions to stay current with the latest advances in veterinary medicine.</p>
                      </div>
                      
                      <div className="commitment-item">
                          <div className="commitment-icon">
                              <i className="fas fa-microscope"></i>
                          </div>
                          <h4>Advanced Technology</h4>
                          <p>We invest in the latest diagnostic and treatment technologies to provide the most comprehensive care possible.</p>
                      </div>
                      
                      <div className="commitment-item">
                          <div className="commitment-icon">
                              <i className="fas fa-hands-helping"></i>
                          </div>
                          <h4>Community Involvement</h4>
                          <p>We actively support local animal shelters and rescue organizations through volunteer work and donations.</p>
                      </div>
                      
                      <div className="commitment-item">
                          <div className="commitment-icon">
                              <i className="fas fa-leaf"></i>
                          </div>
                          <h4>Environmental Responsibility</h4>
                          <p>We're committed to sustainable practices and minimizing our environmental impact wherever possible.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section className="about-cta">
          <div className="container">
              <div className="cta-content">
                  <h2>Experience the Your Vet Difference</h2>
                  <p>Schedule a visit today and see why pet owners trust us with their beloved companions</p>
                  <div className="cta-actions">
                      <a href="/appointments/book" className="btn btn-primary btn-large">
                          <i className="fas fa-calendar-plus"></i>
                          Schedule a Visit
                      </a>
                      <a href="/contact" className="btn btn-outline btn-large">
                          <i className="fas fa-phone"></i>
                          Contact Us
                      </a>
                  </div>
              </div>
          </div>
      </section>
    </>
  );
}

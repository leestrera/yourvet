import React from 'react';
import './contact.css';

export const metadata = {
  title: 'Contact Us | Your Vet',
  description: 'We\'re here to answer your questions and help with your pet\'s needs.',
};

const config = {
  site_name: "Your Vet",
  emergency_phone: "(555) 123-PETS",
  regular_phone: "(555) 123-4567",
  contact_email: "info@yourvet.com",
  address: "123 Main Street, Anytown, ST 12345",
  hours: {
    monday: "8:00 AM - 6:00 PM",
    tuesday: "8:00 AM - 6:00 PM",
    wednesday: "8:00 AM - 6:00 PM",
    thursday: "8:00 AM - 6:00 PM",
    friday: "8:00 AM - 6:00 PM",
    saturday: "9:00 AM - 4:00 PM",
    sunday: "Emergency Only"
  }
};

export default function Contact() {
  return (
    <>
      <section className="page-header">
          <div className="container">
              <div className="page-header-content">
                  <h1>Contact Us</h1>
                  <p>We're here to answer your questions and help with your pet's needs</p>
              </div>
          </div>
      </section>

      <section className="contact-info">
          <div className="container">
              <div className="section-header">
                  <h2>Get In Touch</h2>
                  <p>Multiple ways to connect with our caring veterinary team</p>
              </div>
              
              <div className="contact-grid">
                  <div className="contact-card">
                      <div className="contact-icon">
                          <i className="fas fa-phone"></i>
                      </div>
                      <div className="contact-details">
                          <h3>Call Us</h3>
                          <div className="contact-content">
                              <p><strong>Main:</strong> <a href={`tel:${config.regular_phone}`}>{config.regular_phone}</a></p>
                              <p><strong>Emergency:</strong> <a href={`tel:${config.emergency_phone}`} className="emergency">{config.emergency_phone}</a></p>
                          </div>
                          <div className="contact-action">
                              <span className="status-note">Available 24/7</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="contact-card">
                      <div className="contact-icon">
                          <i className="fas fa-envelope"></i>
                      </div>
                      <div className="contact-details">
                          <h3>Email Us</h3>
                          <div className="contact-content">
                              <p><a href={`mailto:${config.contact_email}`}>{config.contact_email}</a></p>
                          </div>
                          <div className="contact-action">
                              <span className="status-note">Response within 24 hours</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="contact-card">
                      <div className="contact-icon">
                          <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div className="contact-details">
                          <h3>Visit Us</h3>
                          <div className="contact-content">
                              <p>{config.address}</p>
                          </div>
                          <div className="contact-action">
                              <a href="#map" className="contact-link">
                                  <i className="fas fa-directions"></i> Directions
                              </a>
                          </div>
                      </div>
                  </div>
                  
                  <div className="contact-card">
                      <div className="contact-icon">
                          <i className="fas fa-clock"></i>
                      </div>
                      <div className="contact-details">
                          <h3>Hours</h3>
                          <div className="contact-content">
                              {Object.entries(config.hours).slice(0, 3).map(([day, hours]) => (
                                  <p key={day}><strong>{day.charAt(0).toUpperCase() + day.slice(1)}:</strong> {hours}</p>
                              ))}
                          </div>
                          <div className="contact-action">
                              <a href="#hours" className="contact-link">
                                  <i className="fas fa-calendar-alt"></i> Full Schedule
                              </a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section className="contact-form-section">
          <div className="container">
              <div className="contact-content">
                  <div className="form-info">
                      <h2>Send Us a Message</h2>
                      <p>Have a question about our services or your pet's health? Fill out the form and we'll get back to you within 24 hours.</p>
                      
                      <div className="contact-benefits">
                          <div className="benefit-item">
                              <i className="fas fa-reply"></i>
                              <div>
                                  <h4>Quick Response</h4>
                                  <p>We respond to all messages within 24 hours</p>
                              </div>
                          </div>
                          <div className="benefit-item">
                              <i className="fas fa-user-md"></i>
                              <div>
                                  <h4>Expert Advice</h4>
                                  <p>Get answers from our experienced veterinary team</p>
                              </div>
                          </div>
                          <div className="benefit-item">
                              <i className="fas fa-lock"></i>
                              <div>
                                  <h4>Confidential</h4>
                                  <p>Your information is kept private and secure</p>
                              </div>
                          </div>
                      </div>
                      
                      <div className="emergency-reminder">
                          <div className="emergency-icon">
                              <i className="fas fa-exclamation-triangle"></i>
                          </div>
                          <div>
                              <h4>Emergency?</h4>
                              <p>For urgent situations, please call our emergency line immediately:</p>
                              <a href={`tel:${config.emergency_phone}`} className="emergency-phone">
                                  {config.emergency_phone}
                              </a>
                          </div>
                      </div>
                  </div>
                  
                  <div className="contact-form-container">
                      <form className="contact-form" action="/api/contact/submit" method="POST">
                          <div className="form-row">
                              <div className="form-group">
                                  <label htmlFor="name">Your Name *</label>
                                  <input type="text" id="name" name="name" required />
                              </div>
                              <div className="form-group">
                                  <label htmlFor="email">Email Address *</label>
                                  <input type="email" id="email" name="email" required />
                              </div>
                          </div>
                          
                          <div className="form-row">
                              <div className="form-group">
                                  <label htmlFor="phone">Phone Number</label>
                                  <input type="tel" id="phone" name="phone" />
                              </div>
                              <div className="form-group">
                                  <label htmlFor="subject">Subject</label>
                                  <select id="subject" name="subject">
                                      <option value="">Select a topic</option>
                                      <option value="General Question">General Question</option>
                                      <option value="Appointment Request">Appointment Request</option>
                                      <option value="Service Inquiry">Service Inquiry</option>
                                      <option value="Billing Question">Billing Question</option>
                                      <option value="Pet Health Concern">Pet Health Concern</option>
                                      <option value="Prescription Refill">Prescription Refill</option>
                                      <option value="Boarding Inquiry">Boarding Inquiry</option>
                                      <option value="Other">Other</option>
                                  </select>
                              </div>
                          </div>
                          
                          <div className="form-group">
                              <label htmlFor="message">Message *</label>
                              <textarea id="message" name="message" rows={6} required 
                                        placeholder="Please describe your question or concern in detail..."></textarea>
                          </div>
                          
                          <div className="form-actions">
                              <button type="submit" className="btn btn-primary btn-large">
                                  <i className="fas fa-paper-plane"></i>
                                  Send Message
                              </button>
                              
                              <p className="form-note-simple">
                                  <i className="fas fa-info-circle"></i><span className="note-text">We'll respond to your message within 24 hours during business days.</span>
                              </p>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </section>

      <section className="map-section" id="map">
          <div className="container">
              <h2>Find Us</h2>
              <div className="map-container">
                  <div className="map-placeholder">
                      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.4150!2d-74.0059413!3d40.7127837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQyJzQ2LjAiTiA3NMKwMDAnMjEuNCJX!5e0!3m2!1sen!2sus!4v1635000000000!5m2!1sen!2sus"
                              width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                  </div>
                  <div className="map-info">
                      <h3>Clinic Location</h3>
                      <div className="location-details">
                          <p><strong>{config.site_name}</strong></p>
                          <p>{config.address}</p>
                          
                          <div className="location-actions">
                              <a href={`https://maps.google.com/?q=${encodeURIComponent(config.address)}`} 
                                 className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
                                  <i className="fas fa-directions"></i>
                                  Get Directions
                              </a>
                              <a href={`tel:${config.regular_phone}`} className="btn btn-primary">
                                  <i className="fas fa-phone"></i>
                                  Call Now
                              </a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section className="hours-section" id="hours">
          <div className="container">
              <div className="hours-content">
                  <div className="hours-info">
                      <h2>Clinic Hours</h2>
                      <p>We're here when you need us most. Our regular hours are listed below, and we offer 24/7 emergency services.</p>
                      
                      <div className="hours-table">
                          {Object.entries(config.hours).map(([day, hours]) => (
                              <div key={day} className="hours-row">
                                  <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                                  <span className="time">{hours}</span>
                              </div>
                          ))}
                      </div>
                      
                      <div className="emergency-hours">
                          <h3>Emergency Services</h3>
                          <p>Available 24/7 for urgent medical situations</p>
                          <a href={`tel:${config.emergency_phone}`} className="btn btn-emergency">
                              <i className="fas fa-phone"></i>
                              Emergency: {config.emergency_phone}
                          </a>
                      </div>
                  </div>
                  
                  <div className="additional-info">
                      <h3>Before Your Visit</h3>
                      <ul className="visit-checklist">
                          <li><i className="fas fa-check"></i> Bring any previous medical records</li>
                          <li><i className="fas fa-check"></i> List of current medications</li>
                          <li><i className="fas fa-check"></i> Insurance or payment information</li>
                          <li><i className="fas fa-check"></i> Your pet's favorite treats</li>
                          <li><i className="fas fa-check"></i> Arrive 15 minutes early for new patients</li>
                      </ul>
                      
                      <h3>Parking & Accessibility</h3>
                      <ul className="facility-info">
                          <li><i className="fas fa-parking"></i> Free parking available</li>
                          <li><i className="fas fa-wheelchair"></i> Wheelchair accessible</li>
                          <li><i className="fas fa-paw"></i> Separate cat and dog waiting areas</li>
                          <li><i className="fas fa-wifi"></i> Free WiFi for clients</li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>
    </>
  );
}

'use client';
import React, { useState } from 'react';
import './book.css';

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

const services = [
  { name: 'Wellness Exam' },
  { name: 'Vaccination' },
  { name: 'Dental Care' },
  { name: 'Surgery' },
  { name: 'Grooming' },
];

export default function BookAppointment() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [emailWarning, setEmailWarning] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  
  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedServices([...selectedServices, value]);
    } else {
      setSelectedServices(selectedServices.filter(s => s !== value));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value.toLowerCase();
    // Example validation from original JS: Warn if not gmail? 
    // In original code: if email ends with @gmail, etc...
    // We will just leave it simple.
  };

  return (
    <>
      <section className="page-header">
          <div className="container">
              <div className="page-header-content">
                  <h1>Book an Appointment</h1>
                  <p>Schedule quality veterinary care for your beloved pet</p>
              </div>
          </div>
      </section>

      <section className="appointment-booking">
          <div className="container">
              <div className="booking-content">
                  <div className="booking-info">
                      <h2>Easy Online Booking</h2>
                      <p>Complete the form below to request an appointment. We'll contact you within 24 hours to confirm your preferred time slot.</p>
                      
                      <div className="booking-benefits">
                          <div className="benefit-item">
                              <i className="fas fa-clock"></i>
                              <div>
                                  <h4>Quick Response</h4>
                                  <p>We'll confirm your appointment within 24 hours</p>
                              </div>
                          </div>
                          <div className="benefit-item">
                              <i className="fas fa-calendar-check"></i>
                              <div>
                                  <h4>Flexible Scheduling</h4>
                                  <p>Choose from available morning or afternoon slots</p>
                              </div>
                          </div>
                          <div className="benefit-item">
                              <i className="fas fa-phone"></i>
                              <div>
                                  <h4>Personal Contact</h4>
                                  <p>We'll call to discuss any special needs</p>
                              </div>
                          </div>
                      </div>
                      
                      <div className="emergency-note">
                          <div className="emergency-icon">
                              <i className="fas fa-exclamation-triangle"></i>
                          </div>
                          <div className="emergency-text">
                              <h4>Need Emergency Care?</h4>
                              <p>For urgent medical situations, please call our emergency line immediately:</p>
                              <a href={`tel:${config.emergency_phone}`} className="emergency-link">
                                  {config.emergency_phone}
                              </a>
                          </div>
                      </div>
                  </div>
                  
                  <div className="booking-form-container">
                      <form className="booking-form" action="/api/appointments/submit" method="POST">
                          
                          <div className="form-section">
                              <h3>Pet Owner Information</h3>
                              
                              <div className="form-group">
                                  <label htmlFor="owner_name">Your Full Name *</label>
                                  <input type="text" id="owner_name" name="owner_name" required />
                              </div>
                              
                              <div className="form-row">
                                  <div className="form-group email-group">
                                      <label htmlFor="email">Email Address *</label>
                                      <input type="email" id="email" name="email" required onChange={handleEmailChange} />
                                      {emailWarning && (
                                        <div className="email-tooltip">
                                            <div className="tooltip-content">
                                                <i className="fas fa-exclamation-triangle"></i>
                                                Please enter a valid email address.
                                            </div>
                                            <div className="tooltip-arrow"></div>
                                        </div>
                                      )}
                                  </div>
                                  <div className="form-group">
                                      <label htmlFor="phone">Phone Number *</label>
                                      <input type="tel" id="phone" name="phone" required />
                                  </div>
                              </div>
                          </div>
                          
                          <div className="form-section">
                              <h3>Pet Information</h3>
                              
                              <div className="form-row">
                                  <div className="form-group">
                                      <label htmlFor="pet_name">Pet's Name *</label>
                                      <input type="text" id="pet_name" name="pet_name" required />
                                  </div>
                                  <div className="form-group">
                                      <label htmlFor="pet_type">Pet Type</label>
                                      <select id="pet_type" name="pet_type">
                                          <option value="">Select pet type</option>
                                          <option value="Dog">Dog</option>
                                          <option value="Cat">Cat</option>
                                          <option value="Bird">Bird</option>
                                          <option value="Rabbit">Rabbit</option>
                                          <option value="Guinea Pig">Guinea Pig</option>
                                          <option value="Hamster">Hamster</option>
                                          <option value="Reptile">Reptile</option>
                                          <option value="Other">Other</option>
                                      </select>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="form-section">
                              <h3>Appointment Details</h3>
                              
                              <div className="form-group">
                                  <label>Service Needed *</label>
                                  <div className={`svc-dropdown ${dropdownOpen ? 'open' : ''}`} id="svc-dropdown">
                                      <button type="button" className="svc-dropdown-trigger" id="svc-trigger" onClick={toggleDropdown}>
                                          <span className={`svc-dropdown-text ${selectedServices.length > 0 ? 'has-selection' : ''}`}>
                                              {selectedServices.length > 0 ? selectedServices.join(', ') : 'Select services'}
                                          </span>
                                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                      </button>
                                      <div className="svc-dropdown-menu" id="svc-menu">
                                          {services.map((service) => (
                                          <label key={service.name} className="svc-dropdown-item">
                                              <input type="checkbox" name="service_types[]" value={service.name} onChange={handleServiceChange} checked={selectedServices.includes(service.name)} />
                                              <span className="svc-check"><i className="fas fa-check"></i></span>
                                              <span>{service.name}</span>
                                          </label>
                                          ))}
                                          <label className="svc-dropdown-item">
                                              <input type="checkbox" name="service_types[]" value="Other" onChange={handleServiceChange} checked={selectedServices.includes('Other')} />
                                              <span className="svc-check"><i className="fas fa-check"></i></span>
                                              <span>Other (specify in message)</span>
                                          </label>
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="form-row">
                                  <div className="form-group">
                                      <label htmlFor="preferred_date">Preferred Date *</label>
                                      <input type="date" id="preferred_date" name="preferred_date" required />
                                  </div>
                                  <div className="form-group">
                                      <label htmlFor="preferred_time">Preferred Time</label>
                                      <select id="preferred_time" name="preferred_time">
                                          <option value="">Any time</option>
                                          <option value="08:00">8:00 AM</option>
                                          <option value="08:30">8:30 AM</option>
                                          <option value="09:00">9:00 AM</option>
                                          <option value="09:30">9:30 AM</option>
                                          <option value="10:00">10:00 AM</option>
                                          <option value="10:30">10:30 AM</option>
                                          <option value="11:00">11:00 AM</option>
                                          <option value="11:30">11:30 AM</option>
                                          <option value="12:00">12:00 PM</option>
                                          <option value="12:30">12:30 PM</option>
                                          <option value="13:00">1:00 PM</option>
                                          <option value="13:30">1:30 PM</option>
                                          <option value="14:00">2:00 PM</option>
                                          <option value="14:30">2:30 PM</option>
                                          <option value="15:00">3:00 PM</option>
                                          <option value="15:30">3:30 PM</option>
                                          <option value="16:00">4:00 PM</option>
                                          <option value="16:30">4:30 PM</option>
                                          <option value="17:00">5:00 PM</option>
                                          <option value="17:30">5:30 PM</option>
                                      </select>
                                  </div>
                              </div>
                              
                              <div className="form-group">
                                  <label htmlFor="message">Additional Information</label>
                                  <textarea id="message" name="message" rows={4}
                                            placeholder="Please describe any symptoms, concerns, or special instructions for your pet's visit..."></textarea>
                              </div>
                          </div>
                          
                          <div className="form-actions">
                              <button type="submit" className="btn btn-primary btn-large">
                                  <i className="fas fa-paper-plane"></i>
                                  Submit Appointment Request
                              </button>
                              
                              <p className="form-note-simple">
                                  <i className="fas fa-info-circle"></i><span className="note-text">By submitting this form, you agree to be contacted by our clinic to confirm your appointment.</span>
                              </p>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </section>

      <section className="clinic-hours">
          <div className="container">
              <div className="hours-content">
                  <div className="hours-info">
                      <h2>Clinic Hours</h2>
                      <div className="hours-grid">
                          {Object.entries(config.hours).map(([day, hours]) => (
                              <div key={day} className="hours-day">
                                  <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                                  <span className="time">{hours}</span>
                              </div>
                          ))}
                      </div>
                  </div>
                  
                  <div className="contact-info-section">
                      <h2>Contact Information</h2>
                      <div className="contact-info">
                          <div className="contact-item">
                              <i className="fas fa-phone"></i>
                              <div>
                                  <strong>Main Line:</strong><br/>
                                  <a href={`tel:${config.regular_phone}`}>{config.regular_phone}</a>
                              </div>
                          </div>
                          <div className="contact-item">
                              <i className="fas fa-phone-alt"></i>
                              <div>
                                  <strong>Emergency Line:</strong><br/>
                                  <a href={`tel:${config.emergency_phone}`}>{config.emergency_phone}</a>
                              </div>
                          </div>
                          <div className="contact-item">
                              <i className="fas fa-envelope"></i>
                              <div>
                                  <strong>Email:</strong><br/>
                                  <a href={`mailto:${config.contact_email}`}>{config.contact_email}</a>
                              </div>
                          </div>
                          <div className="contact-item">
                              <i className="fas fa-map-marker-alt"></i>
                              <div>
                                  <strong>Address:</strong><br/>
                                  {config.address}
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
    </>
  );
}

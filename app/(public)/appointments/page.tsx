import React from 'react';
import './appointments.css';

export const metadata = {
  title: 'Appointments | Your Vet',
  description: 'Book a new appointment or check your appointment status.',
};

// Mock config data
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

export default function Appointments() {
  return (
    <>
      <section className="page-header">
          <div className="container">
              <div className="page-header-content">
                  <h1>Appointments</h1>
                  <p>Choose what you'd like to do with your pet's appointment</p>
              </div>
          </div>
      </section>

      <section className="appointment-hub">
          <div className="container">
              <div className="hub-content">
                  <div className="hub-intro">
                      <h2>What would you like to do?</h2>
                      <p>Select an option below to get started</p>
                  </div>
                  
                  <div className="appointment-options">
                      <div className="appointment-card booking-card">
                          <div className="card-icon">
                              <i className="fas fa-calendar-plus"></i>
                          </div>
                          <div className="card-content">
                              <h3>Book New Appointment</h3>
                              <p>Schedule quality veterinary care for your beloved pet. Choose from our comprehensive range of services.</p>
                              <ul className="card-benefits">
                                  <li><i className="fas fa-check"></i> Online booking available 24/7</li>
                                  <li><i className="fas fa-check"></i> Flexible scheduling options</li>
                                  <li><i className="fas fa-check"></i> Confirmation within 24 hours</li>
                              </ul>
                          </div>
                          <div className="card-action">
                              <a href="/appointments/book" className="btn btn-primary btn-large">
                                  <i className="fas fa-calendar-plus"></i>
                                  Book Appointment
                              </a>
                          </div>
                      </div>
                      
                      <div className="appointment-card status-card">
                          <div className="card-icon">
                              <i className="fas fa-search"></i>
                          </div>
                          <div className="card-content">
                              <h3>Check Appointment Status</h3>
                              <p>Track your existing appointment request and get updates on your booking status and confirmation details.</p>
                              <ul className="card-benefits">
                                  <li><i className="fas fa-check"></i> Real-time status updates</li>
                                  <li><i className="fas fa-check"></i> View appointment details</li>
                                  <li><i className="fas fa-check"></i> Contact information included</li>
                              </ul>
                          </div>
                          <div className="card-action">
                              <a href="/appointments/status" className="btn btn-secondary btn-large">
                                  <i className="fas fa-search"></i>
                                  Check Status
                              </a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section className="emergency-section">
          <div className="container">
              <div className="emergency-card">
                  <div className="emergency-icon">
                      <i className="fas fa-phone-alt"></i>
                  </div>
                  <div className="emergency-content">
                      <h3>Need Emergency Care?</h3>
                      <p>For urgent medical situations that can't wait for an appointment, call our emergency line immediately.</p>
                      <a href={`tel:${config.emergency_phone}`} className="btn btn-emergency">
                          <i className="fas fa-phone"></i>
                          Call Emergency: {config.emergency_phone}
                      </a>
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
                                  <strong>Main Line:</strong>
                                  <a href={`tel:${config.regular_phone}`}>{config.regular_phone}</a>
                              </div>
                          </div>
                          <div className="contact-item">
                              <i className="fas fa-phone-alt"></i>
                              <div>
                                  <strong>Emergency Line:</strong>
                                  <a href={`tel:${config.emergency_phone}`}>{config.emergency_phone}</a>
                              </div>
                          </div>
                          <div className="contact-item">
                              <i className="fas fa-envelope"></i>
                              <div>
                                  <strong>Email:</strong>
                                  <a href={`mailto:${config.contact_email}`}>{config.contact_email}</a>
                              </div>
                          </div>
                          <div className="contact-item">
                              <i className="fas fa-map-marker-alt"></i>
                              <div>
                                  <strong>Address:</strong>
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

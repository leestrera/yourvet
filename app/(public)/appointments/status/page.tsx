'use client';
import React, { useState, useEffect } from 'react';
import './status.css';

const config = {
  regular_phone: "(555) 123-4567",
  contact_email: "info@yourvet.com",
};

export default function AppointmentStatus() {
  const [isSticky, setIsSticky] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  // This would eventually be set by a database fetch
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [appointment, setAppointment] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      const statusInfo = document.querySelector('.status-info');
      const navbar = document.querySelector('.navbar');
      
      if (!statusInfo || !navbar) return;
      
      if (window.innerWidth <= 768) {
        setIsSticky(false);
        return;
      }
      
      const navbarHeight = navbar.clientHeight;
      const h2 = statusInfo.querySelector('h2');
      if (h2) {
        const h2Top = h2.getBoundingClientRect().top;
        if (h2Top <= navbarHeight + 32) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const petName = formData.get('pet_name') as string;

    try {
      const response = await fetch(`/api/appointments/status?email=${encodeURIComponent(email)}&pet_name=${encodeURIComponent(petName)}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Appointment not found');
      }
      
      const data = await response.json();
      setAppointment(data);
      setHasSearched(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAgain = () => {
    setAppointment(null);
    setHasSearched(false);
    setErrorMsg('');
  };

  return (
    <>
      <style>{".footer { display: none !important; }"}</style>
      <section className="page-header">
          <div className="container">
              <div className="page-header-content">
                  <h1>Check Appointment Status</h1>
                  <p>Track your appointment request and get updates on your booking</p>
              </div>
          </div>
      </section>

      <section className="status-check">
          <div className="container">
              <div className="status-content">
                  <div className={`status-info ${isSticky ? 'is-sticky' : ''}`}>
                      <h2>How to Check Your Status</h2>
                      <p>Enter your email address and your pet's name to view your most recent appointment request and its current status.</p>
                      
                      <div className="status-guide">
                          <h3>Status Types:</h3>
                          <div className="status-list">
                              <div className="status-item">
                                  <span className="status-badge status-pending">Pending</span>
                                  <p>Your request has been received and is being reviewed</p>
                              </div>
                              <div className="status-item">
                                  <span className="status-badge status-confirmed">Confirmed</span>
                                  <p>Your appointment has been scheduled and confirmed</p>
                              </div>
                              <div className="status-item">
                                  <span className="status-badge status-completed">Completed</span>
                                  <p>Your appointment has been completed</p>
                              </div>
                              <div className="status-item">
                                  <span className="status-badge status-cancelled">Cancelled</span>
                                  <p>The appointment has been cancelled</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="status-form-container">
                      
                      {!appointment ? (
                          <div className="status-form-card">
                              <h3>Enter Your Information</h3>
                              <form className="status-form" onSubmit={handleSearch}>
                                  <div className="form-group">
                                      <label htmlFor="email">Email Address *</label>
                                      <input type="email" id="email" name="email" required 
                                             placeholder="Enter the email used for booking" />
                                  </div>
                                  
                                  <div className="form-group">
                                      <label htmlFor="pet_name">Pet's Name *</label>
                                      <input type="text" id="pet_name" name="pet_name" required 
                                             placeholder="Enter your pet's name" />
                                  </div>

                                  {errorMsg && (
                                      <div className="alert alert-error">
                                          <i className="fas fa-exclamation-circle"></i>
                                          {errorMsg}
                                      </div>
                                  )}
                                  
                                  <div className="form-actions">
                                      <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                                          {loading ? (
                                            <><i className="fas fa-spinner fa-spin"></i> Checking...</>
                                          ) : (
                                            <><i className="fas fa-search"></i> Check Status</>
                                          )}
                                      </button>
                                  </div>
                              </form>
                          </div>
                      ) : (
                          <div className="appointment-details">
                              <div className="appointment-header">
                                  <h3>Appointment Details</h3>
                                  <div className="appointment-status">
                                      <span className={`status-badge status-${appointment.status}`}>
                                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                      </span>
                                  </div>
                              </div>
                              
                              <div className="appointment-info">
                                  <div className="info-section">
                                      <h4>Pet Information</h4>
                                      <div className="info-grid">
                                          <div className="info-item">
                                              <strong>Pet Name:</strong>
                                              <span>{appointment.pet_name}</span>
                                          </div>
                                          {appointment.pet_type && (
                                              <div className="info-item">
                                                  <strong>Pet Type:</strong>
                                                  <span>{appointment.pet_type}</span>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                                  
                                  <div className="info-section">
                                      <h4>Appointment Information</h4>
                                      <div className="info-grid">
                                          <div className="info-item">
                                              <strong>Service:</strong>
                                              <span>{appointment.service_type}</span>
                                          </div>
                                          <div className="info-item">
                                              <strong>Requested Date:</strong>
                                              <span>{new Date(appointment.preferred_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                          </div>
                                          {appointment.preferred_time && (
                                              <div className="info-item">
                                                  <strong>Requested Time:</strong>
                                                  <span>{appointment.preferred_time}</span>
                                              </div>
                                          )}
                                          <div className="info-item">
                                              <strong>Request Submitted:</strong>
                                              <span>{new Date(appointment.created_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  {appointment.message && (
                                      <div className="info-section">
                                          <h4>Additional Information</h4>
                                          <p className="message-content">{appointment.message}</p>
                                      </div>
                                  )}
                              </div>
                              
                              <div className="appointment-actions">
                                  <button onClick={handleCheckAgain} className="btn btn-secondary inline-form">
                                      <i className="fas fa-redo"></i> Check Again
                                  </button>
                                  
                                  {appointment.status === 'pending' && (
                                      <div className="status-note">
                                          <i className="fas fa-clock"></i>
                                          <p>We'll contact you within 24 hours to confirm your appointment.</p>
                                      </div>
                                  )}
                                  {appointment.status === 'confirmed' && (
                                      <div className="status-note confirmed">
                                          <i className="fas fa-check-circle"></i>
                                          <p>Your appointment is confirmed! Please arrive 15 minutes early.</p>
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}
                      
                      <div className="contact-help">
                          <h4>Need Help?</h4>
                          <p>If you can't find your appointment or have questions, please contact us:</p>
                          <div className="contact-options">
                              <a href={`tel:${config.regular_phone}`} className="contact-option">
                                  <i className="fas fa-phone"></i>
                                  <span>{config.regular_phone}</span>
                              </a>
                              <a href={`mailto:${config.contact_email}`} className="contact-option">
                                  <i className="fas fa-envelope"></i>
                                  <span>{config.contact_email}</span>
                              </a>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
    </>
  );
}

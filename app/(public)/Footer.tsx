'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Hide the footer on the book appointment page
  if (pathname === '/appointments/book') {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <img src="/assets/images/logo/text-logo.png" alt="Your Vet" className="footer-text-logo" />
            <p>Providing compassionate veterinary care for your beloved pets since 2010.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/services">Our Services</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/appointments/book">Book Appointment</a></li>
              <li><a href="/resources/faq">FAQ</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Hours</h4>
            <ul className="hours-list">
                <li>Monday: 8:00 AM - 6:00 PM</li>
                <li>Tuesday: 8:00 AM - 6:00 PM</li>
                <li>Wednesday: 8:00 AM - 6:00 PM</li>
                <li>Thursday: 8:00 AM - 6:00 PM</li>
                <li>Friday: 8:00 AM - 6:00 PM</li>
                <li>Saturday: 9:00 AM - 4:00 PM</li>
                <li>Sunday: Emergency Only</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p><i className="fas fa-map-marker-alt"></i> 123 Main Street, Anytown, ST 12345</p>
              <p><i className="fas fa-phone"></i> <a href="tel:(555) 123-4567">(555) 123-4567</a></p>
              <p><i className="fas fa-envelope"></i> <a href="mailto:info@yourvet.com">info@yourvet.com</a></p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Your Vet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

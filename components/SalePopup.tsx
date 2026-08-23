"use client";
import React, { useState, useEffect } from 'react';
import './SalePopup.css';

export default function SalePopup() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show popup after a small delay to allow initial render
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const closeSalePopup = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div id="websiteForSalePopup" className="sale-popup-overlay">
            <div className="sale-popup">
                <button className="sale-popup-close" onClick={closeSalePopup}>&times;</button>

                <div className="sale-popup-header">
                    <h2>Complete Veterinary Clinic Website</h2>
                    <div className="sale-badge">PEYK BUSINESS SOLUTION</div>
                </div>

                <div className="sale-popup-content">
                    <div className="sale-intro">
                        <p>This fully functional veterinary clinic website is available for purchase. Perfect for veterinarians
                            looking to establish or upgrade their online presence.</p>
                    </div>

                    <div className="sale-features">
                        <h3>Business Features Included:</h3>
                        <div className="features-grid">
                            <div className="feature-item">
                                <i className="fas fa-calendar-check"></i>
                                <span>Online Appointment Booking System</span>
                            </div>
                            <div className="feature-item">
                                <i className="fas fa-users-cog"></i>
                                <span>Complete Administrative Dashboard</span>
                            </div>
                            <div className="feature-item">
                                <i className="fas fa-envelope"></i>
                                <span>Client Contact Management</span>
                            </div>
                            <div className="feature-item">
                                <i className="fas fa-user-md"></i>
                                <span>Team & Staff Profile Management</span>
                            </div>
                            <div className="feature-item">
                                <i className="fas fa-stethoscope"></i>
                                <span>Services Catalog & Pricing</span>
                            </div>
                            <div className="feature-item">
                                <i className="fas fa-blog"></i>
                                <span>Blog & News Management</span>
                            </div>
                        </div>
                    </div>

                    <div className="sale-highlights">
                        <h3>What You Get:</h3>
                        <ul>
                            <li>✓ Complete website ready for immediate deployment</li>
                            <li>✓ Client appointment booking and management system</li>
                            <li>✓ Administrative panel for managing all content</li>
                            <li>✓ Responsive design that works on all devices</li>
                            <li>✓ Professional design tailored for veterinary practices</li>
                            <li>✓ No ongoing subscription fees - you own it completely</li>
                        </ul>
                    </div>

                    <div className="sale-disclaimer">
                        <h3>Important Note:</h3>
                        <p><strong>All content is fully customizable:</strong> The doctors' photos, names, clinic information,
                            services, and all other content you see on this website are placeholder examples. Everything can be
                            easily replaced with your own clinic's information, staff photos, services, and branding through the
                            administrative panel.</p>
                    </div>

                    <div className="sale-stats">
                        <div className="stat-item">
                            <span className="stat-number">Fully</span>
                            <span className="stat-label">Functional</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">Ready</span>
                            <span className="stat-label">To Deploy</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">One-Time</span>
                            <span className="stat-label">Purchase</span>
                        </div>
                    </div>

                    <div className="sale-contact">
                        <h3>Get in Touch - DM/PM/Email me:</h3>
                        <div className="contact-info">
                            <div className="contact-item">
                                <i className="fas fa-user"></i>
                                <div className="contact-details">
                                    <strong>Developer:</strong> Lorenz Edward Estrera
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fab fa-facebook-messenger"></i>
                                <div className="contact-details">
                                    <strong>Facebook:</strong> <a href="https://www.facebook.com/Wolfxpeyk/" target="_blank" rel="noopener noreferrer">facebook.com/Wolfxpeyk</a>
                                    <br /><small>💬 You can DM/PM me here for quick responses</small>
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-envelope"></i>
                                <div className="contact-details">
                                    <strong>Email:</strong> <a href="mailto:estreralorenz9@gmail.com">estreralorenz9@gmail.com</a>
                                    <br /><small>📧 Send me a detailed email about your requirements</small>
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-phone"></i>
                                <div className="contact-details">
                                    <strong>Phone:</strong> <a href="tel:09063194201">+63 906 319 4201</a>
                                    <br /><small>📱 Call/Text for immediate discussion</small>
                                </div>
                            </div>
                        </div>

                        <div className="sale-cta">
                            <button className="btn-sale-primary" onClick={() => window.open('mailto:estreralorenz9@gmail.com?subject=Inquiry: Veterinary Website Purchase&body=Dear Lorenz,%0D%0A%0D%0AI am interested in purchasing the veterinary clinic website solution. Could you please provide more information about:%0D%0A%0D%0A- Pricing details%0D%0A- What is included in the purchase%0D%0A- Setup and transfer process%0D%0A- Technical support available%0D%0A%0D%0AThank you for your time.%0D%0A%0D%0ABest regards')}>
                                📧 Send Email
                            </button>
                            <button className="btn-sale-facebook" onClick={() => window.open('https://www.facebook.com/Wolfxpeyk/', '_blank')}>
                                💬 Message on FB
                            </button>
                            <button className="btn-sale-secondary" onClick={closeSalePopup}>
                                Continue Browsing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React from "react";

import Footer from "./Footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="header">
        <div className="emergency-banner">
          <div className="container">
            <span className="emergency-text">
              <i className="fas fa-phone"></i>
              Emergency Line: <a href="tel:(555) 123-PETS">(555) 123-PETS</a>
            </span>
          </div>
        </div>
        
        <nav className="navbar">
          <div className="container">
            <div className="nav-brand">
              <a href="/">
                <img src="/assets/images/logo/logo.png" alt="Your Vet" className="brand-logo filter-dark" />
              </a>
            </div>
            
            <ul className="nav-menu">
              <li><a href="/">Home</a></li>
              <li><a href="/services">Services</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/resources">Pet Care</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/appointments" className="btn btn-primary">Appointments</a></li>
            </ul>
            
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>
      </header>

      <main>{children}</main>

      <Footer />
    </>
  );
}

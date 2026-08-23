'use client';

import React, { useState, useEffect } from 'react';

export default function ScrollIndicator() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('.service-features');
    if (nextSection) {
      const y = nextSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`scroll-indicator ${isScrolled ? 'scrolled-down' : ''}`}
      onClick={scrollToNextSection} 
      style={{ cursor: 'pointer' }}
      aria-label="Scroll down"
    >
      <div className="paw-prints">
        <i className="fas fa-paw paw-print paw-1"></i>
        <i className="fas fa-paw paw-print paw-2"></i>
        <i className="fas fa-paw paw-print paw-3"></i>
        <i className="fas fa-paw paw-print paw-4"></i>
        <i className="fas fa-paw paw-print paw-5"></i>
        <i className="fas fa-paw paw-print paw-6"></i>
        <i className="fas fa-paw paw-print paw-7"></i>
      </div>
      <div className="paw-icon"></div>
    </div>
  );
}

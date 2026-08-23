'use client';

import { useEffect } from 'react';

export default function PawTrailReveal() {
  useEffect(() => {
    const pawPrints = document.querySelectorAll(
      '.paw-trail-overlay .paw-print, .paw-trail-wellness .paw-print, .paw-trail-diagnostic .paw-print, .paw-trail-dental .paw-print, .paw-trail-surgery .paw-print, .paw-trail-emergency .paw-print'
    );
    
    if (pawPrints.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger when paw is 10% above bottom of viewport
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains('paw-revealed')) {
                // Reveal this specific paw when it enters viewport
                entry.target.classList.add('paw-revealed');
            }
        });
    }, observerOptions);

    pawPrints.forEach(paw => {
        observer.observe(paw);
    });

    return () => {
        pawPrints.forEach(paw => {
            observer.unobserve(paw);
        });
    };
  }, []);

  return null;
}

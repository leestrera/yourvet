import React from 'react';
import { createClient } from '@/utils/supabase/server';
import '../resources.css';

export const metadata = {
  title: 'Frequently Asked Questions | Your Vet',
  description: 'Answers to your most common questions about our veterinary services, pet care, and clinic policies.',
};

export default async function FAQPage() {
  const supabase = await createClient();
  
  const { data: faqs, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching FAQs:', error);
  }

  return (
    <>
      <section className="page-header">
          <div className="container">
              <div className="page-header-content">
                  <h1>Frequently Asked Questions</h1>
                  <p>Find answers to common questions about our services and pet care</p>
                  <div className="page-header-actions">
                      <a href="/contact" className="btn btn-primary">
                          <i className="fas fa-envelope"></i>
                          Still have questions? Contact Us
                      </a>
                  </div>
              </div>
          </div>
      </section>

      <section className="faq-list-section" style={{ padding: '4rem 0' }}>
          <div className="container">
              <div className="faq-grid" style={{ display: 'grid', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                  {(!faqs || faqs.length === 0) ? (
                      <div className="text-center">
                          <p>No FAQs available at the moment.</p>
                      </div>
                  ) : (
                      faqs.map((faq: any) => (
                          <div key={faq.faq_id} className="faq-item" style={{ 
                              background: 'white', 
                              padding: '2rem', 
                              borderRadius: '12px', 
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                              border: '1px solid var(--border-color)'
                          }}>
                              <h3 className="faq-question" style={{ color: 'var(--primary-dark)', marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                  <i className="fas fa-question-circle" style={{ color: 'var(--primary-color)', marginTop: '4px' }}></i>
                                  {faq.question}
                              </h3>
                              <p className="faq-answer" style={{ color: 'var(--text-color)', lineHeight: '1.6', margin: 0, paddingLeft: '34px' }}>
                                {faq.answer}
                              </p>
                          </div>
                      ))
                  )}
              </div>
          </div>
      </section>
    </>
  );
}

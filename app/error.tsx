'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: '#f8fafc'
    }}>
      <div style={{
          background: 'white',
          padding: '4rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          maxWidth: '500px',
          width: '100%'
      }}>
          <div style={{
              fontSize: '5rem',
              color: '#ef4444',
              marginBottom: '1rem',
              lineHeight: '1'
          }}>
              <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Something went wrong!</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              We're sorry, but an unexpected error occurred. Our team has been notified.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => reset()}
                className="btn btn-outline"
                style={{ padding: '0.75rem 1.5rem', cursor: 'pointer' }}
              >
                <i className="fas fa-redo"></i> Try again
              </button>
              <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.75rem 1.5rem' }}>
                  <i className="fas fa-home"></i> Return Home
              </Link>
          </div>
      </div>
    </div>
  );
}

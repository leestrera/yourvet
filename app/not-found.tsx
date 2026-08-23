import Link from 'next/link';
import './(public)/resources/resources.css'; // Reusing some base styles

export default function NotFound() {
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
              color: 'var(--primary-light)',
              marginBottom: '1rem',
              lineHeight: '1'
          }}>
              <i className="fas fa-paw"></i>
          </div>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>Page Not Found</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '2rem', fontSize: '1.1rem' }}>
              Oops! It looks like this page wandered off. The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.75rem 1.5rem' }}>
              <i className="fas fa-home"></i> Return Home
          </Link>
      </div>
    </div>
  );
}

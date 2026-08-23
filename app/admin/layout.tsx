import React from 'react';
import './admin.css';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { logout } from './actions';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If we are on the login page, we don't want to render the sidebar.
  // We can't access pathname cleanly in Server Components without headers trickery, 
  // but middleware handles the redirect. We will assume login page is rendered here.
  // Wait, if we're on /admin/login, we SHOULD NOT render the sidebar!
  // To fix this cleanly in Next.js, we should put the login page OUTSIDE of this layout,
  // or use a Route Group inside admin like `app/admin/(dashboard)/layout.tsx`.
  // Let's just return children if there's no user (the middleware ensures only /admin/login is accessible without a user).
  
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="admin-body">
      <div className="admin-layout">
        <nav className="admin-sidebar">
            <div className="sidebar-header">
                <h2>Your Vet</h2>
                <p>Admin Panel</p>
            </div>
            
            <ul className="sidebar-menu">
                <li>
                    <a href="/admin">
                        <i className="fas fa-chart-pie"></i> Dashboard
                    </a>
                </li>
                
                <li className="menu-divider">Scheduling</li>
                <li>
                    <a href="/admin/appointments">
                        <i className="fas fa-calendar-alt"></i> Appointments
                    </a>
                </li>
                
                <li className="menu-divider">Clinic Operations</li>
                <li>
                    <a href="/admin/clients">
                        <i className="fas fa-users"></i> Clients & Pets
                    </a>
                </li>
                <li>
                    <a href="/admin/records">
                        <i className="fas fa-notes-medical"></i> Medical Records
                    </a>
                </li>
                <li>
                    <a href="/admin/finance">
                        <i className="fas fa-credit-card"></i> Finance & Billing
                    </a>
                </li>
                
                <li className="menu-divider">Website Content</li>
                <li>
                    <a href="/admin/services">
                        <i className="fas fa-hand-holding-medical"></i> Services
                    </a>
                </li>
                <li>
                    <a href="/admin/team">
                        <i className="fas fa-user-md"></i> Team Members
                    </a>
                </li>
                <li>
                    <a href="/admin/blog">
                        <i className="fas fa-newspaper"></i> Blog Posts
                    </a>
                </li>
                
                <li className="menu-divider">Communications</li>
                <li>
                    <a href="/admin/messages">
                        <i className="fas fa-comment-dots"></i> Messages
                    </a>
                </li>
                <li>
                    <a href="/admin/newsletter">
                        <i className="fas fa-envelope-open-text"></i> Newsletter
                    </a>
                </li>
                
                <li className="menu-divider">System & CMS</li>
                <li>
                    <a href="/admin/faqs">
                        <i className="fas fa-question-circle"></i> FAQs Management
                    </a>
                </li>
                <li>
                    <a href="/admin/testimonials">
                        <i className="fas fa-quote-left"></i> Testimonials
                    </a>
                </li>
            </ul>
            
            <div className="sidebar-footer">
                <p>Welcome, Admin</p>
                <form action={logout}>
                    <button type="submit" className="logout-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </form>
            </div>
        </nav>
        
        <main className="admin-main">
            <header className="admin-header">
                <div className="header-title">
                    <h1>Admin Dashboard</h1>
                </div>
                <div className="header-actions">
                    <a href="/" className="btn btn-secondary" target="_blank">
                        <i className="fas fa-external-link-alt"></i> View Website
                    </a>
                </div>
            </header>
            
            <div className="admin-content">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}

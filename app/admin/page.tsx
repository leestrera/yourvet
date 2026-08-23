import React from 'react';
import { createClient } from '@/utils/supabase/server';

export default async function AdminDashboard() {
  const supabase = await createClient();
  
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  
  // Fetch high-level stats concurrently
  const [
    pendingAppointmentsReq,
    newMessagesReq,
    newsletterReq,
    thisMonthAppointmentsReq,
    publishedArticlesReq,
    teamMembersReq,
    activeServicesReq,
    totalAppointmentsReq,
    recentAppointmentsReq,
    recentMessagesReq
  ] = await Promise.all([
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).gte('appointment_date', firstDay).lte('appointment_date', lastDay),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('staff').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('appointments').select('*', { count: 'exact', head: true }),
    supabase.from('appointments').select('*, pets(name, owners(first_name, last_name))').order('appointment_date', { ascending: false }).limit(5),
    supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  return (
    <>
      <div className="stats-grid">
          <div className="stat-card">
              <div className="stat-icon">
                  <i className="fas fa-calendar-check"></i>
              </div>
              <div className="stat-info">
                  <h3>{pendingAppointmentsReq.count || 0}</h3>
                  <p>Pending Appointments</p>
              </div>
          </div>
          
          <div className="stat-card">
              <div className="stat-icon">
                  <i className="fas fa-envelope"></i>
              </div>
              <div className="stat-info">
                  <h3>{newMessagesReq.count || 0}</h3>
                  <p>New Messages</p>
              </div>
          </div>
          
          <div className="stat-card">
              <div className="stat-icon">
                  <i className="fas fa-users"></i>
              </div>
              <div className="stat-info">
                  <h3>{newsletterReq.count || 0}</h3>
                  <p>Newsletter Subscribers</p>
              </div>
          </div>
          
          <div className="stat-card">
              <div className="stat-icon">
                  <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-info">
                  <h3>{thisMonthAppointmentsReq.count || 0}</h3>
                  <p>Appointments This Month</p>
              </div>
          </div>
          
          <div className="stat-card">
              <div className="stat-icon">
                  <i className="fas fa-blog"></i>
              </div>
              <div className="stat-info">
                  <h3>{publishedArticlesReq.count || 0}</h3>
                  <p>Published Articles</p>
              </div>
          </div>
          
          <div className="stat-card">
              <div className="stat-icon">
                  <i className="fas fa-user-md"></i>
              </div>
              <div className="stat-info">
                  <h3>{teamMembersReq.count || 0}</h3>
                  <p>Team Members</p>
              </div>
          </div>
          
          <div className="stat-card">
              <div className="stat-icon">
                  <i className="fas fa-stethoscope"></i>
              </div>
              <div className="stat-info">
                  <h3>{activeServicesReq.count || 0}</h3>
                  <p>Active Services</p>
              </div>
          </div>
          
          <div className="stat-card">
              <div className="stat-icon">
                  <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="stat-info">
                  <h3>{totalAppointmentsReq.count || 0}</h3>
                  <p>Total Appointments</p>
              </div>
          </div>
      </div>
      
      <div className="dashboard-grid">
          <div className="dashboard-section">
              <h2>Recent Appointments</h2>
              <div className="dashboard-cards">
                  {recentAppointmentsReq.data && recentAppointmentsReq.data.length > 0 ? (
                      recentAppointmentsReq.data.map((apt) => (
                          <div className="dashboard-card appointment-card" key={apt.appointment_id || apt.id}>
                              <div className="card-header">
                                  <div className="card-main-info">
                                      <div className="card-title">
                                          {apt.pets?.owners ? `${apt.pets.owners.first_name} ${apt.pets.owners.last_name}` : 'Unknown Owner'}
                                      </div>
                                      <div className="card-subtitle">
                                          Pet: {apt.pets?.name || 'Unknown Pet'}
                                      </div>
                                  </div>
                                  <div className="card-status">
                                      <span className={`status-badge status-${apt.status || 'pending'}`}>
                                          {(apt.status || 'pending').charAt(0).toUpperCase() + (apt.status || 'pending').slice(1)}
                                      </span>
                                  </div>
                              </div>
                              <div className="card-details">
                                  <div className="card-service">
                                      <i className="fas fa-stethoscope"></i>
                                      <span>{apt.visit_type ? (apt.visit_type.charAt(0).toUpperCase() + apt.visit_type.slice(1)) : 'General'}</span>
                                  </div>
                                  <div className="card-date">
                                      <i className="fas fa-calendar"></i>
                                      <span>{apt.appointment_date ? new Date(apt.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}</span>
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="dashboard-empty">
                          <i className="fas fa-calendar-plus"></i>
                          <p>No recent appointments</p>
                      </div>
                  )}
              </div>
              <a href="/admin/appointments" className="btn btn-primary">View All Appointments</a>
          </div>
          
          <div className="dashboard-section">
              <h2>Recent Messages</h2>
              <div className="dashboard-cards">
                  {recentMessagesReq.data && recentMessagesReq.data.length > 0 ? (
                      recentMessagesReq.data.map((msg) => (
                          <div className="dashboard-card message-card" key={msg.message_id || msg.id}>
                              <div className="card-header">
                                  <div className="card-main-info">
                                      <div className="card-title">{msg.name || 'Anonymous'}</div>
                                      <div className="card-subtitle">{msg.subject || 'No subject provided'}</div>
                                  </div>
                                  <div className="card-status">
                                      <span className={`status-badge status-${msg.status || 'new'}`}>
                                          {(msg.status || 'new').charAt(0).toUpperCase() + (msg.status || 'new').slice(1)}
                                      </span>
                                  </div>
                              </div>
                              <div className="card-details">
                                  <div className="card-date">
                                      <i className="fas fa-envelope"></i>
                                      <span>Received {msg.created_at ? new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Unknown date'}</span>
                                  </div>
                              </div>
                          </div>
                      ))
                  ) : (
                      <div className="dashboard-empty">
                          <i className="fas fa-inbox"></i>
                          <p>No recent messages</p>
                      </div>
                  )}
              </div>
              <a href="/admin/messages" className="btn btn-primary">View All Messages</a>
          </div>
      </div>
    </>
  );
}

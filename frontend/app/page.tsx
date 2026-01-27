"use client";

import ChatInterface from "@/components/Chat/ChatInterface";
import { LayoutDashboard, Receipt, Bell, Shield, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar glass">
        <div className="logo">
          <Shield className="logo-icon" size={24} />
          <span>Subly</span>
        </div>

        <nav className="nav-links">
          <a href="#" className="nav-item active"><LayoutDashboard size={20} /> Dashboard</a>
          <a href="#" className="nav-item"><Receipt size={20} /> Subscriptions</a>
          <a href="#" className="nav-item"><Bell size={20} /> Alerts</a>
          <a href="#" className="nav-item"><Settings size={20} /> Settings</a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar glass">JD</div>
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-plan badge badge-primary">Free</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your subscription overview.</p>
          </div>

          <div className="header-stats">
            <div className="stat-card glass">
              <span className="stat-label">Monthly Total</span>
              <span className="stat-value">₱1,248.50</span>
            </div>
            <div className="stat-card glass">
              <span className="stat-label">Weekly Burn</span>
              <span className="stat-value">₱285.00</span>
            </div>
          </div>
        </header>

        <section className="dashboard-grid">
          <div className="chat-section">
            <div className="section-header">
              <h3><BotIcon /> Conversational Tracking</h3>
              <span className="badge badge-success">Online</span>
            </div>
            <ChatInterface />
          </div>

          <div className="upcoming-section">
            <div className="section-header">
              <h3>Upcoming Payments</h3>
            </div>
            <div className="upcoming-list">
              <div className="upcoming-item card glass">
                <div className="service-info">
                  <div className="service-icon">🎬</div>
                  <div>
                    <span className="service-name">Netflix</span>
                    <span className="service-date">Jan 28, 2026</span>
                  </div>
                </div>
                <span className="service-amount">₱599.00</span>
              </div>
              <div className="upcoming-item card glass">
                <div className="service-info">
                  <div className="service-icon">🎵</div>
                  <div>
                    <span className="service-name">Spotify</span>
                    <span className="service-date">Feb 02, 2026</span>
                  </div>
                </div>
                <span className="service-amount">₱149.00</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg-primary);
        }

        .sidebar {
          width: 260px;
          height: 100vh;
          padding: var(--spacing-xl) var(--spacing-lg);
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--border-color);
          position: sticky;
          top: 0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: var(--font-size-2xl);
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-2xl);
        }

        .logo-icon {
          color: var(--color-accent-primary);
        }

        .nav-links {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
        }

        .nav-item:hover, .nav-item.active {
          background: var(--color-bg-tertiary);
          color: var(--color-text-primary);
        }

        .nav-item.active {
          border-left: 3px solid var(--color-accent-primary);
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--border-color);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: var(--font-size-sm);
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
          font-size: var(--font-size-sm);
        }

        .main-content {
          flex: 1;
          padding: var(--spacing-2xl);
          overflow-y: auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-2xl);
        }

        .header-stats {
          display: flex;
          gap: var(--spacing-lg);
        }

        .stat-card {
          padding: var(--spacing-md) var(--spacing-xl);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: var(--font-size-xl);
          font-weight: 800;
          color: var(--color-text-primary);
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-2xl);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .upcoming-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .upcoming-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md);
          border-radius: var(--radius-lg);
        }

        .service-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .service-icon {
          font-size: var(--font-size-xl);
        }

        .service-name {
          display: block;
          font-weight: 600;
        }

        .service-date {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
        }

        .service-amount {
          font-weight: 700;
          color: var(--color-text-primary);
        }

        @media (max-width: 1200px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            height: auto;
            position: relative;
          }
          .main-content {
            padding: var(--spacing-lg);
          }
          .dashboard-header {
            flex-direction: column;
            gap: var(--spacing-lg);
          }
        }
      `}</style>
    </div>
  );
}

function BotIcon() {
  return (
    <span style={{ marginRight: '8px' }}>🤖</span>
  );
}

"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/Chat/ChatInterface";
import { LayoutDashboard, Receipt, Bell, Shield, Settings, Eye, EyeOff, TrendingUp, Trash2, PieChart as PieChartIcon } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DashboardData {
  stats: {
    monthly_total: number;
    daily_burn: number;
    weekly_burn: number;
    subscription_count: number;
  };
  upcoming: any[];
  category_breakdown: any[];
  chart_data: any[];
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/dashboard`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubscription = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subscription?")) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/subscriptions/${id}`, {
        method: 'DELETE'
      });
      fetchDashboardData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const maskName = (name: string, index: number) => {
    if (!isPrivacyMode) return name;
    return `Service #${index + 1}`;
  };

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
          <button
            className={`btn-privacy glass ${isPrivacyMode ? 'active' : ''}`}
            onClick={() => setIsPrivacyMode(!isPrivacyMode)}
            title={isPrivacyMode ? "Disable Privacy Mode" : "Enable Privacy Mode"}
          >
            {isPrivacyMode ? <EyeOff size={18} /> : <Eye size={18} />}
            <span>Privacy Mode</span>
          </button>

          <div className="user-profile">
            <div className="user-avatar glass">JD</div>
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-plan badge badge-primary">Free Core</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header fade-in">
          <div className="header-left">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your subscription overview.</p>
          </div>

          <div className="header-stats">
            <div className="stat-card glass">
              <span className="stat-label">Monthly Total</span>
              <span className="stat-value">₱{data?.stats.monthly_total.toLocaleString() || '0.00'}</span>
            </div>
            <div className="stat-card glass">
              <span className="stat-label">Daily Burn</span>
              <span className="stat-value">₱{data?.stats.daily_burn.toLocaleString() || '0.00'}</span>
            </div>
          </div>
        </header>

        <section className="dashboard-grid">
          <div className="grid-left">
            {/* Burn Rate Chart */}
            <div className="chart-card glass fade-in" style={{ animationDelay: '100ms' }}>
              <div className="section-header">
                <h3><TrendingUp size={18} /> Daily Burn Trend</h3>
                <span className="badge badge-primary">Last 7 Days</span>
              </div>
              <div className="chart-wrapper">
                {data ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <AreaChart data={data.chart_data}>
                      <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--color-text-tertiary)', fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--color-text-primary)' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : <div className="loading-placeholder">Loading chart...</div>}
              </div>
            </div>

            <div className="grid-sub-row">
              {/* Category Pie Chart */}
              <div className="chart-card glass fade-in" style={{ animationDelay: '150ms', flex: 1 }}>
                <div className="section-header">
                  <h3><PieChartIcon size={18} /> Category Split</h3>
                </div>
                <div className="chart-wrapper">
                  {data && data.category_breakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.category_breakdown}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {data.category_breakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                          itemStyle={{ color: 'var(--color-text-primary)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : <div className="loading-placeholder">No data for breakdown</div>}
                </div>
              </div>

              {/* Chat Section */}
              <div className="chat-section fade-in" style={{ flex: 1.5, animationDelay: '200ms' }}>
                <div className="section-header">
                  <h3><BotIcon /> Conversational Tracking</h3>
                  <span className="badge badge-success">Live Parser</span>
                </div>
                <ChatInterface onSubscriptionAdded={fetchDashboardData} />
              </div>
            </div>
          </div>

          <div className="grid-right fade-in" style={{ animationDelay: '300ms' }}>
            <div className="upcoming-section">
              <div className="section-header">
                <h3>Upcoming Payments</h3>
              </div>
              <div className="upcoming-list">
                {isLoading ? (
                  <div className="loading-placeholder">Loading payments...</div>
                ) : (data?.upcoming && data.upcoming.length === 0) ? (
                  <div className="empty-state-mini">No upcoming payments found.</div>
                ) : (
                  data?.upcoming.map((sub, idx) => (
                    <div key={sub.id} className="upcoming-item card glass group">
                      <div className="service-info">
                        <div className="service-icon">{sub.category?.icon || '📦'}</div>
                        <div>
                          <span className="service-name">{maskName(sub.name, idx)}</span>
                          <span className="service-date">
                            {new Date(sub.next_payment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                      <div className="amount-action">
                        <span className="service-amount">₱{Number(sub.amount).toLocaleString()}</span>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteSubscription(sub.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Privacy Highlight Card */}
            <div className="privacy-tip card glass-elevated">
              <h4>Privacy First</h4>
              <p>Your data stays on your machine. We never link your bank account.</p>
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
          z-index: 10;
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
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .btn-privacy {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          background: var(--color-bg-tertiary);
          text-align: left;
        }

        .btn-privacy:hover {
          border-color: var(--color-accent-primary);
          color: var(--color-text-primary);
        }

        .btn-privacy.active {
          background: var(--color-accent-primary);
          color: white;
          border-color: transparent;
          box-shadow: var(--shadow-glow);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--border-color);
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
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
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
          min-width: 180px;
        }

        .stat-label {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
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

        .grid-left {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-2xl);
        }

        .grid-sub-row {
          display: flex;
          gap: var(--spacing-2xl);
          width: 100%;
        }

        .chart-card {
          padding: var(--spacing-lg);
          border-radius: var(--radius-xl);
          min-height: 300px;
          display: flex;
          flex-direction: column;
        }

        .amount-action {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .btn-delete {
          opacity: 0;
          visibility: hidden;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: none;
          padding: 6px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .upcoming-item:hover .btn-delete {
          opacity: 1;
          visibility: visible;
        }

        .btn-delete:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.1);
        }

        .chart-wrapper {
          flex: 1;
          margin-top: var(--spacing-md);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }

        .section-header h3 {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: 0;
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
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-md);
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

        .privacy-tip {
          margin-top: var(--spacing-2xl);
          padding: var(--spacing-lg);
          background: var(--gradient-primary);
          border: none;
        }

        .privacy-tip h4 {
          color: white;
          margin-bottom: var(--spacing-sm);
          font-size: var(--font-size-lg);
        }

        .privacy-tip p {
          color: rgba(255, 255, 255, 0.8);
          font-size: var(--font-size-sm);
          margin-bottom: 0;
        }

        .loading-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-tertiary);
          font-style: italic;
        }

        .empty-state-mini {
          padding: var(--spacing-xl);
          text-align: center;
          color: var(--color-text-tertiary);
          font-style: italic;
          background: rgba(255,255,255,0.02);
          border-radius: var(--radius-lg);
          border: 1px dashed var(--border-color);
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
            border-right: none;
            border-bottom: 1px solid var(--border-color);
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

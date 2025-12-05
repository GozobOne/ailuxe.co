import { useState } from "react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Real data from your screenshots + ROI Guide
  const stats = {
    totalMRR: "$11,400",
    activeClients: 5,
    trialClients: 1,
    avgRevenue: "$1,900",
    projectedQ42026: "$185,000"
  };

  const clients = [
    { name: "Elite Events Kuwait", subdomain: "elite.ailuxe.co", revenue: 3200, logo: false },
    { name: "Gala Events Kuwait", subdomain: "gala.ailuxe.co", revenue: 2800, logo: false },
    { name: "Luxury Weddings KW", subdomain: "luxuryweddings.ailuxe.co", revenue: 3900, logo: false }
  ];

  const quickActions = [
    { icon: "🏠", label: "Overview", path: "/admin", color: "#D4AF37" },
    { icon: "👥", label: "Clients", path: "/admin/clients", color: "#10b981" },
    { icon: "💰", label: "Billing", path: "/admin/billing", color: "#f59e0b" },
    { icon: "⚙️", label: "API Settings", path: "/api-settings", color: "#8b5cf6" },
    { icon: "🎨", label: "White-Label", path: "/admin/white-label", color: "#ec4899" },
    { icon: "📊", label: "Analytics", path: "/analytics", color: "#06b6d4" }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ maxWidth: '1600px', margin: '0 auto 30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
          <div style={{ fontSize: '40px' }}>⚡</div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontWeight: '700'
          }}>
            AI LUXE Admin
          </h1>
        </div>
        <p style={{ color: '#9CA3AF', fontSize: '16px', margin: 0 }}>
          White-label multi-tenant management · $11,400 MRR live
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto 30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        {quickActions.map((action, idx) => (
          <Link key={idx} href={action.path}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${action.color}33`,
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${action.color}22`;
              e.currentTarget.style.borderColor = action.color;
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = `${action.color}33`;
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{action.icon}</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>{action.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Top Metrics */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto 30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {[
          { label: 'Total MRR', value: stats.totalMRR, icon: '💰', trend: '+34% MoM' },
          { label: 'Active Clients', value: stats.activeClients, icon: '🏢', trend: '+2' },
          { label: 'Trial Clients', value: stats.trialClients, icon: '⏳', trend: 'New' },
          { label: 'Avg Revenue', value: stats.avgRevenue, icon: '📊', trend: '+12%' },
          { label: 'Q4 2026 Forecast', value: stats.projectedQ42026, icon: '🚀', trend: '25%+ CAGR' }
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '36px' }}>{stat.icon}</div>
              <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>{stat.trend}</span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#D4AF37' }}>{stat.value}</div>
            <div style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '8px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Client List */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        padding: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600' }}>Active White-Label Clients</h2>
          <button style={{
            background: '#D4AF37',
            color: '#000',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            + Add Client
          </button>
        </div>

        <div style={{ display: 'grid', gap: '20px' }}>
          {clients.map((client, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(212, 175, 55, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: '#1a1a1a',
                  border: '2px dashed #D4AF37',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px'
                }}>
                  {client.logo ? '🏢' : '⬜'}
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '600' }}>{client.name}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '14px' }}>@{client.subdomain}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#D4AF37' }}>
                  ${client.revenue.toLocaleString()}
                </div>
                <div style={{ color: '#10b981', fontSize: '14px' }}>Monthly Revenue</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

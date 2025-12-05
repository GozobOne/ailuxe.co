import { useState } from "react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = {
    totalUsers: 247,
    activeUsers: 189,
    totalBots: 12,
    activeBots: 8,
    totalMessages: 45234,
    totalRevenue: "$12,450",
    storageUsed: "2.4 GB",
    apiCalls: 89234
  };

  const recentUsers = [
    { name: "Sarah Johnson", email: "sarah@luxury.com", role: "Owner", status: "active", joined: "2024-01-15" },
    { name: "Michael Chen", email: "michael@vip.com", role: "Admin", status: "active", joined: "2024-02-03" },
    { name: "Emma Williams", email: "emma@elite.com", role: "Moderator", status: "active", joined: "2024-02-18" },
    { name: "James Brown", email: "james@premium.com", role: "User", status: "inactive", joined: "2024-03-01" }
  ];

  const systemHealth = [
    { service: "Database", status: "healthy", uptime: "99.9%", latency: "12ms" },
    { service: "API Server", status: "healthy", uptime: "99.8%", latency: "45ms" },
    { service: "Message Queue", status: "healthy", uptime: "100%", latency: "8ms" },
    { service: "File Storage", status: "warning", uptime: "98.5%", latency: "120ms" }
  ];

  const quickActions = [
    { icon: "👥", label: "Manage Users", path: "/admin/users", color: "#D4AF37" },
    { icon: "🤖", label: "Configure Bots", path: "/bots", color: "#3b82f6" },
    { icon: "⚙️", label: "System Settings", path: "/admin/settings", color: "#8b5cf6" },
    { icon: "📊", label: "View Analytics", path: "/analytics", color: "#10b981" },
    { icon: "🔑", label: "API Settings", path: "/api-settings", color: "#f59e0b" },
    { icon: "🎨", label: "White Label", path: "/white-label", color: "#ec4899" }
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
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto 30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '10px'
        }}>
          <div style={{ fontSize: '40px' }}>⚡</div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontWeight: '700'
          }}>
            Admin Dashboard
          </h1>
        </div>
        <p style={{
          color: '#9CA3AF',
          fontSize: '16px',
          margin: 0
        }}>
          Manage users, monitor system health, and configure platform settings
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
              transition: 'all 0.3s ease',
              textDecoration: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${action.color}22`;
              e.currentTarget.style.borderColor = action.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = `${action.color}33`;
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{action.icon}</div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#FFFFFF'
              }}>
                {action.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto 30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#D4AF37' },
          { label: 'Active Users', value: stats.activeUsers, icon: '✅', color: '#10b981' },
          { label: 'Total Bots', value: stats.totalBots, icon: '🤖', color: '#3b82f6' },
          { label: 'Active Bots', value: stats.activeBots, icon: '⚡', color: '#8b5cf6' },
          { label: 'Total Messages', value: stats.totalMessages.toLocaleString(), icon: '💬', color: '#f59e0b' },
          { label: 'Revenue', value: stats.totalRevenue, icon: '💰', color: '#10b981' },
          { label: 'Storage Used', value: stats.storageUsed, icon: '💾', color: '#ec4899' },
          { label: 'API Calls', value: stats.apiCalls.toLocaleString(), icon: '🔌', color: '#06b6d4' }
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>{stat.icon}</div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: stat.color,
              marginBottom: '5px'
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#9CA3AF'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* System Health */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto 30px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        padding: '30px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '20px',
          color: '#FFFFFF'
        }}>
          🏥 System Health
        </h2>
        <div style={{
          display: 'grid',
          gap: '15px'
        }}>
          {systemHealth.map((service, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(212, 175, 55, 0.1)',
              borderRadius: '8px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr auto auto auto',
              gap: '20px',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginBottom: '5px'
                }}>
                  {service.service}
                </div>
                <div style={{
                  display: 'inline-block',
                  background: service.status === 'healthy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: service.status === 'healthy' ? '#10b981' : '#f59e0b',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {service.status}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '5px' }}>Uptime</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#10b981' }}>{service.uptime}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '5px' }}>Latency</div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#3b82f6' }}>{service.latency}</div>
              </div>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: service.status === 'healthy' ? '#10b981' : '#f59e0b',
                boxShadow: service.status === 'healthy' ? '0 0 10px #10b981' : '0 0 10px #f59e0b'
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '12px',
        padding: '30px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '20px',
          color: '#FFFFFF'
        }}>
          👥 Recent Users
        </h2>
        <div style={{
          display: 'grid',
          gap: '15px'
        }}>
          {recentUsers.map((user, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(212, 175, 55, 0.1)',
              borderRadius: '8px',
              padding: '20px',
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr',
              gap: '20px',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginBottom: '5px'
                }}>
                  {user.name}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#9CA3AF'
                }}>
                  {user.email}
                </div>
              </div>
              <div style={{
                display: 'inline-block',
                background: 'rgba(212, 175, 55, 0.1)',
                color: '#D4AF37',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                {user.role}
              </div>
              <div style={{
                display: 'inline-block',
                background: user.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                color: user.status === 'active' ? '#10b981' : '#9CA3AF',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center',
                textTransform: 'capitalize'
              }}>
                {user.status}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#9CA3AF',
                textAlign: 'right'
              }}>
                {user.joined}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

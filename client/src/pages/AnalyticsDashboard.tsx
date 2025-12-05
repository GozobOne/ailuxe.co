import { useState } from "react";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Mock analytics data
  const stats = {
    totalMessages: 12847,
    responseRate: 94.2,
    avgResponseTime: "2.3s",
    activeBots: 3,
    totalConversations: 847,
    satisfactionScore: 4.8,
    costSavings: "$3,240",
    timesSaved: "127h"
  };

  const platformData = [
    { platform: "WhatsApp", messages: 5234, percentage: 40.7, color: "#25D366" },
    { platform: "Instagram", messages: 3891, percentage: 30.3, color: "#E4405F" },
    { platform: "Telegram", messages: 2456, percentage: 19.1, color: "#0088cc" },
    { platform: "LinkedIn", messages: 1266, percentage: 9.9, color: "#0077B5" }
  ];

  const hourlyData = [
    { hour: "00:00", messages: 45 },
    { hour: "03:00", messages: 23 },
    { hour: "06:00", messages: 67 },
    { hour: "09:00", messages: 234 },
    { hour: "12:00", messages: 456 },
    { hour: "15:00", messages: 389 },
    { hour: "18:00", messages: 512 },
    { hour: "21:00", messages: 298 }
  ];

  const topPerformers = [
    { name: "Luxury Concierge Bot", platform: "WhatsApp", messages: 1247, rate: 94 },
    { name: "VIP Booking Assistant", platform: "Instagram", messages: 856, rate: 91 },
    { name: "Event Coordinator", platform: "Telegram", messages: 342, rate: 88 }
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
          <div style={{ fontSize: '40px' }}>📊</div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontWeight: '700'
          }}>
            Analytics Dashboard
          </h1>
        </div>
        <p style={{
          color: '#9CA3AF',
          fontSize: '16px',
          margin: 0
        }}>
          Track performance, engagement, and ROI across all platforms
        </p>
      </div>

      {/* Time Range Selector */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto 30px',
        display: 'flex',
        gap: '10px'
      }}>
        {['24h', '7d', '30d', '90d', '1y'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            style={{
              background: timeRange === range ? '#D4AF37' : 'rgba(255, 255, 255, 0.05)',
              color: timeRange === range ? '#000000' : '#FFFFFF',
              border: `1px solid ${timeRange === range ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)'}`,
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {range.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto 30px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {[
          { label: 'Total Messages', value: stats.totalMessages.toLocaleString(), icon: '💬', color: '#D4AF37', trend: '+12%' },
          { label: 'Response Rate', value: `${stats.responseRate}%`, icon: '✅', color: '#10b981', trend: '+3%' },
          { label: 'Avg Response Time', value: stats.avgResponseTime, icon: '⚡', color: '#3b82f6', trend: '-15%' },
          { label: 'Active Bots', value: stats.activeBots, icon: '🤖', color: '#8b5cf6', trend: '+1' },
          { label: 'Conversations', value: stats.totalConversations, icon: '💭', color: '#f59e0b', trend: '+23' },
          { label: 'Satisfaction', value: stats.satisfactionScore, icon: '⭐', color: '#ec4899', trend: '+0.2' },
          { label: 'Cost Savings', value: stats.costSavings, icon: '💰', color: '#10b981', trend: '+$420' },
          { label: 'Time Saved', value: stats.timesSaved, icon: '⏰', color: '#06b6d4', trend: '+18h' }
        ].map((metric, idx) => (
          <div key={idx} style={{
            background: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '12px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '10px'
            }}>
              <div style={{ fontSize: '32px' }}>{metric.icon}</div>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10b981',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {metric.trend}
              </div>
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: metric.color,
              marginBottom: '5px'
            }}>
              {metric.value}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#9CA3AF'
            }}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* Platform Distribution */}
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
          📱 Platform Distribution
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {platformData.map((platform, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(212, 175, 55, 0.1)',
              borderRadius: '8px',
              padding: '20px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <span style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#FFFFFF'
                }}>
                  {platform.platform}
                </span>
                <span style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: platform.color
                }}>
                  {platform.percentage}%
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '10px'
              }}>
                <div style={{
                  width: `${platform.percentage}%`,
                  height: '100%',
                  background: platform.color,
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{
                fontSize: '14px',
                color: '#9CA3AF'
              }}>
                {platform.messages.toLocaleString()} messages
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly Activity Chart */}
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
          📈 Hourly Activity
        </h2>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '10px',
          height: '200px'
        }}>
          {hourlyData.map((data, idx) => {
            const maxMessages = Math.max(...hourlyData.map(d => d.messages));
            const height = (data.messages / maxMessages) * 100;
            return (
              <div key={idx} style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '100%',
                  height: `${height}%`,
                  background: 'linear-gradient(180deg, #D4AF37 0%, rgba(212, 175, 55, 0.3) 100%)',
                  borderRadius: '8px 8px 0 0',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #FFD700 0%, rgba(255, 215, 0, 0.5) 100%)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(180deg, #D4AF37 0%, rgba(212, 175, 55, 0.3) 100%)';
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#D4AF37',
                    whiteSpace: 'nowrap'
                  }}>
                    {data.messages}
                  </div>
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#9CA3AF'
                }}>
                  {data.hour}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performers */}
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
          🏆 Top Performing Bots
        </h2>
        <div style={{
          display: 'grid',
          gap: '15px'
        }}>
          {topPerformers.map((bot, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(212, 175, 55, 0.1)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  marginBottom: '5px'
                }}>
                  {idx + 1}. {bot.name}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#9CA3AF'
                }}>
                  {bot.platform} • {bot.messages} messages
                </div>
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#10b981'
              }}>
                {bot.rate}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

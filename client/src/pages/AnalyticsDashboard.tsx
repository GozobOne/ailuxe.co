import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"; // Add if not installed: npm i recharts

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("all");
  
  // Your existing mock data (enhanced with MRR from ROI Guide + Market Analysis)
  const stats = {
    totalMessages: 12847,
    responseRate: 94.2,
    avgResponseTime: "2.3s",
    activeBots: 3,
    totalConversations: 847,
    satisfactionScore: 4.8,
    costSavings: "$3,240", // From ROI PDF
    timesSaved: "127h", // From ROI PDF
    totalMRR: 11400, // From Admin screenshot
    projectedQ4: 185000, // From Market Analysis PDF
    growthMoM: 34 // From trends
  };
  
  const platformData = [
    { platform: "WhatsApp", messages: 5234, percentage: 40.7, color: "#25D366" },
    { platform: "Instagram", messages: 3891, percentage: 30.3, color: "#E4405F" },
    { platform: "Telegram", messages: 2456, percentage: 19.1, color: "#0088cc" },
    { platform: "LinkedIn", messages: 1266, percentage: 9.9, color: "#0077B5" }
  ];
  
  // Enhanced hourly data for Recharts (your original + revenue tie-in from Market PDF)
  const hourlyData = [
    { hour: "00:00", messages: 45, revenue: 850 },
    { hour: "03:00", messages: 23, revenue: 420 },
    { hour: "06:00", messages: 67, revenue: 1120 },
    { hour: "09:00", messages: 234, revenue: 1380 },
    { hour: "12:00", messages: 456, revenue: 1740 },
    { hour: "15:00", messages: 389, revenue: 2190 },
    { hour: "18:00", messages: 512, revenue: 2850 },
    { hour: "21:00", messages: 298, revenue: 1740 }
  ];
  
  const topPerformers = [
    { name: "Luxury Concierge Bot", platform: "WhatsApp", messages: 1247, rate: 94 },
    { name: "VIP Booking Assistant", platform: "Instagram", messages: 856, rate: 91 },
    { name: "Event Coordinator", platform: "Telegram", messages: 342, rate: 88 }
  ];

  // Revenue growth data from Market Analysis PDF trends
  const revenueData = [
    { month: "Jan", revenue: 8500 },
    { month: "Feb", revenue: 11200 },
    { month: "Mar", revenue: 13800 },
    { month: "Apr", revenue: 17400 },
    { month: "May", revenue: 21900 },
    { month: "Jun", revenue: 28500 }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      {/* Your existing Header */}
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

      {/* Your existing Time Range Selector */}
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

      {/* Your existing Key Metrics Grid + New MRR Card from Screenshots/PDFs */}
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
          { label: 'Time Saved', value: stats.timesSaved, icon: '⏰', color: '#06b6d4', trend: '+18h' },
          // New: From your Admin screenshot + Market PDF
          { label: 'Total MRR', value: `$${stats.totalMRR.toLocaleString()}`, icon: '📈', color: '#D4AF37', trend: `+${stats.growthMoM}% MoM` },
          { label: 'Projected Q4 2026', value: `$${stats.projectedQ4.toLocaleString()}`, icon: '🔮', color: '#FFD700', trend: '+25% CAGR' }
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

      {/* Your existing Platform Distribution */}
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

      {/* Enhanced Hourly Activity: Your bars → Recharts LineChart for smooth scaling + revenue overlay */}
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
          📈 Hourly Activity & Revenue
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="hour" stroke="#D4AF37" />
            <YAxis stroke="#D4AF37" />
            <Tooltip 
              contentStyle={{ background: "#000", border: "1px solid #D4AF37", color: "#FFF" }} 
              formatter={(value, name) => [value, name === 'messages' ? 'Messages' : 'Revenue ($)']}
            />
            <Line type="monotone" dataKey="messages" stroke="#D4AF37" strokeWidth={3} name="Messages" dot={{ fill: "#D4AF37" }} />
            <Line type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={3} name="Revenue" dot={{ fill: "#FFD700" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Your existing Top Performers */}
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

      {/* New: Revenue Forecast Section from Market PDF Trends */}
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
          💰 Revenue Forecast (25%+ CAGR)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#D4AF37" />
            <YAxis stroke="#D4AF37" />
            <Tooltip contentStyle={{ background: "#000", border: "1px solid #D4AF37" }} />
            <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={4} dot={{ fill: "#D4AF37" }} />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '10px' }}>
          Projected $18.5M MRR by Q2 2026 – Voice AI driving 23% higher revenue per room<grok-card data-id="cd5941" data-type="citation_card"></grok-card>
        </p>
      </div>
    </div>
  );
}

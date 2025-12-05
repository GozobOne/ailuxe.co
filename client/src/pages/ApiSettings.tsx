import { useState } from "react";

export default function ApiSettings() {
  const [selectedProvider, setSelectedProvider] = useState("openai");
  const [showApiKey, setShowApiKey] = useState(false);

  const apiProviders = [
    {
      id: "openai",
      name: "OpenAI",
      icon: "🤖",
      models: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
      status: "connected",
      color: "#10b981"
    },
    {
      id: "anthropic",
      name: "Anthropic",
      icon: "🧠",
      models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
      status: "disconnected",
      color: "#9CA3AF"
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      icon: "🔍",
      models: ["deepseek-chat", "deepseek-coder"],
      status: "connected",
      color: "#10b981"
    },
    {
      id: "google",
      name: "Google AI",
      icon: "🌐",
      models: ["gemini-pro", "gemini-pro-vision"],
      status: "disconnected",
      color: "#9CA3AF"
    }
  ];

  const integrations = [
    { name: "WhatsApp Business API", status: "active", requests: "12,847", icon: "📱", color: "#25D366" },
    { name: "Instagram Graph API", status: "active", requests: "8,234", icon: "📸", color: "#E4405F" },
    { name: "Telegram Bot API", status: "active", requests: "5,123", icon: "✈️", color: "#0088cc" },
    { name: "LinkedIn API", status: "active", requests: "2,456", icon: "💼", color: "#0077B5" },
    { name: "X (Twitter) API", status: "inactive", requests: "0", icon: "🐦", color: "#9CA3AF" },
    { name: "TikTok API", status: "inactive", requests: "0", icon: "🎵", color: "#9CA3AF" }
  ];

  const webhooks = [
    { url: "https://ailuxe.co/webhooks/messages", event: "message.received", status: "active" },
    { url: "https://ailuxe.co/webhooks/bookings", event: "booking.created", status: "active" },
    { url: "https://ailuxe.co/webhooks/users", event: "user.updated", status: "active" }
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
          <div style={{ fontSize: '40px' }}>🔌</div>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 42px)',
            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            fontWeight: '700'
          }}>
            API Settings
          </h1>
        </div>
        <p style={{
          color: '#9CA3AF',
          fontSize: '16px',
          margin: 0
        }}>
          Configure AI models, integrations, and webhooks for your platform
        </p>
      </div>

      {/* AI Model Providers */}
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
          🤖 AI Model Providers
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {apiProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => setSelectedProvider(provider.id)}
              style={{
                background: selectedProvider === provider.id ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${selectedProvider === provider.id ? '#D4AF37' : 'rgba(212, 175, 55, 0.1)'}`,
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedProvider !== provider.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedProvider !== provider.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                }
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{ fontSize: '32px' }}>{provider.icon}</div>
                  <div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#FFFFFF'
                    }}>
                      {provider.name}
                    </div>
                  </div>
                </div>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: provider.color,
                  boxShadow: `0 0 10px ${provider.color}`
                }} />
              </div>
              <div style={{
                fontSize: '14px',
                color: '#9CA3AF',
                marginBottom: '10px'
              }}>
                Available Models:
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {provider.models.map((model, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    color: '#D4AF37',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {model}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* API Key Configuration */}
        <div style={{
          marginTop: '30px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(212, 175, 55, 0.1)',
          borderRadius: '12px',
          padding: '25px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '15px',
            color: '#FFFFFF'
          }}>
            🔑 API Key Configuration
          </h3>
          <div style={{
            display: 'grid',
            gap: '15px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#9CA3AF',
                marginBottom: '8px'
              }}>
                API Key
              </label>
              <div style={{
                display: 'flex',
                gap: '10px'
              }}>
                <input
                  type={showApiKey ? "text" : "password"}
                  value="sk-proj-••••••••••••••••••••••••••••••••"
                  readOnly
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                  }}
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 20px',
                    color: '#D4AF37',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                  }}
                >
                  {showApiKey ? '👁️ Hide' : '👁️ Show'}
                </button>
              </div>
            </div>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                color: '#9CA3AF',
                marginBottom: '8px'
              }}>
                Default Model
              </label>
              <select
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#FFFFFF',
                  fontSize: '14px'
                }}
              >
                <option>gpt-4o-mini</option>
                <option>gpt-4o</option>
                <option>gpt-4-turbo</option>
                <option>deepseek-chat</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Integrations */}
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
          🌐 Platform Integrations
        </h2>
        <div style={{
          display: 'grid',
          gap: '15px'
        }}>
          {integrations.map((integration, idx) => (
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
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ fontSize: '32px' }}>{integration.icon}</div>
                <div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#FFFFFF'
                  }}>
                    {integration.name}
                  </div>
                </div>
              </div>
              <div style={{
                display: 'inline-block',
                background: integration.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                color: integration.status === 'active' ? '#10b981' : '#9CA3AF',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center',
                textTransform: 'capitalize'
              }}>
                {integration.status}
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#D4AF37',
                textAlign: 'center'
              }}>
                {integration.requests}
              </div>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: integration.color,
                boxShadow: `0 0 10px ${integration.color}`,
                marginLeft: 'auto'
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks */}
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
          🔗 Webhooks
        </h2>
        <div style={{
          display: 'grid',
          gap: '15px'
        }}>
          {webhooks.map((webhook, idx) => (
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
                marginBottom: '10px'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  fontFamily: 'monospace'
                }}>
                  {webhook.url}
                </div>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {webhook.status}
                </div>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#9CA3AF'
              }}>
                Event: <span style={{ color: '#D4AF37', fontWeight: '500' }}>{webhook.event}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

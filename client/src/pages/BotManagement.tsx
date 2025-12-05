export default function BotManagement() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '80px 20px 40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '700',
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Bot Configuration
          </h1>
          <p style={{ fontSize: '18px', color: '#999999' }}>
            Manage your AI concierge bots across platforms
          </p>
        </div>

        {/* Create New Bot Button */}
        <button style={{
          background: '#D4AF37',
          color: '#000000',
          border: 'none',
          borderRadius: '8px',
          padding: '15px 30px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '30px',
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          ➕ Create New Bot
        </button>

        {/* Bots Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          {[
            {
              name: 'Luxury Concierge Bot',
              platform: 'WhatsApp',
              status: 'Active',
              messages: 1247,
              responseRate: '94%',
              persona: 'Elite Events Manager'
            },
            {
              name: 'VIP Booking Assistant',
              platform: 'Instagram',
              status: 'Active',
              messages: 856,
              responseRate: '91%',
              persona: 'Luxury Concierge'
            },
            {
              name: 'Event Coordinator Bot',
              platform: 'Telegram',
              status: 'Paused',
              messages: 342,
              responseRate: '88%',
              persona: 'VIP Coordinator'
            }
          ].map((bot, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '2px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '16px',
              padding: '30px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#D4AF37';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              {/* Bot Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '20px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    marginBottom: '5px'
                  }}>
                    {bot.name}
                  </h3>
                  <div style={{
                    fontSize: '14px',
                    color: '#999999'
                  }}>
                    {bot.platform}
                  </div>
                </div>
                <span style={{
                  background: bot.status === 'Active' ? '#4CAF50' : '#FF9800',
                  color: '#000000',
                  padding: '6px 14px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {bot.status}
                </span>
              </div>

              {/* Bot Stats */}
              <div style={{
                background: 'rgba(212, 175, 55, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px'
                }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#D4AF37' }}>
                      {bot.messages}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999999' }}>
                      Total Messages
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>
                      {bot.responseRate}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999999' }}>
                      Response Rate
                    </div>
                  </div>
                </div>
              </div>

              {/* Persona Info */}
              <div style={{
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '12px', color: '#999999', marginBottom: '5px' }}>
                  Using Persona:
                </div>
                <div style={{ fontSize: '14px', color: '#D4AF37', fontWeight: '600' }}>
                  {bot.persona}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <button style={{
                  background: 'transparent',
                  border: '2px solid #D4AF37',
                  borderRadius: '8px',
                  color: '#D4AF37',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#D4AF37';
                  e.currentTarget.style.color = '#000000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#D4AF37';
                }}>
                  ⚙️ Configure
                </button>
                <button style={{
                  background: 'transparent',
                  border: '2px solid #666666',
                  borderRadius: '8px',
                  color: '#CCCCCC',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFFFFF';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#666666';
                  e.currentTarget.style.color = '#CCCCCC';
                }}>
                  📊 Analytics
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

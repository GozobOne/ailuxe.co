export default function PersonaManagement() {
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
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '700',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Persona Management
          </h1>
          <p style={{ fontSize: '18px', color: '#999999' }}>
            Clone your communication style from chat history
          </p>
        </div>

        {/* Upload Section */}
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '2px solid #D4AF37',
          borderRadius: '16px',
          padding: '40px',
          marginBottom: '40px',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '20px'
            }}>
              📤
            </div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#D4AF37',
              marginBottom: '10px'
            }}>
              Upload Chat History
            </h2>
            <p style={{ fontSize: '16px', color: '#CCCCCC' }}>
              Supports WhatsApp TXT, Telegram JSON, and PDF files (max 16MB)
            </p>
          </div>

          <div style={{
            border: '2px dashed rgba(212, 175, 55, 0.5)',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#D4AF37';
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
            e.currentTarget.style.background = 'transparent';
          }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📁</div>
            <p style={{ fontSize: '16px', color: '#FFFFFF', marginBottom: '5px' }}>
              Click to upload or drag and drop
            </p>
            <p style={{ fontSize: '14px', color: '#999999' }}>
              TXT, JSON, or PDF up to 16MB
            </p>
          </div>

          <button style={{
            width: '100%',
            marginTop: '20px',
            background: '#D4AF37',
            color: '#000000',
            border: 'none',
            borderRadius: '8px',
            padding: '15px 30px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            ✨ Upload & Clone Persona
          </button>
        </div>

        {/* Personas List */}
        <div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#D4AF37',
            marginBottom: '25px',
            textAlign: 'center'
          }}>
            Your Personas
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {[
              {
                name: 'Elite Events Manager',
                type: 'WhatsApp TXT',
                messages: 342,
                tone: 'Professional',
                status: 'Active'
              },
              {
                name: 'Luxury Concierge',
                type: 'Telegram JSON',
                messages: 156,
                tone: 'Friendly',
                status: 'Active'
              },
              {
                name: 'VIP Coordinator',
                type: 'PDF',
                messages: 89,
                tone: 'Formal',
                status: 'Training'
              }
            ].map((persona, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '12px',
                padding: '25px',
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
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '15px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#FFFFFF'
                  }}>
                    {persona.name}
                  </h3>
                  <span style={{
                    background: persona.status === 'Active' ? '#4CAF50' : '#FF9800',
                    color: '#000000',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {persona.status}
                  </span>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{ color: '#999999', fontSize: '14px' }}>Type:</span>
                    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>{persona.type}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{ color: '#999999', fontSize: '14px' }}>Messages:</span>
                    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>{persona.messages}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ color: '#999999', fontSize: '14px' }}>Tone:</span>
                    <span style={{ color: '#FFFFFF', fontSize: '14px' }}>{persona.tone}</span>
                  </div>
                </div>

                <button style={{
                  width: '100%',
                  background: 'transparent',
                  border: '2px solid #D4AF37',
                  borderRadius: '8px',
                  color: '#D4AF37',
                  padding: '10px',
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
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

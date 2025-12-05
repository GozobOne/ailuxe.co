export default function MessageSearch() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '80px 20px 40px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>💬</div>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: '700',
            marginBottom: '15px',
            background: 'linear-gradient(135deg, #D4AF37 0%, #F4E5B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Messages
          </h1>
          <p style={{ fontSize: '18px', color: '#999999' }}>
            View and search all conversations
          </p>
        </div>

        <input
          type="text"
          placeholder="Search messages..."
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            padding: '15px 20px',
            fontSize: '16px',
            color: '#FFFFFF',
            marginBottom: '30px'
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[
            { from: 'Sarah Al-Mansour', message: 'Can you check availability for December 15th?', time: '2 min ago', platform: 'WhatsApp', unread: true },
            { from: 'Mohammed Al-Rashid', message: 'The contract looks perfect, proceeding with signature', time: '15 min ago', platform: 'Telegram', unread: false },
            { from: 'Layla Hassan', message: 'Voice note: 2:34', time: '1 hour ago', platform: 'WhatsApp', unread: false },
            { from: 'Khalid Al-Sabah', message: 'Thank you for the quick response!', time: '3 hours ago', platform: 'Instagram', unread: false }
          ].map((msg, index) => (
            <div key={index} style={{
              background: msg.unread ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              border: `2px solid ${msg.unread ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)'}`,
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#D4AF37';
              e.currentTarget.style.transform = 'translateX(5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = msg.unread ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#FFFFFF' }}>
                  {msg.from}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    background: msg.platform === 'WhatsApp' ? '#25D366' : msg.platform === 'Telegram' ? '#0088cc' : '#E4405F',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>
                    {msg.platform}
                  </span>
                  <span style={{ fontSize: '14px', color: '#999999' }}>
                    {msg.time}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '15px', color: '#CCCCCC' }}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

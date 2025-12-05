export default function Dashboard() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      padding: '80px 20px 40px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          fontWeight: '700',
          color: '#FFFFFF',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Dashboard
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: '#999999',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          Your AI LUXE command center
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {[
            { title: 'Active Bots', value: '3', color: '#D4AF37' },
            { title: 'Messages Today', value: '127', color: '#4CAF50' },
            { title: 'Response Rate', value: '94%', color: '#2196F3' },
            { title: 'Avg Response Time', value: '2.3s', color: '#FF9800' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '2px solid #D4AF37',
              borderRadius: '12px',
              padding: '30px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: '700',
                color: stat.color,
                marginBottom: '10px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '16px',
                color: '#999999'
              }}>
                {stat.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

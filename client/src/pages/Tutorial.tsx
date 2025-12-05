export default function Tutorial() {
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
          Tutorial
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: '#999999',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          Learn how to use AI LUXE effectively
        </p>
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '2px solid #D4AF37',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#D4AF37', fontSize: '18px' }}>
            Tutorial content coming soon
          </p>
        </div>
      </div>
    </div>
  );
}

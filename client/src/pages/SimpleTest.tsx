export default function SimpleTest() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <h1 style={{
        fontSize: '60px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        AI <span style={{ color: '#D4AF37' }}>LUXE</span>
      </h1>
      <p style={{
        fontSize: '24px',
        color: '#CCCCCC',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        Time is the Real Luxury
      </p>
      <div style={{
        fontSize: '18px',
        color: '#00FF00',
        marginBottom: '20px'
      }}>
        ✅ Deployment Successful!
      </div>
      <p style={{
        fontSize: '14px',
        color: '#888888'
      }}>
        If you can see this, the app is working correctly.
      </p>
    </div>
  );
}

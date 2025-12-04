export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px' }}>
        <h1 style={{
          fontSize: '72px',
          fontWeight: '900',
          color: '#FFFFFF',
          marginBottom: '20px',
          letterSpacing: '-2px'
        }}>
          AI <span style={{ color: '#D4AF37' }}>LUXE</span>
        </h1>
        
        <p style={{
          fontSize: '32px',
          color: '#CCCCCC',
          marginBottom: '40px',
          fontWeight: '300'
        }}>
          Time is the Real Luxury
        </p>
        
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '2px solid #D4AF37',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '40px'
        }}>
          <p style={{
            fontSize: '20px',
            color: '#D4AF37',
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            ✅ Site is LIVE!
          </p>
          <p style={{
            fontSize: '16px',
            color: '#999999',
            lineHeight: '1.6'
          }}>
            White-label AI concierge platform for luxury event management.
            <br />
            Full features coming online shortly.
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a 
            href="/sign-in"
            style={{
              background: '#D4AF37',
              color: '#000000',
              padding: '16px 40px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            Sign In
          </a>
          
          <a 
            href="/sign-up"
            style={{
              background: 'transparent',
              color: '#D4AF37',
              border: '2px solid #D4AF37',
              padding: '16px 40px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '18px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
          >
            Get Started
          </a>
        </div>
        
        <p style={{
          fontSize: '14px',
          color: '#666666',
          marginTop: '60px'
        }}>
          © 2024 AI LUXE. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function Pricing() {
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
          Pricing
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: '#999999',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          Choose the perfect plan for your business
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginTop: '60px'
        }}>
          {[
            { name: 'Starter', price: '$99', features: ['1 Bot', '1,000 messages/mo', 'Email support'] },
            { name: 'Professional', price: '$299', features: ['5 Bots', '10,000 messages/mo', 'Priority support', 'White-label'] },
            { name: 'Enterprise', price: 'Custom', features: ['Unlimited Bots', 'Unlimited messages', '24/7 support', 'Custom features'] }
          ].map((plan, index) => (
            <div key={index} style={{
              background: 'rgba(212, 175, 55, 0.1)',
              border: '2px solid #D4AF37',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#D4AF37', fontSize: '24px', marginBottom: '20px' }}>{plan.name}</h3>
              <div style={{ color: '#FFFFFF', fontSize: '48px', fontWeight: '700', marginBottom: '30px' }}>{plan.price}</div>
              {plan.features.map((feature, i) => (
                <p key={i} style={{ color: '#999999', marginBottom: '10px' }}>{feature}</p>
              ))}
              <button style={{
                marginTop: '30px',
                background: '#D4AF37',
                color: '#000000',
                border: 'none',
                padding: '15px 40px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

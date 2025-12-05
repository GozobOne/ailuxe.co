import { useState, useEffect } from 'react';

export default function LuxuryHomepage() {
  const [counts, setCounts] = useState({ time: 0, satisfaction: 0, revenue: 0 });

  // Animated counting effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounts({
        time: Math.floor((70 * step) / steps),
        satisfaction: Math.floor((95 * step) / steps),
        revenue: Math.floor((230 * step) / steps)
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: '🎭',
      title: 'AI Persona Cloning',
      description: 'Clone your communication style and let AI handle routine conversations while you focus on high-value interactions.'
    },
    {
      icon: '💬',
      title: 'Multi-Platform Chat',
      description: 'WhatsApp, Instagram, SMS, and more - all conversations in one elegant dashboard with AI-powered responses.'
    },
    {
      icon: '🎤',
      title: 'Voice Notes',
      description: 'Speak naturally and watch AI transcribe, understand context, and respond appropriately across all channels.'
    },
    {
      icon: '📅',
      title: 'Smart Bookings',
      description: 'AI negotiates dates, handles scheduling conflicts, and manages your calendar with luxury-grade precision.'
    },
    {
      icon: '🤝',
      title: 'AI Negotiator',
      description: 'Let AI handle price negotiations, package customization, and client objections with your proven strategies.'
    },
    {
      icon: '🔗',
      title: 'Payment Links',
      description: 'Generate secure payment links instantly. AI sends them at the perfect moment in the conversation flow.'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#FFFFFF'
    }}>
      {/* Hero Section */}
      <section}}}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background elements */}
        <div}}
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%)',
            top: '20%',
            right: '10%'
          }}
        />
        
        <div style={{ textAlign: 'center', maxWidth: '1000px', position: 'relative', zIndex: 1 }}>
          <h1}}}
            style={{
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: '900',
              marginBottom: '30px',
              letterSpacing: '-3px',
              lineHeight: '1.1'
            }}
          >
            AI <span style={{ color: '#D4AF37' }}>LUXE</span>
          </h1>
          
          <p}}}
            style={{
              fontSize: 'clamp(24px, 4vw, 48px)',
              color: '#CCCCCC',
              marginBottom: '20px',
              fontWeight: '300'
            }}
          >
            Time is the Real Luxury
          </p>
          
          <p}}}
            style={{
              fontSize: 'clamp(16px, 2.5vw, 24px)',
              color: '#999999',
              marginBottom: '50px',
              maxWidth: '800px',
              margin: '0 auto 50px'
            }}
          >
            White-label AI concierge that handles your client conversations, bookings, and negotiations while you focus on creating unforgettable luxury experiences.
          </p>
          
          <div}}}
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <a
              href="/sign-up"
              style={{
                background: '#D4AF37',
                color: '#000000',
                padding: 'clamp(14px, 2vw, 18px) clamp(35px, 5vw, 50px)',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                fontWeight: '700',
                display: 'inline-block',
                transition: 'all 0.3s',
                boxShadow: '0 8px 30px rgba(212, 175, 55, 0.3)'
              }}
            >
              Start Free Trial
            </a>
            
            <a
              href="#features"
              style={{
                background: 'transparent',
                color: '#D4AF37',
                border: '2px solid #D4AF37',
                padding: 'clamp(14px, 2vw, 18px) clamp(35px, 5vw, 50px)',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                fontWeight: '700',
                display: 'inline-block',
                transition: 'all 0.3s'
              }}
            >
              See Features
            </a>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section style={{
        padding: 'clamp(60px, 10vw, 120px) 20px',
        background: '#0a0a0a'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2}}}}
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              textAlign: 'center',
              marginBottom: 'clamp(40px, 6vw, 80px)',
              fontWeight: '800'
            }}
          >
            Results That <span style={{ color: '#D4AF37' }}>Matter</span>
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(30px, 4vw, 50px)'
          }}>
            {[
              { value: counts.time, suffix: '%', label: 'Time Saved', color: '#FFD700' },
              { value: counts.satisfaction, suffix: '%', label: 'Client Satisfaction', color: '#10B981' },
              { value: counts.revenue, suffix: '%', label: 'Revenue Increase', color: '#D4AF37' }
            ].map((metric, index) => (
              <div
                key={index}}}}}
                style={{
                  background: 'rgba(212, 175, 55, 0.05)',
                  border: '2px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '16px',
                  padding: 'clamp(30px, 4vw, 50px)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  fontSize: 'clamp(48px, 8vw, 72px)',
                  fontWeight: '900',
                  color: metric.color,
                  marginBottom: '10px'
                }}>
                  {metric.value}{metric.suffix}
                </div>
                <div style={{
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  color: '#999999'
                }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: 'clamp(60px, 10vw, 120px) 20px',
        background: '#000000'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2}}}}
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              textAlign: 'center',
              marginBottom: 'clamp(40px, 6vw, 80px)',
              fontWeight: '800'
            }}
          >
            Core <span style={{ color: '#D4AF37' }}>Features</span>
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(25px, 3vw, 40px)'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}}}}}}
                style={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  border: '2px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '16px',
                  padding: 'clamp(25px, 3vw, 35px)',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{
                  fontSize: 'clamp(40px, 6vw, 56px)',
                  marginBottom: '20px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: 'clamp(20px, 3vw, 24px)',
                  color: '#D4AF37',
                  marginBottom: '15px',
                  fontWeight: '700'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  color: '#999999',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: 'clamp(80px, 12vw, 150px) 20px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
        textAlign: 'center'
      }}>
        <div}}}}
          style={{ maxWidth: '800px', margin: '0 auto' }}
        >
          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 56px)',
            marginBottom: '30px',
            fontWeight: '800'
          }}>
            Ready to Reclaim Your <span style={{ color: '#D4AF37' }}>Time</span>?
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#999999',
            marginBottom: '50px'
          }}>
            Join luxury event professionals who have already automated their client communications.
          </p>
          <a
            href="/sign-up"
            style={{
              background: '#D4AF37',
              color: '#000000',
              padding: 'clamp(16px, 2.5vw, 20px) clamp(40px, 6vw, 60px)',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: 'clamp(18px, 3vw, 22px)',
              fontWeight: '700',
              display: 'inline-block',
              boxShadow: '0 10px 40px rgba(212, 175, 55, 0.4)'
            }}
          >
            Start Your Free Trial
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 20px',
        background: '#000000',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <a href="/terms" style={{ color: '#999999', textDecoration: 'none', fontSize: '14px' }}>Terms</a>
            <a href="/policy" style={{ color: '#999999', textDecoration: 'none', fontSize: '14px' }}>Privacy</a>
            <a href="/sign-in" style={{ color: '#999999', textDecoration: 'none', fontSize: '14px' }}>Sign In</a>
          </div>
          <p style={{ color: '#666666', fontSize: '14px' }}>
            © 2024 AI LUXE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

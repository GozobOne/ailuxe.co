import { Route, Switch } from "wouter";
import { ClerkProvider, SignIn, SignUp, useAuth } from "@clerk/clerk-react";

// Minimal pages
function HomePage() {
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
          fontSize: 'clamp(48px, 8vw, 72px)',
          fontWeight: '900',
          color: '#FFFFFF',
          marginBottom: '20px',
          letterSpacing: '-2px'
        }}>
          AI <span style={{ color: '#D4AF37' }}>LUXE</span>
        </h1>
        
        <p style={{
          fontSize: 'clamp(20px, 4vw, 32px)',
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
          padding: 'clamp(20px, 4vw, 30px)',
          marginBottom: '40px'
        }}>
          <p style={{
            fontSize: 'clamp(16px, 3vw, 20px)',
            color: '#D4AF37',
            marginBottom: '15px',
            fontWeight: '600'
          }}>
            ✅ Site is LIVE!
          </p>
          <p style={{
            fontSize: 'clamp(14px, 2.5vw, 16px)',
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
              padding: 'clamp(12px, 2vw, 16px) clamp(30px, 5vw, 40px)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: 'clamp(16px, 2.5vw, 18px)',
              fontWeight: '600',
              transition: 'all 0.3s',
              display: 'inline-block'
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
              padding: 'clamp(12px, 2vw, 16px) clamp(30px, 5vw, 40px)',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: 'clamp(16px, 2.5vw, 18px)',
              fontWeight: '600',
              transition: 'all 0.3s',
              display: 'inline-block'
            }}
          >
            Get Started
          </a>
        </div>
        
        <p style={{
          fontSize: 'clamp(12px, 2vw, 14px)',
          color: '#666666',
          marginTop: '60px'
        }}>
          © 2024 AI LUXE. All rights reserved.
        </p>
      </div>
    </div>
  );
}

function SignInPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <SignIn 
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}

function SignUpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <SignUp 
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/onboarding"
      />
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          color: '#FFFFFF',
          marginBottom: '20px'
        }}>
          Welcome, {user?.firstName || 'User'}!
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: '#999999',
          marginBottom: '40px'
        }}>
          Your AI LUXE dashboard is being prepared...
        </p>
        
        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '2px solid #D4AF37',
          borderRadius: '12px',
          padding: 'clamp(20px, 3vw, 30px)'
        }}>
          <p style={{ color: '#D4AF37', fontSize: '18px', marginBottom: '10px' }}>
            🎉 Authentication Successful!
          </p>
          <p style={{ color: '#999999', fontSize: '16px' }}>
            Full dashboard features coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

function OnboardingPage() {
  const { user } = useAuth();
  
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 48px)',
          color: '#FFFFFF',
          marginBottom: '20px'
        }}>
          Welcome to AI <span style={{ color: '#D4AF37' }}>LUXE</span>
        </h1>
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 20px)',
          color: '#999999',
          marginBottom: '40px'
        }}>
          Let's get you started, {user?.firstName}!
        </p>
        
        <a 
          href="/dashboard"
          style={{
            background: '#D4AF37',
            color: '#000000',
            padding: '16px 40px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: '600',
            display: 'inline-block'
          }}
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/sign-in" component={SignInPage} />
      <Route path="/sign-up" component={SignUpPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route>
        <div style={{
          minHeight: '100vh',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontSize: '24px'
        }}>
          404 - Page Not Found
        </div>
      </Route>
    </Switch>
  );
}

export default function App() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // If Clerk key is missing, render without authentication
  if (!clerkPubKey) {
    console.warn("Clerk Publishable Key not found. Running without authentication.");
    return <Router />;
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <Router />
    </ClerkProvider>
  );
}

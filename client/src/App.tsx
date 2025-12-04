import { Route, Switch } from "wouter";
import { ClerkProvider, SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import LuxuryHomepage from "./components/LuxuryHomepage";

function HomePage() {
  return <LuxuryHomepage />;
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

import { Route, Switch } from "wouter";
import { ClerkProvider, SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import Navigation from "./components/Navigation";

// Pages
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import PersonaManagement from "./pages/PersonaManagement";
import BotManagement from "./pages/BotManagement";
import ApiSettings from "./pages/ApiSettings";
import TeamManagement from "./pages/TeamManagement";
import WhiteLabelSettings from "./pages/WhiteLabelSettings";
import MessageSearch from "./pages/MessageSearch";
import ConversationView from "./pages/ConversationView";
import BookingsManagement from "./pages/BookingsManagement";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import NotificationSettings from "./pages/NotificationSettings";
import Integrations from "./pages/Integrations";
import Workflows from "./pages/Workflows";
import Templates from "./pages/Templates";
import KnowledgeBase from "./pages/KnowledgeBase";
import Help from "./pages/Help";
import Support from "./pages/Support";
import Demo from "./pages/Demo";
import Playground from "./pages/Playground";
import Tutorial from "./pages/Tutorial";
import GettingStarted from "./pages/GettingStarted";
import AITraining from "./pages/AITraining";
import VoiceSettings from "./pages/VoiceSettings";
import QRCodes from "./pages/QRCodes";
import Pricing from "./pages/Pricing";

// Enhanced pages
import Onboarding from "./pages/Onboarding";
import Terms from "./pages/Terms";
import Policy from "./pages/Policy";
import Dashboard from "./pages/Dashboard";

function HomePage() {
  return <Home />;
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

function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: 'clamp(48px, 10vw, 96px)',
        color: '#D4AF37',
        marginBottom: '20px'
      }}>
        404
      </h1>
      <p style={{
        fontSize: 'clamp(18px, 3vw, 24px)',
        marginBottom: '30px'
      }}>
        Page Not Found
      </p>
      <a 
        href="/"
        style={{
          background: '#D4AF37',
          color: '#000000',
          padding: '12px 30px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        Go Home
      </a>
    </div>
  );
}

function Router() {
  return (
    <>
      <Navigation />
      <Switch>
      {/* Public Pages */}
      <Route path="/" component={HomePage} />
      <Route path="/sign-in" component={SignInPage} />
      <Route path="/sign-up" component={SignUpPage} />
      <Route path="/sign-in/sso-callback" component={SignInPage} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/terms" component={Terms} />
      <Route path="/policy" component={Policy} />
      <Route path="/help" component={Help} />
      <Route path="/support" component={Support} />
      
      {/* User Pages */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/notifications" component={NotificationSettings} />
      
      {/* Admin & Management */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/personas" component={PersonaManagement} />
      <Route path="/bot" component={BotManagement} />
      <Route path="/api-settings" component={ApiSettings} />
      <Route path="/team" component={TeamManagement} />
      <Route path="/white-label" component={WhiteLabelSettings} />
      
      {/* Messaging & Communication */}
      <Route path="/messages" component={MessageSearch} />
      <Route path="/conversations" component={ConversationView} />
      
      {/* Bookings & Events */}
      <Route path="/bookings" component={BookingsManagement} />
      
      {/* Analytics & Insights */}
      <Route path="/analytics" component={AnalyticsDashboard} />
      
      {/* Integrations & Workflows */}
      <Route path="/integrations" component={Integrations} />
      <Route path="/workflows" component={Workflows} />
      <Route path="/templates" component={Templates} />
      
      {/* Knowledge & Learning */}
      <Route path="/knowledge-base" component={KnowledgeBase} />
      <Route path="/tutorial" component={Tutorial} />
      <Route path="/getting-started" component={GettingStarted} />
      
      {/* Demo & Testing */}
      <Route path="/demo" component={Demo} />
      <Route path="/playground" component={Playground} />
      
      {/* Advanced Features */}
      <Route path="/ai-training" component={AITraining} />
      <Route path="/voice-settings" component={VoiceSettings} />
      <Route path="/qr-codes" component={QRCodes} />
      
      {/* 404 */}
      <Route component={NotFoundPage} />
      </Switch>
    </>
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

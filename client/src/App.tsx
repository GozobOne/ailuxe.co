import { Route, Switch } from "wouter";
import { ClerkProvider, SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import { lazy, Suspense } from "react";
import Navigation from "./components/Navigation";

// Lazy load pages to reduce initial bundle size
const Home = lazy(() => import("./pages/Home"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PersonaManagement = lazy(() => import("./pages/PersonaManagement"));
const BotManagement = lazy(() => import("./pages/BotManagement"));
const ApiSettings = lazy(() => import("./pages/ApiSettings"));
const TeamManagement = lazy(() => import("./pages/TeamManagement"));
const WhiteLabelSettings = lazy(() => import("./pages/WhiteLabelSettings"));
const MessageSearch = lazy(() => import("./pages/MessageSearch"));
const Messages = lazy(() => import("./pages/Messages"));
const ConversationView = lazy(() => import("./pages/ConversationView"));
const BookingsManagement = lazy(() => import("./pages/BookingsManagement"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const NotificationSettings = lazy(() => import("./pages/NotificationSettings"));
const Integrations = lazy(() => import("./pages/Integrations"));
const Workflows = lazy(() => import("./pages/Workflows"));
const Templates = lazy(() => import("./pages/Templates"));
const KnowledgeBase = lazy(() => import("./pages/KnowledgeBase"));
const Help = lazy(() => import("./pages/Help"));
const Support = lazy(() => import("./pages/Support"));
const Demo = lazy(() => import("./pages/Demo"));
const Playground = lazy(() => import("./pages/Playground"));
const Tutorial = lazy(() => import("./pages/Tutorial"));
const GettingStarted = lazy(() => import("./pages/GettingStarted"));
const AITraining = lazy(() => import("./pages/AITraining"));
const VoiceSettings = lazy(() => import("./pages/VoiceSettings"));
const QRCodes = lazy(() => import("./pages/QRCodes"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Terms = lazy(() => import("./pages/Terms"));
const Policy = lazy(() => import("./pages/Policy"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Contacts = lazy(() => import("./pages/Contacts"));
const GlobalSearch = lazy(() => import("./pages/GlobalSearch"));
const ROIGuide = lazy(() => import("./pages/ROIGuide"));
const AccountManagement = lazy(() => import("./pages/AccountManagement"));
const TestingDashboard = lazy(() => import("./pages/TestingDashboard"));

// Loading component
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#D4AF37',
      fontSize: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      Loading...
    </div>
  );
}

function HomePage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Home />
    </Suspense>
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
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-black border border-luxury/30",
          },
        }}
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
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-black border border-luxury/30",
          },
        }}
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
  const { isSignedIn } = useAuth();

  return (
    <>
      {isSignedIn && <Navigation />}
      <Suspense fallback={<LoadingScreen />}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/sign-in" component={SignInPage} />
          <Route path="/sign-up" component={SignUpPage} />
          
          {/* Admin & Management */}
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/personas" component={PersonaManagement} />
          <Route path="/bot" component={BotManagement} />
          <Route path="/team" component={TeamManagement} />
          
          {/* Configuration */}
          <Route path="/api-settings" component={ApiSettings} />
          <Route path="/white-label" component={WhiteLabelSettings} />
          <Route path="/settings" component={Settings} />
          <Route path="/profile" component={Profile} />
          <Route path="/notifications" component={NotificationSettings} />
          <Route path="/voice-settings" component={VoiceSettings} />
          
          {/* Communication */}
          <Route path="/messages" component={Messages} />
          <Route path="/messages/search" component={MessageSearch} />
          <Route path="/conversation/:id" component={ConversationView} />
          <Route path="/contacts" component={Contacts} />
          
          {/* Business Tools */}
          <Route path="/bookings" component={BookingsManagement} />
          <Route path="/analytics" component={AnalyticsDashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/search" component={GlobalSearch} />
          <Route path="/roi-guide" component={ROIGuide} />
          <Route path="/account" component={AccountManagement} />
          <Route path="/test" component={TestingDashboard} />
          
          {/* Integration & Automation */}
          <Route path="/integrations" component={Integrations} />
          <Route path="/workflows" component={Workflows} />
          <Route path="/templates" component={Templates} />
          <Route path="/ai-training" component={AITraining} />
          
          {/* Resources */}
          <Route path="/knowledge-base" component={KnowledgeBase} />
          <Route path="/help" component={Help} />
          <Route path="/support" component={Support} />
          <Route path="/tutorial" component={Tutorial} />
          <Route path="/getting-started" component={GettingStarted} />
          
          {/* Marketing */}
          <Route path="/demo" component={Demo} />
          <Route path="/playground" component={Playground} />
          <Route path="/qr-codes" component={QRCodes} />
          <Route path="/pricing" component={Pricing} />
          
          {/* Legal & Onboarding */}
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/terms" component={Terms} />
          <Route path="/policy" component={Policy} />
          
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>
    </>
  );
}

export default function App() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

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

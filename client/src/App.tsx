import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Settings from "@/pages/Settings";
import AccountManagement from "@/pages/AccountManagement";
import { Route, Switch } from "wouter";
import { ClerkProvider } from "@clerk/clerk-react";

// Cache busting version
const APP_VERSION = "v1000";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import FeaturesPage from "./pages/FeaturesPage";
import PersonaManagement from "./pages/PersonaManagement";
import BotManagement from "./pages/BotManagement";
import BookingsManagement from "./pages/BookingsManagement";
import AdminDashboard from "./pages/AdminDashboard";
import TestingDashboard from "./pages/TestingDashboard";
import LiveMonitoringPage from "./pages/LiveMonitoringPage";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import InstagramSetup from "./pages/InstagramSetup";
import ServiceStatus from "./pages/ServiceStatus";
import SetupGuide from "./pages/SetupGuide";
import Welcome from "./pages/Welcome";
import RoiGuide from "./pages/RoiGuide";
import ApiSettings from "./pages/ApiSettings";
import BaileysConnect from "./pages/BaileysConnect";
import BillingAdmin from "./pages/BillingAdmin";
import WhiteLabelSettings from "./pages/WhiteLabelSettings";
import Contacts from "./pages/Contacts";
import MessageSearch from "./pages/MessageSearch";
import AnalyticsDashboardNew from "./pages/AnalyticsDashboardNew";
import UserGuide from "./pages/UserGuide";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import TermsOfService from "./pages/Terms";
import PrivacyPolicy from "./pages/Policy";
import HomeLuxury from "./pages/HomeLuxury";
import HomeLuxuryTest from "./pages/HomeLuxuryTest";
import SimpleTest from "./pages/SimpleTest";
import Onboarding from "./pages/Onboarding";
import TeamManagement from "./pages/TeamManagement";

function Router() {
  return (
    <Switch>
      <Route path={"/sign-in"} component={SignInPage} />
      <Route path={"/sign-up"} component={SignUpPage} />
      <Route path={"/"} component={SimpleTest} />
      <Route path={"/test"} component={HomeLuxuryTest} />
      <Route path={"/home-luxury"} component={HomeLuxury} />
      <Route path={"/home-old"} component={Home} />
      <Route path={"/onboarding"} component={Onboarding} />
      <Route path={"/settings/team"} component={TeamManagement} />
      <Route path={"/features"} component={FeaturesPage} />
      <Route path="/persona" component={PersonaManagement} />
      <Route path="/bot" component={BotManagement} />
      <Route path="/bookings" component={BookingsManagement} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/api-settings" component={ApiSettings} />
      <Route path="/baileys-connect" component={BaileysConnect} />
      <Route path="/admin/billing" component={BillingAdmin} />
      <Route path="/admin/white-label" component={WhiteLabelSettings} />
      <Route path="/admin/user-guide" component={UserGuide} />
      <Route path="/contacts" component={Contacts} />
      <Route path="/messages/search" component={MessageSearch} />
      <Route path="/analytics" component={AnalyticsDashboardNew} />
      <Route path="/test" component={TestingDashboard} />
      <Route path="/live" component={LiveMonitoringPage} />
      <Route path="/instagram-setup" component={InstagramSetup} />
      <Route path="/services" component={ServiceStatus} />
      <Route path="/setup-guide" component={SetupGuide} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/roi-guide" component={RoiGuide} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/account"} component={AccountManagement} />
      <Route path={"/terms"} component={TermsOfService} />
      <Route path={"/policy"} component={PrivacyPolicy} />
      <Route path={"/404"} component={NotFound} />      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // If Clerk key is missing, render without ClerkProvider
  if (!clerkPubKey) {
    console.warn("Clerk Publishable Key not found. Authentication features will be disabled.");
    return (
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </ClerkProvider>
  );
}

export default App;

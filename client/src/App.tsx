import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import Dashboard from "@/pages/dashboard";
import Explore from "@/pages/explore";
import Investments from "@/pages/investments";
import Messages from "@/pages/messages";
import Events from "@/pages/events";
import Voting from "@/pages/voting";
import Settings from "@/pages/settings";
import LandingPageAnimated from "@/pages/landing-page-animated";
import SubmitIdea from "@/pages/submit-idea";
import InvestorDashboard from "@/pages/investor-dashboard";
import CommunityPage from "@/pages/community-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { ThemeProvider } from "./components/theme-provider";
import { OnboardingProvider } from "./context/onboarding-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRedirect} />
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/explore" component={Explore} />
      <ProtectedRoute path="/investments" component={Investments} />
      <ProtectedRoute path="/messages" component={Messages} />
      <ProtectedRoute path="/events" component={Events} />
      <ProtectedRoute path="/voting" component={Voting} />
      <ProtectedRoute path="/settings" component={Settings} />
      <ProtectedRoute path="/submit-idea" component={SubmitIdea} />
      <ProtectedRoute path="/investor" component={InvestorDashboard} />
      <ProtectedRoute path="/community" component={CommunityPage} />
      <Route path="/landing" component={LandingPageAnimated} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Route to handle redirection based on authentication status
function HomeRedirect() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    // If user is logged in, redirect to dashboard
    window.location.href = "/dashboard";
    return null;
  } else {
    // If user is not logged in, redirect to landing page
    window.location.href = "/landing";
    return null;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="startupmatch-theme">
        <AuthProvider>
          <OnboardingProvider>
            <Router />
            <Toaster />
          </OnboardingProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

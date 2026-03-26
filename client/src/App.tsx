import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ChatProvider } from "./contexts/ChatContext";
import { UserProvider, useUser } from "./contexts/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import { useState } from "react";

function Router() {

  const { isAuthenticated, login } = useUser();
  const [verifyData, setVerifyData] = useState<{
    phone: string;
    sessionId: string;
  } | null>(null);

  const handlePhoneSubmit = (phone: string, sessionId: string) => {
    setVerifyData({ phone, sessionId });
  };

  const handleVerifySuccess = (token: string, phone: string) => {
    login(phone, token);
    setVerifyData(null);
  };

  const handleBackToLogin = () => {
    setVerifyData(null);
  };

  // Show verify page if we have verify data
  if (verifyData) {
    return (
      <Verify
        phone={verifyData.phone}
        sessionId={verifyData.sessionId}
        onVerifySuccess={handleVerifySuccess}
        onBack={handleBackToLogin}
      />
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onPhoneSubmit={handlePhoneSubmit} />;
  }

  // Show main app if authenticated
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <UserProvider>
          <ChatProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ChatProvider>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

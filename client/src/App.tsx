import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth-store";

function Router() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, checkAuth } = useAuthStore();

  // Check auth status when component mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect based on authentication status
  useEffect(() => {
    // Redirect to login if not authenticated and trying to access protected routes
    if (!isAuthenticated && location === "/") {
      setLocation("/login");
    }
    
    // Redirect to home if authenticated and trying to access auth routes
    if (isAuthenticated && (location === "/login" || location === "/register")) {
      setLocation("/");
    }
  }, [isAuthenticated, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <Router />
      <Toaster />
    </div>
  );
}

export default App;

import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";

// Web app pages
import Dashboard from "@/pages/Dashboard";
import AICompanionChat from "@/pages/AICompanionChat";
import SCCSPage from "@/pages/SCCSPage";
import NotFound from "@/pages/not-found";

// Mobile app pages
import MobileApp from "@/pages/mobile";

// Simple detector to check if the device is likely mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = [
        'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'
      ];
      
      // Check for mobile keywords in user agent
      const isMobileDevice = mobileKeywords.some(keyword => 
        userAgent.includes(keyword)
      );
      
      // Also check viewport width
      const isSmallScreen = window.innerWidth < 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return isMobile;
}

function Router() {
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();
  
  // Redirect based on device type on initial load
  useEffect(() => {
    if (location === "/") {
      if (isMobile) {
        setLocation("/mobile");
      }
      // Otherwise stay on the dashboard
    }
  }, [isMobile, location, setLocation]);
  
  return (
    <Switch>
      {/* Web routes */}
      <Route path="/" component={Dashboard} />
      <Route path="/ai-companion" component={AICompanionChat} />
      <Route path="/sccs" component={SCCSPage} />
      
      {/* Mobile app routes */}
      <Route path="/mobile/:rest*" component={MobileApp} />
      
      {/* Switch between platforms */}
      <Route path="/web">
        {() => {
          setLocation("/");
          return null;
        }}
      </Route>
      
      {/* Fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

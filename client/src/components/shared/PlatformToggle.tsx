import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor } from "lucide-react";

export default function PlatformToggle() {
  const [location, setLocation] = useLocation();
  
  const isMobileView = location.startsWith("/mobile");
  
  const handleToggle = () => {
    if (isMobileView) {
      // Switch to web view
      setLocation("/");
    } else {
      // Switch to mobile view
      setLocation("/mobile");
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="flex items-center gap-2"
    >
      {isMobileView ? (
        <>
          <Monitor className="h-4 w-4" />
          <span className="hidden sm:inline">Switch to Web View</span>
          <span className="sm:hidden">Web</span>
        </>
      ) : (
        <>
          <Smartphone className="h-4 w-4" />
          <span className="hidden sm:inline">Switch to Mobile View</span>
          <span className="sm:hidden">Mobile</span>
        </>
      )}
    </Button>
  );
}
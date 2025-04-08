import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PlatformToggle() {
  const [location, setLocation] = useLocation();
  
  // Determine if we're in the mobile view
  const isMobileView = location.startsWith("/mobile");
  
  const handleToggle = () => {
    if (isMobileView) {
      // Switch to desktop view - convert "/mobile/..." paths to "/dashboard/..."
      const desktopPath = location.replace("/mobile", "/dashboard");
      setLocation(desktopPath);
    } else {
      // Switch to mobile view - convert other paths to "/mobile/..."
      const parts = location.split("/").filter(Boolean);
      
      // For the home page or empty path
      if (parts.length === 0) {
        setLocation("/mobile");
        return;
      }
      
      // For other paths
      setLocation("/mobile");
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white hover:text-white/80"
        >
          {isMobileView ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleToggle}>
          {isMobileView ? (
            <>
              <Monitor className="mr-2 h-4 w-4" />
              <span>Switch to Desktop</span>
            </>
          ) : (
            <>
              <Smartphone className="mr-2 h-4 w-4" />
              <span>Switch to Mobile</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
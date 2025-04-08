import React from "react";
import MobileNavigation from "./MobileNavigation";
import { Bell, ChevronLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PlatformToggle from "../shared/PlatformToggle";

interface MobileLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  showNotifications?: boolean;
  unreadNotifications?: number;
}

export default function MobileLayout({
  children,
  headerTitle = "SAINTE",
  showBackButton = false,
  backUrl = "/mobile",
  showNotifications = true,
  unreadNotifications = 0
}: MobileLayoutProps) {
  const [location] = useLocation();

  // Skip navigation on login and register pages
  const hideNavigation = ["/login", "/register"].includes(location);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-10">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-white hover:text-white/80"
                asChild
              >
                <Link href={backUrl}>
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <h1 className="text-lg font-semibold">{headerTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            {showNotifications && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 relative"
                asChild
              >
                <Link href="/mobile/notifications">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-red-500"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}
            
            <PlatformToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      {/* Bottom navigation */}
      {!hideNavigation && <MobileNavigation />}
    </div>
  );
}
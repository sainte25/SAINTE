import React from "react";
import MobileNavigation from "./MobileNavigation";
import { Bell, ChevronLeft, MoreVertical } from "lucide-react";
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
  showMore?: boolean;
}

export default function MobileLayout({
  children,
  headerTitle = "SAINTE",
  showBackButton = false,
  backUrl = "/mobile",
  showNotifications = true,
  unreadNotifications = 0,
  showMore = true
}: MobileLayoutProps) {
  const [location] = useLocation();

  // Skip navigation on login and register pages
  const hideNavigation = ["/login", "/register"].includes(location);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Status Bar - Static representation of phone status */}
      <div className="p-1 px-5 flex justify-between items-center bg-black text-white text-xs">
        <div>9:41</div>
        <div className="flex items-center space-x-1">
          <span>•••</span>
          <span>Wi-Fi</span>
          <span>100%</span>
        </div>
      </div>
      
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            {showBackButton && (
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 text-white hover:text-white/80 rounded-full"
                asChild
              >
                <Link href={backUrl}>
                  <ChevronLeft className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <h1 className="text-lg font-semibold text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]">{headerTitle}</h1>
          </div>
          <div className="flex items-center gap-2">
            {showNotifications && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 relative rounded-full"
                asChild
              >
                <Link href="/mobile/notifications">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-blue-500"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}
            
            {showMore && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white/80 rounded-full"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content - no padding bottom since we handle that in the nav */}
      <main className="flex-1">{children}</main>

      {/* Bottom navigation */}
      {!hideNavigation && <MobileNavigation />}
    </div>
  );
}

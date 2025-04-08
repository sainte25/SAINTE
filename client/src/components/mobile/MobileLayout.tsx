import React, { ReactNode } from "react";
import MobileNavigation from "./MobileNavigation";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import PlatformToggle from "@/components/shared/PlatformToggle";

interface MobileLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  headerTitle?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function MobileLayout({
  children,
  showNav = true,
  headerTitle,
  showBackButton = false,
  onBack,
}: MobileLayoutProps) {
  const { data: userData } = useQuery<User>({
    queryKey: ['/api/users/current'],
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      {headerTitle && (
        <header className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between py-4 px-4">
            {showBackButton && (
              <button
                onClick={onBack}
                className="p-1 rounded-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
            )}
            <h1 className="text-lg font-bold flex-1 text-center">{headerTitle}</h1>
            {userData && (
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                {userData.firstName?.[0]}{userData.lastName?.[0]}
              </div>
            )}
          </div>
          
          {/* Platform toggle */}
          <div className="flex justify-end px-4 pb-2">
            <PlatformToggle />
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Navigation */}
      {showNav && <MobileNavigation />}
    </div>
  );
}
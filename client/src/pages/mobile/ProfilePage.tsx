import React from "react";
import { useQuery } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Medal,
  LogOut,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  FileBadge,
  BookOpen
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { User as UserType, SccsScore } from "@shared/schema";

export default function ProfilePage() {
  // Get user data
  const { data: userData, isLoading: userLoading } = useQuery<UserType>({
    queryKey: ['/api/users/current'],
    refetchOnWindowFocus: false,
  });
  
  // Get SCCS score data
  const { data: sccsData, isLoading: sccsLoading } = useQuery<SccsScore>({
    queryKey: ['/api/sccs/current'],
    refetchOnWindowFocus: false,
  });
  
  const getNameInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };
  
  const getFullName = (firstName: string, lastName: string) => {
    return `${firstName} ${lastName}`;
  };
  
  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'bronze':
        return 'bg-amber-800';
      case 'silver':
        return 'bg-gray-400';
      case 'gold':
        return 'bg-amber-400';
      case 'platinum':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const getTierProgress = (score: number) => {
    // This is a simplified version; in real app would be more complex
    if (!score) return 0;
    return Math.min(100, Math.max(0, (score / 100) * 100));
  };
  
  return (
    <MobileLayout headerTitle="Profile" showBackButton>
      <div className="p-4 space-y-5">
        {/* Profile header */}
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-6 pb-4">
            <div className="flex items-center">
              <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarFallback className="bg-primary text-white text-lg">
                  {userLoading ? '...' : userData?.avatarInitials || 'US'}
                </AvatarFallback>
              </Avatar>
              
              <div className="ml-4">
                <h2 className="text-xl font-semibold">
                  {userLoading ? 'Loading...' : getFullName(userData?.firstName || '', userData?.lastName || '')}
                </h2>
                <div className="flex items-center mt-1">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    userLoading ? 'bg-gray-300' : getTierColor(userData?.tier || 'bronze')
                  }`} />
                  <span className="text-sm capitalize">
                    {userLoading ? 'Loading...' : userData?.tier || 'Bronze'} Tier
                  </span>
                </div>
                
                {sccsData && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>SCCS Score</span>
                      <span className="font-medium">{sccsData.score}</span>
                    </div>
                    <Progress value={getTierProgress(sccsData.score)} className="h-2" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* My Journey */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Medal className="mr-2 h-5 w-5 text-primary" />
              My Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <ProfileLink 
                icon={<FileBadge className="h-5 w-5 text-indigo-500" />}
                label="My Achievements"
                href="/mobile/achievements"
              />
              <ProfileLink 
                icon={<Bell className="h-5 w-5 text-orange-500" />}
                label="My Events"
                href="/mobile/events"
              />
              <ProfileLink 
                icon={<BookOpen className="h-5 w-5 text-green-500" />}
                label="My Assessment History"
                href="/mobile/assessments"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Settings */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <ProfileLink 
                icon={<User className="h-5 w-5 text-gray-600" />}
                label="Edit Profile"
                href="/mobile/edit-profile"
              />
              <ProfileLink 
                icon={<Bell className="h-5 w-5 text-gray-600" />}
                label="Notification Preferences"
                href="/mobile/notification-settings"
              />
              <ProfileLink 
                icon={<Shield className="h-5 w-5 text-gray-600" />}
                label="Privacy Settings"
                href="/mobile/privacy-settings"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Support */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-primary" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <ProfileLink 
                icon={<HelpCircle className="h-5 w-5 text-gray-600" />}
                label="Help & FAQ"
                href="/mobile/help"
              />
              <ProfileLink 
                icon={<User className="h-5 w-5 text-gray-600" />}
                label="Contact Support"
                href="/mobile/contact-support"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Logout button */}
        <Button 
          variant="outline" 
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
        
        <div className="text-center text-xs text-gray-500 py-2">
          <p>SAINTE Platform</p>
          <p>Version 1.0.0</p>
        </div>
      </div>
    </MobileLayout>
  );
}

interface ProfileLinkProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
}

function ProfileLink({ icon, label, href, badge }: ProfileLinkProps) {
  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start h-auto py-2 font-normal"
      asChild
    >
      <a href={href}>
        <span className="flex items-center flex-1">
          <span className="mr-3">{icon}</span>
          {label}
          {badge && (
            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </a>
    </Button>
  );
}
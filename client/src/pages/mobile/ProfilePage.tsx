import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  User2, 
  Users, 
  LogOut, 
  ChevronRight, 
  Award, 
  BadgeCheck
} from "lucide-react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Get current user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['/api/users/current'],
    refetchOnWindowFocus: false,
  });

  // Get SCCS score
  const { data: sccsScore, isLoading: sccsLoading } = useQuery({
    queryKey: ['/api/sccs/current'],
    refetchOnWindowFocus: false,
  });

  return (
    <MobileLayout headerTitle="Profile & Settings">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
            {userLoading ? "..." : `${userData?.firstName?.[0] || ""}${userData?.lastName?.[0] || ""}`}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {userLoading ? "Loading..." : `${userData?.firstName || ""} ${userData?.lastName || ""}`}
            </h2>
            <div className="flex items-center space-x-1 mt-1">
              <div className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                <Award className="w-3 h-3 mr-1" />
                {userData?.tier || "Bronze"} Tier
              </div>
              {!sccsLoading && sccsScore && (
                <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium flex items-center">
                  <BadgeCheck className="w-3 h-3 mr-1" />
                  SCCS: {sccsScore.score}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  <ProfileItem 
                    icon={User2} 
                    title="Personal Information" 
                    subtitle="Name, contact details, and account info" 
                  />
                  <ProfileItem 
                    icon={Users} 
                    title="My Care Team" 
                    subtitle="View your support network" 
                  />
                  <ProfileItem 
                    icon={Award} 
                    title="Achievements" 
                    subtitle="View your badges and progress" 
                  />
                </ul>
              </CardContent>
            </Card>
            
            <Button variant="destructive" className="w-full flex items-center justify-center">
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-4 space-y-4">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  <NotificationItem 
                    title="Push Notifications"
                    subtitle="Receive alerts on your phone"
                    defaultChecked={true}
                  />
                  <NotificationItem 
                    title="Daily Reminders"
                    subtitle="Reminders for daily steps"
                    defaultChecked={true}
                  />
                  <NotificationItem 
                    title="Care Team Messages"
                    subtitle="Notifications for new messages"
                    defaultChecked={true}
                  />
                  <NotificationItem 
                    title="Goal Updates"
                    subtitle="Updates about your goals"
                    defaultChecked={false}
                  />
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Privacy Tab */}
          <TabsContent value="privacy" className="mt-4 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 flex items-center">
                <Shield className="w-4 h-4 mr-2" /> Data Privacy
              </h3>
              <p className="text-sm text-blue-600 mt-1">
                You control your data. Adjust who can see your information below.
              </p>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y">
                  <NotificationItem 
                    title="Share Goals with Care Team"
                    subtitle="Let your care team see your goals"
                    defaultChecked={true}
                  />
                  <NotificationItem 
                    title="Share Mood Logs"
                    subtitle="Let your care team see your mood history"
                    defaultChecked={true}
                  />
                  <NotificationItem 
                    title="Anonymous Leaderboard"
                    subtitle="Appear on the SCCS leaderboard"
                    defaultChecked={false}
                  />
                  <NotificationItem 
                    title="Data Analytics"
                    subtitle="Help improve the platform with anonymous data"
                    defaultChecked={true}
                  />
                </ul>
              </CardContent>
            </Card>
            
            <div className="mt-4">
              <Button variant="outline" className="w-full">Download My Data</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}

interface ProfileItemProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}

function ProfileItem({ icon: Icon, title, subtitle }: ProfileItemProps) {
  return (
    <li className="py-3 px-4">
      <button className="flex items-center justify-between w-full text-left">
        <div className="flex items-center">
          <div className="rounded-full bg-primary/10 p-2 mr-3">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium">{title}</h3>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>
    </li>
  );
}

interface NotificationItemProps {
  title: string;
  subtitle: string;
  defaultChecked: boolean;
}

function NotificationItem({ title, subtitle, defaultChecked }: NotificationItemProps) {
  const [enabled, setEnabled] = useState(defaultChecked);
  
  return (
    <li className="py-3 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
        <Switch 
          checked={enabled} 
          onCheckedChange={setEnabled} 
        />
      </div>
    </li>
  );
}
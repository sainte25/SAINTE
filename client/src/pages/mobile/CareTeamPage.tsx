import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CareTeamMember } from "@shared/schema";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Calendar, 
  Clock,
  Star
} from "lucide-react";

export default function CareTeamPage() {
  // Get care team members
  const { data: careTeam, isLoading } = useQuery<CareTeamMember[]>({
    queryKey: ['/api/care-team'],
    refetchOnWindowFocus: false,
  });
  
  const getRoleIcon = (role: string) => {
    switch(role) {
      case "peer_mentor":
        return <Star className="h-5 w-5 text-green-500" />;
      case "case_manager":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "primary_care_provider":
        return <Clock className="h-5 w-5 text-red-500" />;
      case "community_health_worker":
        return <Star className="h-5 w-5 text-amber-500" />;
      default:
        return <Star className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getRoleName = (role: string) => {
    switch(role) {
      case "peer_mentor":
        return "Peer Mentor";
      case "case_manager":
        return "Case Manager";
      case "primary_care_provider":
        return "Primary Care Provider";
      case "community_health_worker":
        return "Community Health Worker";
      default:
        return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };
  
  const getRoleBg = (role: string) => {
    switch(role) {
      case "peer_mentor":
        return "bg-green-50 border-green-100";
      case "case_manager":
        return "bg-purple-50 border-purple-100";
      case "primary_care_provider":
        return "bg-red-50 border-red-100";
      case "community_health_worker":
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };
  
  // Group team members by role
  const teamByRole = careTeam?.reduce((acc, member) => {
    const role = member.teamMemberRole;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {} as Record<string, CareTeamMember[]>) || {};
  
  return (
    <MobileLayout headerTitle="Care Team" showBackButton>
      <div className="p-4 space-y-5">
        {/* Care team overview */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium mb-4">Your Support Network</h3>
            
            {isLoading ? (
              <div className="text-center py-6">
                <div className="text-sm text-gray-500">Loading your care team...</div>
              </div>
            ) : careTeam && careTeam.length > 0 ? (
              <div className="relative h-48 mb-6">
                {/* Center circle - User */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                    <div className="text-center">
                      <div className="text-xs uppercase font-semibold">You</div>
                    </div>
                  </div>
                </div>
                
                {/* Team members in a circle */}
                {careTeam.slice(0, 6).map((member, index) => {
                  const angle = (index * (360 / Math.min(careTeam.length, 6))) * (Math.PI / 180);
                  const radius = 80; // Distance from center
                  const left = Math.cos(angle) * radius + 50;
                  const top = Math.sin(angle) * radius + 50;
                  
                  // Determine background color based on role
                  let bgColor = "bg-blue-500";
                  if (member.teamMemberRole === "peer_mentor") bgColor = "bg-green-500";
                  if (member.teamMemberRole === "case_manager") bgColor = "bg-purple-500";
                  if (member.teamMemberRole === "primary_care_provider") bgColor = "bg-red-500";
                  if (member.teamMemberRole === "community_health_worker") bgColor = "bg-amber-500";
                  
                  return (
                    <div 
                      key={member.id} 
                      className="absolute w-14 h-14 transform -translate-x-1/2 -translate-y-1/2"
                      style={{ 
                        left: `${left}%`, 
                        top: `${top}%`,
                      }}
                    >
                      <div className={`w-full h-full rounded-full ${bgColor} flex items-center justify-center text-white shadow-md`}>
                        {member.teamMemberInitials}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                        <div className="text-xs font-medium">{member.teamMemberName.split(' ')[0]}</div>
                        <div className="text-[10px] text-gray-500">{
                          getRoleName(member.teamMemberRole).split(' ')[0]
                        }</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No care team members assigned yet.</p>
                <p className="text-sm mt-2">Your support network will appear here once assigned.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Care team tabs by role */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full flex overflow-x-auto">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            {Object.keys(teamByRole).map(role => (
              <TabsTrigger 
                key={role} 
                value={role}
                className="flex-1"
              >
                {getRoleName(role).split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="space-y-3">
              {careTeam && careTeam.length > 0 ? (
                careTeam.map(member => (
                  <TeamMemberCard 
                    key={member.id}
                    member={member}
                    roleIcon={getRoleIcon(member.teamMemberRole)}
                    roleName={getRoleName(member.teamMemberRole)}
                    bgClass={getRoleBg(member.teamMemberRole)}
                  />
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No team members to display
                </div>
              )}
            </div>
          </TabsContent>
          
          {Object.entries(teamByRole).map(([role, members]) => (
            <TabsContent key={role} value={role} className="mt-4">
              <div className="space-y-3">
                {members.map(member => (
                  <TeamMemberCard 
                    key={member.id}
                    member={member}
                    roleIcon={getRoleIcon(member.teamMemberRole)}
                    roleName={getRoleName(member.teamMemberRole)}
                    bgClass={getRoleBg(member.teamMemberRole)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Info card */}
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-4">
            <h3 className="text-md font-medium text-primary/90 mb-2">
              About Your Care Team
            </h3>
            <p className="text-sm text-primary/80">
              Your care team provides coordinated support to help you achieve your wellness goals. 
              Each team member brings specialized expertise, and they work together to provide 
              personalized care based on your unique needs.
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}

interface TeamMemberCardProps {
  member: CareTeamMember;
  roleIcon: React.ReactNode;
  roleName: string;
  bgClass: string;
}

function TeamMemberCard({ member, roleIcon, roleName, bgClass }: TeamMemberCardProps) {
  return (
    <Card className={bgClass}>
      <CardContent className="p-4">
        <div className="flex items-start">
          <div className="w-12 h-12 rounded-full bg-white border flex items-center justify-center mr-3">
            <div className="text-lg font-medium text-gray-700">
              {member.teamMemberInitials}
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium">{member.teamMemberName}</h4>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              {roleIcon}
              <span className="ml-1">{roleName}</span>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {member.contactPhone && (
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="text-xs">Call</span>
                </Button>
              )}
              
              {member.contactEmail && (
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="text-xs">Email</span>
                </Button>
              )}
              
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="text-xs">Message</span>
              </Button>
              
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">Schedule</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
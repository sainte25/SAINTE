import React from "react";
import { useQuery } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { ChevronRight, Calendar } from "lucide-react";
import { CareTeamMember } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

// Sample data to match the design, we'll keep as fallback
const sampleCareTeam = [
  {
    id: 1,
    teamMemberName: "Dr. Sarah",
    teamMemberRole: "Primary Care Provider",
    teamMemberInitials: "DS",
    avatarColor: "purple",
    isAvailable: true
  },
  {
    id: 2,
    teamMemberName: "Therapist John",
    teamMemberRole: "Behavioral Health",
    teamMemberInitials: "TJ",
    avatarColor: "green",
    isAvailable: true
  },
  {
    id: 3,
    teamMemberName: "Nurse Michael",
    teamMemberRole: "Healthcare Provider",
    teamMemberInitials: "NM",
    avatarColor: "yellow",
    isAvailable: false
  },
  {
    id: 4,
    teamMemberName: "Specialist Lisa",
    teamMemberRole: "Case Manager",
    teamMemberInitials: "SL",
    avatarColor: "pink",
    isAvailable: true
  },
  {
    id: 5,
    teamMemberName: "Coach David",
    teamMemberRole: "Wellness Coach",
    teamMemberInitials: "CD",
    avatarColor: "blue",
    isAvailable: true
  }
];

const sampleAppointments = [
  {
    id: 1,
    memberName: "Dr. Sarah",
    date: "Tomorrow",
    time: "10:00 AM",
    avatarColor: "purple"
  },
  {
    id: 2,
    memberName: "Therapist John",
    date: "Friday",
    time: "2:30 PM", 
    avatarColor: "green"
  }
];

export default function CareTeamPage() {
  // Fetch care team data
  const { data: apiCareTeam, isLoading } = useQuery<CareTeamMember[]>({
    queryKey: ['/api/care-team'],
  });
  
  // Use api data if available, otherwise use sample data
  const careTeam = apiCareTeam && apiCareTeam.length > 0 ? apiCareTeam.map((member, index) => ({
    ...member,
    avatarColor: ["purple", "green", "yellow", "pink", "blue"][index % 5]
  })) : sampleCareTeam;

  return (
    <MobileLayout headerTitle="Care Team" showBackButton={true}>
      <div className="bg-black min-h-screen text-white">
        {/* Team Members Grid */}
        <div className="grid grid-cols-3 gap-2 px-4 py-6">
          {careTeam.map((member) => (
            <div key={member.id} className="flex flex-col items-center">
              <div className={`avatar-circle avatar-glow-${member.avatarColor} mb-2`}>
                <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center overflow-hidden border-2 border-white/20">
                  <span className="text-xl font-medium">{member.teamMemberInitials}</span>
                </div>
              </div>
              <span className="text-center text-sm font-medium">{member.teamMemberName}</span>
            </div>
          ))}
        </div>
        
        {/* Upcoming Appointments */}
        <div className="mt-4 px-4">
          <div className="apple-card mb-4">
            <h2 className="text-lg font-semibold mb-3">Upcoming Appointments</h2>
            
            <div className="space-y-2">
              {sampleAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="apple-card flex items-center p-3 bg-black/40"
                >
                  <div className={`avatar-circle avatar-glow-${appointment.avatarColor} shrink-0`}>
                    <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center border border-white/10">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="font-medium">{appointment.memberName}</div>
                    <div className="text-sm text-gray-400">{appointment.date}, {appointment.time}</div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
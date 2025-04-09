import React from "react";
import { useQuery } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Star } from "lucide-react";
import { CareTeamMember } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function CareTeamPage() {
  // Fetch care team data
  const { data: careTeam, isLoading } = useQuery<CareTeamMember[]>({
    queryKey: ['/api/care-team'],
  });

  return (
    <MobileLayout headerTitle="Care Team" showBackButton={true}>
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Support Network</h2>
        </div>

        {isLoading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border-none">
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="ml-4 flex-1">
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : careTeam && careTeam.length > 0 ? (
          <div className="space-y-4">
            {careTeam.map((member) => (
              <Card 
                key={member.id} 
                className="bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border-none hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-0">
                  <div className="flex items-center p-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                        {member.teamMemberInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                        {member.teamMemberName}
                        {member.teamMemberRole === 'Primary Care Provider' && (
                          <span className="ml-2 inline-flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{member.teamMemberRole}</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Available now
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                        <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No care team members assigned yet.</p>
          </div>
        )}

        <div className="mt-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 border border-primary-100 dark:border-primary-800">
          <h3 className="text-md font-medium text-primary-800 dark:text-primary-300 mb-2">
            Need immediate support?
          </h3>
          <p className="text-sm text-primary-700 dark:text-primary-400 mb-3">
            Our support team is available 24/7 for urgent needs.
          </p>
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-white" 
            size="lg"
          >
            Request Emergency Support
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
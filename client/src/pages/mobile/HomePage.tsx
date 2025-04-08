import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  BarChart, 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  Award, 
  SmilePlus,
  Info
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { User, SccsScore, AiInsight, Event, Mood } from "@shared/schema";

export default function HomePage() {
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  
  // Get current user data
  const { data: userData, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/users/current'],
    refetchOnWindowFocus: false,
  });
  
  // Get SCCS score
  const { data: sccsScore, isLoading: sccsLoading } = useQuery<SccsScore>({
    queryKey: ['/api/sccs/current'],
    refetchOnWindowFocus: false,
  });
  
  // Get upcoming events
  const { data: upcomingEvents, isLoading: eventsLoading } = useQuery<Event[]>({
    queryKey: ['/api/events/upcoming'],
    refetchOnWindowFocus: false,
  });
  
  // Get AI insights
  const { data: aiInsight, isLoading: insightLoading } = useQuery<AiInsight>({
    queryKey: ['/api/ai/insights'],
    refetchOnWindowFocus: false,
  });
  
  // Get recent moods
  const { data: recentMoods, isLoading: moodsLoading } = useQuery<Mood[]>({
    queryKey: ['/api/moods/recent'],
    refetchOnWindowFocus: false,
  });
  
  return (
    <MobileLayout headerTitle="SAINTE">
      <div className="p-4 space-y-5">
        {/* Welcome/greeting card */}
        {showWelcomeCard && (
          <Card className="bg-gradient-to-br from-primary/90 to-primary text-white">
            <CardContent className="pt-4">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold">
                  Good Morning, {userLoading ? "..." : userData?.firstName}
                </h2>
                <button 
                  onClick={() => setShowWelcomeCard(false)}
                  className="text-white/80 hover:text-white"
                >
                  <Info className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <div className="text-white/90">SCCS Score:</div>
                  <div className="font-semibold">{sccsLoading ? "..." : sccsScore?.score}</div>
                </div>
                <Progress 
                  value={sccsLoading ? 0 : (sccsScore?.score || 0) * 10} 
                  className="h-2 mt-1 bg-white/30" 
                />
                <div className="mt-3 text-sm bg-white/20 p-2 rounded-lg">
                  {userData?.tier === "Bronze" && "You're making good progress. Keep up your daily steps!"}
                  {userData?.tier === "Silver" && "You're consistently building social capital!"}
                  {userData?.tier === "Gold" && "Outstanding progress! You're a community leader."}
                  {!userData?.tier && "Complete daily steps to increase your score!"}
                </div>
                <div className="mt-3">
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    asChild
                  >
                    <Link href="/mobile/goals">
                      Set Today's Goals
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          <QuickActionCard 
            icon={SmilePlus} 
            label="Log Mood" 
            href="/mobile/mood"
          />
          <QuickActionCard 
            icon={MessageCircle} 
            label="Chat with AI" 
            href="/mobile/chat"
          />
          <QuickActionCard 
            icon={TrendingUp} 
            label="Progress" 
            href="/mobile/profile"
          />
        </div>
        
        {/* Recent moods overview */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <BarChart className="w-5 h-5 text-primary" />
              Recent Moods
            </h3>
            <div className="mt-3 flex overflow-x-auto pb-2 gap-2">
              {moodsLoading ? (
                <div className="text-sm text-gray-500">Loading moods...</div>
              ) : recentMoods && recentMoods.length > 0 ? (
                recentMoods.slice(0, 5).map((mood, index) => (
                  <div 
                    key={index} 
                    className="min-w-[70px] flex flex-col items-center p-2 border rounded-lg"
                  >
                    <div className="text-2xl">{mood.emoji}</div>
                    <div className="text-xs mt-1">
                      {new Date(mood.createdAt).toLocaleDateString(undefined, {
                        weekday: 'short',
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No mood logs yet</div>
              )}
            </div>
            
            <div className="mt-3">
              <Button 
                variant="outline" 
                className="w-full"
                asChild
              >
                <Link href="/mobile/mood">
                  Log Today's Mood
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming events */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Events
            </h3>
            <div className="mt-3 space-y-3">
              {eventsLoading ? (
                <div className="text-sm text-gray-500">Loading events...</div>
              ) : upcomingEvents && upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 3).map((event, index) => (
                  <div 
                    key={index}
                    className="border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {new Date(event.eventDate).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' • '}
                      {new Date(event.eventDate).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{event.location}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No upcoming events</div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* AI Insights */}
        {!insightLoading && aiInsight && (
          <Card>
            <CardContent className="pt-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Your Progress Insights
              </h3>
              <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm">
                {aiInsight.insights}
              </div>
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  asChild
                >
                  <Link href="/mobile/chat">
                    Discuss with AI Companion
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MobileLayout>
  );
}

interface QuickActionCardProps {
  icon: React.ElementType;
  label: string;
  href: string;
}

function QuickActionCard({ icon: Icon, label, href }: QuickActionCardProps) {
  return (
    <Link href={href}>
      <a className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-sm font-medium text-center">{label}</span>
      </a>
    </Link>
  );
}
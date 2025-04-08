import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "wouter";
import { 
  BarChart, 
  TrendingUp, 
  Calendar, 
  MessageCircle, 
  Award, 
  SmilePlus,
  Info,
  Bell,
  CheckCircle2,
  Users,
  Trophy,
  Star
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { User, SccsScore, AiInsight, Event, Mood, DailyStep, CareTeamMember } from "@shared/schema";

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
  
  // Get daily steps
  const { data: dailySteps, isLoading: stepsLoading } = useQuery<DailyStep[]>({
    queryKey: ['/api/daily-steps'],
    refetchOnWindowFocus: false,
  });
  
  // Get care team
  const { data: careTeam, isLoading: careTeamLoading } = useQuery<CareTeamMember[]>({
    queryKey: ['/api/care-team'],
    refetchOnWindowFocus: false,
  });
  
  // Mock notifications - in a real app, these would come from an API
  const notifications = [
    {
      id: 1,
      title: "New message from your case manager",
      description: "Sarah has a question about your recent appointment",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      title: "Social Capital Score increased!",
      description: "Your actions yesterday earned you +5 SCCS points",
      time: "1 day ago",
      read: true
    }
  ];
  
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
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                      {' • '}
                      {event.startTime && (
                        <span>{event.startTime}</span>
                      )}
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
        
        {/* Daily Steps and Actions */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Daily Actions
              <Badge variant="outline" className="ml-auto">+5 SCCS points</Badge>
            </h3>
            
            <div className="mt-3 space-y-3">
              {stepsLoading ? (
                <div className="text-sm text-gray-500">Loading your daily steps...</div>
              ) : dailySteps && dailySteps.length > 0 ? (
                dailySteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 pb-2 border-b last:border-0">
                    <Checkbox
                      id={`step-${step.id}`}
                      checked={step.completed || false}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={`step-${step.id}`}
                        className={`font-medium ${step.completed ? 'line-through text-gray-500' : ''}`}
                      >
                        {step.title}
                      </label>
                      <p className="text-sm text-gray-600">{step.description}</p>
                      {step.dueDate && (
                        <div className="text-xs text-gray-500 mt-1">
                          Due: {new Date(step.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">No daily steps set for today</p>
                  <Button asChild>
                    <Link href="/mobile/goals">Add Daily Steps</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Notifications */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
              {notifications.some(n => !n.read) && (
                <Badge className="ml-2 bg-red-500">{notifications.filter(n => !n.read).length}</Badge>
              )}
            </h3>
            
            <div className="mt-3 space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-lg border ${!notification.read ? 'bg-primary/5 border-primary/20' : 'bg-gray-50'}`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{notification.title}</h4>
                      {!notification.read && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                    <div className="text-xs text-gray-500 mt-2">{notification.time}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 py-3 text-center">
                  No new notifications
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Leaderboard - SCCS */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              SCCS Leaderboard
            </h3>
            
            <div className="mt-3 space-y-2">
              {/* Top performers */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-3 border border-amber-200">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-amber-500 text-white rounded-full font-bold">
                    1
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">James W.</div>
                    <div className="text-xs flex items-center">
                      <Star className="w-3 h-3 text-amber-500 mr-1" fill="currentColor" />
                      <span className="text-gray-600">Gold Tier • 92 SCCS</span>
                    </div>
                  </div>
                  <Trophy className="ml-auto w-5 h-5 text-amber-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-400 text-white rounded-full font-bold">
                    2
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">Maria C.</div>
                    <div className="text-xs flex items-center">
                      <Star className="w-3 h-3 text-gray-400 mr-1" fill="currentColor" />
                      <span className="text-gray-600">Silver Tier • 87 SCCS</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-amber-50/30 to-amber-100/30 rounded-lg p-3 border border-amber-100">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-amber-600/80 text-white rounded-full font-bold">
                    3
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">Robert T.</div>
                    <div className="text-xs flex items-center">
                      <Star className="w-3 h-3 text-amber-600/70 mr-1" fill="currentColor" />
                      <span className="text-gray-600">Bronze Tier • 83 SCCS</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Current user position */}
              {userData && (
                <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-3 border border-primary/20">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold">
                      7
                    </div>
                    <div className="ml-3">
                      <div className="font-medium">You</div>
                      <div className="text-xs flex items-center">
                        <Star className="w-3 h-3 text-primary mr-1" fill="currentColor" />
                        <span className="text-gray-600">
                          {userData.tier || "Bronze"} Tier • {sccsScore?.score || 0} SCCS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="text-center mt-3">
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <Link href="/mobile/profile">
                    View Complete Leaderboard
                  </Link>
                </Button>
              </div>
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
        
        {/* Care Team Circle View */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-primary" />
              Your Care Team
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-xs"
                asChild
              >
                <Link href="/mobile/care-team">View All</Link>
              </Button>
            </h3>
            
            {careTeamLoading ? (
              <div className="flex justify-center py-6">
                <div className="text-sm text-gray-500">Loading your care team...</div>
              </div>
            ) : careTeam && careTeam.length > 0 ? (
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  {/* Center circle - You */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
                      <div className="text-center">
                        <div className="text-xs uppercase font-semibold">You</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Surrounding team members in a circle */}
                  {careTeam.slice(0, 5).map((member, index) => {
                    // Calculate position in the circle
                    const angle = (index * (360 / Math.min(careTeam.length, 5))) * (Math.PI / 180);
                    const radius = 70; // Distance from center
                    const left = Math.cos(angle) * radius + 50;
                    const top = Math.sin(angle) * radius + 50;
                    
                    // Determine background color based on role
                    let bgColor = "bg-blue-500";
                    if (member.role === "peer_mentor") bgColor = "bg-green-500";
                    if (member.role === "case_manager") bgColor = "bg-purple-500";
                    if (member.role === "primary_care_provider") bgColor = "bg-red-500";
                    if (member.role === "community_health_worker") bgColor = "bg-amber-500";
                    
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
                          {member.avatarInitials || member.firstName?.[0] + member.lastName?.[0]}
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap">
                          <div className="text-xs font-medium">{member.firstName}</div>
                          <div className="text-[10px] text-gray-500">{
                            member.role === "peer_mentor" ? "Peer Mentor" :
                            member.role === "case_manager" ? "Case Manager" :
                            member.role === "primary_care_provider" ? "PCP" :
                            member.role === "community_health_worker" ? "CHW" :
                            member.role
                          }</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-3">No care team members assigned yet</p>
                <Button variant="outline" size="sm">
                  Learn About Care Teams
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Community Impact */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Community Impact
            </h3>
            
            <div className="mt-3 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-800">Your Impact</h4>
                  <p className="text-sm text-blue-600 mt-1">
                    Your actions have helped 12 community members
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              
              <div className="mt-3">
                <Progress value={65} className="h-2" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-blue-600">Current: 65%</span>
                  <span className="text-xs text-blue-800">Goal: 100%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <Button 
                variant="outline" 
                className="w-full"
                asChild
              >
                <Link href="/mobile/resources">
                  Discover Community Opportunities
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
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
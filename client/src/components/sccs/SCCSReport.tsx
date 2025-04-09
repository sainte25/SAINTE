import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronUp, TrendingUp, Award, Calendar, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Define types for the SCCS Report data
interface StrengthArea {
  category: string;
  score: number;
  maxScore: number;
  description: string;
}

interface ScoreHistory {
  date: string;
  score: number;
}

interface RecentActivity {
  moods: any[];
  events: any[];
  completedTasks: any[];
}

interface SccsScoreData {
  id: number;
  userId: number;
  score: number;
  consistency: number;
  engagement: number;
  milestones: number;
  peerSupport: number;
  recentChange: number;
  updatedAt: string;
}

interface SccsReportData {
  score: SccsScoreData;
  history: ScoreHistory[];
  strengthAreas: StrengthArea[];
  recentActivity: RecentActivity;
  recommendations: string[];
}

export default function SCCSReport() {
  const { data: sccsReport, isLoading } = useQuery<SccsReportData>({
    queryKey: ['/api/sccs/report'],
  });

  if (isLoading) {
    return <SCCSReportSkeleton />;
  }

  if (!sccsReport) {
    return (
      <Card className="bg-card/50 border-none shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-2xl">SCCS Report</CardTitle>
        </CardHeader>
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">No SCCS report data available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl">Social Capital Credit Score</CardTitle>
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center gap-2">
            <span className="text-4xl font-bold text-primary">{sccsReport.score.score}</span>
            <div className="bg-primary/10 rounded-full p-1">
              <ChevronUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-primary text-sm">+{sccsReport.score.recentChange} pts</span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Last updated {new Date(sccsReport.score.updatedAt).toLocaleDateString()}</p>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {sccsReport.strengthAreas.map((area) => (
                <Card key={area.category} className="bg-card/60 border-none shadow-md overflow-hidden">
                  <div className="p-4">
                    <h4 className="font-medium text-sm mb-1">{area.category}</h4>
                    <Progress value={(area.score / area.maxScore) * 100} className="h-2 mb-1" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{area.score} / {area.maxScore}</span>
                      <span>{Math.round((area.score / area.maxScore) * 100)}%</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            <Card className="bg-card/60 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 pl-4">
                  {sccsReport.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm list-disc">{rec}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card/60 border-none shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="text-muted-foreground">{sccsReport.recentActivity.completedTasks.length} tasks completed</p>
                  <p className="text-muted-foreground">{sccsReport.recentActivity.events.length} events attended</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/60 border-none shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Award className="w-4 h-4 mr-2 text-primary" />
                    Score Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Your score is higher than 75% of clients</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card className="bg-card/60 border-none shadow-md p-4">
              <h3 className="font-medium mb-4">6-Month History</h3>
              <div className="flex justify-between items-end h-40 mb-2">
                {sccsReport.history.map((point, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-primary/80 rounded-md w-8" 
                      style={{ 
                        height: `${(point.score / 100) * 150}px`,
                        opacity: index === sccsReport.history.length - 1 ? 1 : 0.6 + (index * 0.1)
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                {sccsReport.history.map((point, index) => (
                  <div key={index} className="text-center w-8 overflow-hidden">
                    {new Date(point.date).toLocaleDateString(undefined, { month: 'short' })}
                  </div>
                ))}
              </div>
            </Card>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Highest Score</span>
                <span className="font-bold">{Math.max(...sccsReport.history.map(h => h.score))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lowest Score</span>
                <span className="font-bold">{Math.min(...sccsReport.history.map(h => h.score))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average</span>
                <span className="font-bold">
                  {Math.round(sccsReport.history.reduce((sum, h) => sum + h.score, 0) / sccsReport.history.length)}
                </span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <Card className="bg-card/60 border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Score Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sccsReport.strengthAreas.map((area) => (
                    <div key={area.category}>
                      <div className="flex justify-between mb-1">
                        <h4 className="text-sm font-medium">{area.category}</h4>
                        <span className="text-sm text-primary font-bold">{area.score} / {area.maxScore}</span>
                      </div>
                      <Progress value={(area.score / area.maxScore) * 100} className="h-2 mb-1" />
                      <p className="text-xs text-muted-foreground">{area.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/60 border-none shadow-md mt-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  Potential Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">Here's how your score can be used:</p>
                <ul className="space-y-2 pl-4 text-sm">
                  <li className="list-disc">Housing applications: Show to landlords as proof of reliability</li>
                  <li className="list-disc">Employment: Demonstrate your consistency to employers</li>
                  <li className="list-disc">Financial services: Access to better financial products</li>
                  <li className="list-disc">Community recognition: Stand out in your community</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function SCCSReportSkeleton() {
  return (
    <Card className="bg-card/50 border-none shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-center text-2xl">
          <Skeleton className="h-8 w-3/4 mx-auto" />
        </CardTitle>
        <div className="text-center mb-4">
          <Skeleton className="h-12 w-32 mx-auto mb-2" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        
        <Skeleton className="h-40 mt-4" />
      </CardContent>
    </Card>
  );
}
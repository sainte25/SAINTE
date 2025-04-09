import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SccsScore, Mood, Event, DailyStep } from "@shared/schema";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import {
  Award,
  FileText,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Lightbulb,
  Download,
  Share2,
  ArrowUpRight,
} from "lucide-react";
import { format } from "date-fns";

// Types for SCCS report
type ScoreHistory = {
  date: string;
  score: number;
};

type StrengthArea = {
  category: string;
  score: number;
  maxScore: number;
  description: string;
};

type RecentActivity = {
  moods: Mood[];
  events: Event[];
  completedTasks: DailyStep[];
};

type SCCSReport = {
  score: SccsScore;
  history: ScoreHistory[];
  strengthAreas: StrengthArea[];
  recentActivity: RecentActivity;
  recommendations: string[];
};

export default function SCCSReport() {
  // Fetch detailed SCCS report
  const { data, isLoading, error } = useQuery<SCCSReport>({
    queryKey: ["/api/sccs/report"],
    refetchOnWindowFocus: false,
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d");
  };

  const getTier = (score: number) => {
    if (score >= 90) return "Platinum";
    if (score >= 80) return "Gold";
    if (score >= 60) return "Silver";
    return "Bronze";
  };

  const getTierColor = (score: number) => {
    if (score >= 90) return "text-purple-500";
    if (score >= 80) return "text-amber-500";
    if (score >= 60) return "text-gray-400";
    return "text-amber-700";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Social Capital Credit Report</CardTitle>
          <CardDescription>Loading your detailed SCCS report...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="animate-pulse space-y-8 w-full">
            <div className="h-40 bg-gray-200 rounded-md w-full"></div>
            <div className="h-40 bg-gray-200 rounded-md w-full"></div>
            <div className="h-20 bg-gray-200 rounded-md w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Social Capital Credit Report</CardTitle>
          <CardDescription>
            There was an error loading your report. Please try again later.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <Button>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for radar chart
  const radarData = data.strengthAreas.map((area) => ({
    subject: area.category,
    score: area.score,
    fullMark: area.maxScore,
  }));

  // Format history data for line chart
  const historyData = data.history.map((item) => ({
    date: formatDate(item.date),
    score: item.score,
  }));

  // Calculate overall score from components
  const totalPossiblePoints = data.strengthAreas.reduce(
    (sum, area) => sum + area.maxScore,
    0
  );
  const totalPoints = data.strengthAreas.reduce(
    (sum, area) => sum + area.score,
    0
  );
  const percentageComplete = Math.round(
    (totalPoints / totalPossiblePoints) * 100
  );

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b bg-primary/5">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-heading">
              Social Capital Credit Report
            </CardTitle>
            <CardDescription>
              Your comprehensive SCCS report and history
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Overview */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Award className="w-5 h-5 mr-2 text-primary" />
                Current Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="text-6xl font-bold mt-2 mb-1">
                    {data.score.score}
                  </div>
                  <div
                    className={`text-xl font-semibold mb-3 ${getTierColor(
                      data.score.score
                    )}`}
                  >
                    {getTier(data.score.score)} Tier
                  </div>
                </div>
                <div className="text-sm text-gray-500 max-w-xs mx-auto">
                  Your SCCS is like a credit score for your social capital and
                  community engagement. Share it with potential employers and
                  landlords to demonstrate your reliability.
                </div>
                <div className="mt-4 flex justify-center">
                  <Button variant="outline" className="text-xs">
                    <FileText className="w-3 h-3 mr-1" /> Generate Verification
                    Letter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score History */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Score History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={historyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="strengths">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="strengths">Strength Areas</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="strengths" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Strengths Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          data={radarData}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis domain={[0, 30]} />
                          <Radar
                            name="Current Score"
                            dataKey="score"
                            stroke="#6366f1"
                            fill="#6366f1"
                            fillOpacity={0.6}
                          />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Score Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.strengthAreas.map((area) => (
                        <div key={area.category}>
                          <div className="flex justify-between mb-1">
                            <div className="font-medium">{area.category}</div>
                            <div className="text-gray-500">
                              {area.score}/{area.maxScore}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{
                                width: `${(area.score / area.maxScore) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {area.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-primary" />
                      Recent Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.recentActivity.events.length > 0 ? (
                        data.recentActivity.events.map((event) => (
                          <div
                            key={event.id}
                            className="p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {formatDate(event.date)} • {event.startTime}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div
                                className={`text-xs px-2 py-1 rounded capitalize ${
                                  event.status === "registered"
                                    ? "bg-green-100 text-green-800"
                                    : event.status === "interested"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {event.status}
                              </div>
                              <ArrowUpRight className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No recent events found
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
                      Completed Tasks
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.recentActivity.completedTasks.length > 0 ? (
                        data.recentActivity.completedTasks.map((task) => (
                          <div
                            key={task.id}
                            className="p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="font-medium">{task.title}</div>
                            <div className="text-sm text-gray-500 mt-1">
                              {task.description}
                            </div>
                            <div className="flex justify-end mt-2">
                              <span className="text-xs text-gray-500">
                                Completed on {formatDate(task.dueDate)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No completed tasks found
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      Mood Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.recentActivity.moods.length > 0 ? (
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={data.recentActivity.moods.map((mood) => ({
                              date: formatDate(mood.date),
                              emoji: mood.emoji,
                              type: mood.mood,
                              value:
                                mood.mood === "great"
                                  ? 5
                                  : mood.mood === "good"
                                  ? 4
                                  : mood.mood === "okay"
                                  ? 3
                                  : mood.mood === "low"
                                  ? 2
                                  : 1,
                            }))}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis
                              domain={[0, 5]}
                              ticks={[1, 2, 3, 4, 5]}
                              tickFormatter={(value) =>
                                value === 1
                                  ? "😢"
                                  : value === 2
                                  ? "😔"
                                  : value === 3
                                  ? "😐"
                                  : value === 4
                                  ? "😊"
                                  : "😁"
                              }
                            />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-white p-2 border rounded shadow">
                                      <p className="text-sm">
                                        {payload[0].payload.emoji}{" "}
                                        {payload[0].payload.type}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {payload[0].payload.date}
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar
                              dataKey="value"
                              fill="#6366f1"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No mood data found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-primary" />
                    Personalized Recommendations
                  </CardTitle>
                  <CardDescription>
                    Follow these recommendations to improve your SCCS score
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{rec}</div>
                            <div className="mt-2 flex">
                              <Button
                                variant="outline"
                                size="sm"
                                className="mr-2 text-xs"
                              >
                                Add to Tasks
                              </Button>
                              <Button size="sm" className="text-xs">
                                Start Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-gray-50 px-6 py-4">
        <div className="text-sm text-gray-500 flex-1">
          Last updated: {format(new Date(), "MMMM d, yyyy")}
        </div>
        <Button>Download Full Report</Button>
      </CardFooter>
    </Card>
  );
}
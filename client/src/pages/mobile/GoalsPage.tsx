import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, Check, Calendar, MoreHorizontal, Edit2 } from "lucide-react";

// Simulated goals data - in real app would come from API
const mockPersonalGoals = [
  {
    id: 1,
    title: "Complete job application",
    description: "Finish application for warehouse position at Amazon",
    dueDate: "2023-07-15",
    progress: 75,
    steps: [
      { id: 101, title: "Update resume", completed: true },
      { id: 102, title: "Submit online application", completed: true },
      { id: 103, title: "Schedule interview", completed: true },
      { id: 104, title: "Attend interview", completed: false },
    ]
  },
  {
    id: 2,
    title: "Find stable housing",
    description: "Secure an apartment with 12-month lease",
    dueDate: "2023-08-30",
    progress: 33,
    steps: [
      { id: 201, title: "Save first month's rent", completed: true },
      { id: 202, title: "Contact housing resources", completed: false },
      { id: 203, title: "Complete applications", completed: false },
    ]
  },
];

const mockTeamGoals = [
  {
    id: 3,
    title: "Weekly check-ins",
    description: "Complete weekly check-in with your peer mentor",
    dueDate: "Recurring",
    progress: 100,
    teamMember: "Jane (Peer Mentor)",
    steps: [
      { id: 301, title: "Monday call", completed: true },
    ]
  },
  {
    id: 4,
    title: "Housing application",
    description: "Complete housing assistance application with case manager",
    dueDate: "2023-07-20",
    progress: 50,
    teamMember: "Robert (Case Manager)",
    steps: [
      { id: 401, title: "Gather required documents", completed: true },
      { id: 402, title: "Sign application form", completed: false },
    ]
  },
];

export default function GoalsPage() {
  const [activeTab, setActiveTab] = useState("personal");

  // This would be real API data in the final implementation
  const { data: personalGoals, isLoading: personalLoading } = useQuery({
    queryKey: ['/api/goals/personal'],
    refetchOnWindowFocus: false,
    enabled: false, // Disabled since we're using mock data for now
  });

  const { data: teamGoals, isLoading: teamLoading } = useQuery({
    queryKey: ['/api/goals/team'],
    refetchOnWindowFocus: false,
    enabled: false, // Disabled since we're using mock data for now
  });

  // Format the due date
  const formatDueDate = (dateString: string) => {
    if (dateString === "Recurring") return "Recurring";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <MobileLayout headerTitle="My Goals">
      <div className="p-4 space-y-6">
        <Tabs defaultValue="personal" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal Goals</TabsTrigger>
            <TabsTrigger value="team">Team Goals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Your Goals</h2>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Goal
              </Button>
            </div>
            
            {personalLoading ? (
              <p>Loading your goals...</p>
            ) : (
              <>
                {mockPersonalGoals.map((goal) => (
                  <Card key={goal.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{goal.title}</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-4 w-4" /> Due: {formatDueDate(goal.dueDate)}
                        </span>
                        <span className="font-medium">{goal.progress}% complete</span>
                      </div>
                      
                      <Progress value={goal.progress} className="h-2" />
                      
                      <div className="mt-4 space-y-2">
                        {goal.steps.map((step) => (
                          <div 
                            key={step.id} 
                            className={`flex items-center gap-2 p-2 rounded-md ${
                              step.completed ? 'bg-green-50' : 'bg-gray-50'
                            }`}
                          >
                            <div className={`p-1 rounded-full ${
                              step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-200'
                            }`}>
                              <Check className="h-3 w-3" />
                            </div>
                            <span className={step.completed ? 'line-through text-gray-500' : ''}>
                              {step.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-1">
                      <Button variant="ghost" size="sm">View Details</Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Edit2 className="h-3 w-3" /> Edit
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="team" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Care Team Goals</h2>
            </div>
            
            {teamLoading ? (
              <p>Loading team goals...</p>
            ) : (
              <>
                {mockTeamGoals.map((goal) => (
                  <Card key={goal.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{goal.title}</CardTitle>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>{goal.description}</CardDescription>
                      <div className="text-xs font-medium text-blue-600 mt-1">
                        With: {goal.teamMember}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pb-2">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Calendar className="h-4 w-4" /> Due: {formatDueDate(goal.dueDate)}
                        </span>
                        <span className="font-medium">{goal.progress}% complete</span>
                      </div>
                      
                      <Progress value={goal.progress} className="h-2" />
                      
                      <div className="mt-4 space-y-2">
                        {goal.steps.map((step) => (
                          <div 
                            key={step.id} 
                            className={`flex items-center gap-2 p-2 rounded-md ${
                              step.completed ? 'bg-green-50' : 'bg-gray-50'
                            }`}
                          >
                            <div className={`p-1 rounded-full ${
                              step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-200'
                            }`}>
                              <Check className="h-3 w-3" />
                            </div>
                            <span className={step.completed ? 'line-through text-gray-500' : ''}>
                              {step.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-1">
                      <Button variant="ghost" size="sm">Contact Team</Button>
                      <Button variant="outline" size="sm">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2, Calendar } from "lucide-react";
import { DailyStep } from "@shared/schema";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

export default function GoalsPage() {
  const [newStep, setNewStep] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
  });

  // Get daily steps
  const { data: dailySteps, isLoading } = useQuery<DailyStep[]>({
    queryKey: ['/api/daily-steps'],
    refetchOnWindowFocus: false,
  });

  // Add new step
  const addStepMutation = useMutation({
    mutationFn: async (step: typeof newStep) => {
      const response = await apiRequest('/api/daily-steps', {
        method: 'POST',
        data: step
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-steps'] });
      setNewStep({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split("T")[0],
      });
      toast({
        title: "Goal added",
        description: "Your daily step has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add daily step. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding step:", error);
    }
  });

  // Toggle step completion
  const toggleStepMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number, completed: boolean }) => {
      const response = await apiRequest(`/api/daily-steps/${id}`, {
        method: 'PATCH',
        data: { completed }
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-steps'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update step. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating step:", error);
    }
  });

  // Delete step
  const deleteStepMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(`/api/daily-steps/${id}`, {
        method: 'DELETE'
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-steps'] });
      toast({
        title: "Goal deleted",
        description: "Your daily step has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete step. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting step:", error);
    }
  });

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStep.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your goal.",
        variant: "destructive",
      });
      return;
    }
    addStepMutation.mutate(newStep);
  };

  const handleToggleCompletion = (step: DailyStep) => {
    toggleStepMutation.mutate({
      id: step.id,
      completed: !step.completed
    });
  };

  const handleDeleteStep = (id: number) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      deleteStepMutation.mutate(id);
    }
  };

  const activeSteps = dailySteps?.filter(step => !step.completed) || [];
  const completedSteps = dailySteps?.filter(step => step.completed) || [];

  return (
    <MobileLayout headerTitle="Goals & Steps" showBackButton>
      <div className="p-4 space-y-5">
        {/* Add new step form */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium mb-4">Add a New Goal</h3>
            <form onSubmit={handleAddStep} className="space-y-3">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newStep.title}
                  onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
                  placeholder="What would you like to accomplish?"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={newStep.description}
                  onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                  placeholder="Add details about this goal"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="dueDate" className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newStep.dueDate}
                  onChange={(e) => setNewStep({ ...newStep, dueDate: e.target.value })}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={addStepMutation.isPending}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Steps list */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">
              Active ({activeSteps.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedSteps.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4">
            {isLoading ? (
              <div className="text-center py-8">Loading your goals...</div>
            ) : activeSteps.length > 0 ? (
              <div className="space-y-3">
                {activeSteps.map((step) => (
                  <StepItem 
                    key={step.id} 
                    step={step} 
                    onToggle={() => handleToggleCompletion(step)}
                    onDelete={() => handleDeleteStep(step.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No active goals. Add a goal to get started.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            {isLoading ? (
              <div className="text-center py-8">Loading your goals...</div>
            ) : completedSteps.length > 0 ? (
              <div className="space-y-3">
                {completedSteps.map((step) => (
                  <StepItem 
                    key={step.id} 
                    step={step} 
                    onToggle={() => handleToggleCompletion(step)}
                    onDelete={() => handleDeleteStep(step.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No completed goals yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}

interface StepItemProps {
  step: DailyStep;
  onToggle: () => void;
  onDelete: () => void;
}

function StepItem({ step, onToggle, onDelete }: StepItemProps) {
  return (
    <Card className={step.completed ? "border-green-200 bg-green-50" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox 
            id={`step-${step.id}`}
            checked={step.completed || false}
            onCheckedChange={onToggle}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <label
                htmlFor={`step-${step.id}`}
                className={`font-medium ${step.completed ? "line-through text-gray-500" : ""}`}
              >
                {step.title}
              </label>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="h-6 w-6 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {step.description && (
              <p className={`text-sm mt-1 ${step.completed ? "text-gray-500" : "text-gray-600"}`}>
                {step.description}
              </p>
            )}
            {step.dueDate && (
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                Due: {new Date(step.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
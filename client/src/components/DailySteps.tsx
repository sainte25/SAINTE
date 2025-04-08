import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DailyStep } from "@shared/schema";

export default function DailySteps() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStep, setNewStep] = useState({ title: "", description: "" });

  // Fetch daily steps
  const { data: dailySteps, isLoading } = useQuery<DailyStep[]>({
    queryKey: ['/api/daily-steps'],
  });

  // Add new step mutation
  const addStepMutation = useMutation({
    mutationFn: async (stepData: { title: string; description: string }) => {
      return await apiRequest("POST", "/api/daily-steps", stepData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-steps'] });
      setIsAddModalOpen(false);
      setNewStep({ title: "", description: "" });
      toast({
        title: "Step Added",
        description: "Your daily step has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add step: ${error}`,
        variant: "destructive",
      });
    },
  });

  // Update step completion status
  const updateStepMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      return await apiRequest("PATCH", `/api/daily-steps/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/daily-steps'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update step: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleAddStep = () => {
    if (!newStep.title.trim()) {
      toast({
        title: "Error",
        description: "Please provide a step title",
        variant: "destructive",
      });
      return;
    }
    
    addStepMutation.mutate(newStep);
  };

  const handleStepCompletion = (id: number, completed: boolean) => {
    updateStepMutation.mutate({ id, completed });
  };

  return (
    <div className="glassmorphic rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading font-semibold">Your Daily Steps</h2>
        <div className="tooltip">
          <button className="text-neutral-400 hover:text-neutral-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="tooltip-text">Set 3 achievable steps for your day. Each completed step contributes to your growth.</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-4 text-center text-neutral-500">Loading your daily steps...</div>
        ) : dailySteps && dailySteps.length > 0 ? (
          dailySteps.map((step) => (
            <div key={step.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-neutral-100 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="pt-0.5">
                  <input 
                    type="checkbox" 
                    id={`step-${step.id}`} 
                    checked={step.completed}
                    onChange={(e) => handleStepCompletion(step.id, e.target.checked)}
                    className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label htmlFor={`step-${step.id}`} className="font-medium">{step.title}</label>
                  {step.description && (
                    <p className="text-sm text-neutral-500 mt-1">{step.description}</p>
                  )}
                </div>
              </div>
              <div>
                <button className="text-neutral-400 hover:text-neutral-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-neutral-500">
            No steps added yet. Start by adding your first daily step.
          </div>
        )}
        
        <div className="mt-6">
          <button 
            className="w-full py-3 bg-primary-50 text-primary-700 rounded-lg flex items-center justify-center hover:bg-primary-100 transition-all"
            onClick={() => setIsAddModalOpen(true)}
            disabled={dailySteps && dailySteps.length >= 3}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Step
          </button>
        </div>
      </div>

      {/* Add Step Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a New Daily Step</DialogTitle>
            <DialogDescription>
              Choose a small, achievable action for today. Be specific about what you'll do.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="step-title" className="text-sm font-medium">
                What do you want to accomplish today?
              </label>
              <Input 
                id="step-title"
                placeholder="e.g., Apply for the warehouse position at FlexLogistics"
                value={newStep.title}
                onChange={(e) => setNewStep({ ...newStep, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="step-description" className="text-sm font-medium">
                Any details to add? (optional)
              </label>
              <Textarea 
                id="step-description"
                placeholder="e.g., Complete online application and upload resume"
                value={newStep.description}
                onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!newStep.title.trim() || addStepMutation.isPending}
              onClick={handleAddStep}
            >
              {addStepMutation.isPending ? "Saving..." : "Add Step"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

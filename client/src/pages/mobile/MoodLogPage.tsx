import React, { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type MoodType = 'great' | 'good' | 'okay' | 'low' | 'struggling';

type MoodOption = {
  type: MoodType;
  emoji: string;
  label: string;
};

export default function MoodLogPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [notes, setNotes] = useState("");
  
  const moodOptions: MoodOption[] = [
    { type: 'great', emoji: '😁', label: 'Great' },
    { type: 'good', emoji: '🙂', label: 'Good' },
    { type: 'okay', emoji: '😐', label: 'Okay' },
    { type: 'low', emoji: '😔', label: 'Low' },
    { type: 'struggling', emoji: '😣', label: 'Struggling' },
  ];

  const logMoodMutation = useMutation({
    mutationFn: async (data: { mood: string; emoji: string; notes: string; date: string }) => {
      return await apiRequest('/api/moods', {
        method: 'POST',
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/moods/recent'] });
      
      toast({
        title: "Mood logged",
        description: "Thank you for sharing how you're feeling today.",
      });
      
      navigate("/mobile");
    },
    onError: (error) => {
      toast({
        title: "Error logging mood",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Let us know how you're feeling today.",
        variant: "destructive",
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    logMoodMutation.mutate({
      mood: selectedMood.type,
      emoji: selectedMood.emoji,
      notes: notes,
      date: today,
    });
  };

  const handleBack = () => {
    navigate("/mobile");
  };

  return (
    <MobileLayout 
      headerTitle="How are you feeling?" 
      showBackButton={true} 
      onBack={handleBack}
    >
      <div className="p-4 max-w-md mx-auto space-y-6">
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((option) => (
            <Card 
              key={option.type}
              className={`cursor-pointer hover:shadow-md transition-shadow ${
                selectedMood?.type === option.type 
                  ? 'border-2 border-primary' 
                  : 'border border-gray-200'
              }`}
              onClick={() => setSelectedMood(option)}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <span className="text-4xl">{option.emoji}</span>
                <span className="text-xs mt-2 text-center">{option.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-sm font-medium mb-2">What's on your mind? (optional)</h3>
          <Textarea
            placeholder="Share your thoughts, feelings, or anything that's on your mind today..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px]"
          />
          <p className="text-xs text-gray-500 mt-2">
            This will be shared with your care team to help them support you better.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={logMoodMutation.isPending}
          >
            {logMoodMutation.isPending ? "Logging..." : "Save Mood Log"}
          </Button>
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mood } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

type MoodType = 'great' | 'good' | 'okay' | 'low' | 'struggling';

type MoodOption = {
  type: MoodType;
  emoji: string;
  label: string;
};

export default function MoodLogPage() {
  const moodOptions: MoodOption[] = [
    { type: 'great', emoji: '😄', label: 'Great' },
    { type: 'good', emoji: '🙂', label: 'Good' },
    { type: 'okay', emoji: '😐', label: 'Okay' },
    { type: 'low', emoji: '😔', label: 'Low' },
    { type: 'struggling', emoji: '😣', label: 'Struggling' }
  ];
  
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [notes, setNotes] = useState("");
  
  // Add new mood log
  const addMoodMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMood) return null;
      
      return await apiRequest('/api/moods', {
        method: 'POST',
        data: {
          mood: selectedMood.type,
          emoji: selectedMood.emoji,
          notes: notes,
          date: new Date().toISOString(),
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/moods/recent'] });
      toast({
        title: "Mood logged",
        description: "Your mood has been logged successfully.",
      });
      // Reset form
      setSelectedMood(null);
      setNotes("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log your mood. Please try again.",
        variant: "destructive",
      });
      console.error("Error logging mood:", error);
    }
  });
  
  // Get recent moods
  const { data: recentMoods, isLoading } = useQuery<Mood[]>({
    queryKey: ['/api/moods/recent'],
    refetchOnWindowFocus: false,
  });
  
  const handleMoodSelection = (mood: MoodOption) => {
    setSelectedMood(mood);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      toast({
        title: "Missing information",
        description: "Please select your mood.",
        variant: "destructive",
      });
      return;
    }
    addMoodMutation.mutate();
  };
  
  return (
    <MobileLayout headerTitle="Mood Log" showBackButton>
      <div className="p-4 space-y-5">
        {/* Mood log form */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium mb-4">How are you feeling today?</h3>
            
            <div className="grid grid-cols-5 gap-2 mb-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.type}
                  type="button"
                  onClick={() => handleMoodSelection(mood)}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                    selectedMood?.type === mood.type
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className="text-2xl mb-1">{mood.emoji}</span>
                  <span className="text-xs">{mood.label}</span>
                </button>
              ))}
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="notes">Additional notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="What's on your mind today?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={!selectedMood || addMoodMutation.isPending}
                >
                  Log Mood
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Recent mood logs */}
        <Card>
          <CardContent className="pt-4">
            <h3 className="text-lg font-medium mb-3">Your Recent Moods</h3>
            
            {isLoading ? (
              <div className="text-center py-6">
                <div className="text-sm text-gray-500">Loading your moods...</div>
              </div>
            ) : recentMoods && recentMoods.length > 0 ? (
              <div className="space-y-3">
                {recentMoods.map((mood, index) => (
                  <div key={index} className="flex p-3 rounded-lg border">
                    <div className="flex-shrink-0 text-2xl mr-3">
                      {mood.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="font-medium">
                          {mood.mood.charAt(0).toUpperCase() + mood.mood.slice(1)}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(mood.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      {mood.notes && (
                        <p className="text-sm text-gray-600 mt-1">{mood.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No mood logs yet.</p>
                <p className="text-sm mt-2">Log your first mood to see your history here.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Info card */}
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="pt-4">
            <h3 className="text-md font-medium text-blue-800 mb-2">
              Why Track Your Mood?
            </h3>
            <p className="text-sm text-blue-700">
              Tracking your mood helps you and your care team identify patterns, 
              triggers, and progress in your wellness journey. Regular tracking 
              provides valuable insights for personalized support.
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}
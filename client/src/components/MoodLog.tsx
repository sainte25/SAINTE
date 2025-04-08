import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mood } from "@shared/schema";
import { format } from "date-fns";

type MoodType = 'great' | 'good' | 'okay' | 'low' | 'struggling';

type MoodOption = {
  type: MoodType;
  emoji: string;
  label: string;
};

const moodOptions: MoodOption[] = [
  { type: 'great', emoji: '😊', label: 'Great' },
  { type: 'good', emoji: '🙂', label: 'Good' },
  { type: 'okay', emoji: '😐', label: 'Okay' },
  { type: 'low', emoji: '😕', label: 'Low' },
  { type: 'struggling', emoji: '😢', label: 'Struggling' }
];

export default function MoodLog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [notes, setNotes] = useState("");

  // Fetch recent moods
  const { data: recentMoods, isLoading } = useQuery<Mood[]>({
    queryKey: ['/api/moods/recent'],
  });

  // Log mood mutation
  const logMoodMutation = useMutation({
    mutationFn: async (data: { mood: string; emoji: string; notes?: string }) => {
      return await apiRequest("POST", "/api/moods", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/moods/recent'] });
      toast({
        title: "Mood Logged",
        description: "Your mood has been logged successfully.",
      });
      // Reset form
      setSelectedMood(null);
      setNotes("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to log mood: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleMoodSelection = (mood: MoodOption) => {
    setSelectedMood(mood);
  };

  const handleLogMood = () => {
    if (!selectedMood) {
      toast({
        title: "Select a Mood",
        description: "Please select how you're feeling first.",
        variant: "destructive",
      });
      return;
    }

    logMoodMutation.mutate({
      mood: selectedMood.type,
      emoji: selectedMood.emoji,
      notes: notes.trim() || undefined
    });
  };

  // Get day of week for display
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEE');
  };

  return (
    <div className="glassmorphic rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading font-semibold">How are you feeling today?</h2>
        <div className="tooltip">
          <button className="text-neutral-400 hover:text-neutral-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="tooltip-text">Your feelings are valid. No judgment, no pressure - just a check-in with yourself.</span>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-6">
        {moodOptions.map((mood) => (
          <button 
            key={mood.type}
            className={`p-3 rounded-full flex flex-col items-center transition-all ${selectedMood?.type === mood.type ? 'bg-primary-50' : 'hover:bg-neutral-100'}`}
            onClick={() => handleMoodSelection(mood)}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs text-neutral-600 mt-1">{mood.label}</span>
          </button>
        ))}
      </div>
      
      <div>
        <label htmlFor="mood-notes" className="block text-sm font-medium text-neutral-700 mb-2">
          Want to share more? (optional)
        </label>
        <textarea 
          id="mood-notes" 
          rows={3} 
          className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 resize-none text-sm" 
          placeholder="What's on your mind today?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
      </div>
      
      <div className="mt-4">
        <button 
          className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
          onClick={handleLogMood}
          disabled={logMoodMutation.isPending}
        >
          {logMoodMutation.isPending ? "Logging..." : "Log My Mood"}
        </button>
      </div>
      
      <div className="mt-6 pt-4 border-t border-neutral-200">
        <h3 className="text-sm font-medium text-neutral-700 mb-3">Recent Mood History</h3>
        <div className="flex justify-between">
          {isLoading ? (
            <div className="py-2 text-center text-neutral-500 w-full">Loading mood history...</div>
          ) : recentMoods && recentMoods.length > 0 ? (
            recentMoods.map((mood) => (
              <div key={mood.id} className="text-center">
                <div className="w-8 h-8 flex items-center justify-center mx-auto">
                  <span className="text-lg">{mood.emoji}</span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">{getDayOfWeek(mood.date)}</div>
              </div>
            ))
          ) : (
            <div className="py-2 text-center text-neutral-500 w-full">No mood history yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

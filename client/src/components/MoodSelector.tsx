import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { insertMoodSchema, Mood } from '@shared/schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// We extend the insertMoodSchema to make notes optional
const extendedMoodSchema = insertMoodSchema.extend({
  notes: z.string().optional(),
});

type MoodFormValues = z.infer<typeof extendedMoodSchema>;

// Expanded mood options for a richer emotion selection
const moodOptions = [
  { emoji: "😄", name: "Great", value: "great" },
  { emoji: "😊", name: "Happy", value: "happy" },
  { emoji: "🙂", name: "Good", value: "good" },
  { emoji: "😌", name: "Calm", value: "calm" },
  { emoji: "😐", name: "Okay", value: "okay" },
  { emoji: "🤔", name: "Thoughtful", value: "thoughtful" },
  { emoji: "😔", name: "Low", value: "low" },
  { emoji: "😞", name: "Disappointed", value: "disappointed" },
  { emoji: "😤", name: "Frustrated", value: "frustrated" },
  { emoji: "😟", name: "Worried", value: "worried" },
  { emoji: "😣", name: "Struggling", value: "struggling" },
  { emoji: "😠", name: "Angry", value: "angry" },
  { emoji: "😴", name: "Tired", value: "tired" },
  { emoji: "🤒", name: "Sick", value: "sick" },
  { emoji: "💪", name: "Strong", value: "strong" },
  { emoji: "🙏", name: "Grateful", value: "grateful" }
];

interface MoodSelectorProps {
  triggerButton?: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean; 
  onOpenChange?: (open: boolean) => void;
}

export default function MoodSelector({ 
  triggerButton, 
  defaultOpen = false,
  open: externalOpen,
  onOpenChange 
}: MoodSelectorProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch recent moods
  const { data: recentMoods } = useQuery({
    queryKey: ['/api/moods/recent'],
  });
  
  const form = useForm<MoodFormValues>({
    resolver: zodResolver(extendedMoodSchema),
    defaultValues: {
      userId: 0, // Will be set from server
      mood: '',
      date: new Date().toISOString().split('T')[0],
      emoji: '',
      notes: '',
    },
  });
  
  const handleOpenChange = (newOpen: boolean) => {
    setInternalOpen(newOpen);
    if (onOpenChange) onOpenChange(newOpen);
  };
  
  const moodMutation = useMutation({
    mutationFn: (values: MoodFormValues) => {
      return apiRequest('/api/moods', 'POST', values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/moods/recent'] });
      toast({
        title: "Mood logged",
        description: "Your mood has been recorded successfully.",
      });
      form.reset();
      handleOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log your mood. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (values: MoodFormValues) => {
    moodMutation.mutate(values);
  };

  return (
    <>
      {triggerButton && (
        <div onClick={() => handleOpenChange(true)}>
          {triggerButton}
        </div>
      )}
      
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 text-white max-w-md w-full shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              How are you feeling?
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <div className="mood-grid">
                      {moodOptions.map((moodOption) => (
                        <div 
                          key={moodOption.value}
                          className={`mood-option ${field.value === moodOption.value ? 'opacity-100' : 'opacity-70'}`}
                          onClick={() => {
                            field.onChange(moodOption.value);
                            // When a mood is selected, also set the emoji
                            form.setValue("emoji", moodOption.emoji);
                          }}
                        >
                          <div 
                            className={`mood-emoji ${field.value === moodOption.value ? 'border-2 border-blue-500' : ''}`}
                          >
                            {moodOption.emoji}
                          </div>
                          <span className="mood-label">{moodOption.name}</span>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              

              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What's on your mind?"
                        className="bg-gray-900 border-gray-700 text-white resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => handleOpenChange(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                  disabled={moodMutation.isPending || !form.formState.isValid}
                >
                  {moodMutation.isPending ? "Saving..." : "Save Mood"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Display a mood history chart
export function MoodHistory() {
  // Fetch recent moods
  const { data: recentMoods, isLoading } = useQuery<Mood[]>({
    queryKey: ['/api/moods/recent'],
  });
  
  if (isLoading) {
    return (
      <div className="apple-card p-4">
        <h3 className="text-lg font-semibold mb-3">Mood History</h3>
        <div className="h-40 flex items-center justify-center">
          <div className="audio-visualizer">
            <div className="audio-bar h-3"></div>
            <div className="audio-bar h-5"></div>
            <div className="audio-bar h-8"></div>
            <div className="audio-bar h-5"></div>
            <div className="audio-bar h-3"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // If no moods yet
  if (!recentMoods || recentMoods.length === 0) {
    return (
      <div className="apple-card p-4">
        <h3 className="text-lg font-semibold mb-3">Mood History</h3>
        <p className="text-gray-400 text-center py-8">
          No mood entries yet. Start tracking how you feel to see patterns over time.
        </p>
        <div className="text-center">
          <MoodSelector 
            triggerButton={
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                Log Your First Mood
              </Button>
            }
          />
        </div>
      </div>
    );
  }
  
  // Function to get emoji for mood
  const getEmojiForMood = (moodValue: string) => {
    const foundMood = moodOptions.find(m => m.value === moodValue);
    return foundMood ? foundMood.emoji : "😐";
  };
  
  return (
    <div className="apple-card p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Mood History</h3>
        <MoodSelector 
          triggerButton={
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
              + Log Mood
            </Button>
          }
        />
      </div>
      
      <div className="grid grid-cols-7 gap-2 py-2">
        {recentMoods && Array.isArray(recentMoods) && recentMoods.slice(0, 7).map((mood, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-2xl mb-1">{mood.emoji || getEmojiForMood(mood.mood)}</div>
            <div className="text-xs text-gray-400">
              {new Date(mood.createdAt).toLocaleDateString(undefined, { weekday: 'short' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
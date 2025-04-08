import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Event } from "@shared/schema";
import { format } from "date-fns";

export default function UpcomingEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch upcoming events
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events/upcoming'],
  });

  // RSVP for event mutation
  const rsvpMutation = useMutation({
    mutationFn: async (eventId: number) => {
      return await apiRequest("POST", `/api/events/${eventId}/rsvp`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events/upcoming'] });
      toast({
        title: "RSVP Confirmed",
        description: "We've saved your RSVP for this event.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to RSVP: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleRSVP = (eventId: number) => {
    rsvpMutation.mutate(eventId);
  };

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: format(date, 'MMM'),
      day: format(date, 'd')
    };
  };

  return (
    <div className="glassmorphic rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading font-semibold">Upcoming Events</h2>
        <button className="text-sm text-primary-600 hover:text-primary-800 transition-all">View All</button>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-4 text-center text-neutral-500">Loading upcoming events...</div>
        ) : events && events.length > 0 ? (
          events.map((event) => {
            const { month, day } = formatEventDate(event.date);
            
            return (
              <div key={event.id} className="flex items-start p-4 bg-white rounded-lg border border-neutral-100 shadow-sm">
                <div className="rounded-lg bg-primary-100 text-primary-800 p-3 text-center w-16">
                  <span className="block text-sm font-semibold">{month}</span>
                  <span className="block text-xl font-bold">{day}</span>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-neutral-500 mt-1">{event.description}</p>
                  )}
                  <div className="mt-2 flex items-center text-sm text-neutral-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{event.startTime} {event.endTime ? `- ${event.endTime}` : ''}</span>
                  </div>
                  {event.location && (
                    <div className="mt-2 flex items-center text-sm text-neutral-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
                <div>
                  {event.status === 'upcoming' ? (
                    <button 
                      className="px-3 py-1 rounded bg-primary-50 text-primary-600 text-sm hover:bg-primary-100 transition-all"
                      onClick={() => handleRSVP(event.id)}
                      disabled={rsvpMutation.isPending}
                    >
                      RSVP
                    </button>
                  ) : (
                    <button className="px-3 py-1 rounded bg-neutral-100 text-neutral-600 text-sm hover:bg-neutral-200 transition-all">
                      {event.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-4 text-center text-neutral-500">
            No upcoming events at this time.
          </div>
        )}
      </div>
    </div>
  );
}

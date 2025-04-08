import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Resource, UserResource } from "@shared/schema";
import { format } from "date-fns";

interface ResourceWithBookmark extends Resource {
  isBookmarked?: boolean;
}

export default function Resources() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch recommended resources
  const { data: resources, isLoading } = useQuery<ResourceWithBookmark[]>({
    queryKey: ['/api/resources/recommended'],
  });

  // Bookmark resource mutation
  const bookmarkMutation = useMutation({
    mutationFn: async ({ resourceId, isBookmarked }: { resourceId: number; isBookmarked: boolean }) => {
      return await apiRequest(
        isBookmarked ? "DELETE" : "POST", 
        `/api/resources/${resourceId}/bookmark`,
        {}
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources/recommended'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update bookmark: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleBookmark = (resourceId: number, isBookmarked: boolean = false) => {
    bookmarkMutation.mutate({ resourceId, isBookmarked });
  };

  // Format date for display
  const formatResourceDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <div className="glassmorphic rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading font-semibold">Recommended Resources</h2>
        <button className="text-sm text-primary-600 hover:text-primary-800 transition-all">View All</button>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-4 text-center text-neutral-500">Loading resources...</div>
        ) : resources && resources.length > 0 ? (
          resources.map((resource) => (
            <div key={resource.id} className="p-4 bg-white rounded-lg border border-neutral-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  resource.category === 'Employment' ? 'bg-primary-100 text-primary-700' : 
                  resource.category === 'Housing' ? 'bg-secondary-100 text-secondary-700' :
                  'bg-neutral-100 text-neutral-700'
                }`}>
                  {resource.category}
                </span>
                <button 
                  className={`text-neutral-400 hover:text-neutral-600`}
                  onClick={() => handleBookmark(resource.id, resource.isBookmarked)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={resource.isBookmarked ? "currentColor" : "none"} stroke="currentColor">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                </button>
              </div>
              <h3 className="font-medium">{resource.title}</h3>
              {resource.description && (
                <p className="text-sm text-neutral-500 mt-1">{resource.description}</p>
              )}
              <div className="mt-2 flex items-center text-xs text-neutral-500">
                {resource.date ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{formatResourceDate(resource.date)}</span>
                  </>
                ) : resource.readTime ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <span>{resource.readTime}</span>
                  </>
                ) : null}
              </div>
              <div className="mt-3">
                <a 
                  href={resource.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-1.5 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-all text-center"
                >
                  {resource.date ? "Learn More" : "View Guide"}
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-neutral-500">No recommended resources at this time.</div>
        )}
      </div>
    </div>
  );
}

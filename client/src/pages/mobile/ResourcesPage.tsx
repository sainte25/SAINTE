import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import MobileLayout from '@/components/mobile/MobileLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bookmark, Search, Clock, ExternalLink, Star, Home, Briefcase, Heart, BookOpen } from 'lucide-react';

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  date?: string;
  url?: string;
  readTime?: string;
  isFeatured?: boolean;
  isBookmarked?: boolean;
}

export default function ResourcesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Get recommended resources
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources/recommended'],
    refetchOnWindowFocus: false,
  });

  // Bookmark resource mutation
  const bookmarkMutation = useMutation({
    mutationFn: async ({ resourceId, isBookmarked }: { resourceId: number; isBookmarked: boolean }) => {
      if (isBookmarked) {
        return await apiRequest(`/api/resources/${resourceId}/bookmark`, {
          method: 'POST',
        });
      } else {
        return await apiRequest(`/api/resources/${resourceId}/bookmark`, {
          method: 'DELETE',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources/recommended'] });
    },
    onError: () => {
      toast({
        title: 'Error updating bookmark',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
  });

  // Handle bookmark toggle
  const handleToggleBookmark = (resource: Resource) => {
    bookmarkMutation.mutate({
      resourceId: resource.id,
      isBookmarked: !resource.isBookmarked,
    });

    toast({
      title: resource.isBookmarked ? 'Bookmark removed' : 'Bookmark added',
      description: resource.isBookmarked 
        ? `${resource.title} removed from your bookmarks` 
        : `${resource.title} added to your bookmarks`,
    });
  };

  // Filter resources based on search query
  const filteredResources = resources
    ? resources.filter(resource => 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'housing':
        return <Home className="h-4 w-4" />;
      case 'employment':
        return <Briefcase className="h-4 w-4" />;
      case 'health':
        return <Heart className="h-4 w-4" />;
      case 'education':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  return (
    <MobileLayout headerTitle="Resources">
      <div className="p-4 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading resources...</p>
              </div>
            ) : filteredResources.length > 0 ? (
              <div className="space-y-4">
                {filteredResources.map((resource) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    onToggleBookmark={handleToggleBookmark} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No resources found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recommended" className="mt-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading recommendations...</p>
              </div>
            ) : filteredResources.filter(r => r.isFeatured).length > 0 ? (
              <div className="space-y-4">
                {filteredResources
                  .filter(resource => resource.isFeatured)
                  .map((resource) => (
                    <ResourceCard 
                      key={resource.id} 
                      resource={resource} 
                      onToggleBookmark={handleToggleBookmark}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No recommended resources found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bookmarked" className="mt-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading bookmarks...</p>
              </div>
            ) : filteredResources.filter(r => r.isBookmarked).length > 0 ? (
              <div className="space-y-4">
                {filteredResources
                  .filter(resource => resource.isBookmarked)
                  .map((resource) => (
                    <ResourceCard 
                      key={resource.id} 
                      resource={resource} 
                      onToggleBookmark={handleToggleBookmark}
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No bookmarked resources</p>
                <p className="text-sm mt-2">Bookmark resources to save them for later</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}

interface ResourceCardProps {
  resource: Resource;
  onToggleBookmark: (resource: Resource) => void;
}

function ResourceCard({ resource, onToggleBookmark }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <Badge 
            variant="outline" 
            className="mb-2 flex items-center gap-1 font-normal"
          >
            {getCategoryIcon(resource.category)}
            {resource.category}
          </Badge>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => onToggleBookmark(resource)}
          >
            <Bookmark 
              className={`h-5 w-5 ${resource.isBookmarked ? 'fill-primary text-primary' : ''}`} 
            />
          </Button>
        </div>
        <CardTitle className="text-base">{resource.title}</CardTitle>
        <CardDescription>{resource.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        {resource.readTime && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <Clock className="h-3 w-3" />
            <span>{resource.readTime} min read</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        {resource.url && (
          <Button 
            variant="outline" 
            size="sm"
            className="w-full flex items-center gap-1"
            asChild
          >
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              View Resource <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Helper function to get category icon component
function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case 'housing':
      return <Home className="h-4 w-4" />;
    case 'employment':
      return <Briefcase className="h-4 w-4" />;
    case 'health':
      return <Heart className="h-4 w-4" />;
    case 'education':
      return <BookOpen className="h-4 w-4" />;
    default:
      return <Star className="h-4 w-4" />;
  }
}
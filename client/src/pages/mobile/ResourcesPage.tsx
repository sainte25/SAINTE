import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Bookmark, 
  ExternalLink, 
  Map, 
  BookOpen,
  Video,
  FileText,
  Headphones,
  Calendar
} from "lucide-react";
import { Resource } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get recommended resources
  const { data: resources, isLoading } = useQuery<(Resource & { isBookmarked: boolean })[]>({
    queryKey: ['/api/resources/recommended'],
    refetchOnWindowFocus: false,
  });
  
  // Bookmark/unbookmark resource
  const bookmarkMutation = useMutation({
    mutationFn: async ({ id, isBookmarked }: { id: number, isBookmarked: boolean }) => {
      if (isBookmarked) {
        return await apiRequest(`/api/resources/${id}/bookmark`, {
          method: 'DELETE'
        });
      } else {
        return await apiRequest(`/api/resources/${id}/bookmark`, {
          method: 'POST'
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources/recommended'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update bookmark status. Please try again.",
        variant: "destructive",
      });
      console.error("Error bookmarking resource:", error);
    }
  });
  
  const handleToggleBookmark = (id: number, isBookmarked: boolean) => {
    bookmarkMutation.mutate({ id, isBookmarked });
  };
  
  // Filter resources by search term
  const filteredResources = resources ? resources.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  
  // Get bookmark icon by resource type
  const getResourceIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'article':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'guide':
        return <BookOpen className="h-5 w-5 text-amber-500" />;
      case 'local':
        return <Map className="h-5 w-5 text-purple-500" />;
      case 'audio':
        return <Headphones className="h-5 w-5 text-pink-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get bookmarked resources
  const bookmarkedResources = resources?.filter(resource => resource.isBookmarked) || [];
  
  // Group resources by type
  const resourceTypes = resources ? [...new Set(resources.map(r => r.type))] : [];
  
  return (
    <MobileLayout headerTitle="Resources" showBackButton>
      <div className="p-4 space-y-5">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        
        {/* Resources */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">
              All
            </TabsTrigger>
            <TabsTrigger value="bookmarked">
              Bookmarked
            </TabsTrigger>
            <TabsTrigger value="by-type">
              By Type
            </TabsTrigger>
          </TabsList>
          
          {/* All resources tab */}
          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500">Loading resources...</div>
              </div>
            ) : filteredResources.length > 0 ? (
              <div className="space-y-3 mt-4">
                {filteredResources.map((resource) => (
                  <ResourceCard 
                    key={resource.id}
                    resource={resource}
                    onToggleBookmark={handleToggleBookmark}
                    icon={getResourceIcon(resource.type)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? (
                  <p>No resources match your search.</p>
                ) : (
                  <p>No resources available.</p>
                )}
              </div>
            )}
          </TabsContent>
          
          {/* Bookmarked resources tab */}
          <TabsContent value="bookmarked">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500">Loading bookmarks...</div>
              </div>
            ) : bookmarkedResources.length > 0 ? (
              <div className="space-y-3 mt-4">
                {bookmarkedResources.map((resource) => (
                  <ResourceCard 
                    key={resource.id}
                    resource={resource}
                    onToggleBookmark={handleToggleBookmark}
                    icon={getResourceIcon(resource.type)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No bookmarked resources.</p>
                <p className="text-sm mt-2">Save resources by clicking the bookmark icon.</p>
              </div>
            )}
          </TabsContent>
          
          {/* Resources by type tab */}
          <TabsContent value="by-type">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-sm text-gray-500">Loading resources...</div>
              </div>
            ) : resourceTypes.length > 0 ? (
              <div className="space-y-6 mt-4">
                {resourceTypes.map((type) => (
                  <div key={type}>
                    <h3 className="font-medium text-sm uppercase tracking-wide text-gray-500 mb-2 flex items-center">
                      {getResourceIcon(type)}
                      <span className="ml-2">{type}</span>
                    </h3>
                    <div className="space-y-3">
                      {resources
                        .filter(r => r.type === type)
                        .filter(r => 
                          r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.description.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((resource) => (
                          <ResourceCard 
                            key={resource.id}
                            resource={resource}
                            onToggleBookmark={handleToggleBookmark}
                            icon={getResourceIcon(resource.type)}
                            compact
                          />
                        ))
                      }
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No resources available.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Info card */}
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="pt-4">
            <h3 className="text-md font-medium text-primary/90 mb-2">
              Need Help Finding Resources?
            </h3>
            <p className="text-sm text-primary/80">
              If you can't find what you're looking for, reach out to your care team.
              Your case manager can help connect you with additional resources tailored to your needs.
            </p>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}

interface ResourceCardProps {
  resource: Resource & { isBookmarked: boolean };
  onToggleBookmark: (id: number, isBookmarked: boolean) => void;
  icon: React.ReactNode;
  compact?: boolean;
}

function ResourceCard({ resource, onToggleBookmark, icon, compact = false }: ResourceCardProps) {
  return (
    <Card>
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex">
          <div className="flex-shrink-0 mr-3">
            {icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h4 className={`font-medium ${compact ? "text-sm" : "text-base"}`}>
                {resource.title}
              </h4>
              
              <Button
                variant="ghost"
                size="icon"
                className={`text-gray-400 hover:text-primary ml-2 ${
                  resource.isBookmarked ? "text-primary" : ""
                }`}
                onClick={() => onToggleBookmark(resource.id, resource.isBookmarked)}
              >
                <Bookmark className="h-4 w-4" fill={resource.isBookmarked ? "currentColor" : "none"} />
              </Button>
            </div>
            
            {!compact && (
              <p className="text-sm text-gray-600 mt-1">
                {resource.description}
              </p>
            )}
            
            <div className={`${compact ? "mt-1" : "mt-3"} flex items-center`}>
              {compact ? (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="h-auto p-0 text-primary"
                  asChild
                >
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1"
                  asChild
                >
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span className="text-xs">View Resource</span>
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
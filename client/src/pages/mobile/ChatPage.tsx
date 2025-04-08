import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Send, 
  Sparkles, 
  Bot, 
  User,
  Info,
  Loader2,
  RefreshCw,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { ChatMessage } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [chatSessionId, setChatSessionId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Generate a unique session ID when component mounts
    if (!chatSessionId) {
      setChatSessionId(uuidv4());
    }
  }, [chatSessionId]);
  
  // Get chat messages
  const { 
    data: chatMessages,
    isLoading: messagesLoading,
    refetch
  } = useQuery<ChatMessage[]>({
    queryKey: ['/api/ai/chat', chatSessionId],
    queryFn: async () => {
      if (!chatSessionId) return [];
      return await apiRequest(`/api/ai/chat/${chatSessionId}`);
    },
    enabled: !!chatSessionId,
    refetchOnWindowFocus: false,
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest(`/api/ai/chat/${chatSessionId}`, {
        method: 'POST',
        data: {
          role: 'user',
          content,
          chatSessionId
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/chat', chatSessionId] });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    }
  });
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessageMutation.mutate(message);
  };
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);
  
  return (
    <MobileLayout headerTitle="AI Companion" showBackButton>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Chat header */}
        <div className="p-4 bg-primary/5 border-b border-primary/10">
          <div className="flex items-center">
            <Bot className="h-8 w-8 text-primary mr-3" />
            <div>
              <h2 className="font-medium">SAINTE AI Companion</h2>
              <p className="text-xs text-gray-600">
                Ask me questions, get support, or explore resources
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="ml-auto"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messagesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : chatMessages && chatMessages.length > 0 ? (
            chatMessages.map((msg, index) => (
              <div 
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="flex items-center mb-1">
                    {msg.role === 'user' ? (
                      <>
                        <span className="text-xs font-medium">You</span>
                        <User className="h-3 w-3 ml-1" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">AI Companion</span>
                      </>
                    )}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                  
                  {/* Feedback buttons for AI messages */}
                  {msg.role === 'assistant' && (
                    <div className="flex justify-end mt-2 gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/30"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full bg-white/20 hover:bg-white/30"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <Bot className="h-12 w-12 text-primary/40 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">Welcome to your AI Companion</h3>
              <p className="text-sm text-gray-500 max-w-md mt-2">
                I'm here to support your wellness journey, provide information, and help you navigate resources. 
                What would you like to talk about today?
              </p>
              
              <div className="grid grid-cols-2 gap-2 mt-6 w-full max-w-md">
                <SuggestionButton 
                  text="How are you feeling today?"
                  onClick={() => setMessage("How are you feeling today?")}
                />
                <SuggestionButton 
                  text="Can you suggest coping strategies?"
                  onClick={() => setMessage("Can you suggest coping strategies for stress?")}
                />
                <SuggestionButton 
                  text="What resources are available?"
                  onClick={() => setMessage("What resources are available near me?")}
                />
                <SuggestionButton 
                  text="Help with my daily goals"
                  onClick={() => setMessage("Help me with my daily goals")}
                />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={sendMessageMutation.isPending || !message.trim()}
            >
              {sendMessageMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          
          <div className="flex items-center justify-center mt-2">
            <Info className="h-3 w-3 text-gray-400 mr-1" />
            <span className="text-xs text-gray-400">
              This is an AI assistant. For emergencies, contact your care team directly.
            </span>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

interface SuggestionButtonProps {
  text: string;
  onClick: () => void;
}

function SuggestionButton({ text, onClick }: SuggestionButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="justify-start h-auto py-2 text-left"
      onClick={onClick}
    >
      <span className="text-xs">{text}</span>
    </Button>
  );
}
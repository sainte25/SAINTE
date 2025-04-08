import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { apiRequest } from "@/lib/queryClient";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage, AiInsight } from "@shared/schema";

// Helper to format dates
const formatTimestamp = (timestamp: string | Date) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function AICompanionChat() {
  const [message, setMessage] = useState("");
  const [chatSessionId] = useState(() => {
    // Get existing session ID from localStorage or create a new one
    const storedSessionId = localStorage.getItem("chatSessionId");
    if (storedSessionId) return storedSessionId;
    
    const newSessionId = uuidv4();
    localStorage.setItem("chatSessionId", newSessionId);
    return newSessionId;
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Fetch chat history
  const { data: messages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/ai/chat', chatSessionId],
    refetchOnWindowFocus: false,
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      return apiRequest(`/api/ai/chat/${chatSessionId}`, 'POST', {
        message: messageText
      });
    },
    onSuccess: () => {
      // Clear input
      setMessage("");
      // Refetch message history
      queryClient.invalidateQueries({ queryKey: ['/api/ai/chat', chatSessionId] });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    }
  });
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessageMutation.mutate(message);
  };
  
  // Get insights query
  const { data: insights } = useQuery<AiInsight>({
    queryKey: ['/api/ai/insights'],
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
  
  return (
    <Layout>
      <div className="flex flex-col h-full max-w-5xl mx-auto">
        <div className="p-4 bg-primary-50 border-b border-primary-200">
          <h1 className="text-2xl font-bold text-primary-800">SAINTE AI Companion</h1>
          <p className="text-neutral-600">
            I'm here to support you on your journey. Let's talk about whatever's on your mind.
          </p>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Chat messages area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 bg-neutral-50">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-pulse flex space-x-2">
                    <div className="rounded-full bg-neutral-200 h-3 w-3"></div>
                    <div className="rounded-full bg-neutral-200 h-3 w-3"></div>
                    <div className="rounded-full bg-neutral-200 h-3 w-3"></div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center p-8 text-neutral-500">
                  <p>Start a conversation with your AI companion.</p>
                  <p className="mt-2 text-sm text-neutral-400">
                    This is a safe space to discuss your thoughts, challenges, and goals.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg: any) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === 'user' 
                            ? 'bg-primary-100 text-primary-900' 
                            : 'bg-white border border-neutral-200 shadow-sm'
                        }`}
                      >
                        <div className="text-sm mb-1">
                          {msg.role === 'user' ? 'You' : 'SAINTE'} • {formatTimestamp(msg.createdAt)}
                        </div>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Message input area */}
            <div className="p-4 border-t border-neutral-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={sendMessageMutation.isPending}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  disabled={sendMessageMutation.isPending || !message.trim()}
                >
                  {sendMessageMutation.isPending ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
          
          {/* Insights panel */}
          <div className="hidden lg:block w-80 border-l border-neutral-200 overflow-y-auto p-4 bg-white">
            <h2 className="font-semibold text-lg mb-4">Your Progress Insights</h2>
            
            {insights ? (
              <div>
                <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-700 text-sm">{insights.insights}</p>
                </div>
                
                <h3 className="font-medium text-sm text-neutral-500 mb-2">STRENGTHS</h3>
                <ul className="mb-4 space-y-1">
                  {insights.strengthsIdentified?.map((strength: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-primary-500 mr-2 mt-0.5">•</span>
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="font-medium text-sm text-neutral-500 mb-2">SUGGESTED RESOURCES</h3>
                <ul className="space-y-1">
                  {insights.suggestedResources?.map((resource: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-primary-500 mr-2 mt-0.5">•</span>
                      <span className="text-sm">{resource}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center p-4 text-neutral-500">
                <p>Loading insights...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
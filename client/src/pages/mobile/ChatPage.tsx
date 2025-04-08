import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import MobileLayout from "@/components/mobile/MobileLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Info, RefreshCw } from "lucide-react";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  chatSessionId: string;
  timestamp?: string;
}

export default function ChatPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [message, setMessage] = useState("");
  const [chatSessionId, setChatSessionId] = useState<string>(() => {
    // Get existing session ID from localStorage or create a new one
    const storedSessionId = localStorage.getItem("chat_session_id");
    if (storedSessionId) return storedSessionId;
    
    const newSessionId = uuidv4();
    localStorage.setItem("chat_session_id", newSessionId);
    return newSessionId;
  });
  
  // Get chat history
  const { data: chatHistory, isLoading: historyLoading } = useQuery<ChatMessage[]>({
    queryKey: ['/api/ai/chat', chatSessionId],
    queryFn: async () => {
      try {
        const data = await apiRequest(`/api/ai/chat/${chatSessionId}`);
        return data;
      } catch (error) {
        // If there's an error, it could be a new chat. Return empty array
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { role: string; content: string; chatSessionId: string }) => {
      return await apiRequest(`/api/ai/chat/${chatSessionId}`, {
        method: 'POST',
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/chat', chatSessionId] });
      setMessage("");
    },
    onError: () => {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });
  
  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);
  
  // Handle message submission
  const handleSendMessage = () => {
    if (message.trim() === "") return;
    
    sendMessageMutation.mutate({
      role: "user",
      content: message.trim(),
      chatSessionId,
    });
  };
  
  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Start a new chat session
  const handleNewChat = () => {
    const newSessionId = uuidv4();
    localStorage.setItem("chat_session_id", newSessionId);
    setChatSessionId(newSessionId);
    queryClient.invalidateQueries({ queryKey: ['/api/ai/chat'] });
  };
  
  // Format timestamp to readable time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MobileLayout headerTitle="AI Companion">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Chat Header */}
        <div className="bg-slate-50 p-4 border-b">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                <span>AI</span>
              </div>
              <div>
                <h3 className="font-medium">SAINTE Assistant</h3>
                <p className="text-xs text-slate-500">Your personal support companion</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" /> New Chat
            </Button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome Message */}
          {(!chatHistory || chatHistory.length === 0) && !historyLoading && (
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h2 className="font-bold mb-2">Welcome to Your AI Companion</h2>
              <p className="text-sm text-slate-600 mb-4">
                I'm here to support your journey. You can talk to me about your goals, 
                challenges, or just how you're feeling today.
              </p>
              <div className="flex justify-center">
                <Info className="h-5 w-5 text-blue-500 mr-2" />
                <p className="text-xs text-slate-500">
                  Your care team can only see this chat with your permission
                </p>
              </div>
            </div>
          )}
          
          {/* Loading State */}
          {historyLoading && (
            <div className="text-center py-4">
              <div className="animate-spin mb-2 mx-auto h-6 w-6 border-2 border-gray-300 border-t-primary rounded-full"></div>
              <p>Loading conversation...</p>
            </div>
          )}
          
          {/* Chat Messages */}
          {chatHistory && chatHistory.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.timestamp && (
                  <div className="text-xs mt-1 opacity-70 text-right">
                    {formatTime(msg.timestamp)}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Show loading state when sending */}
          {sendMessageMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-end gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={message.trim() === "" || sendMessageMutation.isPending}
              className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-center text-slate-500 mt-2">
            This is a private conversation. Your data is protected.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
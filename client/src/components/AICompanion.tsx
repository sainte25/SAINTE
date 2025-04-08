import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function AICompanion() {
  const [isVisible, setIsVisible] = useState(true);

  // Fetch personalized message from AI
  const { data, isLoading, error } = useQuery<{ message: string }>({
    queryKey: ['/api/ai/personalized-message'],
    staleTime: 1000 * 60 * 60, // Cache the message for 1 hour
  });

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  // Get the message text
  const messageText = isLoading 
    ? "How are you feeling today? I'm here to support you on your journey." 
    : data?.message || "I'm here to listen whenever you're ready to talk.";

  return (
    <div className="mt-6 glassmorphic rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
      <div className="flex items-start">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h2 className="text-xl font-heading font-semibold mb-1">AI Support Companion</h2>
          {isLoading ? (
            <div className="h-16 flex items-center">
              <div className="animate-pulse flex space-x-2">
                <div className="rounded-full bg-neutral-200 h-3 w-3"></div>
                <div className="rounded-full bg-neutral-200 h-3 w-3"></div>
                <div className="rounded-full bg-neutral-200 h-3 w-3"></div>
              </div>
            </div>
          ) : error ? (
            <p className="text-neutral-600">
              I'm here to support you today. What would you like to discuss about your progress?
            </p>
          ) : (
            <p className="text-neutral-600">
              {messageText}
            </p>
          )}
          <div className="mt-4 flex space-x-4">
            <Link href="/ai-companion">
              <a className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all">
                Chat Now
              </a>
            </Link>
            <button 
              className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-all"
              onClick={handleDismiss}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

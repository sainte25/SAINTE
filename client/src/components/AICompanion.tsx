import { useState, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Mic, X, Pause } from "lucide-react";

// Chat voice interface (fullscreen)
export function AICompanionVoiceChat() {
  const [isListening, setIsListening] = useState(false);
  
  // Audio visualizer animation
  const audioRef = useRef<HTMLDivElement>(null);
  
  const startListening = () => {
    setIsListening(true);
    
    // Start audio visualizer animation
    if (audioRef.current) {
      const bars = audioRef.current.querySelectorAll('.audio-bar');
      bars.forEach(bar => {
        const randomHeight = Math.floor(Math.random() * 15) + 5;
        (bar as HTMLElement).style.height = `${randomHeight}px`;
        (bar as HTMLElement).style.animation = `audioAnimation ${Math.random() * 0.5 + 0.7}s ease-in-out infinite alternate`;
      });
    }
  };
  
  const stopListening = () => {
    setIsListening(false);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white p-6">
      {/* User profile image */}
      <div className="mt-12 flex flex-col items-center">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10">
          <div className="w-full h-full bg-gradient-radial from-black to-black">
            {/* This would be the user image placeholder */}
            <div className="w-full h-full rounded-full overflow-hidden">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iI2YwYTUwMCIvPjwvc3ZnPg==" 
                alt="User"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Audio visualizer */}
        <div className="audio-visualizer mt-8" ref={audioRef}>
          <div className="audio-bar h-3"></div>
          <div className="audio-bar h-5"></div>
          <div className="audio-bar h-12"></div>
          <div className="audio-bar h-8"></div>
          <div className="audio-bar h-10"></div>
        </div>
        
        <p className="mt-6 text-white/90 text-sm">
          {isListening ? "Listening..." : "You can start talking"}
        </p>
      </div>
      
      {/* Controls */}
      <div className="flex items-center space-x-4 mb-12">
        {isListening ? (
          <button 
            onClick={stopListening}
            className="voice-button bg-gray-800 text-white"
          >
            <Pause className="w-6 h-6" />
          </button>
        ) : (
          <button 
            onClick={startListening}
            className="voice-button bg-red-600 text-white"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}

// Chat interface based on the second screenshot
export function AICompanionChat() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: '[Recommended Training Program]\nRemote IT Training - 8 Weeks, Fully Online, No Cost\nSuccess Rate: 87% of grads land jobs in 3 months'
    },
    {
      role: 'user',
      content: 'That actually sounds like a solid move. But what if I don\'t finish it?'
    },
    {
      role: 'ai',
      content: 'What if you do? What if you make a move today that completely shifts your future six months from now? I see people just like you leveling up every day. Why not you?'
    },
    {
      role: 'ai',
      content: '[Take the First Step]\nSign Up for IT Training (2-Min Process)'
    },
    {
      role: 'user',
      content: 'Alright. Let\'s do it.'
    },
    {
      role: 'ai',
      content: '[IT Training Enrollment Complete ✅]'
    },
    {
      role: 'ai',
      content: 'And just like that—you made a power move today. Small steps, big outcomes. Let\'s check back in tomorrow and see what\'s next.'
    },
    {
      role: 'user',
      content: 'I appreciate that. Needed this push today.'
    },
    {
      role: 'ai',
      content: 'You don\'t just need this—you deserve this. Keep showing up for yourself. I\'ll be here when you\'re ready for the next step.'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  
  const sendMessage = () => {
    if (newMessage.trim() === '') return;
    
    setMessages([...messages, {
      role: 'user',
      content: newMessage
    }]);
    
    setNewMessage('');
    
    // In real implementation, this would call the API and append the AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'I appreciate your message. I\'m here to support you today.'
      }]);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header - would be part of MobileLayout in real implementation */}
      <div className="p-4 border-b border-gray-800 flex items-center">
        <div className="w-8 h-8 rounded-full bg-orange-500 mr-2"></div>
        <div>
          <div className="font-semibold">SAINTEAI</div>
          <div className="text-xs text-gray-400">@Official</div>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message-bubble ${message.role === 'user' ? 'user ml-auto' : 'ai'}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <div className="px-4 py-2 border-t border-gray-800">
        <div className="flex items-center p-2 rounded-full bg-gray-800">
          <input
            type="text"
            placeholder="Hold and Speak"
            className="flex-1 bg-transparent border-none focus:outline-none text-white mx-2"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button 
            onClick={() => {}} 
            className="w-8 h-8 flex items-center justify-center text-gray-400"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Dashboard compact version
export default function AICompanion() {
  const [isVisible, setIsVisible] = useState(true);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Fetch personalized message from AI
  const { data, isLoading, error } = useQuery<{ message: string }>({
    queryKey: ['/api/ai/personalized-message'],
    staleTime: 1000 * 60 * 60, // Cache the message for 1 hour
  });

  const handleDismiss = () => {
    setIsVisible(false);
  };
  
  const activateVoice = () => {
    setIsVoiceActive(true);
  };

  if (!isVisible) return null;
  if (isVoiceActive) return <AICompanionVoiceChat />;

  // Get the message text
  const messageText = isLoading 
    ? "How are you feeling today? I'm here to support you on your journey." 
    : data?.message || "I'm here to listen whenever you're ready to talk.";

  return (
    <div className="apple-card my-4">
      <div className="flex items-start">
        <div className="avatar-circle avatar-glow-orange mr-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-black border border-white/10">
            <img 
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjEwMCIgZmlsbD0iI2YwYTUwMCIvPjwvc3ZnPg==" 
              alt="AI"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">SAINTE AI</h3>
          
          {isLoading ? (
            <div className="audio-visualizer my-2 justify-start">
              <div className="audio-bar h-2"></div>
              <div className="audio-bar h-3"></div>
              <div className="audio-bar h-4"></div>
              <div className="audio-bar h-2"></div>
            </div>
          ) : (
            <p className="text-sm text-gray-300 mb-3">
              {messageText}
            </p>
          )}
          
          <div className="flex space-x-3">
            <Link href="/mobile/chat">
              <button className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-800 rounded-md text-sm">
                Chat
              </button>
            </Link>
            
            <button 
              className="px-3 py-1.5 border border-white/10 rounded-md text-sm"
              onClick={activateVoice}
            >
              Voice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import DailySteps from "@/components/DailySteps";
import SCCSProgress from "@/components/SCCSProgress";
import UpcomingEvents from "@/components/UpcomingEvents";
import MoodLog from "@/components/MoodLog";
import CareTeam from "@/components/CareTeam";
import Resources from "@/components/Resources";
import AICompanion from "@/components/AICompanion";
import BreathingExercise from "@/components/BreathingExercise";

export default function Dashboard() {
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);

  // Fetch current user data
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/users/current'],
  });

  // Handler for breathing exercise modal
  const handleOpenBreathingExercise = () => {
    setIsBreathingModalOpen(true);
  };

  const handleCloseBreathingExercise = () => {
    setIsBreathingModalOpen(false);
  };

  // Use current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Layout userData={userData}>
      {/* Main Dashboard Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="apple-card flex items-center justify-between mb-6 p-4 rounded-xl">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-blue-400">
              Hello, <span className="text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]">{isLoadingUser ? '...' : userData?.firstName || 'User'}</span> 👋
            </h1>
            <p className="text-white/70">Today is <span>{currentDate}</span></p>
          </div>
          
          <div className="flex space-x-4">
            {/* Breathing Exercise Button */}
            <button 
              className="px-4 py-2 rounded-lg bg-blue-600/20 text-blue-500 border border-blue-500/30 flex items-center pulse-animation shadow-[0_0_10px_rgba(59,130,246,0.3)]"
              onClick={handleOpenBreathingExercise}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Take a Breath
            </button>
            
            {/* Notification Button */}
            <button className="relative p-2 rounded-lg bg-blue-600/20 text-blue-500 border border-blue-500/30 hover:bg-blue-600/30 transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs shadow-[0_0_5px_rgba(59,130,246,0.5)]">2</span>
            </button>
          </div>
        </header>
        
        {/* Main Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Daily Goals & Progress */}
          <div className="lg:col-span-2 space-y-6">
            <DailySteps />
            <SCCSProgress />
            <UpcomingEvents />
          </div>
          
          {/* Right Column - Mood Log and Resources */}
          <div className="lg:col-span-1 space-y-6">
            <MoodLog />
            <CareTeam />
            <Resources />
          </div>
        </div>
        
        {/* AI Companion Preview */}
        <AICompanion />
      </div>

      {/* Breathing Exercise Modal */}
      <BreathingExercise 
        isOpen={isBreathingModalOpen} 
        onClose={handleCloseBreathingExercise} 
      />
    </Layout>
  );
}

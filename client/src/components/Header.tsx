import React from "react";

interface HeaderProps {
  userName: string;
  onBreathingExercise: () => void;
}

export default function Header({ userName, onBreathingExercise }: HeaderProps) {
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="glassmorphic flex items-center justify-between mb-6 p-4 rounded-xl">
      <div>
        <h1 className="text-2xl font-heading font-semibold">Hello, <span>{userName}</span> 👋</h1>
        <p className="text-neutral-500">Today is <span>{currentDate}</span></p>
      </div>
      
      <div className="flex space-x-4">
        {/* Breathe Button */}
        <button 
          className="px-4 py-2 rounded-lg bg-primary-50 text-primary-700 flex items-center pulse-animation"
          onClick={onBreathingExercise}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Take a Breath
        </button>
        
        {/* Notification Button */}
        <button className="relative p-2 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs">2</span>
        </button>
      </div>
    </header>
  );
}

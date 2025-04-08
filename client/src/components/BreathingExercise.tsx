import { useState, useEffect, useRef } from "react";

interface BreathingExerciseProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BreathingExercise({ isOpen, onClose }: BreathingExerciseProps) {
  const [instructions, setInstructions] = useState("Breathe in...");
  const intervalRef = useRef<number | null>(null);

  // Manage breathing animation when modal opens
  useEffect(() => {
    if (isOpen) {
      let isBreathingIn = true;
      setInstructions("Breathe in...");
      
      // Clear any existing interval
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
      
      // Set up new breathing interval
      intervalRef.current = window.setInterval(() => {
        if (isBreathingIn) {
          setInstructions("Breathe out...");
        } else {
          setInstructions("Breathe in...");
        }
        isBreathingIn = !isBreathingIn;
      }, 4000);
    }
    
    // Clean up interval when component unmounts or modal closes
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-heading font-semibold">Take a Moment to Breathe</h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="py-8 flex flex-col items-center">
          <div className="w-32 h-32 rounded-full border-4 border-primary-100 flex items-center justify-center mb-6">
            <div 
              className="w-24 h-24 rounded-full bg-primary-100 transition-all duration-[4000ms] ease-in-out"
              style={{ 
                transform: instructions === "Breathe out..." ? 'scale(1.5)' : 'scale(1)',
                opacity: instructions === "Breathe out..." ? '1' : '0.7'
              }}
            />
          </div>
          
          <p className="text-lg text-center font-medium text-neutral-700">{instructions}</p>
          <p className="text-sm text-neutral-500 mt-4 text-center">
            Follow the circle. Breathe in as it expands, breathe out as it contracts.
          </p>
        </div>
        
        <div className="mt-4">
          <button 
            className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
            onClick={onClose}
          >
            I Feel Better Now
          </button>
        </div>
      </div>
    </div>
  );
}

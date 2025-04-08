import React from "react";
import Sidebar from "@/components/Sidebar";
import { User } from "@shared/schema";

interface LayoutProps {
  children: React.ReactNode;
  userData?: User;
}

export default function Layout({ children, userData }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <style jsx global>{`
        body {
          background-color: #f8f9fa;
          background-image: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
          min-height: 100vh;
        }
        
        .glassmorphic {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .progress-ring-circle {
          transition: stroke-dashoffset 0.35s;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }
        
        .exit-button:hover {
          background-color: rgba(245, 54, 92, 0.1);
        }
        
        .pulse-animation {
          animation: pulse 4s infinite ease-in-out;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .tooltip {
          position: relative;
        }
        
        .tooltip .tooltip-text {
          visibility: hidden;
          width: 220px;
          background-color: rgba(31, 41, 55, 0.9);
          color: #fff;
          text-align: center;
          border-radius: 6px;
          padding: 8px;
          position: absolute;
          z-index: 10;
          bottom: 125%;
          left: 50%;
          margin-left: -110px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .tooltip:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
      `}</style>

      {/* Sidebar */}
      <Sidebar userData={userData} />
      
      {/* Main Content */}
      {children}
    </div>
  );
}

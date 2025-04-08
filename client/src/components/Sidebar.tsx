import { useState } from "react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { User } from "@shared/schema";

interface SidebarProps {
  userData?: User;
}

export default function Sidebar({ userData }: SidebarProps) {
  const [location] = useLocation();
  const { toast } = useToast();
  
  // Quick exit handler
  const handleQuickExit = () => {
    // Immediately redirect to a neutral website
    window.location.href = "https://weather.com";
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!userData) return "U";
    
    if (userData.avatarInitials) {
      return userData.avatarInitials;
    }
    
    const firstInitial = userData.firstName ? userData.firstName.charAt(0) : "";
    const lastInitial = userData.lastName ? userData.lastName.charAt(0) : "";
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className="glassmorphic w-64 shrink-0 p-4 shadow-lg z-10 flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-center mb-8 py-4">
        <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">SAINTE</h1>
      </div>
      
      {/* Navigation */}
      <nav className="mb-auto">
        <ul className="space-y-1">
          <li>
            <Link href="/">
              <a className={`flex items-center p-3 rounded-lg ${location === '/' ? 'bg-primary-100 text-primary-800' : 'text-neutral-700 hover:bg-neutral-100'} font-medium transition-all`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </a>
            </Link>
          </li>
          <li>
            <Link href="/care-team">
              <a className={`flex items-center p-3 rounded-lg ${location === '/care-team' ? 'bg-primary-100 text-primary-800' : 'text-neutral-700 hover:bg-neutral-100'} transition-all`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Care Team
              </a>
            </Link>
          </li>
          <li>
            <Link href="/daily-steps">
              <a className={`flex items-center p-3 rounded-lg ${location === '/daily-steps' ? 'bg-primary-100 text-primary-800' : 'text-neutral-700 hover:bg-neutral-100'} transition-all`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Daily Steps
              </a>
            </Link>
          </li>
          <li>
            <Link href="/sccs-progress">
              <a className={`flex items-center p-3 rounded-lg ${location === '/sccs-progress' ? 'bg-primary-100 text-primary-800' : 'text-neutral-700 hover:bg-neutral-100'} transition-all`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
                SCCS Progress
              </a>
            </Link>
          </li>
          <li>
            <Link href="/journal">
              <a className={`flex items-center p-3 rounded-lg ${location === '/journal' ? 'bg-primary-100 text-primary-800' : 'text-neutral-700 hover:bg-neutral-100'} transition-all`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Journal
              </a>
            </Link>
          </li>
          <li>
            <Link href="/resources">
              <a className={`flex items-center p-3 rounded-lg ${location === '/resources' ? 'bg-primary-100 text-primary-800' : 'text-neutral-700 hover:bg-neutral-100'} transition-all`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Resources
              </a>
            </Link>
          </li>
          <li>
            <Link href="/ai-companion">
              <a className={`flex items-center p-3 rounded-lg ${location === '/ai-companion' ? 'bg-primary-100 text-primary-800' : 'text-neutral-700 hover:bg-neutral-100'} transition-all`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                AI Companion
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* User Information and Quick Exit */}
      <div className="mt-8 pt-4 border-t border-neutral-200">
        <div className="flex items-center p-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-400 text-white flex items-center justify-center font-medium">
            {getInitials()}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">
              {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}
            </p>
            <p className="text-xs text-neutral-500">
              {userData?.role === 'client' ? 'Client' : userData?.role || 'User'}
            </p>
          </div>
        </div>
        
        {/* Privacy Controls */}
        <div className="mt-4">
          <Link href="/privacy-settings">
            <a className="w-full flex items-center justify-between p-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-md transition-all">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Privacy Settings
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </Link>
        </div>
        
        {/* Quick Exit Button */}
        <button 
          className="mt-4 w-full p-3 rounded-lg text-danger flex items-center justify-center exit-button transition-all hover:text-white hover:bg-danger"
          onClick={handleQuickExit}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Quick Exit
        </button>
      </div>
    </div>
  );
}

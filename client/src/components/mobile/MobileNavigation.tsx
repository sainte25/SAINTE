import React from "react";
import { Link, useLocation } from "wouter";
import { 
  Home,
  Target,
  MessageCircle,
  Users,
  FileText,
  User
} from "lucide-react";

export default function MobileNavigation() {
  const [location] = useLocation();
  
  // Using fewer navigation items for a cleaner interface
  const navItems = [
    { 
      icon: Home, 
      label: "Home", 
      href: "/mobile",
      active: location === "/mobile" 
    },
    { 
      icon: Target, 
      label: "Goals", 
      href: "/mobile/goals",
      active: location === "/mobile/goals" 
    },
    { 
      icon: MessageCircle, 
      label: "Chat", 
      href: "/mobile/chat",
      active: location === "/mobile/chat" 
    },
    { 
      icon: Users, 
      label: "Care Team", 
      href: "/mobile/care-team",
      active: location === "/mobile/care-team" 
    },
    { 
      icon: User, 
      label: "Profile", 
      href: "/mobile/profile",
      active: location === "/mobile/profile" 
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 flex justify-around items-center px-4 py-2 z-10">
      {navItems.map((item, index) => (
        <Link 
          key={index} 
          href={item.href} 
          className={`flex flex-col items-center py-1 px-1 text-[10px] relative ${
            item.active 
              ? "text-white" 
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {item.active && (
            <span className="absolute -top-1 w-4 h-1 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.7)]"></span>
          )}
          <item.icon className={`w-5 h-5 mb-1 ${
            item.active 
              ? "text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
              : "text-gray-500"  
          }`} />
          <span className={item.active ? "text-blue-500" : ""}>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
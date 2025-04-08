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
      icon: FileText, 
      label: "Resources", 
      href: "/mobile/resources",
      active: location === "/mobile/resources" 
    },
    { 
      icon: User, 
      label: "Profile", 
      href: "/mobile/profile",
      active: location === "/mobile/profile" 
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-between items-center px-2 py-1 z-10">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <a className={`flex flex-col items-center py-1 px-2 text-xs ${
            item.active 
              ? "text-primary" 
              : "text-gray-500 hover:text-gray-700"
          }`}>
            <item.icon className={`w-5 h-5 mb-1 ${
              item.active ? "text-primary" : "text-gray-500"  
            }`} />
            <span>{item.label}</span>
          </a>
        </Link>
      ))}
    </div>
  );
}
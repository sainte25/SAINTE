import React from "react";
import { useLocation, Link } from "wouter";
import { 
  Home, 
  MessageCircle, 
  Target, 
  BookOpen, 
  User,
  SmilePlus
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
      icon: SmilePlus,
      label: "Mood",
      href: "/mobile/mood",
      active: location === "/mobile/mood"
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
      icon: BookOpen,
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-top-lg z-10">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a className={`flex flex-col items-center justify-center w-14 h-full ${
              item.active ? "text-primary" : "text-gray-500"
            }`}>
              <item.icon className={`w-5 h-5 ${
                item.active ? "text-primary" : "text-gray-500"
              }`} />
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
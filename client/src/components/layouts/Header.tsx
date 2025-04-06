import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Bell, 
  BarChart2, 
  Sun, 
  Moon,
  LineChart, 
  TrendingUp, 
  Newspaper, 
  Settings,
  ChevronDown,
  User,
  LogOut,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const [location] = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Check for saved theme preference or OS preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };
  
  const clearNotifications = () => {
    setNotificationCount(0);
  };
  
  // Mock user data - would come from authentication context in real app
  const user = {
    name: "Ankit Desai",
    initials: "AD",
    email: "ankit.d@example.com"
  };
  
  // Navigation items
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LineChart className="h-4 w-4 mr-1" /> },
    { href: "/strategies", label: "Strategies", icon: <TrendingUp className="h-4 w-4 mr-1" /> },
    { href: "/analytics", label: "Analytics", icon: <BarChart2 className="h-4 w-4 mr-1" /> },
    { href: "/news", label: "News", icon: <Newspaper className="h-4 w-4 mr-1" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="h-4 w-4 mr-1" /> }
  ];
  
  return (
    <header className="bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-white/10 p-1.5 rounded-md">
            <BarChart2 className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-bold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">FinMCP</span>
          </h1>
          <Badge variant="secondary" className="text-xs font-semibold">BETA</Badge>
        </div>
        
        {/* Search bar - only shown on larger screens */}
        <div className="hidden md:block relative max-w-md w-full mx-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-white/50" />
          </div>
          <Input 
            type="search" 
            placeholder="Search markets, news, strategies..." 
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
          />
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10"
            onClick={toggleTheme}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full hover:bg-white/10 relative"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="px-4 py-2 font-semibold border-b">
                Notifications
              </div>
              <div className="py-2 px-4 text-sm">
                <div className="mb-2 pb-2 border-b">
                  <div className="font-medium">Market Alert: Nifty crosses 19,500</div>
                  <div className="text-xs text-gray-500">10 minutes ago</div>
                </div>
                <div className="mb-2 pb-2 border-b">
                  <div className="font-medium">New Strategy: IT Sector Rotation</div>
                  <div className="text-xs text-gray-500">1 hour ago</div>
                </div>
                <div>
                  <div className="font-medium">Sentiment Analysis Updated</div>
                  <div className="text-xs text-gray-500">3 hours ago</div>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={clearNotifications} className="justify-center text-primary font-medium">
                Clear all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="pl-1 hover:bg-white/10 flex items-center space-x-2">
                <Avatar className="h-8 w-8 border-2 border-primary-light">
                  <AvatarFallback className="bg-primary-light text-white">
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block font-medium">{user.name}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2 text-sm">
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <nav className="bg-primary-dark/80 text-white border-t border-white/10">
        <div className="container mx-auto px-4">
          <ul className="flex overflow-x-auto hide-scrollbar">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>
                  <a className={`flex items-center whitespace-nowrap px-4 py-2 border-b-2 ${
                    location === item.href 
                      ? 'border-white font-medium' 
                      : 'border-transparent hover:border-white/50'
                  }`}>
                    {item.icon}
                    {item.label}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* CSS for hiding scrollbars is defined in index.css */}
    </header>
  );
}

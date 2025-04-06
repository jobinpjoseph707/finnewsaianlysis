import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { Bell, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  
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
    initials: "AD"
  };
  
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <BarChart className="h-5 w-5" />
          <h1 className="text-xl font-medium">FinMCP</h1>
          <Badge variant="secondary" className="text-xs">BETA</Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary-dark"
            onClick={toggleTheme}
          >
            <span className="material-icons">
              {darkMode ? 'dark_mode' : 'light_mode'}
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full hover:bg-primary-dark relative"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={clearNotifications}>
                Clear all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-sm font-medium">{user.initials}</span>
            </div>
            <span className="hidden md:block">{user.name}</span>
          </div>
        </div>
      </div>
      
      <nav className="bg-primary-dark text-white">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-1">
            <li>
              <Link href="/dashboard">
                <a className="inline-block px-4 py-2 border-b-2 border-white font-medium">Dashboard</a>
              </Link>
            </li>
            <li>
              <Link href="/strategies">
                <a className="inline-block px-4 py-2 border-b-2 border-transparent hover:border-white/50">Strategies</a>
              </Link>
            </li>
            <li>
              <Link href="/analytics">
                <a className="inline-block px-4 py-2 border-b-2 border-transparent hover:border-white/50">Analytics</a>
              </Link>
            </li>
            <li>
              <Link href="/news">
                <a className="inline-block px-4 py-2 border-b-2 border-transparent hover:border-white/50">News</a>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <a className="inline-block px-4 py-2 border-b-2 border-transparent hover:border-white/50">Settings</a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

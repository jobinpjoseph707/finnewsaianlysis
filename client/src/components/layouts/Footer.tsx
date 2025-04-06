import React from "react";
import { BarChart } from "lucide-react";

export default function Footer() {
  // System version - in a real app this would be fetched from API
  const systemVersion = "0.8.2 Beta";
  
  return (
    <footer className="bg-neutral-dark text-white py-4 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <BarChart className="mr-2 h-5 w-5" />
              <span className="font-medium">FinMCP</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">AI-Powered Financial Agent for India</div>
          </div>
          
          <div className="text-sm text-gray-400">
            Powered by Model Context Protocol (MCP) •
            <span> Version {systemVersion}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

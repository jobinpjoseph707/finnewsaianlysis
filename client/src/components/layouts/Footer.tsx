import React from "react";
import { BarChart2, Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Footer() {
  // System version - in a real app this would be fetched from API
  const systemVersion = "0.9.1 Beta";
  
  // Footer links
  const links = [
    { label: "About", href: "/about" },
    { label: "Documentation", href: "/docs" },
    { label: "API Access", href: "/api-docs" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" }
  ];
  
  // Current year for copyright
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-primary/90 to-primary text-white py-8 mt-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-white/10 p-1.5 rounded-md mr-2">
                <BarChart2 className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">FinMCP</span>
            </div>
            <p className="text-sm text-white/70 mb-4">
              AI-Powered Financial Agent for Indian Markets using Model Context Protocol for real-time data and context-aware investment strategies.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-white/10 hover:bg-white/20">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-white/10 hover:bg-white/20">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-white/10 hover:bg-white/20">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <a className="text-white/70 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* MCP Status */}
          <div>
            <h3 className="font-semibold text-white mb-4">MCP System Status</h3>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">API Status</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Operational</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Market Data</span>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">MCP Version</span>
                <span className="text-xs font-mono">{systemVersion}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
          <div>
            © {currentYear} FinMCP. All rights reserved.
          </div>
          <div className="mt-2 md:mt-0">
            Powered by Model Context Protocol (MCP)
          </div>
        </div>
      </div>
    </footer>
  );
}

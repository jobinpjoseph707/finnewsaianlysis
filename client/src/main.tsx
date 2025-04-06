import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set page title
document.title = "FinMCP - AI-Powered Financial Agent for India";

// Add material icons link if not present already
if (!document.querySelector('link[href*="material-icons"]')) {
  const link = document.createElement('link');
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

// Add Roboto font if not present already
if (!document.querySelector('link[href*="Roboto"]')) {
  const link = document.createElement('link');
  link.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Mono&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

createRoot(document.getElementById("root")!).render(<App />);

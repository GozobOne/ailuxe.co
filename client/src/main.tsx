import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/luxury-theme.css";

// Mount React app
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

console.log("Mounting React app...");

createRoot(rootElement).render(<App />);

console.log("React app mounted successfully!");

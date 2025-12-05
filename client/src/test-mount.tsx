import { createRoot } from "react-dom/client";

console.log("Test script started");

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found!");
} else {
  console.log("Root element found, mounting...");
  
  try {
    createRoot(rootElement).render(
      <div style={{ color: 'white', padding: '50px', fontSize: '24px' }}>
        <h1>TEST - React is working!</h1>
        <p>If you see this, React is mounting correctly.</p>
      </div>
    );
    console.log("React mounted successfully!");
  } catch (error) {
    console.error("Error mounting React:", error);
  }
}

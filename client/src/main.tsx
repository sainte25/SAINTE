import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/dashboard.css";

// Add metadata to ensure proper viewport settings
document.head.innerHTML += `
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
  <title>SAINTE Platform - Client Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
`;

createRoot(document.getElementById("root")!).render(<App />);

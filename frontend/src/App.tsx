import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
// import { useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FinancialSaathi from "./pages/FinancialSaathi";
import { useState } from "react"; // Add this import
import VoiceAssistant from "./components/VoiceAssistant"; // Add this import

// import VoiceAssistant from "./components/VoiceAssistant"; // Import your voice assistant

const queryClient = new QueryClient();

const App = () => {
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chat" element={<FinancialSaathi />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Floating Voice Assistant - Available on all pages */}
            <VoiceAssistant 
              isOpen={isVoiceAssistantOpen}
              onToggle={() => setIsVoiceAssistantOpen(!isVoiceAssistantOpen)}
            />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
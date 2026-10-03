"use client";
import React, { createContext, useContext, useState } from "react";
import { ConversationProvider } from "@elevenlabs/react";

interface VoiceAgentContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openAgent: () => void;
}

const VoiceAgentContext = createContext<VoiceAgentContextType | undefined>(undefined);

export function VoiceAgentProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openAgent = () => setIsOpen(true);

  return (
    <ConversationProvider>
      <VoiceAgentContext.Provider value={{ isOpen, setIsOpen, openAgent }}>
        {children}
      </VoiceAgentContext.Provider>
    </ConversationProvider>
  );
}

export function useVoiceAgent() {
  const context = useContext(VoiceAgentContext);
  if (context === undefined) {
    throw new Error("useVoiceAgent must be used within a VoiceAgentProvider");
  }
  return context;
}

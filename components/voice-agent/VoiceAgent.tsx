"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useConversation } from "@elevenlabs/react";
import { Mic, MicOff, PhoneOff, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useVoiceAgent } from "./VoiceAgentContext";
import { usePortfolioActions } from "@/lib/hooks/usePortfolioActions";

export function VoiceAgent() {
  const { isOpen, setIsOpen } = useVoiceAgent();
  const [isMuted, setIsMuted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const actions = usePortfolioActions();

  // Suppress noisy LiveKit HMR disconnect errors in development overlay
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (typeof args[0] === 'string' && (args[0].includes('DataChannel error on lossy: User-Initiated Abort') || args[0].includes('error reading from signal stream'))) {
          return;
        }
        originalConsoleError(...args);
      };
      return () => {
        console.error = originalConsoleError;
      };
    }
  }, []);

  const triggerFeedback = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      setPermissionDenied(false);
    },
    onDisconnect: () => {
      console.log("Disconnected");
    },
    onError: (error) => {
      console.error("ElevenLabs Error:", error);
      if (typeof error === 'string' && error.toLowerCase().includes('microphone')) {
        setPermissionDenied(true);
      } else {
        setPermissionDenied(true); 
      }
    },
    clientTools: {
      navigate_to_section: async ({ sectionId }: { sectionId: string }) => {
        triggerFeedback(`Navigating to ${sectionId}...`);
        return actions.navigateToSection(sectionId);
      },
      show_project: async ({ projectId }: { projectId: string }) => {
        triggerFeedback(`Opening project ${projectId}...`);
        return actions.showProject(projectId);
      },
      show_project_section: async ({ projectId, section }: { projectId: string, section: string }) => {
        triggerFeedback(`Showing ${section} section...`);
        return actions.showProjectSection(projectId, section);
      },
      show_project_visual: async ({ projectId, visualIndex }: { projectId: string, visualIndex: number }) => {
        triggerFeedback(`Showing project visual...`);
        return actions.showProjectVisual(projectId, visualIndex);
      },
      start_portfolio_tour: async () => {
        triggerFeedback("Starting portfolio tour...");
        return actions.startPortfolioTour();
      },
      open_resume: async () => {
        triggerFeedback("Opening resume...");
        return actions.openResume();
      },
      open_github: async () => {
        triggerFeedback("Opening GitHub...");
        return actions.openGitHub();
      },
      open_linkedin: async () => {
        triggerFeedback("Opening LinkedIn...");
        return actions.openLinkedIn();
      },
      open_email: async () => {
        triggerFeedback("Opening email...");
        return actions.openEmail();
      }
    }
  });

  const { status, isSpeaking } = conversation;

  const toggleConversation = useCallback(async () => {
    if (status === "connected" || status === "connecting") {
      await conversation.endSession();
    } else {
      setPermissionDenied(false);
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation.startSession({
          agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "",
        });
      } catch (error) {
        console.error("Failed to start session:", error);
        setPermissionDenied(true);
      }
    }
  }, [conversation, status]);

  const toggleMute = async () => {
    try {
      await conversation.setVolume({ volume: isMuted ? 1 : 0 });
      setIsMuted(!isMuted);
    } catch (e) {
      console.error(e);
    }
  };

  let displayState = "Talk to LUNA";
  let pulseColor = "bg-primary";
  if (status === "connecting") {
    displayState = "Connecting...";
    pulseColor = "bg-yellow-500";
  } else if (status === "connected") {
    if (isSpeaking) {
      displayState = "I'm speaking...";
      pulseColor = "bg-purple-500";
    } else {
      displayState = "I'm listening...";
      pulseColor = "bg-green-500";
    }
  } else if (permissionDenied) {
    displayState = "Something went wrong";
    pulseColor = "bg-red-500";
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_rgba(129,140,248,0.4)] hover:shadow-[0_0_30px_rgba(129,140,248,0.6)] transition-all hover:scale-105 active:scale-95"
            aria-label="Open LUNA"
          >
            <Sparkles className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-[350px] glass-panel bg-background/95 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          >
            <div className="p-6 flex flex-col items-center">
              <div className="relative mb-6">
                <div className={`absolute inset-0 rounded-full blur-xl opacity-50 ${pulseColor} ${status === 'connected' ? 'animate-pulse' : ''}`} />
                <div className={`w-24 h-24 rounded-full flex items-center justify-center relative bg-background border border-white/10 z-10 ${status === 'connected' ? (isSpeaking ? 'scale-110 transition-transform' : 'scale-100') : ''}`}>
                  {status === "connecting" ? (
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  ) : permissionDenied ? (
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  ) : (
                    <Sparkles className={`w-10 h-10 ${isSpeaking ? 'text-purple-500' : 'text-primary'}`} />
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-1 text-center">LUNA</h3>
              <p className="text-xs text-muted-foreground text-center mb-1">Rahul&apos;s Virtual Assistant</p>
              <p className="text-sm text-primary mb-2 min-h-[1.25rem] text-center font-medium tracking-wide">{displayState}</p>
              
              <div className="h-6 mb-6 flex items-center justify-center">
                <AnimatePresence>
                  {actionFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-xs font-medium bg-primary/20 text-primary px-3 py-1 rounded-full"
                    >
                      {actionFeedback}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {permissionDenied && (
                <p className="text-xs text-red-400 text-center mb-6 px-4">
                  Unable to connect. Microphone access is required to talk to the AI. Please allow access or try again.
                </p>
              )}

              {status === "disconnected" && !permissionDenied && (
                <div className="text-center px-4 mb-6 w-full">
                  <p className="text-xs text-muted-foreground mb-4">I need microphone access so we can chat about Rahul&apos;s portfolio.</p>
                  <button
                    onClick={toggleConversation}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-full font-medium transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                  >
                    Start Conversation
                  </button>
                </div>
              )}

              {(status === "connected" || status === "connecting") && (
                <div className="flex items-center gap-4 w-full px-4">
                  <button
                    onClick={toggleMute}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-colors"
                  >
                    {isMuted ? <MicOff className="w-5 h-5 text-muted-foreground" /> : <Mic className="w-5 h-5 text-foreground" />}
                  </button>
                  <button
                    onClick={toggleConversation}
                    className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-full flex items-center justify-center transition-colors group"
                  >
                    <PhoneOff className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              )}

              {status === "disconnected" && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full mt-2 py-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {permissionDenied ? 'Close' : 'Cancel'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

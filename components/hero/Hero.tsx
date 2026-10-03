"use client";

import { motion } from "framer-motion";
import { Mic, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { useVoiceAgent } from "@/components/voice-agent/VoiceAgentContext";
import { personalInfo } from "@/data/portfolio";

export function Hero() {
  const { openAgent } = useVoiceAgent();
  
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-muted-foreground mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          LUNA Available
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          Hi, I&apos;m <span className="gradient-text">Rahul Srikanth</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-3xl font-medium text-foreground/80 mb-6"
        >
          AI / Software Developer
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-2xl text-lg text-muted-foreground mb-10"
        >
          Building intelligent applications, AI-powered experiences, and practical software solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button onClick={openAgent} className="w-full sm:w-auto group relative flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(129,140,248,0.3)] hover:shadow-[0_0_30px_rgba(129,140,248,0.5)]">
            <Mic className="w-5 h-5 group-hover:animate-pulse" />
            <span>Talk to LUNA</span>
          </button>

          <Link
            href="#projects"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-foreground font-medium rounded-full transition-colors"
          >
            <span>View Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={personalInfo.resumeAvailable ? personalInfo.resumePath : "#"}
            target={personalInfo.resumeAvailable ? "_blank" : "_self"}
            rel={personalInfo.resumeAvailable ? "noopener noreferrer" : ""}
            onClick={(e) => {
              if (!personalInfo.resumeAvailable) {
                e.preventDefault();
                alert("Resume PDF not yet uploaded to /public/resume/resume.pdf");
              }
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-transparent hover:bg-white/5 text-foreground font-medium rounded-full transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Resume</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

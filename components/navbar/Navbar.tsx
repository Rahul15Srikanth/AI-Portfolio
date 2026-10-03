"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, FileText, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoiceAgent } from "@/components/voice-agent/VoiceAgentContext";
import { personalInfo } from "@/data/portfolio";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Education", href: "#education" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openAgent } = useVoiceAgent();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-white/10 py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="text-xl font-bold tracking-tighter">
            RS<span className="text-primary">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
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
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Resume</span>
            </a>
            <button onClick={openAgent} className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-full transition-all">
              <Mic className="w-4 h-4" />
              <span className="text-sm font-medium">LUNA</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-white/10 p-4 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg font-medium text-foreground p-2 hover:bg-white/5 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          <div className="flex flex-col gap-3">
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
              className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-foreground font-medium"
            >
              <FileText className="w-5 h-5" />
              Resume
            </a>
            <button onClick={() => { setMobileMenuOpen(false); openAgent(); }} className="flex items-center justify-center gap-2 w-full py-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-md transition-all font-medium">
              <Mic className="w-5 h-5" />
              Talk to LUNA
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

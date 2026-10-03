import { FileText } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/GithubIcon";
import { LinkedinIcon as Linkedin } from "@/components/icons/LinkedinIcon";
import { personalInfo } from "@/data/portfolio";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold tracking-tight text-foreground">{personalInfo.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{personalInfo.title}</p>
          </div>

          <div className="flex items-center gap-4">
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
              <Github className="w-4 h-4" />
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#0A66C2] transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="/resume/resume.pdf" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
              <FileText className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5 text-center flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Built with Next.js, Framer Motion, and AI.
          </p>
        </div>
      </div>
    </footer>
  );
}

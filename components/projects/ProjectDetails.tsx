"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/data/projects";
import { X, ExternalLink, Code2, AlertCircle, Target, Zap, Wrench, Rocket, Cpu } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/GithubIcon";
import { useEffect } from "react";
import { ProjectGallery } from "./ProjectGallery";
import { ProjectArchitecture } from "./ProjectArchitecture";

interface ProjectDetailsProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetails({ project, onClose }: ProjectDetailsProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && project) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  // Listen for AI section scroll events
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const customEvent = e as CustomEvent<{ section: string }>;
      const sectionId = `section-${customEvent.detail.section}`;
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-4", "ring-primary", "rounded-xl", "transition-all", "duration-500", "scale-[1.02]");
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-primary", "scale-[1.02]");
        }, 3000);
      }
    };
    window.addEventListener("scroll-project-section", handleScroll);
    return () => window.removeEventListener("scroll-project-section", handleScroll);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-background/95 glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-background/80 backdrop-blur-xl z-20">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-white/10 text-muted-foreground rounded-full mb-2 inline-block">
                {project.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">{project.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-6 md:p-8 space-y-12">
            
            {/* Visuals Gallery */}
            <div className="w-full">
              {project.visuals && project.visuals.length > 0 ? (
                <ProjectGallery visuals={project.visuals} />
              ) : (
                <div className="w-full h-64 md:h-96 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 flex flex-col items-center justify-center border border-white/5 text-center px-4">
                  <Code2 className="w-16 h-16 text-white/10 mb-4" />
                  <p className="text-muted-foreground text-sm">Visuals placeholder.</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">Add screenshots to /public/projects/ and update projects.ts to see them here.</p>
                </div>
              )}
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl !== "YOUR_GITHUB_URL" ? project.githubUrl : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-foreground font-medium rounded-full transition-colors border border-white/10"
                  onClick={(e) => project.githubUrl === "YOUR_GITHUB_URL" && e.preventDefault()}
                >
                  <Github className="w-5 h-5" />
                  <span>View Source</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(129,140,248,0.3)] hover:shadow-[0_0_30px_rgba(129,140,248,0.5)]"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>

            {/* Grid Layout for details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {project.overview && (
                  <section id="section-overview" className="p-2 -m-2">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
                      <Target className="w-5 h-5 text-primary" /> Overview
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{project.overview}</p>
                  </section>
                )}
                
                {project.problem && (
                  <section id="section-problem" className="p-2 -m-2">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
                      <AlertCircle className="w-5 h-5 text-red-400" /> The Problem
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{project.problem}</p>
                  </section>
                )}
                
                {project.solution && (
                  <section id="section-solution" className="p-2 -m-2">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
                      <Zap className="w-5 h-5 text-yellow-400" /> The Solution
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
                  </section>
                )}

                {project.howItWorks && (
                  <section id="section-howItWorks" className="p-2 -m-2">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
                      <Wrench className="w-5 h-5 text-blue-400" /> How It Works
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{project.howItWorks}</p>
                  </section>
                )}

                {project.architecture && project.architecture.length > 0 && (
                  <section id="section-architecture" className="p-2 -m-2">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-foreground">
                      <Cpu className="w-5 h-5 text-emerald-400" /> Architecture Flow
                    </h3>
                    <ProjectArchitecture steps={project.architecture} />
                  </section>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                <section id="section-technologies" className="p-6 rounded-2xl bg-white/5 border border-white/5">
                  <h3 className="font-bold mb-4 text-foreground">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="text-xs font-medium px-2.5 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>

                {project.goal && (
                  <section id="section-goal" className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h3 className="font-bold mb-3 text-foreground">Project Goal</h3>
                    <p className="text-sm text-muted-foreground">{project.goal}</p>
                  </section>
                )}

                {project.useCase && (
                  <section id="section-useCase" className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h3 className="font-bold mb-3 text-foreground">Use Case</h3>
                    <p className="text-sm text-muted-foreground">{project.useCase}</p>
                  </section>
                )}

                {project.futureUpgrades && project.futureUpgrades.length > 0 && (
                  <section id="section-futureUpgrades" className="p-6 rounded-2xl bg-white/5 border border-white/5">
                    <h3 className="font-bold flex items-center gap-2 mb-3 text-foreground">
                      <Rocket className="w-4 h-4 text-purple-400" /> Future Upgrades
                    </h3>
                    <ul className="space-y-2">
                      {project.futureUpgrades.map((upgrade, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          {upgrade}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { projectsData, Project } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetails } from "./ProjectDetails";

export function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const handleOpenProject = (e: Event) => {
      const customEvent = e as CustomEvent;
      const projectId = customEvent.detail?.projectId;
      const proj = projectsData.find(p => p.id === projectId);
      if (proj) setSelectedProject(proj);
    };
    window.addEventListener("open-project", handleOpenProject);
    return () => window.removeEventListener("open-project", handleOpenProject);
  }, []);

  return (
    <section id="projects" className="py-24 bg-white/5 relative">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Featured <span className="text-primary">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of my recent work focusing on AI, data, and full-stack development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projectsData.map((project, idx) => (
            <div key={project.id} id={`project-${project.id}`} className="h-full">
              <ProjectCard 
                project={project} 
                index={idx} 
                onClick={() => setSelectedProject(project)} 
              />
            </div>
          ))}
        </div>
      </div>

      <ProjectDetails 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
}

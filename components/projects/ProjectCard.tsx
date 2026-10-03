"use client";
import { motion } from "framer-motion";
import { Project } from "@/data/projects";
import { Code2, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="group relative glass-panel rounded-3xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 flex flex-col h-full cursor-pointer"
    >
      <div className="h-48 w-full bg-gradient-to-br from-white/5 to-white/10 relative overflow-hidden flex items-center justify-center">
        {project.visuals && project.visuals.length > 0 ? (
          <img src={project.visuals[0].src} alt={project.visuals[0].alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <Code2 className="w-16 h-16 text-white/10 group-hover:scale-110 group-hover:text-primary/40 transition-all duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      
      <div className="p-8 flex flex-col flex-grow relative z-10 -mt-10">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-2xl font-bold text-foreground">{project.title}</h3>
          <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 bg-white/10 text-muted-foreground rounded-full whitespace-nowrap ml-2">
            {project.category}
          </span>
        </div>
        <p className="text-muted-foreground mb-6 flex-grow text-sm leading-relaxed">{project.shortDescription}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.technologies.slice(0, 4).map(tech => (
            <span key={tech} className="text-xs font-medium px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="text-xs font-medium px-2.5 py-1 bg-white/5 text-muted-foreground border border-white/10 rounded-full">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
            View Details
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}

"use client";
import { motion } from "framer-motion";
import { personalInfo } from "@/data/portfolio";
import { Mail, FileText } from "lucide-react";
import { GithubIcon as Github } from "@/components/icons/GithubIcon";
import { LinkedinIcon as Linkedin } from "@/components/icons/LinkedinIcon";

export function Contact() {
  return (
    <section id="contact" className="py-24 relative bg-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Whether you have a question, a project idea, or just want to say hi, I will try my best to get back to you!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center max-w-3xl mx-auto">
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 hover:-translate-y-1 hover:border-primary/50 transition-all group">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <Github className="w-6 h-6 text-foreground" />
              </div>
              <span className="font-medium text-foreground">GitHub</span>
            </a>
            
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 hover:-translate-y-1 hover:border-[#0A66C2]/50 transition-all group">
              <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-full flex items-center justify-center group-hover:bg-[#0A66C2]/20 transition-colors">
                <Linkedin className="w-6 h-6 text-[#0A66C2]" />
              </div>
              <span className="font-medium text-foreground">LinkedIn</span>
            </a>

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
              className="glass-panel p-6 rounded-2xl flex flex-col items-center gap-4 hover:-translate-y-1 hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium text-foreground">Resume</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

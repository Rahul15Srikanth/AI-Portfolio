"use client";
import { motion } from "framer-motion";
import { experienceData } from "@/data/experience";
import { Briefcase } from "lucide-react";

export function Experience() {
  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Professional <span className="text-primary">Experience</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              My journey and roles in the tech industry.
            </p>
          </div>

          <div className="space-y-12">
            {experienceData.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pl-8 md:pl-0"
              >
                <div className="hidden md:block absolute left-1/2 top-0 bottom-[-3rem] w-px bg-white/10 -translate-x-1/2" />
                
                <div className="md:grid md:grid-cols-2 gap-12 items-center">
                  <div className="md:text-right mb-6 md:mb-0 relative">
                    <h3 className="text-2xl font-bold text-foreground">{exp.role}</h3>
                    <p className="text-xl text-primary font-medium">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mt-2">{exp.duration}</p>
                  </div>
                  
                  <div className="absolute left-[-0.3rem] md:left-1/2 top-1 md:top-1/2 w-4 h-4 md:w-8 md:h-8 bg-background border-2 border-primary rounded-full md:-translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(129,140,248,0.5)]">
                     <Briefcase className="w-4 h-4 text-primary hidden md:block" />
                  </div>

                  <div className="glass-panel p-6 md:p-8 rounded-2xl relative hover:border-primary/30 transition-colors">
                    <h4 className="text-sm font-semibold text-foreground/80 mb-4 uppercase tracking-wider">Key Focus Areas</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {exp.focus.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";
import { educationData } from "@/data/education";
import { GraduationCap, MapPin } from "lucide-react";

export function Education() {
  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Education
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            My academic background and qualifications.
          </p>

          <div className="space-y-6">
            {educationData.map((edu, idx) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-3xl relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
                    <div className="p-4 bg-primary/10 rounded-2xl flex-shrink-0">
                      <GraduationCap className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{edu.degree}</h3>
                      <p className="text-xl text-primary font-medium">{edu.institution}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground bg-white/5 px-4 py-2 rounded-full whitespace-nowrap">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{edu.location}</span>
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

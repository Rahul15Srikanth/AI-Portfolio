"use client";
import { motion } from "framer-motion";
import { personalInfo } from "@/data/portfolio";
import { Code, Lightbulb, Database } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">
            About <span className="text-primary">Me</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 text-lg text-muted-foreground leading-relaxed space-y-6">
              <p>{personalInfo.aboutText}</p>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
                <Code className="w-8 h-8 text-primary" />
                <h3 className="font-semibold text-foreground">Software Dev</h3>
                <p className="text-sm text-muted-foreground">Building scalable applications and platforms.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
                <Lightbulb className="w-8 h-8 text-primary" />
                <h3 className="font-semibold text-foreground">Generative AI</h3>
                <p className="text-sm text-muted-foreground">Engineering intelligent conversational agents.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-transform">
                <Database className="w-8 h-8 text-primary" />
                <h3 className="font-semibold text-foreground">Data Science</h3>
                <p className="text-sm text-muted-foreground">Analyzing data to drive insights and solutions.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

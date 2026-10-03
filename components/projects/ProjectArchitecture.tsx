"use client";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

interface ProjectArchitectureProps {
  steps: string[];
}

export function ProjectArchitecture({ steps }: ProjectArchitectureProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="flex flex-col items-center py-4">
      {steps.map((step, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-center text-sm font-medium shadow-lg min-w-[200px]"
          >
            {step}
          </motion.div>
          {idx < steps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ opacity: 1, height: "2rem" }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 + 0.1 }}
              className="h-8 flex items-center justify-center text-primary/50 my-1"
            >
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

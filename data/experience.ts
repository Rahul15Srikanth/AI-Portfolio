export interface Experience {
  id: string;
  role: string;
  company: string;
  duration: string;
  focus: string[];
}

export const experienceData: Experience[] = [
  {
    id: "voxy-ai-intern",
    role: "Prompt Engineering Intern",
    company: "Voxy",
    duration: "2026 - Present",
    focus: [
      "Healthcare voice agents",
      "Conversational AI",
      "System prompt optimization",
      "Multilingual interactions",
      "Low-latency inference",
      "Git-based version control & testing",
    ],
  },
  {
    id: "deffo-tech-intern",
    role: "AI / NLP Data Intern",
    company: "Deffo Tech",
    duration: "2026",
    focus: [
      "Tamil language datasets for LLMs",
      "NLP preprocessing & tokenization",
      "Dataset curation & preparation",
      "Regional language model development",
      "Scalable AI workflows",
    ],
  },
  {
    id: "nullclass-intern",
    role: "Data Analytics Intern",
    company: "NullClass",
    duration: "2025",
    focus: [
      "Data Analytics & Preparation",
      "Microsoft Excel & Power BI",
      "Data cleaning & transformation",
      "Interactive Power BI dashboards",
      "Front-end UI (HTML/CSS)",
    ],
  }
];

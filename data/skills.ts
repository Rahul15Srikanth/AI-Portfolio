export interface SkillCategory {
  title: string;
  skills: string[];
}

export const skillsData: SkillCategory[] = [
  {
    title: "Programming",
    skills: ["Python", "JavaScript", "TypeScript", "Java", "SQL"],
  },
  {
    title: "Frontend",
    skills: ["React", "Next.js", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "Flask", "REST APIs"],
  },
  {
    title: "AI / ML",
    skills: [
      "Machine Learning",
      "NLP",
      "Generative AI",
      "LLMs",
      "Prompt Engineering",
      "Computer Vision",
    ],
  },
  {
    title: "Data",
    skills: ["SQL", "Power BI", "Excel", "Data Analysis"],
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "VS Code", "Docker"],
  },
];

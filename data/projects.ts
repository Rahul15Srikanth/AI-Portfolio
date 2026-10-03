export interface ProjectVisual {
  src: string;
  alt: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  category: string;
  featured: boolean;
  technologies: string[];
  goal?: string;
  useCase?: string;
  problem?: string;
  solution?: string;
  overview?: string;
  howItWorks?: string;
  architecture?: string[]; // Array of steps for the visual flow
  futureUpgrades?: string[];
  challenges?: string;
  outcomes?: string;
  githubUrl?: string;
  liveUrl?: string;
  visuals?: ProjectVisual[];
  videoUrl?: string;
  tags?: string[];
}

export const projectsData: Project[] = [
  {
    id: "skill-gap-analyzer",
    title: "Skill Gap Analyzer",
    shortDescription: "An intelligent system that processes PDFs to extract skills and generates relevant MCQs to analyze user proficiency.",
    category: "AI & Full-Stack",
    featured: true,
    technologies: ["Flask", "Python", "HTML/CSS/JS", "SQLite", "PDF Processing"],
    githubUrl: "YOUR_GITHUB_URL",
    overview: "A comprehensive platform that helps users identify their skill gaps by analyzing their resume (PDF) and testing them with dynamically generated multiple-choice questions.",
    problem: "Traditional skill assessment requires manual test creation and doesn't adapt to an individual's specific background.",
    solution: "Automated the extraction of skills from resumes using NLP and integrated an MCQ generator to dynamically assess proficiency.",
    visuals: [{ src: "/projects/skill_gap_analyzer.png", alt: "Skill Gap Analyzer UI Dashboard" }],
  },
  {
    id: "smart-pet-registration",
    title: "Smart Pet Registration & Adoption System",
    shortDescription: "Computer vision powered pet platform featuring image classification for breed detection using Groq/Llama vision models.",
    category: "Computer Vision",
    featured: true,
    technologies: ["Flask", "EfficientNetB0", "Computer Vision", "Groq/Llama"],
    githubUrl: "YOUR_GITHUB_URL",
    overview: "A modern platform that simplifies pet adoption and registration by automatically identifying pet breeds from uploaded photos.",
    problem: "Manual entry of pet breeds is prone to errors, and shelters need a streamlined way to catalog animals.",
    solution: "Integrated a custom-trained EfficientNetB0 model and Groq/Llama vision APIs to accurately classify pet breeds in real-time.",
    visuals: [{ src: "/projects/pet_adoption.png", alt: "Pet Adoption Dashboard with Breed Classification" }],
  },
  {
    id: "employee-management",
    title: "Employee Management System",
    shortDescription: "A robust backend system for managing employee records, authentication, and organizational data.",
    category: "Backend",
    featured: false,
    technologies: ["Spring Boot", "Java", "JPA"],
    githubUrl: "YOUR_GITHUB_URL",
    overview: "A scalable enterprise backend application that handles employee lifecycle management, role-based access control, and secure data storage.",
    visuals: [{ src: "/projects/employee_management.png", alt: "Employee Management System Interface" }],
  },
  {
    id: "spotify-data-analyzer",
    title: "Spotify Data Analyzer",
    shortDescription: "Data analysis project to uncover insights, trends, and patterns from Spotify listening history.",
    category: "Data Science",
    featured: true,
    technologies: ["Python", "Data Analysis", "Pandas", "Matplotlib"],
    githubUrl: "YOUR_GITHUB_URL",
    overview: "An exploratory data analysis pipeline that ingests raw JSON data from Spotify exports and visualizes personal listening trends.",
    visuals: [{ src: "/projects/spotify_data.png", alt: "Spotify Data Analysis Charts" }],
  },
  {
    id: "population-detection",
    title: "Population Detection using PLNN",
    shortDescription: "Machine learning model to detect and predict population patterns using a Probabilistic Logic Neural Network.",
    category: "Machine Learning",
    featured: false,
    technologies: ["Machine Learning", "PLNN", "Python"],
    githubUrl: "YOUR_GITHUB_URL",
    overview: "A specialized ML research project focusing on applying Probabilistic Logic Neural Networks to spatial population datasets.",
    visuals: [{ src: "/projects/population_detection.png", alt: "Population Detection Neural Network Visualization" }],
  }
];

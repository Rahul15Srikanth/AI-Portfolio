"use client";
import { personalInfo } from "@/data/portfolio";
import { projectsData } from "@/data/projects";

const ALLOWED_SECTIONS = ["hero", "about", "experience", "projects", "skills", "education", "contact"];
const ALLOWED_PROJECT_SECTIONS = ["overview", "goal", "useCase", "problem", "solution", "howItWorks", "architecture", "futureUpgrades", "technologies"];

export function usePortfolioActions() {
  const navigateToSection = (sectionId: string): string => {
    if (!ALLOWED_SECTIONS.includes(sectionId)) {
      return `Failed: Section '${sectionId}' is not allowed or does not exist.`;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return `Successfully navigated to ${sectionId} section.`;
    }
    return `Failed: Section '${sectionId}' not found on the page.`;
  };

  const showProject = (projectId: string): string => {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return `Failed: Project '${projectId}' does not exist.`;
    
    navigateToSection("projects");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("open-project", { detail: { projectId } }));
    }, 500);
    return `Successfully opened project: ${project.title}.`;
  };

  const showProjectSection = (projectId: string, section: string): string => {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return `Failed: Project '${projectId}' does not exist.`;
    if (!ALLOWED_PROJECT_SECTIONS.includes(section)) return `Failed: Project section '${section}' is not allowed.`;
    
    // Ensure the modal is open first
    window.dispatchEvent(new CustomEvent("open-project", { detail: { projectId } }));
    
    // Tell the modal to scroll to the specific section
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("scroll-project-section", { detail: { section } }));
    }, 600); // Give modal time to mount
    
    return `Successfully navigated to the ${section} section of project ${project.title}.`;
  };

  const showProjectVisual = (projectId: string, visualIndex: number): string => {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return `Failed: Project '${projectId}' does not exist.`;
    if (!project.visuals || visualIndex < 0 || visualIndex >= project.visuals.length) {
      return `Failed: Visual index ${visualIndex} does not exist for project ${project.title}.`;
    }

    // Ensure the modal is open first
    window.dispatchEvent(new CustomEvent("open-project", { detail: { projectId } }));
    
    // Tell the modal gallery to jump to the visual
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("show-project-visual", { detail: { visualIndex } }));
    }, 600);
    
    return `Successfully displayed visual ${visualIndex} for project ${project.title}.`;
  };

  const startPortfolioTour = (): string => {
    return `Tour started. Suggested sequence: hero -> about -> experience -> projects -> skills -> education -> contact. Please navigate step by step.`;
  };

  const highlightProject = (projectId: string): string => {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return `Failed: Project '${projectId}' does not exist.`;

    navigateToSection(`project-${projectId}`);
    setTimeout(() => {
      const el = document.getElementById(`project-${projectId}`);
      if (el) {
        el.classList.add("ring-4", "ring-primary", "scale-105");
        setTimeout(() => {
          el.classList.remove("ring-4", "ring-primary", "scale-105");
        }, 3000);
      }
    }, 500);
    return `Highlighted project: ${project.title}`;
  };

  const openResume = (): string => {
    if (personalInfo.resumeAvailable) {
      window.open(personalInfo.resumePath, "_blank");
      return "Successfully opened the resume in a new tab.";
    }
    return "The resume file is not currently available.";
  };

  const openGitHub = (): string => {
    window.open(personalInfo.github, "_blank");
    return "Successfully opened GitHub in a new tab.";
  };

  const openLinkedIn = (): string => {
    window.open(personalInfo.linkedin, "_blank");
    return "Successfully opened LinkedIn in a new tab.";
  };

  const openEmail = (): string => {
    window.location.href = `mailto:${personalInfo.email}`;
    return "Successfully opened the default email client.";
  };

  const scrollToTop = (): string => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return "Scrolled to the top of the page.";
  };

  return {
    navigateToSection,
    showProject,
    showProjectSection,
    showProjectVisual,
    startPortfolioTour,
    highlightProject,
    openResume,
    openGitHub,
    openLinkedIn,
    openEmail,
    scrollToTop
  };
}

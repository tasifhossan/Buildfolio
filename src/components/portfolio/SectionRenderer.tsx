import React from "react";
import { HeroSection, HeroContentSchema } from "./sections/HeroSection";
import { AboutSection, AboutContentSchema } from "./sections/AboutSection";
import { ProjectsSection, ProjectsContentSchema } from "./sections/ProjectsSection";
import { ContactSection, ContactContentSchema } from "./sections/ContactSection";

export interface Section {
  type: string;
  content: unknown;
}

interface SectionRendererProps {
  section: Section;
  onCtaClick?: () => void; // Optional handler to navigate when CTA button is clicked
}

export function SectionRenderer({ section, onCtaClick }: SectionRendererProps) {
  // Safe validation wrapper to catch malformed data and prevent layout crashes
  try {
    switch (section.type.toLowerCase()) {
      case "hero": {
        const validatedContent = HeroContentSchema.parse(section.content || {});
        return <HeroSection content={validatedContent} onCtaClick={onCtaClick} />;
      }
      case "about": {
        const validatedContent = AboutContentSchema.parse(section.content || {});
        return <AboutSection content={validatedContent} />;
      }
      case "projects": {
        const validatedContent = ProjectsContentSchema.parse(section.content || {});
        return <ProjectsSection content={validatedContent} />;
      }
      case "contact": {
        const validatedContent = ContactContentSchema.parse(section.content || {});
        return <ContactSection content={validatedContent} />;
      }
      default:
        // If the type doesn't match any known component, render nothing and log a warning
        console.warn(`[SectionRenderer] Unrecognized section type encountered: "${section.type}". Section was skipped.`);
        return null;
    }
  } catch (error) {
    console.error(`[SectionRenderer] Validation failed for section type "${section.type}":`, error);
    return null;
  }
}

import React from "react";
import { z } from "zod";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { ContactSection } from "./sections/ContactSection";

// Zod validation schemas
export const HeroContentSchema = z.object({
  title: z.string().optional().default("Welcome to my portfolio"),
  subtitle: z.string().optional().default("I build high-quality digital experiences."),
  ctaText: z.string().optional(),
});

export const AboutContentSchema = z.object({
  bio: z.string().optional().default("No biography provided yet."),
  skills: z.array(z.string()).optional().default([]),
});

export const ProjectItemSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional().default("No description provided."),
  link: z.string().optional(),
});

export const ProjectsContentSchema = z.object({
  title: z.string().optional().default("Projects"),
  list: z.array(ProjectItemSchema).optional(),
  items: z.array(ProjectItemSchema).optional(),
});

export const ContactContentSchema = z.object({
  title: z.string().optional().default("Contact"),
  email: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

// Inferred TypeScript types
export type HeroContent = z.infer<typeof HeroContentSchema>;
export type AboutContent = z.infer<typeof AboutContentSchema>;
export type ProjectsContent = z.infer<typeof ProjectsContentSchema>;
export type ContactContent = z.infer<typeof ContactContentSchema>;

export interface Section {
  type: string;
  content: unknown;
}

interface SectionRendererProps {
  section: Section;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  // Safe validation wrapper to catch malformed data and prevent layout crashes
  try {
    switch (section.type.toLowerCase()) {
      case "hero": {
        const validatedContent = HeroContentSchema.parse(section.content || {});
        return <HeroSection content={validatedContent} />;
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

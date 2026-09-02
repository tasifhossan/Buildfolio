import React from "react";
import { z } from "zod";
import { HeroSection } from "./sections/HeroSection";
import { AboutSection } from "./sections/AboutSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { ContactSection } from "./sections/ContactSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";
import { BlogTeaserSection } from "./sections/BlogTeaserSection";

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
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  imageUrl: z.string().optional(),
});

export const ProjectsContentSchema = z.object({
  title: z.string().optional().default("Projects"),
  layout: z.enum(["grid", "list", "carousel"]).optional().default("grid"),
  list: z.array(ProjectItemSchema).optional(),
  items: z.array(ProjectItemSchema).optional(),
});

export const ContactContentSchema = z.object({
  title: z.string().optional().default("Contact"),
  email: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

export const ExperienceItemSchema = z.object({
  role: z.string(),
  company: z.string(),
  startMonth: z.number().int().min(1).max(12),
  startYear: z.number().int(),
  endMonth: z.number().int().min(1).max(12).optional(),
  endYear: z.number().int().optional(),
  isCurrent: z.boolean(),
  description: z.string(),
}).refine(
  (data) => {
    if (data.isCurrent) {
      return true;
    }
    return data.endMonth !== undefined && data.endYear !== undefined;
  },
  {
    message: "End month and year are required if this is not your current role",
    path: ["endMonth"],
  }
);

export const ExperienceContentSchema = z.object({
  layout: z.enum(["timeline", "list"]).optional().default("timeline"),
  items: z.array(ExperienceItemSchema).optional().default([]),
});

export const TestimonialItemSchema = z.object({
  name: z.string(),
  role: z.string().optional(),
  quote: z.string(),
  photoUrl: z.string().optional(),
});

export const TestimonialsContentSchema = z.object({
  layout: z.enum(["grid", "carousel"]).optional().default("grid"),
  items: z.array(TestimonialItemSchema).optional().default([]),
});

export const BlogTeaserContentSchema = z.object({
  title: z.string().optional().default("From the Blog"),
  postCount: z.number().int().min(1).max(6).optional().default(3),
});

// Inferred TypeScript types
export type HeroContent = z.infer<typeof HeroContentSchema>;
export type AboutContent = z.infer<typeof AboutContentSchema>;
export type ProjectsContent = z.infer<typeof ProjectsContentSchema>;
export type ContactContent = z.infer<typeof ContactContentSchema>;
export type ExperienceContent = z.infer<typeof ExperienceContentSchema>;
export type TestimonialsContent = z.infer<typeof TestimonialsContentSchema>;
export type BlogTeaserContent = z.infer<typeof BlogTeaserContentSchema>;

export interface Section {
  type: string;
  content: unknown;
  portfolioId?: string;
  username?: string;
}

interface SectionRendererProps {
  section: Section;
  portfolioId?: string;
  username?: string;
}

export function SectionRenderer({ section, portfolioId, username }: SectionRendererProps) {
  // Safe validation wrapper to catch malformed data and prevent layout crashes
  try {
    const pId = section.portfolioId || portfolioId;
    const uName = section.username || username;

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
      case "experience": {
        const validatedContent = ExperienceContentSchema.parse(section.content || {});
        return <ExperienceSection content={validatedContent} />;
      }
      case "testimonials": {
        const validatedContent = TestimonialsContentSchema.parse(section.content || {});
        return <TestimonialsSection content={validatedContent} />;
      }
      case "blogteaser":
      case "blog_teaser": {
        const validatedContent = BlogTeaserContentSchema.parse(section.content || {});
        return <BlogTeaserSection content={validatedContent} portfolioId={pId} username={uName} />;
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

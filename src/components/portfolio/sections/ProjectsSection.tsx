import React from "react";
import { z } from "zod";

// Zod schema matching the JSON shape from the seed data and supported variations
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

export type ProjectsContent = z.infer<typeof ProjectsContentSchema>;

interface ProjectsSectionProps {
  content: ProjectsContent;
}

export function ProjectsSection({ content }: ProjectsSectionProps) {
  const projectsList = content.list || content.items || [];

  return (
    <section
      id="projects"
      className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 scroll-mt-20"
    >
      <div className="space-y-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: "var(--theme-primary)" }}></span>
          {content.title}
        </h2>

        {projectsList.length === 0 ? (
          <p className="text-zinc-500 text-sm">No projects listed yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectsList.map((project, idx) => {
              const projectTitle = project.name || project.title || "Untitled Project";
              const Card = () => (
                <div className="h-full bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 group flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors duration-150">
                        {projectTitle}
                      </h3>
                      {project.link && (
                        <svg
                          className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </div>
                    <p className="text-zinc-400 text-sm font-light mt-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  {project.link && (
                    <div className="mt-6 pt-4 border-t border-zinc-900/50 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--theme-primary)] opacity-80 group-hover:opacity-100 transition-opacity">
                      <span>View Project</span>
                    </div>
                  )}
                </div>
              );

              if (project.link) {
                return (
                  <a
                    key={idx}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full cursor-pointer"
                  >
                    <Card />
                  </a>
                );
              }

              return (
                <div key={idx} className="block h-full">
                  <Card />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

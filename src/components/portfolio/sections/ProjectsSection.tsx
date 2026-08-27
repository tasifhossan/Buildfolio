"use client";

import React, { useRef } from "react";
import type { ProjectsContent } from "../SectionRenderer";
import { MarkdownRenderer } from "../MarkdownRenderer";

interface ProjectsSectionProps {
  content: ProjectsContent;
}

// ---------------------------------------------------------------------------
// Shared card sub-components
// ---------------------------------------------------------------------------

interface PlaceholderImageProps {
  className?: string;
}

function PlaceholderImage({ className = "" }: PlaceholderImageProps) {
  return (
    <div
      className={`w-full h-full bg-gradient-to-br from-zinc-900 to-zinc-950 flex items-center justify-center text-zinc-700 transition-colors duration-300 group-hover:text-zinc-500 ${className}`}
    >
      <svg
        className="w-10 h-10"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Grid card — pixel-identical to the original implementation
// ---------------------------------------------------------------------------

interface GridCardProps {
  title: string;
  description?: string;
  link?: string;
  imageUrl?: string;
}

function GridCard({ title, description, link, imageUrl }: GridCardProps) {
  return (
    <div className="flex-1 bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 group flex flex-col justify-between">
      <div>
        <div className="w-full aspect-video overflow-hidden border-b border-zinc-900 bg-zinc-950 relative flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <PlaceholderImage />
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors duration-150">
              {title}
            </h3>
            {link && <ExternalLinkIcon />}
          </div>
          <MarkdownRenderer
            content={description ?? ""}
            className="text-zinc-400 text-sm font-light mt-3"
          />
        </div>
      </div>
      {link && (
        <div className="mx-6 mb-6 pt-4 border-t border-zinc-900/50 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--theme-primary)] opacity-80 group-hover:opacity-100 transition-opacity">
          <span>View Project</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// List card — full-width, image left / text right
// ---------------------------------------------------------------------------

function ListCard({ title, description, link, imageUrl }: GridCardProps) {
  return (
    <div className="bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 group flex flex-col sm:flex-row">
      {/* Image panel — fixed width on sm+ */}
      <div className="sm:w-52 sm:flex-shrink-0 aspect-video sm:aspect-auto overflow-hidden border-b sm:border-b-0 sm:border-r border-zinc-900 bg-zinc-950 relative flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage />
        )}
      </div>

      {/* Text panel */}
      <div className="flex flex-col justify-between flex-1 p-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors duration-150">
              {title}
            </h3>
            {link && <ExternalLinkIcon />}
          </div>
          <MarkdownRenderer
            content={description ?? ""}
            className="text-zinc-400 text-sm font-light mt-3"
          />
        </div>
        {link && (
          <div className="mt-4 pt-4 border-t border-zinc-900/50 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--theme-primary)] opacity-80 group-hover:opacity-100 transition-opacity">
            <span>View Project</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Carousel arrow button
// ---------------------------------------------------------------------------

function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className="hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200 backdrop-blur-sm"
      style={direction === "left" ? { left: "-1.125rem" } : { right: "-1.125rem" }}
    >
      {direction === "left" ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Layout variants
// ---------------------------------------------------------------------------

type ProjectItem = NonNullable<ProjectsContent["items"]>[number];

function renderProjectWrapper(
  project: ProjectItem,
  idx: number,
  cardNode: React.ReactNode,
  wrapperClassName: string
) {
  const title = project.name || project.title || "Untitled Project";
  if (project.link) {
    return (
      <a
        key={idx}
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={wrapperClassName}
      >
        {cardNode}
      </a>
    );
  }
  return (
    <div key={idx} className={wrapperClassName}>
      {cardNode}
    </div>
  );
}

function GridLayout({ projects }: { projects: ProjectItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project, idx) => {
        const title = project.name || project.title || "Untitled Project";
        const card = (
          <GridCard
            title={title}
            description={project.description}
            link={project.link}
            imageUrl={project.imageUrl}
          />
        );
        return renderProjectWrapper(project, idx, card, "flex flex-col h-full cursor-pointer");
      })}
    </div>
  );
}

function ListLayout({ projects }: { projects: ProjectItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {projects.map((project, idx) => {
        const title = project.name || project.title || "Untitled Project";
        const card = (
          <ListCard
            title={title}
            description={project.description}
            link={project.link}
            imageUrl={project.imageUrl}
          />
        );
        return renderProjectWrapper(project, idx, card, "block cursor-pointer");
      })}
    </div>
  );
}

function CarouselLayout({ projects }: { projects: ProjectItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild
      ? (scrollRef.current.firstElementChild as HTMLElement).offsetWidth + 24 // gap-6 = 24px
      : 320;
    scrollRef.current.scrollBy({ left: dir === "left" ? -cardWidth : cardWidth, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ArrowButton direction="left" onClick={() => scroll("left")} />

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="carousel-track flex gap-6 overflow-x-auto pb-4 scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          // Hide scrollbar cross-browser while keeping scroll functionality
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {projects.map((project, idx) => {
          const title = project.name || project.title || "Untitled Project";
          const card = (
            <GridCard
              title={title}
              description={project.description}
              link={project.link}
              imageUrl={project.imageUrl}
            />
          );

          const wrapperStyle: React.CSSProperties = {
            scrollSnapAlign: "start",
            flexShrink: 0,
            width: "clamp(260px, 72vw, 320px)",
          };

          if (project.link) {
            return (
              <a
                key={idx}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col cursor-pointer"
                style={wrapperStyle}
              >
                {card}
              </a>
            );
          }
          return (
            <div key={idx} className="flex flex-col" style={wrapperStyle}>
              {card}
            </div>
          );
        })}
      </div>

      <ArrowButton direction="right" onClick={() => scroll("right")} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main section component
// ---------------------------------------------------------------------------

export function ProjectsSection({ content }: ProjectsSectionProps) {
  const projectsList = content.list || content.items || [];
  const layout = content.layout ?? "grid";

  return (
    <section
      id="projects"
      className="max-w-4xl mx-auto px-6 py-20 border-t border-zinc-900 scroll-mt-20"
    >
      <div className="space-y-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: "var(--theme-primary)" }} />
          {content.title}
        </h2>

        {projectsList.length === 0 ? (
          <p className="text-zinc-500 text-sm">No projects listed yet.</p>
        ) : layout === "list" ? (
          <ListLayout projects={projectsList} />
        ) : layout === "carousel" ? (
          <CarouselLayout projects={projectsList} />
        ) : (
          // "grid" — default, pixel-identical to original
          <GridLayout projects={projectsList} />
        )}
      </div>
    </section>
  );
}

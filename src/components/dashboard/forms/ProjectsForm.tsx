"use client";

import { useState } from "react";

export interface ProjectItem {
  name?: string;
  title?: string;
  description?: string;
  link?: string;
}

export interface ProjectsContent {
  title?: string;
  list?: ProjectItem[];
  items?: ProjectItem[];
}

export interface Section {
  id: string;
  portfolioId: string;
  type: string;
  order: number;
  isVisible: boolean;
  content: ProjectsContent;
}

interface ProjectsFormProps {
  section: Section;
  onSave: (updatedContent: ProjectsContent) => void | Promise<void>;
  isSaving?: boolean;
}

export function ProjectsForm({ section, onSave, isSaving = false }: ProjectsFormProps) {
  const initialContent = section.content || {};
  const [title, setTitle] = useState(initialContent.title ?? "Projects");
  const [list, setList] = useState<ProjectItem[]>(
    initialContent.list || initialContent.items || []
  );

  const handleAddItem = () => {
    setList((prev) => [
      ...prev,
      { name: "", title: "", description: "", link: "" },
    ]);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    setList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleItemChange = (index: number, field: keyof ProjectItem, value: string) => {
    setList((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          const updated = { ...item, [field]: value };
          // Keep both name and title in sync for maximum safety
          if (field === "name") updated.title = value;
          if (field === "title") updated.name = value;
          return updated;
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      list,
      items: list,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-1 animate-[cardFadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      {/* Section Title Input */}
      <div className="space-y-1.5">
        <label htmlFor="projects-title" className="text-xs font-semibold text-zinc-400">
          Section Title
        </label>
        <input
          id="projects-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSaving}
          className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
          placeholder="Projects"
        />
      </div>

      {/* Projects List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Project Items</h4>
          <button
            type="button"
            onClick={handleAddItem}
            disabled={isSaving}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition duration-150 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-8 bg-zinc-950/20 border border-dashed border-zinc-800/50 rounded-xl">
            <p className="text-xs text-zinc-500 italic">No projects listed yet. Click 'Add Project' to begin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-4.5 space-y-3 relative group transition duration-150 hover:border-zinc-800"
                >
                  {/* Card Header with delete */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded-md border border-indigo-900/30">
                      Project #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={isSaving}
                      className="text-zinc-500 hover:text-red-400 transition duration-150 cursor-pointer disabled:opacity-50 p-1 rounded-lg hover:bg-red-950/20"
                      aria-label="Remove Project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Input fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-500">Project Title</label>
                      <input
                        type="text"
                        value={item.name || item.title || ""}
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        disabled={isSaving}
                        className="w-full bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none placeholder:text-zinc-600 disabled:opacity-50"
                        placeholder="e.g. Portfolio Builder"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-500">Project Link (Optional)</label>
                      <input
                        type="text"
                        value={item.link || ""}
                        onChange={(e) => handleItemChange(index, "link", e.target.value)}
                        disabled={isSaving}
                        className="w-full bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none placeholder:text-zinc-600 disabled:opacity-50"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-zinc-500">Description</label>
                    <textarea
                      value={item.description || ""}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      disabled={isSaving}
                      rows={2}
                      className="w-full bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none placeholder:text-zinc-600 disabled:opacity-50 resize-none"
                      placeholder="Brief summary of what the project is or does..."
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button Row */}
      <div className="flex justify-end pt-2 border-t border-zinc-800/80">
        <button
          type="submit"
          disabled={isSaving}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 disabled:from-zinc-800 disabled:to-zinc-800 text-white disabled:text-zinc-500 font-semibold text-xs py-2 px-5 rounded-xl shadow-lg shadow-indigo-500/10 transition duration-150 flex items-center gap-1.5 cursor-pointer"
        >
          {isSaving ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
}

export default ProjectsForm;

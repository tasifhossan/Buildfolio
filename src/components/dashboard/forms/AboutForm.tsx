"use client";

import { useState } from "react";

export interface AboutContent {
  bio?: string;
  skills?: string[];
}

export interface Section {
  id: string;
  portfolioId: string;
  type: string;
  order: number;
  isVisible: boolean;
  content: AboutContent;
}

interface AboutFormProps {
  section: Section;
  onSave: (updatedContent: AboutContent) => void | Promise<void>;
  isSaving?: boolean;
}

export function AboutForm({ section, onSave, isSaving = false }: AboutFormProps) {
  const initialContent = section.content || {};
  const [bio, setBio] = useState(initialContent.bio ?? "No biography provided yet.");
  const [skills, setSkills] = useState<string[]>(initialContent.skills ?? []);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      bio,
      skills,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-[cardFadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      <div className="space-y-1.5">
        <label htmlFor="about-bio" className="text-xs font-semibold text-zinc-400">
          Biography
        </label>
        <textarea
          id="about-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={isSaving}
          rows={4}
          className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50 resize-none"
          placeholder="Write a brief biography about yourself..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="about-skill-input" className="text-xs font-semibold text-zinc-400">
          Skills
        </label>
        
        {/* Add Skill Row */}
        <div className="flex gap-2">
          <input
            id="about-skill-input"
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddSkill(e);
              }
            }}
            disabled={isSaving}
            className="flex-1 bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
            placeholder="e.g. TypeScript, React, Next.js"
          />
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={isSaving || !newSkill.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white disabled:text-zinc-500 font-semibold text-xs py-2 px-4 rounded-xl transition duration-150 cursor-pointer"
          >
            Add
          </button>
        </div>

        {/* Skill Tags/Chips */}
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="bg-zinc-800/80 border border-zinc-700/50 rounded-lg px-2.5 py-1 text-[11px] font-medium text-zinc-300 flex items-center gap-1.5 transition duration-150 hover:bg-zinc-800"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  disabled={isSaving}
                  className="text-zinc-500 hover:text-zinc-300 transition duration-150 shrink-0 select-none cursor-pointer"
                  aria-label={`Remove ${skill}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-zinc-500 italic pt-1">No skills added yet.</p>
        )}
      </div>

      <div className="flex justify-end pt-2">
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

export default AboutForm;

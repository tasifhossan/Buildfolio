"use client";

import { useState } from "react";

export interface AboutContent {
  bio?: string;
  skills?: string[];
}

interface AboutFormProps {
  value: AboutContent;
  onChange: (updatedContent: AboutContent) => void;
  onSave: (updatedContent: AboutContent) => void | Promise<void>;
  isSaving?: boolean;
}

export function AboutForm({ value, onChange, onSave, isSaving = false }: AboutFormProps) {
  const bio = value.bio ?? "";
  const skills = value.skills ?? [];
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange({
        ...value,
        skills: [...skills, trimmed],
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange({
      ...value,
      skills: skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleBioChange = (val: string) => {
    onChange({
      ...value,
      bio: val,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0 space-y-4 animate-[cardFadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="about-bio" className="text-xs font-semibold text-zinc-400">
            Biography
          </label>
          <textarea
            id="about-bio"
            value={bio}
            onChange={(e) => handleBioChange(e.target.value)}
            disabled={isSaving}
            rows={4}
            className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50 resize-none"
            placeholder="Write a brief biography about yourself..."
          />
          <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-1 select-none">
            <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Supports basic markdown: <strong>**bold**</strong>, <em>*italic*</em>, <code>`code`</code>, <span className="underline">[link](url)</span>.
          </p>
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
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </div>

      <div className="flex justify-end pt-3 border-t border-zinc-850 shrink-0">
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

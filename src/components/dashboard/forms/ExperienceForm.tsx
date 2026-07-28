"use client";

import React from "react";

export interface ExperienceItem {
  role: string;
  company: string;
  startMonth: number;
  startYear: number;
  endMonth?: number;
  endYear?: number;
  isCurrent: boolean;
  description: string;
}

export interface ExperienceContent {
  items?: ExperienceItem[];
}

interface ExperienceFormProps {
  value: ExperienceContent;
  onChange: (updatedContent: ExperienceContent) => void;
  onSave: (updatedContent: ExperienceContent) => void | Promise<void>;
  isSaving?: boolean;
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => currentYear - i); // Current year down to ~1946

export function ExperienceForm({ value, onChange, onSave, isSaving = false }: ExperienceFormProps) {
  const items = value.items || [];

  const handleAddItem = () => {
    const blankItem: ExperienceItem = {
      role: "",
      company: "",
      startMonth: 1,
      startYear: currentYear,
      endMonth: 1,
      endYear: currentYear,
      isCurrent: false,
      description: "",
    };
    const updated = [...items, blankItem];
    onChange({
      ...value,
      items: updated,
    });
  };

  const handleRemoveItem = (indexToRemove: number) => {
    const updated = items.filter((_, idx) => idx !== indexToRemove);
    onChange({
      ...value,
      items: updated,
    });
  };

  const handleItemChange = (index: number, field: keyof ExperienceItem, val: string | number | boolean) => {
    const updated = items.map((item, idx) => {
      if (idx === index) {
        const updatedItem = { ...item, [field]: val };
        
        // If "currently working here" is checked, remove end date fields
        if (field === "isCurrent") {
          if (val === true) {
            delete updatedItem.endMonth;
            delete updatedItem.endYear;
          } else {
            // Restore default end date if unchecking
            updatedItem.endMonth = item.startMonth;
            updatedItem.endYear = item.startYear;
          }
        }
        return updatedItem;
      }
      return item;
    });
    
    onChange({
      ...value,
      items: updated,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[60vh] overflow-y-auto pr-1 animate-[cardFadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      {/* Experience List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Work Experience</h4>
          <button
            type="button"
            onClick={handleAddItem}
            disabled={isSaving}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition duration-150 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Add Experience
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 bg-zinc-950/20 border border-dashed border-zinc-800/50 rounded-xl">
            <p className="text-xs text-zinc-500 italic">No experience listed yet. Click &apos;Add Experience&apos; to begin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-4.5 space-y-4 relative group transition duration-150 hover:border-zinc-800"
                >
                  {/* Card Header with delete */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded-md border border-indigo-900/30">
                      Experience #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={isSaving}
                      className="text-zinc-500 hover:text-red-400 transition duration-150 cursor-pointer disabled:opacity-50 p-1 rounded-lg hover:bg-red-950/20"
                      aria-label="Remove Experience"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Role and Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-500">Role / Position</label>
                      <input
                        type="text"
                        value={item.role || ""}
                        onChange={(e) => handleItemChange(index, "role", e.target.value)}
                        disabled={isSaving}
                        className="w-full bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none placeholder:text-zinc-600 disabled:opacity-50"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-500">Company / Organization</label>
                      <input
                        type="text"
                        value={item.company || ""}
                        onChange={(e) => handleItemChange(index, "company", e.target.value)}
                        disabled={isSaving}
                        className="w-full bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none placeholder:text-zinc-600 disabled:opacity-50"
                        placeholder="e.g. Google"
                      />
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-zinc-500">Start Date</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={item.startMonth}
                        onChange={(e) => handleItemChange(index, "startMonth", parseInt(e.target.value))}
                        disabled={isSaving}
                        className="bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none disabled:opacity-50 cursor-pointer"
                      >
                        {MONTHS.map((m) => (
                          <option key={m.value} value={m.value} className="bg-zinc-950">
                            {m.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={item.startYear}
                        onChange={(e) => handleItemChange(index, "startYear", parseInt(e.target.value))}
                        disabled={isSaving}
                        className="bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none disabled:opacity-50 cursor-pointer"
                      >
                        {YEARS.map((y) => (
                          <option key={y} value={y} className="bg-zinc-950">
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Current checkbox */}
                  <div className="flex items-center gap-2 py-1">
                    <input
                      id={`is-current-${index}`}
                      type="checkbox"
                      checked={item.isCurrent || false}
                      onChange={(e) => handleItemChange(index, "isCurrent", e.target.checked)}
                      disabled={isSaving}
                      className="w-4 h-4 rounded border-zinc-800 bg-zinc-950/60 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-900 cursor-pointer"
                    />
                    <label htmlFor={`is-current-${index}`} className="text-xs font-semibold text-zinc-400 cursor-pointer select-none">
                      I currently work here
                    </label>
                  </div>

                  {/* End Date (hidden if isCurrent is true) */}
                  {!item.isCurrent && (
                    <div className="space-y-1 animate-[cardFadeIn_0.2s_ease-out]">
                      <label className="text-[10px] font-semibold text-zinc-500">End Date</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={item.endMonth || 1}
                          onChange={(e) => handleItemChange(index, "endMonth", parseInt(e.target.value))}
                          disabled={isSaving}
                          className="bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none disabled:opacity-50 cursor-pointer"
                        >
                          {MONTHS.map((m) => (
                            <option key={m.value} value={m.value} className="bg-zinc-950">
                              {m.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={item.endYear || currentYear}
                          onChange={(e) => handleItemChange(index, "endYear", parseInt(e.target.value))}
                          disabled={isSaving}
                          className="bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none disabled:opacity-50 cursor-pointer"
                        >
                          {YEARS.map((y) => (
                            <option key={y} value={y} className="bg-zinc-950">
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-zinc-500">Description</label>
                    <textarea
                      value={item.description || ""}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      disabled={isSaving}
                      rows={3}
                      className="w-full bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none placeholder:text-zinc-600 disabled:opacity-50 resize-none"
                      placeholder="Describe your responsibilities, key achievements, or technologies used..."
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

export default ExperienceForm;

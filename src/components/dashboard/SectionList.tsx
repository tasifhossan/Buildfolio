"use client";

import { useState, useEffect } from "react";
import { HeroForm } from "./forms/HeroForm";
import { AboutForm } from "./forms/AboutForm";
import { ContactForm } from "./forms/ContactForm";
import { ProjectsForm } from "./forms/ProjectsForm";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Section {
  id: string;
  portfolioId: string;
  type: string;
  order: number;
  isVisible: boolean;
  content: {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    bio?: string;
    skills?: string[];
    list?: {
      name: string;
      description: string;
      link: string;
    }[];
    email?: string;
    github?: string;
    linkedin?: string;
  };
}

interface SortableItemProps {
  section: Section;
  onToggleVisibility: (id: string, isVisible: boolean) => void;
  onDeleteClick: (id: string) => void;
  onEditClick: (section: Section) => void;
}

function SortableItem({ section, onToggleVisibility, onDeleteClick, onEditClick }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 mb-3 bg-zinc-900/60 border ${
        isDragging ? "border-indigo-500/40 shadow-lg shadow-indigo-500/5 bg-zinc-900/80" : "border-white/5 hover:border-zinc-800"
      } backdrop-blur-sm rounded-xl transition duration-150`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-800/50 transition shrink-0"
          type="button"
          aria-label="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* Section Detail */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/30 px-2.5 py-0.5 rounded-full border border-indigo-900/30">
              {section.type}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              ID: {section.id.slice(-6)}
            </span>
          </div>
          {/* Subtle summary of the content */}
          <p className="text-xs text-zinc-400 mt-1.5 truncate max-w-sm sm:max-w-md">
            {section.type === "Hero" && (section.content?.title || section.content?.subtitle || "Hero section content")}
            {section.type === "About" && (section.content?.bio || "Biography details")}
            {section.type === "Projects" && (section.content?.title || "Projects gallery")}
            {section.type === "Contact" && (section.content?.title || "Contact connections")}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-4 sm:mt-0 shrink-0 border-t border-zinc-800/30 sm:border-0 pt-3 sm:pt-0">
        {/* Visibility Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            checked={section.isVisible}
            onChange={(e) => onToggleVisibility(section.id, e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-zinc-400 peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          <span className="ms-2 text-xs font-semibold text-zinc-400">
            {section.isVisible ? "Visible" : "Hidden"}
          </span>
        </label>

        {/* Edit Button */}
        <button
          onClick={() => onEditClick(section)}
          className="text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/50 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
          type="button"
        >
          Edit
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDeleteClick(section.id)}
          className="text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/30 border border-red-900/30 px-3.5 py-1.5 rounded-lg transition cursor-pointer"
          type="button"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function SectionList() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Create Section state
  const [creatingType, setCreatingType] = useState<string | null>(null);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit modal state
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isSavingSection, setIsSavingSection] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleEditClick = (section: Section) => {
    setEditingSection(section);
    setEditError(null);
  };

  const handleSaveSectionContent = async (updatedContent: any) => {
    if (!editingSection) return;
    setIsSavingSection(true);
    setEditError(null);
    try {
      const res = await fetch(`/api/portfolio/sections/${editingSection.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: updatedContent }),
      });

      if (!res.ok) {
        let errorMessage = "Failed to update section";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Error ${res.status}: ${res.statusText || "Failed to update section"}`;
        }
        throw new Error(errorMessage);
      }

      const updatedSection = await res.json();
      setSections((prev) =>
        prev.map((s) => (s.id === updatedSection.id ? updatedSection : s))
      );
      setEditingSection(null);
    } catch (err) {
      console.error("Failed to save section content:", err);
      setEditError(err instanceof Error ? err.message : "Failed to save section content");
    } finally {
      setIsSavingSection(false);
    }
  };

  // Sensors for DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchSections = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portfolio/sections");
      if (!res.ok) {
        throw new Error("Failed to fetch sections");
      }
      const data = await res.json();
      setSections(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load sections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    const originalSections = [...sections];

    // Optimistic Update
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isVisible } : s))
    );

    try {
      const res = await fetch(`/api/portfolio/sections/${id}/visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isVisible }),
      });

      if (!res.ok) {
        throw new Error("Failed to update visibility");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update section visibility. Reverted.");
      setSections(originalSections);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const originalSections = [...sections];

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reorderedList = arrayMove(sections, oldIndex, newIndex);

    // Re-assign order sequentially
    const updatedSections = reorderedList.map((section, index) => ({
      ...section,
      order: index + 1,
    }));

    setSections(updatedSections);

    try {
      const res = await fetch("/api/portfolio/sections/reorder", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sections: updatedSections.map((s) => ({
            id: s.id,
            order: s.order,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update sections order");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save layout order. Reverted.");
      setSections(originalSections);
    }
  };

  const handleCreateSection = async (type: string) => {
    // Check if a section of this type already exists in the current list
    const hasDuplicate = sections.some(
      (s) => s.type.toLowerCase() === type.toLowerCase()
    );

    if (hasDuplicate) {
      const confirmed = window.confirm(
        `You already have a ${type} section. Add another one anyway?`
      );
      if (!confirmed) {
        return;
      }
    }

    setCreatingType(type);
    setError(null);
    try {
      const res = await fetch("/api/portfolio/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      if (!res.ok) {
        let errorMessage = "Failed to create section";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `Error ${res.status}: ${res.statusText || "Failed to create section"}`;
        }
        throw new Error(errorMessage);
      }

      const newSection = await res.json();
      setSections((prev) => [...prev, newSection]);
    } catch (err) {
      console.error("Failed to create section:", err);
      setError(err instanceof Error ? err.message : "A network error occurred. Please try again.");
    } finally {
      setCreatingType(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/portfolio/sections/${deletingId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete section");
      }

      setSections((prev) => prev.filter((s) => s.id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to delete section");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <div className="w-9 h-9 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-zinc-500 text-xs font-medium">Loading layout sections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-3 rounded-xl text-xs flex items-center justify-between gap-2 animate-[cardFadeIn_0.3s_ease]">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 text-sm font-bold px-1.5 py-0.5 rounded hover:bg-red-950/40">
            &times;
          </button>
        </div>
      )}

      {/* Header and Creator Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/30 border border-white/5 p-4 rounded-xl">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-zinc-200">Customise Sections</h4>
          <p className="text-[11px] text-zinc-500">Drag to reorder, toggle visibility, edit details, or delete sections.</p>
        </div>

        {/* Section Creation Options Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              if (creatingType === null) {
                setShowAddDropdown(!showAddDropdown);
              }
            }}
            disabled={creatingType !== null}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs py-2 px-4 rounded-xl transition duration-150 flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <span>Add Section</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${showAddDropdown ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAddDropdown && (
            <>
              {/* Click outside backdrop to close */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => {
                  if (creatingType === null) {
                    setShowAddDropdown(false);
                  }
                }}
              />
              <div className="absolute right-0 mt-2 w-40 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl py-1.5 z-20 animate-[cardFadeIn_0.15s_cubic-bezier(0.16,1,0.3,1)]">
                {["Hero", "About", "Projects", "Contact"].map((type) => (
                  <button
                    key={type}
                    disabled={creatingType !== null}
                    onClick={async () => {
                      await handleCreateSection(type);
                      setShowAddDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between gap-2"
                    type="button"
                  >
                    <span>{type}</span>
                    {creatingType === type && (
                      <div className="w-3 h-3 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin shrink-0"></div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Draggable List */}
      {sections.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/10 border border-dashed border-zinc-800/80 rounded-xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center mx-auto text-zinc-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h5 className="font-bold text-xs text-zinc-300">Your portfolio is empty</h5>
            <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">Create custom sections using the tools above or apply a template to get started.</p>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div>
              {sections.map((section) => (
                <SortableItem
                  key={section.id}
                  section={section}
                  onToggleVisibility={handleToggleVisibility}
                  onDeleteClick={handleDeleteClick}
                  onEditClick={handleEditClick}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Custom Deletion Modal with Glassmorphism */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="max-w-md w-full bg-zinc-900 border border-red-500/20 rounded-2xl p-6 shadow-2xl space-y-6 animate-[scaleIn_0.2s_ease-out]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">Delete Section</h3>
                <p className="text-xs text-zinc-400">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/40">
              Are you sure you want to delete this section? This will permanently remove the section and all its contents from your public portfolio page.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 font-semibold text-xs py-2 px-4.5 rounded-xl border border-zinc-700/60 transition cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 disabled:from-zinc-800 disabled:to-zinc-800 text-white disabled:text-zinc-500 font-semibold text-xs py-2 px-4.5 rounded-xl shadow-lg shadow-red-950/30 transition cursor-pointer flex items-center gap-1.5"
                type="button"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Section</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Edit Modal with Glassmorphism */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 animate-[scaleIn_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                Edit {editingSection.type} Section
              </h3>
              <button
                onClick={() => setEditingSection(null)}
                disabled={isSavingSection}
                className="text-zinc-500 hover:text-zinc-300 transition cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {editError && (
              <div className="bg-red-950/30 border border-red-900/30 text-red-400 px-4 py-3 rounded-xl text-xs flex items-start gap-2.5">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{editError}</span>
              </div>
            )}

            {editingSection.type === "Hero" ? (
              <HeroForm
                section={editingSection}
                isSaving={isSavingSection}
                onSave={handleSaveSectionContent}
              />
            ) : editingSection.type === "About" ? (
              <AboutForm
                section={editingSection}
                isSaving={isSavingSection}
                onSave={handleSaveSectionContent}
              />
            ) : editingSection.type === "Contact" ? (
              <ContactForm
                section={editingSection}
                isSaving={isSavingSection}
                onSave={handleSaveSectionContent}
              />
            ) : editingSection.type === "Projects" ? (
              <ProjectsForm
                section={editingSection}
                isSaving={isSavingSection}
                onSave={handleSaveSectionContent}
              />
            ) : (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-zinc-400">Editor for {editingSection.type} section is coming soon.</p>
                <button
                  onClick={() => setEditingSection(null)}
                  className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 px-4 py-2 rounded-xl text-xs transition font-semibold"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

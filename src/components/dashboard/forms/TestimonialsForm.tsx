"use client";

import { useState } from "react";

export interface TestimonialItem {
  name?: string;
  role?: string;
  quote?: string;
  photoUrl?: string;
}

export interface TestimonialsContent {
  items?: TestimonialItem[];
}

interface TestimonialsFormProps {
  value: TestimonialsContent;
  onChange: (updatedContent: TestimonialsContent) => void;
  onSave: (updatedContent: TestimonialsContent) => void | Promise<void>;
  isSaving?: boolean;
}

export function TestimonialsForm({ value, onChange, onSave, isSaving = false }: TestimonialsFormProps) {
  const items = value.items || [];
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validations
    const maxFileSize = 2 * 1024 * 1024;
    if (file.size > maxFileSize) {
      alert("File size exceeds 2MB limit");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, PNG and WEBP images are allowed");
      return;
    }

    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await res.json();
      handleItemChange(index, "photoUrl", data.secure_url);
    } catch (err) {
      console.error("Upload error:", err);
      alert(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploadingIndex(null);
      e.target.value = "";
    }
  };

  const handleAddItem = () => {
    const updated = [...items, { name: "", role: "", quote: "", photoUrl: "" }];
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

  const handleItemChange = (index: number, field: keyof TestimonialItem, val: string) => {
    const updated = items.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val };
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
      {/* Testimonials List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Testimonial Items</h4>
          <button
            type="button"
            onClick={handleAddItem}
            disabled={isSaving}
            className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition duration-150 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Add Testimonial
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8 bg-zinc-950/20 border border-dashed border-zinc-800/50 rounded-xl">
            <p className="text-xs text-zinc-500 italic">No testimonials listed yet. Click &apos;Add Testimonial&apos; to begin.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => {
              return (
                <div
                  key={index}
                  className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-4.5 space-y-3 relative group transition duration-150 hover:border-zinc-800"
                >
                  {/* Card Header with delete */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded-md border border-indigo-900/30">
                      Testimonial #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={isSaving}
                      className="text-zinc-500 hover:text-red-400 transition duration-150 cursor-pointer disabled:opacity-50 p-1 rounded-lg hover:bg-red-950/20"
                      aria-label="Remove Testimonial"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Input fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-500">Name</label>
                      <input
                        type="text"
                        value={item.name || ""}
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        disabled={isSaving}
                        className="w-full bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none placeholder:text-zinc-600 disabled:opacity-50"
                        placeholder="e.g. Jane Doe"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-zinc-500">Role / Company (Optional)</label>
                      <input
                        type="text"
                        value={item.role || ""}
                        onChange={(e) => handleItemChange(index, "role", e.target.value)}
                        disabled={isSaving}
                        className="w-full bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none placeholder:text-zinc-600 disabled:opacity-50"
                        placeholder="e.g. CTO at Acme Corp"
                      />
                    </div>
                  </div>

                  {/* Photo URL and Upload Field */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-zinc-500">Photo</label>
                    <div className="flex items-center gap-3">
                      {item.photoUrl ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0">
                          <img
                            src={item.photoUrl}
                            alt="Photo Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleItemChange(index, "photoUrl", "")}
                            className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition flex items-center justify-center text-red-400 font-bold text-[9px] cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 text-[9px] bg-zinc-950/20 shrink-0 select-none">
                          No Photo
                        </div>
                      )}
                      
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={item.photoUrl || ""}
                          onChange={(e) => handleItemChange(index, "photoUrl", e.target.value)}
                          disabled={isSaving || uploadingIndex === index}
                          className="flex-1 bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none placeholder:text-zinc-600 disabled:opacity-50"
                          placeholder="Photo URL or upload..."
                        />
                        <label className="relative shrink-0">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleImageUpload(index, e)}
                            disabled={isSaving || uploadingIndex !== null}
                            className="hidden"
                          />
                          <span className={`bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-zinc-300 font-semibold text-xs py-2 px-3 rounded-lg border border-zinc-700/60 transition cursor-pointer flex items-center gap-1.5 h-full ${uploadingIndex === index ? 'opacity-50 pointer-events-none' : ''}`}>
                            {uploadingIndex === index ? (
                              <div className="w-3.5 h-3.5 border-2 border-zinc-300/30 border-t-zinc-300 rounded-full animate-spin"></div>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                            )}
                            Upload
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-zinc-500">Quote</label>
                    <textarea
                      value={item.quote || ""}
                      onChange={(e) => handleItemChange(index, "quote", e.target.value)}
                      disabled={isSaving}
                      rows={3}
                      className="w-full bg-zinc-900/60 border border-zinc-800/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs text-zinc-200 transition outline-none placeholder:text-zinc-600 disabled:opacity-50 resize-none"
                      placeholder="What did they say about you and your work?"
                    />
                    <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-1 select-none">
                      <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Supports basic markdown: <strong>**bold**</strong>, <em>*italic*</em>, <code>`code`</code>, <span className="underline">[link](url)</span>.
                    </p>
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

export default TestimonialsForm;

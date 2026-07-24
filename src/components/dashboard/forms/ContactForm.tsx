"use client";

import { useState } from "react";

export interface ContactContent {
  title?: string;
  email?: string;
  github?: string;
  linkedin?: string;
}

export interface Section {
  id: string;
  portfolioId: string;
  type: string;
  order: number;
  isVisible: boolean;
  content: ContactContent;
}

interface ContactFormProps {
  section: Section;
  onSave: (updatedContent: ContactContent) => void | Promise<void>;
  isSaving?: boolean;
}

export function ContactForm({ section, onSave, isSaving = false }: ContactFormProps) {
  const initialContent = section.content || {};
  const [title, setTitle] = useState(initialContent.title ?? "Contact");
  const [email, setEmail] = useState(initialContent.email ?? "");
  const [github, setGithub] = useState(initialContent.github ?? "");
  const [linkedin, setLinkedin] = useState(initialContent.linkedin ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      email,
      github,
      linkedin,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-[cardFadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)]">
      <div className="space-y-1.5">
        <label htmlFor="contact-title" className="text-xs font-semibold text-zinc-400">
          Section Title
        </label>
        <input
          id="contact-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSaving}
          className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
          placeholder="Contact"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-email" className="text-xs font-semibold text-zinc-400">
          Email Address
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSaving}
          className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
          placeholder="hello@example.com"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-github" className="text-xs font-semibold text-zinc-400">
          GitHub URL / Username
        </label>
        <input
          id="contact-github"
          type="text"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          disabled={isSaving}
          className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
          placeholder="github.com/username"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-linkedin" className="text-xs font-semibold text-zinc-400">
          LinkedIn URL / Username
        </label>
        <input
          id="contact-linkedin"
          type="text"
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          disabled={isSaving}
          className="w-full bg-zinc-950/60 border border-zinc-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-xs text-zinc-100 transition duration-150 outline-none placeholder:text-zinc-600 disabled:opacity-50"
          placeholder="linkedin.com/in/username"
        />
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

export default ContactForm;

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Is it free to use?",
    answer: "Yes! Buildfolio is completely free to get started. You can build, customize, and publish your portfolio with a buildfolio.com/username URL without any credit card required.",
  },
  {
    question: "Can I use my own domain?",
    answer: "Custom domain support is coming soon! Currently, all portfolios are instantly published and hosted under a clean buildfolio.com/your-username URL.",
  },
  {
    question: "Do I need coding experience?",
    answer: "Not at all. Buildfolio is designed with a visual layout editor. You can create projects, update your bio, and arrange sections live without writing a single line of code.",
  },
  {
    question: "Can I change my template later?",
    answer: "Yes, you can swap templates at any time from your dashboard. Your content (like your projects, bio, and contact info) will automatically adapt to the new template style.",
  },
  {
    question: "What happens if I stop using it?",
    answer: "You can unpublish, archive, or delete your portfolio page at any point. If you decide to close your account, your data will be permanently and securely deleted from our database.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-3xl mx-auto mt-32 pt-16 flex flex-col items-center px-4">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-400 text-lg">
          Everything you need to know about Buildfolio.
        </p>
      </div>

      <div className="w-full space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl border transition-all duration-300 overflow-hidden"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                borderColor: isOpen ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.05)",
                boxShadow: isOpen ? "0 0 30px rgba(99,102,241,0.05)" : "none",
              }}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-6 text-left font-medium text-white transition-colors hover:text-indigo-300"
              >
                <span className="text-base sm:text-lg">{faq.question}</span>
                <ChevronDown
                  className="w-5 h-5 text-zinc-500 transition-transform duration-300"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    color: isOpen ? "#818cf8" : undefined,
                  }}
                />
              </button>

              <div
                className="transition-all duration-300 ease-in-out overflow-hidden"
                style={{
                  maxHeight: isOpen ? "300px" : "0px",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className="px-6 pb-6 text-sm sm:text-base text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

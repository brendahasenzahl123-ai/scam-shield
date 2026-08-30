import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, FileText, Shield, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { TERMS_OF_USE, PRIVACY_POLICY, COMMUNITY_STANDARDS } from "@/lib/legalContent";

const DOCS = {
  terms: { title: "Terms of Use", icon: FileText, content: TERMS_OF_USE },
  privacy: { title: "Privacy Policy", icon: Shield, content: PRIVACY_POLICY },
  community: { title: "Community Standards", icon: BookOpen, content: COMMUNITY_STANDARDS },
};

export default function LegalModal({ initialDoc = "terms", onClose }) {
  const [activeDoc, setActiveDoc] = useState(initialDoc);
  const doc = DOCS[activeDoc];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <doc.icon className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm">{doc.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 px-5 py-2 border-b border-border bg-muted/30">
          {Object.entries(DOCS).map(([key, d]) => (
            <button
              key={key}
              onClick={() => setActiveDoc(key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeDoc === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <d.icon className="w-3.5 h-3.5" /> {d.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 flex-1">
          <div className="prose prose-sm max-w-none text-foreground">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold mb-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-bold mt-4 mb-2">{children}</h2>,
                p: ({ children }) => <p className="text-sm leading-relaxed mb-3">{children}</p>,
                ul: ({ children }) => <ul className="text-sm leading-relaxed mb-3 list-disc pl-5">{children}</ul>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} className="text-primary font-medium hover:underline break-all">
                    {children}
                  </a>
                ),
              }}
            >
              {doc.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
          >
            I've read this
          </button>
        </div>
      </motion.div>
    </div>
  );
}
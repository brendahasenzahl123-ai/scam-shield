import React, { useState } from "react";
import LegalModal from "./LegalModal";

/**
 * Required Terms agreement checkbox for Login/Register screens.
 * The submit action must NOT proceed until the user checks this box.
 * Links open in-app LegalModal pages.
 */
export default function TermsAgreement({ checked, onChange }) {
  const [openDoc, setOpenDoc] = useState(null);

  return (
    <>
      <label className="flex items-start gap-2.5 cursor-pointer text-xs leading-relaxed">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-input accent-primary shrink-0"
        />
        <span className="text-muted-foreground">
          I agree to the{" "}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setOpenDoc("terms"); }}
            className="text-primary font-medium hover:underline"
          >
            Terms of Use
          </button>
          ,{" "}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setOpenDoc("privacy"); }}
            className="text-primary font-medium hover:underline"
          >
            Privacy Policy
          </button>
          , and{" "}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setOpenDoc("community"); }}
            className="text-primary font-medium hover:underline"
          >
            Community Standards
          </button>
          .
        </span>
      </label>

      {openDoc && <LegalModal initialDoc={openDoc} onClose={() => setOpenDoc(null)} />}
    </>
  );
}
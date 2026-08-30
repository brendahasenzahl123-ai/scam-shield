import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";

/**
 * Mobile-friendly select that opens a bottom-sheet drawer on mobile,
 * and falls back to a custom styled button+list on desktop.
 *
 * Props:
 *   value, onChange, options: [{value, label}], placeholder, label
 */
export default function MobileSelect({ value, onChange, options = [], placeholder = "Select...", className = "" }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center justify-between w-full h-11 px-3 rounded-lg border border-input bg-background text-sm text-left transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring ${className}`}
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="pb-0">
            <DrawerTitle className="text-base">{placeholder}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 pt-2 space-y-1 max-h-[60vh] overflow-y-auto">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                  value === opt.value
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                {opt.label}
                {value === opt.value && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
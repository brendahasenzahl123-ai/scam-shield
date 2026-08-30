import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-amber-500 text-white px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium shadow-lg"
          style={{ paddingTop: "calc(0.625rem + env(safe-area-inset-top))" }}
        >
          <WifiOff className="w-4 h-4 shrink-0" />
          You're offline. Some features may be unavailable.
        </motion.div>
      )}
    </AnimatePresence>
  );
}
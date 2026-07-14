"use client";

import { useEffect } from "react";

export function DisableInspect() {
  useEffect(() => {
    // Prevent Right Click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, and Mac equivalents
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "i" || e.key === "j" || e.key === "C" || e.key === "c")) ||
        (e.ctrlKey && (e.key === "U" || e.key === "u")) ||
        (e.metaKey && e.altKey && (e.key === "I" || e.key === "J" || e.key === "i" || e.key === "j" || e.key === "C" || e.key === "c")) || 
        (e.metaKey && (e.key === "U" || e.key === "u"))
      ) {
        e.preventDefault();
      }
    };

    // Apply event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}

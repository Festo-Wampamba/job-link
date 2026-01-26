"use client";

import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import { ReactNode, useEffect, useState } from "react";
import { dark } from "@clerk/themes";

export function ClerkProvider({ children }: { children: ReactNode }) {
  // Initialize to false for SSR, will be updated client-side
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Initial check wrapped in timeout to avoid synchronous setState in effect
    const updateDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark"));
    };
    
    // Run initial check
    updateDarkMode();

    // Watch for changes to the dark class
    const observer = new MutationObserver(updateDarkMode);

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <OriginalClerkProvider
      appearance={isDarkMode ? { baseTheme: [dark] } : undefined}
    >
      {children}
    </OriginalClerkProvider>
  );
}

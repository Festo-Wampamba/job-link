"use client";

import { ClerkProvider as OriginalClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";
import { dark } from "@clerk/themes";

export function ClerkProvider({ children }: { children: ReactNode }) {
  // Use static dark theme to prevent hydration mismatch
  // The app has className="dark" hardcoded in layout, so we always use dark theme
  // This ensures server and client render identically
  return (
    <OriginalClerkProvider appearance={{ baseTheme: dark }}>
      {children}
    </OriginalClerkProvider>
  );
}

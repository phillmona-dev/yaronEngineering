"use client";

import { createContext, useContext } from "react";
import { DEFAULT_CONTENT } from "./defaults";
import type { SiteContent } from "./types";

const SiteContentContext = createContext<SiteContent>(DEFAULT_CONTENT);

/** Makes the merged site content available to client components (header, hero, menus…). */
export function SiteContentProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: React.ReactNode;
}) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContent {
  return useContext(SiteContentContext);
}

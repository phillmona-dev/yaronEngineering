"use client";

import { useEffect, useState } from "react";
import { admin } from "@/lib/admin/client";
import type { ArticleDetail, User } from "@/lib/blog/types";
import { ArticleForm } from "./ArticleForm";

/** Loads the article (when editing) and the current user, then mounts the form once. */
export function ArticleEditorLoader({ id }: { id?: string }) {
  const [state, setState] = useState<{ article: ArticleDetail | null; user: User | null } | null>(
    null,
  );
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([
      id ? admin.get<ArticleDetail>(`articles/${id}`) : Promise.resolve(null),
      admin.get<User>("auth/me").catch(() => null),
    ])
      .then(([article, user]) => setState({ article, user }))
      .catch((e) => setError(e.message));
  }, [id]);
  if (error)
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}
      </p>
    );
  if (!state)
    return (
      <div className="grid gap-4">
        <div className="bg-ink-100 h-12 w-2/3 animate-pulse rounded" />
        <div className="bg-ink-100 h-20 animate-pulse rounded" />
        <div className="bg-ink-100 h-[520px] animate-pulse rounded" />
      </div>
    );
  return <ArticleForm initial={state.article} user={state.user} />;
}

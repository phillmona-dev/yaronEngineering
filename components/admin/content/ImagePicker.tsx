"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Link2, Trash2 } from "lucide-react";
import type { Media } from "@/lib/blog/types";
import { mediaUrl } from "@/lib/blog/format";
import { AdminButton, Modal, inputCls } from "@/components/admin/ui";
import { MediaGrid, MediaUploader } from "@/components/admin/MediaLibrary";

/**
 * Picture field for website content: shows the current image, opens the media library to pick
 * or upload another one, and still accepts a typed path for the built-in photos in /images.
 */
export function ImagePicker({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (src: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [manual, setManual] = useState(false);

  function pick(m: Media) {
    onChange(mediaUrl(m.url));
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="bg-ink-50/70 relative flex h-28 w-44 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/80">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- previews arbitrary paths without a size
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-ink-400 flex flex-col items-center gap-1 text-xs">
            <ImagePlus className="size-5" aria-hidden /> No picture
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <AdminButton type="button" size="sm" onClick={() => setOpen(true)}>
            <ImagePlus className="size-3.5" aria-hidden />{" "}
            {value ? "Change picture" : "Choose picture"}
          </AdminButton>
          <AdminButton type="button" size="sm" variant="ghost" onClick={() => setManual((v) => !v)}>
            <Link2 className="size-3.5" aria-hidden /> Enter a path
          </AdminButton>
          {value && (
            <AdminButton type="button" size="sm" variant="ghost" onClick={() => onChange("")}>
              <Trash2 className="size-3.5" aria-hidden /> Remove
            </AdminButton>
          )}
        </div>
        {manual && (
          <input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/images/photos/example.jpg or https://…"
            className={inputCls}
          />
        )}
        {!manual && value && <p className="text-ink-400 truncate text-xs">{value}</p>}
      </div>

      <Modal open={open} title="Choose a picture" onClose={() => setOpen(false)} wide>
        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-white/70 bg-white/40 p-4">
            <p className="text-ink-500 mb-3 text-xs font-medium">Upload a new picture</p>
            <MediaUploader
              onUploaded={(m) => {
                setRefreshKey((k) => k + 1);
                pick(m);
              }}
            />
          </div>
          <div>
            <p className="text-ink-500 mb-3 text-xs font-medium">
              …or pick one from the media library
            </p>
            <MediaGrid selectable onSelect={pick} refreshKey={refreshKey} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function LogoPreview({ src }: { src: string }) {
  if (!src) return null;
  return <Image src={src} alt="" width={80} height={40} className="h-8 w-auto" unoptimized />;
}

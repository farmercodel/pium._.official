// src/components/survey/ImageUpload.tsx
import { useState, useEffect } from "react";
import { uploadFiles } from "../../api/upload";

export default function ImageUpload({
  value = [],
  onUploaded,
  subdir = "ads/images",
  maxCount = 10,
}: {
  value?: string[];
  onUploaded: (urls: string[]) => void;
  subdir?: string;
  maxCount?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [urls, setUrls] = useState<string[]>(value);

  useEffect(() => { setUrls(value); }, [value]);

  const handleFiles = async (files: File[]) => {
    if (!files.length) return;
    try {
      setBusy(true);
      const remain = Math.max(0, maxCount - urls.length);
      const slice = files.slice(0, remain);
      if (slice.length === 0) return;

      const uploaded = await uploadFiles(slice, subdir);
      const merged = Array.from(new Set([...urls, ...uploaded]));
      setUrls(merged);
      onUploaded(merged);
    } finally {
      setBusy(false);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFiles(Array.from(e.target.files ?? []));
    e.currentTarget.value = "";
  };

  const removeOne = (u: string) => {
    const next = urls.filter(x => x !== u);
    setUrls(next);
    onUploaded(next);
  };

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    await handleFiles(Array.from(e.dataTransfer.files ?? []));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">이미지 업로드</label>

      <div
        className={`border-2 border-dashed rounded p-4 text-sm text-gray-500
                    ${busy ? "opacity-60" : "hover:bg-gray-50"}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        <p>(최대 {maxCount}장)</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          disabled={busy || urls.length >= maxCount}
          className="mt-2"
        />
      </div>

      {!!urls.length && (
        <div className="grid grid-cols-3 gap-2">
          {urls.map(u => (
            <div key={u} className="relative group">
              <img src={u} alt="" className="h-20 w-full object-cover rounded" />
              <button
                type="button"
                onClick={() => removeOne(u)}
                className="absolute top-1 right-1 text-xs bg-black/60 text-white rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100"
                aria-label="삭제"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}

      {busy && <p className="text-xs text-gray-500">업로드 중…</p>}
      <p className="text-xs text-gray-400">{urls.length}/{maxCount}장</p>
    </div>
  );
}

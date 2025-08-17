import { useState } from "react";
import { uploadFiles } from "../api/upload";

export default function ImageUpload({ onUploaded }: { onUploaded: (urls: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      setBusy(true);
      const uploaded = await uploadFiles(files, "ads/images");
      setUrls(uploaded);
      onUploaded(uploaded);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">이미지 업로드</label>
      <input type="file" accept="image/*" multiple onChange={handleChange} />
      {busy && <p className="text-xs text-gray-500">업로드 중…</p>}
      {!!urls.length && (
        <div className="grid grid-cols-3 gap-2">
          {urls.map(u => <img key={u} src={u} alt="" className="h-20 w-full object-cover rounded" />)}
        </div>
      )}
    </div>
  );
}

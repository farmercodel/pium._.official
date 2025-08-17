// src/api/upload.ts
import { api } from "./api";

export async function uploadFiles(files: File[], subdir?: string): Promise<string[]> {
  const fd = new FormData();
  files.forEach(f => fd.append("files", f));
  if (subdir) fd.append("subdir", subdir);

  const { data } = await api.post("/api/files/upload", fd);
  const items = data?.files ?? [];
  const urls: string[] = [];
  for (const f of items) {
    if (f.url) {
      urls.push(f.url);
    } else {
      const { data: presigned } = await api.get("/api/files/presigned-get", { params: { key: f.rel } });
      urls.push(presigned.url);
    }
  }
  return urls;
}

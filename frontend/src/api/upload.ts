// src/api/upload.ts
import { api } from "./api";

type UploadApiFile = { url?: string; rel?: string };

const toRelFromUrl = (u: string) => {
  try {
    const { pathname } = new URL(u);
    const parts = pathname.split("/").filter(Boolean);
    // path가 '/pium-dev/user-1/...' 형태면 'pium-dev' 제거, 
    // '/user-1/...' 형태면 그대로 사용
    return parts.length && parts[0].startsWith("user-") ? parts.join("/") : parts.slice(1).join("/");
  } catch { return ""; }
};

export type UploadResult = {
  urls: string[];         // generate 용
  keys: string[];         // choose-publish 용 (rel)
  files: UploadApiFile[]; // 원본
};

export async function uploadFiles(files: File[], subdir?: string): Promise<UploadResult> {
  const fd = new FormData();
  files.forEach(f => fd.append("files", f));
  if (subdir) fd.append("subdir", subdir);

  const { data } = await api.post("/api/files/upload", fd);
  const items: UploadApiFile[] = data?.files ?? [];

  const urls: string[] = [];
  const keys: string[] = [];

  for (const f of items) {
    // 1) URL 확보 (없으면 presigned GET)
    let url = f.url;
    if (!url && f.rel) {
      const { data: presigned } = await api.get("/api/files/presigned-get", { params: { key: f.rel } });
      url = presigned?.url;
    }
    if (url) urls.push(String(url));

    // 2) KEY(rel) 확보
    const rel = f.rel ?? (url ? toRelFromUrl(String(url)) : "");
    if (rel) keys.push(rel);
  }

  // 3) Generation 페이지에서 쓸 세션 저장
  try { sessionStorage.setItem("last_upload_image_keys", JSON.stringify(keys)); } catch {}

  return { urls, keys, files: items };
}

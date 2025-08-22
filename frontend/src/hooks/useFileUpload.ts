import { useState, useEffect } from 'react';
import type { ChangeEvent, DragEvent } from 'react';

// 파일 포맷 필터
const isImage = (f: File) => f.type.startsWith("image/");

// 중복 제거(이름+크기+lastModified 기준)
const dedupeFiles = (base: File[], incoming: File[]) => {
  const key = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;
  const set = new Set(base.map(key));
  const merged = [...base];
  for (const f of incoming) {
    if (!set.has(key(f))) {
      set.add(key(f));
      merged.push(f);
    }
  }
  return merged;
};

export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [dropActive, setDropActive] = useState(false);

  // objectURL 관리
  useEffect(() => {
    const urls = selectedFiles.map(f => URL.createObjectURL(f));
    setPreviews(urls);
    return () => {
      urls.forEach(u => URL.revokeObjectURL(u));
    };
  }, [selectedFiles]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  };

  const addFiles = (files: File[]) => {
    const onlyImages = files.filter(isImage);
    if (onlyImages.length < files.length) {
      alert("이미지 파일만 업로드할 수 있습니다.");
    }
    setSelectedFiles(prev => dedupeFiles(prev, onlyImages));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    addFiles(files);
    // 같은 파일 다시 선택 가능하도록 리셋
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDropActive(false);
    const files = Array.from(e.dataTransfer?.files ?? []);
    addFiles(files);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDropActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDropActive(false);
  };

  const removeFileAt = (idx: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
  };

  return {
    selectedFiles,
    previews,
    dropActive,
    formatBytes,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeFileAt,
    clearFiles,
    addFiles
  };
};

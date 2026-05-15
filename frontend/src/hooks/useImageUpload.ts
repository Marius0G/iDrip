import { useState, useCallback } from "react";

function resizeImage(file: File, maxSize: number = 400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        } else {
          if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function useImageUpload() {
  // Single-file state (backward compat)
  const [preview, setPreview] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Multi-file state
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // ── Single-file ──
  const processFile = useCallback(async (file: File): Promise<string> => {
    setIsProcessing(true);
    setRawFile(file);
    try {
      const dataUrl = await resizeImage(file);
      setPreview(dataUrl);
      return dataUrl;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearPreview = useCallback(() => {
    setPreview(null);
    setRawFile(null);
  }, []);

  // ── Multi-file ──
  const addFiles = useCallback(async (files: File[]): Promise<string[]> => {
    setIsProcessing(true);
    const dataUrls: string[] = [];
    for (const file of files) {
      const dataUrl = await resizeImage(file);
      dataUrls.push(dataUrl);
    }
    setRawFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...dataUrls]);
    setIsProcessing(false);
    return dataUrls;
  }, []);

  const removeFile = useCallback((index: number) => {
    setRawFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    setRawFiles([]);
    setPreviews([]);
    setPreview(null);
    setRawFile(null);
  }, []);

  return {
    // Single-file API (backward compat)
    preview, rawFile, isProcessing, processFile, clearPreview,
    // Multi-file API
    rawFiles, previews, addFiles, removeFile, clearAll,
  };
}

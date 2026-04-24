import React, { useCallback, useState } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../core/Button";
import { CameraCapture } from "./CameraCapture";

interface ImageUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isUploading?: boolean;
}

export function ImageUploader({ onUpload, isUploading }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [useCamera, setUseCamera] = useState(false);
  const [dpaConsent, setDpaConsent] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      return "Please select a valid image file (JPG, PNG).";
    }
    if (file.size > 10 * 1024 * 1024) {
      return "Image must be smaller than 10MB.";
    }
    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
      } else {
        setError("");
        setDpaConsent(false);
        setSelectedFile(file);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
      } else {
        setError("");
        setDpaConsent(false);
        setSelectedFile(file);
      }
    }
  };

  const submitUpload = async () => {
    if (!selectedFile) return;
    if (!dpaConsent) {
      setError("Please confirm your consent to process this medical image before analyzing.");
      return;
    }
    setError("");
    try {
      await onUpload(selectedFile);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to upload image securely.";
      setError(msg);
    }
  };

  return (
    <div className="w-full font-body-md">
      {useCamera ? (
        <CameraCapture
          onCapture={(file) => {
            setSelectedFile(file);
            setUseCamera(false);
          }}
          onClose={() => setUseCamera(false)}
        />
      ) : !selectedFile ? (
        <div className="w-full flex flex-col items-center">
          <label
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors bg-surface-lowest",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-surface-dim hover:bg-surface-container",
              error && "border-red-500 bg-red-50",
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
              <span className={cn(
                  "material-symbols-outlined text-[48px] mb-4",
                  dragActive ? "text-primary" : "text-secondary"
              )}>cloud_upload</span>
              <p className="mb-2 text-sm text-primary">
                <span className="font-semibold text-primary">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-secondary">
                Secure JPEG, PNG (MAX. 10MB)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleChange}
            />
          </label>

          <div className="mt-6 flex items-center justify-center">
            <span className="text-secondary text-sm mr-4">or</span>
            <Button variant="outline" onClick={() => setUseCamera(true)} className="rounded-full border-surface-dim text-secondary hover:text-primary">
              <span className="material-symbols-outlined mr-2 text-[18px]">photo_camera</span>
              Take Photo
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full rounded-xl border border-surface-dim bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 overflow-hidden">
              <div className="flex-shrink-0 h-16 w-16 bg-surface-lowest rounded-lg flex items-center justify-center border border-surface-dim">
                <span className="material-symbols-outlined text-[32px] text-secondary">image</span>
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-primary truncate pr-4">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-secondary mt-0.5">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            {!isUploading && (
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 text-secondary hover:text-red-500 transition-colors cursor-pointer rounded-full hover:bg-red-50"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            )}
          </div>

          <div className="mt-5 flex items-start bg-surface-lowest p-4 rounded-lg border border-surface-dim shadow-sm">
            <div className="flex items-center h-5 mt-0.5">
              <input
                id="upload-dpa-consent"
                type="checkbox"
                checked={dpaConsent}
                onChange={(e) => setDpaConsent(e.target.checked)}
                className="w-5 h-5 border border-surface-dim rounded bg-white focus:ring-2 focus:ring-primary text-primary appearance-none checked:bg-primary checked:border-transparent transition-colors cursor-pointer relative"
              />
            </div>
            <label htmlFor="upload-dpa-consent" className="ml-3 text-sm text-secondary font-medium leading-relaxed cursor-pointer">
              I explicitly consent to this specific image and associated demographic data being processed by AI and reviewed by Jamaican medical professionals in accordance with the Data Protection Act.
            </label>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
              className="rounded-full border-surface-dim text-secondary hover:text-primary px-5"
            >
              Cancel
            </Button>
            <Button
              onClick={submitUpload}
              isLoading={isUploading}
              className="px-6 rounded-full bg-primary text-on-primary hover:bg-primary/90 shadow-sm"
            >
              Analyze Securely
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center text-sm text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
          <span className="material-symbols-outlined mr-2 text-[18px]">error</span>
          {error}
        </div>
      )}

      <div className="mt-6 flex items-start text-xs text-secondary">
        <span className="material-symbols-outlined h-4 w-4 mr-2 flex-shrink-0 text-primary text-[18px]">gpp_good</span>
        <p>
          Your uploaded image is encrypted and processed via temporary signed
          URLs. It will be automatically deleted after your specified retention
          period.
        </p>
      </div>
    </div>
  );
}

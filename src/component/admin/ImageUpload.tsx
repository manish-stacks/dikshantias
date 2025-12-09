  "use client";

  import { useState, useEffect, ChangeEvent } from "react";
  import { ImageIcon } from "lucide-react";

  export default function ImageUpload({
    onImageSelect,
    isLoading,
    initialImage, // 👈 new prop
  }: {
    onImageSelect: (file: File) => void;
    isLoading?: boolean;
    initialImage?: string | null;
  }) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // when editing, set the preview from DB if no new image uploaded
    useEffect(() => {
      if (initialImage) {
        setPreviewImage(initialImage);
      }
    }, [initialImage]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
        onImageSelect(file); // send file to parent
      }
    };

    return (
      <label className="flex flex-col font-medium text-gray-700 mb-1">
        Upload Image
        <div className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-purple-400 transition relative">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="h-32 w-full object-contain mb-2 rounded"
            />
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
              <span className="text-gray-500 text-sm">
                Drag & drop or click to upload
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleImageChange}
            disabled={isLoading}
          />
        </div>
          {/* <span className="text-gray-400 text-xs mt-1">
            Recommended size: <strong>1920px × 600px</strong>
          </span> */}
      </label>  
    );
  }

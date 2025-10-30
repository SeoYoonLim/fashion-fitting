
import React, { useRef } from 'react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  label: string;
  icon: React.ReactNode;
  onImageUpload: (file: ImageFile | null) => void;
  previewUrl: string | null;
}

const fileToBase64 = (file: File): Promise<ImageFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};


export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, icon, onImageUpload, previewUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imageFile = await fileToBase64(file);
        onImageUpload(imageFile);
      } catch (error) {
        console.error("Error converting file to base64", error);
        onImageUpload(null);
      }
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (inputRef.current) {
        inputRef.current.value = "";
    }
    onImageUpload(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative group aspect-square bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-gray-700 transition-all duration-300"
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
        {previewUrl ? (
          <>
            <img src={previewUrl} alt={label} className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <button 
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 transition-colors"
                  aria-label="Remove image"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            {icon}
            <p className="mt-2 text-sm">Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  projectId: string;
  onUploadComplete: (imageUrl: string) => void;
}

export default function ImageUpload({ projectId, onUploadComplete }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Lütfen bir resim dosyası seçin');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      // Create a storage reference
      const timestamp = Date.now();
      const fileName = `${projectId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, `project-images/${fileName}`);

      // Upload file
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(Math.round(prog));
        },
        (err) => {
          // Error
          console.error('Upload error:', err);
          setError('Yükleme başarısız oldu');
          setUploading(false);
        },
        async () => {
          // Complete
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(downloadURL);
          setUploading(false);
          setProgress(0);
        }
      );
    } catch (err) {
      console.error('Upload error:', err);
      setError('Bir hata oluştu');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <div
          className={`
            border-2 border-dashed rounded-xl p-8
            ${uploading ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
            cursor-pointer transition-all
            text-center
          `}
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {uploading ? (
            <div className="space-y-3">
              <div className="text-5xl">📤</div>
              <p className="font-medium text-gray-700">Yükleniyor...</p>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">{progress}%</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-5xl">📸</div>
              <p className="font-medium text-gray-700">Resim Yükle</p>
              <p className="text-sm text-gray-500">
                Tıklayın veya sürükleyin (Max 5MB)
              </p>
            </div>
          )}
        </div>
      </label>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-800">⚠️ {error}</p>
        </div>
      )}
    </div>
  );
}

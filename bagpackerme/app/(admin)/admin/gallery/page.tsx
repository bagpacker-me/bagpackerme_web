'use client';

import { useEffect, useState, useRef } from 'react';
import { getGalleryImages, addGalleryImage, deleteGalleryImage } from '@/lib/firestore';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { GalleryImage } from '@/types';
import { Image as ImageIcon, Upload, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const snap = await getGalleryImages();
      setImages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryImage)));
    } catch {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      // 1. Upload to Storage
      const storageRef = ref(storage, `gallery/${Date.now()}_${selectedFile.name}`);
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const url = await getDownloadURL(snapshot.ref);

      // 2. Save metadata to Firestore
      const newImageRef = await addGalleryImage({
        url,
        title: uploadTitle || selectedFile.name,
        altText: uploadTitle || selectedFile.name,
        category: uploadCategory || 'Uncategorized',
        createdAt: new Date().toISOString()
      });

      // 3. Update local state
      setImages(prev => [{
        id: newImageRef.id,
        url,
        title: uploadTitle || selectedFile.name,
        altText: uploadTitle || selectedFile.name,
        category: uploadCategory || 'Uncategorized',
        createdAt: new Date().toISOString()
      }, ...prev]);

      toast.success('Image uploaded successfully');
      resetModal();
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image: GalleryImage) => {
    if (!window.confirm(`Are you sure you want to delete "${image.title}"?`)) return;

    try {
      // Delete from Firestore
      await deleteGalleryImage(image.id);
      
      // Delete from storage (extract path from URL)
      try {
        const urlObj = new URL(image.url);
        const pathRegex = /o\/(.+?)\?alt=/;
        const match = urlObj.pathname.match(pathRegex) || urlObj.search.match(pathRegex);
        if (match && match[1]) {
           const storagePath = decodeURIComponent(match[1]);
           const imageRef = ref(storage, storagePath);
           await deleteObject(imageRef);
        }
      } catch (storageErr) {
        console.warn('Could not cleanly delete from storage (might have been removed manually or invalid URL structure).', storageErr);
      }

      setImages(prev => prev.filter(img => img.id !== image.id));
      toast.success('Image deleted');
    } catch {
       toast.error('Failed to delete image');
    }
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setUploadTitle('');
    setUploadCategory('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#221E2A] font-heading">Gallery Management</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and manage images for your platform</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C1EA00] text-[#221E2A] rounded-xl text-sm font-bold hover:bg-[#aacc00] transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Image
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((skel) => (
             <div key={skel} className="bg-gray-200 animate-pulse aspect-square rounded-2xl" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <ImageIcon className="w-12 h-12 mb-4 text-gray-200" />
          <p className="font-medium text-gray-500">No images in the gallery yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map(image => (
            <div key={image.id} className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="aspect-square relative flex items-center justify-center bg-gray-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={image.url} 
                  alt={image.altText} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              <div className="p-4">
                <p className="font-semibold text-[#221E2A] truncate">{image.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{image.category}</span>
                  <span className="text-xs text-gray-400">{format(new Date(image.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>

              {/* Hover Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleDelete(image)}
                  className="p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-lg hover:bg-red-50 shadow-sm transition-colors"
                  title="Delete Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={resetModal} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 z-10 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#221E2A]">Upload New Image</h2>
              <button onClick={resetModal} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Image File <span className="text-red-500">*</span></label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1EA00] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Sunset in Bali"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1EA00] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <input 
                  type="text" 
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  placeholder="e.g. Beaches, Spiritual, Culture"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1EA00] focus:border-transparent"
                />
              </div>

              <div className="mt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetModal}
                  className="px-4 py-2 text-sm rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !selectedFile}
                  className="px-4 py-2 text-sm rounded-xl font-bold bg-[#221E2A] text-white hover:bg-[#322c3e] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPackage } from '@/lib/firestore';
import { Package } from '@/types';
import PackageForm from '@/components/admin/PackageForm';

export default function EditPackagePage() {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getPackage(id);
        if (!snap.exists()) {
          setNotFound(true);
        } else {
          setPkg({ id: snap.id, ...snap.data() } as Package);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48" />
            <div className="h-4 bg-gray-100 rounded w-72" />
            <div className="h-px bg-gray-100 my-6" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-100 rounded-xl" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="px-6 py-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center text-gray-400">
        <svg className="w-12 h-12 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium text-gray-500">Package not found</p>
        <a href="/admin/packages" className="mt-3 text-sm text-[#285056] hover:underline">
          ← Back to Packages
        </a>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="mb-7">
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          Edit Package
        </h1>
        <p className="text-sm text-gray-400 mt-0.5 truncate max-w-md">
          {pkg?.title}
          {pkg?.slug && <span className="ml-2 text-gray-300">/ {pkg.slug}</span>}
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {pkg && <PackageForm initialData={pkg} />}
      </div>
    </div>
  );
}

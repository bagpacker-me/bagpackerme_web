'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getJobOpening } from '@/lib/firestore';
import { JobOpening } from '@/types';
import JobOpeningForm from '@/components/admin/JobOpeningForm';

export default function EditJobOpeningPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobOpening(id).then((snap) => {
      if (snap.exists()) {
        setJob({ id: snap.id, ...snap.data() } as JobOpening);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Loading role...</span>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="font-medium">Role not found.</p>
      </div>
    );
  }

  return <JobOpeningForm initialData={job} jobId={id} />;
}

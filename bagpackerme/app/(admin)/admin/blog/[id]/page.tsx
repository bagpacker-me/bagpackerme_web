'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBlog } from '@/lib/firestore';
import { BlogPost } from '@/types';
import BlogForm from '@/components/admin/BlogForm';

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlog(id).then((snap) => {
      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() } as BlogPost);
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
          <span className="text-sm">Loading post...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <p className="font-medium">Post not found.</p>
      </div>
    );
  }

  return <BlogForm initialData={post} blogId={id} />;
}

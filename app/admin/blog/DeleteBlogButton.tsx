'use client';

import React from 'react';
import { deleteBlogPost } from './actions';

export default function DeleteBlogButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      try {
        await deleteBlogPost(id);
      } catch (e) {
        alert('Failed to delete blog post.');
      }
    }
  };

  return (
    <button onClick={handleDelete} className="action-btn delete-btn">
      <i className="fas fa-trash"></i> Delete
    </button>
  );
}

'use client';

import React from 'react';
import { deleteFaq } from './actions';

export default function DeleteFaqButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
      try {
        await deleteFaq(id);
      } catch (e) {
        alert('Failed to delete FAQ. Please try again.');
      }
    }
  };

  return (
    <button onClick={handleDelete} className="action-btn delete-btn">
      <i className="fas fa-trash"></i> Delete
    </button>
  );
}

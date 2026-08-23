'use client';

import React from 'react';
import { deleteTestimonial } from './actions';

export default function DeleteTestimonialButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
      try {
        await deleteTestimonial(id);
      } catch (e) {
        alert('Failed to delete testimonial. Please try again.');
      }
    }
  };

  return (
    <button onClick={handleDelete} className="action-btn delete-btn">
      <i className="fas fa-trash"></i> Delete
    </button>
  );
}

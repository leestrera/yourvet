'use client';

import React from 'react';
import { deleteStaff } from './actions';

export default function DeleteStaffButton({ id }: { id: string }) {
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this staff member? Note: This might fail if they are assigned to appointments. In that case, mark them as inactive instead.')) {
      try {
        await deleteStaff(id);
      } catch (e) {
        alert('Failed to delete staff. They may have related appointments or records. Please mark them as inactive instead.');
      }
    }
  };

  return (
    <button onClick={handleDelete} className="action-btn delete-btn">
      <i className="fas fa-trash"></i> Delete
    </button>
  );
}

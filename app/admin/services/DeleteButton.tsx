'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

export default function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      className="action-btn" 
      disabled={pending}
      style={{ 
        padding: '0.5rem', 
        background: '#fee2e2', 
        border: 'none', 
        borderRadius: '6px', 
        color: '#ef4444', 
        cursor: pending ? 'not-allowed' : 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        opacity: pending ? 0.5 : 1
      }} 
      title="Delete Service" 
      onClick={(e) => { 
        if(!confirm('Are you sure you want to delete this service?')) {
          e.preventDefault(); 
        }
      }}
    >
      <i className="fas fa-trash"></i>
    </button>
  );
}

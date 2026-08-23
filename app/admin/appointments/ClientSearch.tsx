'use client';
import React, { useState } from 'react';

export default function ClientSearch() {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.appointment-item');
        
        cards.forEach(card => {
            const text = card.getAttribute('data-search-content') || '';
            (card as HTMLElement).style.display = text.includes(searchText) ? '' : 'none';
        });
    };

    return (
        <div className="list-filters">
            <div className="search-box">
                <i className="fas fa-search"></i>
                <input 
                    type="text" 
                    id="appointmentSearch" 
                    placeholder="Search appointments by owner, pet, or status..."
                    onChange={handleSearch}
                />
            </div>
        </div>
    );
}

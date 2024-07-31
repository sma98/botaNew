"use client";
import React from 'react';

const SuggestionChips = ({ suggestions }) => {
  const handleSuggestionClick = (action) => {
    if (action.link) {
      window.open(action.link.url, action.link.target);
    } else if (action.message) {
      // Handle message action
    }
  };

  return (
    <div className="flex space-x-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => handleSuggestionClick(suggestion.action)}
          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {suggestion.title}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;

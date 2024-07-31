"use client";
import React from 'react';

const BasicCard = ({ card }) => {
  const handleButtonClick = (action) => {
    if (action.link) {
      window.open(action.link.url, action.link.target);
    } else if (action.message) {
      // Handle message action
    }
  };

  return (
    <div className="bg-gray-700 text-gray-300 rounded-lg p-4 shadow-md">
      <img src={card.image.url} alt={card.image.alt} className="rounded-t-lg" />
      <h2 className="text-xl font-bold">{card.title}</h2>
      <h3 className="text-lg">{card.subtitle}</h3>
      <p>{card.body}</p>
      <div className="mt-4">
        {card.action.buttons.map((button, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(button.action)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          >
            {button.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BasicCard;

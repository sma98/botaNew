"use client";

import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  // State to manage if the chatbot is open or closed
  const [isOpen, setIsOpen] = useState(false);
  // State to manage the current user input
  const [userInput, setUserInput] = useState('');
  // State to manage the conversation messages
  const [messages, setMessages] = useState([]);
  // State to manage loading
  const [loading, setLoading] = useState(false);

  // Reference to the message container
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  // Function to scroll to the bottom of the message container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to toggle the chatbot open/closed
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle user input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    wsRef.current = new WebSocket("wss://chatbot-svelte.onrender.com/ws");

    wsRef.current.onmessage = (event) => {
      const messageText = event.data;

      // Check if the message is JSON
      let data;
      try {
        data = JSON.parse(messageText);
      } catch (error) {
        // If not, treat it as plain text
        data = { botcopy: [{ suggestions: [{ title: messageText }] }] };
      }

      const botMessages = data.botcopy.map((item) => ({
        sender: 'bot',
        text: item.suggestions.map((suggestion) => suggestion.title).join(', '),
        suggestions: item.suggestions,
      }));

      setMessages((prevMessages) => [
        ...prevMessages,
        ...botMessages,
      ]);
      setLoading(false);
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Function to handle sending a message
  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userInput }]);
    setUserInput('');
    setLoading(true);

    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ message: userInput }));
    }
  };

  // Function to format the date
  const formatDate = () => {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="fixed bottom-5 right-8 z-50">
      <div className="relative">
        {/* Toggle Open Button */}
        {!isOpen && (
          <img
            src="/a.png" // Replace with your image path
            alt="Open Chat"
            className="w-12 h-12 cursor-pointer"
            onClick={toggleChatbot}
          />
        )}

        {isOpen && (
          <>
            {/* Header Bar */}
            <div
              className="bg-gray-800 text-white p-4 rounded-t-lg cursor-pointer select-none shadow-lg flex justify-between items-center"
              onClick={toggleChatbot}
            >
              <span className="font-bold tracking-wide text-lg">Chatbot</span>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMessages([]); // Refresh messages
                  }}
                  className="text-white text-lg"
                >
                  &#x21bb; {/* Unicode character for refresh */}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleChatbot();
                  }}
                  className="text-white text-lg"
                >
                  &times; {/* Unicode character for close */}
                </button>
              </div>
            </div>

            {/* Chatbot Interface */}
            <div className="bg-gray-100 shadow-md p-5 w-96 h-[600px] transition-all duration-300 ease-in-out flex flex-col rounded-b-lg">
              {/* Display current date */}
             <div className="relative"> 
              <div className="text-gray-600 text-center mb-2 flex items-center justify-center">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="px-2 font-bold text-xs">{formatDate()}</span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div></div>

              <div className="flex-1 custom-scrollbar overflow-y-auto mb-4 pr-2">
                {/* Display messages */}
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-center`}>
                    {msg.sender === 'bot' && (
                      <img src="/a.png" alt="Bot icon" className="w-6 h-6 mr-2" />
                    )}
                    <div
                      className={`my-2 p-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start items-center">
                    <img src="/a.png" alt="Bot icon" className="w-6 h-6 mr-2" />
                    <div className="my-2 p-2 rounded-lg max-w-xs bg-gray-200 text-gray-800">
                      <span className="loading">Loading...</span>
                    </div>
                  </div>
                )}
                {/* Reference element to scroll to */}
                <div ref={messagesEndRef} />
              </div>
              <div className="relative flex items-center">
                {/* Input for user messages */}
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder=" message..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') sendMessage();
                  }}
                />
                {userInput && (
                  <img
                    src="/ra.png"
                    alt="Send"
                    className="absolute right-2 w-8 h-8 cursor-pointer p-1 rounded-full hover:bg-gray-700 transition-colors duration-200"
                    onClick={sendMessage}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {/* Image below the chat interface */}
        <div className="flex justify-end mt-2">
          <img
            src="/down.png" // Replace with your image path
            alt="Close Chat"
            className={`w-12 h-12 cursor-pointer mt-2 ${isOpen ? '' : 'hidden'}`}
            onClick={toggleChatbot}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

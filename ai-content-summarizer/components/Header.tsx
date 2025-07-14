
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                AI Content Summarizer
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;

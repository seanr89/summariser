import React from 'react';

interface ErrorProps {
  error: string;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(error);
  };

  return (
    <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
      <div className="flex justify-between items-center">
        <p className="font-bold">Error</p>
        <button 
          onClick={handleCopy} 
          className="px-2 py-1 bg-red-200 text-red-800 rounded-md text-sm hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          aria-label="Copy error message"
        >
          Copy
        </button>
      </div>
      <p className="mt-2">{error}</p>
    </div>
  );
};

export default Error;

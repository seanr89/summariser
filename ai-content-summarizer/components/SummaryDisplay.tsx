
import React, { useState, useEffect } from 'react';
import { SummaryResult } from '../types';
import { ExportIcon, CopyIcon, CheckIcon, LinkIcon } from './icons';

interface SummaryDisplayProps {
  result: SummaryResult;
  onExport: () => void;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ result, onExport }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.summary);
    setIsCopied(true);
  };

  return (
    <div className="w-full mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Generated Summary</h2>
        <div className="flex items-center space-x-2">
            <button
                onClick={handleCopy}
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Copy summary"
            >
                {isCopied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <CopyIcon className="w-5 h-5" />}
            </button>
            <button
                onClick={onExport}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold transition-colors"
            >
                <ExportIcon className="w-5 h-5 mr-2" />
                Export
            </button>
        </div>
      </div>
      
      <div className="prose prose-blue dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
        {result.summary}
      </div>

      {result.sources && result.sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Sources</h3>
            <ul className="space-y-2">
                {result.sources.map((source, index) => (
                    source.web && (
                        <li key={index} className="flex items-start">
                            <LinkIcon className="w-4 h-4 mr-2 mt-1 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            <a 
                                href={source.web.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 hover:underline break-all"
                            >
                                {source.web.title || source.web.uri}
                            </a>
                        </li>
                    )
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default SummaryDisplay;

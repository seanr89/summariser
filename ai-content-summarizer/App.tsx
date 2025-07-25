import React, { useState, useCallback, ChangeEvent } from 'react';
import { InputMode, SummaryResult, AIModel, SummaryDetail } from './types';
import * as geminiService from './services/geminiService';
import * as claudeService from './services/claudeService';
import * as openaiService from './services/openaiService';
import Header from './components/Header';
import SummaryDisplay from './components/SummaryDisplay';
import Spinner from './components/Spinner';
import Error from './components/Error';
import { LinkIcon, FileIcon, UploadCloudIcon } from './components/icons';

const App: React.FC = () => {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.URL);
  const [inputValue, setInputValue] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel>(AIModel.GEMINI);
  const [summaryDetail, setSummaryDetail] = useState<SummaryDetail>(SummaryDetail.DETAILED);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setFileContent(text);
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read file.");
        setFileContent('');
        setFileName('');
      }
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSummaryResult(null);
    setIsLoading(true);

    try {
      let result: SummaryResult;
      
      const service = {
          [AIModel.GEMINI]: geminiService,
          [AIModel.CLAUDE]: claudeService,
          [AIModel.OPENAI]: openaiService,
      }[selectedModel];

      if (inputMode === InputMode.URL) {
        if (!inputValue) {
            throw new Error("Please enter a URL.");
        }
        result = await service.summarizeUrl(inputValue, summaryDetail);
      } else {
        if (!fileContent) {
            throw new Error("Please select and upload a valid text file.");
        }
        result = await service.summarizeText(fileContent, summaryDetail);
      }
      setSummaryResult(result);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('GEMINI_API_KEY')) {
          setError('The GEMINI_API_KEY environment variable is not set. Please set it in your .env file or as a system environment variable.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = useCallback(() => {
    if (!summaryResult?.summary) return;

    const blob = new Blob([summaryResult.summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'summary.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [summaryResult]);

  const TabButton: React.FC<{ mode: InputMode; icon: React.ReactNode }> = ({ mode, icon }) => (
    <button
      onClick={() => {
        setInputMode(mode);
        setError(null);
        setSummaryResult(null);
      }}
      className={`flex items-center justify-center w-full px-4 py-3 font-semibold rounded-t-lg transition-colors duration-200 ease-in-out focus:outline-none ${
        inputMode === mode
          ? 'bg-white dark:bg-gray-800 text-blue-500 border-b-2 border-blue-500'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
    >
      {icon}
      <span className="ml-2">{mode}</span>
    </button>
  );

  const DetailSelectorButton: React.FC<{ detail: SummaryDetail, isFirst: boolean, isLast: boolean }> = ({ detail, isFirst, isLast }) => (
    <button
        type="button"
        onClick={() => setSummaryDetail(detail)}
        className={`relative inline-flex items-center justify-center px-4 py-3 text-sm font-medium transition-colors focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 w-1/3
            ${isFirst ? 'rounded-l-md' : ''}
            ${isLast ? 'rounded-r-md' : '-ml-px'}
            ${summaryDetail === detail
                ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
            }
        `}
    >
        {detail}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-2">
            <TabButton mode={InputMode.URL} icon={<LinkIcon className="w-5 h-5" />} />
            <TabButton mode={InputMode.FILE} icon={<FileIcon className="w-5 h-5" />} />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                  <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      AI Model
                  </label>
                  <select
                      id="model-select"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  >
                      {Object.values(AIModel).map(model => (
                          <option key={model} value={model}>{model}</option>
                      ))}
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Summary Detail
                  </label>
                  <div className="flex w-full rounded-md shadow-sm">
                      {Object.values(SummaryDetail).map((detail, index, arr) => (
                          <DetailSelectorButton 
                              key={detail}
                              detail={detail}
                              isFirst={index === 0}
                              isLast={index === arr.length - 1}
                          />
                      ))}
                  </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {inputMode === InputMode.URL ? (
                <div>
                  <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Web Page URL
                  </label>
                  <input
                    id="url-input"
                    type="url"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload Document
                  </label>
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md border-2 border-dashed border-gray-300 dark:border-gray-500 flex flex-col justify-center items-center w-full h-32 text-center p-4 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                      <UploadCloudIcon className="w-10 h-10 mx-auto text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-600 dark:text-gray-300">
                          {fileName ? fileName : <><span>Click to upload</span> or drag and drop</>}
                      </span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.md,.html" />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supports .txt, .md, .html</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? <Spinner /> : 'Summarize'}
              </button>
            </form>
          </div>
        </div>
        
        {error && (
          <div className="mt-6">
            <Error error={error} />
          </div>
        )}

        {summaryResult && (
          <SummaryDisplay result={summaryResult} onExport={handleExport} />
        )}
      </main>
    </div>
  );
};

export default App;

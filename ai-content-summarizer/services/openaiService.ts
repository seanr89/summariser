import { SummaryResult, SummaryDetail } from '../types';

const mockSummary = (detail: SummaryDetail) => {
  switch (detail) {
    case SummaryDetail.BRIEF:
      return "OpenAI mock service: A brief summary.";
    case SummaryDetail.COMPREHENSIVE:
      return "OpenAI mock service: A comprehensive summary with extensive details, broken down into multiple sections for clarity and deep understanding.";
    case SummaryDetail.DETAILED:
    default:
      return "OpenAI mock service: A detailed summary that provides key points and takeaways in a structured format.";
  }
};

export const summarizeText = async (text: string, detail: SummaryDetail): Promise<SummaryResult> => {
  console.log(`OpenAIService: Summarizing text with ${detail} detail.`);
  if (!text) throw new Error("Input text cannot be empty.");

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return { summary: mockSummary(detail) };
};

export const summarizeUrl = async (url: string, detail: SummaryDetail): Promise<SummaryResult> => {
  console.log(`OpenAIService: Summarizing URL ${url} with ${detail} detail.`);
  if (!url) throw new Error("URL cannot be empty.");
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    summary: mockSummary(detail),
    sources: [{ web: { uri: url, title: "Mock Source from OpenAI" } }]
  };
};

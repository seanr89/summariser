import { SummaryResult, SummaryDetail } from '../types';

const mockSummary = (detail: SummaryDetail) => {
  switch (detail) {
    case SummaryDetail.BRIEF:
      return "This is a brief mock summary from the Claude service. It is short and to the point.";
    case SummaryDetail.COMPREHENSIVE:
      return "This is a comprehensive mock summary from the Claude service.\n\n- It covers multiple points in detail.\n- It is structured for easy reading.\n- It demonstrates the comprehensive summary level.";
    case SummaryDetail.DETAILED:
    default:
      return "This is a detailed mock summary from the Claude service. It provides more information than the brief summary but is less in-depth than the comprehensive one.";
  }
};

export const summarizeText = async (text: string, detail: SummaryDetail): Promise<SummaryResult> => {
  console.log(`ClaudeService: Summarizing text with ${detail} detail.`);
  if (!text) throw new Error("Input text cannot be empty.");
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return { summary: mockSummary(detail) };
};

export const summarizeUrl = async (url: string, detail: SummaryDetail): Promise<SummaryResult> => {
  console.log(`ClaudeService: Summarizing URL ${url} with ${detail} detail.`);
  if (!url) throw new Error("URL cannot be empty.");

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    summary: mockSummary(detail),
    sources: [{ web: { uri: url, title: "Mock Source from Claude" } }]
  };
};

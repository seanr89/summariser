import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SummaryResult, SummaryDetail } from '../types';

let ai: GoogleGenAI | null = null;

const textModel = 'gemini-2.5-flash';
const groundedModel = 'gemini-2.5-flash';

export const updateKey = (apiKey: string) => {
    ai = new GoogleGenAI({ apiKey: apiKey });
}

const getTextSummarizationPrompt = (detail: SummaryDetail): string => {
    switch (detail) {
        case SummaryDetail.BRIEF:
            return `Provide a very brief, one-paragraph summary of the following text. Capture only the main points.`;
        case SummaryDetail.COMPREHENSIVE:
            return `Provide a comprehensive, in-depth summary of the following text. Break it down into sections with headings and use bullet points for key details. The goal is a thorough overview.`;
        case SummaryDetail.DETAILED:
        default:
            return `Provide a concise, easy-to-read summary of the following text. Use bullet points for key takeaways.`;
    }
}

const getUrlSummarizationPrompt = (url: string, detail: SummaryDetail): string => {
    switch (detail) {
        case SummaryDetail.BRIEF:
            return `Provide a very brief, one-paragraph summary of the main content found at the URL: ${url}.`;
        case SummaryDetail.COMPREHENSIVE:
            return `Provide a comprehensive, in-depth summary of the main content at ${url}. Break it down into sections with headings and use bullet points for key details, data, and arguments. The goal is a thorough and exhaustive overview.`;
        case SummaryDetail.DETAILED:
        default:
            return `Please provide a detailed summary of the main content found at the following URL: ${url}. Focus on the key points and main arguments. If the page is a news article, identify the main event and its context. Use bullet points for key takeaways.`;
    }
}


export const summarizeText = async (text: string, detail: SummaryDetail): Promise<SummaryResult> => {
    console.log('gemini:summarizeText');
    if (!ai) throw new Error("Gemini API key not set.");
    if (!text) throw new Error("Input text cannot be empty.");

    const instruction = getTextSummarizationPrompt(detail);
    const prompt = `${instruction}\n\n---\n\n${text}`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: textModel,
            contents: prompt,
        });
        return { summary: response.text || '' };
    } catch (error) {
        console.error("Error summarizing text:", error);
        throw new Error("Failed to generate summary from text.");
    }
};

export const summarizeUrl = async (url: string, detail: SummaryDetail): Promise<SummaryResult> => {
    console.log('gemini:summarizeUrl');
    if (!ai) throw new Error("Gemini API key not set.");
    if (!url) throw new Error("URL cannot be empty.");

    const prompt = getUrlSummarizationPrompt(url, detail);
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: groundedModel,
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        
        const summary = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        if (!summary) {
            throw new Error("The model did not return a summary for this URL.");
        }

        return { summary, sources };
    } catch (error) {
        console.error("Error summarizing URL:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to summarize the URL: ${error.message}. It might be inaccessible, invalid, or have restricted content.`);
        }
        throw new Error("An unknown error occurred while summarizing the URL.");
    }
};

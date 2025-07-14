
import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import { SummaryResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const textModel = 'gemini-2.5-flash';
const groundedModel = 'gemini-2.5-flash';

export const summarizeText = async (text: string): Promise<SummaryResult> => {
    if (!text) throw new Error("Input text cannot be empty.");

    const prompt = `Provide a concise, easy-to-read summary of the following text. Use bullet points for key takeaways:\n\n---\n\n${text}`;

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

export const summarizeUrl = async (url: string): Promise<SummaryResult> => {
    if (!url) throw new Error("URL cannot be empty.");

    const prompt = `Please provide a detailed summary of the main content found at the following URL: ${url}. Focus on the key points and main arguments. If the page is a news article, identify the main event and its context.`;

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

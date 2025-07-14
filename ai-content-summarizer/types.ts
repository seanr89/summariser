import { GroundingChunk } from "@google/genai";

export enum InputMode {
  URL = 'URL',
  FILE = 'FILE',
}

export enum AIModel {
  GEMINI = 'Gemini',
  CLAUDE = 'Claude',
  OPENAI = 'OpenAI',
}

export enum SummaryDetail {
  BRIEF = 'Brief',
  DETAILED = 'Detailed',
  COMPREHENSIVE = 'Comprehensive',
}

export interface SummaryResult {
  summary: string;
  sources?: GroundingChunk[];
}

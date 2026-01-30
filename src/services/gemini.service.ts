/**
 * Gemini AI Service for generating typing practice sentences
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

export type ComplexityLevel = 'easy' | 'medium' | 'hard';

export interface SentenceGenerationOptions {
    wordCount: number;
    complexity: ComplexityLevel;
}

class GeminiService {
    private genAI: GoogleGenerativeAI | null = null;
    private model: any = null;
    private lastGeneratedSentences: string[] = [];

    constructor() {
        this.initialize();
    }

    private initialize() {
        // Read API key from environment variable
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

        if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
            try {
                this.genAI = new GoogleGenerativeAI(apiKey);
                this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
            } catch (error) {
                console.error('Failed to initialize Gemini:', error);
            }
        }
    }

    isConfigured(): boolean {
        return this.model !== null;
    }

    private getComplexityDescription(complexity: ComplexityLevel): string {
        switch (complexity) {
            case 'easy':
                return 'simple everyday words, short common words, basic vocabulary';
            case 'medium':
                return 'moderate vocabulary, some longer words, balanced difficulty';
            case 'hard':
                return 'advanced vocabulary, longer words, complex terms, professional language';
        }
    }

    async generateSentences(options: SentenceGenerationOptions): Promise<string[]> {
        if (!this.model) {
            throw new Error('Gemini API not configured. Please set your API key.');
        }

        const { wordCount, complexity } = options;
        const complexityDesc = this.getComplexityDescription(complexity);

        const prompt = `Generate a single coherent sentence for typing practice with these requirements:
- Use exactly ${wordCount} words
- Difficulty level: ${complexity} (${complexityDesc})
- The sentence should be grammatically correct and make sense
- Use proper punctuation at the end
- Make it interesting and engaging for typing practice
- Focus on common ${complexity === 'easy' ? 'everyday' : complexity === 'medium' ? 'moderate' : 'advanced'} language

Generate ONLY the sentence, nothing else. No quotes, no explanations.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().trim();

            // Clean up the response
            let sentence = text
                .replace(/^["']|["']$/g, '') // Remove quotes
                .replace(/^\d+\.\s*/, '') // Remove numbering
                .trim();

            // Ensure it ends with punctuation
            if (!/[.!?]$/.test(sentence)) {
                sentence += '.';
            }

            this.lastGeneratedSentences.push(sentence);
            return this.splitSentenceIntoWords(sentence);
        } catch (error) {
            console.error('Error generating sentence:', error);
            throw error;
        }
    }

    private splitSentenceIntoWords(sentence: string): string[] {
        // Remove punctuation from the end and split by spaces
        const cleanSentence = sentence.replace(/[.!?,;:]$/, '');
        return cleanSentence.split(/\s+/).filter(word => word.length > 0);
    }

    getLastGeneratedSentence(): string {
        return this.lastGeneratedSentences[this.lastGeneratedSentences.length - 1] || '';
    }

    clearCache() {
        this.lastGeneratedSentences = [];
    }
}

// Export singleton instance
export const geminiService = new GeminiService();

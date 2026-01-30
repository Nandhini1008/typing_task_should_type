/**
 * Configuration service for fetching Gemini settings
 */

export interface GeminiConfig {
    wordCount: number;
    complexity: 'easy' | 'medium' | 'hard';
    settings?: {
        generateOnStart?: boolean;
        fallbackToWordlist?: boolean;
    };
}

// Default configuration (fallback)
const DEFAULT_CONFIG: GeminiConfig = {
    wordCount: 25,
    complexity: 'medium',
    settings: {
        generateOnStart: true,
        fallbackToWordlist: true,
    },
};

class ConfigService {
    private cachedConfig: GeminiConfig | null = null;
    private configApiUrl: string;

    constructor() {
        // Read API URL from environment variable
        // If not set, will use default config
        this.configApiUrl = import.meta.env.VITE_CONFIG_API_URL || '';
    }

    /**
     * Fetch configuration from backend API or use default
     */
    async getConfig(): Promise<GeminiConfig> {
        // Return cached config if available
        if (this.cachedConfig) {
            return this.cachedConfig;
        }

        // If no API URL configured, use default
        if (!this.configApiUrl) {
            console.log('No config API URL set, using default configuration');
            this.cachedConfig = DEFAULT_CONFIG;
            return DEFAULT_CONFIG;
        }

        try {
            // Fetch from backend API
            const response = await fetch(this.configApiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Config API returned ${response.status}`);
            }

            const config: GeminiConfig = await response.json();

            // Validate config
            if (!this.isValidConfig(config)) {
                console.warn('Invalid config from API, using default');
                this.cachedConfig = DEFAULT_CONFIG;
                return DEFAULT_CONFIG;
            }

            console.log('Loaded configuration from API:', config);
            this.cachedConfig = config;
            return config;
        } catch (error) {
            console.error('Failed to fetch config from API, using default:', error);
            this.cachedConfig = DEFAULT_CONFIG;
            return DEFAULT_CONFIG;
        }
    }

    /**
     * Force refresh configuration from backend
     */
    async refreshConfig(): Promise<GeminiConfig> {
        this.cachedConfig = null;
        return this.getConfig();
    }

    /**
     * Clear cached configuration
     */
    clearCache(): void {
        this.cachedConfig = null;
    }

    /**
     * Validate configuration structure
     */
    private isValidConfig(config: any): config is GeminiConfig {
        return (
            typeof config === 'object' &&
            typeof config.wordCount === 'number' &&
            config.wordCount >= 10 &&
            config.wordCount <= 50 &&
            typeof config.complexity === 'string' &&
            ['easy', 'medium', 'hard'].includes(config.complexity)
        );
    }
}

// Export singleton instance
export const configService = new ConfigService();

// Theme configurations
export interface Theme {
    id: string;
    name: string;
    colors: {
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        primary: string;
        secondary: string;
        error: string;
        correct: string;
        incorrect: string;
        extra: string;
        caret: string;
        border: string;
    };
}

export const THEMES: Record<string, Theme> = {
    'dark-default': {
        id: 'dark-default',
        name: 'Dark Default',
        colors: {
            background: '#1a1a1a',
            surface: '#242424',
            text: '#e0e0e0',
            textSecondary: '#888888',
            primary: '#646cff',
            secondary: '#535bf2',
            error: '#ef4444',
            correct: '#22c55e',
            incorrect: '#ef4444',
            extra: '#f97316',
            caret: '#646cff',
            border: '#333333',
        },
    },
    'light-default': {
        id: 'light-default',
        name: 'Light Default',
        colors: {
            background: '#f8f8f8',
            surface: '#ffffff',
            text: '#1a1a1a',
            textSecondary: '#666666',
            primary: '#646cff',
            secondary: '#535bf2',
            error: '#ef4444',
            correct: '#22c55e',
            incorrect: '#ef4444',
            extra: '#f97316',
            caret: '#646cff',
            border: '#e0e0e0',
        },
    },
    dracula: {
        id: 'dracula',
        name: 'Dracula',
        colors: {
            background: '#282a36',
            surface: '#353746',
            text: '#f8f8f2',
            textSecondary: '#6272a4',
            primary: '#bd93f9',
            secondary: '#ff79c6',
            error: '#ff5555',
            correct: '#50fa7b',
            incorrect: '#ff5555',
            extra: '#ffb86c',
            caret: '#bd93f9',
            border: '#44475a',
        },
    },
    nord: {
        id: 'nord',
        name: 'Nord',
        colors: {
            background: '#2e3440',
            surface: '#3b4252',
            text: '#eceff4',
            textSecondary: '#4c566a',
            primary: '#88c0d0',
            secondary: '#81a1c1',
            error: '#bf616a',
            correct: '#a3be8c',
            incorrect: '#bf616a',
            extra: '#d08770',
            caret: '#88c0d0',
            border: '#434c5e',
        },
    },
    monokai: {
        id: 'monokai',
        name: 'Monokai',
        colors: {
            background: '#272822',
            surface: '#3e3d32',
            text: '#f8f8f2',
            textSecondary: '#75715e',
            primary: '#a6e22e',
            secondary: '#66d9ef',
            error: '#f92672',
            correct: '#a6e22e',
            incorrect: '#f92672',
            extra: '#fd971f',
            caret: '#f8f8f0',
            border: '#49483e',
        },
    },
    'solarized-dark': {
        id: 'solarized-dark',
        name: 'Solarized Dark',
        colors: {
            background: '#002b36',
            surface: '#073642',
            text: '#839496',
            textSecondary: '#586e75',
            primary: '#268bd2',
            secondary: '#2aa198',
            error: '#dc322f',
            correct: '#859900',
            incorrect: '#dc322f',
            extra: '#cb4b16',
            caret: '#268bd2',
            border: '#073642',
        },
    },
    'solarized-light': {
        id: 'solarized-light',
        name: 'Solarized Light',
        colors: {
            background: '#fdf6e3',
            surface: '#eee8d5',
            text: '#657b83',
            textSecondary: '#93a1a1',
            primary: '#268bd2',
            secondary: '#2aa198',
            error: '#dc322f',
            correct: '#859900',
            incorrect: '#dc322f',
            extra: '#cb4b16',
            caret: '#268bd2',
            border: '#eee8d5',
        },
    },
    'gruvbox-dark': {
        id: 'gruvbox-dark',
        name: 'Gruvbox Dark',
        colors: {
            background: '#282828',
            surface: '#3c3836',
            text: '#ebdbb2',
            textSecondary: '#928374',
            primary: '#fe8019',
            secondary: '#fabd2f',
            error: '#fb4934',
            correct: '#b8bb26',
            incorrect: '#fb4934',
            extra: '#fe8019',
            caret: '#fe8019',
            border: '#504945',
        },
    },
};

export const getTheme = (themeId: string): Theme => {
    return (THEMES[themeId] ?? THEMES['dark-default']) as Theme;
};

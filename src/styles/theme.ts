// theme.ts
export const theme = {
    colors: {
        primary: '#0075C9',
        primaryDark: '#005FA3',
        primaryLight: '#E6F2FB',
        textMain: '#1A1A1A',
        textSecondary: '#5F5F5F',
        background: '#F9FAFB',
        cardBg: '#FFFFFF',
        border: '#e4ebf5',
        borderSecondary: '#E0E0E0',
        error: 'red',
    },
    radius: '8px',
    transition: 'all 0.2s ease-in-out',
    font: `'Inter', sans-serif`,
};

export type ThemeType = typeof theme;

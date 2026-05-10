import type { Config } from 'tailwindcss';

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#FF6500',
                secondary: '#1E3E62',
                tertiary: '#0B192C',
                background: '#000000',
            },
            backgroundColor: {
                primary: '#FF6500',
                secondary: '#1E3E62',
                tertiary: '#0B192C',
                background: '#000000',
            },
            borderColor: {
                primary: '#FF6500',
                secondary: '#1E3E62',
                tertiary: '#0B192C',
            },
            textColor: {
                primary: '#FF6500',
                secondary: '#1E3E62',
                tertiary: '#0B192C',
            },
        },
    },
    plugins: [],
} satisfies Config;

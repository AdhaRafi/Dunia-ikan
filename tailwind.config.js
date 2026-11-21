import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './resources/views/app.blade.php',
        './resources/js/**/*.{js,jsx}',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', '"Montserrat"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Modern Aquatic Lifestyle Marketplace Tokens
                'aquatic': {
                    'surface': '#f8fcfe',
                    'surface-dim': '#d8eff8',
                    'surface-bright': '#f8fcfe',
                    'container-lowest': '#ffffff',
                    'container-low': '#f0f9fd',
                    'container': '#e3f4fb',
                    'container-high': '#d4eff9',
                    'container-highest': '#A1E1EF',
                    'on-surface': '#14335D',
                    'on-surface-variant': '#335075',
                    'navy': '#14335D',
                    'navy-deep': '#0F2647',
                    'teal': '#60C2E6',
                    'teal-dark': '#005A9D',
                    'ocean': '#005A9D',
                    'ocean-dark': '#00477C',
                    'blue': '#005A9D',
                    'ice': '#A1E1EF',
                    'sky': '#60C2E6',
                    'cream': '#FFE4B0',
                    'green': '#C0ECB8',
                    'outline': '#60C2E6',
                    'outline-variant': '#A1E1EF',
                },
                // Backwards compatibility aliases
                'dunia-navy': '#14335D',
                'dunia-blue': '#005A9D',
                'dunia-aqua': '#60C2E6',
                'dunia-ice': '#A1E1EF',
                'dunia-marine': '#005A9D',
                'wild-dark': '#14335D',
                'wild-panel': '#0F2647',
                'wild-card': '#14335D',
                'wild-green': '#60C2E6',
                'wild-green-light': '#A1E1EF',
                'wild-green-dark': '#005A9D',
                'wild-teal': '#005A9D',
                'wild-muted': '#335075',
                'wild-light': '#f8fcfe',
            },
            borderRadius: {
                spec: '6px',
            },
            maxWidth: {
                page: '1280px',
            },
        },
    },

    plugins: [forms],
};

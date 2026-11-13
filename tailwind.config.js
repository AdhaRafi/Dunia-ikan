import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"Montserrat"', '"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'wild-dark': '#0E1719',
                'wild-panel': '#142224',
                'wild-card': '#192C2E',
                'wild-green': '#00C882',
                'wild-green-light': '#34D399',
                'wild-green-dark': '#059669',
                'wild-teal': '#1E80A0',
                'wild-muted': '#64748B',
                'wild-light': '#F8FAF9',
                'dunia-navy': '#0E1719',
                'dunia-blue': '#00C882',
                'dunia-marine': '#059669',
                'dunia-aqua': '#10B981',
                'dunia-cream': '#F8FAF9',
                'dunia-soft': '#F1F5F9',
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

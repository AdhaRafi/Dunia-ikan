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
                sans: ['"Plus Jakarta Sans"', '"Montserrat"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                // Modern Aquatic Lifestyle Marketplace Tokens
                'aquatic': {
                    'surface': '#fbf8ff',
                    'surface-dim': '#d2d8ff',
                    'surface-bright': '#fbf8ff',
                    'container-lowest': '#ffffff',
                    'container-low': '#f3f2ff',
                    'container': '#ececff',
                    'container-high': '#e4e7ff',
                    'container-highest': '#dde1ff',
                    'on-surface': '#001454',
                    'on-surface-variant': '#3d4949',
                    'navy': '#001454',
                    'navy-deep': '#0D2E92',
                    'teal': '#4AB8BD',
                    'teal-dark': '#00696D',
                    'ocean': '#1E80A0',
                    'ocean-dark': '#006783',
                    'blue': '#0684E5',
                    'cream': '#FFE4B0',
                    'green': '#C0ECB8',
                    'outline': '#6d797a',
                    'outline-variant': '#bcc9c9',
                },
                // Backwards compatibility aliases
                'wild-dark': '#001454',
                'wild-panel': '#0D2E92',
                'wild-card': '#192C2E',
                'wild-green': '#4AB8BD',
                'wild-green-light': '#C0ECB8',
                'wild-green-dark': '#00696D',
                'wild-teal': '#1E80A0',
                'wild-muted': '#3d4949',
                'wild-light': '#fbf8ff',
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

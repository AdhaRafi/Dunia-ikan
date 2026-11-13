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
                sans: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                dunia: {
                    blue: '#0684E5',
                    aqua: '#4AB8BD',
                    marine: '#1E80A0',
                    navy: '#0D2E92',
                    soft: '#FBF8FF',
                    cream: '#FFE4B0',
                    mint: '#C0ECB8',
                },
            },
        },
    },

    plugins: [forms],
};

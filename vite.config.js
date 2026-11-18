import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    const normalized = id.replace(/\\/g, '/');

                    if (normalized.includes('/node_modules/')) {
                        if (
                            normalized.includes('/react/') ||
                            normalized.includes('/react-dom/') ||
                            normalized.includes('/scheduler/') ||
                            normalized.includes('/@inertiajs/') ||
                            normalized.includes('/axios/') ||
                            normalized.includes('/lucide-react/')
                        ) {
                            return 'vendor';
                        }
                        return;
                    }

                    // Bundle shared storefront layout and UI atoms together so cold loads
                    // fetch one shell chunk instead of fanning out into 10+ tiny requests.
                    if (
                        normalized.includes('/resources/js/Layouts/AppLayout.jsx') ||
                        normalized.includes('/resources/js/Components/TopHeader.jsx') ||
                        normalized.includes('/resources/js/Components/Footer.jsx') ||
                        normalized.includes('/resources/js/Components/BrandWordmark.jsx') ||
                        normalized.includes('/resources/js/Components/UserAvatar.jsx') ||
                        normalized.includes('/resources/js/Components/StoreLogo.jsx') ||
                        normalized.includes('/resources/js/Components/ProductCard.jsx') ||
                        normalized.includes('/resources/js/Components/AquaticMotifs.jsx') ||
                        normalized.includes('/resources/js/lib/')
                    ) {
                        return 'shell';
                    }
                },
            },
        },
    },
});

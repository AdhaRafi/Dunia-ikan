import { lazy, Suspense, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import TopHeader from '@/Components/TopHeader';
import Footer from '@/Components/Footer';
import { AquaticCanvasBackdrop } from '@/Components/AquaticMotifs';
import { useLanguage } from '@/lib/i18n';
import { AlertTriangle, Check, X } from 'lucide-react';

const Sidebar = lazy(() => import('@/Components/Sidebar'));
const ChatbotWidget = lazy(() => import('@/Components/ChatbotWidget'));

export default function AppLayout({ children }) {
    const { flash } = usePage().props;
    const { pick } = useLanguage();
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMounted, setChatMounted] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [sidebarMounted, setSidebarMounted] = useState(false);
    const [showFlash, setShowFlash] = useState(true);
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return (
                document.documentElement.classList.contains('dark') ||
                localStorage.getItem('theme') === 'dark'
            );
        }
        return false;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (darkMode) {
                document.documentElement.classList.add('dark');
                document.documentElement.style.colorScheme = 'dark';
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.colorScheme = 'light';
                localStorage.setItem('theme', 'light');
            }
        }
    }, [darkMode]);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
        }
    }, [flash?.success, flash?.error]);

    const openChat = () => {
        setChatMounted(true);
        setChatOpen(true);
    };

    const openMobileSidebar = () => {
        setSidebarMounted(true);
        setMobileSidebarOpen(true);
    };

    useEffect(() => {
        window.addEventListener('dunia-ikan:open-chat', openChat);
        return () => window.removeEventListener('dunia-ikan:open-chat', openChat);
    }, []);

    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            window.matchMedia('(pointer: coarse)').matches
        ) {
            return;
        }

        let targetY = window.scrollY;
        let currentY = window.scrollY;
        let rafId = null;
        let lastTime = 0;

        const hasScrollableAncestor = (target, deltaY) => {
            let el = target instanceof Element ? target : null;
            while (el && el !== document.body && el !== document.documentElement) {
                if (el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
                    return true;
                }
                const overflowY = window.getComputedStyle(el).overflowY;
                if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
                    const atTop = el.scrollTop <= 0;
                    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
                    if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
                        return true;
                    }
                }
                el = el.parentElement;
            }
            return false;
        };

        const tick = (now) => {
            const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016;
            lastTime = now;

            // Exponential damping keeps glide consistent across 60Hz, 120Hz, and 144Hz displays.
            const factor = 1 - Math.exp(-11 * dt);
            const diff = targetY - currentY;

            if (Math.abs(diff) < 0.5) {
                currentY = targetY;
                window.scrollTo({ top: currentY, behavior: 'instant' });
                rafId = null;
                lastTime = 0;
                return;
            }

            currentY += diff * factor;
            window.scrollTo({ top: currentY, behavior: 'instant' });
            rafId = requestAnimationFrame(tick);
        };

        const onWheel = (e) => {
            if (e.ctrlKey || e.defaultPrevented || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                return;
            }

            let delta = e.deltaY;
            if (e.deltaMode === 1) {
                delta *= 32;
            } else if (e.deltaMode === 2) {
                delta *= window.innerHeight;
            }

            if (delta === 0 || hasScrollableAncestor(e.target, delta)) {
                return;
            }

            e.preventDefault();

            if (!rafId) {
                currentY = window.scrollY;
                targetY = window.scrollY;
            }

            const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            targetY = Math.min(maxY, Math.max(0, targetY + delta));

            if (!rafId) {
                lastTime = 0;
                rafId = requestAnimationFrame(tick);
            }
        };

        const onNativeScroll = () => {
            if (!rafId) {
                currentY = window.scrollY;
                targetY = window.scrollY;
            }
        };

        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('scroll', onNativeScroll, { passive: true });

        return () => {
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('scroll', onNativeScroll);
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
        };
    }, []);

    return (
        <div className="relative isolate min-h-screen w-full flex flex-col overflow-x-clip aquatic-canvas-ambient text-[#001454] dark:text-[#e4e7ff] antialiased selection:bg-[#001454] selection:text-white transition-colors duration-200">
            <AquaticCanvasBackdrop />

            {/* Full-Width Header with Brand, Search & Horizontal Navigation */}
            <TopHeader
                onOpenMobileSidebar={openMobileSidebar}
                onOpenChat={openChat}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode((prev) => !prev)}
            />

            {/* Mobile Sliding Drawer Navigation (lazy-loaded on first drawer open) */}
            {sidebarMounted && (
                <Suspense fallback={null}>
                    <Sidebar
                        isOpen={mobileSidebarOpen}
                        onClose={() => setMobileSidebarOpen(false)}
                        onOpenChat={openChat}
                        darkMode={darkMode}
                        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
                    />
                </Suspense>
            )}

            {/* Flash Messages */}
            {showFlash && (flash?.success || flash?.error) && (
                <div className="px-4 sm:px-6 lg:px-8 pt-4 w-full max-w-6xl mx-auto">
                    {flash.success && (
                        <div className="flex items-center justify-between gap-4 rounded-xl bg-[#00696D] px-4 py-3 text-xs font-bold text-white shadow-md">
                            <span className="flex items-center gap-2">
                                <Check className="h-4 w-4 shrink-0 text-[#C0ECB8]" />
                                {flash.success}
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowFlash(false)}
                                className="p-1 text-white/80 hover:text-white"
                                aria-label="Tutup pesan"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    {flash.error && (
                        <div className="flex items-center justify-between gap-4 rounded-xl bg-[#ba1a1a] px-4 py-3 text-xs font-bold text-white shadow-md">
                            <span className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0 text-[#ffdad6]" />
                                {flash.error}
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowFlash(false)}
                                className="p-1 text-white/80 hover:text-white"
                                aria-label="Tutup pesan"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Page Content Canvas */}
            <main className="relative z-0 flex-1 w-full min-w-0">
                {children}
            </main>

            {/* Lightweight floating trigger renders immediately; heavy chat UI loads only when opened */}
            {chatMounted ? (
                <Suspense fallback={null}>
                    <ChatbotWidget
                        isOpen={chatOpen}
                        onOpen={() => setChatOpen(true)}
                        onClose={() => setChatOpen(false)}
                    />
                </Suspense>
            ) : (
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
                    <button
                        type="button"
                        onClick={openChat}
                        className="group flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d2e92]/60 focus-visible:ring-offset-2"
                        title={pick('Buka Chatbot Kiko', 'Open Kiko Assistant')}
                        aria-label={pick('Tanya Kiko', 'Ask Kiko')}
                    >
                        <span className="relative hidden sm:inline-flex items-center rounded-full bg-white dark:bg-[#131d33] px-4 py-2 text-[13px] font-bold tracking-tight text-[#001454] dark:text-white border border-slate-200/90 dark:border-slate-700/80 shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-transform duration-200 group-hover:-translate-x-0.5">
                            <span>{pick('Tanya Kiko', 'Ask Kiko')}</span>
                            <span
                                aria-hidden="true"
                                className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 rounded-[2px] bg-white dark:bg-[#131d33] border-t border-r border-slate-200/90 dark:border-slate-700/80"
                            />
                        </span>

                        <span className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#133b9e] to-[#081c59] p-0.5 ring-2 ring-white dark:ring-slate-800 shadow-[0_10px_28px_rgba(0,20,84,0.3)] transition-all duration-200 group-hover:scale-105 group-active:scale-95">
                            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#1642ad] to-[#081c59] p-1">
                                <img
                                    src="/images/kiko/avatar.webp"
                                    alt="Kiko"
                                    width={56}
                                    height={48}
                                    decoding="async"
                                    className="h-full w-full object-contain -translate-y-0.5"
                                />
                            </span>
                            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#070b14]" />
                        </span>
                    </button>
                </div>
            )}

            <Footer />
        </div>
    );
}

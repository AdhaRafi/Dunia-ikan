import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import TopHeader from '@/Components/TopHeader';
import Footer from '@/Components/Footer';
import ChatbotWidget from '@/Components/ChatbotWidget';
import { AlertTriangle, Check, MessageSquare, X } from 'lucide-react';

export default function AppLayout({ children }) {
    const { flash } = usePage().props;
    const [chatOpen, setChatOpen] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
        <div className="min-h-screen w-full flex flex-col overflow-x-clip bg-[#fbf8ff] dark:bg-[#070b14] text-[#001454] dark:text-[#e4e7ff] antialiased selection:bg-[#001454] selection:text-white transition-colors duration-200">
            {/* Full-Width TopHeader with Single Logo */}
            <TopHeader
                onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
                onOpenChat={() => setChatOpen(true)}
                darkMode={darkMode}
                onToggleDarkMode={() => setDarkMode((prev) => !prev)}
            />

            {/* Content Row Below TopHeader: Left Sidebar + Page Canvas */}
            <div className="flex-1 flex min-w-0">
                {/* Left Sidebar (Collapsible rail under TopHeader on desktop, sliding drawer on mobile) */}
                <Sidebar
                    isOpen={mobileSidebarOpen}
                    onClose={() => setMobileSidebarOpen(false)}
                    onOpenChat={() => setChatOpen(true)}
                    darkMode={darkMode}
                    onToggleDarkMode={() => setDarkMode((prev) => !prev)}
                />

                {/* Main Area: Flash + Page Canvas + Footer (Native Window Scroll) */}
                <div className="flex-1 min-w-0 flex flex-col">

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
                <main className="flex-1 w-full min-w-0">
                    {children}
                </main>

                {/* Kiko Mascot AI Assistant Widget (Floating Pill, Speech Bubble & Chat Modal) */}
                <ChatbotWidget
                    isOpen={chatOpen}
                    onOpen={() => setChatOpen(true)}
                    onClose={() => setChatOpen(false)}
                />

                <Footer />
                </div>
            </div>
        </div>
    );
}

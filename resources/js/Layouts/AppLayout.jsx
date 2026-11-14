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

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
        }
    }, [flash?.success, flash?.error]);

    return (
        <div className="h-screen w-full flex overflow-hidden bg-[#fbf8ff] dark:bg-[#070b14] text-[#001454] dark:text-[#e4e7ff] antialiased selection:bg-[#001454] selection:text-white transition-colors duration-200">
            {/* Left Sidebar (Docked on desktop, sliding drawer on mobile) */}
            <Sidebar
                isOpen={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
            />

            {/* Main Area: TopHeader + Page Canvas + Footer (Independent Clean Scroll) */}
            <div className="flex-1 h-full min-w-0 flex flex-col overflow-y-auto overflow-x-hidden">
                <TopHeader 
                    onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
                    onOpenChat={() => setChatOpen(true)}
                />

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

                {/* AI Assistant Floating Button */}
                {!chatOpen && (
                    <button
                        type="button"
                        onClick={() => setChatOpen(true)}
                        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#0D2E92] px-4 py-3 text-xs font-extrabold text-white shadow-xl hover:bg-[#001454] hover:scale-105 transition-all border border-[#1E80A0]/20"
                        title="Tanya Asisten Ikan AI"
                        aria-label="Buka asisten AI"
                    >
                        <MessageSquare className="h-4 w-4 text-[#4AB8BD]" />
                        <span className="hidden sm:inline">Asisten AI</span>
                    </button>
                )}

                <ChatbotWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />

                <Footer />
            </div>
        </div>
    );
}

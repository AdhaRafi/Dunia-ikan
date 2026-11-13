import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ChatbotWidget from '@/Components/ChatbotWidget';
import { AlertTriangle, Check, MessageSquare, X } from 'lucide-react';

export default function AppLayout({ children }) {
    const { flash } = usePage().props;
    const [chatOpen, setChatOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(true);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
        }
    }, [flash?.success, flash?.error]);

    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-900">
            <Navbar onOpenChat={() => setChatOpen(true)} />

            {showFlash && (flash?.success || flash?.error) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
                    {flash.success && (
                        <div className="flex items-center justify-between gap-4 rounded-xl bg-emerald-700 px-4 py-3 text-xs font-bold text-white shadow-md">
                            <span className="flex items-center gap-2">
                                <Check className="h-4 w-4 shrink-0 text-[#00C882]" />
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
                        <div className="flex items-center justify-between gap-4 rounded-xl bg-rose-700 px-4 py-3 text-xs font-bold text-white shadow-md">
                            <span className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-300" />
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

            <main className="flex-1">{children}</main>

            {!chatOpen && (
                <button
                    type="button"
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#00C882] px-4 py-3 text-xs font-extrabold text-slate-950 shadow-xl shadow-emerald-500/25 hover:bg-emerald-400 hover:scale-105 transition-all"
                    title="Tanya Asisten Ikan AI"
                    aria-label="Buka asisten AI"
                >
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Tanya Asisten AI</span>
                </button>
            )}

            <ChatbotWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />

            <Footer />
        </div>
    );
}

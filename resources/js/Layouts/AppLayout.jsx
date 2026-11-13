import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import ChatbotWidget from '@/Components/ChatbotWidget';
import { Sparkles, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function AppLayout({ children }) {
    const { flash } = usePage().props;
    const [chatOpen, setChatOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(true);

    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans selection:bg-dunia-aqua/30 selection:text-dunia-navy">
            {/* Global Navbar */}
            <Navbar onOpenChat={() => setChatOpen(true)} />

            {/* Flash Messages */}
            {showFlash && (flash?.success || flash?.error) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
                    {flash.success && (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-sm shadow-xs animate-in fade-in">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                                <span className="font-medium">{flash.success}</span>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="text-emerald-500 hover:text-emerald-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    {flash.error && (
                        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-sm shadow-xs animate-in fade-in">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                                <span className="font-medium">{flash.error}</span>
                            </div>
                            <button onClick={() => setShowFlash(false)} className="text-rose-500 hover:text-rose-700">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Floating Chat Trigger Button */}
            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-dunia-blue to-dunia-marine text-white px-4 py-3.5 rounded-full shadow-xl hover:shadow-dunia-blue/30 flex items-center gap-2.5 font-bold text-sm hover:scale-105 active:scale-95 transition cursor-pointer"
                    title="Konsultasi Kesehatan & Rekomendasi Ikan AI"
                >
                    <div className="relative">
                        <Sparkles className="w-5 h-5 text-dunia-aqua" />
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-dunia-aqua animate-ping"></span>
                    </div>
                    <span>Tanya Asisten Ikan AI</span>
                </button>
            )}

            {/* Chatbot Drawer Widget */}
            <ChatbotWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />

            {/* Global Footer */}
            <Footer />
        </div>
    );
}

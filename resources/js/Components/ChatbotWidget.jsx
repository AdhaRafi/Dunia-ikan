import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Image as ImageIcon,
    Loader2,
    Send,
    Sparkles,
    X,
} from 'lucide-react';
import axios from 'axios';

export default function ChatbotWidget({ isOpen, onOpen, onClose }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sessionToken, setSessionToken] = useState(null);
    const [showBubble, setShowBubble] = useState(true);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            fetchHistory();
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('dunia_ikan_chat_token');
            const res = await axios.get('/chatbot/history', {
                params: { session_token: token },
            });

            if (res.data.session_token) {
                setSessionToken(res.data.session_token);
                localStorage.setItem(
                    'dunia_ikan_chat_token',
                    res.data.session_token,
                );
            }

            if (res.data.messages && res.data.messages.length > 0) {
                setMessages(res.data.messages);
            } else {
                setMessages([
                    {
                        sender: 'assistant',
                        message:
                            'Halo! Aku Kiko 🐟, asisten virtual Dunia Ikan. Ada yang bisa kubantu seputar ikan hias atau produk katalog hari ini?',
                        created_at: new Date().toISOString(),
                    },
                ]);
            }
        } catch (err) {
            console.error('Failed to load chat history:', err);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];

        if (!file) {
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            alert('Ukuran gambar maksimal 3MB');
            return;
        }

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSendMessage = async (textToSend = null) => {
        const message = textToSend || inputText;

        if ((!message || !message.trim()) && !selectedImage) {
            return;
        }

        const currentText = message.trim();
        const currentImgPreview = imagePreview;

        setMessages((prev) => [
            ...prev,
            {
                sender: 'user',
                message: currentText,
                image_path: currentImgPreview,
                created_at: new Date().toISOString(),
            },
        ]);
        setInputText('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('message', currentText);

            if (sessionToken) {
                formData.append('session_token', sessionToken);
            }

            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            removeImage();

            const response = await axios.post('/chatbot/message', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.session_token) {
                setSessionToken(response.data.session_token);
                localStorage.setItem(
                    'dunia_ikan_chat_token',
                    response.data.session_token,
                );
            }

            setMessages((prev) => [...prev, response.data.assistant_message]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'assistant',
                    message:
                        'Maaf, layanan sedang tidak dapat dihubungi. Coba lagi beberapa saat atau periksa koneksi internet Anda.',
                    created_at: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes kikoFloat {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
                .animate-kiko-float {
                    animation: kikoFloat 3s ease-in-out infinite;
                }
            `}</style>

            {/* 1. FLOATING TRIGGER BUTTON & SPEECH BUBBLE (WHEN CHAT CLOSED) */}
            {!isOpen && (
                <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none">
                    {/* Floating Speech Bubble / Tooltip (matching Lena reference video) */}
                    {showBubble && (
                        <div
                            onClick={onOpen}
                            className="relative mb-3.5 w-[280px] sm:w-[310px] cursor-pointer rounded-2xl bg-[#131d33] p-4 text-white shadow-2xl border border-slate-700/80 dark:border-cyan-500/30 transition-transform duration-200 hover:scale-[1.02] group"
                        >
                            {/* Close button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBubble(false);
                                }}
                                className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-white rounded-lg transition"
                                title="Tutup info"
                                aria-label="Tutup info"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-1.5 mb-2.5 pr-6">
                                <Sparkles className="h-4 w-4 text-[#00C882] shrink-0" />
                                <span className="text-xs sm:text-[13px] font-black text-white tracking-tight">
                                    Tanya Kiko untuk bantuan!
                                </span>
                            </div>

                            {/* Service bullet items */}
                            <div className="space-y-1.5 text-[11px] leading-snug text-slate-300">
                                <p className="flex items-start gap-1.5">
                                    <span className="text-[#00C882] font-bold">✓</span>
                                    <span>Panduan kesehatan & perawatan ikan.</span>
                                </p>
                                <p className="flex items-start gap-1.5">
                                    <span className="text-[#00C882] font-bold">✓</span>
                                    <span>Rekomendasi spesimen, morph & breeder resmi.</span>
                                </p>
                                <p className="flex items-start gap-1.5">
                                    <span className="text-[#00C882] font-bold">✓</span>
                                    <span>Panduan karantina & garansi hidup 100% (D.O.A).</span>
                                </p>
                            </div>

                            {/* Pointer tail pointing down directly to Kiko mascot */}
                            <div className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 border-b border-r border-slate-700/80 dark:border-cyan-500/30 bg-[#131d33]" />
                        </div>
                    )}

                    {/* Pill Trigger with Kiko Mascot popping out */}
                    <button
                        type="button"
                        onClick={onOpen}
                        className="group relative flex h-14 items-center rounded-full bg-[#cfe2fe] dark:bg-[#131d33] pl-4 sm:pl-5 pr-14 sm:pr-16 text-[#001454] dark:text-white border border-[#9ec5fe] dark:border-cyan-500/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03]"
                        title="Buka Chatbot Kiko"
                        aria-label="Tanya Kiko Virtual Assistant"
                    >
                        {/* Text and Online Badge */}
                        <div className="flex flex-col text-left">
                            <span className="text-xs sm:text-sm font-black tracking-tight leading-none text-[#001454] dark:text-white">
                                Tanya Kiko
                            </span>
                            <span className="mt-1 flex items-center text-[10px] font-semibold text-slate-600 dark:text-cyan-300/90 leading-none">
                                <span className="relative flex h-2 w-2 mr-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                </span>
                                Virtual Assistant
                            </span>
                        </div>

                        {/* Kiko Mascot popping out of the pill container */}
                        <div className="absolute -top-5 sm:-top-6 right-0.5 w-14 h-14 sm:w-16 sm:h-16 pointer-events-none drop-shadow-lg animate-kiko-float">
                            <img
                                src="/images/kiko/kiko-wave.png"
                                alt="Kiko Maskot"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </button>
                </div>
            )}

            {/* 2. CHATBOT WINDOW (WHEN OPEN) */}
            {isOpen && (
                <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col sm:w-[420px] sm:h-[640px] max-h-[92vh]">
                    {/* Chat Modal Container */}
                    <div className="w-full h-full flex flex-col bg-white dark:bg-[#070b14] sm:rounded-2xl sm:border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden transition-all duration-200">
                        {/* Header */}
                        <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#001454] via-[#092265] to-[#0d2e92] dark:from-[#0b1325] dark:via-[#0e172e] dark:to-[#111a30] px-4 py-3 text-white border-b border-cyan-500/20">
                            <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                    <img
                                        src="/images/kiko/kiko-avatar.png"
                                        alt="Kiko"
                                        className="w-10 h-10 rounded-full border-2 border-[#00C882] bg-slate-900 object-contain p-0.5 shadow-md"
                                    />
                                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900"></span>
                                </div>
                                <div>
                                    <h3 className="text-sm font-black leading-tight text-white flex items-center gap-1.5">
                                        Kiko ChatBot
                                        <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full bg-[#00C882]/20 text-[#00C882] border border-[#00C882]/40 tracking-wider">
                                            AI
                                        </span>
                                    </h3>
                                    <p className="text-[11px] text-cyan-200/80">
                                        Asisten Dunia Ikan · AI Aktif
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
                                aria-label="Tutup asisten"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages Body */}
                    <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 dark:bg-[#070b14] p-4">
                        {messages.map((msg, index) => {
                            const isUser = msg.sender === 'user';

                            return (
                                <div
                                    key={index}
                                    className={`flex items-start gap-2 ${
                                        isUser ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                                >
                                    {/* Avatar for assistant */}
                                    {!isUser && (
                                        <img
                                            src="/images/kiko/kiko-avatar.png"
                                            alt="Kiko"
                                            className="w-7 h-7 rounded-full border border-cyan-500/40 bg-slate-900 object-contain shrink-0 shadow-xs mt-1"
                                        />
                                    )}

                                    <div
                                        className={`max-w-[85%] px-4 py-3 text-xs leading-relaxed ${
                                            isUser
                                                ? 'bg-[#001454] dark:bg-[#1E80A0] text-white rounded-2xl rounded-tr-xs shadow-xs'
                                                : 'bg-white dark:bg-[#111a30] text-slate-800 dark:text-neutral-100 rounded-2xl rounded-tl-xs border border-slate-200 dark:border-neutral-700/80 shadow-xs'
                                        }`}
                                    >
                                        {!isUser && (
                                            <p className="text-[10px] font-bold text-[#00C882] uppercase tracking-wider mb-1">
                                                Kiko
                                            </p>
                                        )}

                                        {msg.image_path && (
                                            <div className="mb-2 overflow-hidden rounded-lg">
                                                <img
                                                    src={
                                                        msg.image_path.startsWith('blob:')
                                                            ? msg.image_path
                                                            : `/storage/${msg.image_path}`
                                                    }
                                                    alt="Unggahan pengguna"
                                                    className="max-h-48 w-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="whitespace-pre-wrap">
                                            {msg.message}
                                        </div>

                                        {msg.fish_guides &&
                                            msg.fish_guides.length > 0 && (
                                                <div className="mt-3 space-y-2 border-t border-slate-200 dark:border-neutral-700/60 pt-2.5">
                                                    <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#001454] dark:text-cyan-300">
                                                        <BookOpen className="h-3.5 w-3.5 text-[#00C882]" />
                                                        Rujukan panduan resmi
                                                    </p>
                                                    {msg.fish_guides.map((guide) => (
                                                        <Link
                                                            key={guide.id}
                                                            href={`/guides/${guide.id}`}
                                                            className="block border-l-2 border-[#00C882] bg-slate-100 dark:bg-[#162240] px-3 py-2 text-[11px] font-medium text-slate-800 dark:text-neutral-200 hover:text-[#00C882] transition rounded-r-md"
                                                        >
                                                            {guide.title}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                        {msg.recommended_products &&
                                            msg.recommended_products.length > 0 && (
                                                <div className="mt-3 space-y-2 border-t border-slate-200 dark:border-neutral-700/60 pt-2.5">
                                                    <p className="text-[11px] font-bold text-[#001454] dark:text-cyan-300">
                                                        Rekomendasi di katalog
                                                    </p>
                                                    {msg.recommended_products.map(
                                                        (prod) => (
                                                            <Link
                                                                key={prod.id}
                                                                href={`/products/${prod.slug}`}
                                                                className="flex items-center gap-2.5 rounded-lg bg-slate-100 dark:bg-[#162240] p-2 hover:bg-slate-200 dark:hover:bg-[#1c2c52] transition"
                                                            >
                                                                <img
                                                                    src={prod.image}
                                                                    alt={prod.name}
                                                                    className="h-10 w-10 shrink-0 rounded-md object-cover"
                                                                />
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate text-[11px] font-bold text-slate-800 dark:text-white">
                                                                        {prod.name}
                                                                    </p>
                                                                    <p className="text-[11px] font-extrabold text-[#00C882] tabular-nums">
                                                                        Rp{' '}
                                                                        {new Intl.NumberFormat(
                                                                            'id-ID',
                                                                        ).format(
                                                                            prod.price,
                                                                        )}
                                                                    </p>
                                                                    <p className="truncate text-[10px] text-slate-500 dark:text-neutral-400">
                                                                        {prod.store_name} · Stok {prod.stock}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            );
                        })}

                        {loading && (
                            <div className="flex items-center gap-2.5 rounded-2xl bg-white dark:bg-[#111a30] border border-slate-200 dark:border-neutral-700/80 px-4 py-3 text-xs text-slate-600 dark:text-neutral-300 w-fit">
                                <img
                                    src="/images/kiko/kiko-avatar.png"
                                    alt="Kiko"
                                    className="w-5 h-5 rounded-full object-contain shrink-0 animate-spin"
                                />
                                <span>Kiko sedang memeriksa gejala dan katalog...</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Prompts */}
                    <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#070b14] px-3 py-2 text-xs">
                        <button
                            type="button"
                            onClick={() =>
                                handleSendMessage(
                                    'Ikan cupang saya ada bintik putih di sirip, bagaimana penanganannya?',
                                )
                            }
                            className="whitespace-nowrap rounded-full bg-slate-100 dark:bg-[#111a30] hover:bg-emerald-50 dark:hover:bg-[#162240] text-slate-700 dark:text-neutral-300 hover:text-[#00C882] px-3 py-1 text-[11px] font-medium border border-slate-200/60 dark:border-neutral-700 transition"
                        >
                            Bintik putih
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                handleSendMessage(
                                    'Ekor ikan saya robek dan membusuk, apa yang harus dilakukan?',
                                )
                            }
                            className="whitespace-nowrap rounded-full bg-slate-100 dark:bg-[#111a30] hover:bg-emerald-50 dark:hover:bg-[#162240] text-slate-700 dark:text-neutral-300 hover:text-[#00C882] px-3 py-1 text-[11px] font-medium border border-slate-200/60 dark:border-neutral-700 transition"
                        >
                            Busuk sirip
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                handleSendMessage(
                                    'Rekomendasi ikan air tawar yang mudah dipelihara untuk pemula.',
                                )
                            }
                            className="whitespace-nowrap rounded-full bg-slate-100 dark:bg-[#111a30] hover:bg-emerald-50 dark:hover:bg-[#162240] text-slate-700 dark:text-neutral-300 hover:text-[#00C882] px-3 py-1 text-[11px] font-medium border border-slate-200/60 dark:border-neutral-700 transition"
                        >
                            Ikan pemula
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                handleSendMessage(
                                    'Bagaimana syarat dan cara klaim garansi ikan hidup 100% sampai tujuan (D.O.A)?',
                                )
                            }
                            className="whitespace-nowrap rounded-full bg-slate-100 dark:bg-[#111a30] hover:bg-emerald-50 dark:hover:bg-[#162240] text-slate-700 dark:text-neutral-300 hover:text-[#00C882] px-3 py-1 text-[11px] font-medium border border-slate-200/60 dark:border-neutral-700 transition"
                        >
                            Garansi D.O.A
                        </button>
                    </div>

                    {/* Attached Image Preview */}
                    {imagePreview && (
                        <div className="flex shrink-0 items-center justify-between bg-slate-100 dark:bg-[#111a30] px-4 py-2 border-t border-slate-200 dark:border-neutral-800">
                            <div className="flex min-w-0 items-center gap-2">
                                <img
                                    src={imagePreview}
                                    alt="Pratinjau"
                                    className="h-9 w-9 object-cover rounded-md"
                                />
                                <span className="truncate text-xs text-slate-600 dark:text-neutral-300">
                                    {selectedImage?.name}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={removeImage}
                                className="p-1 text-slate-400 hover:text-rose-500"
                                aria-label="Hapus gambar"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* Chat Input Bar */}
                    <div className="shrink-0 bg-white dark:bg-[#070b14] border-t border-slate-200 dark:border-neutral-800 p-3">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-slate-400 hover:text-[#00C882] rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
                                title="Unggah foto ikan"
                            >
                                <ImageIcon className="h-5 w-5" />
                            </button>

                            <input
                                type="text"
                                placeholder="Tanya Kiko..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-[#111a30] px-3 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#00C882] focus:bg-white dark:focus:bg-[#162240] transition"
                            />

                            <button
                                type="submit"
                                disabled={loading || (!inputText.trim() && !selectedImage)}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#00C882] text-slate-950 font-bold hover:bg-emerald-400 transition disabled:cursor-not-allowed disabled:opacity-40 shrink-0"
                                aria-label="Kirim pesan"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                    </div>
                </div>
            )}
        </>
    );
}

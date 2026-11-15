import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Image as ImageIcon,
    Loader2,
    Send,
    X,
} from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '@/lib/i18n';

export default function ChatbotWidget({ isOpen, onOpen, onClose }) {
    const { pick } = useLanguage();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sessionToken, setSessionToken] = useState(null);
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
                        message: pick(
                            'Halo! Aku Kiko 🐟, asisten virtual Dunia Ikan. Ada yang bisa kubantu seputar ikan hias atau produk katalog hari ini?',
                            "Hi! I'm Kiko 🐟, Dunia Ikan's virtual assistant. How can I help you with ornamental fish care or catalog products today?",
                        ),
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
            alert(pick('Ukuran gambar maksimal 3MB', 'Maximum image size is 3MB'));
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
                    message: pick(
                        'Maaf, layanan sedang tidak dapat dihubungi. Coba lagi beberapa saat atau periksa koneksi internet Anda.',
                        'Sorry, the service is temporarily unavailable. Please try again in a moment or check your internet connection.',
                    ),
                    created_at: new Date().toISOString(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 1. FLOATING TRIGGER BUTTON (WHEN CHAT CLOSED) */}
            {!isOpen && (
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
                    <button
                        type="button"
                        onClick={onOpen}
                        className="group flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d2e92]/60 focus-visible:ring-offset-2"
                        title={pick('Buka Chatbot Kiko', 'Open Kiko Assistant')}
                        aria-label={pick('Tanya Kiko', 'Ask Kiko')}
                    >
                        {/* Clean speech-bubble pill pointing to the mascot orb */}
                        <span className="relative hidden sm:inline-flex items-center rounded-full bg-white dark:bg-[#131d33] px-4 py-2 text-[13px] font-bold tracking-tight text-[#001454] dark:text-white border border-slate-200/90 dark:border-slate-700/80 shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-transform duration-200 group-hover:-translate-x-0.5">
                            <span>{pick('Tanya Kiko', 'Ask Kiko')}</span>
                            <span
                                aria-hidden="true"
                                className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 rounded-[2px] bg-white dark:bg-[#131d33] border-t border-r border-slate-200/90 dark:border-slate-700/80"
                            />
                        </span>

                        {/* Circular framed Kiko avatar FAB */}
                        <span className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#133b9e] to-[#081c59] p-0.5 ring-2 ring-white dark:ring-slate-800 shadow-[0_10px_28px_rgba(0,20,84,0.3)] transition-all duration-200 group-hover:scale-105 group-active:scale-95">
                            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#1642ad] to-[#081c59] p-1">
                                <img
                                    src="/images/kiko/avatar.png"
                                    alt="Kiko"
                                    className="h-full w-full object-contain -translate-y-0.5"
                                />
                            </span>
                            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#070b14]" />
                        </span>
                    </button>
                </div>
            )}

            {/* 2. CHATBOT WINDOW (WHEN OPEN) */}
            {isOpen && (
                <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col h-[100dvh] sm:w-[420px] sm:h-[640px] sm:max-h-[92vh]">
                    {/* Chat Modal Container */}
                    <div className="w-full h-full flex flex-col bg-white dark:bg-[#070b14] sm:rounded-2xl sm:border border-slate-200 dark:border-neutral-800 shadow-2xl overflow-hidden transition-all duration-200">
                        {/* Header */}
                        <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-[#001454] via-[#092265] to-[#0d2e92] dark:from-[#0b1325] dark:via-[#0e172e] dark:to-[#111a30] px-4 py-3 text-white border-b border-cyan-500/20">
                            <div className="flex items-center gap-3">
                                <div className="relative shrink-0">
                                    <img
                                        src="/images/kiko/avatar.png"
                                        alt="Kiko"
                                        className="w-10 h-10 rounded-full border border-white/20 bg-slate-900 object-contain p-0.5 shadow-md"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold leading-tight text-white">
                                        {pick('Kiko ChatBot', 'Kiko Assistant')}
                                    </h3>
                                    <p className="text-[11px] text-cyan-200/80">
                                        {pick('Asisten Dunia Ikan', 'Dunia Ikan Fish Care AI')}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
                                aria-label={pick('Tutup asisten', 'Close assistant')}
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
                                            src="/images/kiko/avatar.png"
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
                                            <p className="text-[10px] font-bold text-sky-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
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
                                                        <BookOpen className="h-3.5 w-3.5 text-sky-500" />
                                                        {pick('Rujukan panduan resmi', 'Official care guide reference')}
                                                    </p>
                                                    {msg.fish_guides.map((guide) => (
                                                        <Link
                                                            key={guide.id}
                                                            href={`/guides/${guide.id}`}
                                                            className="block border-l-2 border-sky-500 bg-slate-100 dark:bg-[#162240] px-3 py-2 text-[11px] font-medium text-slate-800 dark:text-neutral-200 hover:text-sky-600 dark:hover:text-cyan-400 transition rounded-r-md"
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
                                                        {pick('Rekomendasi di katalog', 'Catalog recommendations')}
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
                                                                    <p className="text-[11px] font-extrabold text-sky-600 dark:text-cyan-400 tabular-nums">
                                                                        Rp{' '}
                                                                        {new Intl.NumberFormat(
                                                                            'id-ID',
                                                                        ).format(
                                                                            prod.price,
                                                                        )}
                                                                    </p>
                                                                    <p className="truncate text-[10px] text-slate-500 dark:text-neutral-400">
                                                                        {prod.store_name} · {pick('Stok', 'Stock')} {prod.stock}
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
                                    src="/images/kiko/avatar.png"
                                    alt="Kiko"
                                    className="w-5 h-5 rounded-full object-contain shrink-0 animate-spin"
                                />
                                <span>{pick('Kiko sedang memeriksa gejala dan katalog...', 'Kiko is checking symptoms and catalog...')}</span>
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
                                    pick(
                                        'Ikan cupang saya ada bintik putih di sirip, bagaimana penanganannya?',
                                        'My betta has white spots on its fins, how should I treat it?',
                                    ),
                                )
                            }
                            className="whitespace-nowrap rounded-full bg-slate-100 dark:bg-[#111a30] hover:bg-sky-50 dark:hover:bg-[#162240] text-slate-700 dark:text-neutral-300 hover:text-sky-600 dark:hover:text-cyan-400 px-3 py-1 text-[11px] font-medium border border-slate-200/60 dark:border-neutral-700 transition"
                        >
                            {pick('Bintik putih', 'White spot / Ich')}
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                handleSendMessage(
                                    pick(
                                        'Ekor ikan saya robek dan membusuk, apa yang harus dilakukan?',
                                        'My fish has torn and rotting fins, what should I do?',
                                    ),
                                )
                            }
                            className="whitespace-nowrap rounded-full bg-slate-100 dark:bg-[#111a30] hover:bg-sky-50 dark:hover:bg-[#162240] text-slate-700 dark:text-neutral-300 hover:text-sky-600 dark:hover:text-cyan-400 px-3 py-1 text-[11px] font-medium border border-slate-200/60 dark:border-neutral-700 transition"
                        >
                            {pick('Busuk sirip', 'Fin rot')}
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                handleSendMessage(
                                    pick(
                                        'Rekomendasi ikan air tawar yang mudah dipelihara untuk pemula.',
                                        'Recommend easy freshwater fish for beginners.',
                                    ),
                                )
                            }
                            className="whitespace-nowrap rounded-full bg-slate-100 dark:bg-[#111a30] hover:bg-sky-50 dark:hover:bg-[#162240] text-slate-700 dark:text-neutral-300 hover:text-sky-600 dark:hover:text-cyan-400 px-3 py-1 text-[11px] font-medium border border-slate-200/60 dark:border-neutral-700 transition"
                        >
                            {pick('Ikan pemula', 'Beginner fish')}
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                handleSendMessage(
                                    pick(
                                        'Bagaimana syarat dan cara klaim garansi ikan hidup 100% sampai tujuan?',
                                        'How do I qualify and claim the 100% live arrival guarantee?',
                                    ),
                                )
                            }
                            className="whitespace-nowrap rounded-full bg-slate-100 dark:bg-[#111a30] hover:bg-sky-50 dark:hover:bg-[#162240] text-slate-700 dark:text-neutral-300 hover:text-sky-600 dark:hover:text-cyan-400 px-3 py-1 text-[11px] font-medium border border-slate-200/60 dark:border-neutral-700 transition"
                        >
                            {pick('Garansi Ikan Hidup', 'Live Arrival DOA')}
                        </button>
                    </div>

                    {/* Attached Image Preview */}
                    {imagePreview && (
                        <div className="flex shrink-0 items-center justify-between bg-slate-100 dark:bg-[#111a30] px-4 py-2 border-t border-slate-200 dark:border-neutral-800">
                            <div className="flex min-w-0 items-center gap-2">
                                <img
                                    src={imagePreview}
                                    alt={pick('Pratinjau', 'Preview')}
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
                                aria-label={pick('Hapus gambar', 'Remove image')}
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
                                className="p-2 text-slate-400 hover:text-[#0684E5] rounded-lg hover:bg-slate-100 dark:hover:bg-neutral-800 transition"
                                title={pick('Unggah foto ikan', 'Upload fish photo')}
                            >
                                <ImageIcon className="h-5 w-5" />
                            </button>

                            <input
                                type="text"
                                placeholder={pick('Tanya Kiko...', 'Ask Kiko...')}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-[#111a30] px-3 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#0684E5] focus:bg-white dark:focus:bg-[#162240] transition"
                            />

                            <button
                                type="submit"
                                disabled={loading || (!inputText.trim() && !selectedImage)}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#0684E5] text-white font-bold hover:bg-[#0060aa] transition disabled:cursor-not-allowed disabled:opacity-40 shrink-0"
                                aria-label={pick('Kirim pesan', 'Send message')}
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

import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Camera,
    Fish,
    Package,
    Paperclip,
    PlusCircle,
    RotateCcw,
    Send,
    X,
} from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '@/lib/i18n';

function formatInlineMarkdown(line) {
    const cleaned = line.replace(/`/g, '');
    const parts = [];
    const pattern = /\*\*(.+?)\*\*|\*([^\s*](?:[^*]*[^\s*])?)\*/g;
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(cleaned)) !== null) {
        if (match.index > lastIndex) {
            parts.push(cleaned.slice(lastIndex, match.index).replaceAll('**', ''));
        }
        if (match[1] !== undefined) {
            parts.push(<strong key={match.index}>{match[1]}</strong>);
        } else if (match[2] !== undefined) {
            parts.push(<em key={match.index}>{match[2]}</em>);
        }
        lastIndex = pattern.lastIndex;
    }

    if (lastIndex < cleaned.length) {
        parts.push(cleaned.slice(lastIndex).replaceAll('**', ''));
    }

    return parts.length > 0 ? parts : '';
}

function renderAssistantMessage(text) {
    const lines = String(text ?? '').split(/\r?\n/);

    return (
        <div className="space-y-1.5">
            {lines.map((rawLine, idx) => {
                if (/^\s*[-*_]{3,}\s*$/.test(rawLine)) {
                    return (
                        <div
                            key={idx}
                            className="my-1 border-t border-slate-200/80 dark:border-neutral-700/60"
                        />
                    );
                }

                if (!rawLine.trim()) {
                    return <div key={idx} className="h-1" />;
                }

                const isHeading = /^\s*#{1,6}\s+/.test(rawLine);
                const normalized = rawLine
                    .replace(/^\s*#{1,6}\s+/, '')
                    .replace(/^\s*[\*\-]\s+/, '• ');

                return (
                    <div
                        key={idx}
                        className={
                            isHeading
                                ? 'font-bold text-[#001454] dark:text-cyan-300 pt-0.5'
                                : undefined
                        }
                    >
                        {formatInlineMarkdown(normalized)}
                    </div>
                );
            })}
        </div>
    );
}

export default function ChatbotWidget({ isOpen, onOpen, onClose }) {
    const { pick } = useLanguage();
    const { auth } = usePage().props;
    const rawUserName = auth?.user?.name?.trim() || '';
    const greetingName =
        rawUserName.length > 0
            ? rawUserName.length <= 16
                ? rawUserName
                : rawUserName.split(/\s+/)[0]
            : '';
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [historyError, setHistoryError] = useState(false);
    const [sessionToken, setSessionToken] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    useEffect(() => {
        if (isOpen && !historyLoaded) {
            fetchHistory();
        }
    }, [isOpen, historyLoaded]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (messages.length > 0 || loading) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const fetchHistory = async () => {
        setHistoryLoading(true);
        setHistoryError(false);

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

            setMessages(Array.isArray(res.data.messages) ? res.data.messages : []);
            setHistoryLoaded(true);
        } catch (err) {
            console.error('Failed to load chat history:', err);
            setHistoryError(true);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleNewSession = async () => {
        if (loading) {
            return;
        }

        try {
            const res = await axios.post('/chatbot/new');
            if (res.data.session_token) {
                setSessionToken(res.data.session_token);
                localStorage.setItem(
                    'dunia_ikan_chat_token',
                    res.data.session_token,
                );
            }
            setMessages([]);
            setHistoryLoaded(true);
            setHistoryError(false);
        } catch (err) {
            console.error('Failed to start a new chat session:', err);
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
        if (cameraInputRef.current) {
            cameraInputRef.current.value = '';
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

            {/* 2. CHATBOT WINDOW (WHEN OPEN) */}
            {isOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={pick('Asisten Kiko Dunia Ikan', 'Dunia Ikan Kiko Assistant')}
                    className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col h-[100dvh] sm:w-[420px] sm:h-[640px] sm:max-h-[92vh]"
                >
                    {/* Chat Modal Container */}
                    <div className="swap-in relative w-full h-full flex flex-col bg-white dark:bg-[#070b14] sm:rounded-[28px] sm:border border-slate-200/90 dark:border-neutral-800 shadow-2xl overflow-hidden transition-all duration-200">
                        {/* Soft Cyan/Sky Atmospheric Top Gradient + Sunny Glow Backdrop */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 h-[66%] dark:hidden"
                            style={{
                                background:
                                    'radial-gradient(circle at 12% 10%, rgba(125, 227, 250, 0.62) 0%, rgba(125, 227, 250, 0) 56%), radial-gradient(circle at 92% 8%, rgba(147, 197, 253, 0.58) 0%, rgba(147, 197, 253, 0) 54%), linear-gradient(180deg, rgba(240, 249, 255, 0.45) 0%, rgba(255, 255, 255, 0) 100%)',
                            }}
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 h-[66%] hidden dark:block"
                            style={{
                                background:
                                    'radial-gradient(circle at 12% 10%, rgba(14, 165, 233, 0.22) 0%, rgba(14, 165, 233, 0) 56%), radial-gradient(circle at 92% 8%, rgba(37, 99, 235, 0.24) 0%, rgba(37, 99, 235, 0) 54%)',
                            }}
                        />

                        {/* Floating White Capsule Header Pill */}
                        <div className="relative z-10 mx-4 mt-3.5 shrink-0 flex items-center justify-between rounded-full bg-white/95 dark:bg-[#111a30]/95 px-3.5 py-2 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_6px_22px_rgba(15,23,42,0.08)]">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950/60 text-[#0684E5] dark:text-cyan-400">
                                    <svg
                                        viewBox="0 0 28 28"
                                        fill="none"
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            cx="12.5"
                                            cy="10"
                                            r="3.2"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />
                                        <circle
                                            cx="11.5"
                                            cy="19"
                                            r="4.2"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />
                                        <circle
                                            cx="19"
                                            cy="15.5"
                                            r="2.4"
                                            stroke="currentColor"
                                            strokeWidth="1.7"
                                        />
                                    </svg>
                                </span>
                                <div className="min-w-0">
                                    <h3 className="text-[13px] font-extrabold leading-tight text-[#001454] dark:text-white truncate">
                                        Kiko
                                    </h3>
                                    <p className="text-[10.5px] font-medium leading-tight text-slate-600 dark:text-slate-300 truncate">
                                        {pick('Asisten Dunia Ikan', 'Dunia Ikan Fish Care AI')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                {messages.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleNewSession}
                                        disabled={loading}
                                        className="flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold text-[#0369A1] dark:text-cyan-300 hover:bg-sky-50 dark:hover:bg-slate-800 transition disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0684E5]"
                                        title={pick('Mulai obrolan baru', 'Start new chat')}
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        <span>{pick('Baru', 'New')}</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0684E5]"
                                    aria-label={pick('Tutup asisten', 'Close assistant')}
                                >
                                    <X className="h-4 w-4 stroke-[2.2]" />
                                </button>
                            </div>
                        </div>

                        {/* Body: Welcome Hero State OR Conversation Messages */}
                        {messages.length === 0 && !loading ? (
                            <div className="relative z-10 flex-1 overflow-y-auto px-6 py-4 flex flex-col items-center justify-center text-center">
                                {historyLoading ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <img
                                            src="/images/kiko/floating.webp"
                                            alt="Kiko"
                                            width={80}
                                            height={96}
                                            decoding="async"
                                            className="h-24 w-auto object-contain opacity-95"
                                        />
                                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                            {pick('Menyiapkan asisten Kiko...', 'Preparing Kiko assistant...')}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Floating 3 Aquatic Idea Tiles + Animated Kiko Fish Head */}
                                        <div className="relative flex flex-col items-center mb-3.5">
                                            <div
                                                aria-hidden="true"
                                                className="pointer-events-none absolute -inset-x-10 -top-4 -bottom-2 rounded-full blur-2xl bg-[radial-gradient(circle,rgba(253,224,71,0.34)_0%,rgba(251,191,36,0.14)_52%,transparent_76%)] dark:bg-[radial-gradient(circle,rgba(251,191,36,0.16)_0%,rgba(6,132,229,0.22)_58%,transparent_78%)]"
                                            />
                                            <div
                                                aria-hidden="true"
                                                className="pointer-events-none absolute -inset-x-10 -top-5 -bottom-2 opacity-35 dark:opacity-20"
                                                style={{
                                                    backgroundImage:
                                                        'radial-gradient(#94a3b8 1px, transparent 1px)',
                                                    backgroundSize: '9px 9px',
                                                    WebkitMaskImage:
                                                        'radial-gradient(circle, black 25%, transparent 72%)',
                                                    maskImage:
                                                        'radial-gradient(circle, black 25%, transparent 72%)',
                                                }}
                                            />

                                            {/* 3 Floating Idea Tiles Arc Above Kiko */}
                                            <div className="relative z-10 flex items-end justify-center gap-2.5">
                                                <div
                                                    className="kiko-float"
                                                    style={{ animationDuration: '3.2s', animationDelay: '0s' }}
                                                >
                                                    <div className="flex h-12 w-12 -rotate-12 translate-y-2 items-center justify-center rounded-2xl bg-white dark:bg-[#131d33] border border-slate-100 dark:border-slate-700/80 shadow-[0_8px_18px_rgba(15,23,42,0.08)] p-1.5">
                                                        <img
                                                            src="/images/kiko/tile-fish.png"
                                                            alt=""
                                                            aria-hidden="true"
                                                            width={32}
                                                            height={32}
                                                            className="h-8 w-8 object-contain select-none pointer-events-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div
                                                    className="kiko-float"
                                                    style={{ animationDuration: '3.8s', animationDelay: '-1.2s' }}
                                                >
                                                    <div className="flex h-14 w-14 -translate-y-1.5 items-center justify-center rounded-2xl bg-white dark:bg-[#131d33] border border-slate-100 dark:border-slate-700/80 shadow-[0_10px_22px_rgba(15,23,42,0.10)] p-1.5">
                                                        <img
                                                            src="/images/kiko/tile-book.png"
                                                            alt=""
                                                            aria-hidden="true"
                                                            width={40}
                                                            height={40}
                                                            className="h-10 w-10 object-contain select-none pointer-events-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div
                                                    className="kiko-float"
                                                    style={{ animationDuration: '3.5s', animationDelay: '-2.1s' }}
                                                >
                                                    <div className="flex h-12 w-12 rotate-12 translate-y-2 items-center justify-center rounded-2xl bg-white dark:bg-[#131d33] border border-slate-100 dark:border-slate-700/80 shadow-[0_8px_18px_rgba(15,23,42,0.08)] p-1.5">
                                                        <img
                                                            src="/images/kiko/tile-health.png"
                                                            alt=""
                                                            aria-hidden="true"
                                                            width={32}
                                                            height={32}
                                                            className="h-8 w-8 object-contain select-none pointer-events-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Gently Floating Full-Body Kiko Mascot */}
                                            <img
                                                src="/images/kiko/floating.webp"
                                                alt="Kiko"
                                                width={120}
                                                height={144}
                                                decoding="async"
                                                className="kiko-bob relative z-20 -mt-2 h-32 w-auto sm:h-36 object-contain drop-shadow-[0_14px_24px_rgba(15,23,42,0.16)] select-none"
                                            />
                                        </div>

                                        {/* Personalized Greeting (Logged-in shows name; Guest omits bracket cleanly) */}
                                        <h3 className="text-[19px] sm:text-[21px] font-extrabold tracking-tight leading-[1.3] text-[#001454] dark:text-white">
                                            {greetingName
                                                ? pick(
                                                      <>
                                                          Ada yang perlu Kiko bantu, {greetingName}?
                                                      </>,
                                                      <>
                                                          How can Kiko help you, {greetingName}?
                                                      </>,
                                                  )
                                                : pick(
                                                      'Ada yang perlu Kiko bantu?',
                                                      'How can Kiko help you?',
                                                  )}
                                        </h3>

                                        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 max-w-[34ch]">
                                            {pick(
                                                'Halo! Saya Kiko, maskot dan asisten pintar Dunia Ikan. Senang sekali bisa membantu kamu hari ini!',
                                                "Hi! I'm Kiko, Dunia Ikan's mascot and smart assistant. Happy to help you today!",
                                            )}
                                        </p>

                                        {historyError && (
                                            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/70 px-3 py-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                <span>
                                                    {pick(
                                                        'Gagal memuat riwayat',
                                                        'Failed to load history',
                                                    )}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={fetchHistory}
                                                    className="underline font-bold hover:text-rose-900 dark:hover:text-white"
                                                >
                                                    {pick('Coba lagi', 'Retry')}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="relative z-10 flex-1 space-y-4 overflow-y-auto px-4 py-4">
                                {messages.map((msg, index) => {
                                    const isUser = msg.sender === 'user';

                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-start gap-2 ${
                                                isUser
                                                    ? 'flex-row-reverse'
                                                    : 'flex-row'
                                            }`}
                                        >
                                            {!isUser && (
                                                <img
                                                    src="/images/kiko/avatar.webp"
                                                    alt="Kiko"
                                                    width={28}
                                                    height={28}
                                                    decoding="async"
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
                                                    <p className="text-[10px] font-bold text-[#0369A1] dark:text-cyan-400 uppercase tracking-wider mb-1">
                                                        Kiko
                                                    </p>
                                                )}

                                                {msg.image_path && (
                                                    <div className="mb-2 overflow-hidden rounded-lg">
                                                        <img
                                                            src={
                                                                msg.image_path.startsWith(
                                                                    'blob:',
                                                                )
                                                                    ? msg.image_path
                                                                    : `/storage/${msg.image_path}`
                                                            }
                                                            alt={pick(
                                                                'Unggahan pengguna',
                                                                'User upload',
                                                            )}
                                                            className="max-h-48 w-full object-cover"
                                                        />
                                                    </div>
                                                )}

                                                {isUser ? (
                                                    <div className="whitespace-pre-wrap">
                                                        {msg.message}
                                                    </div>
                                                ) : (
                                                    renderAssistantMessage(
                                                        msg.message,
                                                    )
                                                )}

                                                {msg.fish_guides &&
                                                    msg.fish_guides.length >
                                                        0 && (
                                                        <div className="mt-3 space-y-2 border-t border-slate-200 dark:border-neutral-700/60 pt-2.5">
                                                            <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#001454] dark:text-cyan-300">
                                                                <BookOpen className="h-3.5 w-3.5 text-[#0369A1] dark:text-sky-400" />
                                                                {pick(
                                                                    'Rujukan panduan resmi',
                                                                    'Official care guide reference',
                                                                )}
                                                            </p>
                                                            {msg.fish_guides.map(
                                                                (guide) => (
                                                                    <Link
                                                                        key={
                                                                            guide.id
                                                                        }
                                                                        href={`/guides/${guide.id}`}
                                                                        className="block border-l-2 border-sky-500 bg-slate-100 dark:bg-[#162240] px-3 py-2 text-[11px] font-medium text-slate-800 dark:text-neutral-200 hover:text-[#0369A1] dark:hover:text-cyan-400 transition rounded-r-md"
                                                                    >
                                                                        {
                                                                            guide.title
                                                                        }
                                                                    </Link>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}

                                                {msg.recommended_products &&
                                                    msg.recommended_products
                                                        .length > 0 && (
                                                        <div className="mt-3 space-y-2 border-t border-slate-200 dark:border-neutral-700/60 pt-2.5">
                                                            <p className="text-[11px] font-bold text-[#001454] dark:text-cyan-300">
                                                                {pick(
                                                                    'Rekomendasi di katalog',
                                                                    'Catalog recommendations',
                                                                )}
                                                            </p>
                                                            {msg.recommended_products.map(
                                                                (prod) => (
                                                                    <Link
                                                                        key={
                                                                            prod.id
                                                                        }
                                                                        href={`/products/${prod.slug}`}
                                                                        className="flex items-center gap-2.5 rounded-lg bg-slate-100 dark:bg-[#162240] p-2 hover:bg-slate-200 dark:hover:bg-[#1c2c52] transition"
                                                                    >
                                                                        <img
                                                                            src={
                                                                                prod.image
                                                                            }
                                                                            alt={
                                                                                prod.name
                                                                            }
                                                                            className="h-10 w-10 shrink-0 rounded-md object-cover"
                                                                        />
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="truncate text-[11px] font-bold text-slate-800 dark:text-white">
                                                                                {
                                                                                    prod.name
                                                                                }
                                                                            </p>
                                                                            <p className="text-[11px] font-extrabold text-[#0369A1] dark:text-cyan-400 tabular-nums">
                                                                                Rp{' '}
                                                                                {new Intl.NumberFormat(
                                                                                    'id-ID',
                                                                                ).format(
                                                                                    prod.price,
                                                                                )}
                                                                            </p>
                                                                            <p className="truncate text-[10px] text-slate-600 dark:text-neutral-300">
                                                                                {
                                                                                    prod.store_name
                                                                                }{' '}
                                                                                ·{' '}
                                                                                {pick(
                                                                                    'Stok',
                                                                                    'Stock',
                                                                                )}{' '}
                                                                                {
                                                                                    prod.stock
                                                                                }
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
                                    <div className="flex items-center gap-2.5 rounded-2xl bg-white dark:bg-[#111a30] border border-slate-200 dark:border-neutral-700/80 px-4 py-3 text-xs text-slate-700 dark:text-neutral-200 w-fit">
                                        <img
                                            src="/images/kiko/avatar.webp"
                                            alt="Kiko"
                                            width={20}
                                            height={20}
                                            decoding="async"
                                            className="w-5 h-5 rounded-full object-contain shrink-0 animate-spin"
                                        />
                                        <span>
                                            {pick(
                                                'Kiko sedang memeriksa gejala dan katalog...',
                                                'Kiko is checking symptoms and catalog...',
                                            )}
                                        </span>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        )}

                        {/* 3 Quick-Action Pill Chips (Pakan, Jenis ikan, Kesehatan ikan) */}
                        <div className="relative z-10 flex shrink-0 items-center justify-center gap-2 overflow-x-auto px-4 pb-2.5 pt-1 text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <button
                                type="button"
                                onClick={() =>
                                    handleSendMessage(
                                        pick(
                                            'Rekomendasi pakan ikan hias terbaik yang tersedia di katalog Dunia Ikan.',
                                            'Recommend the best ornamental fish food available in Dunia Ikan.',
                                        ),
                                    )
                                }
                                className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white dark:bg-[#111a30] border border-slate-200 dark:border-neutral-700/80 px-3 py-1.5 text-[11.5px] font-bold text-slate-900 dark:text-neutral-100 shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:border-[#0684E5] hover:bg-sky-50/70 dark:hover:bg-[#162240] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0684E5]"
                            >
                                <Package className="h-3.5 w-3.5 text-slate-800 dark:text-slate-200" />
                                {pick('Pakan', 'Fish food')}
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    handleSendMessage(
                                        pick(
                                            'Rekomendasi jenis ikan hias air tawar yang populer dan mudah dipelihara.',
                                            'Recommend popular freshwater ornamental fish species easy to keep.',
                                        ),
                                    )
                                }
                                className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white dark:bg-[#111a30] border border-slate-200 dark:border-neutral-700/80 px-3 py-1.5 text-[11.5px] font-bold text-slate-900 dark:text-neutral-100 shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:border-[#0684E5] hover:bg-sky-50/70 dark:hover:bg-[#162240] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0684E5]"
                            >
                                <Fish className="h-3.5 w-3.5 text-slate-800 dark:text-slate-200" />
                                {pick('Jenis ikan', 'Fish species')}
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    handleSendMessage(
                                        pick(
                                            'Bagaimana mengenali gejala penyakit ikan seperti bintik putih atau busuk sirip dan cara merawatnya?',
                                            'How do I recognize fish disease symptoms like white spot or fin rot and treat them?',
                                        ),
                                    )
                                }
                                className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white dark:bg-[#111a30] border border-slate-200 dark:border-neutral-700/80 px-3 py-1.5 text-[11.5px] font-bold text-slate-900 dark:text-neutral-100 shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:border-[#0684E5] hover:bg-sky-50/70 dark:hover:bg-[#162240] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0684E5]"
                            >
                                <PlusCircle className="h-3.5 w-3.5 text-slate-800 dark:text-slate-200" />
                                {pick('Kesehatan ikan', 'Fish health')}
                            </button>
                        </div>

                        {/* Floating Rounded Composer Card */}
                        <div className="relative z-10 shrink-0 px-4 pb-4 pt-1">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="rounded-[20px] border border-slate-300/90 dark:border-slate-700 focus-within:border-[#0684E5] bg-white dark:bg-[#111a30] shadow-[0_6px_22px_rgba(15,23,42,0.08)] px-3.5 pt-3 pb-2.5 transition"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageSelect}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <input
                                    type="file"
                                    ref={cameraInputRef}
                                    onChange={handleImageSelect}
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                />

                                {imagePreview && (
                                    <div className="mb-2.5 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-[#162240] px-2.5 py-1.5 border border-slate-200/80 dark:border-slate-700/80">
                                        <div className="flex min-w-0 items-center gap-2">
                                            <img
                                                src={imagePreview}
                                                alt={pick('Pratinjau', 'Preview')}
                                                className="h-9 w-9 object-cover rounded-lg"
                                            />
                                            <span className="truncate text-xs text-slate-700 dark:text-neutral-200">
                                                {selectedImage?.name}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                                            aria-label={pick('Hapus gambar', 'Remove image')}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                <textarea
                                    rows={2}
                                    placeholder={pick(
                                        'Tanya Kiko...',
                                        'Ask Kiko...',
                                    )}
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    className="w-full resize-none border-0 bg-transparent p-0 text-[13px] leading-snug text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-0"
                                />

                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100/90 dark:bg-slate-800 text-[#0369A1] dark:text-cyan-400 hover:bg-sky-200/80 dark:hover:bg-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0684E5]"
                                            title={pick('Unggah foto ikan', 'Upload fish photo')}
                                            aria-label={pick('Unggah foto ikan', 'Upload fish photo')}
                                        >
                                            <Paperclip className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => cameraInputRef.current?.click()}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100/90 dark:bg-slate-800 text-[#0369A1] dark:text-cyan-400 hover:bg-sky-200/80 dark:hover:bg-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0684E5]"
                                            title={pick('Ambil foto ikan', 'Take fish photo')}
                                            aria-label={pick('Ambil foto ikan', 'Take fish photo')}
                                        >
                                            <Camera className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || (!inputText.trim() && !selectedImage)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1220] dark:bg-[#0684E5] text-white hover:bg-[#001454] dark:hover:bg-[#0573c9] transition disabled:cursor-not-allowed disabled:opacity-35 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0684E5] focus-visible:ring-offset-2"
                                        aria-label={pick('Kirim pesan', 'Send message')}
                                    >
                                        <Send className="h-4 w-4 -translate-x-[0.5px] translate-y-[0.5px]" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

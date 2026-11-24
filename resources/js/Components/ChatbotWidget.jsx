import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    Camera,
    Clock,
    FirstAid,
    Fish,
    MessageSquare,
    Package,
    Paperclip,
    Plus,
    RotateCcw,
    Send,
    Trash2,
    X,
} from '@/Components/Icons';
import axios from 'axios';
import KikoAquariumCanvas from '@/Components/KikoAquariumCanvas';
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
                                ? 'font-bold text-[#14335D] dark:text-cyan-300 pt-0.5'
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

export default function ChatbotWidget({ isOpen, onOpen, onClose, hideTrigger = false }) {
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
    const [historyOpen, setHistoryOpen] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [sessionsCount, setSessionsCount] = useState(0);
    const [deletingToken, setDeletingToken] = useState(null);
    const [sessionToken, setSessionToken] = useState(null);
    const [sendBurstKey, setSendBurstKey] = useState(0);
    const [tapEvent, setTapEvent] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);
    const tankRef = useRef(null);
    const pointerRef = useRef({ active: false, nx: 0.5, ny: 0.5 });

    const handleTankPointerMove = (event) => {
        const rect = tankRef.current?.getBoundingClientRect();
        if (!rect || !rect.width || !rect.height) {
            return;
        }
        pointerRef.current = {
            active: true,
            nx: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
            ny: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
        };
    };

    const handleTankPointerLeave = () => {
        pointerRef.current.active = false;
    };

    const handleTankPointerDown = (event) => {
        if (event.target?.closest?.('button, a, input, textarea, form')) {
            return;
        }
        const rect = tankRef.current?.getBoundingClientRect();
        if (!rect || !rect.width || !rect.height) {
            return;
        }
        setTapEvent({
            id: Date.now(),
            nx: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
            ny: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
        });
    };

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
                if (historyOpen) {
                    setHistoryOpen(false);
                } else {
                    onClose();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, historyOpen, onClose]);

    useEffect(() => {
        if (messages.length > 0 || loading) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const fetchSessions = async () => {
        setSessionsLoading(true);
        try {
            const res = await axios.get('/chatbot/sessions');
            const list = Array.isArray(res.data?.sessions) ? res.data.sessions : [];
            setSessions(list);
            setSessionsCount(list.length);
        } catch (err) {
            console.error('Failed to load chat sessions:', err);
        } finally {
            setSessionsLoading(false);
        }
    };

    const fetchHistory = async (targetToken = null) => {
        setHistoryLoading(true);
        setHistoryError(false);

        try {
            const token = targetToken ?? localStorage.getItem('dunia_ikan_chat_token');
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

            if (typeof res.data.sessions_count === 'number') {
                setSessionsCount(res.data.sessions_count);
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

    const handleToggleHistory = () => {
        const next = !historyOpen;
        setHistoryOpen(next);
        if (next) {
            fetchSessions();
        }
    };

    const handleSelectSession = async (targetToken) => {
        if (!targetToken || loading) {
            return;
        }
        setHistoryOpen(false);
        await fetchHistory(targetToken);
    };

    const handleDeleteSession = async (event, targetToken) => {
        event.stopPropagation();
        if (!targetToken || deletingToken) {
            return;
        }
        setDeletingToken(targetToken);
        try {
            const res = await axios.delete(`/chatbot/sessions/${encodeURIComponent(targetToken)}`);
            setSessions((prev) => prev.filter((item) => item.session_token !== targetToken));
            if (typeof res.data?.sessions_count === 'number') {
                setSessionsCount(res.data.sessions_count);
            } else {
                setSessionsCount((prev) => Math.max(0, prev - 1));
            }
            if (sessionToken === targetToken) {
                const nextToken = res.data?.next_session_token || null;
                setSessionToken(nextToken);
                if (nextToken) {
                    localStorage.setItem('dunia_ikan_chat_token', nextToken);
                } else {
                    localStorage.removeItem('dunia_ikan_chat_token');
                }
                setMessages([]);
            }
        } catch (err) {
            console.error('Failed to delete chat session:', err);
        } finally {
            setDeletingToken(null);
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
            if (typeof res.data.sessions_count === 'number') {
                setSessionsCount(res.data.sessions_count);
            }
            setMessages([]);
            setHistoryOpen(false);
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
        setSendBurstKey((k) => k + 1);
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

            if (typeof response.data.sessions_count === 'number') {
                setSessionsCount(response.data.sessions_count);
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
            {!isOpen && !hideTrigger && (
                <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
                    <button
                        type="button"
                        onClick={onOpen}
                        className="group flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14335D]/60 focus-visible:ring-offset-2"
                        title={pick('Buka Chatbot Kiko', 'Open Kiko Assistant')}
                        aria-label={pick('Tanya Kiko', 'Ask Kiko')}
                    >
                        {/* Clean speech-bubble pill pointing to the mascot orb */}
                        <span className="relative hidden sm:inline-flex items-center rounded-full bg-white dark:bg-[#131d33] px-4 py-2 text-[13px] font-bold tracking-tight text-[#14335D] dark:text-white border border-slate-200/90 dark:border-slate-700/80 shadow-[0_8px_24px_rgba(15,23,42,0.12)] transition-transform duration-200 group-hover:-translate-x-0.5">
                            <span>{pick('Tanya Kiko', 'Ask Kiko')}</span>
                            <span
                                aria-hidden="true"
                                className="absolute -right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 rounded-[2px] bg-white dark:bg-[#131d33] border-t border-r border-slate-200/90 dark:border-slate-700/80"
                            />
                        </span>

                        {/* Circular framed Kiko avatar FAB */}
                        <span className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#A1E1EF] to-[#60C2E6] p-0.5 ring-2 ring-white dark:ring-slate-800 shadow-[0_10px_26px_rgba(30,128,160,0.32)] transition-all duration-200 group-hover:scale-105 group-active:scale-95">
                            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#d8f3fb] via-[#9adcf0] to-[#60C2E6] p-1">
                                <img
                                    src="/images/kiko/avatar.webp"
                                    alt="Kiko"
                                    width={56}
                                    height={48}
                                    decoding="async"
                                    className="h-full w-full object-contain -translate-y-0.5"
                                />
                            </span>
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
                    <div
                        ref={tankRef}
                        onPointerMove={handleTankPointerMove}
                        onPointerLeave={handleTankPointerLeave}
                        onPointerDown={handleTankPointerDown}
                        className="swap-in relative w-full h-full flex flex-col bg-[#eefafd] dark:bg-[#071122] sm:rounded-[28px] sm:border border-sky-200/80 dark:border-sky-900/60 shadow-2xl overflow-hidden transition-all duration-200"
                    >
                        {/* Interactive Pixel-Art Aquarium Backdrop */}
                        <KikoAquariumCanvas
                            pointerRef={pointerRef}
                            isTyping={inputText.trim().length > 0}
                            sendBurstKey={sendBurstKey}
                            tapEvent={tapEvent}
                            dimmed={messages.length > 0 || historyOpen}
                        />

                        {/* Floating White Capsule Header Pill */}
                        <div className="relative z-10 mx-4 mt-3.5 shrink-0 flex items-center justify-between rounded-full bg-white/95 dark:bg-[#111a30]/95 px-3.5 py-2 border border-slate-200/80 dark:border-slate-700/80 shadow-[0_6px_22px_rgba(15,23,42,0.08)]">
                            <div className="flex items-center gap-2.5 min-w-0">
                                {historyOpen ? (
                                    <button
                                        type="button"
                                        onClick={() => setHistoryOpen(false)}
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950/60 text-[#005A9D] dark:text-[#60C2E6] hover:bg-sky-100 dark:hover:bg-sky-900/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D]"
                                        aria-label={pick('Kembali ke obrolan', 'Back to chat')}
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950/60 text-[#005A9D] dark:text-cyan-400">
                                        <MessageSquare className="h-[18px] w-[18px]" />
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <h3 className="text-[13px] font-extrabold leading-tight text-[#14335D] dark:text-white truncate">
                                        {historyOpen
                                            ? pick('Riwayat Chat', 'Chat History')
                                            : 'Kiko'}
                                    </h3>
                                    <p className="text-[10.5px] font-medium leading-tight text-slate-600 dark:text-slate-300 truncate">
                                        {historyOpen
                                            ? auth?.user
                                                ? pick('Tersimpan di akun Anda', 'Saved to your account')
                                                : pick('Tersimpan di sesi ini', 'Saved in this browser')
                                            : pick('Asisten Dunia Ikan', 'Dunia Ikan Fish Care AI')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={handleToggleHistory}
                                    aria-label={pick('Riwayat obrolan', 'Chat history')}
                                    aria-pressed={historyOpen}
                                    title={pick('Riwayat obrolan', 'Chat history')}
                                    className={`relative flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D] ${
                                        historyOpen
                                            ? 'bg-[#e7f6fd] dark:bg-[#132847] text-[#005A9D] dark:text-[#60C2E6]'
                                            : 'text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-[#005A9D] dark:hover:text-[#60C2E6]'
                                    }`}
                                >
                                    <Clock className="h-3.5 w-3.5" />
                                    <span className="hidden xs:inline sm:inline">
                                        {pick('Riwayat', 'History')}
                                    </span>
                                    {sessionsCount > 0 && (
                                        <span className="min-w-[16px] h-4 px-1 rounded-full bg-[#005A9D] dark:bg-[#60C2E6] text-white dark:text-[#14335D] text-[9.5px] font-extrabold inline-flex items-center justify-center tabular-nums">
                                            {sessionsCount > 99 ? '99+' : sessionsCount}
                                        </span>
                                    )}
                                </button>

                                {messages.length > 0 && !historyOpen && (
                                    <button
                                        type="button"
                                        onClick={handleNewSession}
                                        disabled={loading}
                                        className="flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-bold text-[#0369A1] dark:text-cyan-300 hover:bg-sky-50 dark:hover:bg-slate-800 transition disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D]"
                                        title={pick('Mulai obrolan baru', 'Start new chat')}
                                    >
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        <span>{pick('Baru', 'New')}</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D]"
                                    aria-label={pick('Tutup asisten', 'Close assistant')}
                                >
                                    <X className="h-4 w-4 stroke-[2.2]" />
                                </button>
                            </div>
                        </div>

                        {/* Body: Chat History Drawer OR Welcome Hero State OR Conversation Messages */}
                        {historyOpen ? (
                            <div className="relative z-10 mx-4 my-3.5 flex-1 min-h-0 flex flex-col rounded-2xl bg-white/90 dark:bg-[#0b1529]/90 backdrop-blur-md border border-white/90 dark:border-sky-900/60 shadow-[0_12px_32px_rgba(11,55,75,0.14)] overflow-hidden">
                                {/* History Toolbar */}
                                <div className="px-3.5 py-3 border-b border-sky-100 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
                                    <p className="text-xs font-extrabold text-[#14335D] dark:text-white">
                                        {pick('Daftar Percakapan', 'Conversations')}
                                        {sessions.length > 0 && (
                                            <span className="ml-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                                                ({sessions.length})
                                            </span>
                                        )}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleNewSession}
                                        disabled={loading}
                                        className="inline-flex items-center gap-1 rounded-full bg-[#005A9D] hover:bg-[#14335D] dark:bg-[#60C2E6] dark:hover:bg-[#49b3db] text-white dark:text-[#14335D] px-3 py-1.5 text-[11px] font-bold transition shadow-2xs disabled:opacity-45"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        <span>{pick('Obrolan Baru', 'New Chat')}</span>
                                    </button>
                                </div>

                                {/* Saved Sessions List */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                    {sessionsLoading ? (
                                        <div className="h-full flex items-center justify-center py-10 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            {pick('Memuat riwayat obrolan...', 'Loading chat history...')}
                                        </div>
                                    ) : sessions.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center px-4 py-10 space-y-2.5">
                                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f6fd] dark:bg-[#132847] text-[#005A9D] dark:text-[#60C2E6]">
                                                <Clock className="h-5 w-5" />
                                            </span>
                                            <div className="space-y-1">
                                                <p className="text-sm font-extrabold text-[#14335D] dark:text-white">
                                                    {pick('Belum ada riwayat obrolan', 'No chat history yet')}
                                                </p>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-[240px]">
                                                    {pick(
                                                        'Mulai bertanya ke Kiko, nanti setiap percakapan tersimpan otomatis di sini.',
                                                        'Start chatting with Kiko and your conversations will be saved here automatically.',
                                                    )}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setHistoryOpen(false)}
                                                className="mt-1 rounded-full bg-[#005A9D] hover:bg-[#14335D] dark:bg-[#60C2E6] dark:text-[#14335D] text-white px-4 py-2 text-xs font-bold transition"
                                            >
                                                {pick('Mulai Obrolan', 'Start Chat')}
                                            </button>
                                        </div>
                                    ) : (
                                        sessions.map((item) => {
                                            const isCurrent = item.session_token === sessionToken && messages.length > 0;
                                            const isDeleting = deletingToken === item.session_token;

                                            return (
                                                <div
                                                    key={item.session_token}
                                                    className={`group flex items-start gap-2 rounded-xl border p-2.5 transition ${
                                                        isCurrent
                                                            ? 'bg-[#e7f6fd] dark:bg-[#132847] border-[#60C2E6]/65 dark:border-[#60C2E6]/40'
                                                            : 'bg-white/95 dark:bg-[#0f1c35] border-slate-200/80 dark:border-slate-800 hover:border-[#60C2E6]/70 dark:hover:border-sky-700'
                                                    }`}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectSession(item.session_token)}
                                                        className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D] rounded-lg"
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <p className="text-xs font-bold text-[#14335D] dark:text-white truncate">
                                                                {item.title}
                                                            </p>
                                                            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 shrink-0 tabular-nums">
                                                                {item.time_label}
                                                            </span>
                                                        </div>

                                                        {item.preview && (
                                                            <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                                                                {item.preview}
                                                            </p>
                                                        )}

                                                        <div className="mt-1.5 flex items-center gap-2 text-[10px]">
                                                            <span className="font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                                                                {pick(`${item.message_count} pesan`, `${item.message_count} messages`)}
                                                            </span>
                                                            {isCurrent && (
                                                                <span className="rounded-full bg-[#005A9D]/10 dark:bg-[#60C2E6]/20 px-2 py-0.5 font-bold text-[#005A9D] dark:text-[#60C2E6]">
                                                                    {pick('Aktif', 'Active')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDeleteSession(e, item.session_token)}
                                                        disabled={isDeleting}
                                                        aria-label={pick(`Hapus obrolan ${item.title}`, `Delete chat ${item.title}`)}
                                                        title={pick('Hapus obrolan', 'Delete chat')}
                                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {!auth?.user && (
                                    <div className="px-3.5 py-2.5 border-t border-sky-100 dark:border-slate-800 bg-[#f3fbfe] dark:bg-[#081224] flex items-center justify-between gap-2 text-[11px] shrink-0">
                                        <span className="text-slate-600 dark:text-slate-300">
                                            {pick('Masuk agar riwayat tersimpan di akunmu', 'Sign in to sync history to your account')}
                                        </span>
                                        <Link
                                            href="/login"
                                            onClick={onClose}
                                            className="font-bold text-[#005A9D] dark:text-[#60C2E6] hover:underline shrink-0"
                                        >
                                            {pick('Masuk', 'Sign in')}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : messages.length === 0 && !loading ? (
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
                                        {/* Floating 3 Aquatic Idea Tiles + Animated Kiko Mascot */}
                                        <div className="relative flex flex-col items-center mb-3">
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

                                        {/* High-contrast Greeting Card floating cleanly above the aquarium */}
                                        <div className="rounded-2xl bg-white/85 dark:bg-[#09162b]/85 border border-white/90 dark:border-sky-300/20 px-4 py-3 shadow-[0_8px_24px_rgba(11,55,75,0.12)] max-w-[340px]">
                                            <h3 className="text-[18px] sm:text-[20px] font-extrabold tracking-tight leading-[1.28] text-[#14335D] dark:text-white">
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

                                            <p className="mt-1.5 text-xs leading-relaxed text-[#1b3a57] dark:text-slate-200">
                                                {pick(
                                                    'Halo! Saya Kiko, asisten Dunia Ikan untuk rekomendasi ikan hias, parameter air, dan kesehatan akuarium.',
                                                    "Hi! I'm Kiko, Dunia Ikan's assistant for ornamental fish recommendations, water parameters, and tank health.",
                                                )}
                                            </p>
                                            <p className="mt-1.5 text-[11px] font-semibold text-[#005A9D] dark:text-[#60C2E6]">
                                                {pick(
                                                    'Gerakkan kursor atau ketuk air akuarium di belakang.',
                                                    'Move your pointer or tap the water behind.',
                                                )}
                                            </p>
                                        </div>

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
                                                    className="w-7 h-7 rounded-full border border-[#60C2E6]/60 bg-gradient-to-b from-[#d8f3fb] to-[#60C2E6] p-0.5 object-contain shrink-0 shadow-xs mt-1"
                                                />
                                            )}

                                            <div
                                                className={`max-w-[85%] px-4 py-3 text-xs leading-relaxed ${
                                                    isUser
                                                        ? 'bg-[#14335D] dark:bg-[#1E80A0] text-white rounded-2xl rounded-tr-xs shadow-xs'
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
                                                            <p className="flex items-center gap-1.5 text-[11px] font-bold text-[#14335D] dark:text-cyan-300">
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
                                                            <p className="text-[11px] font-bold text-[#14335D] dark:text-cyan-300">
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
                                            className="w-5 h-5 rounded-full bg-gradient-to-b from-[#d8f3fb] to-[#60C2E6] p-0.5 object-contain shrink-0 animate-spin"
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

                        {/* 3 Quick-Action Pill Chips & Composer (hidden while browsing History) */}
                        {!historyOpen && (
                        <>
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
                                className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white dark:bg-[#111a30] border border-slate-200 dark:border-neutral-700/80 px-3 py-1.5 text-[11.5px] font-bold text-slate-900 dark:text-neutral-100 shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:border-[#005A9D] hover:bg-sky-50/70 dark:hover:bg-[#162240] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D]"
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
                                className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white dark:bg-[#111a30] border border-slate-200 dark:border-neutral-700/80 px-3 py-1.5 text-[11.5px] font-bold text-slate-900 dark:text-neutral-100 shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:border-[#005A9D] hover:bg-sky-50/70 dark:hover:bg-[#162240] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D]"
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
                                className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-white dark:bg-[#111a30] border border-slate-200 dark:border-neutral-700/80 px-3 py-1.5 text-[11.5px] font-bold text-slate-900 dark:text-neutral-100 shadow-[0_2px_10px_rgba(15,23,42,0.06)] hover:border-[#005A9D] hover:bg-sky-50/70 dark:hover:bg-[#162240] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D]"
                            >
                                <FirstAid className="h-3.5 w-3.5 text-slate-800 dark:text-slate-200" />
                                {pick('Kesehatan ikan', 'Fish health')}
                            </button>
                        </div>

                        {/* Floating Frosted Glass Composer Card (fish blur softly behind it) */}
                        <div className="relative z-10 shrink-0 px-4 pb-4 pt-1">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="rounded-[20px] border border-white/90 dark:border-sky-300/20 focus-within:border-[#005A9D] dark:focus-within:border-[#60C2E6] bg-white/80 dark:bg-[#0c1830]/85 backdrop-blur-md shadow-[0_10px_28px_rgba(11,55,75,0.16)] px-3.5 pt-3 pb-2.5 transition"
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
                                    className="w-full resize-none border-0 bg-transparent p-0 text-[13px] leading-snug text-[#14335D] dark:text-white placeholder:text-[#335573] dark:placeholder:text-slate-300 focus:outline-none focus:ring-0"
                                />

                                <div className="mt-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100/90 dark:bg-slate-800 text-[#0369A1] dark:text-cyan-400 hover:bg-sky-200/80 dark:hover:bg-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D]"
                                            title={pick('Unggah foto ikan', 'Upload fish photo')}
                                            aria-label={pick('Unggah foto ikan', 'Upload fish photo')}
                                        >
                                            <Paperclip className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => cameraInputRef.current?.click()}
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100/90 dark:bg-slate-800 text-[#0369A1] dark:text-cyan-400 hover:bg-sky-200/80 dark:hover:bg-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D]"
                                            title={pick('Ambil foto ikan', 'Take fish photo')}
                                            aria-label={pick('Ambil foto ikan', 'Take fish photo')}
                                        >
                                            <Camera className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || (!inputText.trim() && !selectedImage)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B1220] dark:bg-[#005A9D] text-white hover:bg-[#14335D] dark:hover:bg-[#00477C] transition disabled:cursor-not-allowed disabled:opacity-35 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D] focus-visible:ring-offset-2"
                                        aria-label={pick('Kirim pesan', 'Send message')}
                                    >
                                        <Send className="h-4 w-4 -translate-x-[0.5px] translate-y-[0.5px]" />
                                    </button>
                                </div>
                            </form>
                        </div>
                        </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

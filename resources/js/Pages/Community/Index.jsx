import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { HeroWaveTransition } from '@/Components/AquaticMotifs';
import UserAvatar from '@/Components/UserAvatar';
import { useLanguage } from '@/lib/i18n';
import {
    ArrowDown,
    ImagePlus,
    LogIn,
    MessagesSquare,
    Reply,
    Send,
    Store,
    Trash2,
    Users,
    X,
} from '@/Components/Icons';

const POLL_INTERVAL_MS = 4000;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

const QUICK_PROMPTS = [
    {
        labelId: 'Rekomendasi ikan pemula',
        labelEn: 'Beginner fish picks',
        textId: 'Halo teman-teman! Ada rekomendasi jenis ikan hias yang cantik dan tahan banting buat pemula?',
        textEn: 'Hi everyone! Any colorful, hardy ornamental fish picks for beginners?',
    },
    {
        labelId: 'Tips perawatan & filter',
        labelEn: 'Care & filter tips',
        textId: 'Ada rekomendasi filter atau rutinitas ganti air untuk akuarium 60cm biar air tetap jernih?',
        textEn: 'Any recommendations for a quiet filter or water change routine for a 60cm tank?',
    },
    {
        labelId: 'Inspirasi aquascape',
        labelEn: 'Aquascape ideas',
        textId: 'Tanaman aquascape apa yang paling mudah dirawat tanpa CO2 tabung?',
        textEn: 'Which aquascape plants thrive best without pressurized CO2?',
    },
    {
        labelId: 'Tanya stok & jual beli',
        labelEn: 'Stock & marketplace',
        textId: 'Ada penangkar atau toko di sini yang sedang ready stok Cupang Halfmoon atau Guppy indukan?',
        textEn: 'Any breeders or stores here with Halfmoon Betta or Guppy pairs ready to ship?',
    },
];

function CommunityEmptyArtwork() {
    return (
        <svg
            viewBox="0 0 240 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="w-44 sm:w-52 h-auto mx-auto"
        >
            <defs>
                <linearGradient id="emptyFishGrad" x1="56" y1="68" x2="132" y2="108" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#005A9D" />
                    <stop offset="100%" stopColor="#14335D" />
                </linearGradient>
                <linearGradient id="emptyBubbleGrad" x1="128" y1="18" x2="188" y2="66" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#60C2E6" />
                    <stop offset="100%" stopColor="#005A9D" />
                </linearGradient>
            </defs>

            <circle cx="120" cy="68" r="54" className="fill-[#e8f5ff] dark:fill-[#10223e]" />
            <path
                d="M44 114C44 98 40 84 32 74C28 69 29 63 34 62C39 61 44 68 46 76C48 64 52 54 58 55C63 56 61 70 57 82C62 76 68 74 71 78C74 82 66 93 60 100C58 106 58 110 58 114H44Z"
                className="fill-[#a9d8f4] dark:fill-[#18355c]"
            />
            <path
                d="M180 114C180 96 184 82 192 70C196 64 202 62 204 66C207 70 201 80 196 90C202 84 209 82 211 86C213 91 204 102 194 114H180Z"
                className="fill-[#93ccef] dark:fill-[#142c4d]"
            />
            <ellipse cx="120" cy="115" rx="68" ry="6" className="fill-[#d2ecfc] dark:fill-[#102440]" />

            <path
                d="M132 20H180C186.627 20 192 25.3726 192 32V52C192 58.6274 186.627 64 180 64H152L140 74V64H132C125.373 64 120 58.6274 120 52V32C120 25.3726 125.373 20 132 20Z"
                fill="url(#emptyBubbleGrad)"
            />
            <circle cx="144" cy="42" r="3.4" fill="#ffffff" />
            <circle cx="156" cy="42" r="3.4" fill="#ffffff" />
            <circle cx="168" cy="42" r="3.4" fill="#ffffff" />

            <path d="M72 86L50 70C47 80 47 92 50 102L72 86Z" fill="#60C2E6" />
            <path d="M90 66C98 54 112 56 116 68L98 72L90 66Z" fill="#60C2E6" />
            <path
                d="M128 86C122 68 100 62 80 70C70 74 64 80 64 86C64 92 70 98 80 102C100 110 122 104 128 86Z"
                fill="url(#emptyFishGrad)"
            />
            <path d="M84 69C80 80 80 92 84 103" stroke="#ffffff" strokeOpacity="0.88" strokeWidth="4.8" strokeLinecap="round" />
            <path d="M104 68C101 80 101 92 104 104" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="116" cy="82" r="4" fill="#ffffff" />
            <circle cx="117" cy="82" r="2.1" fill="#14335D" />
        </svg>
    );
}

function getJakartaDateKey(offsetDays = 0) {
    const date = new Date(Date.now() + offsetDays * 86400000);
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
}

function formatDateHeading(dateKey, pick, isEn) {
    if (!dateKey || dateKey === getJakartaDateKey(0)) {
        return pick('Hari ini', 'Today');
    }
    if (dateKey === getJakartaDateKey(-1)) {
        return pick('Kemarin', 'Yesterday');
    }

    const parsed = new Date(`${dateKey}T12:00:00+07:00`);
    if (Number.isNaN(parsed.getTime())) {
        return dateKey;
    }

    return new Intl.DateTimeFormat(isEn ? 'en-US' : 'id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(parsed);
}

export default function Index({
    initialMessages = [],
    hasMoreOlder: initialHasMore = false,
    communityStats = { totalMessages: 0, participantsCount: 0 },
}) {
    const { auth } = usePage().props;
    const currentUser = auth?.user;
    const { pick, isEn } = useLanguage();

    const [messages, setMessages] = useState(initialMessages);
    const [hasMoreOlder, setHasMoreOlder] = useState(Boolean(initialHasMore));
    const [stats, setStats] = useState(communityStats);
    const [loadingOlder, setLoadingOlder] = useState(false);

    const [draft, setDraft] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [replyTo, setReplyTo] = useState(null);
    const [sending, setSending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const [hasUnseenBelow, setHasUnseenBelow] = useState(false);
    const [lightboxUrl, setLightboxUrl] = useState(null);

    const scrollContainerRef = useRef(null);
    const fileInputRef = useRef(null);
    const inputRef = useRef(null);
    const latestIdRef = useRef(
        initialMessages.length > 0 ? initialMessages[initialMessages.length - 1].id : 0,
    );
    const isNearBottomRef = useRef(true);

    useEffect(() => {
        latestIdRef.current = messages.length > 0 ? messages[messages.length - 1].id : 0;
    }, [messages]);

    const scrollToBottom = useCallback((behavior = 'smooth') => {
        const el = scrollContainerRef.current;
        if (!el) {
            return;
        }
        el.scrollTo({ top: el.scrollHeight, behavior });
        isNearBottomRef.current = true;
        setHasUnseenBelow(false);
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, []);

    const handleScroll = () => {
        const el = scrollContainerRef.current;
        if (!el) {
            return;
        }
        const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
        const nearBottom = distance < 120;
        isNearBottomRef.current = nearBottom;
        if (nearBottom) {
            setHasUnseenBelow(false);
        }
    };

    const mergeIncomingMessages = useCallback(
        (incoming) => {
            if (!Array.isArray(incoming) || incoming.length === 0) {
                return;
            }
            setMessages((prev) => {
                const known = new Set(prev.map((m) => m.id));
                const additions = incoming.filter((m) => !known.has(m.id));
                if (additions.length === 0) {
                    return prev;
                }
                return [...prev, ...additions];
            });

            if (isNearBottomRef.current) {
                window.requestAnimationFrame(() => scrollToBottom('smooth'));
            } else {
                setHasUnseenBelow(true);
            }
        },
        [scrollToBottom],
    );

    const pollNewMessages = useCallback(async () => {
        if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
            return;
        }
        try {
            const { data } = await window.axios.get('/community/messages', {
                params: { after_id: latestIdRef.current },
            });
            if (Array.isArray(data?.messages) && data.messages.length > 0) {
                mergeIncomingMessages(data.messages);
            }
            if (typeof data?.total_messages === 'number') {
                setStats({
                    totalMessages: data.total_messages,
                    participantsCount: data.participants_count ?? 0,
                });
            }
        } catch {
            // Silently ignore transient polling network errors cleanly.
        }
    }, [mergeIncomingMessages]);

    useEffect(() => {
        const intervalId = window.setInterval(pollNewMessages, POLL_INTERVAL_MS);
        const onVisibility = () => {
            if (document.visibilityState === 'visible') {
                pollNewMessages();
            }
        };
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            window.clearInterval(intervalId);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [pollNewMessages]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape' && lightboxUrl) {
                setLightboxUrl(null);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [lightboxUrl]);

    const handleLoadOlder = async () => {
        if (loadingOlder || !hasMoreOlder || messages.length === 0) {
            return;
        }
        setLoadingOlder(true);
        const container = scrollContainerRef.current;
        const previousHeight = container?.scrollHeight ?? 0;

        try {
            const { data } = await window.axios.get('/community/messages', {
                params: { before_id: messages[0].id },
            });
            const older = Array.isArray(data?.messages) ? data.messages : [];
            setHasMoreOlder(Boolean(data?.has_more));

            if (older.length > 0) {
                setMessages((prev) => {
                    const known = new Set(prev.map((m) => m.id));
                    const freshOlder = older.filter((m) => !known.has(m.id));
                    return [...freshOlder, ...prev];
                });
                window.requestAnimationFrame(() => {
                    if (container) {
                        container.scrollTop = container.scrollHeight - previousHeight;
                    }
                });
            }
        } catch {
            setErrorMessage(
                pick('Gagal memuat pesan lama. Coba lagi.', 'Failed to load older messages.'),
            );
        } finally {
            setLoadingOlder(false);
        }
    };

    const clearImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setErrorMessage(pick('Ukuran foto maksimal 3 MB.', 'Photo size must be under 3 MB.'));
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }
        setErrorMessage('');
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event) => {
        event?.preventDefault();
        if (!currentUser || sending) {
            return;
        }

        const trimmed = draft.trim();
        if (trimmed === '' && !imageFile) {
            setErrorMessage(pick('Tulis pesan atau pilih foto dulu.', 'Write a message or attach a photo.'));
            return;
        }

        setSending(true);
        setErrorMessage('');

        try {
            const formData = new FormData();
            if (trimmed !== '') {
                formData.append('message', trimmed);
            }
            if (imageFile) {
                formData.append('image', imageFile);
            }
            if (replyTo?.id) {
                formData.append('reply_to_id', String(replyTo.id));
            }

            const { data } = await window.axios.post('/community/messages', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (data?.message) {
                isNearBottomRef.current = true;
                mergeIncomingMessages([data.message]);
                setStats((prev) => ({
                    ...prev,
                    totalMessages: (prev.totalMessages || 0) + 1,
                }));
            }

            setDraft('');
            setReplyTo(null);
            clearImage();
            window.requestAnimationFrame(() => scrollToBottom('smooth'));
        } catch (err) {
            const apiMsg =
                err?.response?.data?.errors?.message?.[0] ||
                err?.response?.data?.errors?.image?.[0] ||
                err?.response?.data?.message ||
                pick('Pesan gagal dikirim. Coba lagi.', 'Failed to send message. Please try again.');
            setErrorMessage(apiMsg);
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (messageId) => {
        if (deletingId) {
            return;
        }
        setDeletingId(messageId);
        try {
            await window.axios.delete(`/community/messages/${messageId}`);
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
            setStats((prev) => ({
                ...prev,
                totalMessages: Math.max(0, (prev.totalMessages || 1) - 1),
            }));
        } catch {
            setErrorMessage(pick('Gagal menghapus pesan.', 'Failed to delete message.'));
        } finally {
            setDeletingId(null);
        }
    };

    const handleTextareaKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const handlePickPrompt = (promptText) => {
        if (!currentUser) {
            setErrorMessage(
                pick(
                    'Masuk dulu ke akun Dunia Ikan untuk ikut mengirim pesan di obrolan komunitas.',
                    'Sign in to your Dunia Ikan account to post messages in community chat.',
                ),
            );
            return;
        }
        setErrorMessage('');
        setDraft(promptText);
        window.requestAnimationFrame(() => inputRef.current?.focus());
    };

    const openKikoChat = () => {
        window.dispatchEvent(new CustomEvent('dunia-ikan:open-chat'));
    };

    const groupedItems = useMemo(() => {
        const items = [];
        let lastDate = null;
        for (const msg of messages) {
            if (msg.date_key && msg.date_key !== lastDate) {
                lastDate = msg.date_key;
                items.push({ type: 'date', key: `date-${msg.date_key}`, dateKey: msg.date_key });
            }
            items.push({ type: 'msg', key: `msg-${msg.id}`, msg });
        }
        return items;
    }, [messages]);

    return (
        <AppLayout>
            <Head
                title={pick(
                    'Komunitas Dunia Ikan | Obrolan Aquarist',
                    'Dunia Ikan Community | Aquarist Chat',
                )}
            />

            <div className="min-h-screen bg-[#f4f9ff] dark:bg-[#070b14]">
                {/* 1. Full-Bleed Blue-Glass Underwater Hero Banner + Shoreline Curve */}
                <section
                    data-nav-theme="dark"
                    className="-mt-16 pt-20 sm:pt-24 pb-20 sm:pb-24 relative w-full overflow-hidden bg-[#07305e]"
                >
                    <picture className="pointer-events-none select-none">
                        <source media="(max-width: 767px)" srcSet="/images/hero/aquarium-poster-mobile.webp" />
                        <img
                            src="/images/hero/aquarium-poster.webp"
                            width={1280}
                            height={720}
                            fetchpriority="high"
                            decoding="sync"
                            alt={pick('Suasana akuarium komunitas Dunia Ikan', 'Dunia Ikan community aquarium')}
                            className="absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
                        />
                    </picture>
                    {/* Luminous Blue Glass Atmosphere Overlays */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-r from-[#073366]/80 via-[#0d5494]/60 to-[#1486cc]/40 pointer-events-none"
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#062d59]/65 via-[#0e5a9e]/20 to-[#062a54]/45 pointer-events-none"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-20 right-1/4 h-72 w-72 rounded-full bg-[#60C2E6]/30 blur-3xl"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-16 left-1/3 h-64 w-80 rounded-full bg-[#38bdf8]/20 blur-3xl"
                    />

                    <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#166db8]/45 via-[#0c4a85]/45 to-[#072e5c]/55 backdrop-blur-xl border border-[#A1E1EF]/40 px-5 sm:px-7 py-5 sm:py-6 shadow-[0_24px_60px_-14px_rgba(3,48,108,0.45),inset_0_1px_0_rgba(255,255,255,0.32)] space-y-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#60C2E6]/25 backdrop-blur-md border border-[#BAE6FD]/45 px-3.5 py-1 text-xs font-semibold text-[#E8F7FF]">
                                <MessagesSquare className="w-3.5 h-3.5 text-[#BAE6FD]" />
                                <span>{pick('Obrolan Komunitas', 'Community Chat')}</span>
                            </span>

                            <div className="space-y-1.5">
                                <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold tracking-[-0.025em] leading-[1.12] text-white">
                                    {pick('Komunitas Dunia Ikan', 'Dunia Ikan Community')}
                                </h1>
                                <p className="text-xs sm:text-sm text-[#E8F7FF] leading-relaxed max-w-xl">
                                    {pick(
                                        'Diskusi, berbagi pengalaman, dan dapatkan tips seputar dunia ikan hias bersama sesama pecinta ikan.',
                                        'Discuss, share experiences, and exchange ornamental fish care tips with fellow hobbyists and breeders.',
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#09386b]/55 backdrop-blur-md border border-[#A1E1EF]/35 px-3.5 py-1.5 text-xs font-semibold text-white">
                                    <Users className="w-3.5 h-3.5 text-[#BAE6FD]" />
                                    <span className="tabular-nums">{stats?.participantsCount ?? 0}</span>
                                    <span className="text-[#E8F7FF]/90">{pick('Anggota', 'Members')}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#09386b]/55 backdrop-blur-md border border-[#A1E1EF]/35 px-3.5 py-1.5 text-xs font-semibold text-white">
                                    <MessagesSquare className="w-3.5 h-3.5 text-[#BAE6FD]" />
                                    <span className="tabular-nums">{stats?.totalMessages ?? messages.length}</span>
                                    <span className="text-[#E8F7FF]/90">{pick('Pesan', 'Messages')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shoreline Wave Curve Matching Home Hero */}
                    <HeroWaveTransition
                        variant="canvas"
                        fillClass="fill-[#f4f9ff] dark:fill-[#070b14]"
                    />
                </section>
                <div
                    aria-hidden="true"
                    className="relative z-20 -mt-[2px] h-[3px] w-full bg-[#f4f9ff] dark:bg-[#070b14]"
                />

                {/* 2. Unified Community Chat Workspace Card */}
                <div className="pt-3 sm:pt-5 relative z-20 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 pb-10 sm:pb-14">
                    <section className="relative flex flex-col min-h-0 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0e1424] border border-sky-200/75 dark:border-slate-800 shadow-[0_24px_60px_-20px_rgba(0,40,104,0.2)] dark:shadow-[0_24px_60px_-20px_rgba(2,6,23,0.8)] overflow-hidden">
                        {/* Unified Room Header */}
                        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="w-10 h-10 rounded-full bg-gradient-to-b from-[#e6f5fd] to-[#cbeafa] dark:from-[#122645] dark:to-[#0f203b] border border-[#60C2E6]/40 dark:border-sky-800/60 text-[#005A9D] dark:text-[#60C2E6] flex items-center justify-center shrink-0">
                                    <MessagesSquare className="w-5 h-5" />
                                </span>
                                <div className="min-w-0">
                                    <h2 className="text-sm sm:text-base font-extrabold text-[#14335D] dark:text-white leading-tight truncate">
                                        {pick('Ruang Obrolan Komunitas', 'Community Chat Room')}
                                    </h2>
                                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                        {pick(
                                            'Semua diskusi ikan hias, tips perawatan, aquascape, dan jual beli dalam satu ruang',
                                            'All ornamental fish talk, care tips, aquascape, and marketplace chats in one place',
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    type="button"
                                    onClick={openKikoChat}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#eef7fd] hover:bg-[#dff1fb] dark:bg-[#122645] dark:hover:bg-[#183157] border border-[#60C2E6]/45 dark:border-[#60C2E6]/35 pl-1.5 pr-3 py-1 text-xs font-bold text-[#14335D] dark:text-[#E8F7FF] transition"
                                >
                                    <span className="w-6 h-6 rounded-full bg-gradient-to-b from-[#d8f3fb] to-[#60C2E6] p-0.5 flex items-center justify-center shrink-0">
                                        <img
                                            src="/images/kiko/avatar.webp"
                                            alt="Kiko"
                                            width={22}
                                            height={22}
                                            className="w-full h-full object-contain"
                                        />
                                    </span>
                                    <span>{pick('Tanya Kiko', 'Ask Kiko')}</span>
                                </button>

                                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f7fc] dark:bg-[#13223b] border border-sky-200/70 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-[#14335D] dark:text-sky-200">
                                    <Users className="w-3.5 h-3.5 text-[#005A9D] dark:text-[#60C2E6]" />
                                    <span className="tabular-nums">{stats?.participantsCount ?? 0}</span>
                                </div>
                            </div>
                        </div>

                        {/* Message Feed */}
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className="relative overflow-y-auto px-4 sm:px-6 bg-[#fafdff] dark:bg-[#0b1220] h-[400px] sm:h-[440px] py-4 space-y-3.5"
                        >
                            {hasMoreOlder && (
                                <div className="flex justify-center pb-1">
                                    <button
                                        type="button"
                                        onClick={handleLoadOlder}
                                        disabled={loadingOlder}
                                        className="px-4 py-1.5 rounded-full bg-[#eef6ff] hover:bg-[#dfeeff] dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-[#005A9D] dark:text-slate-200 transition disabled:opacity-50"
                                    >
                                        {loadingOlder
                                            ? pick('Memuat pesan lama...', 'Loading older messages...')
                                            : pick('Muat pesan sebelumnya', 'Load older messages')}
                                    </button>
                                </div>
                            )}

                            {groupedItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center px-4 py-4 space-y-3">
                                    <CommunityEmptyArtwork />
                                    <div className="space-y-1">
                                        <h3 className="text-base font-extrabold text-[#14335D] dark:text-white tracking-tight">
                                            {pick('Belum ada diskusi nih!', 'No discussions yet!')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                            {pick(
                                                'Mulai percakapan pertama dengan memilih topik di bawah atau tulis pesan langsung.',
                                                'Start the first conversation by picking a topic below or typing directly.',
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-2 pt-1 max-w-xl">
                                        {QUICK_PROMPTS.map((prompt) => (
                                            <button
                                                key={prompt.labelId}
                                                type="button"
                                                onClick={() => handlePickPrompt(pick(prompt.textId, prompt.textEn))}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#13223b] hover:bg-[#eef6ff] dark:hover:bg-[#192d4d] border border-sky-200/80 dark:border-slate-700 hover:border-[#005A9D] px-3.5 py-1.5 text-xs font-semibold text-[#14335D] dark:text-slate-200 transition shadow-2xs"
                                            >
                                                <span>{pick(prompt.labelId, prompt.labelEn)}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                    groupedItems.map((item) => {
                                        if (item.type === 'date') {
                                            return (
                                                <div key={item.key} className="flex items-center justify-center py-1">
                                                    <span className="px-3 py-0.5 rounded-full bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-[10.5px] font-bold text-slate-500 dark:text-slate-300">
                                                        {formatDateHeading(item.dateKey, pick, isEn)}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        const { msg } = item;
                                        const isMine = Boolean(currentUser && msg.user?.id === currentUser.id);
                                        const canDelete = Boolean(
                                            currentUser && (isMine || currentUser.role === 'admin'),
                                        );
                                        const isSeller = msg.user?.role === 'seller' && msg.user?.store_slug;
                                        const isAdmin = msg.user?.role === 'admin';

                                        return (
                                            <div
                                                key={item.key}
                                                className={`group flex items-start gap-2.5 ${
                                                    isMine ? 'flex-row-reverse' : 'flex-row'
                                                }`}
                                            >
                                                <UserAvatar
                                                    user={msg.user}
                                                    className="w-8 h-8 text-xs shrink-0 mt-0.5 ring-1 ring-slate-200/80 dark:ring-slate-700"
                                                />

                                                <div
                                                    className={`flex flex-col max-w-[82%] sm:max-w-[72%] ${
                                                        isMine ? 'items-end' : 'items-start'
                                                    }`}
                                                >
                                                    <div
                                                        className={`flex flex-wrap items-center gap-1.5 mb-1 px-0.5 text-[11px] ${
                                                            isMine ? 'flex-row-reverse' : 'flex-row'
                                                        }`}
                                                    >
                                                        <span className="font-bold text-[#14335D] dark:text-slate-100">
                                                            {isMine
                                                                ? pick('Kamu', 'You')
                                                                : msg.user?.name || pick('Pengguna', 'User')}
                                                        </span>

                                                        {isAdmin && (
                                                            <span className="rounded-full bg-amber-100 dark:bg-amber-500/20 px-1.5 py-0.5 text-[9.5px] font-bold uppercase text-amber-800 dark:text-amber-300">
                                                                Admin
                                                            </span>
                                                        )}

                                                        {isSeller && (
                                                            <Link
                                                                href={`/stores/${msg.user.store_slug}`}
                                                                className="inline-flex items-center gap-1 rounded-full bg-sky-50 dark:bg-[#60C2E6]/15 border border-sky-200/80 dark:border-[#60C2E6]/30 px-2 py-0.5 text-[9.5px] font-bold text-[#005A9D] dark:text-[#60C2E6] hover:underline"
                                                            >
                                                                <Store className="w-2.5 h-2.5" />
                                                                <span>{msg.user.store_name || pick('Penjual', 'Seller')}</span>
                                                            </Link>
                                                        )}

                                                        <span className="text-[10.5px] text-slate-400 tabular-nums">
                                                            {msg.time_label}
                                                        </span>
                                                    </div>

                                                    <div
                                                        className={`flex items-center gap-1.5 ${
                                                            isMine ? 'flex-row-reverse' : 'flex-row'
                                                        }`}
                                                    >
                                                        <div
                                                            className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                                                                isMine
                                                                    ? 'bg-[#005A9D] text-white rounded-tr-xs'
                                                                    : 'bg-[#eef6fc] dark:bg-[#13223b] text-[#14335D] dark:text-slate-100 border border-sky-100 dark:border-slate-700/70 rounded-tl-xs'
                                                            }`}
                                                        >
                                                            {msg.reply_to && (
                                                                <div
                                                                    className={`mb-2 rounded-lg px-2.5 py-1.5 border-l-2 text-[11px] ${
                                                                        isMine
                                                                            ? 'bg-white/15 border-[#A1E1EF] text-sky-100'
                                                                            : 'bg-white dark:bg-[#0e1628] border-[#005A9D] text-slate-600 dark:text-slate-300'
                                                                    }`}
                                                                >
                                                                    <p className="font-bold truncate">
                                                                        {msg.reply_to.user_name}
                                                                    </p>
                                                                    <p className="line-clamp-1 opacity-90">
                                                                        {msg.reply_to.snippet}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {msg.image_url && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setLightboxUrl(msg.image_url)}
                                                                    className="block mb-2 overflow-hidden rounded-xl border border-black/10 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#60C2E6]"
                                                                >
                                                                    <img
                                                                        src={msg.image_url}
                                                                        alt={pick('Foto komunitas', 'Community photo')}
                                                                        loading="lazy"
                                                                        className="max-h-60 w-auto max-w-full object-cover hover:opacity-95 transition"
                                                                    />
                                                                </button>
                                                            )}

                                                            {msg.message && (
                                                                <p className="whitespace-pre-wrap break-words">
                                                                    {msg.message}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {(currentUser || canDelete) && (
                                                            <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                                                {currentUser && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setReplyTo(msg);
                                                                            inputRef.current?.focus();
                                                                        }}
                                                                        title={pick('Balas pesan', 'Reply')}
                                                                        aria-label={pick('Balas pesan', 'Reply')}
                                                                        className="p-1.5 rounded-full text-slate-400 hover:text-[#005A9D] hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                                                    >
                                                                        <Reply className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                                {canDelete && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDelete(msg.id)}
                                                                        disabled={deletingId === msg.id}
                                                                        title={pick('Hapus pesan', 'Delete message')}
                                                                        aria-label={pick('Hapus pesan', 'Delete message')}
                                                                        className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition disabled:opacity-40"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Floating New Messages Pill */}
                            {hasUnseenBelow && (
                                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
                                    <button
                                        type="button"
                                        onClick={() => scrollToBottom('smooth')}
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#005A9D] hover:bg-[#14335D] text-white px-4 py-1.5 text-xs font-bold shadow-lg transition"
                                    >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                        <span>{pick('Pesan baru', 'New messages')}</span>
                                    </button>
                                </div>
                            )}

                            {/* Bottom Pill Composer / Guest Callout */}
                            <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0e1424] px-4 sm:px-5 py-3.5 space-y-2.5 shrink-0">
                                {errorMessage && (
                                    <div className="flex items-center justify-between gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/70 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
                                        <span>{errorMessage}</span>
                                        <button
                                            type="button"
                                            onClick={() => setErrorMessage('')}
                                            aria-label={pick('Tutup error', 'Close error')}
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}

                                {currentUser ? (
                                    <form onSubmit={handleSubmit} className="space-y-2.5">
                                        {replyTo && (
                                            <div className="flex items-center justify-between gap-2 rounded-xl bg-[#eef6ff] dark:bg-[#131d33] border border-sky-200/70 dark:border-slate-700 px-3 py-2 text-xs">
                                                <div className="min-w-0">
                                                    <span className="font-bold text-[#005A9D] dark:text-[#60C2E6]">
                                                        {pick('Membalas', 'Replying to')}{' '}
                                                        {replyTo.user?.name || pick('Pengguna', 'User')}:
                                                    </span>{' '}
                                                    <span className="text-slate-600 dark:text-slate-300 truncate">
                                                        {replyTo.message || pick('[Foto]', '[Photo]')}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setReplyTo(null)}
                                                    className="p-1 rounded-full hover:bg-white/70 dark:hover:bg-slate-800 text-slate-500"
                                                    aria-label={pick('Batalkan balasan', 'Cancel reply')}
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}

                                        {imagePreview && (
                                            <div className="relative inline-block">
                                                <img
                                                    src={imagePreview}
                                                    alt={pick('Pratinjau foto', 'Photo preview')}
                                                    className="h-20 w-auto rounded-xl border border-sky-200/80 dark:border-slate-700 object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={clearImage}
                                                    aria-label={pick('Hapus foto', 'Remove photo')}
                                                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs hover:bg-rose-600 transition"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 rounded-full bg-[#f4f9ff] dark:bg-[#131d33] border border-sky-200/80 dark:border-slate-700 p-1.5 focus-within:border-[#005A9D] dark:focus-within:border-[#60C2E6] focus-within:ring-2 focus-within:ring-[#005A9D]/15 transition">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp,image/jpg"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                title={pick('Lampirkan foto', 'Attach photo')}
                                                aria-label={pick('Lampirkan foto', 'Attach photo')}
                                                className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-full border border-sky-200/70 dark:border-slate-700 bg-white hover:bg-[#eef6ff] dark:bg-[#0e1628] dark:hover:bg-slate-800 text-[#005A9D] dark:text-[#60C2E6] transition"
                                            >
                                                <ImagePlus className="w-4 h-4" />
                                            </button>

                                            <textarea
                                                ref={inputRef}
                                                rows={1}
                                                maxLength={600}
                                                value={draft}
                                                onChange={(e) => setDraft(e.target.value)}
                                                onKeyDown={handleTextareaKeyDown}
                                                placeholder={pick(
                                                    'Tulis pesan di sini...',
                                                    'Write a message here...',
                                                )}
                                                className="flex-1 min-h-[40px] max-h-24 resize-none border-0 bg-transparent px-2 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 leading-snug"
                                            />

                                            <button
                                                type="submit"
                                                disabled={sending || (draft.trim() === '' && !imageFile)}
                                                aria-label={sending ? pick('Mengirim...', 'Sending...') : pick('Kirim pesan', 'Send message')}
                                                title={sending ? pick('Mengirim...', 'Sending...') : pick('Kirim', 'Send')}
                                                className="btn-motion h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-full bg-[#005A9D] hover:bg-[#14335D] dark:bg-[#60C2E6] dark:hover:bg-[#38b2d8] text-white dark:text-[#14335D] shadow-xs disabled:opacity-45 disabled:cursor-not-allowed transition"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl sm:rounded-full bg-[#f4f9ff] dark:bg-[#131d33] border border-sky-200/80 dark:border-slate-700 px-4 py-2.5">
                                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                            {pick(
                                                'Masuk ke akun Dunia Ikan untuk ikut mengirim pesan dan berdiskusi dengan komunitas.',
                                                'Sign in to your Dunia Ikan account to post messages and chat with the community.',
                                            )}
                                        </p>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Link
                                                href="/login"
                                                className="btn-motion inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#005A9D] hover:bg-[#14335D] dark:bg-[#60C2E6] dark:text-[#14335D] text-white text-xs font-bold transition"
                                            >
                                                <LogIn className="w-3.5 h-3.5" />
                                                <span>{pick('Masuk', 'Sign In')}</span>
                                            </Link>
                                            <Link
                                                href="/register"
                                                className="px-4 py-2 rounded-full border border-sky-200/80 dark:border-slate-700 bg-white dark:bg-[#0e1628] hover:border-[#005A9D] text-xs font-semibold text-[#14335D] dark:text-slate-200 transition"
                                            >
                                                {pick('Daftar', 'Sign Up')}
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                </div>
            </div>

            {/* Image Lightbox Modal */}
            {lightboxUrl && (
                <div
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setLightboxUrl(null)}
                    className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
                >
                    <button
                        type="button"
                        onClick={() => setLightboxUrl(null)}
                        aria-label={pick('Tutup gambar', 'Close image')}
                        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <img
                        src={lightboxUrl}
                        alt={pick('Foto komunitas ukuran penuh', 'Full-size community photo')}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl"
                    />
                </div>
            )}
        </AppLayout>
    );
}

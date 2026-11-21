import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import UserAvatar from '@/Components/UserAvatar';
import { useLanguage } from '@/lib/i18n';
import {
    ArrowDown,
    Fish,
    ImagePlus,
    Lightbulb,
    LogIn,
    MessageSquare,
    MessagesSquare,
    Reply,
    Send,
    ShoppingCart,
    Store,
    Trash2,
    Users,
    Wrench,
    X,
} from 'lucide-react';

const POLL_INTERVAL_MS = 4000;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

const STARTER_TOPICS = [
    {
        id: 'species',
        icon: Fish,
        labelId: 'Jenis ikan hias',
        labelEn: 'Ornamental species',
        promptId: 'Halo teman-teman! Ada rekomendasi jenis ikan hias yang cantik dan tahan banting buat penghobi baru?',
        promptEn: 'Hi everyone! Any recommendations on colorful, hardy ornamental fish for a community tank?',
    },
    {
        id: 'care',
        icon: Wrench,
        labelId: 'Perawatan ikan',
        labelEn: 'Fish care',
        promptId: 'Mau sharing soal perawatan air & kesehatan ikan nih — gimana rutinitas ganti air kalian?',
        promptEn: 'Let us talk water quality & fish health — how often do you do partial water changes?',
    },
    {
        id: 'trade',
        icon: ShoppingCart,
        labelId: 'Jual beli ikan',
        labelEn: 'Buy & sell fish',
        promptId: 'Ada penangkar atau toko ikan terpercaya di sini yang lagi ready stok cakep?',
        promptEn: 'Any trusted breeders or sellers here with healthy stock ready to ship today?',
    },
    {
        id: 'tips',
        icon: Lightbulb,
        labelId: 'Tips akuarium',
        labelEn: 'Aquarium tips',
        promptId: 'Boleh share setup akuarium & tips aquascape favorit kalian dong!',
        promptEn: 'Would love to hear your favorite aquarium setup and aquascaping tips!',
    },
];

function CommunityHeroWaves() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 overflow-hidden"
        >
            {/* Soft radial glow */}
            <div className="absolute -top-16 right-12 w-80 h-80 rounded-full bg-white/45 dark:bg-[#60C2E6]/10 blur-3xl" />

            {/* Subtle far-right reef silhouette & waves along bottom */}
            <svg
                viewBox="0 0 1440 200"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-x-0 bottom-0 w-full h-28 sm:h-36"
            >
                <path
                    d="M0 124C210 78 430 140 680 110C910 82 1130 50 1440 96V200H0V124Z"
                    className="fill-[#dfe5fe]/75 dark:fill-[#162354]/65"
                />
                <path
                    d="M0 150C290 106 540 172 840 136C1110 104 1280 86 1440 124V200H0V150Z"
                    className="fill-[#d0d8fc]/80 dark:fill-[#1d2c66]/70"
                />
                <path
                    d="M0 178C340 158 620 186 940 166C1170 152 1330 156 1440 172V200H0V178Z"
                    className="fill-[#c4cefa]/55 dark:fill-[#0d1638]/80"
                />
            </svg>
        </div>
    );
}

function CommunityHeroFishDuo() {
    return (
        <svg
            viewBox="0 0 250 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="hidden md:block w-52 lg:w-60 h-auto pointer-events-none select-none -mt-3 -mb-1"
        >
            <defs>
                <linearGradient id="commBigFishBody" x1="20" y1="22" x2="145" y2="86" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#6570d9" />
                    <stop offset="100%" stopColor="#464bb8" />
                </linearGradient>
                <linearGradient id="commBigFishFin" x1="112" y1="25" x2="165" y2="80" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#5861cf" />
                </linearGradient>
                <linearGradient id="commClownBody" x1="158" y1="68" x2="225" y2="104" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#6e77df" />
                    <stop offset="100%" stopColor="#4f54bf" />
                </linearGradient>
            </defs>

            {/* Floating soft bubbles */}
            <circle cx="152" cy="18" r="4.5" className="fill-white/80 dark:fill-[#60C2E6]/40" />
            <circle cx="168" cy="9" r="2.6" className="fill-white/75 dark:fill-[#60C2E6]/30" />
            <circle cx="32" cy="24" r="3" className="fill-white/70 dark:fill-[#60C2E6]/30" />

            {/* Subtle left coral tip peeking neatly beside fish */}
            <path
                d="M14 112C14 96 10 82 4 72C1 67 2 62 7 61C12 60 17 68 18 75C20 62 24 52 30 54C36 56 32 72 28 84C33 76 39 74 42 78C45 83 35 96 28 106V112H14Z"
                className="fill-[#aeb9f4]/75 dark:fill-[#38498f]/70"
            />

            {/* Bigger reef angelfish swimming left */}
            <g>
                <path d="M126 52L166 26C170 42 170 62 166 78L126 52Z" fill="url(#commBigFishFin)" />
                <path d="M68 24C84 4 112 6 126 24L98 32L68 24Z" fill="url(#commBigFishFin)" />
                <path d="M70 78C86 96 112 94 124 76L96 72L70 78Z" fill="url(#commBigFishFin)" />
                <path
                    d="M32 52C44 26 78 14 114 24C132 30 144 42 144 52C144 62 132 74 114 80C78 90 44 78 32 52Z"
                    fill="url(#commBigFishBody)"
                />
                <path d="M70 25C78 40 78 62 70 79" stroke="#e8ecff" strokeOpacity="0.68" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M98 22C105 40 105 64 98 82" stroke="#e8ecff" strokeOpacity="0.55" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M120 30C125 42 125 62 120 74" stroke="#e8ecff" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" />
                <circle cx="52" cy="47" r="4.6" fill="#ffffff" />
                <circle cx="51" cy="47" r="2.4" fill="#182052" />
            </g>

            {/* Smaller cute striped clownfish beside it */}
            <g>
                <path d="M214 86L238 72C240 81 240 91 238 100L214 86Z" fill="url(#commBigFishFin)" />
                <path
                    d="M164 86C170 70 190 64 210 72C220 76 226 81 226 86C226 91 220 96 210 100C190 108 170 102 164 86Z"
                    fill="url(#commClownBody)"
                />
                <path d="M185 70C189 80 189 92 185 102" stroke="#ffffff" strokeOpacity="0.84" strokeWidth="4" strokeLinecap="round" />
                <path d="M204 71C207 80 207 92 204 101" stroke="#ffffff" strokeOpacity="0.72" strokeWidth="3.8" strokeLinecap="round" />
                <circle cx="175" cy="83" r="3.2" fill="#ffffff" />
                <circle cx="174.2" cy="83" r="1.7" fill="#182052" />
            </g>
        </svg>
    );
}

function CommunityEmptyArtwork() {
    return (
        <svg
            viewBox="0 0 240 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="w-52 sm:w-60 h-auto mx-auto"
        >
            <defs>
                <linearGradient id="emptyFishGrad" x1="56" y1="68" x2="132" y2="108" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#5861cf" />
                    <stop offset="100%" stopColor="#3c40a8" />
                </linearGradient>
                <linearGradient id="emptyBubbleGrad" x1="128" y1="18" x2="188" y2="66" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8b94f6" />
                    <stop offset="100%" stopColor="#656ee0" />
                </linearGradient>
            </defs>

            {/* Soft circular halo behind illustration */}
            <circle cx="120" cy="68" r="54" className="fill-[#eef1ff] dark:fill-[#152042]" />

            {/* Subtle seabed coral */}
            <path
                d="M44 114C44 98 40 84 32 74C28 69 29 63 34 62C39 61 44 68 46 76C48 64 52 54 58 55C63 56 61 70 57 82C62 76 68 74 71 78C74 82 66 93 60 100C58 106 58 110 58 114H44Z"
                className="fill-[#c2cbf8] dark:fill-[#293973]"
            />
            <path
                d="M180 114C180 96 184 82 192 70C196 64 202 62 204 66C207 70 201 80 196 90C202 84 209 82 211 86C213 91 204 102 194 114H180Z"
                className="fill-[#b6c1f6] dark:fill-[#24346b]"
            />
            <ellipse cx="120" cy="115" rx="68" ry="6" className="fill-[#dde3fc] dark:fill-[#1b2856]" />

            {/* Floating chat speech bubble with typing dots */}
            <path
                d="M132 20H180C186.627 20 192 25.3726 192 32V52C192 58.6274 186.627 64 180 64H152L140 74V64H132C125.373 64 120 58.6274 120 52V32C120 25.3726 125.373 20 132 20Z"
                fill="url(#emptyBubbleGrad)"
            />
            <circle cx="144" cy="42" r="3.4" fill="#ffffff" />
            <circle cx="156" cy="42" r="3.4" fill="#ffffff" />
            <circle cx="168" cy="42" r="3.4" fill="#ffffff" />

            {/* Cute clownfish facing right */}
            <path d="M72 86L50 70C47 80 47 92 50 102L72 86Z" fill="#7781ea" />
            <path d="M90 66C98 54 112 56 116 68L98 72L90 66Z" fill="#7781ea" />
            <path
                d="M128 86C122 68 100 62 80 70C70 74 64 80 64 86C64 92 70 98 80 102C100 110 122 104 128 86Z"
                fill="url(#emptyFishGrad)"
            />
            <path
                d="M84 69C80 80 80 92 84 103"
                stroke="#ffffff"
                strokeOpacity="0.88"
                strokeWidth="4.8"
                strokeLinecap="round"
            />
            <path
                d="M104 68C101 80 101 92 104 104"
                stroke="#ffffff"
                strokeOpacity="0.85"
                strokeWidth="4.5"
                strokeLinecap="round"
            />
            <circle cx="116" cy="82" r="4" fill="#ffffff" />
            <circle cx="117" cy="82" r="2.1" fill="#182052" />
            <circle cx="137" cy="70" r="2.5" className="fill-[#9fa8f5] dark:fill-[#60C2E6]" />
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
    if (!dateKey) {
        return pick('Hari ini', 'Today');
    }
    if (dateKey === getJakartaDateKey(0)) {
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

    const handleSelectTopic = (topic) => {
        if (!currentUser) {
            setErrorMessage(
                pick(
                    'Masuk dulu ke akun Dunia Ikan untuk mulai diskusi topik tersebut.',
                    'Sign in to your Dunia Ikan account to start discussing this topic.',
                ),
            );
            return;
        }
        setErrorMessage('');
        setDraft(pick(topic.promptId, topic.promptEn));
        window.requestAnimationFrame(() => inputRef.current?.focus());
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
                    'Komunitas & Chat Global — Dunia Ikan',
                    'Community Global Chat — Dunia Ikan',
                )}
            />

            <div className="min-h-screen bg-[#f4f6ff] dark:bg-[#070b14]">
                {/* Soft Pastel Ocean Wave Hero */}
                <section className="pt-6 sm:pt-8 pb-5 sm:pb-7 relative w-full overflow-hidden bg-gradient-to-b from-[#eef1ff] via-[#e4e9fe] to-[#d9e1fd] dark:from-[#0b1332] dark:via-[#111c45] dark:to-[#0d1638] border-b border-indigo-200/70 dark:border-slate-800">
                    <CommunityHeroWaves />

                    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-2 max-w-xl">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/85 dark:bg-white/10 backdrop-blur-xs border border-indigo-200/80 dark:border-white/15 px-3.5 py-1 text-xs font-semibold text-[#182052] dark:text-[#8BE8EC] shadow-2xs">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span>{pick('Obrolan Publik Terbuka', 'Public Community Room')}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold tracking-tight leading-tight text-[#0d1440] dark:text-white">
                                {pick('Chat Global Komunitas Ikan', 'Global Aquarist Chat')}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {pick(
                                    'Tempat berkumpulnya penghobi, pembudidaya, dan penjual ikan hias untuk berbagi informasi dan berdiskusi.',
                                    'A gathering place for ornamental fish hobbyists, breeders, and sellers to share tips and connect.',
                                )}
                            </p>
                        </div>

                        <div className="flex flex-col md:items-end gap-2 shrink-0">
                            <CommunityHeroFishDuo />

                            <div className="flex items-center gap-2.5">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-white/10 backdrop-blur-xs border border-indigo-200/80 dark:border-white/15 px-3.5 py-1.5 text-xs font-semibold text-[#1c2454] dark:text-slate-100 shadow-xs">
                                    <MessagesSquare className="w-3.5 h-3.5 text-[#4348b8] dark:text-[#60C2E6]" />
                                    <span className="tabular-nums">{stats?.totalMessages ?? messages.length}</span>
                                    <span className="text-slate-500 dark:text-slate-300">{pick('pesan', 'messages')}</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 dark:bg-white/10 backdrop-blur-xs border border-indigo-200/80 dark:border-white/15 px-3.5 py-1.5 text-xs font-semibold text-[#1c2454] dark:text-slate-100 shadow-xs">
                                    <Users className="w-3.5 h-3.5 text-[#4348b8] dark:text-[#60C2E6]" />
                                    <span className="tabular-nums">{stats?.participantsCount ?? 0}</span>
                                    <span className="text-slate-500 dark:text-slate-300">{pick('anggota', 'members')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Chat Card Workspace */}
                <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <div className="relative flex flex-col rounded-3xl bg-white dark:bg-[#0e1424] border border-indigo-100/90 dark:border-slate-800 shadow-[0_20px_50px_-20px_rgba(30,41,110,0.16)] overflow-hidden">
                        {/* Message Feed */}
                        <div
                            ref={scrollContainerRef}
                            onScroll={handleScroll}
                            className={`relative overflow-y-auto px-3 sm:px-6 bg-white dark:bg-[#0e1424] ${
                                groupedItems.length === 0
                                    ? 'min-h-[240px] py-5 flex flex-col justify-center'
                                    : 'h-[52dvh] min-h-[340px] max-h-[580px] py-5 sm:py-6 space-y-3.5'
                            }`}
                        >
                            {hasMoreOlder && (
                                <div className="flex justify-center pb-1">
                                    <button
                                        type="button"
                                        onClick={handleLoadOlder}
                                        disabled={loadingOlder}
                                        className="px-4 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-[#38369a] dark:text-slate-200 transition disabled:opacity-50"
                                    >
                                        {loadingOlder
                                            ? pick('Memuat pesan lama...', 'Loading older messages...')
                                            : pick('Muat pesan sebelumnya', 'Load older messages')}
                                    </button>
                                </div>
                            )}

                            {groupedItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center px-4 py-2 space-y-2">
                                    <CommunityEmptyArtwork />
                                    <h2 className="text-base sm:text-lg font-extrabold text-[#111842] dark:text-white tracking-tight">
                                        {pick('Belum ada diskusi nih!', 'No discussions yet!')}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg">
                                        {pick(
                                            'Jadilah yang pertama memulai percakapan bersama komunitas ikan hias.',
                                            'Be the first to start a conversation with the ornamental fish community.',
                                        )}
                                    </p>
                                </div>
                            ) : (
                            groupedItems.map((item) => {
                                if (item.type === 'date') {
                                    return (
                                        <div key={item.key} className="flex items-center justify-center py-1">
                                            <span className="px-3 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/90 text-[10px] font-bold text-slate-500 dark:text-slate-400">
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
                                        className={`group flex items-end gap-2.5 ${
                                            isMine ? 'flex-row-reverse' : 'flex-row'
                                        }`}
                                    >
                                        <UserAvatar
                                            user={msg.user}
                                            className="w-8 h-8 text-xs shrink-0 mb-0.5 ring-1 ring-slate-200/80 dark:ring-slate-700"
                                        />

                                        <div
                                            className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                                                isMine ? 'items-end' : 'items-start'
                                            }`}
                                        >
                                            {/* Sender Meta Row */}
                                            <div
                                                className={`flex flex-wrap items-center gap-1.5 mb-1 px-1 text-[11px] ${
                                                    isMine ? 'flex-row-reverse' : 'flex-row'
                                                }`}
                                            >
                                                <span className="font-bold text-[#14335D] dark:text-slate-100">
                                                    {isMine
                                                        ? pick('Kamu', 'You')
                                                        : msg.user?.name || pick('Pengguna', 'User')}
                                                </span>

                                                {isAdmin && (
                                                    <span className="rounded-full bg-amber-100 dark:bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold uppercase text-amber-800 dark:text-amber-300">
                                                        Admin
                                                    </span>
                                                )}

                                                {isSeller && (
                                                    <Link
                                                        href={`/stores/${msg.user.store_slug}`}
                                                        className="inline-flex items-center gap-1 rounded-full bg-cyan-50 dark:bg-[#60C2E6]/15 border border-cyan-200/80 dark:border-[#60C2E6]/30 px-2 py-0.2 text-[9.5px] font-bold text-[#00696D] dark:text-[#60C2E6] hover:underline"
                                                    >
                                                        <Store className="w-2.5 h-2.5" />
                                                        <span>{msg.user.store_name || pick('Penjual', 'Seller')}</span>
                                                    </Link>
                                                )}

                                                <span className="text-[10px] text-slate-400 tabular-nums">
                                                    {msg.time_label}
                                                </span>
                                            </div>

                                            {/* Bubble + Inline Actions */}
                                            <div
                                                className={`flex items-center gap-1.5 ${
                                                    isMine ? 'flex-row-reverse' : 'flex-row'
                                                }`}
                                            >
                                                <div
                                                    className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs ${
                                                        isMine
                                                            ? 'bg-[#38369a] dark:bg-[#005A9D] text-white rounded-br-xs'
                                                            : 'bg-[#f4f6fc] dark:bg-[#152038] text-slate-800 dark:text-slate-100 border border-indigo-100/80 dark:border-slate-700/70 rounded-bl-xs'
                                                    }`}
                                                >
                                                    {msg.reply_to && (
                                                        <div
                                                            className={`mb-2 rounded-lg px-2.5 py-1.5 border-l-2 text-[11px] ${
                                                                isMine
                                                                    ? 'bg-white/10 border-[#60C2E6] text-slate-200'
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

                                                {/* Action Buttons */}
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
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
                            <button
                                type="button"
                                onClick={() => scrollToBottom('smooth')}
                                className="inline-flex items-center gap-1.5 rounded-full bg-[#38369a] hover:bg-[#2c2a85] dark:bg-[#005A9D] text-white px-4 py-1.5 text-xs font-bold shadow-lg transition"
                            >
                                <ArrowDown className="w-3.5 h-3.5" />
                                <span>{pick('Pesan baru', 'New messages')}</span>
                            </button>
                        </div>
                    )}

                    {/* Bottom Starter Topics + Pill Composer / Guest Callout */}
                    <div className="border-t border-indigo-100/80 dark:border-slate-800 bg-white dark:bg-[#0e1424] px-4 sm:px-6 pt-4 pb-5 space-y-4">
                        {groupedItems.length === 0 && (
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-[#141c4c] dark:text-slate-200">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#38369a] dark:bg-[#60C2E6] text-white dark:text-[#14335D]">
                                        <MessageSquare className="w-3 h-3" />
                                    </span>
                                    <span>
                                        {pick(
                                            'Mulai diskusi dari topik berikut',
                                            'Start a discussion from these topics',
                                        )}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {STARTER_TOPICS.map((topic) => {
                                        const TopicIcon = topic.icon;

                                        return (
                                            <button
                                                key={topic.id}
                                                type="button"
                                                onClick={() => handleSelectTopic(topic)}
                                                className="inline-flex items-center gap-1.5 rounded-full bg-[#eef0fc] hover:bg-[#e1e5fb] dark:bg-[#162040] dark:hover:bg-[#1e2c57] border border-indigo-200/70 dark:border-slate-700 px-3.5 py-1.5 text-xs font-medium text-[#1b2250] dark:text-slate-200 transition"
                                            >
                                                <TopicIcon className="w-3.5 h-3.5 text-[#38369a] dark:text-[#60C2E6]" />
                                                <span>{pick(topic.labelId, topic.labelEn)}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
                                    <div className="flex items-center justify-between gap-2 rounded-xl bg-[#eef0fc] dark:bg-[#131d33] border border-indigo-200/70 dark:border-slate-700 px-3 py-2 text-xs">
                                        <div className="min-w-0">
                                            <span className="font-bold text-[#38369a] dark:text-[#60C2E6]">
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
                                            className="h-20 w-auto rounded-xl border border-indigo-100 dark:border-slate-700 object-cover"
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

                                <div className="flex items-center gap-2 rounded-full bg-[#f8f9ff] dark:bg-[#131d33] border border-indigo-200/80 dark:border-slate-700 p-1.5 focus-within:border-[#38369a] dark:focus-within:border-[#60C2E6] focus-within:ring-2 focus-within:ring-[#38369a]/15 transition">
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
                                        className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-full border border-indigo-100 dark:border-slate-700 bg-white hover:bg-indigo-50 dark:bg-[#0e1628] dark:hover:bg-slate-800 text-[#38369a] dark:text-[#60C2E6] transition"
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
                                            'Tulis pesan untuk komunitas...',
                                            'Write a message for the community...',
                                        )}
                                        className="flex-1 min-h-[40px] max-h-24 resize-none border-0 bg-transparent px-2 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 leading-snug"
                                    />

                                    <button
                                        type="submit"
                                        disabled={sending || (draft.trim() === '' && !imageFile)}
                                        aria-label={sending ? pick('Mengirim...', 'Sending...') : pick('Kirim pesan', 'Send message')}
                                        title={sending ? pick('Mengirim...', 'Sending...') : pick('Kirim', 'Send')}
                                        className="btn-motion h-10 w-10 shrink-0 inline-flex items-center justify-center rounded-full bg-[#38369a] hover:bg-[#2c2a85] dark:bg-[#60C2E6] dark:hover:bg-[#38a2a7] text-white dark:text-[#14335D] shadow-xs disabled:opacity-45 disabled:cursor-not-allowed transition"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl sm:rounded-full bg-[#f8f9ff] dark:bg-[#131d33] border border-indigo-200/80 dark:border-slate-700 px-4 py-2.5">
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                    {pick(
                                        'Masuk ke akun Dunia Ikan untuk ikut mengirim pesan dan berdiskusi dengan komunitas.',
                                        'Sign in to your Dunia Ikan account to post messages and chat with the community.',
                                    )}
                                </p>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Link
                                        href="/login"
                                        className="btn-motion inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#38369a] hover:bg-[#2c2a85] dark:bg-[#60C2E6] dark:text-[#14335D] text-white text-xs font-bold transition"
                                    >
                                        <LogIn className="w-3.5 h-3.5" />
                                        <span>{pick('Masuk', 'Sign In')}</span>
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 rounded-full border border-indigo-200 dark:border-slate-700 bg-white dark:bg-[#0e1628] hover:border-[#38369a] text-xs font-semibold text-[#182052] dark:text-slate-200 transition"
                                    >
                                        {pick('Daftar', 'Sign Up')}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                    </div>
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

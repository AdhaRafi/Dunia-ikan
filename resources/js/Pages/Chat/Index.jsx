import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import AppLayout from '@/Layouts/AppLayout';
import KikoAquariumCanvas from '@/Components/KikoAquariumCanvas';
import StoreLogo from '@/Components/StoreLogo';
import UserAvatar from '@/Components/UserAvatar';
import {
    AlertCircle,
    ArrowLeft,
    ImagePlus,
    MessageSquare,
    Search,
    Send,
    Store,
    X,
} from '@/Components/Icons';
import { useLanguage } from '@/lib/i18n';

const POLL_INTERVAL_MS = 4000;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);
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
    conversations: initialConversations = [],
    activeConversationId: initialActiveId = null,
    initialMessages = [],
    hasStore = false,
    initialTab = 'all',
}) {
    const { auth } = usePage().props;
    const currentUser = auth?.user;
    const { pick, isEn } = useLanguage();

    const [conversations, setConversations] = useState(initialConversations);
    const [activeId, setActiveId] = useState(initialActiveId);
    const [messages, setMessages] = useState(initialMessages);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileShowThread, setMobileShowThread] = useState(Boolean(initialActiveId));

    const [inputText, setInputText] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [attachContextProduct, setAttachContextProduct] = useState(false);

    const [loadingThread, setLoadingThread] = useState(false);
    const [sending, setSending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [sendBurstKey, setSendBurstKey] = useState(0);
    const [tapEvent, setTapEvent] = useState(null);

    const fileInputRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const tankPaneRef = useRef(null);
    const pointerRef = useRef({ x: 0, y: 0, active: false });
    const lastMessageIdRef = useRef(
        initialMessages.length > 0 ? initialMessages[initialMessages.length - 1].id : 0,
    );

    const handleTankPointerMove = (e) => {
        const rect = tankPaneRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }
        pointerRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            active: true,
        };
    };

    const handleTankPointerLeave = () => {
        pointerRef.current = { ...pointerRef.current, active: false };
    };

    const handleTankPointerDown = (e) => {
        if (e.target.closest('button, a, input, textarea')) {
            return;
        }
        const rect = tankPaneRef.current?.getBoundingClientRect();
        if (!rect) {
            return;
        }
        setTapEvent({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            id: Date.now() + Math.random(),
        });
    };

    const activeConversation = useMemo(
        () => conversations.find((c) => c.id === activeId) || null,
        [conversations, activeId],
    );

    const filteredConversations = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return conversations.filter((conv) => {
            if (activeTab === 'buying' && conv.role !== 'buyer') {
                return false;
            }
            if (activeTab === 'store' && conv.role !== 'seller') {
                return false;
            }
            if (!q) {
                return true;
            }
            const counterpartyName =
                conv.role === 'seller'
                    ? (conv.buyer?.name || '')
                    : (conv.store?.name || '');
            return (
                counterpartyName.toLowerCase().includes(q) ||
                (conv.last_message_preview || '').toLowerCase().includes(q)
            );
        });
    }, [conversations, activeTab, searchQuery]);

    const groupedMessages = useMemo(() => {
        const groups = [];
        for (const msg of messages) {
            const key = msg.date_key || getJakartaDateKey(0);
            const lastGroup = groups[groups.length - 1];
            if (!lastGroup || lastGroup.dateKey !== key) {
                groups.push({ dateKey: key, items: [msg] });
            } else {
                lastGroup.items.push(msg);
            }
        }
        return groups;
    }, [messages]);

    useEffect(() => {
        lastMessageIdRef.current =
            messages.length > 0 ? messages[messages.length - 1].id : 0;
    }, [messages]);

    const scrollToBottom = useCallback((behavior = 'smooth') => {
        const container = messagesContainerRef.current;
        if (!container) {
            return;
        }
        container.scrollTo({
            top: container.scrollHeight,
            behavior,
        });
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom('auto');
        }
    }, [activeId, scrollToBottom]);

    const loadConversation = useCallback(async (conversationId) => {
        if (!conversationId) {
            return;
        }
        setActiveId(conversationId);
        setMobileShowThread(true);
        setLoadingThread(true);
        setErrorMessage('');
        setAttachContextProduct(false);

        try {
            const res = await axios.get(`/chat/${conversationId}/messages`);
            const fetched = Array.isArray(res.data.messages) ? res.data.messages : [];
            setMessages(fetched);
            if (Array.isArray(res.data.conversations)) {
                setConversations(res.data.conversations);
            }
            window.requestAnimationFrame(() => scrollToBottom('auto'));
        } catch (err) {
            console.error('Failed to load store messages:', err);
            setErrorMessage(
                pick(
                    'Gagal memuat percakapan. Coba pilih ulang percakapan ini.',
                    'Failed to load conversation. Please select it again.',
                ),
            );
        } finally {
            setLoadingThread(false);
        }
    }, [pick, scrollToBottom]);

    // Poll active thread every 4s while tab is visible
    useEffect(() => {
        if (!activeId) {
            return undefined;
        }

        const poll = async () => {
            if (document.visibilityState !== 'visible') {
                return;
            }
            try {
                const res = await axios.get(`/chat/${activeId}/messages`, {
                    params: { after_id: lastMessageIdRef.current },
                });
                const incoming = Array.isArray(res.data.messages) ? res.data.messages : [];
                if (incoming.length > 0) {
                    setMessages((prev) => {
                        const existingIds = new Set(prev.map((m) => m.id));
                        const fresh = incoming.filter((m) => !existingIds.has(m.id));
                        return fresh.length > 0 ? [...prev, ...fresh] : prev;
                    });
                    window.requestAnimationFrame(() => scrollToBottom('smooth'));
                }
                if (Array.isArray(res.data.conversations)) {
                    setConversations(res.data.conversations);
                }
            } catch {
                // Keep UI calm on transient polling failures
            }
        };

        const timer = window.setInterval(poll, POLL_INTERVAL_MS);
        return () => window.clearInterval(timer);
    }, [activeId, scrollToBottom]);

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }
        if (file.size > MAX_IMAGE_BYTES) {
            setErrorMessage(pick('Ukuran foto maksimal 3MB.', 'Maximum photo size is 3MB.'));
            return;
        }
        setErrorMessage('');
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

    const handleSend = async (overrideText = null, includeContextProduct = false) => {
        if (!activeConversation || sending) {
            return;
        }

        const textToSend = (overrideText ?? inputText).trim();
        if (!textToSend && !selectedImage) {
            return;
        }

        setSending(true);
        setErrorMessage('');

        try {
            const formData = new FormData();
            if (textToSend) {
                formData.append('message', textToSend);
            }
            if (selectedImage) {
                formData.append('image', selectedImage);
            }
            if ((includeContextProduct || attachContextProduct) && activeConversation.product?.id) {
                formData.append('product_id', String(activeConversation.product.id));
            }

            const res = await axios.post(`/chat/${activeConversation.id}/messages`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const created = res.data.message;
            if (created) {
                setMessages((prev) =>
                    prev.some((m) => m.id === created.id) ? prev : [...prev, created],
                );
                setConversations((prev) => {
                    const updated = prev.map((c) =>
                        c.id === activeConversation.id
                            ? {
                                  ...c,
                                  unread_count: 0,
                                  last_message_preview:
                                      created.message || (created.image_url ? '[Foto]' : c.last_message_preview),
                                  last_time_label: created.time_label || c.last_time_label,
                              }
                            : c,
                    );
                    const currentItem = updated.find((c) => c.id === activeConversation.id);
                    const others = updated.filter((c) => c.id !== activeConversation.id);
                    return currentItem ? [currentItem, ...others] : updated;
                });
            }

            if (overrideText === null) {
                setInputText('');
            }
            setSendBurstKey((k) => k + 1);
            removeImage();
            setAttachContextProduct(false);
            window.requestAnimationFrame(() => scrollToBottom('smooth'));
        } catch (err) {
            const apiMsg =
                err?.response?.data?.errors?.message?.[0] ||
                err?.response?.data?.errors?.image?.[0] ||
                pick('Gagal mengirim pesan. Coba lagi.', 'Failed to send message. Please try again.');
            setErrorMessage(apiMsg);
        } finally {
            setSending(false);
        }
    };

    const counterpartyTitle = activeConversation
        ? activeConversation.role === 'seller'
            ? activeConversation.buyer?.name || pick('Pembeli', 'Buyer')
            : activeConversation.store?.name || pick('Toko', 'Store')
        : '';

    const counterpartySubtitle = activeConversation
        ? activeConversation.role === 'seller'
            ? pick('Pelanggan Toko Anda', 'Customer of your store')
            : [activeConversation.store?.city, activeConversation.store?.province].filter(Boolean).join(', ')
        : '';

    return (
        <AppLayout hideChatFab>
            <Head title={pick('Chat Toko | Dunia Ikan', 'Store Chat | Dunia Ikan')} />

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
                {/* Page Header */}
                <div className="flex flex-wrap items-end justify-between gap-3 mb-3.5 sm:mb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#14335D] dark:text-white">
                            {pick('Chat Toko', 'Store Chat')}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                            {pick(
                                'Tanya stok, ukuran, kondisi ikan, atau pengiriman langsung ke penangkar.',
                                'Ask breeders directly about stock, sizing, specimen condition, or shipping.',
                            )}
                        </p>
                    </div>

                    <Link
                        href="/products"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0e1424] text-xs font-semibold text-[#14335D] dark:text-slate-200 hover:border-[#005A9D] transition"
                    >
                        <Store className="w-3.5 h-3.5" />
                        {pick('Jelajahi Katalog', 'Browse Catalog')}
                    </Link>
                </div>

                {/* Two-Pane Architectural Inbox (Aquarium-Themed) */}
                <div className="grid grid-cols-1 md:grid-cols-[290px_minmax(0,1fr)] lg:grid-cols-[330px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] rounded-2xl border border-sky-200/80 dark:border-sky-900/60 bg-white dark:bg-[#0b1529] overflow-hidden shadow-[0_18px_45px_-16px_rgba(0,90,157,0.18)] dark:shadow-[0_20px_50px_-16px_rgba(2,6,23,0.75)] min-h-[560px] h-[calc(100dvh-164px)] max-h-[860px]">
                    {/* LEFT PANE: Conversations List */}
                    <aside
                        className={`border-b md:border-b-0 md:border-r border-sky-200/70 dark:border-sky-900/50 bg-gradient-to-b from-white via-[#f9fdff] to-[#eef9fd]/70 dark:from-[#0b1529] dark:via-[#0b1529] dark:to-[#081224] flex flex-col min-h-0 ${
                            mobileShowThread ? 'hidden md:flex' : 'flex'
                        }`}
                    >
                        {/* Search + Role Tabs */}
                        <div className="p-3 bg-gradient-to-b from-[#eefafd] to-white dark:from-[#0e1f3a] dark:to-[#0b1529] border-b border-sky-100 dark:border-slate-800 space-y-2.5 shrink-0">
                            <div className="relative">
                                <Search className="w-4 h-4 text-[#1E80A0] dark:text-[#60C2E6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={pick('Cari toko atau pembeli...', 'Search store or buyer...')}
                                    aria-label={pick('Cari percakapan', 'Search conversations')}
                                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-sky-200/80 dark:border-slate-700 bg-white/95 dark:bg-[#111c33] text-xs text-[#14335D] dark:text-white placeholder:text-slate-400 focus:border-[#005A9D] focus:bg-white dark:focus:bg-[#131f3a] focus:ring-1 focus:ring-[#005A9D]"
                                />
                            </div>

                            {hasStore && (
                                <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-[#e2f5fc]/80 dark:bg-[#111c33] text-[11px] font-semibold">
                                    {[
                                        { id: 'all', label: pick('Semua', 'All') },
                                        { id: 'buying', label: pick('Pembelian', 'Buying') },
                                        { id: 'store', label: pick('Toko Saya', 'My Store') },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`py-1.5 rounded-md transition ${
                                                activeTab === tab.id
                                                    ? 'bg-white dark:bg-[#1a2947] text-[#14335D] dark:text-white shadow-2xs'
                                                    : 'text-slate-600 dark:text-slate-400 hover:text-[#14335D] dark:hover:text-white'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Conversation Rows */}
                        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
                            {filteredConversations.length === 0 ? (
                                <div className="px-5 py-12 text-center space-y-3">
                                    <div className="mx-auto w-11 h-11 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-[#005A9D] dark:text-[#60C2E6] flex items-center justify-center">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-[#14335D] dark:text-white">
                                            {searchQuery.trim()
                                                ? pick('Percakapan tidak ditemukan', 'No matching chats')
                                                : pick('Belum ada chat toko', 'No store chats yet')}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {pick(
                                                'Buka halaman toko atau produk ikan lalu klik tombol Chat Toko untuk mulai bertanya.',
                                                'Open any store or fish listing and click Chat Store to start a conversation.',
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                filteredConversations.map((conv) => {
                                    const isSelected = conv.id === activeId;
                                    const isSellerRole = conv.role === 'seller';
                                    const title = isSellerRole
                                        ? conv.buyer?.name || pick('Pembeli', 'Buyer')
                                        : conv.store?.name || pick('Toko', 'Store');

                                    return (
                                        <button
                                            key={conv.id}
                                            type="button"
                                            onClick={() => loadConversation(conv.id)}
                                            className={`w-full text-left px-3.5 py-3 flex items-start gap-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#005A9D] ${
                                                isSelected
                                                    ? 'bg-[#e2f5fc]/90 dark:bg-[#132847] border-l-[3px] border-[#005A9D] dark:border-[#60C2E6]'
                                                    : 'hover:bg-[#f2fbfe] dark:hover:bg-[#0f1c35]'
                                            }`}
                                        >
                                            {isSellerRole ? (
                                                <UserAvatar
                                                    user={conv.buyer}
                                                    className="w-10 h-10 text-xs shrink-0"
                                                />
                                            ) : (
                                                <StoreLogo
                                                    store={conv.store}
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                                    fallbackClassName="w-10 h-10 rounded-full bg-[#14335D] text-white text-xs font-bold flex items-center justify-center shrink-0"
                                                />
                                            )}

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-[13px] font-bold text-[#14335D] dark:text-white truncate">
                                                        {title}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 tabular-nums">
                                                        {conv.last_time_label || conv.last_date_label}
                                                    </span>
                                                </div>

                                                <div className="mt-0.5 flex items-center justify-between gap-2">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                        {conv.last_message_preview ||
                                                            pick('Mulai percakapan...', 'Start chatting...')}
                                                    </p>
                                                    {conv.unread_count > 0 && (
                                                        <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-[#005A9D] dark:bg-[#60C2E6] text-white dark:text-[#14335D] text-[10px] font-bold flex items-center justify-center tabular-nums">
                                                            {conv.unread_count}
                                                        </span>
                                                    )}
                                                </div>

                                                {hasStore && (
                                                    <span className="mt-1 inline-block text-[10px] font-semibold text-[#005A9D] dark:text-[#60C2E6]">
                                                        {isSellerRole
                                                            ? pick('Pembeli ke Toko Anda', 'Buyer to your store')
                                                            : pick('Toko Penangkar', 'Breeder store')}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        {/* Sidebar Footer Anchor */}
                        <div className="px-3.5 py-2.5 border-t border-sky-100/90 dark:border-slate-800/80 bg-[#eef9fd]/80 dark:bg-[#081224] flex items-center justify-between gap-2 text-[11px] shrink-0">
                            <span className="font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                                {pick(
                                    `${conversations.length} percakapan`,
                                    `${conversations.length} chats`,
                                )}
                            </span>
                            <Link
                                href="/products"
                                className="font-semibold text-[#005A9D] dark:text-[#60C2E6] hover:underline"
                            >
                                {pick('Cari toko lain', 'Find stores')}
                            </Link>
                        </div>
                    </aside>

                    {/* RIGHT PANE: Active Conversation Thread with Kiko Aquarium Backdrop */}
                    <section
                        ref={tankPaneRef}
                        onPointerMove={handleTankPointerMove}
                        onPointerLeave={handleTankPointerLeave}
                        onPointerDown={handleTankPointerDown}
                        className={`relative overflow-hidden flex flex-col min-h-0 bg-gradient-to-b from-[#c5f3fa] via-[#83ddf0] to-[#46bad8] dark:from-[#08172c] dark:via-[#0d284b] dark:to-[#07162a] ${
                            mobileShowThread ? 'flex' : 'hidden md:flex'
                        }`}
                    >
                        <KikoAquariumCanvas
                            pointerRef={pointerRef}
                            isTyping={inputText.trim().length > 0}
                            sendBurstKey={sendBurstKey}
                            tapEvent={tapEvent}
                            dimmed={false}
                        />

                        {!activeConversation ? (
                            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
                                <div className="rounded-2xl bg-white/85 dark:bg-[#09162b]/85 backdrop-blur-md border border-white/80 dark:border-sky-800/60 shadow-sm px-6 py-7 flex flex-col items-center space-y-3 max-w-sm">
                                    <div className="w-12 h-12 rounded-xl bg-[#eefafd] dark:bg-[#112442] border border-sky-200/80 dark:border-sky-800/60 text-[#005A9D] dark:text-[#60C2E6] flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <h2 className="text-base font-bold text-[#14335D] dark:text-white">
                                        {pick('Pilih percakapan atau mulai chat toko', 'Select a chat or message a store')}
                                    </h2>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {pick(
                                            'Semua obrolan dengan toko ikan hias dan calon pembeli tersimpan rapi di sini.',
                                            'All conversations with ornamental fish stores and buyers stay organized here.',
                                        )}
                                    </p>
                                    <Link
                                        href="/products"
                                        className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#14335D] hover:bg-[#005A9D] dark:bg-[#60C2E6] dark:hover:bg-[#49b3db] text-white dark:text-[#14335D] text-xs font-bold transition"
                                    >
                                        {pick('Cari Ikan & Toko', 'Browse Fish & Stores')}
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Thread Header (Frosted Aqua Glass) */}
                                <div className="relative z-10 px-4 py-3 bg-white/85 dark:bg-[#0c1830]/85 backdrop-blur-md border-b border-sky-200/70 dark:border-sky-900/60 flex items-center justify-between gap-3 shrink-0">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <button
                                            type="button"
                                            onClick={() => setMobileShowThread(false)}
                                            className="md:hidden h-9 w-9 rounded-lg border border-sky-200/80 dark:border-slate-700 bg-white/80 dark:bg-[#13223e] text-[#14335D] dark:text-slate-200 flex items-center justify-center shrink-0"
                                            aria-label={pick('Kembali ke daftar chat', 'Back to chat list')}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>

                                        {activeConversation.role === 'seller' ? (
                                            <UserAvatar
                                                user={activeConversation.buyer}
                                                className="w-9 h-9 text-xs shrink-0"
                                            />
                                        ) : (
                                            <StoreLogo
                                                store={activeConversation.store}
                                                className="w-9 h-9 rounded-full object-cover border border-sky-200/80 dark:border-slate-700 shrink-0"
                                                fallbackClassName="w-9 h-9 rounded-full bg-[#14335D] text-white text-xs font-bold flex items-center justify-center shrink-0"
                                            />
                                        )}

                                        <div className="min-w-0">
                                            <h2 className="text-sm font-bold text-[#14335D] dark:text-white truncate">
                                                {counterpartyTitle}
                                            </h2>
                                            {counterpartySubtitle && (
                                                <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
                                                    {counterpartySubtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {activeConversation.role === 'buyer' && activeConversation.store?.slug && (
                                        <Link
                                            href={`/stores/${activeConversation.store.slug}`}
                                            className="px-3 py-1.5 rounded-lg bg-white/90 dark:bg-[#13223e] border border-sky-200/80 dark:border-sky-800/70 text-xs font-semibold text-[#14335D] dark:text-slate-100 hover:border-[#005A9D] transition shrink-0"
                                        >
                                            {pick('Lihat Toko', 'View Store')}
                                        </Link>
                                    )}
                                </div>

                                {/* Optional Context Product Bar (when buyer came from a Product page) */}
                                {activeConversation.product && (
                                    <div className="relative z-10 px-4 py-2.5 bg-white/80 dark:bg-[#0c1830]/80 backdrop-blur-md border-b border-sky-200/60 dark:border-sky-900/50 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
                                        <Link
                                            href={`/products/${activeConversation.product.slug}`}
                                            className="flex items-center gap-2.5 min-w-0 flex-1 group"
                                        >
                                            <img
                                                src={activeConversation.product.image}
                                                alt={activeConversation.product.name}
                                                className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-[#14335D] dark:text-white truncate group-hover:text-[#005A9D] dark:group-hover:text-[#60C2E6] transition">
                                                    {activeConversation.product.name}
                                                </p>
                                                <p className="text-[11px] font-semibold text-[#005A9D] dark:text-[#60C2E6] tabular-nums">
                                                    {formatPrice(activeConversation.product.price)} ·{' '}
                                                    {pick(
                                                        `Stok ${activeConversation.product.stock}`,
                                                        `${activeConversation.product.stock} in stock`,
                                                    )}
                                                </p>
                                            </div>
                                        </Link>

                                        {activeConversation.role === 'buyer' && (
                                            <button
                                                type="button"
                                                disabled={sending}
                                                onClick={() =>
                                                    handleSend(
                                                        pick(
                                                            `Halo ${activeConversation.store?.name}, apakah ${activeConversation.product.name} masih tersedia dan siap kirim?`,
                                                            `Hi ${activeConversation.store?.name}, is ${activeConversation.product.name} currently available and ready to ship?`,
                                                        ),
                                                        true,
                                                    )
                                                }
                                                className="px-3 py-1.5 rounded-lg bg-[#005A9D] hover:bg-[#14335D] dark:bg-[#60C2E6] dark:hover:bg-[#49b3db] text-[11px] font-bold text-white dark:text-[#14335D] transition shrink-0 disabled:opacity-50"
                                            >
                                                {pick('Tanya produk ini', 'Ask about item')}
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Messages Area */}
                                <div
                                    ref={messagesContainerRef}
                                    className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-4"
                                >
                                    {loadingThread ? (
                                        <div className="h-full flex items-center justify-center">
                                            <span className="px-4 py-2 rounded-full bg-white/85 dark:bg-[#09162b]/85 backdrop-blur-sm text-xs font-semibold text-[#14335D] dark:text-slate-200 shadow-xs">
                                                {pick('Memuat pesan...', 'Loading messages...')}
                                            </span>
                                        </div>
                                    ) : groupedMessages.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center py-8">
                                            <div className="rounded-2xl bg-white/85 dark:bg-[#09162b]/85 backdrop-blur-md border border-white/80 dark:border-sky-800/60 shadow-sm px-5 py-5 space-y-1.5 max-w-xs">
                                                <p className="text-sm font-bold text-[#14335D] dark:text-white">
                                                    {pick(
                                                        `Mulai obrolan dengan ${counterpartyTitle}`,
                                                        `Start chatting with ${counterpartyTitle}`,
                                                    )}
                                                </p>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    {pick(
                                                        'Tanyakan ketersediaan stok, ukuran ikan, atau estimasi pengiriman oksigen.',
                                                        'Ask about live stock availability, fish size, or oxygenated shipping details.',
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        groupedMessages.map((group) => (
                                            <div key={group.dateKey} className="space-y-3">
                                                <div className="flex justify-center">
                                                    <span className="px-3 py-0.5 rounded-full bg-white/90 dark:bg-[#0c1830]/90 backdrop-blur-sm border border-white/80 dark:border-sky-800/60 text-[10.5px] font-bold text-[#14335D] dark:text-sky-200 shadow-2xs">
                                                        {formatDateHeading(group.dateKey, pick, isEn)}
                                                    </span>
                                                </div>

                                                {group.items.map((msg) => {
                                                    const isMine = msg.sender_id === currentUser?.id;

                                                    return (
                                                        <div
                                                            key={msg.id}
                                                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div
                                                                className={`max-w-[82%] sm:max-w-[74%] lg:max-w-[64%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                                                                    isMine
                                                                        ? 'bg-[#14335D] dark:bg-[#005A9D] text-white rounded-br-xs'
                                                                        : 'bg-white/95 dark:bg-[#0e1b33]/95 backdrop-blur-xs text-slate-800 dark:text-slate-100 border border-white/90 dark:border-sky-800/60 rounded-bl-xs'
                                                                }`}
                                                            >
                                                                {!isMine && (
                                                                    <p className="text-[10px] font-bold text-[#005A9D] dark:text-[#60C2E6] mb-1">
                                                                        {msg.sender_name}
                                                                    </p>
                                                                )}

                                                                {msg.product && (
                                                                    <Link
                                                                        href={`/products/${msg.product.slug}`}
                                                                        className={`mb-2 flex items-center gap-2 rounded-lg p-2 transition ${
                                                                            isMine
                                                                                ? 'bg-white/10 hover:bg-white/15'
                                                                                : 'bg-slate-50 dark:bg-[#0b1324] border border-slate-200/70 dark:border-slate-700'
                                                                        }`}
                                                                    >
                                                                        <img
                                                                            src={msg.product.image}
                                                                            alt={msg.product.name}
                                                                            className="w-9 h-9 rounded-md object-cover shrink-0"
                                                                        />
                                                                        <div className="min-w-0">
                                                                            <p className="text-[11px] font-bold truncate">
                                                                                {msg.product.name}
                                                                            </p>
                                                                            <p
                                                                                className={`text-[10.5px] font-semibold tabular-nums ${
                                                                                    isMine
                                                                                        ? 'text-sky-200'
                                                                                        : 'text-[#005A9D] dark:text-[#60C2E6]'
                                                                                }`}
                                                                            >
                                                                                {formatPrice(msg.product.price)}
                                                                            </p>
                                                                        </div>
                                                                    </Link>
                                                                )}

                                                                {msg.image_url && (
                                                                    <a
                                                                        href={msg.image_url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="block mb-2 overflow-hidden rounded-lg"
                                                                    >
                                                                        <img
                                                                            src={msg.image_url}
                                                                            alt={pick('Lampiran foto', 'Photo attachment')}
                                                                            className="max-h-56 w-auto rounded-lg object-cover"
                                                                        />
                                                                    </a>
                                                                )}

                                                                {msg.message && (
                                                                    <p className="whitespace-pre-wrap break-words">
                                                                        {msg.message}
                                                                    </p>
                                                                )}

                                                                <p
                                                                    className={`mt-1 text-[10px] text-right tabular-nums ${
                                                                        isMine
                                                                            ? 'text-white/70'
                                                                            : 'text-slate-400 dark:text-slate-500'
                                                                    }`}
                                                                >
                                                                    {msg.time_label}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Error Notice */}
                                {errorMessage && (
                                    <div className="relative z-10 mx-4 mb-2 px-3 py-2 rounded-lg bg-rose-50/95 dark:bg-rose-950/85 backdrop-blur-sm border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs flex items-center justify-between gap-2">
                                        <span className="flex items-center gap-1.5">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            {errorMessage}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setErrorMessage('')}
                                            aria-label={pick('Tutup pesan error', 'Dismiss error')}
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}

                                {/* Frosted Aqua Glass Composer */}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSend();
                                    }}
                                    className="relative z-10 p-3 bg-white/85 dark:bg-[#0c1830]/85 backdrop-blur-md border-t border-sky-200/70 dark:border-sky-900/60 shrink-0 space-y-2"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />

                                    {imagePreview && (
                                        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-[#13203b] border border-sky-200/80 dark:border-slate-700">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <img
                                                    src={imagePreview}
                                                    alt={pick('Pratinjau foto', 'Photo preview')}
                                                    className="w-9 h-9 rounded-md object-cover shrink-0"
                                                />
                                                <span className="text-xs text-slate-600 dark:text-slate-300 truncate">
                                                    {selectedImage?.name}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600"
                                                aria-label={pick('Hapus lampiran foto', 'Remove photo')}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex items-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="h-10 w-10 rounded-xl border border-sky-200/80 dark:border-slate-700 bg-white/95 dark:bg-[#13223e] text-[#005A9D] dark:text-[#60C2E6] hover:bg-sky-50 dark:hover:bg-[#1a2c4f] flex items-center justify-center shrink-0 transition"
                                            title={pick('Lampirkan foto', 'Attach photo')}
                                            aria-label={pick('Lampirkan foto', 'Attach photo')}
                                        >
                                            <ImagePlus className="w-4 h-4" />
                                        </button>

                                        <textarea
                                            rows={1}
                                            value={inputText}
                                            onChange={(e) => setInputText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            placeholder={pick('Tulis pesan...', 'Write a message...')}
                                            className="flex-1 min-h-[40px] max-h-28 resize-none rounded-xl border border-sky-200/80 dark:border-slate-700 bg-white/95 dark:bg-[#13223e] px-3.5 py-2.5 text-xs sm:text-[13px] text-[#14335D] dark:text-white placeholder:text-slate-400 focus:border-[#005A9D] focus:bg-white dark:focus:bg-[#152442] focus:ring-1 focus:ring-[#005A9D]"
                                        />

                                        <button
                                            type="submit"
                                            disabled={sending || (!inputText.trim() && !selectedImage)}
                                            className="h-10 px-4 rounded-xl bg-[#005A9D] hover:bg-[#14335D] dark:bg-[#60C2E6] dark:hover:bg-[#4cb4dc] text-white dark:text-[#14335D] text-xs font-bold inline-flex items-center gap-1.5 shrink-0 transition disabled:opacity-45 disabled:cursor-not-allowed shadow-xs"
                                            aria-label={pick('Kirim pesan', 'Send message')}
                                        >
                                            <Send className="w-4 h-4" />
                                            <span className="hidden sm:inline">{pick('Kirim', 'Send')}</span>
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}

import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Image as ImageIcon,
    Loader2,
    MessageSquare,
    Send,
    X,
} from 'lucide-react';
import axios from 'axios';

export default function ChatbotWidget({ isOpen, onClose }) {
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
                        message:
                            'Halo. Saya asisten Dunia Ikan. Tanyakan gejala penyakit ikan, parameter air, atau minta rekomendasi ikan yang sedang tersedia di katalog.',
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

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[620px] sm:w-[420px] sm:rounded-2xl sm:border sm:border-slate-800 sm:shadow-2xl">
            <div className="flex shrink-0 items-center justify-between bg-[#0E1719] px-5 py-4 text-white border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00C882]/10 border border-[#00C882]/30 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-[#00C882]" />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold leading-tight text-white">
                            Asisten Ikan AI
                        </h3>
                        <p className="text-[11px] text-slate-400">
                            Kesehatan ikan & rekomendasi katalog
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    aria-label="Tutup asisten"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="flex shrink-0 items-center gap-2 bg-[#142224] px-4 py-2 text-[11px] text-slate-300 border-b border-slate-800/60">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-[#00C882]" />
                <span>
                    Konsultasi awal & rekomendasi stok katalog berbasis AI.
                </span>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
                {messages.map((msg, index) => {
                    const isUser = msg.sender === 'user';

                    return (
                        <div
                            key={index}
                            className={`flex flex-col ${
                                isUser ? 'items-end' : 'items-start'
                            }`}
                        >
                            <div
                                className={`max-w-[88%] px-4 py-3 text-xs leading-relaxed ${
                                    isUser
                                        ? 'bg-[#0E1719] text-white rounded-2xl rounded-tr-xs shadow-xs'
                                        : 'bg-white text-slate-800 rounded-2xl rounded-tl-xs border border-slate-200 shadow-xs'
                                }`}
                            >
                                {msg.image_path && (
                                    <div className="mb-2 overflow-hidden">
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
                                        <div className="mt-3 space-y-2">
                                            <p className="flex items-center gap-1.5 text-[13px] font-medium">
                                                <BookOpen className="h-3.5 w-3.5" />
                                                Rujukan panduan
                                            </p>
                                            {msg.fish_guides.map((guide) => (
                                                <Link
                                                    key={guide.id}
                                                    href={`/guides/${guide.id}`}
                                                    className="block border-l-4 border-accent bg-bone px-3 py-2 text-[14px] hover:bg-field3/30"
                                                >
                                                    {guide.title}
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                {msg.recommended_products &&
                                    msg.recommended_products.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            <p className="text-[13px] font-medium">
                                                Tersedia di katalog
                                            </p>
                                            {msg.recommended_products.map(
                                                (prod) => (
                                                    <Link
                                                        key={prod.id}
                                                        href={`/products/${prod.slug}`}
                                                        className="flex items-center gap-3 bg-bone p-2 hover:bg-field3/30"
                                                    >
                                                        <img
                                                            src={prod.image}
                                                            alt={prod.name}
                                                            className="h-12 w-12 shrink-0 object-cover"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-[14px] font-medium">
                                                                {prod.name}
                                                            </p>
                                                            <p className="text-[14px] tabular-nums">
                                                                Rp{' '}
                                                                {new Intl.NumberFormat(
                                                                    'id-ID',
                                                                ).format(
                                                                    prod.price,
                                                                )}
                                                            </p>
                                                            <p className="truncate text-[13px] text-muted">
                                                                {
                                                                    prod.store_name
                                                                }{' '}
                                                                · Stok{' '}
                                                                {prod.stock}
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
                    <div className="flex w-fit items-center gap-2 bg-surface px-4 py-3 text-[14px] text-muted">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Memeriksa gejala dan stok katalog...
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-slate-200 bg-white px-3 py-2 text-xs">
                <button
                    type="button"
                    onClick={() =>
                        handleSendMessage(
                            'Ikan cupang saya ada bintik putih di sirip, bagaimana penanganannya?',
                        )
                    }
                    className="whitespace-nowrap rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#00C882] px-3 py-1 text-[11px] font-medium border border-slate-200/60 transition"
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
                    className="whitespace-nowrap rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#00C882] px-3 py-1 text-[11px] font-medium border border-slate-200/60 transition"
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
                    className="whitespace-nowrap rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#00C882] px-3 py-1 text-[11px] font-medium border border-slate-200/60 transition"
                >
                    Ikan untuk pemula
                </button>
            </div>

            {imagePreview && (
                <div className="flex shrink-0 items-center justify-between bg-slate-100 px-4 py-2 border-t border-slate-200">
                    <div className="flex min-w-0 items-center gap-2">
                        <img
                            src={imagePreview}
                            alt="Pratinjau"
                            className="h-9 w-9 object-cover rounded-md"
                        />
                        <span className="truncate text-xs text-slate-600">
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

            <div className="shrink-0 bg-white border-t border-slate-200 p-3">
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
                        className="p-2 text-slate-400 hover:text-[#00C882] rounded-lg hover:bg-slate-100 transition"
                        title="Unggah foto kondisi ikan"
                    >
                        <ImageIcon className="h-5 w-5" />
                    </button>

                    <input
                        type="text"
                        placeholder="Tanya kesehatan atau rekomendasi ikan..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#00C882] focus:bg-white transition"
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
    );
}

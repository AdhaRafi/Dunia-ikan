import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { 
    MessageSquare, 
    X, 
    Send, 
    Image, 
    Sparkles, 
    AlertCircle, 
    HeartPulse, 
    Fish, 
    CheckCircle2, 
    BookOpen,
    Loader2
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

    // Initial greeting if no history
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
                params: { session_token: token }
            });
            if (res.data.session_token) {
                setSessionToken(res.data.session_token);
                localStorage.setItem('dunia_ikan_chat_token', res.data.session_token);
            }
            if (res.data.messages && res.data.messages.length > 0) {
                setMessages(res.data.messages);
            } else {
                setMessages([
                    {
                        sender: 'assistant',
                        message: 'Halo! Saya Asisten Virtual Dunia Ikan. Saya siap membantu konsultasi awal kesehatan ikan Anda (seperti gejala bintik putih/fin rot) dan memberikan rekomendasi ikan hias aktif langsung dari basis data katalog kami. Ada yang bisa saya bantu hari ini?',
                        created_at: new Date().toISOString()
                    }
                ]);
            }
        } catch (err) {
            console.error('Failed to load chat history:', err);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                alert('Ukuran gambar maksimal 3MB');
                return;
            }
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSendMessage = async (textToSend = null) => {
        const message = textToSend || inputText;
        if ((!message || !message.trim()) && !selectedImage) return;

        const currentText = message.trim();
        const currentImgPreview = imagePreview;

        // Optimistic UI for user message
        const optimisticUserMessage = {
            sender: 'user',
            message: currentText,
            image_path: currentImgPreview,
            created_at: new Date().toISOString()
        };

        setMessages((prev) => [...prev, optimisticUserMessage]);
        setInputText('');
        removeImage();
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

            const response = await axios.post('/chatbot/message', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.session_token) {
                setSessionToken(response.data.session_token);
                localStorage.setItem('dunia_ikan_chat_token', response.data.session_token);
            }

            const assistantMsg = response.data.assistant_message;
            setMessages((prev) => [...prev, assistantMsg]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'assistant',
                    message: 'Maaf, terjadi kesalahan saat menghubungi layanan. Silakan coba kembali atau cek koneksi internet Anda.',
                    created_at: new Date().toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickPrompt = (prompt) => {
        handleSendMessage(prompt);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[440px] sm:h-[620px] bg-white sm:rounded-2xl shadow-2xl border border-sky-100 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-dunia-navy to-dunia-marine text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-dunia-aqua">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-base flex items-center gap-2">
                            Asisten Dunia Ikan
                            <span className="text-[10px] bg-dunia-aqua/20 text-dunia-aqua px-2 py-0.5 rounded-full font-semibold border border-dunia-aqua/30">
                                AI + DB
                            </span>
                        </h3>
                        <p className="text-xs text-sky-200">Konsultasi Kesehatan & Rekomendasi Ikan</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg text-sky-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Privacy Disclaimer Banner */}
            <div className="bg-amber-50 border-b border-amber-200/60 px-4 py-1.5 text-[11px] text-amber-900 flex items-center gap-1.5 shrink-0">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Konsultasi awal non-medis. Foto & teks dapat diproses model Gemini AI.</span>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dunia-soft/30">
                {messages.map((msg, index) => {
                    const isUser = msg.sender === 'user';
                    return (
                        <div
                            key={index}
                            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                        >
                            <div
                                className={`max-w-[88%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                                    isUser
                                        ? 'bg-dunia-blue text-white rounded-br-xs'
                                        : 'bg-white border border-sky-100 text-slate-800 shadow-xs rounded-bl-xs'
                                }`}
                            >
                                {msg.image_path && (
                                    <div className="mb-2 rounded-lg overflow-hidden border border-black/10">
                                        <img
                                            src={msg.image_path.startsWith('blob:') ? msg.image_path : `/storage/${msg.image_path}`}
                                            alt="Unggahan user"
                                            className="max-h-48 w-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="whitespace-pre-wrap">{msg.message}</div>

                                {/* Attached Guides (Relasi Pesan-Panduan) */}
                                {msg.fish_guides && msg.fish_guides.length > 0 && (
                                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5">
                                        <p className="text-[11px] font-bold text-dunia-navy flex items-center gap-1">
                                            <BookOpen className="w-3 h-3 text-dunia-marine" />
                                            Rujukan Panduan Resmi Database:
                                        </p>
                                        {msg.fish_guides.map((guide) => (
                                            <Link
                                                key={guide.id}
                                                href={`/guides/${guide.id}`}
                                                className="block p-2 rounded-lg bg-sky-50/80 hover:bg-sky-100 text-xs text-dunia-navy font-medium border border-sky-100 transition"
                                            >
                                                📄 {guide.title} ({guide.fish_type})
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {/* Attached Product Recommendations from DB */}
                                {msg.recommended_products && msg.recommended_products.length > 0 && (
                                    <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                                        <p className="text-[11px] font-bold text-dunia-navy flex items-center gap-1">
                                            <Fish className="w-3 h-3 text-dunia-blue" />
                                            Rekomendasi Ikan Tersedia di Katalog:
                                        </p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {msg.recommended_products.map((prod) => (
                                                <Link
                                                    key={prod.id}
                                                    href={`/products/${prod.slug}`}
                                                    className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-sky-200 hover:border-dunia-blue transition shadow-xs group"
                                                >
                                                    <img
                                                        src={prod.image || 'https://images.unsplash.com/photo-1544943910-4c1dc44a0b27?auto=format&fit=crop&w=200&q=80'}
                                                        alt={prod.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0 text-left">
                                                        <p className="text-xs font-bold text-slate-900 group-hover:text-dunia-blue truncate">
                                                            {prod.name}
                                                        </p>
                                                        <p className="text-xs font-extrabold text-dunia-blue">
                                                            Rp {new Intl.NumberFormat('id-ID').format(prod.price)}
                                                        </p>
                                                        <p className="text-[10px] text-slate-500 truncate">
                                                            {prod.store_name} • Stok {prod.stock}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {loading && (
                    <div className="flex items-center gap-2 text-slate-500 text-xs bg-white p-3 rounded-xl border border-sky-100 w-fit">
                        <Loader2 className="w-4 h-4 animate-spin text-dunia-blue" />
                        <span>Asisten sedang menganalisis gejala & mengecek stok database...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-xs">
                <button
                    onClick={() => handleQuickPrompt('Ikan cupang saya ada bintik putih di sirip, bagaimana penanganannya?')}
                    className="px-2.5 py-1 rounded-full bg-sky-50 text-dunia-navy hover:bg-sky-100 whitespace-nowrap transition cursor-pointer font-medium border border-sky-100"
                >
                    ⚪ Bintik Putih (Ich)
                </button>
                <button
                    onClick={() => handleQuickPrompt('Ekor ikan saya robek dan membusuk (fin rot), apa yang harus dilakukan?')}
                    className="px-2.5 py-1 rounded-full bg-sky-50 text-dunia-navy hover:bg-sky-100 whitespace-nowrap transition cursor-pointer font-medium border border-sky-100"
                >
                    🩹 Busuk Sirip (Fin Rot)
                </button>
                <button
                    onClick={() => handleQuickPrompt('Rekomendasi ikan hias air tawar yang mudah dipelihara untuk pemula.')}
                    className="px-2.5 py-1 rounded-full bg-sky-50 text-dunia-navy hover:bg-sky-100 whitespace-nowrap transition cursor-pointer font-medium border border-sky-100"
                >
                    🐠 Ikan Ramah Pemula
                </button>
            </div>

            {/* Image Preview if selected */}
            {imagePreview && (
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <img src={imagePreview} alt="Preview" className="w-10 h-10 object-cover rounded-md border" />
                        <span className="text-xs text-slate-600 truncate max-w-[200px]">
                            {selectedImage?.name}
                        </span>
                    </div>
                    <button onClick={removeImage} className="text-slate-400 hover:text-rose-500">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Input Form */}
            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
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
                        className="p-2.5 rounded-xl text-slate-500 hover:text-dunia-blue hover:bg-sky-50 transition cursor-pointer"
                        title="Unggah Foto Kondisi Ikan"
                    >
                        <Image className="w-5 h-5" />
                    </button>

                    <input
                        type="text"
                        placeholder="Tanya kesehatan atau rekomendasi ikan..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:border-dunia-aqua focus:ring-2 focus:ring-dunia-aqua/20"
                    />

                    <button
                        type="submit"
                        disabled={loading || (!inputText.trim() && !selectedImage)}
                        className="p-2.5 rounded-xl bg-dunia-blue text-white hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer shadow-xs"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

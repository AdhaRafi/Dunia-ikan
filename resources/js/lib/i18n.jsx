import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'dunia_ikan_locale';

const CATEGORY_MAP_EN = {
    'Ikan Hias': 'Ornamental Fish',
    'Perlengkapan Aquarium': 'Aquarium Gear',
    'Tanaman Aquascape': 'Aquascape Plants',
    'Pakan Ikan': 'Fish Food',
    'Perawatan Ikan': 'Fish Care',
    'Aksesoris Aquarium': 'Aquarium Accessories',
    'Dekorasi Aquarium': 'Aquarium Decor',
    'Aquarium & Tangki': 'Aquariums & Tanks',
};

const GUIDE_CATEGORY_MAP_EN = {
    'Penyakit Parasit': 'Parasite Diseases',
    'Infeksi Bakteri / Jamur': 'Bacterial / Fungal',
    'Gangguan Pencernaan & Organ': 'Digestive & Organ',
    'Kualitas Air & Filter': 'Water Quality & Filter',
    'Air Laut & Salinitas': 'Saltwater & Salinity',
    'Air Payau & Estuari': 'Brackish & Estuary',
    'Ikan Predator & Tank Besar': 'Predator & Large Tanks',
    'Panduan Pemula': 'Beginner Guides',
    'Perawatan Harian': 'Daily Care',
};

const ORDER_STATUS_LABELS = {
    pending_payment: { id: 'Menunggu Pembayaran', en: 'Awaiting Payment' },
    awaiting_confirmation: { id: 'Menunggu Verifikasi', en: 'Pending Verification' },
    processing: { id: 'Sedang Diproses', en: 'Processing' },
    shipped: { id: 'Dalam Pengiriman', en: 'Shipped' },
    delivered: { id: 'Pesanan Selesai', en: 'Delivered' },
    completed: { id: 'Pesanan Selesai', en: 'Completed' },
    cancelled: { id: 'Dibatalkan', en: 'Cancelled' },
};

const LanguageContext = createContext(null);

function readInitialLocale() {
    if (typeof window === 'undefined') {
        return 'id';
    }
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored === 'en' ? 'en' : 'id';
    } catch {
        return 'id';
    }
}

export function LanguageProvider({ children }) {
    const [locale, setLocaleState] = useState(readInitialLocale);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;
        }
        try {
            window.localStorage.setItem(STORAGE_KEY, locale);
        } catch {
            // Ignore storage quota or private browsing errors.
        }
    }, [locale]);

    const setLocale = useCallback((nextLocale) => {
        setLocaleState(nextLocale === 'en' ? 'en' : 'id');
    }, []);

    const toggleLocale = useCallback(() => {
        setLocaleState((prev) => (prev === 'en' ? 'id' : 'en'));
    }, []);

    const pick = useCallback((idText, enText) => {
        return locale === 'en' ? enText : idText;
    }, [locale]);

    const trCategory = useCallback((name) => {
        if (!name || locale !== 'en') {
            return name;
        }
        return CATEGORY_MAP_EN[name] ?? name;
    }, [locale]);

    const trGuideCategory = useCallback((category) => {
        if (!category || locale !== 'en') {
            return category;
        }
        return GUIDE_CATEGORY_MAP_EN[category] ?? category;
    }, [locale]);

    const trOrderStatus = useCallback((status) => {
        const entry = ORDER_STATUS_LABELS[status];
        if (!entry) {
            return status;
        }
        return locale === 'en' ? entry.en : entry.id;
    }, [locale]);

    const value = useMemo(
        () => ({
            locale,
            isEn: locale === 'en',
            setLocale,
            toggleLocale,
            pick,
            trCategory,
            trGuideCategory,
            trOrderStatus,
        }),
        [locale, setLocale, toggleLocale, pick, trCategory, trGuideCategory, trOrderStatus],
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

const FALLBACK_CONTEXT = {
    locale: 'id',
    isEn: false,
    setLocale: () => {},
    toggleLocale: () => {},
    pick: (idText) => idText,
    trCategory: (name) => name,
    trGuideCategory: (category) => category,
    trOrderStatus: (status) => ORDER_STATUS_LABELS[status]?.id ?? status,
};

export function useLanguage() {
    return useContext(LanguageContext) ?? FALLBACK_CONTEXT;
}

export function LanguageSwitcher({ variant = 'default', className = '' }) {
    const { locale, setLocale } = useLanguage();

    if (variant === 'overlay') {
        return (
            <div
                role="group"
                aria-label="Language switcher"
                className={`inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/15 p-0.5 ${className}`}
            >
                {['id', 'en'].map((code) => {
                    const active = locale === code;
                    return (
                        <button
                            key={code}
                            type="button"
                            onClick={() => setLocale(code)}
                            aria-pressed={active}
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase transition-all ${
                                active
                                    ? 'bg-white text-slate-900 shadow-xs'
                                    : 'text-white/80 hover:text-white'
                            }`}
                        >
                            {code}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div
            role="group"
            aria-label="Language switcher"
            className={`inline-flex items-center rounded-full border border-slate-200 dark:border-neutral-700 bg-slate-100/90 dark:bg-neutral-800/90 p-0.5 shrink-0 ${className}`}
        >
            {['id', 'en'].map((code) => {
                const active = locale === code;
                return (
                    <button
                        key={code}
                        type="button"
                        onClick={() => setLocale(code)}
                        aria-pressed={active}
                        title={code === 'id' ? 'Bahasa Indonesia' : 'English'}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase transition-all ${
                            active
                                ? 'bg-white dark:bg-neutral-900 text-[#0B3D91] dark:text-[#60C2E6] shadow-xs'
                                : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        {code}
                    </button>
                );
            })}
        </div>
    );
}

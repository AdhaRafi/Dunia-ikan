import { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function FavoriteButton({
    productId,
    className = '',
    iconClassName = 'w-4 h-4',
}) {
    const { props } = usePage();
    const favoriteIds = props?.favoriteIds ?? [];
    const serverFavorited = favoriteIds.includes(productId);
    const [isFavorited, setIsFavorited] = useState(serverFavorited);
    const [pending, setPending] = useState(false);
    const { pick } = useLanguage();

    useEffect(() => {
        setIsFavorited(serverFavorited);
    }, [serverFavorited]);

    useEffect(() => {
        const onToggled = (event) => {
            if (event?.detail?.productId === productId) {
                setIsFavorited(Boolean(event.detail.favorited));
            }
        };
        window.addEventListener('dunia-ikan:favorite-toggled', onToggled);
        return () => window.removeEventListener('dunia-ikan:favorite-toggled', onToggled);
    }, [productId]);

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (pending || !productId) {
            return;
        }

        const previous = isFavorited;
        setPending(true);
        setIsFavorited(!previous);

        try {
            const { data } = await window.axios.post('/favorites/toggle', {
                product_id: productId,
            });
            const nextState = Boolean(data?.favorited);
            setIsFavorited(nextState);
            window.dispatchEvent(
                new CustomEvent('dunia-ikan:favorite-toggled', {
                    detail: { productId, favorited: nextState },
                }),
            );
        } catch (err) {
            setIsFavorited(previous);
            if (err?.response?.status === 401) {
                router.visit('/login');
            }
        } finally {
            setPending(false);
        }
    };

    const label = isFavorited
        ? pick('Hapus dari favorit', 'Remove from favorites')
        : pick('Simpan ke favorit', 'Save to favorites');

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={pending}
            aria-pressed={isFavorited}
            aria-label={label}
            title={label}
            className={className}
        >
            <Heart
                className={`${iconClassName} transition-all duration-200 ${
                    isFavorited
                        ? 'fill-rose-500 text-rose-500 scale-105'
                        : 'text-slate-600 dark:text-slate-200 hover:text-rose-500 dark:hover:text-rose-400'
                }`}
            />
        </button>
    );
}

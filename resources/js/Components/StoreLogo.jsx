import { useEffect, useState } from 'react';

/**
 * Renders a store logo image with graceful fallback to a typographic initial badge
 * when no logo is set or an ephemeral upload URL is unavailable.
 */
export default function StoreLogo({
    store,
    className = 'w-full h-full object-cover',
    fallbackClassName = 'w-full h-full bg-slate-50 dark:bg-[#162240] flex items-center justify-center font-extrabold text-3xl text-[#001454] dark:text-white',
    loading = 'lazy',
}) {
    const src = store?.logo_url;
    const initial = store?.name?.charAt(0)?.toUpperCase() || 'T';
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        setFailed(false);
    }, [src]);

    if (src && !failed) {
        return (
            <img
                src={src}
                alt={store?.name || 'Toko'}
                loading={loading}
                decoding="async"
                onError={() => setFailed(true)}
                className={className}
            />
        );
    }

    return <div className={fallbackClassName}>{initial}</div>;
}

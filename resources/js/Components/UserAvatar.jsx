export default function UserAvatar({ user, previewUrl = null, className = 'w-8 h-8 text-xs' }) {
    const src = previewUrl || user?.avatar_url;
    const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

    if (src) {
        return (
            <img
                src={src}
                alt={user?.name || 'Profil'}
                className={`rounded-full object-cover shrink-0 bg-slate-100 dark:bg-slate-800 ${className}`}
            />
        );
    }

    return (
        <div
            className={`rounded-full bg-[#001454] dark:bg-[#0D2E92] text-white font-bold flex items-center justify-center shrink-0 ${className}`}
        >
            {initial}
        </div>
    );
}

export default function BrandWordmark({
    className = 'h-8',
    variant = 'auto', // 'auto', 'default', 'white', 'adaptive'
    isDarkSurface = false,
    alt = 'Dunia Ikan Aquatic',
}) {
    if (variant === 'adaptive') {
        return (
            <span className="relative inline-flex items-center">
                <img
                    src="/images/brand/logo-dunia-ikan.webp?v=4"
                    alt={alt}
                    width={86}
                    height={40}
                    decoding="async"
                    className={`w-auto object-contain select-none transition-opacity duration-300 ${className} ${
                        isDarkSurface ? 'opacity-0' : 'opacity-100'
                    }`}
                />
                <img
                    src="/images/brand/logo-dunia-ikan-white.webp?v=4"
                    alt=""
                    aria-hidden="true"
                    width={86}
                    height={40}
                    decoding="async"
                    className={`absolute inset-0 w-auto object-contain select-none transition-opacity duration-300 ${className} ${
                        isDarkSurface ? 'opacity-100' : 'opacity-0'
                    }`}
                />
            </span>
        );
    }

    if (variant === 'white') {
        return (
            <img
                src="/images/brand/logo-dunia-ikan-white.webp?v=4"
                alt={alt}
                width={86}
                height={40}
                decoding="async"
                className={`w-auto object-contain select-none ${className}`}
            />
        );
    }

    if (variant === 'default') {
        return (
            <img
                src="/images/brand/logo-dunia-ikan.webp?v=4"
                alt={alt}
                width={86}
                height={40}
                decoding="async"
                className={`w-auto object-contain select-none ${className}`}
            />
        );
    }

    // auto mode: adapts to light/dark class
    return (
        <>
            <img
                src="/images/brand/logo-dunia-ikan.webp?v=4"
                alt={alt}
                width={86}
                height={40}
                decoding="async"
                className={`w-auto object-contain select-none dark:hidden ${className}`}
            />
            <img
                src="/images/brand/logo-dunia-ikan-white.webp?v=4"
                alt={alt}
                width={86}
                height={40}
                decoding="async"
                className={`w-auto object-contain select-none hidden dark:block ${className}`}
            />
        </>
    );
}

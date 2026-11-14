export default function BrandLogo({ 
    className = "w-5 h-5",
    variant = "auto"
}) {
    if (variant === 'white' || className.includes('text-white')) {
        return (
            <img 
                src="/images/logo-fish-mark-white.png" 
                alt="Dunia Ikan Fish Mark" 
                className={`object-contain select-none shrink-0 ${className}`} 
            />
        );
    }

    if (variant === 'default') {
        return (
            <img 
                src="/images/logo-fish-mark.png" 
                alt="Dunia Ikan Fish Mark" 
                className={`object-contain select-none shrink-0 ${className}`} 
            />
        );
    }

    // auto mode: adapts to light/dark
    return (
        <>
            <img 
                src="/images/logo-fish-mark.png" 
                alt="Dunia Ikan Fish Mark" 
                className={`object-contain select-none shrink-0 dark:hidden ${className}`} 
            />
            <img 
                src="/images/logo-fish-mark-white.png" 
                alt="Dunia Ikan Fish Mark" 
                className={`object-contain select-none shrink-0 hidden dark:block ${className}`} 
            />
        </>
    );
}

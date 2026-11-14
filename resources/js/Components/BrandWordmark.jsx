export default function BrandWordmark({ 
    className = "h-8", 
    variant = "auto", // 'auto', 'default', 'white'
    alt = "Dunia Ikan Aquatic" 
}) {
    if (variant === 'white') {
        return (
            <img 
                src="/images/brand/logo-dunia-ikan-white.png" 
                alt={alt} 
                className={`w-auto object-contain select-none ${className}`} 
            />
        );
    }

    if (variant === 'default') {
        return (
            <img 
                src="/images/brand/logo-dunia-ikan.png" 
                alt={alt} 
                className={`w-auto object-contain select-none ${className}`} 
            />
        );
    }

    // auto mode: adapts to light/dark class
    return (
        <>
            <img 
                src="/images/brand/logo-dunia-ikan.png" 
                alt={alt} 
                className={`w-auto object-contain select-none dark:hidden ${className}`} 
            />
            <img 
                src="/images/brand/logo-dunia-ikan-white.png" 
                alt={alt} 
                className={`w-auto object-contain select-none hidden dark:block ${className}`} 
            />
        </>
    );
}

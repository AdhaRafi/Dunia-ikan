export default function BrandWordmark({ 
    className = "h-8", 
    variant = "default", // 'default' or 'white'
    alt = "Dunia Ikan Aquatic" 
}) {
    const isWhite = variant === 'white';
    const src = isWhite ? '/images/logo-dunia-ikan-white.png' : '/images/logo-dunia-ikan.png';

    return (
        <img 
            src={src} 
            alt={alt} 
            className={`w-auto object-contain select-none ${className}`} 
        />
    );
}

export default function BrandLogo({ 
    className = "w-5 h-5",
    variant = "default"
}) {
    const isWhite = variant === 'white' || className.includes('text-white');
    const src = isWhite ? '/images/logo-fish-mark-white.png' : '/images/logo-fish-mark.png';

    return (
        <img 
            src={src} 
            alt="Dunia Ikan Fish Mark" 
            className={`object-contain select-none shrink-0 ${className}`} 
        />
    );
}

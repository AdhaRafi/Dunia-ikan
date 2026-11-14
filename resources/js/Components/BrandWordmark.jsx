export default function BrandWordmark({ 
    className = "h-8", 
    variant = "default", // 'default', 'white', or 'monochrome'
    showTagline = true 
}) {
    const isWhite = variant === 'white';
    const isMonochrome = variant === 'monochrome';

    const mainColor = isMonochrome ? 'currentColor' : (isWhite ? '#ffffff' : '#001454');
    const accentColor = isMonochrome ? 'currentColor' : (isWhite ? '#4AB8BD' : '#0684E5');

    return (
        <div className={`inline-flex items-center select-none ${className}`}>
            <svg 
                viewBox="0 0 156 40" 
                className="h-full w-auto overflow-visible" 
                fill="none"
                aria-label="Dunia Ikan"
            >
                {/* 1. Custom Fish D Glyph (Streamlined aquatic fish forming letter 'D') */}
                <g transform="translate(2, 4)">
                    {/* Fish caudal tail fin flaring to the left */}
                    <path 
                        d="M1 28 C-1 26, -1 31, 2 32 C5 33, 7 30, 8 27" 
                        fill="none" 
                        stroke={accentColor} 
                        strokeWidth="3.6" 
                        strokeLinecap="round"
                    />
                    <path 
                        d="M1 28 C-1 29, -1 24, 2 22 C5 20, 7 24, 8 27" 
                        fill="none" 
                        stroke={accentColor} 
                        strokeWidth="3.6" 
                        strokeLinecap="round"
                    />
                    {/* Main D body: straight spine up, smooth arch forming head & body */}
                    <path 
                        d="M8 27 L8 9 C8 4, 13 2, 19 2 C28 2, 33 7, 33 16 C33 25, 28 30, 19 30 L8 30" 
                        fill="none" 
                        stroke={mainColor} 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    />
                    {/* Dorsal fin crest */}
                    <path 
                        d="M16 2 C19 -1.5, 23 -0.5, 24 2" 
                        fill="none" 
                        stroke={accentColor} 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                    />
                    {/* Fish eye */}
                    <circle cx="24" cy="16" r="2.1" fill={accentColor} />
                </g>

                {/* 2. Bold Brand Typography: 'unia' */}
                <text 
                    x="44" 
                    y="24" 
                    fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" 
                    fontSize="25" 
                    fontWeight="800" 
                    fill={mainColor} 
                    letterSpacing="-0.8"
                >
                    unia
                </text>

                {/* 3. Sub-title: 'IKAN' (MorphMarket-style tracked uppercase) */}
                {showTagline && (
                    <text 
                        x="46" 
                        y="34" 
                        fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" 
                        fontSize="8.5" 
                        fontWeight="800" 
                        fill={accentColor} 
                        letterSpacing="4"
                    >
                        IKAN
                    </text>
                )}
            </svg>
        </div>
    );
}

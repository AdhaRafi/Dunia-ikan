export default function BrandLogo({ className = "w-5 h-5", strokeWidth = 2.8 }) {
    return (
        <svg 
            viewBox="0 0 36 36" 
            className={className} 
            fill="none" 
            stroke="currentColor" 
            aria-hidden="true"
        >
            {/* Aquatic fish tail flaring on the left */}
            <path 
                d="M3 28 C0.5 26, 0.5 31, 3.5 32 C6.5 33, 8.5 30, 9.5 27" 
                strokeWidth={strokeWidth} 
                strokeLinecap="round" 
            />
            <path 
                d="M3 28 C0.5 29, 0.5 24, 3.5 22 C6.5 20, 8.5 24, 9.5 27" 
                strokeWidth={strokeWidth} 
                strokeLinecap="round" 
            />
            {/* Streamlined fish body forming the letter 'D' */}
            <path 
                d="M9.5 27 L9.5 9 C9.5 4, 14.5 2, 20.5 2 C29.5 2, 34.5 7, 34.5 16 C34.5 25, 29.5 30, 20.5 30 L9.5 30" 
                strokeWidth={strokeWidth} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            {/* Dorsal fin crest */}
            <path 
                d="M17.5 2 C20.5 -1.5, 24.5 -0.5, 25.5 2" 
                strokeWidth={strokeWidth * 0.75} 
                strokeLinecap="round" 
            />
            {/* Eye of the fish */}
            <circle cx="25" cy="16" r="2.1" fill="currentColor" stroke="none" />
        </svg>
    );
}

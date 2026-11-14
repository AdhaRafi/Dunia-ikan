export default function BrandLogo({ className = "w-5 h-5" }) {
    return (
        <svg 
            viewBox="0 0 24 24" 
            className={className} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {/* Streamlined aquatic show fish silhouette */}
            <path d="M6.5 12c.5-3.5 3-6.5 7.5-6.5 4 0 7 3 8 6.5-1 3.5-4 6.5-8 6.5-4.5 0-7-3-7.5-6.5Z" />
            <path d="M2 7l4.5 5L2 17V7Z" fill="currentColor" fillOpacity="0.25" />
            <path d="M12 5.5c-.5-1.5-1.5-2.5-3-2.5" />
            <path d="M12 18.5c-.5 1.5-1.5 2.5-3 2.5" />
            <circle cx="17.5" cy="11.5" r="1.2" fill="currentColor" />
        </svg>
    );
}

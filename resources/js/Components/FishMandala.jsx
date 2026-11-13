export default function FishMandala({ className = "w-full h-auto text-emerald-500/80" }) {
    return (
        <svg
            viewBox="0 0 600 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="mandalaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00C882" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#10B981" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
                </linearGradient>
            </defs>

            {/* Fish Outer Silhouette & Flowing Fins */}
            <path
                d="M 380 250 C 440 220, 500 180, 560 120 C 530 200, 550 280, 580 340 C 500 320, 440 290, 380 270 Z"
                stroke="url(#mandalaGrad)"
                strokeWidth="1.5"
                fill="none"
                opacity="0.85"
            />
            {/* Upper Caudal / Dorsal Fin Rays */}
            <path d="M 380 240 C 420 180, 480 120, 540 80" stroke="url(#mandalaGrad)" strokeWidth="1" strokeDasharray="3 3" />
            <path d="M 390 230 C 440 160, 500 100, 550 100" stroke="url(#mandalaGrad)" strokeWidth="1.2" />
            <path d="M 400 245 C 460 190, 520 140, 560 135" stroke="url(#mandalaGrad)" strokeWidth="1" />
            <path d="M 405 260 C 480 230, 530 200, 570 210" stroke="url(#mandalaGrad)" strokeWidth="1" strokeDasharray="4 2" />
            <path d="M 400 270 C 470 270, 520 270, 575 285" stroke="url(#mandalaGrad)" strokeWidth="1.2" />
            <path d="M 390 280 C 460 310, 510 330, 565 350" stroke="url(#mandalaGrad)" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 375 285 C 430 340, 480 380, 540 410" stroke="url(#mandalaGrad)" strokeWidth="1.2" />

            {/* Fish Main Body Curves */}
            <path
                d="M 120 260 C 140 200, 220 170, 310 180 C 370 185, 410 220, 410 260 C 410 300, 370 330, 310 335 C 220 340, 140 315, 120 260 Z"
                stroke="url(#mandalaGrad)"
                strokeWidth="2"
                fill="none"
            />

            {/* Head & Snout */}
            <path
                d="M 120 260 C 90 255, 60 250, 40 260 C 55 275, 80 280, 120 275"
                stroke="url(#mandalaGrad)"
                strokeWidth="1.5"
            />
            {/* Eye with Mandala Rings */}
            <circle cx="110" cy="245" r="14" stroke="url(#mandalaGrad)" strokeWidth="1.5" />
            <circle cx="110" cy="245" r="8" stroke="url(#mandalaGrad)" strokeWidth="1" />
            <circle cx="110" cy="245" r="4" fill="#00C882" opacity="0.9" />

            {/* Operculum (Gill Cover) Filigree */}
            <path d="M 170 200 C 195 230, 195 290, 170 320" stroke="url(#mandalaGrad)" strokeWidth="1.5" />
            <path d="M 185 210 C 205 235, 205 285, 185 310" stroke="url(#mandalaGrad)" strokeWidth="1" strokeDasharray="3 2" />

            {/* Mandala Geometric Scales Pattern (Intricate Filigree inside Body) */}
            {/* Row 1 Scales */}
            <path d="M 210 215 C 225 200, 245 200, 260 215 C 245 230, 225 230, 210 215 Z" stroke="url(#mandalaGrad)" strokeWidth="1" />
            <path d="M 255 215 C 270 200, 290 200, 305 215 C 290 230, 270 230, 255 215 Z" stroke="url(#mandalaGrad)" strokeWidth="1" />
            <path d="M 300 215 C 315 200, 335 200, 350 215 C 335 230, 315 230, 300 215 Z" stroke="url(#mandalaGrad)" strokeWidth="1" />

            {/* Row 2 Scales */}
            <path d="M 190 245 C 205 230, 230 230, 245 245 C 230 260, 205 260, 190 245 Z" stroke="url(#mandalaGrad)" strokeWidth="1.2" />
            <circle cx="218" cy="245" r="3" fill="#00C882" opacity="0.6" />
            <path d="M 235 245 C 250 230, 275 230, 290 245 C 275 260, 250 260, 235 245 Z" stroke="url(#mandalaGrad)" strokeWidth="1.2" />
            <circle cx="263" cy="245" r="3" fill="#00C882" opacity="0.6" />
            <path d="M 280 245 C 295 230, 320 230, 335 245 C 320 260, 295 260, 280 245 Z" stroke="url(#mandalaGrad)" strokeWidth="1.2" />
            <circle cx="308" cy="245" r="3" fill="#00C882" opacity="0.6" />
            <path d="M 325 245 C 340 230, 365 230, 380 245 C 365 260, 340 260, 325 245 Z" stroke="url(#mandalaGrad)" strokeWidth="1.2" />

            {/* Row 3 Scales */}
            <path d="M 210 275 C 225 260, 245 260, 260 275 C 245 290, 225 290, 210 275 Z" stroke="url(#mandalaGrad)" strokeWidth="1" />
            <path d="M 255 275 C 270 260, 290 260, 305 275 C 290 290, 270 290, 255 275 Z" stroke="url(#mandalaGrad)" strokeWidth="1" />
            <path d="M 300 275 C 315 260, 335 260, 350 275 C 335 290, 315 290, 300 275 Z" stroke="url(#mandalaGrad)" strokeWidth="1" />

            {/* Row 4 Scales (Lower) */}
            <path d="M 235 305 C 250 290, 275 290, 290 305 C 275 320, 250 320, 235 305 Z" stroke="url(#mandalaGrad)" strokeWidth="1" strokeDasharray="3 1" />
            <path d="M 280 305 C 295 290, 320 290, 335 305 C 320 320, 295 320, 280 305 Z" stroke="url(#mandalaGrad)" strokeWidth="1" strokeDasharray="3 1" />

            {/* Dorsal Crest Mandala Crown */}
            <path d="M 220 178 C 240 120, 280 110, 300 178" stroke="url(#mandalaGrad)" strokeWidth="1.2" />
            <circle cx="260" cy="135" r="5" stroke="url(#mandalaGrad)" strokeWidth="1" />
            <path d="M 280 179 C 300 130, 340 120, 360 181" stroke="url(#mandalaGrad)" strokeWidth="1.2" />
            <circle cx="320" cy="140" r="4" stroke="url(#mandalaGrad)" strokeWidth="1" />

            {/* Pectoral Fin Filigree */}
            <path
                d="M 180 270 C 190 320, 230 380, 260 410 C 230 380, 200 340, 180 270 Z"
                stroke="url(#mandalaGrad)"
                strokeWidth="1.4"
                fill="none"
            />
            <path d="M 190 280 C 210 330, 240 375, 260 410" stroke="url(#mandalaGrad)" strokeWidth="1" strokeDasharray="2 3" />
            <path d="M 185 275 C 200 310, 220 350, 235 385" stroke="url(#mandalaGrad)" strokeWidth="0.8" />

            {/* Geometric Concentric Accents */}
            <circle cx="370" cy="255" r="28" stroke="url(#mandalaGrad)" strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx="370" cy="255" r="18" stroke="url(#mandalaGrad)" strokeWidth="0.8" />
            <circle cx="370" cy="255" r="6" fill="#00C882" opacity="0.4" />

            {/* Aquatic Bubbles & Water Swirls */}
            <circle cx="60" cy="220" r="8" stroke="url(#mandalaGrad)" strokeWidth="1" />
            <circle cx="45" cy="195" r="5" stroke="url(#mandalaGrad)" strokeWidth="0.8" />
            <circle cx="75" cy="180" r="3" fill="#00C882" opacity="0.5" />
            <circle cx="85" cy="150" r="6" stroke="url(#mandalaGrad)" strokeWidth="1" />
        </svg>
    );
}

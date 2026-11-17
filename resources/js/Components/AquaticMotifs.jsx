/**
 * Shared aquatic vector ornaments and atmospheric backdrops for Dunia Ikan.
 * Strictly decorative (`aria-hidden="true"`, `pointer-events-none`) using brand
 * navy, ocean blue (`#0684E5`), and reef aqua (`#4AB8BD`) tokens only.
 */

export function AquaticCanvasBackdrop({ variant = 'default', className = '' }) {
    const positionClass = variant === 'auth' ? 'absolute' : 'fixed';

    return (
        <div
            aria-hidden="true"
            className={`${positionClass} inset-0 -z-10 pointer-events-none select-none overflow-hidden ${className}`}
        >
            {/* Subtle edge-hugging ambient water light pools (light & dark tuned in app.css) */}
            <div className="aquatic-caustic-pool aquatic-caustic-pool--top" />
            <div className="aquatic-caustic-pool aquatic-caustic-pool--bottom" />

            {/* Top-right concentric coastal ripple contours */}
            <svg
                viewBox="0 0 560 420"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -top-12 -right-20 w-[340px] sm:w-[460px] lg:w-[560px] h-auto text-[#0684E5] dark:text-[#4AB8BD] opacity-[0.075] dark:opacity-[0.11]"
            >
                <circle cx="430" cy="90" r="118" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="430" cy="90" r="184" stroke="currentColor" strokeWidth="1.05" strokeDasharray="6 8" />
                <circle cx="430" cy="90" r="256" stroke="currentColor" strokeWidth="1" />
                <path
                    d="M120 18C210 82 285 110 385 102C462 96 518 68 560 36"
                    stroke="currentColor"
                    strokeWidth="1.15"
                    strokeLinecap="round"
                />
                <path
                    d="M175 130C265 186 355 198 446 178C494 167 532 146 560 124"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.7"
                />
                {/* Minimal oxygen bubbles */}
                <circle cx="242" cy="192" r="5" stroke="currentColor" strokeWidth="1.25" />
                <circle cx="258" cy="168" r="2.8" stroke="currentColor" strokeWidth="1.25" />
                <circle cx="226" cy="164" r="2" stroke="currentColor" strokeWidth="1.1" />
            </svg>

            {/* Mid-left aquascape botanical stem & gentle current lines */}
            <svg
                viewBox="0 0 360 520"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hidden sm:block absolute top-[28%] -left-16 w-[240px] lg:w-[320px] h-auto text-[#1E80A0] dark:text-[#4AB8BD] opacity-[0.065] dark:opacity-[0.095]"
            >
                <path
                    d="M44 500C68 415 58 340 88 260C114 192 98 124 72 64"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                />
                <path
                    d="M66 490C96 402 108 332 132 278C152 232 142 182 122 140"
                    stroke="currentColor"
                    strokeWidth="1.05"
                    strokeLinecap="round"
                />
                <path
                    d="M84 366C106 348 124 342 142 350C126 372 106 382 84 366Z"
                    stroke="currentColor"
                    strokeWidth="1.05"
                />
                <path
                    d="M88 286C64 268 46 266 28 278C46 296 68 302 88 286Z"
                    stroke="currentColor"
                    strokeWidth="1.05"
                />
                <path
                    d="M116 218C140 202 158 198 176 208C158 228 138 234 116 218Z"
                    stroke="currentColor"
                    strokeWidth="1.05"
                />
                <circle cx="174" cy="144" r="6" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="192" cy="118" r="3.2" stroke="currentColor" strokeWidth="1.15" />
                <circle cx="164" cy="108" r="2.2" stroke="currentColor" strokeWidth="1.1" />
            </svg>

            {/* Bottom-right flowing current contour & subtle fin curve */}
            <svg
                viewBox="0 0 540 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-10 -right-12 w-[300px] sm:w-[440px] h-auto text-[#001454] dark:text-[#4AB8BD] opacity-[0.045] dark:opacity-[0.09]"
            >
                <path
                    d="M24 264C128 202 222 198 318 226C404 251 478 226 534 166"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                />
                <path
                    d="M78 292C176 238 266 236 356 260C430 280 492 258 538 210"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeDasharray="5 7"
                />
                <path
                    d="M366 132C406 106 456 104 492 126C468 148 430 162 388 158C362 155 344 146 330 156C338 144 338 128 326 116C342 124 352 140 366 132Z"
                    stroke="currentColor"
                    strokeWidth="1.15"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

export function HeroWaveTransition({ variant = 'canvas', className = '' }) {
    if (variant === 'sheet') {
        return (
            <div
                aria-hidden="true"
                className={`pointer-events-none select-none absolute inset-x-0 bottom-5 sm:bottom-6 z-[5] overflow-hidden ${className}`}
            >
                <svg
                    viewBox="0 0 1440 72"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-10 sm:h-14 block"
                >
                    <path
                        d="M0 44C220 12 430 10 690 36C960 64 1210 58 1440 22V72H0V44Z"
                        fill="#4AB8BD"
                        fillOpacity="0.16"
                    />
                    <path
                        d="M0 54C280 28 520 56 820 40C1090 26 1280 14 1440 34V72H0V54Z"
                        fill="#0684E5"
                        fillOpacity="0.2"
                    />
                </svg>
            </div>
        );
    }

    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none select-none absolute inset-x-0 -bottom-px z-10 overflow-hidden leading-none ${className}`}
        >
            <svg
                viewBox="0 0 1440 84"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-11 sm:h-14 lg:h-[68px] block"
            >
                {/* Translucent sub-surface reef tide crest */}
                <path
                    d="M0 42C240 8 460 14 720 42C980 70 1220 60 1440 26V84H0V42Z"
                    fill="#4AB8BD"
                    fillOpacity="0.18"
                />
                {/* Crisp shoreline wave contour */}
                <path
                    d="M0 50C240 16 460 20 720 48C980 76 1220 66 1440 32"
                    fill="none"
                    stroke="#4AB8BD"
                    strokeOpacity="0.42"
                    strokeWidth="1.5"
                />
                {/* Foreground canvas blend wave */}
                <path
                    d="M0 58C260 28 520 58 840 44C1100 32 1280 22 1440 46V84H0V58Z"
                    className="fill-[#fbf8ff] dark:fill-[#070b14] transition-colors duration-200"
                />
            </svg>
        </div>
    );
}

export function SectionWaveDivider({ className = '' }) {
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none select-none flex items-center gap-4 py-1 ${className}`}
        >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-[#0684E5]/25 dark:to-[#4AB8BD]/25" />
            <svg
                viewBox="0 0 96 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-20 h-4 text-[#0684E5]/55 dark:text-[#4AB8BD]/55 shrink-0"
            >
                <path
                    d="M2 10C14 4 24 4 34 10C44 16 54 16 64 10C74 4 84 4 94 10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                />
                <circle cx="48" cy="5.5" r="2" fill="currentColor" fillOpacity="0.65" />
            </svg>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 dark:via-slate-800 to-[#0684E5]/25 dark:to-[#4AB8BD]/25" />
        </div>
    );
}

export function AquaticBannerOrnaments({ variant = 'dark', className = '' }) {
    if (variant === 'footer') {
        return (
            <div
                aria-hidden="true"
                className={`pointer-events-none select-none absolute inset-0 overflow-hidden ${className}`}
            >
                <svg
                    viewBox="0 0 1440 240"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute bottom-0 inset-x-0 w-full h-44 sm:h-56 text-[#0684E5] dark:text-[#4AB8BD] opacity-[0.065] dark:opacity-[0.1]"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 132C240 62 490 76 740 124C990 172 1230 162 1440 94"
                        stroke="currentColor"
                        strokeWidth="1.4"
                    />
                    <path
                        d="M0 168C280 110 530 128 790 164C1040 198 1260 184 1440 132"
                        stroke="currentColor"
                        strokeWidth="1.15"
                        strokeDasharray="6 8"
                    />
                    <path
                        d="M0 202C320 156 610 176 920 198C1150 214 1310 202 1440 168"
                        stroke="currentColor"
                        strokeWidth="1"
                    />
                </svg>
            </div>
        );
    }

    if (variant === 'light') {
        return (
            <div
                aria-hidden="true"
                className={`pointer-events-none select-none absolute inset-0 overflow-hidden ${className}`}
            >
                <svg
                    viewBox="0 0 380 280"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute -top-6 -right-8 w-60 sm:w-80 h-auto text-[#0684E5] dark:text-[#4AB8BD] opacity-[0.11] dark:opacity-[0.16]"
                >
                    <circle cx="290" cy="64" r="68" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="290" cy="64" r="112" stroke="currentColor" strokeWidth="1" strokeDasharray="5 7" />
                    <path
                        d="M128 28C194 64 252 68 352 44"
                        stroke="currentColor"
                        strokeWidth="1.15"
                        strokeLinecap="round"
                    />
                    <path
                        d="M180 206C202 162 248 148 292 162C264 190 222 208 180 206Z"
                        stroke="currentColor"
                        strokeWidth="1.15"
                        strokeLinejoin="round"
                    />
                    <circle cx="164" cy="144" r="4" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="176" cy="128" r="2.2" stroke="currentColor" strokeWidth="1.1" />
                </svg>

                <svg
                    viewBox="0 0 220 180"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hidden sm:block absolute -bottom-6 -left-6 w-48 h-auto text-[#1E80A0] dark:text-[#4AB8BD] opacity-[0.09] dark:opacity-[0.14]"
                >
                    <path
                        d="M16 146C64 98 118 96 184 128"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />
                    <path
                        d="M28 168C80 126 138 124 202 152"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="4 6"
                    />
                </svg>
            </div>
        );
    }

    // Default `dark` variant for high-contrast dark ocean CTA banners
    return (
        <div
            aria-hidden="true"
            className={`pointer-events-none select-none absolute inset-0 overflow-hidden ${className}`}
        >
            <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#4AB8BD]/15 blur-2xl" />
            <svg
                viewBox="0 0 420 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-0 inset-y-0 h-full w-auto text-[#4AB8BD] opacity-[0.22]"
            >
                <path
                    d="M40 180C125 112 212 108 296 142C354 166 392 152 420 118"
                    stroke="currentColor"
                    strokeWidth="1.3"
                />
                <path
                    d="M84 196C166 138 242 138 320 164C368 180 398 170 420 144"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="5 6"
                />
                {/* Minimalist Betta / Koi fin contour watermark */}
                <path
                    d="M236 86C268 62 316 62 346 84C324 106 286 116 248 110C226 106 212 96 196 108C206 94 206 78 194 64C212 72 222 88 236 86Z"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinejoin="round"
                />
                <path
                    d="M276 82C298 52 326 42 350 48C338 66 318 78 296 84"
                    stroke="currentColor"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                />
                <circle cx="176" cy="64" r="5" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="192" cy="44" r="3" stroke="currentColor" strokeWidth="1.1" />
                <circle cx="164" cy="40" r="2" stroke="currentColor" strokeWidth="1.1" />
            </svg>
        </div>
    );
}

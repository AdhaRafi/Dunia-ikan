/**
 * Shared shoreline transition & section divider helpers for Dunia Ikan.
 */

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
                        fill="#60C2E6"
                        fillOpacity="0.16"
                    />
                    <path
                        d="M0 54C280 28 520 56 820 40C1090 26 1280 14 1440 34V72H0V54Z"
                        fill="#005A9D"
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
                    fill="#60C2E6"
                    fillOpacity="0.18"
                />
                {/* Crisp shoreline wave contour */}
                <path
                    d="M0 50C240 16 460 20 720 48C980 76 1220 66 1440 32"
                    fill="none"
                    stroke="#60C2E6"
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
            className={`pointer-events-none select-none py-1 ${className}`}
        >
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/80 dark:via-slate-800/80 to-transparent" />
        </div>
    );
}

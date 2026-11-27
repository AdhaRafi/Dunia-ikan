import { useId } from 'react';

/**
 * Shared shoreline transition & section divider helpers for Dunia Ikan.
 */

// Seamless 2-tile periodic sine waves (0..1440 repeated identically on 1440..2880)
const HERO_WAVE_FRONT_LINE =
    'M 0 18 C 87.4 18 152.6 40 240 40 C 327.4 40 392.6 18 480 18 ' +
    'C 567.4 18 632.6 40 720 40 C 807.4 40 872.6 18 960 18 ' +
    'C 1047.4 18 1112.6 40 1200 40 C 1287.4 40 1352.6 18 1440 18 ' +
    'C 1527.4 18 1592.6 40 1680 40 C 1767.4 40 1832.6 18 1920 18 ' +
    'C 2007.4 18 2072.6 40 2160 40 C 2247.4 40 2312.6 18 2400 18 ' +
    'C 2487.4 18 2552.6 40 2640 40 C 2727.4 40 2792.6 18 2880 18';

const HERO_WAVE_BACK_FILL =
    'M 0 34 C 131.1 34 228.9 14 360 14 C 491.1 14 588.9 34 720 34 ' +
    'C 851.1 34 948.9 14 1080 14 C 1211.1 14 1308.9 34 1440 34 ' +
    'C 1571.1 34 1668.9 14 1800 14 C 1931.1 14 2028.9 34 2160 34 ' +
    'C 2291.1 34 2388.9 14 2520 14 C 2651.1 14 2748.9 34 2880 34 V 84 H 0 Z';

export function HeroWaveTransition({
    variant = 'canvas',
    className = '',
}) {
    const waveId = useId().replace(/:/g, '');

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
            className={`pointer-events-none select-none absolute inset-x-0 -bottom-px z-10 h-14 sm:h-[68px] lg:h-[78px] overflow-hidden leading-none ${className}`}
        >
            {/* Subtle slower aqua swell behind the main shoreline crest */}
            <svg
                viewBox="0 0 2880 84"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hero-wave-drift-slow absolute inset-y-0 left-0 h-full w-[320%] sm:w-[240%] lg:w-[200%] max-w-none block"
            >
                <path
                    d={HERO_WAVE_BACK_FILL}
                    className="fill-[#29D3E6]/25 dark:fill-[#38BDF8]/20"
                />
            </svg>

            {/* Primary rolling ocean wave with crisp white foam crest melting into the page canvas */}
            <svg
                viewBox="0 0 2880 84"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hero-wave-drift absolute inset-y-0 left-0 h-full w-[320%] sm:w-[240%] lg:w-[200%] max-w-none block"
            >
                <defs>
                    <linearGradient
                        id={`hero-wave-grad-${waveId}`}
                        gradientUnits="userSpaceOnUse"
                        x1="0"
                        y1="16"
                        x2="0"
                        y2="84"
                    >
                        <stop offset="0%" style={{ stopColor: 'var(--hero-wave-stop-1)' }} />
                        <stop offset="34%" style={{ stopColor: 'var(--hero-wave-stop-2)' }} />
                        <stop offset="72%" style={{ stopColor: 'var(--hero-wave-stop-3)' }} />
                        <stop offset="100%" style={{ stopColor: 'var(--hero-wave-stop-4)' }} />
                    </linearGradient>
                </defs>
                <path
                    d={`${HERO_WAVE_FRONT_LINE} V 84 H 0 Z`}
                    fill={`url(#hero-wave-grad-${waveId})`}
                />
                <path
                    d={HERO_WAVE_FRONT_LINE}
                    fill="none"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    className="stroke-white dark:stroke-[#E0FAFF]"
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

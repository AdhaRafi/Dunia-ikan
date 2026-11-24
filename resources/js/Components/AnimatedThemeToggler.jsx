import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from '@/Components/Icons';

let transitionSequence = 0;

/**
 * Synchronously update the document root theme classes/storage and run a
 * circular View Transitions reveal expanding from the trigger coordinates.
 */
export function toggleThemeWithTransition(eventOrElement, nextDark, setDarkMode) {
    const applyTheme = () => {
        if (typeof document !== 'undefined') {
            document.documentElement.classList.toggle('dark', nextDark);
            document.documentElement.style.colorScheme = nextDark ? 'dark' : 'light';
            try {
                localStorage.setItem('theme', nextDark ? 'dark' : 'light');
            } catch {
                // Ignore storage quota / private browsing errors cleanly.
            }
        }
        setDarkMode(nextDark);
    };

    if (typeof window === 'undefined' || typeof document === 'undefined') {
        applyTheme();
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof document.startViewTransition !== 'function' || prefersReducedMotion) {
        applyTheme();
        return;
    }

    const target = eventOrElement?.currentTarget ?? eventOrElement;
    const rect =
        target && typeof target.getBoundingClientRect === 'function'
            ? target.getBoundingClientRect()
            : null;
    const hasBox = Boolean(rect && rect.width > 0 && rect.height > 0);
    const x = hasBox ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = hasBox ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
    );

    const sequenceId = ++transitionSequence;
    const root = document.documentElement;
    root.classList.add('theme-switching');

    const transition = document.startViewTransition(() => {
        flushSync(applyTheme);
    });

    transition.ready
        .then(() => {
            if (sequenceId !== transitionSequence) {
                return;
            }
            root.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${endRadius}px at ${x}px ${y}px)`,
                    ],
                },
                {
                    duration: 500,
                    easing: 'ease-in-out',
                    pseudoElement: '::view-transition-new(root)',
                },
            );
        })
        .catch(() => {
            // Safely ignore aborted transitions if user toggles rapidly.
        });

    transition.finished
        .finally(() => {
            if (sequenceId === transitionSequence) {
                root.classList.remove('theme-switching');
            }
        })
        .catch(() => {});
}

export default function AnimatedThemeToggler({
    darkMode,
    onToggle,
    className = '',
    iconClassName = 'w-4 h-4',
    label = 'Toggle Theme',
    title,
}) {
    const hasInteractedRef = useRef(false);

    const handleClick = (event) => {
        hasInteractedRef.current = true;
        onToggle?.(event);
    };

    const animationClass = hasInteractedRef.current
        ? darkMode
            ? 'theme-icon-sun'
            : 'theme-icon-moon'
        : '';

    return (
        <button
            type="button"
            onClick={handleClick}
            title={title ?? label}
            aria-label={label}
            aria-pressed={darkMode}
            className={`btn-motion inline-flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005A9D] ${className}`}
        >
            <span
                key={darkMode ? 'sun' : 'moon'}
                className={`inline-flex items-center justify-center ${animationClass}`}
            >
                {darkMode ? (
                    <Sun className={iconClassName} />
                ) : (
                    <Moon className={iconClassName} />
                )}
            </span>
        </button>
    );
}

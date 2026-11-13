import { useEffect, useRef, useState } from 'react';

export default function Reveal({
    children,
    className = '',
    delay = 0,
    as: Tag = 'div',
}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVisible(true);
            return;
        }

        const element = ref.current;

        if (!element) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12, rootMargin: '0px 0px -48px 0px' },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <Tag
            ref={ref}
            className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </Tag>
    );
}

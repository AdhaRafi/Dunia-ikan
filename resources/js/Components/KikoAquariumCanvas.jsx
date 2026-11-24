import { useEffect, useRef } from 'react';

const PIXEL_SIZE = 3;

const LIGHT_WATER_BANDS = ['#c5f3fa', '#a5e9f5', '#83ddf0', '#60cde6', '#46bad8'];
const DARK_WATER_BANDS = ['#08172c', '#0a1f3b', '#0d284b', '#0a203c', '#07162a'];

// Pixel-art ornamental fish sprites (facing right by default)
const SPRITES = {
    clown: {
        rows: [
            '.....oo....',
            'd..owowoo..',
            'ddowowooeko',
            'ddowowooooo',
            'd..owowoo..',
            '....ddo....',
        ],
        palette: {
            o: '#f26a1b',
            d: '#c9460e',
            w: '#ffffff',
            e: '#0b1220',
            k: '#fb923c',
        },
        speed: 0.28,
        school: 0,
    },
    tang: {
        rows: [
            '....yyyy...',
            'y..ybbbbbb.',
            'yybbbbbbeb.',
            'yybbbbbbbbb',
            'y..bbbbbb..',
            '....dddd...',
        ],
        palette: {
            b: '#2563eb',
            d: '#1d4ed8',
            y: '#facc15',
            e: '#0b1220',
        },
        speed: 0.34,
        school: 1,
    },
    gold: {
        rows: [
            '....aa....',
            'a..yyyyy..',
            'aayyyyyey.',
            'aayyyyyyy.',
            'a..yppyy..',
        ],
        palette: {
            y: '#facc15',
            a: '#f59e0b',
            p: '#fef08a',
            e: '#0b1220',
        },
        speed: 0.25,
        school: 2,
    },
    minnow: {
        rows: [
            'm..ssss.',
            'mmsssses',
            'm..ssss.',
        ],
        palette: {
            s: '#e0f2fe',
            m: '#94a3b8',
            e: '#0b1220',
        },
        speed: 0.42,
        school: 3,
    },
};

function drawSprite(ctx, sprite, cx, cy, facingLeft) {
    const { rows, palette } = sprite;
    const h = rows.length;
    const w = rows[0].length;
    const x0 = Math.round(cx - w / 2);
    const y0 = Math.round(cy - h / 2);

    for (let r = 0; r < h; r++) {
        const line = rows[r];
        for (let c = 0; c < w; c++) {
            const ch = line[c];
            if (ch === '.') {
                continue;
            }
            const color = palette[ch];
            if (!color) {
                continue;
            }
            ctx.fillStyle = color;
            const drawX = facingLeft ? x0 + (w - 1 - c) : x0 + c;
            ctx.fillRect(drawX, y0 + r, 1, 1);
        }
    }
}

function drawBubble(ctx, bx, by, kind, color) {
    const x = Math.round(bx);
    const y = Math.round(by);
    ctx.fillStyle = color;

    if (kind === 'plus') {
        ctx.fillRect(x, y - 1, 1, 3);
        ctx.fillRect(x - 1, y, 3, 1);
    } else if (kind === 'diamond') {
        ctx.fillRect(x, y - 1, 1, 1);
        ctx.fillRect(x - 1, y, 1, 1);
        ctx.fillRect(x + 1, y, 1, 1);
        ctx.fillRect(x, y + 1, 1, 1);
    } else {
        ctx.fillRect(x, y, 1, 1);
    }
}

function createInitialFish(w, h) {
    const specs = [
        'clown', 'clown', 'clown', 'clown',
        'tang', 'tang', 'tang',
        'gold', 'gold', 'gold',
        'minnow', 'minnow', 'minnow', 'minnow', 'minnow', 'minnow',
    ];

    return specs.map((type, idx) => {
        const sprite = SPRITES[type];
        const dir = idx % 2 === 0 ? 1 : -1;
        // Spread schools neatly across upper, mid, and lower-mid tank zones
        const schoolBaseY = [0.24, 0.44, 0.34, 0.56][sprite.school];
        const x = ((idx * 29 + sprite.school * 23) % Math.max(40, w - 16)) + 8;
        const y = Math.max(
            18,
            Math.min(h - 24, h * schoolBaseY + ((idx % 3) - 1) * 11),
        );

        return {
            type,
            x,
            y,
            vx: dir * sprite.speed * (0.85 + (idx % 4) * 0.1),
            vy: ((idx % 5) - 2) * 0.03,
            facingLeft: dir < 0,
            phase: idx * 1.17,
        };
    });
}

function createInitialBubbles(w, h) {
    return Array.from({ length: 18 }, (_, i) => ({
        x: ((i * 19 + 7) % Math.max(30, w - 8)) + 4,
        y: ((i * 23 + 11) % Math.max(30, h - 18)) + 8,
        vy: 0.14 + (i % 4) * 0.05,
        kind: i % 3 === 0 ? 'diamond' : i % 2 === 0 ? 'plus' : 'dot',
        phase: i * 0.8,
        transient: false,
        life: 1,
    }));
}

export default function KikoAquariumCanvas({
    pointerRef,
    isTyping = false,
    sendBurstKey = 0,
    tapEvent = null,
    dimmed = false,
}) {
    const canvasRef = useRef(null);
    const stateRef = useRef({
        w: 140,
        h: 210,
        fish: [],
        bubbles: [],
        isDark: false,
        isTyping: false,
        burstTicks: 0,
    });

    useEffect(() => {
        stateRef.current.isTyping = isTyping;
    }, [isTyping]);

    // Trigger joyful bubble plume & fish darting into composer on message send
    useEffect(() => {
        if (!sendBurstKey) {
            return;
        }
        const st = stateRef.current;
        st.burstTicks = 95;
        const cx = st.w * 0.5;
        const cy = st.h * 0.82;

        for (let i = 0; i < 12; i++) {
            st.bubbles.push({
                x: cx + (Math.random() - 0.5) * (st.w * 0.55),
                y: cy + (Math.random() - 0.5) * 10,
                vy: 0.24 + Math.random() * 0.22,
                kind: i % 2 === 0 ? 'plus' : 'diamond',
                phase: Math.random() * 6,
                transient: true,
                life: 1,
            });
        }
    }, [sendBurstKey]);

    // Spawn ripples & bubbles where the user taps/clicks open water
    useEffect(() => {
        if (!tapEvent || !tapEvent.id) {
            return;
        }
        const st = stateRef.current;
        const tx = tapEvent.nx * st.w;
        const ty = tapEvent.ny * st.h;

        for (let i = 0; i < 7; i++) {
            st.bubbles.push({
                x: tx + (Math.random() - 0.5) * 12,
                y: ty + (Math.random() - 0.5) * 8,
                vy: 0.22 + Math.random() * 0.18,
                kind: i % 2 === 0 ? 'plus' : 'diamond',
                phase: Math.random() * 6,
                transient: true,
                life: 1,
            });
        }

        for (const f of st.fish) {
            const dx = f.x - tx;
            const dy = f.y - ty;
            const dist = Math.hypot(dx, dy);
            if (dist > 0.5 && dist < 44) {
                const force = (1 - dist / 44) * 1.1;
                f.vx += (dx / dist) * force;
                f.vy += (dy / dist) * force * 0.7;
            }
        }
    }, [tapEvent]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || typeof window === 'undefined') {
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        const syncTheme = () => {
            stateRef.current.isDark = document.documentElement.classList.contains('dark');
        };
        syncTheme();

        const themeObserver = new MutationObserver(syncTheme);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const lw = Math.max(96, Math.round(rect.width / PIXEL_SIZE));
            const lh = Math.max(120, Math.round(rect.height / PIXEL_SIZE));
            if (canvas.width !== lw || canvas.height !== lh) {
                canvas.width = lw;
                canvas.height = lh;
                stateRef.current.w = lw;
                stateRef.current.h = lh;
                if (stateRef.current.fish.length === 0) {
                    stateRef.current.fish = createInitialFish(lw, lh);
                    stateRef.current.bubbles = createInitialBubbles(lw, lh);
                }
            }
        };

        resize();
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let rafId = 0;
        let tick = 0;

        const renderFrame = (advancePhysics) => {
            const st = stateRef.current;
            const { w, h, isDark } = st;
            if (!w || !h) {
                return;
            }

            if (advancePhysics) {
                tick += 1;
                if (st.burstTicks > 0) {
                    st.burstTicks -= 1;
                }
            }

            // 1. Stratified pixel-dithered water bands
            const bands = isDark ? DARK_WATER_BANDS : LIGHT_WATER_BANDS;
            const bandHeight = Math.ceil(h / bands.length);

            for (let i = 0; i < bands.length; i++) {
                const yStart = i * bandHeight;
                ctx.fillStyle = bands[i];
                ctx.fillRect(0, yStart, w, bandHeight + 1);

                // Crisp 2-row pixel-dithered transition between bands
                if (i > 0) {
                    ctx.fillStyle = bands[i - 1];
                    for (let x = 0; x < w; x += 2) {
                        ctx.fillRect(x, yStart, 1, 1);
                    }
                    ctx.fillStyle = bands[i];
                    for (let x = 1; x < w; x += 2) {
                        ctx.fillRect(x, yStart - 1, 1, 1);
                    }
                }
            }

            // 2. Soft diagonal aquarium glass reflection streaks
            ctx.fillStyle = isDark ? 'rgba(148, 224, 255, 0.04)' : 'rgba(255, 255, 255, 0.14)';
            for (let r = 0; r < h; r += 2) {
                const x1 = Math.floor(w * 0.14 + r * 0.42);
                const x2 = Math.floor(w * 0.58 + r * 0.42);
                ctx.fillRect(x1, r, 7, 2);
                ctx.fillRect(x2, r, 4, 2);
            }

            // 3. Gentle sunlit caustic patches drifting near upper water
            ctx.fillStyle = isDark ? 'rgba(96, 194, 230, 0.06)' : 'rgba(255, 255, 255, 0.18)';
            for (let c = 0; c < 4; c++) {
                const cx = Math.floor(((c * 39 + tick * 0.08 * (c % 2 === 0 ? 1 : -1) + w * 4) % (w + 20)) - 10);
                const cy = 12 + c * 15;
                ctx.fillRect(cx, cy, 10, 4);
                ctx.fillRect(cx + 2, cy - 1, 6, 6);
            }

            // 4. Rolling pixel-art sandy seabed & swaying seagrass blades
            const sandTop = isDark ? '#1a3656' : '#f1dfa8';
            const sandMid = isDark ? '#122742' : '#dec487';
            const sandShadow = isDark ? '#0b1b30' : '#c9ad6f';

            for (let x = 0; x < w; x++) {
                const hill = Math.round(Math.sin(x * 0.09) * 2 + Math.cos(x * 0.045) * 1.5);
                const yFloor = h - 7 + hill;
                ctx.fillStyle = sandTop;
                ctx.fillRect(x, yFloor, 1, 2);
                ctx.fillStyle = sandMid;
                ctx.fillRect(x, yFloor + 2, 1, 3);
                ctx.fillStyle = sandShadow;
                ctx.fillRect(x, yFloor + 5, 1, Math.max(1, h - (yFloor + 5)));
            }

            const grassDark = isDark ? '#0e423e' : '#1f704b';
            const grassLight = isDark ? '#16635b' : '#2e9162';
            const bladeSpacing = Math.max(9, Math.floor(w / 13));

            for (let bx = 6; bx < w - 5; bx += bladeSpacing) {
                const hill = Math.round(Math.sin(bx * 0.09) * 2 + Math.cos(bx * 0.045) * 1.5);
                const baseY = h - 7 + hill;
                const height = 16 + ((bx * 7) % 14);

                for (let seg = 1; seg <= height; seg++) {
                    const sway = Math.round(
                        Math.sin(tick * 0.035 + bx * 0.25 + seg * 0.22) * (seg / height) * 1.6,
                    );
                    ctx.fillStyle = seg > height * 0.55 ? grassLight : grassDark;
                    ctx.fillRect(bx + sway, baseY - seg, 1, 1);
                }
            }

            // 5. Update & draw pixel fish schools
            const pointer = pointerRef?.current;
            const hasPointer = Boolean(pointer && pointer.active);
            const px = hasPointer ? pointer.nx * w : -999;
            const py = hasPointer ? pointer.ny * h : -999;
            const composerX = w * 0.5;
            const composerY = h * 0.8;

            for (let i = 0; i < st.fish.length; i++) {
                const f = st.fish[i];
                const sprite = SPRITES[f.type];

                if (advancePhysics) {
                    // Loose schooling alignment + gentle cohesion within same species
                    let avgVx = 0;
                    let avgY = 0;
                    let neighbors = 0;

                    for (let j = 0; j < st.fish.length; j++) {
                        if (i === j) {
                            continue;
                        }
                        const other = st.fish[j];
                        if (other.type !== f.type) {
                            continue;
                        }
                        const dx = other.x - f.x;
                        const dy = other.y - f.y;
                        const d = Math.hypot(dx, dy);
                        if (d < 34) {
                            avgVx += other.vx;
                            avgY += other.y;
                            neighbors++;
                            if (d < 10 && d > 0.1) {
                                f.vx -= (dx / d) * 0.025;
                                f.vy -= (dy / d) * 0.025;
                            }
                        }
                    }

                    if (neighbors > 0) {
                        f.vx += (avgVx / neighbors - f.vx) * 0.015;
                        f.vy += (avgY / neighbors - f.y) * 0.0018;
                    }

                    // Subtle natural undulation
                    f.vy += Math.sin(tick * 0.03 + f.phase) * 0.004;

                    // Pointer scatter
                    if (hasPointer) {
                        const dx = f.x - px;
                        const dy = f.y - py;
                        const d = Math.hypot(dx, dy);
                        if (d > 0.5 && d < 32) {
                            const repel = (1 - d / 32) * 0.14;
                            f.vx += (dx / d) * repel;
                            f.vy += (dy / d) * repel;
                        }
                    }

                    // Crowd curiously toward the composer when user types or just sent a message
                    if (st.isTyping || st.burstTicks > 0) {
                        const targetX = composerX + Math.sin(f.phase + tick * 0.02) * (w * 0.24);
                        const targetY = st.burstTicks > 0 ? composerY - 4 : composerY - 18;
                        const dx = targetX - f.x;
                        const dy = targetY - f.y;
                        const d = Math.hypot(dx, dy);
                        if (d > 6) {
                            const pull = st.burstTicks > 0 ? 0.045 : 0.02;
                            f.vx += (dx / d) * pull;
                            f.vy += (dy / d) * pull;
                        }
                    }

                    // Maintain comfortable cruise speed & clamp vertical bounds above seabed
                    const maxSpeed = st.burstTicks > 0 ? sprite.speed * 2.1 : sprite.speed * 1.35;
                    const minSpeed = sprite.speed * 0.55;
                    const speed = Math.hypot(f.vx, f.vy);
                    if (speed > maxSpeed) {
                        f.vx = (f.vx / speed) * maxSpeed;
                        f.vy = (f.vy / speed) * maxSpeed;
                    } else if (speed < minSpeed) {
                        const dir = f.vx >= 0 ? 1 : -1;
                        f.vx = dir * minSpeed;
                    }

                    f.vy *= 0.96;
                    f.x += f.vx;
                    f.y += f.vy;

                    if (f.x > w + 10) {
                        f.x = -10;
                    } else if (f.x < -10) {
                        f.x = w + 10;
                    }

                    const minY = 14;
                    const maxY = h - 18;
                    if (f.y < minY) {
                        f.y = minY;
                        f.vy = Math.abs(f.vy) + 0.04;
                    } else if (f.y > maxY) {
                        f.y = maxY;
                        f.vy = -Math.abs(f.vy) - 0.04;
                    }

                    if (Math.abs(f.vx) > 0.05) {
                        f.facingLeft = f.vx < 0;
                    }
                }

                drawSprite(ctx, sprite, f.x, f.y, f.facingLeft);
            }

            // 6. Rising pixel-art bubbles
            const bubbleColor = isDark ? 'rgba(161, 225, 239, 0.55)' : 'rgba(255, 255, 255, 0.85)';
            for (let i = st.bubbles.length - 1; i >= 0; i--) {
                const b = st.bubbles[i];
                if (advancePhysics) {
                    b.y -= b.vy;
                    b.x += Math.sin(tick * 0.05 + b.phase) * 0.08;
                    if (b.transient) {
                        b.life -= 0.012;
                        if (b.life <= 0 || b.y < -4) {
                            st.bubbles.splice(i, 1);
                            continue;
                        }
                    } else if (b.y < -4) {
                        b.y = h - 10;
                        b.x = ((b.x + 29) % Math.max(24, w - 8)) + 4;
                    }
                }

                drawBubble(ctx, b.x, b.y, b.kind, bubbleColor);
            }
        };

        renderFrame(false);

        if (!prefersReducedMotion) {
            const loop = () => {
                renderFrame(true);
                rafId = window.requestAnimationFrame(loop);
            };
            rafId = window.requestAnimationFrame(loop);
        }

        return () => {
            if (rafId) {
                window.cancelAnimationFrame(rafId);
            }
            themeObserver.disconnect();
            resizeObserver.disconnect();
        };
    }, [pointerRef]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`pointer-events-none select-none absolute inset-0 h-full w-full [image-rendering:pixelated] transition-opacity duration-500 ${
                dimmed ? 'opacity-30 dark:opacity-30' : 'opacity-100'
            }`}
        />
    );
}

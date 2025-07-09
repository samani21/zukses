import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
    FC,
} from 'react';
const ChevronRightIcon = () => (
    <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
);
const ChevronLeftIcon = () => (
    <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
);

interface Banner { id: number; src: string; alt: string; }
interface SlidingBannerProps { banners: Banner[]; autoPlayInterval?: number; }

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState<boolean>(() =>
        typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
    );

    useEffect(() => {
        const m = window.matchMedia(query);
        const listener = () => setMatches(m.matches);
        listener();
        m.addEventListener('change', listener);
        return () => m.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

const SlidingBanner: FC<SlidingBannerProps> = ({
    banners,
    autoPlayInterval = 5000,
}) => {
    const isMobile = useMediaQuery('(max-width: 767px)');
    const visibleCount = isMobile ? 1 : 3;
    const slideWidthPct = 100 / visibleCount;

    const extendedBanners = useMemo(() => {
        if (banners.length === 0) return [];
        const head = banners.slice(0, visibleCount);
        const tail = banners.slice(-visibleCount);
        return [...tail, ...banners, ...head];
    }, [banners, visibleCount]);

    const [currentIndex, setCurrentIndex] = useState(visibleCount);
    const [disableTransition, setDisableTransition] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const startXRef = useRef<number | null>(null);
    const isDraggingRef = useRef(false);

    const next = useCallback(() => !disableTransition && setCurrentIndex(i => i + 1), [disableTransition]);
    const prev = useCallback(() => !disableTransition && setCurrentIndex(i => i - 1), [disableTransition]);
    // const goTo = (i: number) => setCurrentIndex(i + visibleCount); // titik navigasi

    const resetTimeout = (): void => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        if (autoPlayInterval > 0 && banners.length > visibleCount) {
            resetTimeout();
            timeoutRef.current = setTimeout(next, autoPlayInterval);
        }
        return resetTimeout;
    }, [currentIndex, autoPlayInterval, banners.length, next, visibleCount]);

    const onTransitionEnd = () => {
        if (currentIndex < visibleCount) {
            setDisableTransition(true);
            setCurrentIndex(banners.length + currentIndex);
        } else if (currentIndex >= banners.length + visibleCount) {
            setDisableTransition(true);
            setCurrentIndex(visibleCount);
        }
    };
    useEffect(() => {
        if (disableTransition) {
            const t = setTimeout(() => setDisableTransition(false), 50);
            return () => clearTimeout(t);
        }
    }, [disableTransition]);

    const start = (x: number) => {
        resetTimeout();
        isDraggingRef.current = true;
        startXRef.current = x;
    };
    const move = (x: number) => {
        if (!isDraggingRef.current || startXRef.current === null) return;

        const diff = x - startXRef.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                prev();      // geser ke kiri
            } else {
                next();      // geser ke kanan
            }
            isDraggingRef.current = false;
        }
    };
    const end = () => {
        isDraggingRef.current = false;
        startXRef.current = null;
    };

    const transformStyle = {
        transform: `translateX(calc(-${currentIndex} * (${slideWidthPct}% + 1rem)))`,
        transition: disableTransition ? 'none' : 'transform 0.5s ease-in-out',
    };

    if (banners.length === 0) return null;

    return (
        <div
            className="w-full select-none pt-5"
            onMouseEnter={resetTimeout}
            onMouseLeave={end}
        >
            <div
                className="relative group overflow-hidden "
                onTouchStart={e => start(e.touches[0].clientX)}
                onTouchMove={e => move(e.touches[0].clientX)}
                onTouchEnd={end}
                onMouseDown={e => start(e.clientX)}
                onMouseMove={e => move(e.clientX)}
                onMouseUp={end}
                onMouseLeave={() => { if (isDraggingRef.current) end(); }}
            >
                <div
                    className="flex items-center gap-3"     /* gap‑4 = 1rem */
                    style={transformStyle}
                    onTransitionEnd={onTransitionEnd}
                >
                    {extendedBanners.map((b, i) => (
                        <div
                            key={`${b.id}-${i}`}
                            className="flex-shrink-0"
                            style={{ width: `${slideWidthPct}%` }}
                        >
                            <img
                                src={b.src}
                                alt={b.alt}
                                className={`w-full h-40 md:h-56 object-cover shadow
                  transition-opacity duration-500 ease-in-out
                  ${i === currentIndex ? 'opacity-100' : 'opacity-100'}`}
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={prev}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2
            bg-black/40 hover:bg-black/60 p-2 rounded-full opacity-0
            group-hover:opacity-100 transition focus:outline-none z-10"
                    aria-label="Sebelumnya"
                >
                    <ChevronLeftIcon />
                </button>
                <button
                    onClick={next}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2
            bg-black/40 hover:bg-black/60 p-2 rounded-full opacity-0
            group-hover:opacity-100 transition focus:outline-none z-10"
                    aria-label="Berikutnya"
                >
                    <ChevronRightIcon />
                </button>

                {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {banners.map((_, i) => {
                        const active = (currentIndex - visibleCount + banners.length) % banners.length === i;
                        return (
                            <button
                                key={i}
                                onClick={() => goTo(i)}
                                className={`h-2 rounded-full transition-all duration-300
                  ${active ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'}`}
                                aria-label={`Ke slide ${i + 1}`}
                            />
                        );
                    })}
                </div> */}
            </div>
        </div>
    );
};

export default SlidingBanner;

import { useEffect, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import UserAvatar from '@/Components/UserAvatar';
import { useLanguage } from '@/lib/i18n';

const RATING_LABELS = {
    1: { id: 'Kurang', en: 'Poor' },
    2: { id: 'Cukup', en: 'Fair' },
    3: { id: 'Baik', en: 'Good' },
    4: { id: 'Sangat baik', en: 'Very good' },
    5: { id: 'Sempurna', en: 'Excellent' },
};

/**
 * Two-column Store Rating & Reviews section modeled after clean editorial review layouts.
 */
export default function StoreRatingSection({ store, storeRating }) {
    const { auth } = usePage().props;
    const { pick } = useLanguage();
    const summary = storeRating || {
        average: 0,
        count: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        reviews: [],
        userReview: null,
        canReview: false,
    };

    const reviews = summary.reviews || [];
    const [activeIndex, setActiveIndex] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        rating: summary.userReview?.rating ?? 5,
        comment: summary.userReview?.comment ?? '',
    });

    useEffect(() => {
        if (activeIndex >= reviews.length && reviews.length > 0) {
            setActiveIndex(0);
        }
    }, [reviews.length, activeIndex]);

    useEffect(() => {
        if (summary.userReview) {
            setData({
                rating: summary.userReview.rating,
                comment: summary.userReview.comment ?? '',
            });
        }
    }, [summary.userReview?.rating, summary.userReview?.comment]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/stores/${store.slug}/reviews`, {
            preserveScroll: true,
        });
    };

    const activeReview = reviews[activeIndex] ?? null;
    const isOwner = auth?.user && store?.user_id === auth.user.id;
    const displayRating = hoverRating || data.rating;

    return (
        <section
            id="rating-toko"
            className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-slate-200/80 dark:border-neutral-800"
        >
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em] text-slate-900 dark:text-white">
                        {pick('Rating & Ulasan Toko', 'Store Ratings & Reviews')}
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {pick('Penilaian pembeli untuk', 'Buyer reviews for')}{' '}
                        <Link
                            href={`/stores/${store.slug}`}
                            className="font-semibold text-[#0267C1] dark:text-sky-400 hover:underline"
                        >
                            {store.name}
                        </Link>
                    </p>
                </div>

                {reviews.length > 1 && (
                    <button
                        type="button"
                        onClick={() => setShowAllReviews((prev) => !prev)}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline underline-offset-4"
                    >
                        {showAllReviews
                            ? pick('Tampilkan ringkas', 'Show compact')
                            : pick(`Lihat semua (${reviews.length})`, `View all (${reviews.length})`)}
                    </button>
                )}
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Column: Score Overview & 5-Star Distribution Histogram */}
                <div className="lg:col-span-5 space-y-5">
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-5xl sm:text-[56px] font-bold tracking-[-0.04em] leading-none tabular-nums text-slate-900 dark:text-white">
                                {summary.count > 0 ? Number(summary.average).toFixed(1) : '0.0'}
                            </span>
                            <span className="text-lg font-medium text-slate-400 dark:text-slate-500">
                                /5
                            </span>
                        </div>
                        <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                            ({summary.count} {pick('Ulasan Toko', 'Store Reviews')})
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        {[5, 4, 3, 2, 1].map((tier) => {
                            const tierCount = summary.distribution?.[tier] ?? 0;
                            const pct =
                                summary.count > 0 ? Math.round((tierCount / summary.count) * 100) : 0;

                            return (
                                <div key={tier} className="flex items-center gap-3">
                                    <Star
                                        className="w-4 h-4 shrink-0 fill-amber-400 text-amber-400"
                                        strokeWidth={1.5}
                                    />
                                    <span className="w-3 text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                                        {tier}
                                    </span>
                                    <div className="flex-1 h-2 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-slate-900 dark:bg-amber-400 transition-all duration-300"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="w-6 text-right text-xs tabular-nums text-slate-400 dark:text-slate-500">
                                        {tierCount}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Review Card(s) + Store Rating Submission Form */}
                <div className="lg:col-span-7 space-y-4">
                    {reviews.length === 0 ? (
                        <div className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 p-5 sm:p-6 text-sm text-slate-500 dark:text-slate-400">
                            {pick(
                                'Belum ada ulasan untuk toko ini. Jadilah pembeli pertama yang memberikan rating toko.',
                                'No reviews for this store yet. Be the first buyer to rate this store.',
                            )}
                        </div>
                    ) : showAllReviews ? (
                        <div className="space-y-3">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    ) : (
                        activeReview && (
                            <div className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 p-5 sm:p-6 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
                                <ReviewCardContent review={activeReview} />

                                {reviews.length > 1 && (
                                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                                        <div className="flex-1 max-w-[200px] flex items-center gap-1.5">
                                            {reviews.map((rev, idx) => (
                                                <button
                                                    key={rev.id}
                                                    type="button"
                                                    onClick={() => setActiveIndex(idx)}
                                                    aria-label={pick(`Ulasan ke-${idx + 1}`, `Review #${idx + 1}`)}
                                                    className={`h-1.5 rounded-full transition-all ${
                                                        idx === activeIndex
                                                            ? 'flex-[2] bg-slate-900 dark:bg-white'
                                                            : 'flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveIndex(
                                                        (activeIndex - 1 + reviews.length) %
                                                            reviews.length,
                                                    )
                                                }
                                                aria-label={pick('Ulasan sebelumnya', 'Previous review')}
                                                className="w-7 h-7 rounded-full border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                            >
                                                <ChevronLeft className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setActiveIndex((activeIndex + 1) % reviews.length)
                                                }
                                                aria-label={pick('Ulasan berikutnya', 'Next review')}
                                                className="w-7 h-7 rounded-full border border-slate-200 dark:border-neutral-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                            >
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    )}

                    {/* Buyer Store Rating Form */}
                    {summary.canReview ? (
                        <form
                            onSubmit={handleSubmit}
                            className="rounded-2xl bg-[#f8fafc] dark:bg-[#0b101d] border border-slate-200/80 dark:border-neutral-800 p-4 sm:p-5 space-y-3"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {summary.userReview
                                        ? pick('Perbarui Rating Anda untuk Toko Ini', 'Update Your Rating for This Store')
                                        : pick('Beri Rating untuk Toko Ini', 'Rate This Store')}
                                </p>
                                <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                    {displayRating}/5 · {pick(RATING_LABELS[displayRating]?.id, RATING_LABELS[displayRating]?.en)}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5" role="radiogroup" aria-label={pick('Pilih bintang rating toko', 'Select store star rating')}>
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const filled = star <= displayRating;
                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setData('rating', star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            aria-label={pick(`Beri ${star} bintang`, `Give ${star} stars`)}
                                            className="p-1 rounded-lg hover:scale-110 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0267C1]"
                                        >
                                            <Star
                                                className={`w-6 h-6 transition-colors ${
                                                    filled
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-slate-300 dark:text-slate-700'
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.rating && (
                                <p className="text-xs text-rose-600 dark:text-rose-400">
                                    {errors.rating}
                                </p>
                            )}

                            <div>
                                <textarea
                                    rows={2}
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    placeholder={pick(
                                        'Bagikan pengalaman belanja, kondisi ikan, atau kualitas packing toko...',
                                        'Share your shopping experience, fish health, or store packing quality...',
                                    )}
                                    className="w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#111a30] px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[#0267C1] focus:ring-2 focus:ring-[#0267C1]/20 focus:outline-none"
                                />
                                {errors.comment && (
                                    <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                                        {errors.comment}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="h-10 px-5 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-[#0684E5] dark:hover:bg-[#0267C1] text-white text-xs sm:text-sm font-semibold transition disabled:opacity-50"
                                >
                                    {processing
                                        ? pick('Menyimpan...', 'Saving...')
                                        : summary.userReview
                                          ? pick('Perbarui Rating', 'Update Rating')
                                          : pick('Kirim Rating Toko', 'Submit Store Rating')}
                                </button>
                            </div>
                        </form>
                    ) : !auth?.user ? (
                        <div className="rounded-2xl border border-slate-200/80 dark:border-neutral-800 bg-[#f8fafc] dark:bg-[#0b101d] px-4 py-3.5 flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                {pick('Pernah berbelanja di', 'Shopped at')} <span className="font-semibold">{store.name}</span>?{' '}
                                {pick('Masuk untuk memberi rating toko.', 'Sign in to leave a store rating.')}
                            </p>
                            <Link
                                href="/login"
                                className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 dark:bg-white dark:text-slate-950 text-white text-xs font-semibold transition"
                            >
                                {pick('Masuk', 'Sign In')}
                            </Link>
                        </div>
                    ) : isOwner ? (
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            {pick(
                                'Anda mengelola toko ini, sehingga rating hanya dapat dikirim oleh pembeli.',
                                'You manage this store, so ratings can only be submitted by buyers.',
                            )}
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

function ReviewCard({ review }) {
    return (
        <div className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
            <ReviewCardContent review={review} />
        </div>
    );
}

function ReviewCardContent({ review }) {
    const { pick } = useLanguage();
    return (
        <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar user={review.user} className="w-9 h-9 text-xs" />
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                {review.user?.name || pick('Pembeli', 'Buyer')}
                            </p>
                            {review.is_verified_buyer && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-900 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                                    <CheckCircle2 className="w-3 h-3" />
                                    {pick('Pembeli Terverifikasi', 'Verified Buyer')}
                                </span>
                            )}
                        </div>
                        <div className="mt-1 flex items-center gap-0.5" aria-label={pick(`Rating ${review.rating} dari 5`, `Rating ${review.rating} out of 5`)}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-3.5 h-3.5 ${
                                        star <= review.rating
                                            ? 'fill-slate-900 text-slate-900 dark:fill-amber-400 dark:text-amber-400'
                                            : 'text-slate-300 dark:text-slate-700'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {review.created_at_formatted && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                        {review.created_at_formatted}
                    </span>
                )}
            </div>

            <p className="mt-3.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {review.comment
                    ? `“${review.comment}”`
                    : pick(
                          `Memberikan rating ${review.rating}/5 bintang untuk toko ini.`,
                          `Rated this store ${review.rating}/5 stars.`,
                      )}
            </p>
        </div>
    );
}

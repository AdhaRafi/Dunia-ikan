import { Head, Link, usePage } from '@inertiajs/react';
import BrandWordmark from '@/Components/BrandWordmark';
import { useLanguage } from '@/lib/i18n';

export default function HttpError({ status = 404 }) {
    const { pick } = useLanguage();
    const { props } = usePage();
    const authUser = props?.auth?.user;
    const isForbidden = Number(status) === 403;

    const title = isForbidden
        ? pick('403 Akses Ditolak', '403 Access Forbidden')
        : pick('404 Halaman Tidak Ditemukan', '404 Page Not Found');

    const headline = isForbidden ? '403' : '404';
    const messageLine1 = isForbidden
        ? pick('Ups! Anda tidak memiliki akses', 'Oops! You do not have permission')
        : pick('Ups! Sepertinya ada sambungan', 'Oops! Looks like something');
    const messageLine2 = isForbidden
        ? pick('untuk membuka halaman ini.', 'to access this page.')
        : pick('yang terputus.', 'went wrong.');

    return (
        <div className="min-h-screen w-full bg-white flex flex-col overflow-x-clip selection:bg-sky-200 selection:text-[#001454]">
            <Head title={title} />

            {/* Top Navigation */}
            <header className="w-full px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-2 flex items-center justify-between gap-4 shrink-0">
                <Link
                    href="/"
                    className="shrink-0 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#056BC4] rounded-lg"
                >
                    <BrandWordmark variant="default" className="h-8 sm:h-9" />
                </Link>

                <nav className="hidden sm:flex items-center gap-8 text-[13px] font-medium text-slate-600">
                    <Link href="/products" className="hover:text-[#056BC4] transition">
                        {pick('Katalog Ikan', 'Products')}
                    </Link>
                    <Link href="/guides" className="hover:text-[#056BC4] transition">
                        {pick('Panduan Ikan', 'Care Guides')}
                    </Link>
                    <Link href="/cart" className="hover:text-[#056BC4] transition">
                        {pick('Keranjang', 'Cart')}
                    </Link>
                </nav>

                {authUser ? (
                    <Link
                        href="/orders"
                        className="text-[13px] font-bold text-[#056BC4] hover:underline whitespace-nowrap"
                    >
                        {pick('Pesanan Saya', 'My Orders')}
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="text-[13px] font-bold text-[#056BC4] hover:underline whitespace-nowrap"
                    >
                        {pick('Masuk', 'Sign in')}
                    </Link>
                )}
            </header>

            {/* Full-Viewport Disconnected Plug & Edge-to-Edge Cables */}
            <main className="flex-1 flex flex-col justify-center pb-14 sm:pb-20">
                <div className="relative w-full">
                    <svg
                        viewBox="0 0 1000 176"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="w-full h-auto block text-[#056BC4]"
                    >
                        {/* Top disconnection spark ticks */}
                        <line x1="500" y1="10" x2="500" y2="26" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                        <line x1="482" y1="16" x2="490" y2="28" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
                        <line x1="518" y1="16" x2="510" y2="28" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />

                        {/* Left hollow ribbon cable + S-loop */}
                        <path
                            d="M 0 156 L 236 156 A 24 24 0 0 0 236 108 L 186 108 A 20 20 0 0 1 186 68 L 398 68"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M 0 148 L 236 148 A 16 16 0 0 0 236 116 L 186 116 A 28 28 0 0 1 186 60 L 398 60"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Left Male Plug */}
                        <path
                            d="M 398 55 L 412 52 L 412 76 L 398 73 Z"
                            fill="white"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M 412 48 C 412 42 416 39 422 39 L 458 39 L 458 89 L 422 89 C 416 89 412 86 412 80 Z"
                            fill="white"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinejoin="round"
                        />
                        <line x1="427" y1="50" x2="427" y2="78" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        <line x1="441" y1="50" x2="441" y2="78" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        <rect x="458" y="49" width="20" height="7" rx="2" fill="white" stroke="currentColor" strokeWidth="2.6" />
                        <rect x="458" y="72" width="20" height="7" rx="2" fill="white" stroke="currentColor" strokeWidth="2.6" />

                        {/* Right Female Receptacle */}
                        <path
                            d="M 522 39 L 578 39 C 584 39 588 42 588 48 L 588 80 C 588 86 584 89 578 89 L 522 89 Z"
                            fill="white"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinejoin="round"
                        />
                        <line x1="533" y1="40" x2="533" y2="88" stroke="currentColor" strokeWidth="2.4" />
                        <line x1="559" y1="50" x2="559" y2="78" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        <line x1="573" y1="50" x2="573" y2="78" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        <path
                            d="M 588 52 L 602 55 L 602 73 L 588 76 Z"
                            fill="white"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinejoin="round"
                        />

                        {/* Right mirror hollow ribbon cable + S-loop */}
                        <path
                            d="M 602 60 L 814 60 A 28 28 0 0 1 814 116 L 764 116 A 16 16 0 0 0 764 148 L 1000 148"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M 602 68 L 814 68 A 20 20 0 0 1 814 108 L 764 108 A 24 24 0 0 0 764 156 L 1000 156"
                            stroke="currentColor"
                            strokeWidth="2.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    {/* Center Numeric Error Code & Copy */}
                    <div className="px-6 text-center mt-2 sm:-mt-[6.5%] relative z-10 space-y-4">
                        <h1 className="text-[80px] sm:text-[110px] lg:text-[124px] font-black leading-none tracking-tight text-[#252525]">
                            {headline}
                        </h1>

                        <p className="text-lg sm:text-[22px] font-medium text-[#2A2A2A] leading-snug max-w-md mx-auto">
                            {messageLine1}
                            <br />
                            {messageLine2}
                        </p>

                        <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-full bg-[#056BC4] hover:bg-[#0458A3] text-white text-sm font-bold px-8 py-3.5 shadow-[0_10px_24px_-6px_rgba(5,107,196,0.55)] transition cursor-pointer"
                            >
                                {pick('Kembali ke Beranda', 'Return home')}
                            </Link>

                            {isForbidden && authUser && (
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold px-6 py-3.5 transition cursor-pointer"
                                >
                                    {pick('Keluar & Ganti Akun', 'Log out & Switch Account')}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

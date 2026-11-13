import { Link } from '@inertiajs/react';
import { Fish } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-sky-50/70 via-white to-white py-12 px-4 sm:justify-center sm:px-6">
            <div className="mb-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-dunia-navy via-dunia-marine to-dunia-blue flex items-center justify-center text-white shadow-lg shadow-dunia-blue/25 group-hover:scale-105 transition-transform">
                        <Fish className="w-7 h-7 transform -rotate-12" />
                    </div>
                    <div>
                        <div className="font-extrabold text-2xl tracking-tight text-dunia-navy">
                            DUNIA<span className="text-dunia-blue">IKAN</span>
                        </div>
                        <p className="text-[10px] tracking-wider uppercase text-dunia-marine font-semibold -mt-1">
                            Morph & Fish Marketplace
                        </p>
                    </div>
                </Link>
            </div>

            <div className="w-full sm:max-w-md bg-white p-8 rounded-3xl border border-sky-100 shadow-xl shadow-sky-900/5">
                {children}
            </div>
        </div>
    );
}

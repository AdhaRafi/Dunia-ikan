import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Fish, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillDemo = (email, password = 'password') => {
        setData({
            email,
            password,
            remember: true,
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk Akun - Dunia Ikan" />

            <div className="space-y-6">
                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-extrabold text-dunia-navy">
                        Masuk ke Dunia Ikan
                    </h2>
                    <p className="text-xs text-slate-500">
                        Masuk untuk berbelanja, mengelola toko penangkar, atau memantau transaksi.
                    </p>
                </div>

                {/* Demo Quick Fill Buttons */}
                <div className="p-3.5 rounded-2xl bg-sky-50/80 border border-sky-100 space-y-2 text-xs">
                    <p className="font-bold text-dunia-navy flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-dunia-marine" />
                        Pilih Akun Demo (Tugas Akhir):
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            type="button"
                            onClick={() => fillDemo('pembeli@duniaikan.test')}
                            className="py-1.5 px-2 bg-white rounded-lg border border-slate-200 hover:border-dunia-blue font-bold text-slate-700 text-[11px] transition"
                        >
                            Pembeli
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemo('penjual1@duniaikan.test')}
                            className="py-1.5 px-2 bg-white rounded-lg border border-slate-200 hover:border-dunia-blue font-bold text-slate-700 text-[11px] transition"
                        >
                            Penjual
                        </button>
                        <button
                            type="button"
                            onClick={() => fillDemo('admin@duniaikan.test')}
                            className="py-1.5 px-2 bg-white rounded-lg border border-slate-200 hover:border-dunia-blue font-bold text-slate-700 text-[11px] transition"
                        >
                            Admin
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 text-center">Password demo: <code>password</code></p>
                </div>

                {status && (
                    <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-4 text-xs">
                    <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Email</label>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full text-xs"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Password</label>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full text-xs"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            <span className="text-slate-600 font-medium">Ingat saya</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs font-semibold text-dunia-blue hover:underline"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 px-4 rounded-xl bg-dunia-blue hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-dunia-blue/20 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {processing ? 'Memproses Masuk...' : 'Masuk Sekarang'}
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
                        Belum memiliki akun?{' '}
                        <Link href="/register" className="font-bold text-dunia-blue hover:underline">
                            Daftar sebagai Pembeli
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}

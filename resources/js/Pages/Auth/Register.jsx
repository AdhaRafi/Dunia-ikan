import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar Akun Baru - Dunia Ikan" />

            <div className="space-y-6">
                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-extrabold text-dunia-navy">
                        Daftar Akun Dunia Ikan
                    </h2>
                    <p className="text-xs text-slate-500">
                        Buat akun pembeli untuk memesan ikan hias dan berkonsultasi dengan asisten AI.
                    </p>
                </div>

                <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-dunia-blue shrink-0" />
                    <span>Pendaftaran umum diperuntukkan bagi akun Pembeli. Ingin menjual ikan? Anda dapat membuka toko setelah masuk.</span>
                </div>

                <form onSubmit={submit} className="space-y-4 text-xs">
                    <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Nama Lengkap</label>
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="w-full text-xs"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Alamat Email</label>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full text-xs"
                            autoComplete="username"
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
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">Konfirmasi Password</label>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full text-xs"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={errors.password_confirmation} className="mt-1" />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 px-4 rounded-xl bg-dunia-blue hover:bg-sky-600 text-white font-bold text-sm shadow-md shadow-dunia-blue/20 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {processing ? 'Mendaftarkan Akun...' : 'Daftar Akun Pembeli'}
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-500">
                        Sudah punya akun?{' '}
                        <Link href="/login" className="font-bold text-dunia-blue hover:underline">
                            Masuk di Sini
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}

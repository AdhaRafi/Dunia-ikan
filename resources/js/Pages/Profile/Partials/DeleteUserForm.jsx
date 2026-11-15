import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useLanguage } from '@/lib/i18n';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const { pick } = useLanguage();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className="rounded-2xl bg-white dark:bg-[#0e1424] border border-slate-200/80 dark:border-neutral-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {pick('Hapus Akun', 'Delete Account')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    {pick(
                        'Menghapus akun akan menghapus seluruh data dan riwayat secara permanen.',
                        'Deleting your account will permanently erase all your data and history.'
                    )}
                </p>
            </div>

            <button
                type="button"
                onClick={() => setConfirmingUserDeletion(true)}
                className="shrink-0 px-3.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/70 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition"
            >
                {pick('Hapus Akun', 'Delete Account')}
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 dark:bg-[#0e1424]">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        {pick('Yakin ingin menghapus akun?', 'Are you sure you want to delete your account?')}
                    </h2>

                    <p className="mt-1.5 text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
                        {pick(
                            'Semua data akun akan dihapus permanen. Masukkan kata sandi Anda untuk konfirmasi.',
                            'All account data will be permanently deleted. Enter your password to confirm.'
                        )}
                    </p>

                    <div className="mt-4">
                        <TextInput
                            id="delete_account_password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-full"
                            isFocused
                            placeholder={pick('Kata sandi', 'Password')}
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <SecondaryButton onClick={closeModal}>
                            {pick('Batal', 'Cancel')}
                        </SecondaryButton>

                        <DangerButton disabled={processing}>
                            {pick('Hapus Permanen', 'Delete Permanently')}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}

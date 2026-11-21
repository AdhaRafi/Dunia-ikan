import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import TextInput from '@/Components/TextInput';

/**
 * Returns a live mismatch error when the confirmation field differs from password,
 * falling back to any server-side validation error.
 */
export function getPasswordConfirmationError(password, confirmation, serverError, pick) {
    if (confirmation && password !== confirmation) {
        return pick(
            'Konfirmasi kata sandi tidak sesuai dengan kata sandi.',
            'Password confirmation does not match.',
        );
    }

    return serverError || '';
}

/**
 * Password input wrapping TextInput with a show/hide visibility toggle.
 */
export default forwardRef(function PasswordInput(
    { className = '', wrapperClassName = '', invalid = false, ...props },
    ref,
) {
    const [visible, setVisible] = useState(false);

    return (
        <div className={`relative ${wrapperClassName}`}>
            <TextInput
                {...props}
                ref={ref}
                aria-invalid={invalid || undefined}
                type={visible ? 'text' : 'password'}
                className={`pr-10 ${invalid ? '!border-rose-500 focus:!border-rose-500 focus:!ring-rose-500/20 dark:!border-rose-500 ' : ''}${className}`}
            />
            <button
                type="button"
                onClick={() => setVisible((prev) => !prev)}
                aria-label={visible ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors focus:outline-none focus-visible:text-[#005A9D]"
            >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
});

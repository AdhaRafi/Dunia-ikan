import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import TextInput from '@/Components/TextInput';

/**
 * Password input wrapping TextInput with a show/hide visibility toggle.
 */
export default forwardRef(function PasswordInput(
    { className = '', wrapperClassName = '', ...props },
    ref,
) {
    const [visible, setVisible] = useState(false);

    return (
        <div className={`relative ${wrapperClassName}`}>
            <TextInput
                {...props}
                ref={ref}
                type={visible ? 'text' : 'password'}
                className={`pr-10 ${className}`}
            />
            <button
                type="button"
                onClick={() => setVisible((prev) => !prev)}
                aria-label={visible ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors focus:outline-none focus-visible:text-[#2448f5]"
            >
                {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    );
});

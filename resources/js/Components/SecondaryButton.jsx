export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `btn-motion press inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#131d33] px-5 py-2.5 text-sm font-semibold text-dunia-navy dark:text-slate-100 shadow-xs transition hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-dunia-blue disabled:opacity-50 ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

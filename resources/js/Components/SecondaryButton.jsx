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
                `btn-motion press inline-flex items-center justify-center bg-surface px-5 py-2.5 text-[16px] font-medium text-ink hover:bg-field3 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent disabled:opacity-50 ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

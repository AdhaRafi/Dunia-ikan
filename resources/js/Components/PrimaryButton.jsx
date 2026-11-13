export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `press inline-flex items-center justify-center bg-ink px-5 py-2.5 text-[16px] font-medium text-bone hover:bg-accent focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent disabled:opacity-50 ${
                    disabled && 'opacity-50'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}

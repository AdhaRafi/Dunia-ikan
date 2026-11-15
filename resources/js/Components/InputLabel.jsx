export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={`block text-[13px] font-semibold text-slate-700 dark:text-slate-200 ${className}`}
        >
            {value ? value : children}
        </label>
    );
}

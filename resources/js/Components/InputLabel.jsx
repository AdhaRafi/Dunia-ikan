export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={`block text-[16px] font-medium text-ink ${className}`}
        >
            {value ? value : children}
        </label>
    );
}

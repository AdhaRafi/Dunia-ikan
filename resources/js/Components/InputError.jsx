export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} role="alert" className={`text-[13px] font-medium text-rose-600 dark:text-rose-400 ${className}`}>
            {message}
        </p>
    ) : null;
}

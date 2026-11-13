export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={`text-[13px] text-field2 ${className}`}>
            {message}
        </p>
    ) : null;
}

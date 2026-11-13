export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'border-ink/60 bg-surface text-accent focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-accent ' + className
            }
        />
    );
}

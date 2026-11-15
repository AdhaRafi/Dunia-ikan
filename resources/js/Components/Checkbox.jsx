export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'h-4 w-4 rounded border-slate-300 dark:border-neutral-700 bg-white dark:bg-[#0b101d] text-[#2448f5] focus:ring-2 focus:ring-[#2448f5]/25 focus:ring-offset-0 ' + className
            }
        />
    );
}

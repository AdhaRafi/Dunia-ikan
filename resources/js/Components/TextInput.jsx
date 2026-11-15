import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'h-11 w-full rounded-xl border border-slate-200 dark:border-neutral-700 bg-white dark:bg-[#0b101d] px-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:border-[#2448f5] focus:ring-2 focus:ring-[#2448f5]/20 focus:outline-none ' +
                className
            }
            ref={localRef}
        />
    );
});

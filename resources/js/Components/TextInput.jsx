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
                'h-11 w-full border border-muted/70 bg-surface px-3 text-[16px] text-ink placeholder:text-muted focus:outline focus:outline-2 focus:outline-offset-0 focus:outline-accent ' +
                className
            }
            ref={localRef}
        />
    );
});

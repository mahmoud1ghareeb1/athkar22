import { useCallback, useRef } from 'react';

export const useLongPress = (
    callback: (data: any) => void,
    { delay = 300 } = {}
) => {
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const onStart = useCallback((data: any) => (event: React.TouchEvent | React.MouseEvent) => {
        timeout.current = setTimeout(() => {
            callback(data);
        }, delay);
    }, [delay, callback]);

    const onEnd = useCallback((_event: React.TouchEvent | React.MouseEvent) => {
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    }, []);

    const getHandlers = useCallback((data: any) => ({
        onTouchStart: onStart(data),
        onTouchEnd: onEnd,
        onMouseDown: onStart(data),
        onMouseUp: onEnd,
        onMouseLeave: onEnd,
    }), [onStart, onEnd]);

    return getHandlers;
};
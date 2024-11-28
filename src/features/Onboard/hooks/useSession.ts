import { useState, useEffect } from 'react';

export const useSession = () => {
    const [isStart, setIsStart] = useState(false);
    const [isSessionStart, setISessionStart] = useState(false);
    const [isSessionEnd, setISessionEnd] = useState(false);

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setISessionStart(true);
            setIsStart(true);
        }, 20 * 1000);
        return () => clearTimeout(timeOut);
    }, [])

    const addStart = (val: boolean) => {
        setISessionStart(val);
    }

    const addEnd = (val: boolean) => {
        setISessionEnd(val);
    }

    return {
        isStart,
        isSessionStart,
        isSessionEnd,

        addStart,
        addEnd,
    }
};
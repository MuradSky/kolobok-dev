import { useState, useEffect } from 'react';

export const useTriggerKey = (keys: string | null) => {
    const [key, setKey] = useState(keys || '');

    useEffect(() => {
        if (keys) setKey(keys);
    }, [keys]);

    const addTriggerKey = (key: string) => {
        setKey(key)
    }

    return {
        triggerKey: key,
        addTriggerKey,
    }
}
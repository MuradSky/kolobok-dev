
import { useState, useEffect } from 'react';
import { ContentProps, Data, DataParams, initParams } from '../types';
import { data } from '../data';

const randomNumber = (): number =>
    Math.floor(Math.random() * (1 - 0 + 1)) + 0;

export const useContent = ({ isStart, key }: ContentProps) => {
    const [current, setCurrent] = useState<DataParams>({ ...initParams });
    
    useEffect(() => {
        if (isStart && (data as Data)[key]) {
            const content = key === 'authLong' ? [(data as Data)[key].content[randomNumber()]] : (data as Data)[key].content;
            setCurrent({
                endTime: (data as Data)[key].endTime,
                content,
            });
        }
    }, [key, isStart]);

    const resetContent = () => {
        setCurrent({ ...initParams });
    }

    return {
        current,
        resetContent
    }
}
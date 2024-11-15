
import { useState, useEffect } from 'react';
import { ContentProps, Data, DataParams, initParams } from '../types';
import { data } from '../data';

export const useContent = ({ isStart, key }: ContentProps) => {
    const [current, setCurrent] = useState<DataParams>({...initParams});
    useEffect(() => {
        if (isStart && (data as Data)[key]) {
            setCurrent({
                endTime: (data as Data)[key].endTime,
                content: (data as Data)[key].content
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
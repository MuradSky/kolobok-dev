import { useEffect, useState } from 'react';
import { useBeforeUnload } from '../../../hooks';

export const createDate = () => {
    const data = new Date();
    data.setDate(data.getDate() + 1);
    return data.toString();
}

const useVisit = (isLogin: boolean) => {
    const [isLong, setIsLong] = useState(false);
    useBeforeUnload(() => {
        if (isLogin) localStorage.setItem('_kolobok_main_last_visit', createDate());
    });

    useEffect(() => {
        const lastDate = localStorage.getItem('_kolobok_main_last_visit');
        if (lastDate && isLogin) {
            setIsLong(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogin]);
    
    return {
        isLong,
    }
};

export default useVisit;
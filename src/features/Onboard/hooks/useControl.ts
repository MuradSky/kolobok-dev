import { useEffect } from 'react';
import { useMain } from '../../../store';
import { Control } from '../types';

export const useControl = ({ onUsed, onUsedOut }: Control) => {
    const { completeTriggers, isLocationUsed, addUsedLocation } = useMain();
    
    useEffect(() => {
        let count = 0;
        const callback = (e: MouseEvent) => {
            if (typeof window !== 'undefined'
                && (e.target as HTMLElement).closest('[data-action="mapping.click"]')
                && !isLocationUsed
            ){
                addUsedLocation(true);
                onUsed();
            } else  {
                count++
                if (count > 10
                    && !completeTriggers.includes('activeAction')
                    && completeTriggers.some(item => ['welcome', 'auth'].includes(item))
                ) {
                    onUsedOut();
                    count = 0;
                }
            }
        };
        window?.addEventListener('click', callback);
        return () => window?.removeEventListener('click', callback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLocationUsed, completeTriggers]);
};

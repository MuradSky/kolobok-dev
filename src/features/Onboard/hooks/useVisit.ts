import { useEffect } from 'react';
import { useMain } from '../../../store';
import { useBeforeUnload } from '../../../hooks';
import { createDate } from '../utils';

const useAuth = (isToken: boolean) => {
    const {
        completeTriggers,
        addIsLogin,
        addStartTrigger,
        lastVisit,
        addLastVisit
    } = useMain();


    useEffect(() => {
        addStartTrigger(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useBeforeUnload(() => {
        if (isToken) localStorage.setItem('_kolobok_main_last_visit', createDate());
    });

    useEffect(() => {
        const lastDate = localStorage.getItem('_kolobok_main_last_visit');
        if (lastDate) {
            addLastVisit(lastDate);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isToken) {
            addIsLogin(true);            
            if (!completeTriggers.includes('auth')) {
                addStartTrigger('auth');
            } else if (lastVisit) {
                const date = new Date().getTime();
                const lastDate = new Date(lastVisit).getTime();
                if (date > lastDate) {
                    addStartTrigger('authLong');
                }
            }
        } else {
            addIsLogin(false);
            if (!completeTriggers.includes('welcome')) {
                addStartTrigger('welcome');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isToken, lastVisit, completeTriggers]);
};

export default useAuth;
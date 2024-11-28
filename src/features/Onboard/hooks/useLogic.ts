import { useEffect, useRef, useState } from 'react';
import { useMain } from '../../../store';
import { data } from '../data';
import useVisit from './useVisit';

const timer = (ms: number, cb: () => void) => {
    return setTimeout(() => {
        if (cb) {
            cb();
        }
    }, ms * 1000);
}

const ranNum = (max: number): number =>
    Math.floor(Math.random() * (max - 0 + 1)) + 0;

export const useLogic = (isLogin: boolean) => {
    const { isLong } = useVisit(isLogin);
    const { completeTriggers, addCompleteTrigger } = useMain(state => state);
    const [isNext, setIsNext] = useState(false);
    const [isComplete, setIsComplete] = useState(true);
    const [isAbort, setIsAbort] = useState(false);
    const [isHide, setIsHide] = useState(false);
    const [triggers, setTriggers] = useState<string[]>(completeTriggers);
    const timeOut = useRef<number | null>(null);
    const init = useRef(false);

    const [config, setConfig] = useState({
        content: '',
        time: 0,
    });

    useEffect(() => {
        addCompleteTrigger(triggers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggers]);

    useEffect(() => {
        if (!init.current && (triggers.includes('welcome') || triggers.includes('auth'))) {
            setIsNext(true);
            setIsComplete(true);
            // console.log(init.current);
            init.current = true;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let timeOut: number | null = null;
        if (isAbort) {
            timeOut = timer(3, () => {
                setIsAbort(false);
            });
        }
        return () => clearTimeout(timeOut as number); 
    }, [isAbort]);

    useEffect(() => {
        return () => {
            clearTimeout(timeOut.current as number);
        }
    }, [])

    useEffect(() => {
        entrance();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLogin, isLong]);

    useEffect(() => {
        if (isNext) {
            setIsNext(false);
            onboardNext();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNext, triggers]);

    useEffect(() => {
        const handleClick = handlers();
        if (triggers.includes('welcome') || triggers.includes('auth')) {
            window.addEventListener('click', handleClick);   
        }
        return () => {
            window.removeEventListener('click', handleClick);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [triggers, isComplete]);

    const pushTrigger = (str: string) => {
        setTriggers(state => {
            const newSet = new Set(state);
            newSet.add(str);
            return Array.from(newSet);
        });
    }

    const handlers = () => {
        let count = 0;
        const activeAction = () => {
            count++;
            if (count > 25) {
                pushTrigger('activeAction');
                pushTrigger('repeadAdvice');
                setConfig({
                    content: data.activeAction.content[ranNum(2)],
                    time: data.activeAction.endTime,
                });
                setIsAbort(true);
                setIsComplete(false);
                count = 0;
            }

        }
        const handleClick = (e: MouseEvent) => {
            setIsHide(true);
            const control = (e.target as HTMLElement).closest('[data-action="mapping.click"]');
            const hasActiveAction = !triggers.includes('activeAction');
            const isAdvice = triggers.includes('advice');
            const isIntro = triggers.includes('welcome') || triggers.includes('auth');

            if (!control && hasActiveAction && isAdvice) {
                activeAction();
                return;
            }
            
            if (control && isIntro && !triggers.includes('checkLocation')) {
                pushTrigger('activeAction');
                pushTrigger('checkLocation');
                pushTrigger('beforeLocationInaction');
                setIsAbort(true);
                setIsComplete(false);
            }
        };
        return handleClick;
    }

    const entrance = () => {
        if (isLogin && isLong) {
            setIsComplete(false);
            const timeOut = timer(3, () => {
                setConfig({
                    content: data.authLong.content[ranNum(1)],
                    time: data.authLong.endTime,
                });
            });
            return () => clearTimeout(timeOut);
        }
        
        if (isLogin) {
            const hasFirstLogin = !triggers.includes('auth');
            if (hasFirstLogin) {
                setIsComplete(false);
                timeOut.current = timer(3, () => {
                    pushTrigger('auth');
                    setConfig({
                        content: data.auth.content[0],
                        time: data.auth.endTime,
                    });
                });
                return;
            }
            
           
        } else {
            const hasFirstIn = !triggers.includes('welcome');
            if (hasFirstIn) {
                setIsComplete(false);
                timeOut.current = timer(3, () => {
                    pushTrigger('welcome');
                    setConfig({
                        content: data.welcome.content[ranNum(2)],
                        time: data.welcome.endTime,
                    });
                });
            }
        }
    };

    const onboardNext = () => {
        if (!isComplete) return;
        clearTimeout(timeOut.current as number);
        const hasAdvice = !triggers.includes('advice');
        const hasRepAdvice = !triggers.includes('repeadAdvice');
        const hasInactionBefore = !triggers.includes('beforeLocationInaction');
        const hasInactionAfter = !triggers.includes('afterLocationInaction');
        const isCheckLocation = triggers.includes('checkLocation');
        setIsComplete(false);
    
        if (hasInactionAfter && isCheckLocation) {
            timeOut.current = timer(10, () => {
                pushTrigger('afterLocationInaction');
                setConfig({
                    content: data.inaction.content[ranNum(2)],
                    time: data.inaction.endTime,
                });
            });
            return;
        }

        if (hasAdvice && !isCheckLocation) {
            timeOut.current = timer(3, () => {
                pushTrigger('advice');
                setConfig({
                    content: data.advice.content[ranNum(1)],
                    time: data.advice.endTime,
                });
            });
            return;
        }

        if (hasInactionBefore && !isCheckLocation) {
            timeOut.current = timer(15, () => {
                pushTrigger('beforeLocationInaction');
                setConfig({
                    content: data.inaction.content[0],
                    time: 25,
                });
            });
            return;
        }

        if (hasRepAdvice && !hasAdvice && !isCheckLocation) {
            timeOut.current = timer(20, () => {
                pushTrigger('repeadAdvice');
                setConfig({
                    content: data.repeadAdvice.content[ranNum(1)],
                    time: data.repeadAdvice.endTime,
                });
            });
            return;
        }
    }

    const restart = () => {
        clearTimeout(timeOut.current as number);
        setConfig({
            content: '',
            time: 0,
        });
        setIsComplete(true);
        setIsNext(true);
        setIsHide(false);
    }
    
    return {
        isAbort,
        restart,
        config,
        isHide,
    };
};
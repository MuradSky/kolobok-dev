export const useTimeout = () => {
    const trigger = (ms: number, cb: ()=> void) => {
        const timeOut = setTimeout(() => {
            clearTimeout(timeOut);
            cb();
        }, ms * 1000) 
        
        return ()=> clearTimeout(timeOut);
    };

    return {
        trigger
    };
};
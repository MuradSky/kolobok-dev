import { useRef, useState, useEffect } from 'react';
import { ExpectationProps } from "../types";
import { setTimeByTrigger } from "../utils";

export const useExpectation = ({
    isSessionEnd,
    isStart,
    triggerKey,
    callBack,
}: ExpectationProps) => {
    const [expectation, setExpectation] = useState<null | number>(null);
    const expectationTimer = useRef(0);

    useEffect(() => {
        if (isStart && isSessionEnd) {
            setExpectation(setTimeByTrigger(triggerKey));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStart, isSessionEnd]);

    useEffect(() => {
        clearTimeout(expectationTimer.current);
        if (expectation && expectation > 0 && isSessionEnd) {
            expectationTimer.current = setTimeout(() => {
                setExpectation(null);
                if (callBack) callBack();
            }, (expectation || 0) * 1000)   
        }
        return ()=> clearTimeout(expectationTimer.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expectation, isSessionEnd]);

    const handleUpdate = (key: string) => {
        setExpectation(setTimeByTrigger(key));
    }
    
    return {
        handleUpdate
    }
}
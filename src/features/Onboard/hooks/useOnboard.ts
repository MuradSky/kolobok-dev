import { useMain } from '../../../store';
import useVisit from './useVisit';
import { useTriggerKey } from './useTriggerKey';
import { useSession } from './useSession';
import { useContent } from './useContent';

import { Props } from '../types';
import { setTrigger } from '../utils';
import { useExpectation } from './useExpectation';
import { useControl } from './useControl';

export const useOnboard = ({
    isLogin
}: Props) => {
    useVisit(isLogin);
    const {
        isLocationUsed,
        completeTriggers,
        startTrigger,
        addCompleteTrigger,
    } = useMain();

    const { triggerKey, addTriggerKey } = useTriggerKey(startTrigger);
    const { isStart, isSessionStart, isSessionEnd, addStart, addEnd} = useSession();
    const { current, resetContent } = useContent({ isStart: isSessionStart, key: triggerKey });

    const { handleUpdate } = useExpectation({
        isSessionEnd,
        isStart,
        triggerKey,
        callBack: completeSession,
    });

    useControl({
        onUsed: () => {
            addTriggerKey('locationUsed');
            handleUpdate('locationUsed');
        },
        onUsedOut() {
            addTriggerKey('activeAction');
            handleUpdate('activeAction');
        }
    });

    function completeSession() {
        addEnd(false);
        addStart(true);
        setTrigger(
            triggerKey,
            addTriggerKey,
            completeTriggers,
            isLocationUsed,
        );
    }

    const endSession = () => {
        if (triggerKey === 'activeAction') {
            addTriggerKey('repeat');
            handleUpdate('repeat')
        };
        addEnd(true);
        addStart(false);
        resetContent();
       
        addCompleteTrigger(triggerKey);
    }
    
    return {
        current,
        endSession,
    }
}
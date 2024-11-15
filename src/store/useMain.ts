import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface State {
    isFirstVisite: boolean, 
    isLogin: boolean,
    lastVisit: null | string,
    isLongVisit: boolean,
    startTrigger: null | string,
    completeTriggers: string[],
    isLocationUsed: boolean,
    addCompleteTrigger: (v: string) => void;
    addStartTrigger: (v: string | null) => void;
    addIsLogin: (v: boolean) => void;
    addUsedLocation: (v: boolean) => void;
    addLastVisit: (v: string) => void;
};

const useMain = create<State>()(
    persist((set, get) => ({
        startTrigger: null,
        completeTriggers: [],
        isFirstVisite: false,
        isLogin: false,
        lastVisit: null,
        isLongVisit: false,
        isLocationUsed: false,
        addUsedLocation(isLocationUsed) {
            set({ isLocationUsed });
        },
        addLastVisit(lastVisit) {
            set({
                lastVisit,
            });
        },
        addIsLogin(isLogin) {
            set({ isLogin });
        },
        addStartTrigger(startTrigger) {
            set({ startTrigger });
        },
        addCompleteTrigger(trigger) {            
            const triggers = get().completeTriggers;
            if (!triggers.includes(trigger)) {
                set({ completeTriggers: [...triggers, trigger] });
            }
            if (trigger === 'welcome') {
                set({ isFirstVisite: true });
            }
        }
    }),
    {
        name: '_kolobok_main_',
        storage: createJSONStorage(() => localStorage),
    },
));

export { useMain };

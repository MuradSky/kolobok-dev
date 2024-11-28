import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface State {
    completeTriggers: string[],
    addCompleteTrigger: (v: string[]) => void;
};

const useMain = create<State>()(
    persist((set) => ({
        completeTriggers: [],
        addCompleteTrigger(completeTriggers) {            
            set({ completeTriggers });
        }
    }),
    {
        name: '_kolobok_main_',
        storage: createJSONStorage(() => localStorage),
    },
));

export { useMain };

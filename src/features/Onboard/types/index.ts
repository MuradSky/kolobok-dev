export interface DataParams {
    inactionBroder?: number,
    endTime: number,
    content: string[];
}

export interface Data {
    [key: string]: DataParams;
}

export interface ContentProps {
    isStart: boolean;
    key: string;
}

export interface Props {
    isLogin: boolean;
}

export const initParams = {
    endTime: 0,
    content: [],
}

export interface ExpectationProps {
    triggerKey: string;
    isStart: boolean;
    isSessionEnd: boolean;
    callBack?: () => void;
}

export interface Control {
    onUsed: () => void;
    onUsedOut: () => void;
}
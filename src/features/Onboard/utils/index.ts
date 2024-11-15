export const setTimeByTrigger = (k: string) => {
    if (k === 'activeAction') {
        return .1;
    }

    if (['welcome', 'auth', 'authLong', 'locationUsed', 'repeat'].includes(k)) {
        return 10;
    }
    if (k === 'advice') {
        return 5;
    }
    return 0;
}

export const setTrigger = (
    key: string,
    setKey: (v: string) => void,
    complete: string[],
    isLocationUsed: boolean
) => {    
    if (key === 'repeat'
        && complete.some(e => ['welcome', 'auth'].includes(e))
        && !complete.includes('advice')
    ) {
        return setKey('advice');
    }

    if (key === 'activeAction') {
        return setKey('activeAction');
    }

    if (key === 'locationUsed') {
        return setKey(
            'inaction',
        );
    }
    if (key === 'auth' && !isLocationUsed) {
        return setKey(
            key === 'auth' ?
                'advice' :
                key === 'advice' ? 'repeadAdvice' : ''
        );
    }

    setKey(
        key === 'welcome' ?
            'advice' : key === 'advice' ? 'repeadAdvice' : ''
    );
}

export const createDate = () => {
    const data = new Date();
    data.setMinutes(data.getMinutes() + 1);
    return data.toString();
}
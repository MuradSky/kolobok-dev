import { FC, memo, useState } from 'react';

import { useOnboard } from './hooks';
import Kolobok from '../../components/kolobok';
import styles from './Onboard.module.scss';

interface OnboardProps {
    isToken: boolean;
};

const Onboard:FC<OnboardProps> = () => {
    const [isToken, setIsToken] = useState(false);
    const { current, endSession } = useOnboard({ isToken });
    
    const onClick = () => setIsToken(true); 

    return (
        <div className={styles.block}>
            <div className={styles.btn}>
                <button onClick={onClick}>🔒 Авторизая</button>
            </div>
            <div className={styles.control}>
                <button data-action="mapping.click">⬅️ В лево</button>
                <button data-action="mapping.click">В перед ⬆️</button>
                <button data-action="mapping.click">В право ➡️</button>
            </div>

            <Kolobok
                endTime={current.endTime}
                source={current.content}
                onEndSession={endSession}
            />
        </div>
    );
};

export default memo(Onboard);

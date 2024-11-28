import { FC, memo } from 'react';
import Kolobok from '../../components/kolobok';
import styles from './Onboard.module.scss';
import { useScreenSize } from '../../hooks';
import { useLogic } from './hooks';

interface OnboardProps {
    isLogin: boolean;
};

const Component = ({ isLogin }: OnboardProps) => {
    const { restart, config, isAbort, isHide } = useLogic(isLogin);
    return (
        <div className={styles.block}>
            <Kolobok
                isHide={isHide}
                isAbort={isAbort}
                endTime={config.time}
                source={config.content !== '' ? [config.content] : []}
                onEndSession={restart}
            />
        </div>
    );
}

const Onboard:FC<OnboardProps> = ({ isLogin }: OnboardProps) => {
    const { isMobile } = useScreenSize();
    if (isMobile) {
        return null;
    }
    return <Component isLogin={isLogin} />
};

export default memo(Onboard);

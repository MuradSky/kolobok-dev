import { memo } from 'react';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';

import kolobok from '../../assets/icon/kolobok.png';
import icon from '../../assets/icon/icon.svg';
import styles from './Kolobok.module.scss';
import { useAnimation } from './hooks';

import 'swiper/css';

interface KolobokProsp {
    isAbort: boolean;
    isHide: boolean;
    onEndSession: () => void;
    endTime: number;
    source: string[];
}

const Kolobok = ({ endTime, source, isHide, onEndSession, isAbort }: KolobokProsp) => {
    const { content, root, setSwiper } = useAnimation({
        isAbort,
        isHide,
        isOpen: (source.length > 0 && endTime > 0),
        endTime,
        content: source,
        onEndSession,
    });

    return (
        <div className={styles.block} ref={root}>
            <div className={styles.body} data-selector="root.body">
                <img src={icon} alt="" width={20} height={20} className={styles.icon_1} />
                <img src={icon} alt="" width={20} height={20} className={styles.icon_2} />
                <img src={icon} alt="" width={20} height={20} className={styles.icon_3} />

                <div className={styles.head}>
                    <img src={kolobok} alt="" width={40} height={40} />
                    <span>Колобок:</span>
                </div>
                <div className={styles.content} data-selector="root.content">
                    <Swiper
                        allowTouchMove={false} 
                        speed={1000}
                        loop={false}
                        onSwiper={(swiper: SwiperClass) => setSwiper(swiper)}
                        className={styles.slider}
                        // autoHeight={true}
                        cubeEffect={{
                            shadow: true,
                            slideShadows: true,
                            shadowOffset: 20,
                            shadowScale: 0.94,
                        }}
                    >
                        {content?.map((item: string, i) => (
                            <SwiperSlide key={i}>
                                {item}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <div className={styles.loader_wrap} data-selector="root.loader">
                    <div className={styles.loader} />
                </div>
            </div>
        </div>
    );
};

export default memo(Kolobok);

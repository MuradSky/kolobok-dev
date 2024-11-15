import { memo } from 'react';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';

import styles from './Kolobok.module.scss';
import { useAnimation } from './hooks';

import 'swiper/css';

interface KolobokProsp {
    onEndSession: () => void;
    endTime: number;
    source: string[];
}

const Kolobok = ({ endTime, source, onEndSession }: KolobokProsp) => {
    const { content, root, setSwiper } = useAnimation({
        isOpen: (source.length > 0 && endTime > 0),
        endTime,
        content: source,
        onEndSession,
    });

    return (
        <div className={styles.block} ref={root}>
            <div className={styles.body} data-selector="root.body">
                <div className={styles.head}></div>
                <div className={styles.content} data-selector="root.content">
                    <Swiper
                        allowTouchMove={false} 
                        speed={1000}
                        loop={false}
                        onSwiper={(swiper: SwiperClass) => setSwiper(swiper)}
                        className={styles.slider}
                        autoHeight={true}
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

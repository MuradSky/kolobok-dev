import { useTimeout } from '../../../hooks';
import { useEffect, useRef, useState } from "react";
import { SwiperClass } from "swiper/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface Props {
    isOpen: boolean;
    endTime: number;
    content: string[] | null;
    onEndSession: () => void;
}

export const useAnimation = (props: Props) => {
    const root = useRef<HTMLDivElement | null>(null);
    const endTimer = useRef<number | null>(null);
    const isOpen = useRef(false);
    const [swiper, setSwiper] = useState<SwiperClass | null>(null);
    const [isLoader, setLoader] = useState(false);
    const [isShowContent, setIsShowContent] = useState(false);
    const [contentCount, setContentCount] = useState(1);
    const [isEnding, setIsEnding] = useState(false);
    const [content, setContent] = useState<string[] | null>(null);
    const { trigger } = useTimeout();
    
    const [isShowing, setIsShowing] = useState(false);
    
    useEffect(() => {
        if (props.isOpen) {
            isOpen.current = true;
        }
    }, [props.isOpen]);

    useEffect(() => {
        const callBack = () => {
            if (endTimer.current && isEnding) {
                clearTimeout(endTimer.current);
                setIsShowContent(false);
            }
        };
        document.addEventListener('click', callBack);
        return () => document.removeEventListener('click', callBack);
    }, [isShowing, isEnding]);

    // Show popup
    useEffect(() => {
        const timeOut = setTimeout(() => {
            clearTimeout(timeOut);
            if (isOpen.current) {
                setIsShowing(true);
                setContent(props.content)
            }
        }, 1000);
        return ()=> clearTimeout(timeOut);
    }, [isOpen, props.content]);

    useEffect(() => {
        endTimer.current = setTimeout(() => {
            if (endTimer.current) clearTimeout(endTimer.current);
            if (isEnding) setIsShowContent(false);
        }, props.endTime * 1000);
        return () => {
            if (endTimer.current) clearTimeout(endTimer.current);
        }
    }, [isEnding, props.endTime]);


    useEffect(() => {
        const callBack = () => {
            trigger(3, () => {
                setIsEnding(true)
            });
        }
        if (swiper?.isEnd) {
            trigger(3, () => setIsEnding(true));
        }

        const timeOut = setTimeout(() => {
            clearTimeout(timeOut);
            if (isShowContent && swiper) {
                swiper.slideNext();
                setContentCount(contentCount + 1)
            }
        }, 3000);
        swiper?.on('reachEnd', callBack);
        return () => {
            swiper?.off('reachEnd', callBack);
            clearTimeout(timeOut);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isShowContent, swiper, contentCount]);

    useGSAP(() => {
        if (root.current) { 
            gsap.set('[data-selector="root.body"]', {
                x: -1000,
            });
        }
    }, {
        scope: root,
    })

    useGSAP(() => {
        if (root.current) { 
            const block = document.querySelector<HTMLDivElement>('[data-selector="root.content"]');
            const rect = block?.querySelector<HTMLDivElement>('div')?.getBoundingClientRect();
            if (isShowContent) {
                gsap.to('[data-selector="root.content"]', {
                    maxHeight: (rect ? rect.height : 0) + 32,
                    opacity: 1,
                    onComplete() {
                        if (block) {
                            block.style.maxHeight = 'initial';
                        }
                    }
                });
            } else {
                if (block) {
                    block.style.maxHeight = (rect ? rect.height : 0) + 32+'px';
                }
                gsap.to('[data-selector="root.content"]', {
                    maxHeight: 0,
                    delay: .1,
                    opacity: 0,
                    onComplete() {
                        setIsShowing(false);
                    }
                });
            }
        }
    }, {
        scope: root,
        dependencies: [isShowContent]
    })

    useGSAP(() => {
        if (root.current) { 
            if (isLoader) {
                gsap.to('[data-selector="root.loader"]', {
                    opacity: 1,
                    onComplete() {
                        trigger(1, () => {
                            gsap.to('[data-selector="root.loader"]', {
                                opacity: 0,
                            });
                            setIsShowContent(true);
                        })
                    }
                });
            } else {
                gsap.to('[data-selector="root.loader"]', {
                    opacity: 0,
                });
            }
        }
    }, {
        scope: root,
        dependencies: [
            isLoader
        ],
    
    })
    
    useGSAP(() => {
        if (root.current) {
            if (isShowing) {
                gsap.to('[data-selector="root.body"]', {
                    x: 0,
                    onComplete() {
                        setLoader(true);
                    }
                });
            } else {
                gsap.to('[data-selector="root.body"]', {
                    x: -1000,
                    onComplete() {
                        if (isEnding) {
                            props.onEndSession();
                            setIsEnding(false);
                        }
                        setLoader(false);
                        isOpen.current = false;
                        if (swiper) {
                            swiper.slideTo(0);
                        }
                    }
                });
            }
        }
    }, { scope: root, dependencies: [isShowing, isEnding] })
    
    return {
        root,
        content,
        setSwiper
    };
};
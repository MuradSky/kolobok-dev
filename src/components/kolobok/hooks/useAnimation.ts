import { useTimeout } from '../../../hooks';
import { useEffect, useRef, useState } from "react";
import { SwiperClass } from "swiper/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface Props {
    isAbort: boolean;
    isHide: boolean;
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
        if (props.isHide && isEnding) {
            clearTimeout(endTimer.current as number);
            const timeOut = setTimeout(() => {
                setIsEnding(true);
                props?.onEndSession();
                setIsShowContent(false);
                setIsShowing(false);
            }, 3000);
            return () => clearTimeout(timeOut);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.isHide, isEnding]);

    useEffect(() => {
        const callBack = () => {
            if (endTimer.current && isEnding && !props.isAbort) {
                clearTimeout(endTimer.current);
                setIsShowContent(false);
            }
        };
        window.addEventListener('click', callBack);
        return () => window.removeEventListener('click', callBack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            if (isEnding) setIsShowContent(false);
        }, props.endTime * 1000);
        return () => {
            clearTimeout(endTimer.current as number);
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
            if (isShowContent || props.isAbort) {
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
        dependencies: [isShowContent, props.isAbort]
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
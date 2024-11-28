import { useState, useMemo, useEffect } from 'react';

export const useScreenSize = () => {
    const [screenWidth, setScreenWidth] = useState<number | null>(null);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isSmallDesktop = useMemo(
        () => (screenWidth ? screenWidth <= 1280 : false),
        [screenWidth],
    );
    const isTablet = useMemo(() => (screenWidth ? screenWidth <= 1024 : false), [screenWidth]);
    const isMobile = useMemo(() => (screenWidth ? screenWidth <= 768 : false), [screenWidth]);
    const isMobileSm = useMemo(() => (screenWidth ? screenWidth <= 500 : false), [screenWidth]);
    return { isMobile, isTablet, isSmallDesktop, isMobileSm };
};

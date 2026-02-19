
import { useMediaQuery } from 'react-responsive';

export const useIsMobileOrTablet = () => {
    return useMediaQuery({ query: '(max-width: 768px)' });
};

export const useIsMobile = () => {
    return useMediaQuery({ query: '(max-width: 480px)' });
};

export const useIsDesktop = () => {
    return useMediaQuery({ query: '(min-width: 769px)' });
};

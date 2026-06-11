
'user client'
import { useMediaQuery } from 'react-responsive';

export const useIsMobile = () => {
    return useMediaQuery({ query: '(max-width: 868px)' });
};

export const useIsDesktop = () => {
    return useMediaQuery({ query: '(min-width: 969px)' });
};


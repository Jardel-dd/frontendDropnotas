import { useEffect } from 'react';

const useEnterKeyNavigation = (callback: () => void) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                callback();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [callback]);
};

export default useEnterKeyNavigation;

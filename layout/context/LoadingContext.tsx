import React, { createContext, useState, ReactNode } from 'react';

interface LoadingContextType {
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextType>({
    loading: false,
    setLoading: () => {}
});

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};
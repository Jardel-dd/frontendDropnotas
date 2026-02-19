import React, { useState, createContext, ReactNode } from 'react';

interface MenuContextProps {
    activeMenu: string | null;
    setActiveMenu: React.Dispatch<React.SetStateAction<string | null>>;
}

export const MenuContext = createContext<MenuContextProps>({
    activeMenu: null,
    setActiveMenu: () => {}
});
export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    return (
        <MenuContext.Provider value={{ activeMenu, setActiveMenu }}>
            {children}
        </MenuContext.Provider>

    );
};
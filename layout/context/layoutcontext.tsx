'use client'
import React, {useState } from 'react';
import { UserProvider, useUser } from '@/app/routes/protected/UserContext';
import type { ChildContainerProps, LayoutContextProps, LayoutConfig, LayoutState, Breadcrumb } from '@/types';

export const LayoutContext = React.createContext({} as LayoutContextProps);

export const LayoutProvider = (props: ChildContainerProps) => {
     const { userConta } = useUser();
    const [tabs, setTabs] = useState<any[]>([]);
    const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);
    const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>({
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'slim-plus',  
        colorScheme: 'dark',
        componentTheme: 'green',
        scale: 14,
        theme: 'green',
        menuTheme: 'dark',
        layoutTheme: 'colorScheme',
        topBarTheme: 'colorScheme'
    });
    const [layoutState, setLayoutState] = useState<LayoutState>({
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        configSidebarVisible: false,
        profileSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
        rightMenuActive: false,
        topbarMenuActive: false,
        sidebarActive: false,
        anchored: false,
        overlaySubmenuActive: false,
        menuProfileActive: false,
        resetMenu: false
    });
    const onMenuProfileToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            menuProfileActive: !prevLayoutState.menuProfileActive
        }));
    };
    React.useEffect(() => {
    if (!userConta?.tema_componente) return;
    const tema = userConta.tema_componente.toLowerCase();
    const colorScheme: 'light' | 'dark' = tema === 'light' ? 'light' : 'dark'; 
    setLayoutConfig(prev => ({
        ...prev,
        theme: tema,       
        colorScheme,   
    }));
}, [userConta]);
    const isSidebarActive = () => layoutState.overlayMenuActive || layoutState.staticMenuMobileActive || layoutState.overlaySubmenuActive;
    const onMenuToggle = () => {
        if (isOverlay()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                overlayMenuActive: !prevLayoutState.overlayMenuActive
            }));
        }

        if (isDesktop()) {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive
            }));
        } else {
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive
            }));
        }
    };
    const isOverlay = () => layoutConfig.menuMode === 'overlay';
    const isSlim = () => layoutConfig.menuMode === 'slim';
    const isSlimPlus = () => layoutConfig.menuMode === 'slim-plus';
    const isHorizontal = () => layoutConfig.menuMode === 'horizontal';
    const isDesktop = () => typeof window !== 'undefined' && window.innerWidth > 991;
    const onTopbarMenuToggle = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            topbarMenuActive: !prevLayoutState.topbarMenuActive
        }));
    };
    const showRightSidebar = () => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            rightMenuActive: true
        }));
    };
    const openTab = (value: number) => {
        setTabs((prevTabs) => [...prevTabs, value]);
    };
    const closeTab = (index: number) => {
        const newTabs = [...tabs];
        newTabs.splice(index, 1);
        setTabs(newTabs);
    };
    const value: LayoutContextProps = {
        layoutConfig,
        setLayoutConfig,
        layoutState,
        setLayoutState,
        onMenuToggle,
        isSlim,
        isSlimPlus,
        isHorizontal,
        isDesktop,
        isSidebarActive,
        breadcrumbs,
        setBreadcrumbs,
        onMenuProfileToggle,
        onTopbarMenuToggle,
        showRightSidebar,
        tabs,
        closeTab,
        openTab,
        setTabs
    };
    return (
        <UserProvider>
            <LayoutContext.Provider value={value}>{props.children}
            </LayoutContext.Provider>
        </UserProvider>
    );
};

import { useIsDesktop, useIsMobile } from "@/app/components/responsiveCelular/responsive";
import { LayoutContext } from "@/layout/context/layoutcontext";
import { CSSProperties, useContext } from "react";

export const useOnboardingStyles = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const isDarkMode = layoutConfig.colorScheme === 'dark';

    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();

    const onboardingWrapperStyle: CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.35rem',
        borderRadius: '999px',
        boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.28)',
        background: isDarkMode
            ? 'rgba(245, 158, 11, 0.12)'
            : 'rgba(255, 247, 237, 0.96)'
    };

    const onboardingMessageStyle: CSSProperties = {
        position: 'fixed',
        maxWidth: isMobile ? '12rem' : '16rem',
        padding: '0.65rem 0.85rem',
        borderRadius: '0.85rem',
        fontSize: '0.82rem',
        lineHeight: 1.35,
        fontWeight: 600,
        color: isDarkMode ? '#FFF7ED' : '#9A3412',
        background: isDarkMode ? '#7C2D12' : '#FFF7ED',
        border: '1px solid rgba(245, 158, 11, 0.45)',
        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.16)',
        zIndex: 1200,
        pointerEvents: 'none'
    };

    return {
        onboardingWrapperStyle,
        onboardingMessageStyle,
        isDesktop,
        isMobile
    };
};
'use client'
import './LoadingScreen.css';
import ReactDOM from 'react-dom';
import { useRive } from '@rive-app/react-canvas';
import loadingLogoDropDesk from '@/src/rives/dropdesk.riv';
import React, { useState, useEffect, useContext } from 'react';
import { LayoutContext } from '@/layout/context/layoutcontext';
import { useTheme } from '../components/isDarkMode/isDarkMode';

interface LoadingScreenProps {
    loadingText?: string;
    height?: number | string;
    fullScreen?: boolean;
}

const LoadingScreenComponent: React.FC<LoadingScreenProps> = ({
    loadingText,
    height,
    fullScreen = true,
}) => {
    const { isDarkMode, textColor } = useTheme();
    const { layoutConfig } = useContext(LayoutContext);

    const animationName = `loading-grey`;
    const { RiveComponent } = useRive({
        src: loadingLogoDropDesk,
        animations: animationName,
        autoplay: true,
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const opacity = 0.7;
    const bgColor = isDarkMode ? '#293B51' : '#fff';

    const content = (
        <div
            className="loading-container"
            style={
                fullScreen
                    ? {
                        backgroundColor: bgColor,
                        opacity,
                        position: 'fixed',
                        inset: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 9999,
                    }
                    : {
                        backgroundColor: bgColor,
                        opacity,
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 10,
                    }
            }
        >
            <RiveComponent style={{ height: height || 300 }} />

            {loadingText && (
                <div className="loading-text" style={{ color: textColor }}>
                    {loadingText}
                </div>
            )}
        </div>
    );

    return fullScreen ? ReactDOM.createPortal(content, document.body) : content;
};

export default LoadingScreenComponent;

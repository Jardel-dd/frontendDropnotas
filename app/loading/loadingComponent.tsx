'use client';

import './LoadingScreen.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { useRive } from '@rive-app/react-canvas';
import loadingLogoDropDesk from '@/src/rives/dropdesk.riv';
import { useTheme } from '../components/isDarkMode/isDarkMode';

interface LoadingScreenProps {
    loadingText?: string;
    height?: number | string;
    fullScreen?: boolean;
    overlayOpacity?: number;
}

type ContainerSize = {
    width: number;
    height: number;
};

const INLINE_MIN_HEIGHT = 88;
const INLINE_TEXT_EXTRA_HEIGHT = 44;

function LoadingScreenComponent({
    loadingText,
    height,
    fullScreen = true,
    overlayOpacity = 0.7
}: LoadingScreenProps) {
    const { isDarkMode, textColor } = useTheme();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = React.useState(false);
    const [containerSize, setContainerSize] = React.useState<ContainerSize>({
        width: 0,
        height: 0
    });

    const { RiveComponent } = useRive({
        src: loadingLogoDropDesk,
        animations: 'loading-grey',
        autoplay: true
    });

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!mounted) {
            return;
        }

        const element = containerRef.current;

        if (!element) {
            return;
        }

        const updateContainerSize = () => {
            if (fullScreen) {
                setContainerSize({
                    width: window.innerWidth,
                    height: window.innerHeight
                });

                return;
            }

            const elementRect = element.getBoundingClientRect();
            const parentRect = element.parentElement?.getBoundingClientRect();

            setContainerSize({
                width: Math.max(elementRect.width, parentRect?.width ?? 0, 0),
                height: Math.max(elementRect.height, parentRect?.height ?? 0, INLINE_MIN_HEIGHT)
            });
        };

        updateContainerSize();

        const resizeObserver = new ResizeObserver(() => {
            updateContainerSize();
        });

        resizeObserver.observe(element);

        if (element.parentElement) {
            resizeObserver.observe(element.parentElement);
        }

        window.addEventListener('resize', updateContainerSize);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateContainerSize);
        };
    }, [fullScreen, mounted]);

    if (!mounted) {
        return null;
    }

    const backgroundColor = isDarkMode ? '#293B51' : '#FFFFFF';
    const fallbackWidth = fullScreen ? 1280 : 320;
    const fallbackHeight = fullScreen ? 720 : INLINE_MIN_HEIGHT;
    const availableWidth = containerSize.width || fallbackWidth;
    const availableHeight = containerSize.height || fallbackHeight;

    const computedSize = fullScreen
        ? Math.max(140, Math.min(availableWidth * 0.24, availableHeight * 0.28, 300))
        : Math.max(42, Math.min(availableWidth * 0.24, availableHeight * 0.5, 140));

    const loaderSize = typeof height === 'number' && Number.isFinite(height) ? height : computedSize;
    const loaderSizeStyle = height ?? `${computedSize}px`;
    const minInlineHeight = Math.max(
        INLINE_MIN_HEIGHT,
        Math.round(loaderSize + (loadingText ? INLINE_TEXT_EXTRA_HEIGHT : 20))
    );
    const textSize = fullScreen
        ? Math.max(1, Math.min(loaderSize / 10, 1.2))
        : Math.max(0.75, Math.min(loaderSize / 8.5, 0.95));

    const content = (
        <div
            ref={containerRef}
            className={`loading-container ${fullScreen ? 'loading-container-fullscreen' : 'loading-container-inline'}`}
            style={{
                backgroundColor,
                opacity: overlayOpacity,
                width: fullScreen ? '100vw' : '100%',
                height: fullScreen ? '100vh' : '100%',
                minHeight: fullScreen ? '100vh' : `${minInlineHeight}px`,
                position: fullScreen ? 'fixed' : 'relative',
                inset: fullScreen ? 0 : 'auto',
                zIndex: fullScreen ? 9999 : 'auto',
                '--loading-rive-size': `${loaderSize}px`,
                '--loading-text-size': `${textSize}rem`
            } as React.CSSProperties}
        >
            <div className="loading-rive-shell" style={{ width: loaderSizeStyle, height: loaderSizeStyle, maxWidth: '100%' }}>
                <RiveComponent className="loading-rive" />
            </div>

            {loadingText && (
                <div className="loading-text" style={{ color: textColor }}>
                    {loadingText}
                </div>
            )}
        </div>
    );

    return fullScreen ? ReactDOM.createPortal(content, document.body) : content;
}

export type { LoadingScreenProps };
export default LoadingScreenComponent;

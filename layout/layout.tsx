'use client';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import { LayoutContext } from './context/layoutcontext';
import { classNames, DomHandler } from 'primereact/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import type { AppTopbarRef, ChildContainerProps } from '@/types';
import PrivateRoute from '@/app/routes/protected/protectedRoute';
import PermissionRouteGuard from '@/app/routes/protected/PermissionRouteGuard';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { setupLocale } from '@/app/components/calendarComponent/calendarTranslation/addLocale';
import { useEventListener, useResizeListener, useUnmountEffect } from 'primereact/hooks';


const Layout = (props: ChildContainerProps) => {
    const { layoutConfig, layoutState, setLayoutState, setLayoutConfig, isSlim, isSlimPlus, isHorizontal, isDesktop, isSidebarActive } = useContext(LayoutContext);
    const topbarRef = useRef<AppTopbarRef>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    let timeout: NodeJS.Timeout | null = null;
    setupLocale();
    const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] = useEventListener({
        type: 'click',
        listener: (event) => {
            const isOutsideClicked = !(
                sidebarRef.current?.isSameNode(event.target as Node) ||
                sidebarRef.current?.contains(event.target as Node) ||
                topbarRef.current?.menubutton?.isSameNode(event.target as Node) ||
                topbarRef.current?.menubutton?.contains(event.target as Node)
            );
            if (isOutsideClicked) {
                hideMenu();
            }
        }
    });
    const [bindDocumentResizeListener, unbindDocumentResizeListener] = useResizeListener({
        listener: () => {
            if (isDesktop() && !DomHandler.isTouchDevice()) {
                hideMenu();
            }
        }
    });
    const hideMenu = useCallback(() => {
        setLayoutState((prevLayoutState) => ({
            ...prevLayoutState,
            overlayMenuActive: false,
            overlaySubmenuActive: false,
            staticMenuMobileActive: false,
            menuHoverActive: false,
            resetMenu: (isSlim() || isSlimPlus() || isHorizontal()) && isDesktop()
        }));
    }, [isSlim, isHorizontal, isDesktop]);
    const blockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    };
    const unblockBodyScroll = () => {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    };
    const onMouseEnter = () => {
        if (!layoutState.anchored) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                sidebarActive: true
            }));
        }
    };
    const onMouseLeave = () => {
        if (!layoutState.anchored) {
            if (!timeout) {
                timeout = setTimeout(
                    () =>
                        setLayoutState((prevLayoutState) => ({
                            ...prevLayoutState,
                            sidebarActive: false
                        })),
                    300
                );
            }
        }
    };
    useEffect(() => {
        const onRouteChange = () => {
            if (layoutConfig.colorScheme === 'dark') {
                setLayoutConfig((prevState) => ({ ...prevState, menuTheme: 'dark' }));
            }
        };
        onRouteChange();
    }, [pathname, searchParams]);

    useEffect(() => {
        if (isSidebarActive()) {
            bindMenuOutsideClickListener();
        }

        if (layoutState.staticMenuMobileActive) {
            blockBodyScroll();
            (isSlim() || isSlimPlus() || isHorizontal()) && bindDocumentResizeListener();
        }

        return () => {
            unbindMenuOutsideClickListener();
            unbindDocumentResizeListener();
            unblockBodyScroll();
        };
    }, [layoutState.overlayMenuActive, layoutState.staticMenuMobileActive, layoutState.overlaySubmenuActive]);

    useEffect(() => {
        const onRouteChange = () => {
            hideMenu();
        };
        onRouteChange();
    }, [pathname, searchParams]);

    useEffect(() => {
        const visualViewport = window.visualViewport;

        if (!visualViewport) {
            return;
        }

        const keyboardThreshold = 120;
        let largestViewportHeight = visualViewport.height;
        let keyboardIsOpen = false;
        let restoreTimeout: number | null = null;
        let savedScrollPosition: { contentTop: number; pageX: number; pageY: number } | null = null;

        const isTextInput = (element: EventTarget | null): element is HTMLElement => {
            if (!(element instanceof HTMLElement)) {
                return false;
            }

            return element.matches('input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"]');
        };

        const saveScrollPosition = (event: FocusEvent) => {
            if (keyboardIsOpen || !isTextInput(event.target)) {
                return;
            }

            largestViewportHeight = visualViewport.height;
            savedScrollPosition = {
                contentTop: contentRef.current?.scrollTop ?? 0,
                pageX: window.scrollX,
                pageY: window.scrollY
            };
        };

        const restoreScrollPosition = () => {
            if (!savedScrollPosition) {
                return;
            }

            const { contentTop, pageX, pageY } = savedScrollPosition;
            const restore = () => {
                contentRef.current?.scrollTo({ top: contentTop });
                window.scrollTo({ left: pageX, top: pageY });
            };

            // Safari completes the keyboard-close animation after the resize
            // event. Applying the original position twice avoids retaining the
            // browser's automatic focus scroll.
            window.requestAnimationFrame(restore);
            restoreTimeout = window.setTimeout(restore, 180);
        };

        const updateKeyboardState = () => {
            const keyboardHeight = largestViewportHeight - visualViewport.height;
            const shouldTreatAsKeyboard = keyboardHeight > keyboardThreshold && isTextInput(document.activeElement);

            if (!keyboardIsOpen && shouldTreatAsKeyboard) {
                keyboardIsOpen = true;
                return;
            }

            if (keyboardIsOpen && keyboardHeight <= keyboardThreshold) {
                keyboardIsOpen = false;
                restoreScrollPosition();
                savedScrollPosition = null;
            }

            if (!keyboardIsOpen) {
                largestViewportHeight = Math.max(largestViewportHeight, visualViewport.height);
            }
        };

        document.addEventListener('focusin', saveScrollPosition);
        visualViewport.addEventListener('resize', updateKeyboardState);
        visualViewport.addEventListener('scroll', updateKeyboardState);

        return () => {
            document.removeEventListener('focusin', saveScrollPosition);
            visualViewport.removeEventListener('resize', updateKeyboardState);
            visualViewport.removeEventListener('scroll', updateKeyboardState);

            if (restoreTimeout) {
                window.clearTimeout(restoreTimeout);
            }
        };
    }, []);

    useUnmountEffect(() => {
        unbindMenuOutsideClickListener();
    });

    const containerClassName = classNames({
        'layout-slim': layoutConfig.menuMode === 'slim',
        'layout-slim-plus': layoutConfig.menuMode === 'slim-plus',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'p-input-filled': layoutConfig.inputStyle === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple,
        'layout-light': layoutConfig.layoutTheme === 'colorScheme' && layoutConfig.colorScheme === 'light',
        'layout-dark': layoutConfig.layoutTheme === 'colorScheme' && layoutConfig.colorScheme === 'dark',
        'layout-primary': layoutConfig.colorScheme !== 'dark' && layoutConfig.layoutTheme === 'primaryColor'
    });

    return (
        <React.Fragment>
            <PrivateRoute>
                <div className={classNames('layout-container', containerClassName)}>
                    <AppTopbar ref={topbarRef} />
                    <div ref={sidebarRef} className="layout-sidebar" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                        <AppSidebar />
                    </div>
                    <div className="layout-content-wrapper">
                        <div ref={contentRef} className="layout-content">
                            <div className="layout-content-inner">
                                <PermissionRouteGuard>{props.children}</PermissionRouteGuard>
                            </div>
                        </div>
                    </div>
                </div>
            </PrivateRoute>
        </React.Fragment>
    );
};

export default Layout;

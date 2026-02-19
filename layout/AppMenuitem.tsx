'use client';
import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { useRouter } from 'next/navigation';
import { classNames } from 'primereact/utils';
import type { AppMenuItemProps } from '@/types';
import { MenuContext } from './context/menucontext';
import { LayoutContext } from './context/layoutcontext';
import { usePathname, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSubmenuOverlayPosition } from './hooks/useSubmenuOverlayPosition';

const AppMenuitem = (props: AppMenuItemProps) => {
    const router = useRouter();
    const item: any = props.item;
    const pathname = usePathname() ?? '';
    const searchParams = useSearchParams();
    const menuitemRef = useRef<HTMLLIElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const submenuRef = useRef<HTMLUListElement>(null);
    const isChildRouteActive = (item: any): boolean => {
        if (!item?.items) return false;

        return item.items
            .filter(Boolean)
            .some((child: any) => {
                if (child.to && pathname.startsWith(child.to)) return true;
                return isChildRouteActive(child);
            });
    };
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const isActiveRoute = (item?.to && pathname.startsWith(item.to)) || isChildRouteActive(item);
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const active = activeMenu === key || !!(activeMenu && activeMenu.startsWith(key + '-'));
    const { isSlimPlus, isHorizontal, isDesktop, setLayoutState, layoutState, openTab } = useContext(LayoutContext);

    useSubmenuOverlayPosition({
        target: menuitemRef.current,
        overlay: submenuRef.current,
        container: menuitemRef.current && menuitemRef.current.closest('.layout-menu-container'),
        when: props.root && active && (isSlimPlus() || isHorizontal()) && isDesktop()
    });

    useEffect(() => {
        if (layoutState.resetMenu) {
            setActiveMenu('');
            setLayoutState((prevLayoutState) => ({
                ...prevLayoutState,
                resetMenu: false
            }));
        }
    }, [layoutState.resetMenu]);

    const itemClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (item!.disabled) {
            event.preventDefault();
            return;
        }

        if (props.root && (isHorizontal() || isSlimPlus())) {
            const isSubmenu = event.currentTarget.closest('.layout-root-menuitem.active-menuitem > ul') !== null;
            setLayoutState((prev) => ({
                ...prev,
                menuHoverActive: isSubmenu ? true : !prev.menuHoverActive
            }));
        }

        if (item?.command) {
            item.command({ originalEvent: event, item: item });
        }

        if (event.metaKey && item?.to && (!item?.data || !item?.data?.fullPage)) {
            router.push(item.to);
            openTab(item);
            event.preventDefault();
        }

        if (item?.items) {
            setActiveMenu(active ? props.parentKey! : key);
            if (props.root && !active && (isHorizontal() || isSlimPlus())) {
                setLayoutState((prev) => ({
                    ...prev,
                    overlaySubmenuActive: true
                }));
            }
        } else {
            if (!isDesktop()) {
                setLayoutState((prev) => ({
                    ...prev,
                    staticMenuMobileActive: !prev.staticMenuMobileActive
                }));
            }

            if (isSlimPlus() || isHorizontal()) {
                setLayoutState((prev) => ({
                    ...prev,
                    menuHoverActive: false
                }));
            }

            setActiveMenu(key);

            if (item?.to) {
                router.push(item.to);
            }
        }
    };

    const onMouseEnter = () => {
        setIsHovered(true);
        if (props.root && (isHorizontal() || isSlimPlus()) && isDesktop()) {
            if (!active && layoutState.menuHoverActive) {
                setActiveMenu(key);
            }
        }
    };

    const onMouseLeave = () => {
        setIsHovered(false);
    };

    const subMenu =
        item?.items && item?.visible !== false ? (
            <ul ref={submenuRef} className={classNames({ 'layout-root-submenulist': props.root })}>
                {item?.items
                    .filter(Boolean)
                    .map((child: any, i: number) => (
                        <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />
                    ))}
            </ul>
        ) : null;

    return (
        <li
            ref={menuitemRef}
            className={classNames({
                'layout-root-menuitem': props.root,
                'active-menuitem': active
            })}
        >
            {props.root && item?.visible !== false && (
                <div className="layout-menuitem-root-text" style={{ width: '98%' }}>
                    <a
                        href={item?.url}
                        onClick={(e) => itemClick(e)}
                        className={classNames(item?.class, 'p-ripple tooltip-target', {
                            'active-menuitem': isActiveRoute
                        })}
                        target={item?.target}
                        data-pr-tooltip={item?.label}
                        data-pr-disabled={!(props.root && !layoutState.menuHoverActive)}
                        tabIndex={0}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        {item?.root && <i className="pi pi-fw pi-angle-down layout-menuitem-root-text" />}
                        <i
                            className={classNames('layout-menuitem-icon', item?.icon)}
                            style={{
                                color: isActiveRoute || isHovered ? 'var(--primary-color)' : 'inherit'
                            }}
                        />
                        <span
                            className="layout-menuitem-text"
                            style={{
                                marginLeft: '0.5rem',
                                color: isActiveRoute || isHovered ? 'var(--primary-color)' : 'inherit'
                            }}
                        >
                            {item?.label}
                        </span>
                    </a>
                </div>
            )}

            {(!item?.to || item?.items) && item?.visible !== false && (
                <a
                    href={item?.url}
                    onClick={(e) => itemClick(e)}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className={classNames(item?.class, 'p-ripple tooltip-target', {
                        'active-menuitem': isActiveRoute
                    })}
                    target={item?.target}
                    data-pr-tooltip={item?.label}
                    data-pr-disabled={!(props.root && !layoutState.menuHoverActive)}
                    tabIndex={0}
                    style={{
                        backgroundColor: isActiveRoute && !isDesktop() ? 'var(--primary-color)' : 'transparent'
                    }}
                >
                    <i
                        className={classNames('layout-menuitem-icon', item?.icon)}
                        style={{
                            color: isActiveRoute || isHovered ? 'var(--primary-color)' : 'inherit'
                        }}
                    ></i>
                    <span
                        className="layout-menuitem-text"
                        style={{
                            color: isActiveRoute || isHovered ? 'var(--primary-color)' : 'inherit'
                        }}
                    >
                        {item?.label}
                    </span>
                    {item?.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                    <Ripple />
                </a>
            )}

            {item?.to && !item?.items && item?.visible !== false && (
                <Link
                    href={item?.to}
                    replace={item?.replaceUrl}
                    onClick={(e) => itemClick(e)}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    className={classNames(item?.class, 'p-ripple', {
                        'active-route': isActiveRoute
                    })}
                    tabIndex={0}
                >
                    <i
                        className={classNames('layout-menuitem-icon', item?.icon)}
                        style={{
                            color: isActiveRoute || isHovered ? 'var(--primary-color)' : 'inherit'
                        }}
                    ></i>
                    <span
                        className="layout-menuitem-text"
                        style={{
                            color: isActiveRoute || isHovered ? 'var(--primary-color)' : 'inherit'
                        }}
                    >
                        {item?.label}
                    </span>
                    <Ripple />
                </Link>
            )}

            {subMenu}
        </li>
    );
};

export default AppMenuitem;

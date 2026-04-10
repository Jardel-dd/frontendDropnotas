'use client';
import "./style.css";
import {useRef, useState} from 'react';
import "@/app/styles/styledGlobal.css";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FilterOverlayProps } from "./types/types";
import { OverlayPanel } from 'primereact/overlaypanel';
import { useIsDesktop, useIsMobile } from "../../responsiveCelular/responsive";

export const FilterOverlay: React.FC<FilterOverlayProps> = ({ children, onApply, onClear, width = '300px', mobileBreakpoint = 768, buttonLabel = 'Filtros', buttonIcon = 'pi pi-filter', buttonClassName = '' }) => {
    const op = useRef<OverlayPanel>(null);
    const [mobileVisible, setMobileVisible] = useState(false);
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toggle = (e?: any) => {
        if (isMobile) setMobileVisible(true);
        else op.current?.toggle(e);
    };
    const hide = () => {
        if (isMobile) setMobileVisible(false);
        else op.current?.hide();
    };
    const handleApply = () => {
        onApply?.();
        hide();
    };
    const handleClear = () => {
        onClear?.();
        hide();
    };
    return (
        <>
            {!isDesktop && (
                <>
                <div >
                    <Button
                        label={isMobile ? undefined : buttonLabel}
                        icon={buttonIcon}
                        outlined
                        onClick={toggle}
                        style={{ boxShadow: "none",height: "40px" }}
                    />
                    </div>
                <Dialog header="Filtros" visible={mobileVisible} onHide={hide} modal
                    style={{ width: '90vw', maxWidth: '420px' }}
                    contentStyle={{ paddingBottom: '1rem' }}>
                    <div className="flex flex-column">{children}</div>
                    <div className="flex gap-2 mt-1 p-2">
                        <Button label="Aplicar Filtro" icon="pi pi-search" outlined className="btn-filter-Component-Mobile" onClick={handleApply} />
                        <Button label="Limpar Filtro" icon="pi pi-trash" severity="danger"  outlined className="btn-filter-Component-Mobile" onClick={handleClear} />
                    </div>
                </Dialog>
                </>
            )}
             {!isMobile && (
                <>
                <div style={{ height: "38px"}}>
                    <Button
                        label={isMobile ? undefined : buttonLabel}
                        icon={buttonIcon}
                        outlined
                        onClick={toggle}
                        style={{ boxShadow: "none", height:"38px", borderRadius:23 }}
                    />
                    </div>
                    <OverlayPanel ref={op} dismissable className="filter-overlay" >
                        <div className="flex flex-column">
                            {children}
                            <div className="flex justify-content-between  p-2 gap-3">
                                <Button label="Aplicar Filtro" icon="pi pi-search" outlined onClick={handleApply} className="btn-filter-Component-Desktop" />
                                <Button label="Limpar Filtro" icon="pi pi-trash" severity="danger" outlined onClick={handleClear} className="btn-filter-Component-Desktop" />
                            </div>
                        </div>
                    </OverlayPanel>
                </>
            )}
        </>
    );
};
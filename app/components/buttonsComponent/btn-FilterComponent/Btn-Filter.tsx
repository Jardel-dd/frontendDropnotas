'use client';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { ReactNode, useRef, useState, useEffect } from 'react';
type FilterOverlayProps = {
    children: ReactNode;
    onApply?: () => void;
    onClear?: () => void;
    width?: string;
    mobileBreakpoint?: number;
    buttonLabel?: string;
    buttonIcon?: string;
    buttonClassName?: string;
};
export const FilterOverlay: React.FC<FilterOverlayProps> = ({ children, onApply, onClear, width = '300px', mobileBreakpoint = 768, buttonLabel = 'Filtros', buttonIcon = 'pi pi-filter', buttonClassName = '' }) => {
    const op = useRef<OverlayPanel>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [mobileVisible, setMobileVisible] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= mobileBreakpoint);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, [mobileBreakpoint]);

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
            <Button label={isMobile ? undefined : buttonLabel} icon={buttonIcon} outlined onClick={toggle} className={buttonClassName} style={{ boxShadow: 'None' }} />
            {!isMobile && (
                <OverlayPanel ref={op} dismissable className="filter-overlay">
                    <div className="flex flex-column" style={{ width }}>
                        {children}
                        <div className="flex justify-content-between align-items-center mt-2">
                            <Button label="Aplicar Filtro" outlined onClick={handleApply} style={{ boxShadow: 'None' }} />
                            <Button label="Limpar Filtro" severity="secondary" outlined onClick={handleClear} style={{ boxShadow: 'None' }} />
                        </div>
                    </div>
                </OverlayPanel>
            )}
            {isMobile && (
                <Dialog header="Filtros" visible={mobileVisible} onHide={hide} modal style={{ width: '90vw', maxWidth: '420px' }} contentStyle={{ paddingBottom: '1rem' }}>
                    <div className="flex flex-column ">{children}</div>
                    <div className="flex gap-2 p-3">
                        <Button label="Aplicar" className="w-full" onClick={handleApply} />
                        <Button label="Limpar" outlined className="w-full" onClick={handleClear} />
                    </div>
                </Dialog>
            )}
        </>
    );
};

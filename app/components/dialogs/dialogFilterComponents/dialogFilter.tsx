'use client';
import "./style.css"
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import React, { CSSProperties, ReactNode } from 'react';

type BaseDialogProps = {
    visible: boolean;
    header?: string;
    onHide: () => void;
    onSave?: () => void;
    onCancel?: () => void;
    onClear?: () => void;
    saveLabel?: string;
    cancelLabel?: string;
    clearLabel?: string;
    showSaveButton?: boolean;
    showCancelButton?: boolean;
    showClearButton?: boolean;
    saveDisabled?: boolean;
    cancelDisabled?: boolean;
    clearDisabled?: boolean;
    className?: string;
    draggable?: boolean;
    children: ReactNode;
    style?: React.CSSProperties;
    width?: string;
    height?: string;
    contentStyle?: CSSProperties;
    breakpoints?: Record<string, string>;
};

const DialogFilter: React.FC<BaseDialogProps> = ({
    visible,
    header = 'Filtro',
    onHide,
    onSave,
    onCancel,
    onClear,
    saveLabel = 'Aplicar',
    cancelLabel = 'Cancelar',
    clearLabel = 'Limpar filtros',
    showSaveButton = true,
    showCancelButton = true,
    showClearButton = false,
    saveDisabled = false,
    cancelDisabled = false,
    clearDisabled = false,
    className = 'w-80vw',
    draggable = false,
    children,
    style = {},
    width = '80%',
    height = '100%',
    contentStyle = {},
    breakpoints = {}
}) => {
    const handleCancelClick = () => {
        if (onCancel) {
            onCancel();
        } else {
            onHide();
        }
    };
    const handleSaveClick = () => {
        onSave?.();
    };
    const handleClearClick = () => {
        onClear?.();
    };
    const footer = (
        <div className="flex justify-content-between align-items-center gap-2 w-full">
            <div className="flex gap-2" style={{ height: '32px' }}>
                {showSaveButton && <Button label={saveLabel} onClick={handleSaveClick} disabled={saveDisabled} className="p-button-sm-noBoxShadow" />}
                {showClearButton && <Button label={clearLabel} outlined severity="danger" onClick={handleClearClick} disabled={clearDisabled} className="p-button-sm-noBoxShadow" />}
                {showCancelButton && <Button label={cancelLabel} outlined onClick={handleCancelClick} disabled={cancelDisabled} className="p-button-sm-noBoxShadow" />}
            </div>
        </div>
    );
    return (
        <Dialog
            breakpoints={breakpoints}
            contentStyle={contentStyle}
            draggable={draggable}
            header={header}
            visible={visible}
            modal
            className={className}
            onHide={onHide}
            footer={footer}
            style={{ width: '50%', height, padding: 0, margin: 0, ...style }}
        >
            {children}
        </Dialog>
    );
};

export default DialogFilter;

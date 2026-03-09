'use client';
import "./style.css";
import React, { CSSProperties, ReactNode } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

type BaseDialogProps = {
    visible: boolean;
    header?: string;
    onHide: () => void;
    children: ReactNode;

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

    dismissableMask?: boolean;
    closable?: boolean;
    draggable?: boolean;

    className?: string;
    style?: CSSProperties;
    contentStyle?: CSSProperties;
    width?: string;
    height?: string;
    breakpoints?: Record<string, string>;
};

const DialogFilter: React.FC<BaseDialogProps> = ({
    visible,
    header = "Dialog",
    onHide,
    children,

    onSave,
    onCancel,
    onClear,

    saveLabel = "Salvar",
    cancelLabel = "Cancelar",
    clearLabel = "Limpar filtros",

    showSaveButton = false,
    showCancelButton = false,
    showClearButton = false,

    saveDisabled = false,
    cancelDisabled = false,
    clearDisabled = false,

    dismissableMask = true,
    closable = true,
    draggable = false,

    className = "",
    style = {},
    contentStyle = {},

    width = "80%",
    height = "auto",

    breakpoints = {}
}) => {

    const handleCancelClick = () => {
        if (onCancel) onCancel();
        else onHide();
    };

    const handleSaveClick = () => onSave?.();
    const handleClearClick = () => onClear?.();

    const hasFooter =
        showSaveButton || showCancelButton || showClearButton;

    const footer = hasFooter ? (
        <div className="flex justify-content-between align-items-center gap-2 w-full">
            <div className="flex gap-2" style={{ height: "32px" }}>
                {showSaveButton && (
                    <Button
                        label={saveLabel}
                        onClick={handleSaveClick}
                        disabled={saveDisabled}
                        className="p-button-sm-noBoxShadow"
                    />
                )}

                {showClearButton && (
                    <Button
                        label={clearLabel}
                        outlined
                        severity="danger"
                        onClick={handleClearClick}
                        disabled={clearDisabled}
                        className="p-button-sm-noBoxShadow"
                    />
                )}

                {showCancelButton && (
                    <Button
                        label={cancelLabel}
                        outlined
                        onClick={handleCancelClick}
                        disabled={cancelDisabled}
                        className="p-button-sm-noBoxShadow"
                    />
                )}
            </div>
        </div>
    ) : null;

    return (
        <Dialog
            header={header}
            visible={visible}
            onHide={onHide}
            modal
            footer={footer}
            className={className}
            dismissableMask={dismissableMask}
            closable={closable}
            draggable={draggable}
            resizable={false}
            breakpoints={breakpoints}
            contentStyle={contentStyle}
            style={{ width, height, padding: 0, margin: 0, ...style }}
        >
            {children}
        </Dialog>
    );
};
export default DialogFilter;
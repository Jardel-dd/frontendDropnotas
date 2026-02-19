import React, { CSSProperties } from 'react';
import { Dialog } from 'primereact/dialog';

interface GenericDialogProps {
    header: string;
    visible: boolean;
    onHide: () => void;
    children: React.ReactNode;
    width?: string;
    height?: string;
    style?: React.CSSProperties;
    dismissableMask?: boolean;
    closable?: boolean;
    contentStyle?: CSSProperties;
    breakpoints?: Record<string, string>;
}

export const CreatedDialog: React.FC<GenericDialogProps> = ({ 
    header, visible, onHide, children, 
    width = '80%', height = '100%', style = {},
     dismissableMask = true, closable = true, contentStyle = {}, breakpoints = {} }) => {
    return (
        <div style={{ width, padding: 0, margin: 0 }}>
            <Dialog
                header={header}
                visible={visible}
                style={{ width:"50%", height, padding: 0, margin: 0, ...style }}
                onHide={onHide}
                dismissableMask={dismissableMask}
                closable={closable}
                draggable={false}
                resizable={false}
                contentStyle={contentStyle}
                breakpoints={breakpoints}
            >
                {children}
            </Dialog>
        </div>
    );
};

import { ReactNode } from "react";

export type FilterOverlayProps = {
    children: ReactNode;
    onApply?: () => void;
    onClear?: () => void;
    onOpen?: () => void;
    width?: string;
    mobileBreakpoint?: number;
    buttonLabel?: string;
    buttonIcon?: string;
    buttonClassName?: string;
};

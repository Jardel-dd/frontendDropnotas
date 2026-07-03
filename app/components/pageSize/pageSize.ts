import { useEffect, useState } from "react";
import { useIsMobile } from "@/app/components/responsiveCelular/responsive";

type UsePageSizeOptions = {
    mobileOffset?: number;
    desktopOffset?: number;
    rowHeight?: number;
    minRows?: number;
};

const calculatePageSize = (offset: number, rowHeight: number, minRows: number) => {
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
    const availableHeight = viewportHeight - offset;
    const rowsThatFit = Math.floor(availableHeight / rowHeight);
    return rowsThatFit > 0 ? rowsThatFit : minRows;
};

export const usePageSize = ({
    mobileOffset = 324,
    desktopOffset = 365,
    rowHeight = 56,
    minRows = 2
}: UsePageSizeOptions = {}) => {
    const isMobile = useIsMobile();
    const offset = isMobile ? mobileOffset : desktopOffset;
    const [pageSize, setPageSize] = useState(() => calculatePageSize(offset, rowHeight, minRows));

    useEffect(() => {
        const updatePageSize = () => {
            setPageSize(calculatePageSize(offset, rowHeight, minRows));
        };

        updatePageSize();
        window.addEventListener('resize', updatePageSize);
        window.visualViewport?.addEventListener('resize', updatePageSize);

        return () => {
            window.removeEventListener('resize', updatePageSize);
            window.visualViewport?.removeEventListener('resize', updatePageSize);
        };
    }, [offset, rowHeight, minRows]);

    return pageSize;
};

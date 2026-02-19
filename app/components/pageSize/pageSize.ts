import { useState } from "react";
import { useIsMobile } from "@/app/components/responsiveCelular/responsive"; 
const calculatePageSize = (offset: number) => {
    const rowHeight = 56;
    const availableHeight = window.innerHeight - offset;
    const rowsThatFit = Math.floor(availableHeight / rowHeight);
    return rowsThatFit > 0 ? rowsThatFit : 1;
};

export const usePageSize = () => {
    const isMobile = useIsMobile();  
    const offset = isMobile ? 380 : 365; 
    const [pageSize, setPageSize] = useState(() => calculatePageSize(offset));
    return pageSize;
};
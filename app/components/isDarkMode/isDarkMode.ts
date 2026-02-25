'use client'
import { useContext } from "react";
import { LayoutContext } from "@/layout/context/layoutcontext";

export const useTheme = () => {
    const { layoutConfig } = useContext(LayoutContext);
    return {
        isDarkMode: layoutConfig.colorScheme === "dark",
        textColor: layoutConfig.colorScheme === "dark" ? "white" : "black",
    };
};

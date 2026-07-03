'use client';
import React from 'react';

type IconProps = {
    isDarkMode?: boolean;
    size?: number;
    className?: string;
};
const getColor = (isDarkMode?: boolean) =>
    isDarkMode ? '#FFFFFFCC' : '#6c757d';
const BaseIcon = ({
    children,
    isDarkMode,
    size = 16,
    className
}: React.PropsWithChildren<IconProps>) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={getColor(isDarkMode)}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        {children}
    </svg>
);

export const IconReal = ({ isDarkMode, size = 16, className }: IconProps) => {
    const color = getColor(isDarkMode);

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className={className}
        >
            <text
                x="50%"
                y="59%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="18"
                fontWeight="500"
                fill={color}
                style={{
                    fontFamily: 'Inter, system-ui, Arial, sans-serif',
                    letterSpacing: '-0.5px'
                }}
            >
                R$
            </text>
        </svg>
    );
};

export const IconMoney = (props: IconProps) => (
    <BaseIcon {...props}>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="3" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="2" y1="14" x2="22" y2="14" />
    </BaseIcon>
);


export const IconPorcentagem = (props: IconProps) => (
    <BaseIcon {...props}>
        <line x1="19" y1="5" x2="5" y2="19" />
        <circle cx="7" cy="7" r="2" />
        <circle cx="17" cy="17" r="2" />
    </BaseIcon>
);

export const IconNumero = (props: IconProps) => (
    <BaseIcon {...props}>
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
    </BaseIcon>
);


export const IconSearch = (props: IconProps) => (
    <BaseIcon {...props}>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </BaseIcon>
);


export const IconCNPJ = (props: IconProps) => (
    <BaseIcon {...props}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="7" y1="8" x2="17" y2="8" />
        <line x1="7" y1="12" x2="17" y2="12" />
        <line x1="7" y1="16" x2="13" y2="16" />
    </BaseIcon>
);
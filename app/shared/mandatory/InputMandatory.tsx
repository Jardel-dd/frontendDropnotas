'use client';
import React from 'react';
import { Tooltip } from 'primereact/tooltip';
import 'primeicons/primeicons.css';

interface AsteriskProps {
  color?: string;
}

export const Mandatory: React.FC<AsteriskProps> = ({ color = '#EF8069' }) => {
  return (
    <>
      <Tooltip target=".mandatory-icon" />
      <i
        className="pi pi-info-circle mandatory-icon"
        data-pr-tooltip="Campo Obrigatório"
        style={{ color, fontSize: '10px', marginLeft: '4px', cursor: 'pointer' }}
      />
    </>
  );
};

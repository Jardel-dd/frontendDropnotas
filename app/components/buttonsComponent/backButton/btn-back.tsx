import { Button } from 'primereact/button';
import React from 'react';

const BackButton: React.FC = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (

    <div >
      <Button onClick={handleBack} label="Voltar" outlined icon="pi pi-arrow-left" />
    </div>
  );
};
export default BackButton;

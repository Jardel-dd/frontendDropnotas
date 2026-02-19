import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

type BTNPGCreatedAllProps = {
  onClick: () => void;
  label: string;
  icon?: string;
  disabled: boolean;
  showBackButton?: boolean;
  onBack?: () => void;
  loading?: boolean;
  loadingLabel?: string;
};

function BTNPGCreatedAll({
  onClick,
  label,
  icon,
  disabled,
  showBackButton = true,
  onBack,
  loading = false,
  loadingLabel = 'Processando...',
}: BTNPGCreatedAllProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <>
      <Divider />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          height: '2rem',
          width: '100%',
        }}
      >
        <div style={{ margin: '0 1rem', display: 'flex', alignItems: 'center' }}>
          <Button
            type="submit"
            style={{ width: 'auto', minWidth: '7rem' }}
            label={loading ? loadingLabel : label}        
            icon={icon}
            onClick={onClick}
             loading={loading}
             disabled={disabled || loading} 
          />
        </div>

        {showBackButton && (
          <div>
            <Button
              type="button"
              onClick={handleBack}
              label="Voltar"
              outlined
              icon="pi pi-arrow-left"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default BTNPGCreatedAll;

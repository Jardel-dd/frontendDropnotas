import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

type BTNPGCreatedDialogProps = {
  onClick: () => void;
  label: string;
  icon?: string;
  disabled: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
  onClose?: () => void; 
};

function BTNPGCreatedDialog({
  onClick,
  label,
  icon,
  disabled,
  showBackButton = true,
  onBackClick,
  onClose,
}: BTNPGCreatedDialogProps) {

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else if (onClose) {
      onClose();
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
            label={label}
            icon={icon || undefined}
            onClick={onClick}
            disabled={disabled}
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

export default BTNPGCreatedDialog;

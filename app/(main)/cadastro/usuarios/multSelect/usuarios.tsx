import React from 'react';
import { Mandatory } from '@/app/shared/mandatory/InputMandatory';
import CustomMultiSelect from '@/app/shared/include/multSelect/Input';
import { UserMultiSelectProps } from '../types/usuario';
export const UserMultiSelect: React.FC<UserMultiSelectProps> = ({
  id = 'selectedUserConta',
  label = 'Seleção de usuários:',
  selectedItems,
  onChange,
  options,
  optionLabel = 'nome',
  placeholder = 'Selecione os Usuários',
  maxSelectedLabels = 3,
  hasError = false,
  errorMessage = '',
  showChips = true
}) => {
  return (
    <div className="grid formgrid">
      <div className="col-12 mb-1 lg:col-4 lg:mb-0" style={{ width: "100%" }}>
        <div className="p-field">
          <label htmlFor={id}>
            {label}
            <Mandatory />
          </label>
          <CustomMultiSelect
            id={id}
            selectedItems={selectedItems}
            onChange={onChange}
            options={options}
            optionLabel={optionLabel}
            placeholder={placeholder}
            maxSelectedLabels={maxSelectedLabels}
            hasError={hasError}
            errorMessage={errorMessage}
            showChips={showChips}
          />
        </div>
      </div>
    </div>
  );
};

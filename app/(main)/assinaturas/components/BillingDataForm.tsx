import { Buildings, IdentificationCard, User } from 'phosphor-react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import EnderecoForm from '@/app/components/enderecos/enderecoFormComponent/enderecoForm';
import type { BillingFormValues, CheckoutFormErrors } from '../security';
import { formatBillingDocument } from '../security';

type Props = {
    value: BillingFormValues;
    errors: CheckoutFormErrors;
    disabled?: boolean;
    onDocumentTypeChange: (documentType: BillingFormValues['documentType']) => void;
    onChange: (field: keyof BillingFormValues, value: string) => void;
    onAddressChange: (event: any) => void;
    onAddressDropdownChange: (event: any) => void;
    onCepSearch: () => void;
    getCitiesFromState: (uf: string) => any[];
    loadingCep?: boolean;
};

export default function BillingDataForm({
    value,
    errors,
    disabled = false,
    onDocumentTypeChange,
    onChange,
    onAddressChange,
    onAddressDropdownChange,
    onCepSearch,
    getCitiesFromState,
    loadingCep = false
}: Props) {
    const isCpf = value.documentType === 'cpf';
    const documentLabel = isCpf ? 'CPF' : 'CNPJ';
    const displayNameLabel = isCpf ? 'Nome completo' : 'Razão social';
    const displayNamePlaceholder = isCpf ? 'Nome do responsável pela cobrança' : 'Razão social da empresa pagadora';
    const enderecoErrors = Object.fromEntries(Object.entries(errors).filter(([, error]) => typeof error === 'string')) as Record<string, string>;

    return (
        <div className="subscription-billing-section">
            <div className="subscription-section-header">
                <h3>Dados de cobrança</h3>
                <p>Defina quem será cobrado e complete o endereço usando a mesma base de CEP e localização do sistema.</p>
            </div>

            <div className="subscription-toggle-group" role="tablist" aria-label="Tipo de documento">
                <Button
                    type="button"
                    label="CPF"
                    outlined={!isCpf}
                    severity={isCpf ? undefined : 'secondary'}
                    icon={<User size={16} />}
                    onClick={() => onDocumentTypeChange('cpf')}
                    disabled={disabled}
                    className={`subscription-toggle-button ${isCpf ? 'is-active' : ''}`}
                />
                <Button
                    type="button"
                    label="CNPJ"
                    outlined={isCpf}
                    severity={!isCpf ? undefined : 'secondary'}
                    icon={<Buildings size={16} />}
                    onClick={() => onDocumentTypeChange('cnpj')}
                    disabled={disabled}
                    className={`subscription-toggle-button ${!isCpf ? 'is-active' : ''}`}
                />
            </div>

            <div className="grid formgrid">
                <div className="col-12 lg:col-6">
                    <label className="subscription-field-label" htmlFor="subscription-billing-document">
                        {documentLabel}
                    </label>
                    <span className="subscription-input-icon">
                        <IdentificationCard size={18} />
                        <InputText
                            id="subscription-billing-document"
                            value={value.document}
                            onChange={(event) => onChange('document', formatBillingDocument(event.target.value, value.documentType))}
                            disabled={disabled}
                            className={errors.billingDocument ? 'p-invalid' : ''}
                            placeholder={isCpf ? '000.000.000-00' : '00.000.000/0000-00'}
                            inputMode="numeric"
                        />
                    </span>
                    {errors.billingDocument && <small className="p-error">{errors.billingDocument}</small>}
                </div>

                <div className="col-12 lg:col-6">
                    <label className="subscription-field-label" htmlFor="subscription-billing-display-name">
                        {displayNameLabel}
                    </label>
                    <span className="subscription-input-icon">
                        {isCpf ? <User size={18} /> : <Buildings size={18} />}
                        <InputText
                            id="subscription-billing-display-name"
                            value={value.displayName}
                            onChange={(event) => onChange('displayName', event.target.value)}
                            disabled={disabled}
                            className={errors.billingDisplayName ? 'p-invalid' : ''}
                            placeholder={displayNamePlaceholder}
                        />
                    </span>
                    {errors.billingDisplayName && <small className="p-error">{errors.billingDisplayName}</small>}
                </div>
            </div>
            <EnderecoForm
                endereco={value.endereco}
                errors={enderecoErrors}
                onChange={onAddressChange}
                onCepSearch={onCepSearch}
                onDropdownChange={onAddressChange}
                onDropdownChangeEndereco={onAddressDropdownChange}
                getCitiesFromState={getCitiesFromState}
                loadingCep={loadingCep}
            />
        </div>
    );
}

import { CreditCard } from 'phosphor-react';
import { InputText } from 'primereact/inputtext';
import type { CardFormValues, CheckoutFormErrors } from '../security';
import { detectCardBrand, formatCardExpiry, formatCardNumber } from '../security';

type Props = {
    value: CardFormValues;
    errors: CheckoutFormErrors;
    onChange: (field: keyof CardFormValues, value: string) => void;
    disabled?: boolean;
};

const getBrandLabel = (brand: ReturnType<typeof detectCardBrand>) => {
    switch (brand) {
        case 'visa':
            return 'Visa';
        case 'mastercard':
            return 'Mastercard';
        case 'amex':
            return 'Amex';
        case 'elo':
            return 'Elo';
        case 'hipercard':
            return 'Hipercard';
        default:
            return 'Bandeira identificada automaticamente';
    }
};

const renderError = (message?: string) => {
    if (!message) {
        return null;
    }

    return <small className="p-error">{message}</small>;
};

export default function CreditCardForm({ value, errors, onChange, disabled = false }: Props) {
    const detectedBrand = detectCardBrand(value.cardNumber);

    return (
        <div className="subscription-card-form">
            <div className="subscription-card-form-header">
                <div>
                    <h3>Cartao de credito</h3>
                    <p>Os dados do cartao permanecem apenas nesta sessao e sao tokenizados antes do envio.</p>
                </div>
                <span className="subscription-card-brand-pill">
                    <CreditCard size={18} />
                    {getBrandLabel(detectedBrand)}
                </span>
            </div>

            <div className="grid formgrid">
                <div className="col-12">
                    <label className="subscription-field-label" htmlFor="card-holder-name">
                        Nome impresso no cartao
                    </label>
                    <InputText
                        id="card-holder-name"
                        value={value.holderName}
                        onChange={(event) => onChange('holderName', event.target.value)}
                        disabled={disabled}
                        className={errors.cardHolderName ? 'p-invalid' : ''}
                        placeholder="Como aparece no cartao"
                        autoComplete="cc-name"
                    />
                    {renderError(errors.cardHolderName)}
                </div>

                <div className="col-12">
                    <label className="subscription-field-label" htmlFor="card-number">
                        Numero do cartao
                    </label>
                    <InputText
                        id="card-number"
                        value={value.cardNumber}
                        onChange={(event) => onChange('cardNumber', formatCardNumber(event.target.value))}
                        disabled={disabled}
                        className={errors.cardNumber ? 'p-invalid' : ''}
                        placeholder="0000 0000 0000 0000"
                        autoComplete="cc-number"
                        inputMode="numeric"
                    />
                    {renderError(errors.cardNumber)}
                </div>

                <div className="col-6">
                    <label className="subscription-field-label" htmlFor="card-expiry">
                        Validade
                    </label>
                    <InputText
                        id="card-expiry"
                        value={value.expiry}
                        onChange={(event) => onChange('expiry', formatCardExpiry(event.target.value))}
                        disabled={disabled}
                        className={errors.expiry ? 'p-invalid' : ''}
                        placeholder="MM/AA"
                        autoComplete="cc-exp"
                        inputMode="numeric"
                    />
                    {renderError(errors.expiry)}
                </div>

                <div className="col-6">
                    <label className="subscription-field-label" htmlFor="card-cvv">
                        Codigo de seguranca
                    </label>
                    <InputText
                        id="card-cvv"
                        value={value.cvv}
                        onChange={(event) => onChange('cvv', event.target.value.replace(/\D/g, '').slice(0, detectedBrand === 'amex' ? 4 : 3))}
                        disabled={disabled}
                        className={errors.cvv ? 'p-invalid' : ''}
                        placeholder={detectedBrand === 'amex' ? '0000' : '000'}
                        autoComplete="cc-csc"
                        inputMode="numeric"
                    />
                    {renderError(errors.cvv)}
                </div>
            </div>
        </div>
    );
}

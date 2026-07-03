import { Barcode, CreditCard, QrCode } from 'phosphor-react';
import type { SubscriptionPaymentMethod } from '@/app/entity/SubscriptionPaymentEntity';
import { SUBSCRIPTION_METHOD_META } from '@/app/entity/SubscriptionPaymentEntity';

type Props = {
    selectedMethod: SubscriptionPaymentMethod;
    onSelect: (method: SubscriptionPaymentMethod) => void;
    disabled?: boolean;
};

const methodIcons = {
    pix: QrCode,
    boleto: Barcode,
    credit_card: CreditCard
} satisfies Record<SubscriptionPaymentMethod, typeof QrCode>;

const methods = ['pix', 'boleto', 'credit_card'] as const;

export default function PaymentMethodSelector({ selectedMethod, onSelect, disabled = false }: Props) {
    return (
        <div className="subscription-method-grid">
            {methods.map((method) => {
                const meta = SUBSCRIPTION_METHOD_META[method];
                const Icon = methodIcons[method];
                const isSelected = selectedMethod === method;

                return (
                    <button
                        key={method}
                        type="button"
                        className={`subscription-method-card ${meta.accentClass} ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => onSelect(method)}
                        disabled={disabled}
                        aria-pressed={isSelected}
                    >
                        <span className="subscription-method-icon">
                            <Icon size={22} weight={isSelected ? 'fill' : 'regular'} />
                        </span>
                        <span className="subscription-method-copy">
                            <strong>{meta.label}</strong>
                            <small>{meta.helperText}</small>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

export type SubscriptionPaymentMethod = 'pix' | 'boleto' | 'credit_card';

export type SubscriptionPaymentStatus = 'paid' | 'pending' | 'canceled';

export type BillingDocumentType = 'cpf' | 'cnpj';

export type SubscriptionCardBrand = 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard' | 'desconhecida';

export type SubscriptionSeverity = 'success' | 'warning' | 'danger';

export interface SubscriptionPlanConfig {
    id: string;
    name: string;
    priceInCents: number;
    billingLabel: string;
    description: string;
}

export interface SubscriptionBillingAddress {
    cep: string;
    logradouro: string;
    complemento: string;
    numero: string;
    bairro: string;
    municipio: string;
    codigo_municipio: string;
    codigo_pais: string;
    nome_pais?: string;
    uf: string;
    telefone: string;
}

export interface TokenizedCardPayload {
    token: string;
    brand: SubscriptionCardBrand;
    last4: string;
    holderName: string;
    expMonth: string;
    expYear: string;
}

export interface PaymentArtifactPix {
    qrCodeText: string;
    copyPasteCode: string;
    expiresAt: string;
}

export interface PaymentArtifactBoleto {
    digitableLine: string;
    barcodeValue: string;
    dueDate: string;
}

export interface PaymentArtifactCard {
    brand: SubscriptionCardBrand;
    last4: string;
    holderName: string;
    authorizedAt?: string | null;
}

export interface SubscriptionPaymentRecord {
    id: string;
    idempotencyKey: string;
    externalReference: string;
    provider: string;
    planId: string;
    planName: string;
    amountInCents: number;
    billingLabel: string;
    customerName: string;
    customerEmail: string;
    billingDocumentType: BillingDocumentType;
    billingDocument: string;
    billingDisplayName: string;
    billingZipCode: string;
    billingAddress: SubscriptionBillingAddress;
    paymentMethod: SubscriptionPaymentMethod;
    status: SubscriptionPaymentStatus;
    statusMessage: string;
    createdAt: string;
    updatedAt: string;
    dueDate: string;
    paidAt?: string | null;
    canceledAt?: string | null;
    pix?: PaymentArtifactPix;
    boleto?: PaymentArtifactBoleto;
    card?: PaymentArtifactCard;
}

export interface CreateSubscriptionPaymentPayload {
    planId: string;
    amountInCents: number;
    customerName: string;
    customerEmail: string;
    billingDocumentType: BillingDocumentType;
    billingDocument: string;
    billingDisplayName: string;
    billingZipCode: string;
    billingAddress: SubscriptionBillingAddress;
    paymentMethod: SubscriptionPaymentMethod;
    idempotencyKey: string;
    card?: TokenizedCardPayload | null;
}

export interface CancelSubscriptionPaymentPayload {
    paymentId: string;
}

export interface SubscriptionPaymentResponse {
    message: string;
    payment: SubscriptionPaymentRecord;
}

export interface SubscriptionMethodMeta {
    label: string;
    shortLabel: string;
    accentClass: string;
    helperText: string;
}

export interface SubscriptionStatusMeta {
    label: string;
    description: string;
    severity: SubscriptionSeverity;
}

export const SUBSCRIPTION_PLAN: SubscriptionPlanConfig = {
    id: 'dropnotas-saas-pro',
    name: 'Plano Teste',
    priceInCents: 9990,
    billingLabel: 'mensal',
    description: 'Plano recorrente com emissão, operacao financeira e suporte contínuo.'
};
export const SUBSCRIPTION_METHOD_META: Record<SubscriptionPaymentMethod, SubscriptionMethodMeta> = {
    pix: {
        label: 'PIX',
        shortLabel: 'Pix',
        accentClass: 'is-pix',
        helperText: 'Gera QR Code e codigo copia e cola com confirmação automatica.'
    },
    boleto: {
        label: 'Boleto',
        shortLabel: 'Boleto',
        accentClass: 'is-boleto',
        helperText: 'Emite linha digitavel e mantem o pagamento pendente ate a compensacao.'
    },
    credit_card: {
        label: 'Cartao de credito',
        shortLabel: 'Cartao',
        accentClass: 'is-card',
        helperText: 'Tokeniza os dados antes do envio para manter o fluxo pronto para gateways reais.'
    }
};

export const SUBSCRIPTION_STATUS_META: Record<SubscriptionPaymentStatus, SubscriptionStatusMeta> = {
    paid: {
        label: 'Pago',
        description: 'Pagamento confirmado e assinatura ativa.',
        severity: 'success'
    },
    pending: {
        label: 'Pendente',
        description: 'Cobranca gerada. Aguarde a confirmação do provedor.',
        severity: 'warning'
    },
    canceled: {
        label: 'Cancelado',
        description: 'Sem cobranca ativa no momento.',
        severity: 'danger'
    }
};

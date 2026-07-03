import { randomUUID } from 'crypto';
import type {
    CreateSubscriptionPaymentPayload,
    SubscriptionPaymentMethod,
    SubscriptionPaymentRecord
} from '@/app/entity/SubscriptionPaymentEntity';
import { SUBSCRIPTION_PLAN } from '@/app/entity/SubscriptionPaymentEntity';

type StoredPaymentRecord = SubscriptionPaymentRecord & {
    autoResolveAt: number;
};

type PaymentStoreState = {
    payments: Map<string, StoredPaymentRecord>;
    idempotencyIndex: Map<string, string>;
};

declare global {
    // Mantemos o store em globalThis para sobreviver aos reloads em desenvolvimento.
    var __dropnotasPaymentStore__: PaymentStoreState | undefined;
}

const autoResolveMsByMethod: Record<SubscriptionPaymentMethod, number> = {
    pix: 12000,
    boleto: 18000,
    credit_card: 7000
};

const createStore = (): PaymentStoreState => ({
    payments: new Map<string, StoredPaymentRecord>(),
    idempotencyIndex: new Map<string, string>()
});

const store = globalThis.__dropnotasPaymentStore__ ?? createStore();

if (!globalThis.__dropnotasPaymentStore__) {
    globalThis.__dropnotasPaymentStore__ = store;
}

const toPublicPayment = ({ autoResolveAt: _autoResolveAt, ...payment }: StoredPaymentRecord): SubscriptionPaymentRecord => payment;

const digitsFromSeed = (seed: string, size: number) => {
    let accumulator = 7;
    const rawDigits = Array.from(seed).map((character, index) => {
        accumulator = (accumulator * 31 + character.charCodeAt(0) * (index + 1)) % 10;
        return accumulator.toString();
    });

    return rawDigits.join('').padEnd(size, '9').slice(0, size);
};

const buildPixArtifact = (paymentId: string, dueDate: string) => {
    const payload = `00020126580014BR.GOV.BCB.PIX0136${paymentId.replace(/-/g, '').slice(0, 32)}520400005303986540599.905802BR5920DROPNOTAS ASSINATURA6009SAO PAULO62070503***6304ABCD`;

    return {
        qrCodeText: payload,
        copyPasteCode: payload,
        expiresAt: dueDate
    };
};

const buildBoletoArtifact = (paymentId: string, dueDate: string) => {
    const digits = digitsFromSeed(paymentId, 47);
    const digitableLine = `${digits.slice(0, 5)}.${digits.slice(5, 10)} ${digits.slice(10, 15)}.${digits.slice(15, 21)} ${digits.slice(21, 26)}.${digits.slice(26, 32)} ${digits.slice(32, 33)} ${digits.slice(33)}`;

    return {
        digitableLine,
        barcodeValue: digits.slice(0, 44),
        dueDate
    };
};

const buildPendingMessage = (method: SubscriptionPaymentMethod) => {
    switch (method) {
        case 'pix':
            return 'QR Code gerado. Aguardando confirmacao do Pix.';
        case 'boleto':
            return 'Boleto emitido. A compensacao pode levar alguns instantes.';
        case 'credit_card':
            return 'Cartao tokenizado e enviado para autorizacao.';
        default:
            return 'Pagamento pendente de confirmacao.';
    }
};

const buildPaidMessage = (method: SubscriptionPaymentMethod) => {
    switch (method) {
        case 'pix':
            return 'Pix confirmado com sucesso. Assinatura ativa.';
        case 'boleto':
            return 'Boleto compensado. Assinatura ativa.';
        case 'credit_card':
            return 'Cartao autorizado com sucesso. Assinatura ativa.';
        default:
            return 'Pagamento confirmado com sucesso.';
    }
};

const createExternalReference = () => `SUB-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;

export const getMockPaymentById = (paymentId: string) => {
    const payment = store.payments.get(paymentId);

    return payment ? toPublicPayment(payment) : null;
};

export const refreshMockPaymentStatus = (paymentId: string) => {
    const payment = store.payments.get(paymentId);

    if (!payment) {
        return null;
    }

    if (payment.status === 'pending' && payment.autoResolveAt <= Date.now()) {
        const now = new Date().toISOString();
        const updatedPayment: StoredPaymentRecord = {
            ...payment,
            status: 'paid',
            statusMessage: buildPaidMessage(payment.paymentMethod),
            updatedAt: now,
            paidAt: now
        };

        store.payments.set(paymentId, updatedPayment);
        return toPublicPayment(updatedPayment);
    }

    return toPublicPayment(payment);
};

export const createMockPayment = (payload: CreateSubscriptionPaymentPayload) => {
    const existingPaymentId = store.idempotencyIndex.get(payload.idempotencyKey);

    if (existingPaymentId) {
        return refreshMockPaymentStatus(existingPaymentId);
    }

    const paymentId = randomUUID();
    const createdAt = new Date();
    const dueDate = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
    const basePayment: StoredPaymentRecord = {
        id: paymentId,
        idempotencyKey: payload.idempotencyKey,
        externalReference: createExternalReference(),
        provider: 'mock-gateway-v1',
        planId: SUBSCRIPTION_PLAN.id,
        planName: SUBSCRIPTION_PLAN.name,
        amountInCents: SUBSCRIPTION_PLAN.priceInCents,
        billingLabel: SUBSCRIPTION_PLAN.billingLabel,
        customerName: payload.customerName.trim(),
        customerEmail: payload.customerEmail.trim().toLowerCase(),
        billingDocumentType: payload.billingDocumentType,
        billingDocument: payload.billingDocument.trim(),
        billingDisplayName: payload.billingDisplayName.trim(),
        billingZipCode: payload.billingZipCode.trim(),
        billingAddress: {
            ...payload.billingAddress,
            cep: payload.billingAddress.cep.trim(),
            logradouro: payload.billingAddress.logradouro.trim(),
            complemento: payload.billingAddress.complemento?.trim?.() ?? '',
            numero: payload.billingAddress.numero.trim(),
            bairro: payload.billingAddress.bairro.trim(),
            municipio: payload.billingAddress.municipio.trim(),
            codigo_municipio: payload.billingAddress.codigo_municipio.trim(),
            codigo_pais: payload.billingAddress.codigo_pais.trim(),
            nome_pais: payload.billingAddress.nome_pais?.trim?.() ?? '',
            uf: payload.billingAddress.uf.trim(),
            telefone: payload.billingAddress.telefone?.trim?.() ?? ''
        },
        paymentMethod: payload.paymentMethod,
        status: 'pending',
        statusMessage: buildPendingMessage(payload.paymentMethod),
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
        dueDate: dueDate.toISOString(),
        paidAt: null,
        canceledAt: null,
        pix: payload.paymentMethod === 'pix' ? buildPixArtifact(paymentId, dueDate.toISOString()) : undefined,
        boleto: payload.paymentMethod === 'boleto' ? buildBoletoArtifact(paymentId, dueDate.toISOString()) : undefined,
        card:
            payload.paymentMethod === 'credit_card' && payload.card
                ? {
                      brand: payload.card.brand,
                      last4: payload.card.last4,
                      holderName: payload.card.holderName
                  }
                : undefined,
        autoResolveAt: createdAt.getTime() + autoResolveMsByMethod[payload.paymentMethod]
    };

    store.payments.set(paymentId, basePayment);
    store.idempotencyIndex.set(payload.idempotencyKey, paymentId);

    return toPublicPayment(basePayment);
};

export const cancelMockPayment = (paymentId: string) => {
    const payment = store.payments.get(paymentId);

    if (!payment) {
        return null;
    }

    const refreshedPayment = refreshMockPaymentStatus(paymentId);

    if (!refreshedPayment || refreshedPayment.status !== 'pending') {
        return refreshedPayment;
    }

    const now = new Date().toISOString();
    const canceledPayment: StoredPaymentRecord = {
        ...(store.payments.get(paymentId) as StoredPaymentRecord),
        status: 'canceled',
        statusMessage: 'Cobranca cancelada pelo usuario.',
        updatedAt: now,
        canceledAt: now
    };

    store.payments.set(paymentId, canceledPayment);

    return toPublicPayment(canceledPayment);
};

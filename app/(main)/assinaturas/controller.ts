import type {
    CancelSubscriptionPaymentPayload,
    CreateSubscriptionPaymentPayload,
    SubscriptionPaymentResponse
} from '@/app/entity/SubscriptionPaymentEntity';

const parseResponse = async <T>(response: Response) => {
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string' && payload.message) ||
            'Nao foi possivel concluir a operacao de pagamento.';

        throw new Error(message);
    }

    return payload as T;
};

// O fluxo mock usa fetch local para nao misturar a API interna com o backend real configurado no axios compartilhado.
export const createSubscriptionPayment = async (payload: CreateSubscriptionPaymentPayload) => {
    const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-store',
        body: JSON.stringify(payload)
    });

    return parseResponse<SubscriptionPaymentResponse>(response);
};

export const fetchSubscriptionPaymentStatus = async (paymentId: string) => {
    const response = await fetch(`/api/payment/status/${paymentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-store'
    });

    return parseResponse<SubscriptionPaymentResponse>(response);
};

export const cancelSubscriptionPayment = async (payload: CancelSubscriptionPaymentPayload) => {
    const response = await fetch('/api/payment/cancel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-store',
        body: JSON.stringify(payload)
    });

    return parseResponse<SubscriptionPaymentResponse>(response);
};

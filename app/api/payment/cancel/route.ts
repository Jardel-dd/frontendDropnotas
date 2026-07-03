import { NextResponse } from 'next/server';
import type { CancelSubscriptionPaymentPayload } from '@/app/entity/SubscriptionPaymentEntity';
import { cancelMockPayment, getMockPaymentById } from '../_lib/mockPaymentStore';

const jsonNoStore = (body: unknown, status = 200) =>
    NextResponse.json(body, {
        status,
        headers: {
            'Cache-Control': 'no-store'
        }
    });

export async function POST(request: Request) {
    let body: Partial<CancelSubscriptionPaymentPayload> | null = null;

    try {
        body = (await request.json()) as Partial<CancelSubscriptionPaymentPayload>;
    } catch {
        return jsonNoStore({ message: 'Payload invalido para cancelar a cobranca.' }, 400);
    }

    const paymentId = body?.paymentId?.trim();

    if (!paymentId) {
        return jsonNoStore({ message: 'Informe o identificador da cobranca.' }, 400);
    }

    const currentPayment = getMockPaymentById(paymentId);

    if (!currentPayment) {
        return jsonNoStore({ message: 'Cobranca nao encontrada.' }, 404);
    }

    if (currentPayment.status === 'paid') {
        return jsonNoStore({ message: 'Pagamentos ja confirmados nao podem ser cancelados.' }, 409);
    }

    if (currentPayment.status === 'canceled') {
        return jsonNoStore({ message: 'Esta cobranca ja foi cancelada.' }, 409);
    }

    const canceledPayment = cancelMockPayment(paymentId);

    if (!canceledPayment) {
        return jsonNoStore({ message: 'Nao foi possivel cancelar a cobranca.' }, 500);
    }

    if (canceledPayment.status === 'paid') {
        return jsonNoStore({ message: 'O pagamento foi confirmado antes do cancelamento.' }, 409);
    }

    return jsonNoStore({
        message: 'Cobranca cancelada com sucesso.',
        payment: canceledPayment
    });
}

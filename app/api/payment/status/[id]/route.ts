import { NextResponse } from 'next/server';
import { refreshMockPaymentStatus } from '../../_lib/mockPaymentStore';

export const dynamic = 'force-dynamic';

const jsonNoStore = (body: unknown, status = 200) =>
    NextResponse.json(body, {
        status,
        headers: {
            'Cache-Control': 'no-store'
        }
    });

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    const paymentId = params.id?.trim();

    if (!paymentId) {
        return jsonNoStore({ message: 'Identificador da cobranca nao informado.' }, 400);
    }

    const payment = refreshMockPaymentStatus(paymentId);

    if (!payment) {
        return jsonNoStore({ message: 'Cobranca nao encontrada.' }, 404);
    }

    return jsonNoStore({
        message: 'Status atualizado com sucesso.',
        payment
    });
}

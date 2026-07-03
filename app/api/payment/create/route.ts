import { NextResponse } from 'next/server';
import type { CreateSubscriptionPaymentPayload } from '@/app/entity/SubscriptionPaymentEntity';
import { SUBSCRIPTION_PLAN } from '@/app/entity/SubscriptionPaymentEntity';
import { createMockPayment } from '../_lib/mockPaymentStore';

const jsonNoStore = (body: unknown, status = 200) =>
    NextResponse.json(body, {
        status,
        headers: {
            'Cache-Control': 'no-store'
        }
    });

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const digitsOnly = (value: string) => value.replace(/\D/g, '');

const isRepeatedDigits = (digits: string) => /^(\d)\1+$/.test(digits);

const isValidCpf = (value: string) => {
    const digits = digitsOnly(value);

    if (digits.length !== 11 || isRepeatedDigits(digits)) {
        return false;
    }

    let sum = 0;
    for (let index = 0; index < 9; index += 1) {
        sum += Number(digits[index]) * (10 - index);
    }

    let remainder = (sum * 10) % 11;
    if (remainder === 10) {
        remainder = 0;
    }

    if (remainder !== Number(digits[9])) {
        return false;
    }

    sum = 0;
    for (let index = 0; index < 10; index += 1) {
        sum += Number(digits[index]) * (11 - index);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10) {
        remainder = 0;
    }

    return remainder === Number(digits[10]);
};

const isValidCnpj = (value: string) => {
    const digits = digitsOnly(value);

    if (digits.length !== 14 || isRepeatedDigits(digits)) {
        return false;
    }

    const calculateDigit = (baseDigits: string, factors: number[]) => {
        const total = factors.reduce((sum, factor, index) => sum + Number(baseDigits[index]) * factor, 0);
        const remainder = total % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    };

    const firstDigit = calculateDigit(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const secondDigit = calculateDigit(digits.slice(0, 12) + String(firstDigit), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

    return firstDigit === Number(digits[12]) && secondDigit === Number(digits[13]);
};

const isKnownPaymentMethod = (value: unknown): value is CreateSubscriptionPaymentPayload['paymentMethod'] => {
    return value === 'pix' || value === 'boleto' || value === 'credit_card';
};

const isKnownDocumentType = (value: unknown): value is CreateSubscriptionPaymentPayload['billingDocumentType'] => {
    return value === 'cpf' || value === 'cnpj';
};

const isValidCardToken = (payload: CreateSubscriptionPaymentPayload['card']) => {
    if (!payload) {
        return false;
    }

    return /^tok_mock_[a-z0-9]+$/i.test(payload.token) && /^[0-9]{4}$/.test(payload.last4) && payload.holderName.trim().length >= 3;
};

export async function POST(request: Request) {
    let body: Partial<CreateSubscriptionPaymentPayload> | null = null;

    try {
        body = (await request.json()) as Partial<CreateSubscriptionPaymentPayload>;
    } catch {
        return jsonNoStore({ message: 'Payload invalido para criar a cobranca.' }, 400);
    }

    if (!body || typeof body !== 'object') {
        return jsonNoStore({ message: 'Payload invalido para criar a cobranca.' }, 400);
    }

    if (body.planId !== SUBSCRIPTION_PLAN.id || Number(body.amountInCents) !== SUBSCRIPTION_PLAN.priceInCents) {
        return jsonNoStore({ message: 'Valor ou plano invalido. Atualize a tela e tente novamente.' }, 400);
    }

    if (!body.customerName?.trim() || body.customerName.trim().length < 3) {
        return jsonNoStore({ message: 'Informe um nome valido para a assinatura.' }, 400);
    }

    if (!body.customerEmail?.trim() || !isValidEmail(body.customerEmail)) {
        return jsonNoStore({ message: 'Informe um e-mail valido para a cobranca.' }, 400);
    }

    if (!isKnownDocumentType(body.billingDocumentType)) {
        return jsonNoStore({ message: 'Tipo de documento invalido para cobranca.' }, 400);
    }

    if (
        !body.billingDocument?.trim() ||
        !(body.billingDocumentType === 'cpf' ? isValidCpf(body.billingDocument) : isValidCnpj(body.billingDocument))
    ) {
        return jsonNoStore({ message: body.billingDocumentType === 'cpf' ? 'Informe um CPF valido.' : 'Informe um CNPJ valido.' }, 400);
    }

    if (!body.billingDisplayName?.trim() || body.billingDisplayName.trim().length < 3) {
        return jsonNoStore(
            { message: body.billingDocumentType === 'cpf' ? 'Informe o nome completo do pagador.' : 'Informe a razao social da cobranca.' },
            400
        );
    }

    if (!body.billingZipCode?.trim() || digitsOnly(body.billingZipCode).length !== 8) {
        return jsonNoStore({ message: 'Informe um CEP valido para a cobranca.' }, 400);
    }

    if (!body.billingAddress || typeof body.billingAddress !== 'object') {
        return jsonNoStore({ message: 'Endereco de cobranca invalido.' }, 400);
    }

    if (
        !body.billingAddress.logradouro?.trim() ||
        !body.billingAddress.numero?.trim() ||
        !body.billingAddress.bairro?.trim() ||
        !body.billingAddress.uf?.trim() ||
        !body.billingAddress.municipio?.trim() ||
        !body.billingAddress.codigo_municipio?.trim() ||
        !body.billingAddress.codigo_pais?.trim() ||
        !body.billingAddress.nome_pais?.trim()
    ) {
        return jsonNoStore({ message: 'Preencha o endereco de cobranca completo.' }, 400);
    }

    if (!body.idempotencyKey?.trim() || body.idempotencyKey.trim().length < 12) {
        return jsonNoStore({ message: 'Chave de idempotencia invalida.' }, 400);
    }

    if (!isKnownPaymentMethod(body.paymentMethod)) {
        return jsonNoStore({ message: 'Forma de pagamento invalida.' }, 400);
    }

    if (body.paymentMethod === 'credit_card') {
        if (!isValidCardToken(body.card ?? null)) {
            return jsonNoStore({ message: 'Nao foi possivel validar o token do cartao.' }, 400);
        }
    } else if (body.card) {
        return jsonNoStore({ message: 'Dados de cartao nao sao aceitos para esta forma de pagamento.' }, 400);
    }

    const payment = createMockPayment({
        planId: SUBSCRIPTION_PLAN.id,
        amountInCents: SUBSCRIPTION_PLAN.priceInCents,
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        billingDocumentType: body.billingDocumentType,
        billingDocument: body.billingDocument,
        billingDisplayName: body.billingDisplayName,
        billingZipCode: body.billingZipCode,
        billingAddress: body.billingAddress,
        paymentMethod: body.paymentMethod,
        idempotencyKey: body.idempotencyKey,
        card: body.card ?? null
    });

    if (!payment) {
        return jsonNoStore({ message: 'Nao foi possivel criar a cobranca simulada.' }, 500);
    }

    return jsonNoStore({
        message: 'Cobranca gerada com sucesso.',
        payment
    });
}

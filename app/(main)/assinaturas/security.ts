import type { BillingDocumentType, SubscriptionCardBrand, TokenizedCardPayload } from '@/app/entity/SubscriptionPaymentEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';

export type CardFormValues = {
    holderName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
};

export type BillingFormValues = {
    documentType: BillingDocumentType;
    document: string;
    displayName: string;
    endereco: EnderecoEntity;
};

export type CheckoutFormErrors = Partial<Record<'customerName' | 'customerEmail' | 'billingDocument' | 'billingDisplayName' | 'cardHolderName' | 'cardNumber' | 'expiry' | 'cvv', string> & Record<string, string>>;

const cardBrandPatterns: Array<{ brand: SubscriptionCardBrand; pattern: RegExp }> = [
    { brand: 'visa', pattern: /^4/ },
    { brand: 'mastercard', pattern: /^(5[1-5]|2[2-7])/ },
    { brand: 'amex', pattern: /^3[47]/ },
    { brand: 'elo', pattern: /^(4011(78|79)|431274|438935|451416|457393|45763(1|2)|504175|506(699|7[0-6][0-9])|509\d{3}|627780|636297|636368|650(0[3-9]|4\d|5[0-9]|7[0-9]|9\d)|6516\d{2}|6550\d{2})/ },
    { brand: 'hipercard', pattern: /^(606282|637095|637568|637599|637609|637612)/ }
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const digitsOnly = (value: string) => value.replace(/\D/g, '');

export const formatBillingDocument = (value: string, documentType: BillingDocumentType) => {
    const digits = digitsOnly(value).slice(0, documentType === 'cpf' ? 11 : 14);

    if (documentType === 'cpf') {
        return digits
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1-$2');
    }

    return digits
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
};

export const formatCardNumber = (value: string) => {
    const digits = digitsOnly(value).slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

export const formatCardExpiry = (value: string) => {
    const digits = digitsOnly(value).slice(0, 4);

    if (digits.length <= 2) {
        return digits;
    }

    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const detectCardBrand = (value: string): SubscriptionCardBrand => {
    const digits = digitsOnly(value);
    const matchedBrand = cardBrandPatterns.find(({ pattern }) => pattern.test(digits));

    return matchedBrand?.brand ?? 'desconhecida';
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

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

const isValidZipCode = (value: string) => digitsOnly(value).length === 8;

export const hasBillingDataReady = (billing: BillingFormValues) => {
    const documentIsValid = billing.documentType === 'cpf' ? isValidCpf(billing.document) : isValidCnpj(billing.document);

    return documentIsValid && billing.displayName.trim().length >= 3 && isValidZipCode(billing.endereco?.cep ?? '');
};

const luhnCheck = (cardNumber: string) => {
    const digits = digitsOnly(cardNumber);
    let sum = 0;
    let shouldDouble = false;

    for (let index = digits.length - 1; index >= 0; index -= 1) {
        let digit = Number(digits[index]);

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return digits.length >= 13 && digits.length <= 19 && sum % 10 === 0;
};

const isValidExpiry = (value: string) => {
    const digits = digitsOnly(value);

    if (digits.length !== 4) {
        return false;
    }

    const month = Number(digits.slice(0, 2));
    const year = Number(`20${digits.slice(2)}`);

    if (month < 1 || month > 12) {
        return false;
    }

    const now = new Date();
    const expiryDate = new Date(year, month, 0, 23, 59, 59, 999);

    return expiryDate >= now;
};

export const validateCheckoutForm = ({
    customerName,
    customerEmail,
    billing,
    paymentMethod,
    card
}: {
    customerName: string;
    customerEmail: string;
    billing: BillingFormValues;
    paymentMethod: 'pix' | 'boleto' | 'credit_card';
    card: CardFormValues;
}) => {
    const nextErrors: CheckoutFormErrors = {};

    if (!customerName.trim() || customerName.trim().length < 3) {
        nextErrors.customerName = 'Informe o nome do responsavel pela assinatura.';
    }

    if (!customerEmail.trim() || !isValidEmail(customerEmail)) {
        nextErrors.customerEmail = 'Informe um e-mail valido para enviar a cobranca.';
    }

    if (!(billing.documentType === 'cpf' ? isValidCpf(billing.document) : isValidCnpj(billing.document))) {
        nextErrors.billingDocument = billing.documentType === 'cpf' ? 'Informe um CPF valido.' : 'Informe um CNPJ valido.';
    }

    if (!billing.displayName.trim() || billing.displayName.trim().length < 3) {
        nextErrors.billingDisplayName = billing.documentType === 'cpf' ? 'Informe o nome completo do pagador.' : 'Informe a razao social da cobranca.';
    }

    if (!isValidZipCode(billing.endereco?.cep ?? '')) {
        nextErrors.cep = 'Informe um CEP valido com 8 digitos.';
    }

    if (!billing.endereco?.logradouro?.trim()) {
        nextErrors.logradouro = 'Informe o logradouro.';
    }

    if (!billing.endereco?.numero?.trim()) {
        nextErrors.numero = 'Informe o numero.';
    }

    if (!billing.endereco?.bairro?.trim()) {
        nextErrors.bairro = 'Informe o bairro.';
    }

    if (!billing.endereco?.uf?.trim()) {
        nextErrors.uf = 'Selecione o estado.';
    }

    if (!billing.endereco?.municipio?.trim()) {
        nextErrors.municipio = 'Selecione o municipio.';
    }

    if (!billing.endereco?.codigo_municipio?.trim()) {
        nextErrors.codigo_municipio = 'Informe o codigo do municipio.';
    }

    if (!billing.endereco?.codigo_pais?.trim()) {
        nextErrors.codigo_pais = 'Informe o codigo do pais.';
    }

    if (!billing.endereco?.nome_pais?.trim()) {
        nextErrors.nome_pais = 'Informe o nome do pais.';
    }

    if (paymentMethod !== 'credit_card') {
        return nextErrors;
    }

    if (!card.holderName.trim() || card.holderName.trim().length < 3) {
        nextErrors.cardHolderName = 'Informe o nome impresso no cartao.';
    }

    if (!luhnCheck(card.cardNumber)) {
        nextErrors.cardNumber = 'Numero do cartao invalido.';
    }

    if (!isValidExpiry(card.expiry)) {
        nextErrors.expiry = 'Validade invalida ou expirada.';
    }

    const cvvDigits = digitsOnly(card.cvv);
    const brand = detectCardBrand(card.cardNumber);
    const expectedCvvLength = brand === 'amex' ? 4 : 3;

    if (cvvDigits.length !== expectedCvvLength) {
        nextErrors.cvv = `Informe um codigo de seguranca com ${expectedCvvLength} digitos.`;
    }

    return nextErrors;
};

// Mantemos os dados do cartao apenas em memoria local e enviamos somente o token gerado.
export const tokenizeCard = async (card: CardFormValues): Promise<TokenizedCardPayload> => {
    const number = digitsOnly(card.cardNumber);
    const expiryDigits = digitsOnly(card.expiry);
    const tokenSource = `${number.slice(-8)}${Date.now()}`.replace(/\D/g, '');
    const tokenSuffix = tokenSource.slice(-16).padStart(16, '0');

    await wait(650);

    return {
        token: `tok_mock_${tokenSuffix}`,
        brand: detectCardBrand(number),
        last4: number.slice(-4),
        holderName: card.holderName.trim(),
        expMonth: expiryDigits.slice(0, 2),
        expYear: `20${expiryDigits.slice(2)}`
    };
};

export const createCheckoutIdempotencyKey = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID();
    }

    return `idem_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

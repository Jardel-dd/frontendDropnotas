'use client';

import './styled.css';
import '@/app/styles/styledGlobal.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { CheckCircle, ShieldCheck } from 'phosphor-react';
import LoadingScreen from '@/app/loading';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { handleSearchCep } from '@/app/components/seachs/searchCep/controller';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { getCitiesFromState } from '@/app/entity/maps';
import { usePermissions } from '@/app/routes/permissoes';
import { useUser } from '@/app/routes/protected/UserContext';
import type { SubscriptionPaymentMethod, SubscriptionPaymentStatus } from '@/app/entity/SubscriptionPaymentEntity';
import { SUBSCRIPTION_PLAN } from '@/app/entity/SubscriptionPaymentEntity';
import { cancelSubscriptionPayment, createSubscriptionPayment, fetchSubscriptionPaymentStatus } from './controller';
import type { BillingFormValues, CardFormValues, CheckoutFormErrors } from './security';
import { createCheckoutIdempotencyKey, hasBillingDataReady, tokenizeCard, validateCheckoutForm } from './security';
import BillingDataForm from './components/BillingDataForm';
import CreditCardForm from './components/CreditCardForm';
import PaymentMethodSelector from './components/PaymentMethodSelector';
import PaymentStatusCard from './components/PaymentStatusCard';
import PlanSummaryCard from './components/PlanSummaryCard';

const emptyBillingForm: BillingFormValues = {
    documentType: 'cpf',
    document: '',
    displayName: '',
    endereco: new EnderecoEntity({
        cep: '',
        logradouro: '',
        complemento: '',
        numero: '',
        bairro: '',
        municipio: '',
        codigo_municipio: '',
        codigo_pais: '',
        nome_pais: '',
        uf: '',
        telefone: ''
    })
};

const emptyCardForm: CardFormValues = {
    holderName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
};

const statusQueryKey = (paymentId: string | null) => ['subscription-payment-status', paymentId] as const;

export default function AssinaturasPage() {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const previousStatusRef = useRef<SubscriptionPaymentStatus | null>(null);
    const queryClient = useQueryClient();
    const { userConta, isInitializing } = useUser();
    const { permissaoFinanceiro } = usePermissions();
    const canAccess = permissaoFinanceiro.view;

    const [selectedMethod, setSelectedMethod] = useState<SubscriptionPaymentMethod>('pix');
    const [activePaymentId, setActivePaymentId] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [billingForm, setBillingForm] = useState<BillingFormValues>(emptyBillingForm);
    const [cardForm, setCardForm] = useState<CardFormValues>(emptyCardForm);
    const [formErrors, setFormErrors] = useState<CheckoutFormErrors>({});
    const [loadingCep, setLoadingCep] = useState(false);
    const [cepError, setCepError] = useState<string | null>(null);

    useEffect(() => {
        if (!userConta) {
            return;
        }

        setCustomerName((previousValue) => previousValue || userConta.nome || '');
        setCustomerEmail((previousValue) => previousValue || userConta.email || '');
        setBillingForm((previousValue) => ({
            ...previousValue,
            displayName: previousValue.displayName || userConta.nome || ''
        }));
    }, [userConta]);

    useEffect(() => {
        if (isInitializing || canAccess) {
            return;
        }

        if (window.history.length > 1) {
            router.back();
            return;
        }

        router.replace('/dashboard');
    }, [canAccess, isInitializing, router]);

    const paymentStatusQuery = useQuery({
        queryKey: statusQueryKey(activePaymentId),
        queryFn: () => fetchSubscriptionPaymentStatus(activePaymentId as string),
        enabled: Boolean(activePaymentId),
        refetchInterval: (query) => (query.state.data?.payment.status === 'pending' ? 4000 : false),
        refetchIntervalInBackground: true,
        staleTime: 0
    });

    const activePayment = paymentStatusQuery.data?.payment ?? null;
    const currentStatus: SubscriptionPaymentStatus = activePayment?.status ?? 'canceled';
    const isChargeLocked = activePayment?.status === 'pending' || activePayment?.status === 'paid';
    const billingReady = hasBillingDataReady(billingForm);

    const createPaymentMutation = useMutation({
        mutationFn: createSubscriptionPayment,
        onSuccess: (response) => {
            queryClient.setQueryData(statusQueryKey(response.payment.id), response);
            previousStatusRef.current = response.payment.status;
            setActivePaymentId(response.payment.id);
            setFormErrors({});
            setCardForm({ ...emptyCardForm });
            toast.current?.show({
                severity: 'success',
                summary: 'Cobranca criada',
                detail: response.message
            });
        },
        onError: (error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Falha ao criar cobranca',
                detail: error instanceof Error ? error.message : 'Nao foi possivel gerar a cobranca.'
            });
        }
    });

    const cancelPaymentMutation = useMutation({
        mutationFn: cancelSubscriptionPayment,
        onSuccess: (response) => {
            queryClient.setQueryData(statusQueryKey(response.payment.id), response);
            previousStatusRef.current = response.payment.status;
            toast.current?.show({
                severity: 'warn',
                summary: 'Cobranca cancelada',
                detail: response.message
            });
        },
        onError: (error) => {
            toast.current?.show({
                severity: 'error',
                summary: 'Falha ao cancelar',
                detail: error instanceof Error ? error.message : 'Nao foi possivel cancelar a cobranca.'
            });
        }
    });

    useEffect(() => {
        if (!activePayment?.status) {
            previousStatusRef.current = null;
            return;
        }

        if (!previousStatusRef.current) {
            previousStatusRef.current = activePayment.status;
            return;
        }

        if (previousStatusRef.current === activePayment.status) {
            return;
        }

        if (activePayment.status === 'paid') {
            toast.current?.show({
                severity: 'success',
                summary: 'Pagamento confirmado',
                detail: activePayment.statusMessage
            });
        }

        if (activePayment.status === 'canceled') {
            toast.current?.show({
                severity: 'warn',
                summary: 'Pagamento cancelado',
                detail: activePayment.statusMessage
            });
        }

        previousStatusRef.current = activePayment.status;
    }, [activePayment?.status, activePayment?.statusMessage]);

    const headerMessage = useMemo(() => {
        if (!activePayment) {
            return {
                severity: 'info' as const,
                text: billingReady
                    ? 'Dados de cobranca confirmados. Agora escolha uma forma de pagamento para gerar a cobranca recorrente.'
                    : 'Preencha os dados de cobranca para liberar as formas de pagamento.'
            };
        }

        if (activePayment.status === 'pending') {
            return {
                severity: 'warn' as const,
                text: 'Existe uma cobranca pendente. Aguarde a confirmacao automatica ou cancele para gerar outra.'
            };
        }

        if (activePayment.status === 'paid') {
            return {
                severity: 'success' as const,
                text: 'Assinatura ativa. O status continuara sincronizado nesta tela.'
            };
        }

        return {
            severity: 'error' as const,
            text: 'A cobranca foi cancelada. Revise a forma de pagamento e gere uma nova cobranca.'
        };
    }, [activePayment, billingReady]);

    const clearError = (field: keyof CheckoutFormErrors) => {
        setFormErrors((previousErrors) => {
            if (!previousErrors[field]) {
                return previousErrors;
            }

            const nextErrors = { ...previousErrors };
            delete nextErrors[field];
            return nextErrors;
        });
    };

    const handleBillingDocumentTypeChange = (documentType: BillingFormValues['documentType']) => {
        setBillingForm({
            documentType,
            document: '',
            displayName: '',
            endereco: billingForm.endereco
        });

        setFormErrors((previousErrors) => {
            const nextErrors = { ...previousErrors };
            delete nextErrors.billingDocument;
            delete nextErrors.billingDisplayName;
            return nextErrors;
        });
    };

    const handleBillingChange = (field: keyof BillingFormValues, value: string) => {
        setBillingForm((previousValue) => ({
            ...previousValue,
            [field]: value
        }));

        const fieldErrorMap: Partial<Record<keyof BillingFormValues, keyof CheckoutFormErrors>> = {
            document: 'billingDocument',
            displayName: 'billingDisplayName'
        };

        const errorField = fieldErrorMap[field];

        if (errorField) {
            clearError(errorField);
        }
    };

    const handleBillingAddressChange = (event: any) => {
        const id = event?.target?.id ?? event?.id;
        const rawValue = event?.target?.value ?? event?.value ?? '';

        if (!id) {
            return;
        }

        const numericFields = ['cep', 'telefone'];
        const value = numericFields.includes(id) ? String(rawValue).replace(/\D/g, '') : rawValue;

        setBillingForm((previousValue) => ({
            ...previousValue,
            endereco: {
                ...previousValue.endereco,
                [id]: value
            }
        }));

        clearError(id as keyof CheckoutFormErrors);
        setCepError(null);
    };

    const handleBillingAddressDropdownChange = (event: any) => {
        const id = event?.target?.id;
        const value = event?.target?.value ?? event?.value ?? '';

        if (!id) {
            return;
        }

        setBillingForm((previousValue) => ({
            ...previousValue,
            endereco: {
                ...previousValue.endereco,
                [id]: value
            }
        }));

        clearError(id as keyof CheckoutFormErrors);
    };

    const handleMethodChange = (method: SubscriptionPaymentMethod) => {
        setSelectedMethod(method);

        if (method !== 'credit_card') {
            setCardForm({ ...emptyCardForm });
            setFormErrors((previousErrors) => {
                const nextErrors = { ...previousErrors };
                delete nextErrors.cardHolderName;
                delete nextErrors.cardNumber;
                delete nextErrors.expiry;
                delete nextErrors.cvv;
                return nextErrors;
            });
        }
    };

    const handleCardChange = (field: keyof CardFormValues, value: string) => {
        setCardForm((previousValue) => ({
            ...previousValue,
            [field]: value
        }));

        const errorKeyMap: Record<keyof CardFormValues, keyof CheckoutFormErrors> = {
            holderName: 'cardHolderName',
            cardNumber: 'cardNumber',
            expiry: 'expiry',
            cvv: 'cvv'
        };

        clearError(errorKeyMap[field]);
    };

    const handleCopy = async (value: string, successMessage: string) => {
        try {
            await navigator.clipboard.writeText(value);
            toast.current?.show({
                severity: 'success',
                summary: 'Copiado',
                detail: successMessage
            });
        } catch {
            toast.current?.show({
                severity: 'error',
                summary: 'Falha ao copiar',
                detail: 'Nao foi possivel copiar o conteudo para a area de transferencia.'
            });
        }
    };

    const handleResetSimulation = () => {
        setActivePaymentId(null);
        previousStatusRef.current = null;
        setSelectedMethod('pix');
        setCardForm({ ...emptyCardForm });
        setFormErrors({});
        toast.current?.show({
            severity: 'info',
            summary: 'Nova simulacao',
            detail: 'Voce pode gerar uma nova cobranca com outro metodo.'
        });
    };

    const handleCreateCharge = async () => {
        if (createPaymentMutation.isPending || isChargeLocked) {
            return;
        }

        const nextErrors = validateCheckoutForm({
            customerName,
            customerEmail,
            billing: billingForm,
            paymentMethod: selectedMethod,
            card: cardForm
        });

        setFormErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Revise os campos',
                detail: 'Preencha os dados obrigatorios antes de continuar.'
            });
            return;
        }

        try {
            const tokenizedCard = selectedMethod === 'credit_card' ? await tokenizeCard(cardForm) : null;

            await createPaymentMutation.mutateAsync({
                planId: SUBSCRIPTION_PLAN.id,
                amountInCents: SUBSCRIPTION_PLAN.priceInCents,
                customerName,
                customerEmail,
                billingDocumentType: billingForm.documentType,
                billingDocument: billingForm.document,
                billingDisplayName: billingForm.displayName,
                billingZipCode: billingForm.endereco.cep,
                billingAddress: billingForm.endereco,
                paymentMethod: selectedMethod,
                idempotencyKey: createCheckoutIdempotencyKey(),
                card: tokenizedCard
            });
        } catch {
            return;
        }
    };

    const handleCancelCharge = async () => {
        if (!activePaymentId || cancelPaymentMutation.isPending) {
            return;
        }

        try {
            await cancelPaymentMutation.mutateAsync({
                paymentId: activePaymentId
            });
        } catch {
            return;
        }
    };
    if (isInitializing) {
        return <LoadingScreen loadingText="Carregando assinaturas..." />;
    }
    if (!canAccess) {
        return <LoadingScreen loadingText="Redirecionando..." />;
    }
    return (
        <div className="subscription-page scrollable-container">
            <Toast ref={toast} position="top-right" />
            <Messages ref={msgs} className="custom-messages" />
            <div className="card styled-container-main-all-routes ">
                <div className="subscription-layout-grid">
                    <div className="subscription-main-column">
                        <div className="card subscription-form-card">
                            <Message severity={headerMessage.severity} text={headerMessage.text} className="subscription-inline-message" />
                            {cepError && <Message severity="error" text={cepError} className="subscription-inline-message" />}
                            <BillingDataForm
                                value={billingForm}
                                errors={formErrors}
                                onDocumentTypeChange={handleBillingDocumentTypeChange}
                                onChange={handleBillingChange}
                                onAddressChange={handleBillingAddressChange}
                                onAddressDropdownChange={handleBillingAddressDropdownChange}
                                onCepSearch={() => handleSearchCep(billingForm.endereco?.cep || '', setLoadingCep, setBillingForm, setCepError, msgs)}
                                getCitiesFromState={getCitiesFromState}
                                loadingCep={loadingCep}
                                disabled={createPaymentMutation.isPending || isChargeLocked}
                            />
                            {billingReady ? (
                                <>
                                    <div className="subscription-section-header">
                                        <h3>Metodos de pagamento</h3>
                                        <p>Selecione o metodo com o qual deseja gerar a cobranca recorrente.</p>
                                    </div>
                                    <PaymentMethodSelector
                                        selectedMethod={selectedMethod}
                                        onSelect={handleMethodChange}
                                        disabled={createPaymentMutation.isPending || isChargeLocked}
                                    />
                                    {selectedMethod === 'credit_card' && (
                                        <CreditCardForm
                                            value={cardForm}
                                            errors={formErrors}
                                            onChange={handleCardChange}
                                            disabled={createPaymentMutation.isPending || isChargeLocked}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="subscription-gated-panel">
                                    <strong>Formas de pagamento bloqueadas até concluir os dados de cobrança</strong>
                                    <p>Preencha CPF ou CNPJ, {billingForm.documentType === 'cpf' ? 'nome completo' : 'razão social'} e CEP para continuar.</p>
                                </div>
                            )}

                            <div className="subscription-action-bar">
                                <div className="subscription-action-copy">
                                    <strong>Seguranca aplicada</strong>
                                    <p>O valor e o plano sao validados no servidor mock e o cartao nunca e enviado em texto puro.</p>
                                </div>

                                <div className="subscription-action-buttons">
                                    {!isChargeLocked && activePayment?.status === 'canceled' && (
                                        <Button type="button" label="Limpar status" text onClick={handleResetSimulation} />
                                    )}
                                    <Button
                                        type="button"
                                        label={createPaymentMutation.isPending ? 'Gerando cobranca...' : 'Gerar cobranca'}
                                        onClick={handleCreateCharge}
                                        loading={createPaymentMutation.isPending}
                                        disabled={isChargeLocked || !billingReady}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="subscription-side-column">
                        <PlanSummaryCard status={currentStatus} payment={activePayment} isPolling={Boolean(activePaymentId && activePayment?.status === 'pending')} />
                        <PaymentStatusCard
                            payment={activePayment}
                            isPolling={Boolean(activePaymentId && activePayment?.status === 'pending')}
                            isRefreshing={paymentStatusQuery.isFetching}
                            isCancelling={cancelPaymentMutation.isPending}
                            onRefresh={() => {
                                if (!activePaymentId) {
                                    return;
                                }

                                paymentStatusQuery.refetch();
                            }}
                            onCancel={handleCancelCharge}
                            onCopy={handleCopy}
                            onReset={handleResetSimulation}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

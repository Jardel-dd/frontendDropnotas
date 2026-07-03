import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Receipt, SpinnerGap } from 'phosphor-react';
import type { SubscriptionPaymentRecord } from '@/app/entity/SubscriptionPaymentEntity';
import { SUBSCRIPTION_METHOD_META } from '@/app/entity/SubscriptionPaymentEntity';
import MockQrCode from './MockQrCode';

type Props = {
    payment: SubscriptionPaymentRecord | null;
    isPolling: boolean;
    isRefreshing: boolean;
    isCancelling: boolean;
    onRefresh: () => void;
    onCancel: () => void;
    onCopy: (value: string, successMessage: string) => void;
    onReset: () => void;
};

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return 'Nao disponivel';
    }

    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(value));
};

const renderArtifact = (payment: SubscriptionPaymentRecord, onCopy: Props['onCopy']) => {
    if (payment.paymentMethod === 'pix' && payment.pix) {
        return (
            <div className="subscription-artifact-block">
                <div className="subscription-artifact-qr-panel">
                    <MockQrCode value={payment.pix.qrCodeText} />
                    <div className="subscription-artifact-copy">
                        <strong>Pix copia e cola</strong>
                        <p>Valido ate {formatDateTime(payment.pix.expiresAt)}</p>
                        <code>{payment.pix.copyPasteCode}</code>
                        <Button
                            type="button"
                            label="Copiar codigo Pix"
                            icon="pi pi-copy"
                            onClick={() => onCopy(payment.pix!.copyPasteCode, 'Codigo Pix copiado.')}
                            outlined
                        />
                    </div>
                </div>
            </div>
        );
    }

    if (payment.paymentMethod === 'boleto' && payment.boleto) {
        return (
            <div className="subscription-artifact-block">
                <div className="subscription-artifact-copy">
                    <strong>Linha digitavel</strong>
                    <p>Compensacao simulada ate {formatDateTime(payment.boleto.dueDate)}</p>
                    <code>{payment.boleto.digitableLine}</code>
                    <Button
                        type="button"
                        label="Copiar linha digitavel"
                        icon="pi pi-copy"
                        onClick={() => onCopy(payment.boleto!.digitableLine, 'Linha digitavel copiada.')}
                        outlined
                    />
                </div>
            </div>
        );
    }

    if (payment.paymentMethod === 'credit_card' && payment.card) {
        return (
            <div className="subscription-artifact-block">
                <div className="subscription-card-token-box">
                    <strong>Cartao tokenizado com seguranca</strong>
                    <span>
                        {payment.card.brand.toUpperCase()} final {payment.card.last4}
                    </span>
                    <small>{payment.card.holderName}</small>
                </div>
            </div>
        );
    }

    return null;
};

export default function PaymentStatusCard({ payment, isPolling, isRefreshing, isCancelling, onRefresh, onCancel, onCopy, onReset }: Props) {
    if (!payment) {
        return (
            <div className="card subscription-status-card">
                <div className="subscription-card-title-row">
                    <div>
                        <span className="subscription-eyebrow">Status do pagamento</span>
                        <h2>Nenhuma cobranca gerada</h2>
                    </div>
                    <Receipt size={24} />
                </div>

                <Message severity="warn" text="Escolha uma forma de pagamento e gere a cobranca para acompanhar o status da assinatura." />
            </div>
        );
    }

    const methodMeta = SUBSCRIPTION_METHOD_META[payment.paymentMethod];

    return (
        <div className="card subscription-status-card">
            <div className="subscription-card-title-row">
                <div>
                    <span className="subscription-eyebrow">Status do pagamento</span>
                    <h2>{payment.planName}</h2>
                </div>
                {/* <StatusBadge status={payment.status} /> */}
            </div>

            <p className="subscription-status-message">{payment.statusMessage}</p>

            <div className="subscription-status-actions">
                <Button
                    type="button"
                    label={isRefreshing ? 'Atualizando...' : 'Atualizar status'}
                    icon="pi pi-refresh"
                    onClick={onRefresh}
                    outlined
                    disabled={isRefreshing}
                    loading={isRefreshing}
                />
                {payment.status === 'pending' && (
                    <Button type="button" label={isCancelling ? 'Cancelando...' : 'Cancelar cobranca'} severity="danger" onClick={onCancel} loading={isCancelling} />
                )}
                {payment.status !== 'pending' && <Button type="button" label="Nova simulacao" onClick={onReset} text />}
            </div>

            {isPolling && payment.status === 'pending' && (
                <div className="subscription-polling-hint">
                    <SpinnerGap size={16} className="spin-animation" />
                    Atualizacao automatica a cada 4 segundos enquanto o pagamento estiver pendente.
                </div>
            )}

            {renderArtifact(payment, onCopy)}

            <div className="subscription-detail-grid">
                <div>
                    <small>Forma de pagamento</small>
                    <strong>{methodMeta.label}</strong>
                </div>
                <div>
                    <small>Referencia</small>
                    <strong>{payment.externalReference}</strong>
                </div>
                <div>
                    <small>Criado em</small>
                    <strong>{formatDateTime(payment.createdAt)}</strong>
                </div>
                <div>
                    <small>Ultima atualizacao</small>
                    <strong>{formatDateTime(payment.updatedAt)}</strong>
                </div>
                <div>
                    <small>Cliente</small>
                    <strong>{payment.customerEmail}</strong>
                </div>
                <div>
                    <small>{payment.billingDocumentType === 'cpf' ? 'CPF' : 'CNPJ'}</small>
                    <strong>{payment.billingDocument}</strong>
                </div>
                <div>
                    <small>{payment.billingDocumentType === 'cpf' ? 'Nome do pagador' : 'Razão social'}</small>
                    <strong>{payment.billingDisplayName}</strong>
                </div>
                <div>
                    <small>CEP de cobrança</small>
                    <strong>{payment.billingZipCode}</strong>
                </div>
                <div>
                    <small>Gateway</small>
                    <strong>{payment.provider}</strong>
                </div>
            </div>
        </div>
    );
}

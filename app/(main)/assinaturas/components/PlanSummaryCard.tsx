import { CalendarBlank, Lightning, ShieldCheck } from 'phosphor-react';
import type { SubscriptionPaymentRecord, SubscriptionPaymentStatus } from '@/app/entity/SubscriptionPaymentEntity';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS_META, SUBSCRIPTION_METHOD_META } from '@/app/entity/SubscriptionPaymentEntity';
import { formatCurrency } from '@/app/shared/traducaoBr/formatCurrency';

type Props = {
    status: SubscriptionPaymentStatus;
    payment: SubscriptionPaymentRecord | null;
    isPolling: boolean;
};

const formatDate = (value?: string | null) => {
    if (!value) {
        return 'Sem data definida';
    }

    return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium'
    }).format(new Date(value));
};

export default function PlanSummaryCard({ status, payment, isPolling }: Props) {
    const statusMeta = SUBSCRIPTION_STATUS_META[status];
    const methodMeta = payment ? SUBSCRIPTION_METHOD_META[payment.paymentMethod] : null;

    return (
        <div className="card subscription-summary-card">
            <div className="subscription-card-title-row">
                <div>
                    <span className="subscription-eyebrow">Resumo do plano</span>
                    <h2>{SUBSCRIPTION_PLAN.name}</h2>
                </div>
                {/* <StatusBadge status={status} /> */}
            </div>

            <p className="subscription-summary-description">{SUBSCRIPTION_PLAN.description}</p>

            <div className="subscription-price-block">
                <strong>{formatCurrency(SUBSCRIPTION_PLAN.priceInCents / 100)}</strong>
                <span>/ {SUBSCRIPTION_PLAN.billingLabel}</span>
            </div>

            <div className="subscription-summary-grid">
                <div className="subscription-summary-item">
                    <CalendarBlank size={18} />
                    <div>
                        <small>Status atual</small>
                        <strong>{statusMeta.label}</strong>
                    </div>
                </div>
                <div className="subscription-summary-item">
                    <Lightning size={18} />
                    <div>
                        <small>Forma escolhida</small>
                        <strong>{methodMeta?.shortLabel ?? 'Ainda nao definida'}</strong>
                    </div>
                </div>
                <div className="subscription-summary-item">
                    <ShieldCheck size={18} />
                    <div>
                        <small>Vencimento</small>
                        <strong>{payment ? formatDate(payment.dueDate) : 'Gere a cobranca para visualizar'}</strong>
                    </div>
                </div>
            </div>

            <div className="subscription-summary-footer">
                <p>{statusMeta.description}</p>
                {isPolling && payment?.status === 'pending' && <span className="subscription-live-pill">Atualizando automaticamente</span>}
            </div>
        </div>
    );
}

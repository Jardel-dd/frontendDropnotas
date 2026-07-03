// import { CheckCircle, XCircle } from 'phosphor-react';
// import type { SubscriptionPaymentStatus } from '@/app/entity/SubscriptionPaymentEntity';
// import { SUBSCRIPTION_STATUS_META } from '@/app/entity/SubscriptionPaymentEntity';

// const statusIcons = {
//     paid: CheckCircle,
//     canceled: XCircle
// } satisfies Record<SubscriptionPaymentStatus, typeof CheckCircle>;

// type Props = {
//     status: SubscriptionPaymentStatus;
//     compact?: boolean;
// };

// export default function StatusBadge({ status, compact = false }: Props) {
//     const Icon = statusIcons[status];
//     const meta = SUBSCRIPTION_STATUS_META[status];

//     return (
//         <span className={`subscription-status-badge is-${status} ${compact ? 'is-compact' : ''}`}>
//             <Icon size={compact ? 16 : 18} weight="fill" />
//             {meta.label}
//         </span>
//     );
// }

'use client';
import './styles.css';
import { useRef } from 'react';
import '@/app/styles/styledGlobal.css';
import { useSearchParams } from 'next/navigation';
import { FormCreatedPessoa } from '../form/controller';
import { Messages } from '@/app/components/messages/GlobalMessages';

export default function PessoaPage() {
    const searchParams = useSearchParams();
    const pessoaId = searchParams.get('id');
    const msgs = useRef<Messages | null>(null);
    return (
        <div className="card styled-container-main-all-routes">
            <FormCreatedPessoa
                key={pessoaId ?? 'novo'}
                msgs={msgs}
                initialId={pessoaId}
                showBTNPGCreatedAll
            />
        </div>
    );
}

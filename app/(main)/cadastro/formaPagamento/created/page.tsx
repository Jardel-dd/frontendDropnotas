'use client';
import './style.css'
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import { FormaPagamentoEntity, TipoFormaPagamento } from '@/app/entity/FormaPagamento';
import FormaPagamentoForm, { FormaPagamentoFormRef } from '@/app/components/pages/FormaPagamento/formaPagamentoForm';

export default function CriarServicos() {
    const searchParams = useSearchParams();
    const msgs = useRef<Messages | null>(null);
    const formaPagamentoId = searchParams.get('id');
    const formRef = useRef<FormaPagamentoFormRef>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoEntity>(
        new FormaPagamentoEntity({
            ativo: true,
            id: 0,
            descricao: '',
            observacao: '',
            tipo_forma_pagamento: '' as TipoFormaPagamento,
            tipo_taxa: '',
            valor_taxa: 0,
        }
        ));
    const handleFormaPagamentoChange = (updatedFormaPagamento: FormaPagamentoEntity) => {
        setFormaPagamento(updatedFormaPagamento);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    return (
        <div className="card styled-container-main-all-routes">
                <FormaPagamentoForm
                    msgs={msgs}
                    ref={formRef}
                    formaPagamento={formaPagamento}
                    initialId={formaPagamentoId}
                    setFormaPagamento={setFormaPagamento}
                    onFormaPagamentoChange={handleFormaPagamentoChange}
                    onErrorsChange={handleErrorsChange}
                    showBTNPGCreatedAll={true}
                />
        </div >
    );
}
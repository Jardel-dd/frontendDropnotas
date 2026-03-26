'use client';
import './style.css'
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import FormContasReceberCreated from '../form/receber';
import { ContasReceberEntity } from '@/app/entity/contasReceberEntity';
import { ContasReceberFormRef } from '../types/receber';

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export default function CriarContasReceber() {
    const searchParams = useSearchParams();
    const msgs = useRef<Messages | null>(null);
    const contasReceberId = searchParams.get('id');
    const formRef = useRef<ContasReceberFormRef>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [contasReceber, setContasReceber] = useState<ContasReceberEntity>(
        new ContasReceberEntity({
            ativo: true,
            id: 0,
            descricao: '',
            id_forma_pagamento: 0,
            id_vendedor: 0,
            id_cliente: 0,
            valor_original: 0,
            data_vencimento: getTodayDate(),
            observacao: ''
        }
        ));
    const handleContasReceberChange = (updatedContasReceber: ContasReceberEntity) => {
        setContasReceber(updatedContasReceber);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    return (
        <div className="card styled-container-main-all-routes">
            <FormContasReceberCreated
                msgs={msgs}
                ref={formRef}
                contasReceber={contasReceber}
                initialId={contasReceberId}
                setContasReceber={setContasReceber}
                onContasReceberChange={handleContasReceberChange}
                onErrorsChange={handleErrorsChange}
                showBTNPGCreatedAll={true}
            />
        </div >
    );
}

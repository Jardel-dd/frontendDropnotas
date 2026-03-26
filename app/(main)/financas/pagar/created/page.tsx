'use client';
import './style.css'
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import FormContasPagarCreated from '../form/pagar';
import { ContasPagarEntity } from '@/app/entity/contasPagarEntity';
import { ContasPagarFormRef } from '../types/pagar';

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export default function CriarContasPagar() {
    const searchParams = useSearchParams();
    const msgs = useRef<Messages | null>(null);
    const contasPagarId = searchParams.get('id');
    const formRef = useRef<ContasPagarFormRef>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [contasPagar, setContasPagar] = useState<ContasPagarEntity>(
        new ContasPagarEntity({
            ativo: true,
            id: 0,
            descricao: '',
            id_fornecedor: 0,
            valor_original: 0,
            valor_total: 0,
            data_vencimento: getTodayDate(),
            observacao: ''
        }
        ));
    const handleContasPagarChange = (updatedContasPagar: ContasPagarEntity) => {
        setContasPagar(updatedContasPagar);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    return (
        <div className="card styled-container-main-all-routes">
            <FormContasPagarCreated
                msgs={msgs}
                ref={formRef}
                contasPagar={contasPagar}
                initialId={contasPagarId}
                setContasPagar={setContasPagar}
                onContasPagarChange={handleContasPagarChange}
                onErrorsChange={handleErrorsChange}
                showBTNPGCreatedAll={true}
            />
        </div >
    );
}

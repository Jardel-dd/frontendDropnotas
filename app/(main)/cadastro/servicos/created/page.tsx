'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import { createEmptyServico, ServiceFormRef } from '../types/servico';
import { FormCreatedServico } from '../form/controller';
import { ServiceEntity } from '@/app/entity/ServiceEntity';

export default function CriarServicos() {
    const searchParams = useSearchParams();
    const servicosID = searchParams.get('id');
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<ServiceFormRef>(null);
    const [servico, setServico] = useState<ServiceEntity>(createEmptyServico());
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleServicoChange = (updatedServico: ServiceEntity) => {
        setServico(updatedServico);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    return (
        <div className="card styled-container-main-all-routes">
            <FormCreatedServico msgs={msgs} ref={formRef} servico={servico} initialId={servicosID} setServico={setServico} onServicoChange={handleServicoChange} onErrorsChange={handleErrorsChange} redirectAfterSave={true} showBTNPGCreatedAll={true} />
        </div>
    );
}

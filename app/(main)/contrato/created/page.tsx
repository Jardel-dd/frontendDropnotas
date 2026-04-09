'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { ContratoFormCreated, ContratoFormRef } from '../form/controller';
export default function CriarContrato() {
    const msgs = useRef<Messages>(null);
    const searchParams = useSearchParams();
    const contratoId = searchParams.get('id');
    const formRef = useRef<ContratoFormRef>(null);
    const [contrato, setContrato] = useState<ContratoEntity>(
        new ContratoEntity({
            ativo: true,
            id: 0,
            descricao: '',
            valor_servico: null,
            periodicidade: '',
            emitir_boleto: false,
            enviar_email: false,
            enviar_whatsapp: false,
            id_servico: null,
            id_empresa: null,
            id_categoria_contrato: null,
            id_forma_pagamento: null,
            id_clientes_contrato: [0]
        })
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    const handleContrato = (updatedContrato: ContratoEntity) => {
        setContrato(updatedContrato);
    };
    return (
        <div>
          <ContratoFormCreated
                    msgs={msgs}
                    ref={formRef}
                    contrato={contrato}
                    initialId={contratoId}
                    setContrato={setContrato}
                    onContratoChange={handleContrato}
                    onErrorsChange={handleErrorsChange}
                    redirectAfterSave={false}
                    showBTNPGCreatedDialog={true}
                />
        </div>
    );
}

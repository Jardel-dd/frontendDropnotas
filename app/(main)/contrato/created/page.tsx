'use client';
import './styledContrato.css';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { useRouter, useSearchParams } from 'next/navigation';
import ContratoForm from '@/app/components/pages/Contratos/contrato';
import { VendedorFormRef } from '@/app/components/pages/Vendedores/sellerForm';


export default function CriarContrato() {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const searchParams = useSearchParams();
    const contratoId = searchParams.get('id');
    const formRef = useRef<VendedorFormRef>(null);
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
          <ContratoForm
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

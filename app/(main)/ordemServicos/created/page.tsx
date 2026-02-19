'use client';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import { Formas_recebimento } from '@/app/entity/FormaPagamento';
import { DetalServiceOSEntity } from '@/app/entity/ServiceEntity';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';
import OrdemServicoForm, { OrdemServicoFormRef } from '@/app/components/pages/OrdemServico/ordemServicoForm';

export default function CriarOrdemServico() {
    const searchParams = useSearchParams();
    const ordemServicoID = searchParams.get('id');
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<OrdemServicoFormRef>(null);
    const [ordemServico, setOrdemServico] = useState<ServiceOrderEntity>(
        new ServiceOrderEntity({
            id: 0,
            numero: 0,
            ativo: true,
            descricao: '',
            consideracoes_finais: '',
            data_hora_inicio: new Date(),
            data_hora_prevista: new Date(),
            data_hora_conclusao: new Date(),
            observacao_servico: '',
            observacao_interna: '',
            servicos: new DetalServiceOSEntity({
                id_servico: 0,
                descricao: '',
                descricao_completa: '',
                codigo: '',
                quantidade: 0,
                valor_servico: 0,
                valor_desconto: 0
            }),
            formas_recebimento: new Formas_recebimento({
                id_forma_recebimento: 0,
                valor_taxa: 0,
                valor_recebido: 0,
                percentual_taxa: 0
            }),
            id_vendedor: 0,
            id_forma_pagamento: 0,
            id_cliente: 0,
            id_empresa: 0,
            orcar: true
        })
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleOrdemServicoChange = (updatedOrdemServico: ServiceOrderEntity) => {
        setOrdemServico(updatedOrdemServico);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    return (
        <div className="card styled-container-main-all-routes">
            <OrdemServicoForm
                msgs={msgs}
                ref={formRef}
                ordemServico={ordemServico}
                initialId={ordemServicoID}
                setOrdemServico={setOrdemServico}
                onOrdemServicoChange={handleOrdemServicoChange}
                onErrorsChange={handleErrorsChange}
                redirectAfterSave={true}
                showBTNPGCreatedAll={true}
            />
        </div>
    );
}

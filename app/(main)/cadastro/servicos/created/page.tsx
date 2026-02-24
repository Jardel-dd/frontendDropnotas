'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import ServiceForm, { ServiceFormRef } from '@/app/components/pages/Servicos/serviceForm';

export default function CriarServicos() {
    const searchParams = useSearchParams();
    const servicosID = searchParams.get('id');
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<ServiceFormRef>(null);
    const [servico, setServico] = useState<ServiceEntity>(
        new ServiceEntity({
                ativo: true,
                id: 0,
                descricao: '',
                descricao_completa: '',
                codigo: '',
                item_lista_servico: '',
                exigibilidade_iss: '',
                iss_retido: '',
                observacoes: '',
                codigo_municipio: '',
                numero_processo: '',
                responsavel_retencao: '',
                codigo_cnae: '',
                codigo_nbs: '',
                codigo_inter_contr: '',
                codigo_indicador_operacao: '',
                tipo_operacao: 0,
                finalidade_nfse: 0,
                indicador_finalidade: 0,
                indicador_destinatario: 0,
                codigo_situacao_tributaria: '',
                codigo_classificacao_tributaria: '',
                codigo_situacao_tributaria_regular: '',
                codigo_classificacao_tributaria_regular: '',
                codigo_credito_presumido: '',
                percentual_diferencial_uf: 0,
                percentual_diferencial_municipal: 0,
                percentual_diferencial_cbs: 0,
                valor_servico: null,
                valor_desconto: 0
            })
        );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleServicoChange = (updatedServico: ServiceEntity) => {
        setServico(updatedServico);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    return (
        <div className="card styled-container-main-all-routes">
            <ServiceForm msgs={msgs} ref={formRef} servico={servico} initialId={servicosID} setServico={setServico} onServicoChange={handleServicoChange} onErrorsChange={handleErrorsChange} redirectAfterSave={true} showBTNPGCreatedAll={true} />
        </div>
    );
}

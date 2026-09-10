'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import { PerfilTributarioEntity } from '@/app/entity/perfilTributarioEntity';
import { PerfilTributarioFormRef } from '../types/perfilTributario';
import { FormCreatedPerfilTributario } from '../form/controller';

export default function CriarPerfilTributario() {
    const searchParams = useSearchParams();
    const perfilTributarioID = searchParams.get('id');
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<PerfilTributarioFormRef>(null);
    const [perfilTributario, setPerfilTributario] = useState<PerfilTributarioEntity>(
        new PerfilTributarioEntity({
                ativo: true,
                id: 0,
                nome: '',
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
                tipo_operacao: '',
                finalidade_nfse: 0,
                indicador_finalidade: 0,
                indicador_destinatario: '',
                codigo_situacao_tributaria: '',
                codigo_classificacao_tributaria: '',
                codigo_situacao_tributaria_regular: '',
                codigo_classificacao_tributaria_regular: '',
                codigo_credito_presumido: '',
                percentual_diferencial_uf: 0,
                percentual_diferencial_municipal: 0,
                percentual_diferencial_cbs: 0,
            })
        );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handlePerfilTributarioChange = (updatedPerfilTributario: PerfilTributarioEntity) => {
        setPerfilTributario(updatedPerfilTributario);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    return (
        <div className="card styled-container-main-all-routes">
            <FormCreatedPerfilTributario msgs={msgs} ref={formRef} perfilTributario={perfilTributario} initialId={perfilTributarioID} setPerfilTributario={setPerfilTributario} onPerfilTributarioChange={handlePerfilTributarioChange} onErrorsChange={handleErrorsChange} redirectAfterSave={true} showBTNPGCreatedAll={true} />
        </div>
    );
}

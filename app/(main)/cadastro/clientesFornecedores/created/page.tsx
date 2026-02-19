'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import PessoaForm, { PessoaFormRef } from '@/app/components/pages/Pessoa/personForm';

export default function Pessoa() {
    const searchParams = useSearchParams();
    const pessoaId = searchParams.get('id');
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<PessoaFormRef>(null);
    const [pessoa, setPessoa] = useState<PessoaEntity[]>([
        new PessoaEntity({
            id: 0,
            razao_social: '',
            nome_fantasia: '',
            cpf: null,
            rg: null,
            email: '',
            documento_estrangeiro: null,
            cnpj: null,
            inscricao_estadual: '',
            inscricao_municipal: '',
            atividade_principal: '',
            cnae_fiscal: '',
            data_fundacao: '',
            pessoa_cliente: false,
            pessoa_fornecedor: false,
            codigo_regime_tributario: '',
            tipo_pessoa: 'PESSOA_JURIDICA',
            contribuinte: '',
            // telefone: '',
            endereco: {} as EnderecoEntity,
            arquivo_contrato: '',
            id_vendedor_padrao: null,
            ativo: true,
            pais: ''
        })
    ]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    const handlePessoaChange = (updatedPessoa: PessoaEntity) => {
        setPessoa([updatedPessoa]);
    };
    return (
        <div className="card styled-container-main-all-routes">
            <PessoaForm
                msgs={msgs}
                ref={formRef}
                pessoa={pessoa}
                initialId={pessoaId}
                setPessoa={setPessoa}
                onPessoaChange={handlePessoaChange}
                onErrorsChange={handleErrorsChange}
                showBTNPGCreatedAll={true}
                // redirectAfterSave={true}
            />
        </div>
    );
}

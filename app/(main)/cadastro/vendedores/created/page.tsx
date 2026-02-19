'use client';
import './style.css'
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { validateFieldsVendedor } from '../controller/validate';
import VendedorForm, { VendedorFormRef } from '@/app/components/pages/Vendedores/sellerForm';

export default function Vendedores() {
    const searchParams = useSearchParams();
    const vendedorId = searchParams.get('id');
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<VendedorFormRef>(null);
    const [vendedor, setVendedor] = useState<VendedorEntity>(
        new VendedorEntity({
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
            codigo_regime_tributario: '',
            tipo_pessoa: 'PESSOA_JURIDICA',
            contribuinte: '',
            telefone: '',
            endereco: {} as EnderecoEntity,
            arquivo_contrato: '',
            percentual_comissao: 0,
            id_vendedor_padrao: null,
            ativo: true,
        })
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    const handleVendedorChange = (updatedVendedor: VendedorEntity) => {
        setVendedor(updatedVendedor);
    };
    useEffect(() => {
        validateFieldsVendedor(vendedor, setErrors, msgs);
    }, [vendedor]);
    return (
        <div className="card styled-container-main-all-routes"  >
            <VendedorForm
                msgs={msgs}
                ref={formRef}
                vendedor={vendedor}
                initialId={vendedorId}
                setVendedor={setVendedor}
                onVendedorChange={handleVendedorChange}
                onErrorsChange={handleErrorsChange}
                showBTNPGCreatedAll={true}
            />
        </div>
    );
}
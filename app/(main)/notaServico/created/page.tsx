'use client';
import { useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useSearchParams } from 'next/navigation';
import { NfsEntity } from '@/app/entity/NfsEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { DetalTomadorEntity } from '@/app/entity/PessoaEntity';
import { DetalPrestadorEntity } from '@/app/entity/CompanyEntity';
import { DetalPrestadorValoresEntity, DetalServiceEntity } from '@/app/entity/ServiceEntity';
import NotaServicoForm, { NotaServicoFormRef } from '@/app/components/pages/NotaServico/notaServicoForm';

export default function CriarNotaServico() {
    const searchParams = useSearchParams();
    const notaServicoID = searchParams.get('id');
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<NotaServicoFormRef>(null);
    const [gerarNfse, setGerarNfse] = useState<NfsEntity>(
        new NfsEntity({
            referencia: '',
            competencia: '',
            regime_especial_tributacao: '',
            prestador: new DetalPrestadorEntity({
                cpf_cnpj: 0,
                inscricao_municipal: '',
                razao_social: '',
                nome_fantasia: '',
                telefone: 0,
                email: '',
                prestacao_sus: false,
                optante_simples_nacional: false,
                incentivo_fiscal: false,
                endereco: new EnderecoEntity({
                    cep: '',
                    logradouro: '',
                    complemento: '',
                    numero: '',
                    bairro: '',
                    municipio: '',
                    codigo_municipio: '',
                    codigo_pais: '',
                    nome_pais: '',
                    uf: '',
                    telefone: ''
                })
            }),
            servico: new DetalServiceEntity({
                id_servico: 0,
                descricao: '',
                descricao_completa: '',
                codigo: '',
                codigo_municipio: '',
                valor_total: 0,
                valores: new DetalPrestadorValoresEntity({
                    base_calculo: 0,
                    valor_servico: 0,
                    aliquota_iss: 0,
                    aliquota_deducoes: 0,
                    aliquota_pis: 0,
                    aliquota_cofins: 0,
                    aliquota_inss: 0,
                    aliquota_ir: 0,
                    aliquota_csll: 0,
                    aliquota_outras_retencoes: 0,
                    percentual_desconto_incondicionado: 0,
                    percentual_desconto_condicionado: 0
                })
            }),
            tomador: new DetalTomadorEntity({
                cpf_cnpj: 0,
                razao_social: '',
                email: '',
                endereco: new EnderecoEntity({
                    cep: '',
                    logradouro: '',
                    complemento: '',
                    numero: '',
                    bairro: '',
                    municipio: '',
                    codigo_municipio: '',
                    codigo_pais: '',
                    nome_pais: '',
                    uf: '',
                    telefone: ''
                })
            })
        })
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleNotaServicoChange = (updatedNotaServico: NfsEntity) => {
        setGerarNfse(updatedNotaServico);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    return (
        <div className="card styled-container-main-all-routes">
            <NotaServicoForm
                msgs={msgs}
                ref={formRef}
                notaServico={gerarNfse}
                initialId={notaServicoID}
                setNotaServico={setGerarNfse}
                onNotaServicoChange={handleNotaServicoChange}
                onErrorsChange={handleErrorsChange}
                redirectAfterSave={true}
                showBTNPGCreatedAll={true}
            />
        </div>
    );
}

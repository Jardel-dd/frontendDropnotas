'use client';
import { useRef, useState } from "react";
import { Messages } from "primereact/messages";
import { EnderecoEntity } from "@/app/entity/enderecoEntity";
import { CompanyEntity } from "@/app/entity/CompanyEntity";
import { useSearchParams } from "next/navigation";
import EmpresaForm, { EmpresaFormRef } from "@/app/components/pages/Empresa/companyForm";

export default function CriarEmpresas() {
    const searchParams = useSearchParams();
    const empresaId = searchParams.get('id');
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<EmpresaFormRef>(null);
    const [empresa, setEmpresa] = useState<CompanyEntity>(
        new CompanyEntity({
            id: 0,
            id_usuarios_acesso: [0],
            cnpj: '',
            razao_social: '',
            nome_fantasia: '',
            logo_empresa: '',
            atividade_principal: '',
            inscricao_estadual: '',
            inscricao_municipal: '',
            codigo_regime_tributario: '',
            tipo_rps: '',
            endereco: {} as EnderecoEntity,
            cnaes_secundarios: ['0'],
            certificado_digital: '',
            data_vencimento_certificado_digital: '',
            senha_certificado_digital: '',
            nome_certificado_digital: '',
            serie_emissao_nfse: '',
            proximo_numero_rps: null,
            proximo_numero_lote: null,
            aliquota_iss: null,
            cnae_fiscal: '',
            prestacao_sus: false,
            regime_especial_tributacao: '',
            incentivo_fiscal: false,
            email: '',
            telefone: '',
            ativo: true,
            aliquota_pis: 0,
            aliquota_cofins: 0,
            aliquota_inss: 0,
            aliquota_ir: 0,
            aliquota_csll: 0,
            aliquota_outras_retencoes: 0,
            aliquota_deducoes: 0,
            percentual_desconto_incondicionado: 0,
            percentual_desconto_condicionado: 0,

        }));
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const handleEmpresaChange = (updatedEmpresa: CompanyEntity) => {
        setEmpresa(updatedEmpresa);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    return (
        <div className="card styled-container-main-all-routes">
            <EmpresaForm
                msgs={msgs}
                ref={formRef}
                empresa={empresa}
                initialId={empresaId}
                setEmpresa={setEmpresa}
                onEmpresaChange={handleEmpresaChange}
                onErrorsChange={handleErrorsChange}
                redirectAfterSave={true}
                showBTNPGCreatedAll={true}

            />
        </div >
    );
}

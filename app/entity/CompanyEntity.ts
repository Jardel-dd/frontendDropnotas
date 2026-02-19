import { EnderecoEntity } from "./enderecoEntity";


export class CompanyEntity  {
    id!: number;
    id_usuarios_acesso!: number[];
    cnpj!: string;
    razao_social!: string;
    nome_fantasia!: string;
    logo_empresa!: string;
    atividade_principal!: string;
    inscricao_estadual?: string;
    inscricao_municipal!: string;
    codigo_regime_tributario!: string;
    tipo_rps!: string;
    cnaes_secundarios?: string[];
    endereco!: EnderecoEntity;
    certificado_digital!: string;
    data_vencimento_certificado_digital?: string;
    status_certificado_digital?: string;
    senha_certificado_digital!: string;
    nome_certificado_digital?: string;
    serie_emissao_nfse!: string;
    proximo_numero_rps!: number | null;
    proximo_numero_lote!: number | null;
    aliquota_iss!: number | null;
    cnae_fiscal!: string;
    prestacao_sus!: boolean;
    regime_especial_tributacao!: string;
    incentivo_fiscal!: boolean;
    telefone?: string;
    email?: string;
    // emitir_padrao_nacional?:boolean;
    ativo?: boolean;
    aliquota_pis!: number | null;
    aliquota_cofins!: number | null;
    aliquota_inss!: number | null;
    aliquota_ir!: number | null;
    aliquota_csll!: number | null;
    aliquota_outras_retencoes!: number | null;
    aliquota_deducoes!: number | null;
    percentual_desconto_incondicionado!: number | null;
    percentual_desconto_condicionado!: number | null;
    constructor({
        id,
        id_usuarios_acesso,
        cnpj,
        razao_social,
        nome_fantasia,
        logo_empresa,
        atividade_principal,
        inscricao_estadual,
        inscricao_municipal,
        codigo_regime_tributario,
        tipo_rps,
        cnaes_secundarios,
        endereco,
        // emitir_padrao_nacional,
        certificado_digital,
        data_vencimento_certificado_digital,
        status_certificado_digital,
        senha_certificado_digital,
        nome_certificado_digital,
        serie_emissao_nfse,
        proximo_numero_rps,
        proximo_numero_lote,
        aliquota_iss,
        cnae_fiscal,
        prestacao_sus,
        regime_especial_tributacao,
        incentivo_fiscal,
        email,
        telefone,
        ativo,
        aliquota_pis,
        aliquota_cofins,
        aliquota_inss,
        aliquota_ir,
        aliquota_csll,
        aliquota_outras_retencoes,
        aliquota_deducoes,
        percentual_desconto_incondicionado,
        percentual_desconto_condicionado,
    }: {
        id?: number;
        id_usuarios_acesso?: number[];
        cnpj: string;
        razao_social: string;
        nome_fantasia: string;
        logo_empresa?: string;
        atividade_principal: string;
        inscricao_estadual?: string;
        inscricao_municipal: string;
        codigo_regime_tributario: string;
        tipo_rps: string;
        cnaes_secundarios?: string[];
        endereco: EnderecoEntity;
        certificado_digital: string;
        data_vencimento_certificado_digital?: string;
        status_certificado_digital?: string;
        senha_certificado_digital: string;
        nome_certificado_digital?: string;
        serie_emissao_nfse: string;
        proximo_numero_rps: number | null;
        proximo_numero_lote: number | null;
        aliquota_iss: number | null;
        cnae_fiscal: string;
        prestacao_sus: boolean;
        regime_especial_tributacao: string;
        incentivo_fiscal: boolean;
        email?: string;
        telefone?: string;
        ativo?: boolean;
        aliquota_pis?: number | null;
        aliquota_cofins?: number | null;
        aliquota_inss?: number | null;
        aliquota_ir?: number | null;
        aliquota_csll?: number | null;
        aliquota_outras_retencoes?: number | null;
        aliquota_deducoes?: number | null;
        percentual_desconto_incondicionado?: number | null;
        percentual_desconto_condicionado?: number | null;
    }) {
        Object.assign(this, {
            id,
            id_usuarios_acesso,
            cnpj,
            razao_social,
            nome_fantasia,
            logo_empresa,
            atividade_principal,
            inscricao_estadual,
            inscricao_municipal,
            codigo_regime_tributario,
            tipo_rps,
            cnaes_secundarios,
            endereco,
            certificado_digital,
            data_vencimento_certificado_digital,
            status_certificado_digital,
            senha_certificado_digital,
            nome_certificado_digital,
            serie_emissao_nfse,
            proximo_numero_rps,
            proximo_numero_lote,
            aliquota_iss,
            cnae_fiscal,
            prestacao_sus,
            regime_especial_tributacao,
            incentivo_fiscal,
            email,
            telefone,
            ativo,
            aliquota_pis,
            aliquota_cofins,
            aliquota_inss,
            aliquota_ir,
            aliquota_csll,
            aliquota_outras_retencoes,
            aliquota_deducoes,
            percentual_desconto_incondicionado,
            percentual_desconto_condicionado,
        });
    }

    copyWith({
        id,
        id_usuarios_acesso,
        cnpj,
        razao_social,
        nome_fantasia,
        logo_empresa,
        atividade_principal,
        inscricao_estadual,
        inscricao_municipal,
        codigo_regime_tributario,
        tipo_rps,
        cnaes_secundarios,
        endereco,
        certificado_digital,
        data_vencimento_certificado_digital,
        status_certificado_digital,
        senha_certificado_digital,
        nome_certificado_digital,
        serie_emissao_nfse,
        proximo_numero_rps,
        proximo_numero_lote,
        aliquota_iss,
        cnae_fiscal,
        prestacao_sus,
        regime_especial_tributacao,
        incentivo_fiscal,
        email,
        telefone,
        ativo,
        aliquota_pis,
        aliquota_cofins,
        aliquota_inss,
        aliquota_ir,
        aliquota_csll,
        aliquota_outras_retencoes,
        aliquota_deducoes,
        percentual_desconto_incondicionado,
        percentual_desconto_condicionado,
    }: {
        id?: number;
        id_usuarios_acesso?: number[];
        cnpj?: string;
        razao_social?: string;
        nome_fantasia?: string;
        logo_empresa?: string;
        atividade_principal?: string;
        inscricao_estadual?: string;
        inscricao_municipal?: string;
        codigo_regime_tributario?: string;
        tipo_rps?: string;
        cnaes_secundarios?: string[];
        endereco?: EnderecoEntity;
        certificado_digital?: string;
        data_vencimento_certificado_digital?: string;
        status_certificado_digital?: string;
        senha_certificado_digital?: string;
        nome_certificado_digital?: string;
        aliquota_iss?: number | string | null;
        proximo_numero_rps?: number | string | null;
        proximo_numero_lote?: number | string | null;
        serie_emissao_nfse?: string;
        cnae_fiscal?: string;
        prestacao_sus?: boolean;
        regime_especial_tributacao?: string;
        incentivo_fiscal?: boolean;
        email?: string;
        telefone?: string;
        ativo?: boolean;
        aliquota_pis?: number | null;
        aliquota_cofins?: number | null;
        aliquota_inss?: number | null;
        aliquota_ir?: number | null;
        aliquota_csll?: number | null;
        aliquota_outras_retencoes?: number | null;
        aliquota_deducoes?: number | null;
        percentual_desconto_incondicionado?: number | null;
        percentual_desconto_condicionado?: number | null;
    }): CompanyEntity {
        return new CompanyEntity({
            id: id ?? this.id,
            id_usuarios_acesso: id_usuarios_acesso ?? this.id_usuarios_acesso,
            cnpj: cnpj ?? this.cnpj,
            razao_social: razao_social ?? this.razao_social,
            nome_fantasia: nome_fantasia ?? this.nome_fantasia,
            logo_empresa: logo_empresa ?? this.logo_empresa,
            atividade_principal: atividade_principal ?? this.atividade_principal,
            inscricao_estadual: inscricao_estadual ?? this.inscricao_estadual,
            inscricao_municipal: inscricao_municipal ?? this.inscricao_municipal,
            codigo_regime_tributario: codigo_regime_tributario ?? this.codigo_regime_tributario,
            tipo_rps: tipo_rps ?? this.tipo_rps,
            cnaes_secundarios: cnaes_secundarios ?? this.cnaes_secundarios,
            endereco: endereco ?? this.endereco,
            certificado_digital: certificado_digital ?? this.certificado_digital,
            data_vencimento_certificado_digital: data_vencimento_certificado_digital ?? this.data_vencimento_certificado_digital,
            status_certificado_digital: status_certificado_digital ?? this.status_certificado_digital,
            senha_certificado_digital: senha_certificado_digital ?? this.senha_certificado_digital,
            nome_certificado_digital: nome_certificado_digital ?? this.nome_certificado_digital,
            aliquota_iss: aliquota_iss != null ? Number(aliquota_iss) : this.aliquota_iss,
            proximo_numero_rps: proximo_numero_rps != null ? Number(proximo_numero_rps) : this.proximo_numero_rps,
            proximo_numero_lote: proximo_numero_lote != null ? Number(proximo_numero_lote) : this.proximo_numero_lote,
            serie_emissao_nfse: serie_emissao_nfse ?? this.serie_emissao_nfse,
            cnae_fiscal: cnae_fiscal ?? this.cnae_fiscal,
            prestacao_sus: prestacao_sus ?? this.prestacao_sus,
            regime_especial_tributacao: regime_especial_tributacao ?? this.regime_especial_tributacao,
            incentivo_fiscal: incentivo_fiscal ?? this.incentivo_fiscal,
            email: email ?? this.email,
            telefone: telefone ?? this.telefone,
            ativo: ativo ?? this.ativo,
            aliquota_pis: aliquota_pis ?? this.aliquota_pis,
            aliquota_cofins: aliquota_cofins ?? this.aliquota_cofins,
            aliquota_inss: aliquota_inss ?? this.aliquota_inss,
            aliquota_ir: aliquota_ir ?? this.aliquota_ir,
            aliquota_csll: aliquota_csll ?? this.aliquota_csll,
            aliquota_outras_retencoes: aliquota_outras_retencoes ?? this.aliquota_outras_retencoes,
            aliquota_deducoes: aliquota_deducoes ?? this.aliquota_deducoes,
            percentual_desconto_incondicionado: percentual_desconto_incondicionado ?? this.percentual_desconto_incondicionado,
            percentual_desconto_condicionado: percentual_desconto_condicionado ?? this.percentual_desconto_condicionado,
        });
    }
};
export class DetalPrestadorEntity {
    cpf_cnpj!: number;
    inscricao_municipal!: string;
    razao_social!: string;
    nome_fantasia!: string;
    telefone!: number;
    email!: string;
    prestacao_sus!: boolean;
    optante_simples_nacional!: boolean;
    incentivo_fiscal!: boolean;
    endereco!: EnderecoEntity;

    constructor({
        cpf_cnpj,
        inscricao_municipal,
        razao_social,
        nome_fantasia,
        telefone,
        email,
        prestacao_sus,
        optante_simples_nacional,
        incentivo_fiscal,
        endereco,
    }: {
        cpf_cnpj: number;
        inscricao_municipal: string;
        razao_social: string;
        nome_fantasia: string;
        telefone: number;
        email: string;
        prestacao_sus: boolean;
        optante_simples_nacional: boolean;
        incentivo_fiscal: boolean;
        endereco: EnderecoEntity;
    }) {
        Object.assign(this, {
            cpf_cnpj,
            inscricao_municipal,
            razao_social,
            nome_fantasia,
            telefone,
            email,
            prestacao_sus,
            optante_simples_nacional,
            incentivo_fiscal,
            endereco,
        });
    }
};
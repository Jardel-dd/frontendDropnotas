import { EnderecoEntity } from "./enderecoEntity";

export class VendedorEntity {
    id!: number;
    razao_social!: string;
    nome_fantasia?: string;
    cpf!: string | null;
    rg!: string | null;
    email?: string;
    documento_estrangeiro: string | null = null;
    cnpj: string | null = null;
    inscricao_estadual?: string;
    inscricao_municipal?: string;
    atividade_principal?: string;
    codigo_regime_tributario?: string;
    tipo_pessoa?: string;
    contribuinte?: string;
    telefone?: string;
    endereco!: EnderecoEntity;
    arquivo_contrato?: string;
    id_vendedor_padrao?: number | null;
    percentual_comissao!: number | null;
    ativo?: boolean;
    pais?: string;

    constructor({
        id,
        razao_social,
        nome_fantasia,
        cpf,
        rg,
        email,
        documento_estrangeiro,
        cnpj,
        inscricao_estadual,
        inscricao_municipal,
        atividade_principal,
        codigo_regime_tributario,
        tipo_pessoa,
        contribuinte,
        telefone,
        endereco,
        arquivo_contrato,
        id_vendedor_padrao,
        percentual_comissao,
        ativo,
        pais
    }: {
        id: number;
        razao_social: string;
        nome_fantasia?: string;
        cpf?: string | null;
        rg?: string | null;
        email?: string;
        documento_estrangeiro: string | null;
        cnpj: string | null;
        inscricao_estadual?: string;
        inscricao_municipal?: string;
        atividade_principal?: string;
        codigo_regime_tributario?: string;
        tipo_pessoa?: string;
        contribuinte?: string;
        telefone?: string;
        endereco: EnderecoEntity;
        arquivo_contrato?: string;
        id_vendedor_padrao?: number | null;
        percentual_comissao: number | null;
        ativo?: boolean;
        pais?: string;
    }) {
        Object.assign(this, {
            id,
            razao_social,
            nome_fantasia,
            cpf,
            rg,
            email,
            documento_estrangeiro,
            cnpj,
            inscricao_estadual,
            inscricao_municipal,
            atividade_principal,
            codigo_regime_tributario,
            tipo_pessoa,
            contribuinte,
            telefone,
            endereco,
            arquivo_contrato,
            id_vendedor_padrao,
            percentual_comissao,
            ativo,
            pais
        });
    }

    copyWith({
        id,
        razao_social,
        nome_fantasia,
        cpf,
        rg,
        email,
        documento_estrangeiro,
        cnpj,
        inscricao_estadual,
        inscricao_municipal,
        atividade_principal,
        codigo_regime_tributario,
        tipo_pessoa,
        contribuinte,
        telefone,
        endereco,
        arquivo_contrato,
        id_vendedor_padrao,
        percentual_comissao,
        ativo,
        pais
    }: {
        id?: number;
        razao_social?: string;
        nome_fantasia?: string;
        cpf?: string | null;
        rg?: string | null;
        email?: string;
        documento_estrangeiro?: string | null;
        cnpj?: string | null;
        inscricao_estadual?: string;
        inscricao_municipal?: string;
        atividade_principal?: string;
        codigo_regime_tributario?: string;
        tipo_pessoa?: string;
        contribuinte?: string;
        telefone?: string;
        endereco?: EnderecoEntity;
        arquivo_contrato?: string;
        id_vendedor_padrao?: number | null;
        percentual_comissao?: number | null;
        ativo?: boolean;
        pais?: string;
    }): VendedorEntity {
        return new VendedorEntity({
            id: id ?? this.id,
            razao_social: razao_social ?? this.razao_social,
            nome_fantasia: nome_fantasia ?? this.nome_fantasia,
            cpf: cpf ?? this.cpf,
            rg: rg ?? this.rg,
            email: email ?? this.email,
            documento_estrangeiro: documento_estrangeiro ?? this.documento_estrangeiro,
            cnpj: cnpj ?? this.cnpj,
            inscricao_estadual: inscricao_estadual ?? this.inscricao_estadual,
            inscricao_municipal: inscricao_municipal ?? this.inscricao_municipal,
            atividade_principal: atividade_principal ?? this.atividade_principal,
            codigo_regime_tributario: codigo_regime_tributario ?? this.codigo_regime_tributario,
            tipo_pessoa: tipo_pessoa ?? this.tipo_pessoa,
            contribuinte: contribuinte ?? this.contribuinte,
            telefone: telefone ?? this.telefone,
            endereco: endereco ?? this.endereco,
            arquivo_contrato: arquivo_contrato ?? this.arquivo_contrato,
            id_vendedor_padrao: id_vendedor_padrao !== undefined ? id_vendedor_padrao : this.id_vendedor_padrao,

            percentual_comissao: percentual_comissao != null ? Number(percentual_comissao) : this.percentual_comissao,
            ativo: ativo ?? this.ativo,
            pais: pais ?? this.pais,
        });
    }
}

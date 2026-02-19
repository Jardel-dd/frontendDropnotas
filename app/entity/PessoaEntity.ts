import { EnderecoEntity } from "./enderecoEntity";

export class DetalTomadorEntity {
    cpf_cnpj!: number;
    razao_social!: string;
    email!: string;
    endereco!: EnderecoEntity;
    constructor({
        cpf_cnpj,
        razao_social,
        email,
        endereco,
    }: {
        cpf_cnpj: number;
        razao_social: string;
        email: string;
        endereco: EnderecoEntity;
    }) {
        Object.assign(this, {
            cpf_cnpj,
            razao_social,
            email,
            endereco,
        });
    }
}
export class PessoaEntity {
    id!: number;
    razao_social!: string;
    nome_fantasia?: string;
    cpf!: string | null;
    rg!: string | null;
    email?: string;
    documento_estrangeiro: string | null = null;
    cnpj!: null | string;
    inscricao_estadual?: string;
    inscricao_municipal?: string;
    atividade_principal?: string;
    cnae_fiscal?: string;
    data_fundacao?: string;
    pessoa_cliente?: boolean;
    pessoa_fornecedor?: boolean;
    codigo_regime_tributario?: string;
    tipo_pessoa?: string;
    contribuinte?: string;
    // telefone?: string;
    endereco!: EnderecoEntity;
    arquivo_contrato?: string;
    id_vendedor_padrao?: number | null;
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
        cnae_fiscal,
        data_fundacao,
        pessoa_cliente,
        pessoa_fornecedor,
        codigo_regime_tributario,
        tipo_pessoa,
        contribuinte,
        // telefone,
        endereco,
        arquivo_contrato,
        id_vendedor_padrao,
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
        cnpj: null | string;
        inscricao_estadual?: string;
        inscricao_municipal?: string;
        atividade_principal?: string;
        cnae_fiscal?: string;
        data_fundacao?: string;
        pessoa_cliente?: boolean;
        pessoa_fornecedor?: boolean;
        codigo_regime_tributario?: string;
        tipo_pessoa?: string;
        contribuinte?: string;
        // telefone?: string;
        endereco: EnderecoEntity;
        arquivo_contrato?: string;
        id_vendedor_padrao?: number | null;
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
            cnae_fiscal,
            data_fundacao,
            pessoa_cliente,
            pessoa_fornecedor,
            codigo_regime_tributario,
            tipo_pessoa,
            contribuinte,
            // telefone,
            endereco,
            arquivo_contrato,
            id_vendedor_padrao,
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
        cnae_fiscal,
        data_fundacao,
        pessoa_cliente,
        pessoa_fornecedor,
        codigo_regime_tributario,
        tipo_pessoa,
        contribuinte,
        // telefone,
        endereco,
        arquivo_contrato,
        id_vendedor_padrao,
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
        cnpj?: null | string;
        inscricao_estadual?: string;
        inscricao_municipal?: string;
        atividade_principal?: string;
        cnae_fiscal?: string;
        data_fundacao?: string;
        pessoa_cliente?: boolean;
        pessoa_fornecedor?: boolean;
        codigo_regime_tributario?: string;
        tipo_pessoa?: string;
        contribuinte?: string;
        // telefone?: string;
        endereco?: EnderecoEntity;
        arquivo_contrato?: string;
        id_vendedor_padrao?: number | null;
        ativo?: boolean;
        pais?: string;
    }): PessoaEntity {
        return new PessoaEntity({
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
            cnae_fiscal: cnae_fiscal ?? this.cnae_fiscal,
            data_fundacao: data_fundacao ?? this.data_fundacao,
            pessoa_cliente: pessoa_cliente ?? this.pessoa_cliente,
            pessoa_fornecedor: pessoa_fornecedor ?? this.pessoa_fornecedor,
            codigo_regime_tributario: codigo_regime_tributario ?? this.codigo_regime_tributario,
            tipo_pessoa: tipo_pessoa ?? this.tipo_pessoa,
            contribuinte: contribuinte ?? this.contribuinte,
            // telefone: telefone ?? this.telefone,
            endereco: endereco ?? this.endereco,
            arquivo_contrato: arquivo_contrato ?? this.arquivo_contrato,
            id_vendedor_padrao: id_vendedor_padrao !== undefined ? id_vendedor_padrao : this.id_vendedor_padrao,
            ativo: ativo ?? this.ativo,
            pais: pais ?? this.pais,
        });
    }
};


import { UsuarioContaEntity } from "./UsuarioContaEntity";

export interface PerfilUsuario {
    empresa?: boolean;
    financeiro?: boolean;
    pessoa?: boolean;
    servico?: boolean;
    vendedor?: boolean;
    usuarioConta?: boolean;
    perfilUsuario?: boolean;
    formaPagamento?: boolean;
    categoriaContrato?: boolean;
    contrato?: boolean;
    ordemServico?: boolean;
    integracao?: boolean;
    nfse?: boolean;
    configuracoes?: boolean;
    perfilUsuarioCadastrar?: boolean;
    perfilUsuarioAlterar?: boolean;
    perfilUsuarioDesativar?: boolean;
    perfilUsuarioPesquisar?: boolean;
    usuarioContaCadastrar?: boolean;
    usuarioContaAlterar?: boolean;
    usuarioContaDesativar?: boolean;
    usuarioContaPesquisar?: boolean;
    empresaCadastrar?: boolean;
    empresaAlterar?: boolean;
    empresaDesativar?: boolean;
    empresaPesquisar?: boolean;
    pessoaCadastrar?: boolean;
    pessoaAlterar?: boolean;
    pessoaDesativar?: boolean;
    pessoaPesquisar?: boolean;
    vendedorCadastrar?: boolean;
    vendedorAlterar?: boolean;
    vendedorDesativar?: boolean;
    vendedorPesquisar?: boolean;
    servicoCadastrar?: boolean;
    servicoAlterar?: boolean;
    servicoDesativar?: boolean;
    servicoPesquisar?: boolean;
    ordemServicoCadastrar?: boolean;
    ordemServicoAlterar?: boolean;
    ordemServicoDesativar?: boolean;
    ordemServicoPesquisar?: boolean;
    contratoCadastrar?: boolean;
    contratoAlterar?: boolean;
    contratoDesativar?: boolean;
    contratoPesquisar?: boolean;
    categoriaContratoCadastrar?: boolean;
    categoriaContratoAlterar?: boolean;
    categoriaContratoDesativar?: boolean;
    categoriaContratoPesquisar?: boolean;
    formaPagamentoCadastrar?: boolean;
    formaPagamentoAlterar?: boolean;
    formaPagamentoDesativar?: boolean;
    formaPagamentoPesquisar?: boolean;
    integracaoCadastrar?: boolean;
    integracaoAlterar?: boolean;
    integracaoDesativar?: boolean;
    integracaoPesquisar?: boolean;
    nfseCadastrar?: boolean;
    nfseAlterar?: boolean;
    nfseDesativar?: boolean;
    nfsePesquisar?: boolean;
    permiteAlterarConfiguracoes?: boolean;
}
export class CreatedAccountEntity {
    cnpj!: string;
    razao_social!: string;
    nome!: string;
    email!: string;
    senha!: string;
    usuario_conta!: UsuarioContaEntity;
    constructor({
        cnpj,
        razao_social,
        nome,
        email,
        senha,
        usuario_conta,
    }: {
        cnpj: string;
        razao_social: string;
        nome: string;
        email: string;
        senha: string;
        usuario_conta: UsuarioContaEntity;
    }) {
        this.razao_social = razao_social;
        this.cnpj = cnpj;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.usuario_conta = usuario_conta;
    }
    copyWith({
        razao_social,
        cnpj,
        nome,
        email,
        senha,
        usuario_conta,
    }: {
        cnpj?: string;
        razao_social?: string;
        nome?: string;
        email?: string;
        senha?: string;
        usuario_conta?: UsuarioContaEntity;

    }): CreatedAccountEntity {
        return new CreatedAccountEntity({
            cnpj: cnpj ?? this.cnpj,
            razao_social: razao_social ?? this.razao_social,
            nome: nome ?? this.nome,
            email: email ?? this.email,
            senha: senha ?? this.senha,
            usuario_conta: usuario_conta ?? this.usuario_conta,

        });
    }
}

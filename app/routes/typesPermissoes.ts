import { PerfilUsuario } from "../entity/CreatedAccountEntity";

export type PermissionResourceKey =
    | 'perfilUsuario'
    | 'usuarioConta'
    | 'empresa'
    | 'pessoa'
    | 'vendedor'
    | 'servico'
    | 'ordemServico'
    | 'contrato'
    | 'categoriaContrato'
    | 'formaPagamento'
    | 'nfse'
    | 'integracao'
    | 'perfilTributario'
    | 'relatorio'
    | 'relatorioServico'
    | 'relatorioRecebimento'
    | 'financas'
    | 'contaPagar'
    | 'contaReceber'
    | 'comissao'
    | 'is_usuario_principal'
    | 'configuracoes'
    | 'permiteAlterarConfiguracoes'

export type PermissionAction = 'view' | 'create' | 'update' | 'delete' | 'search';

export type PermissionFlags = {
    view: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    search: boolean;
};
export type PermissionDefinition = {
    viewKey?: keyof PerfilUsuario;
    fallbackViewKeys?: Array<keyof PerfilUsuario>;
    defaultView?: boolean;
    createKey?: keyof PerfilUsuario;
    updateKey?: keyof PerfilUsuario;
    deleteKey?: keyof PerfilUsuario;
    searchKey?: keyof PerfilUsuario;
};

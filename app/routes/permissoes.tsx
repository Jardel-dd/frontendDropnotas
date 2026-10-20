import { useUser } from "./protected/UserContext";
import { getPermissionFlags } from "./permissionRules";

export const usePermissions = () => {
    const { userConta } = useUser();

    return {
        permissaoPerfilTributario: getPermissionFlags(userConta, 'perfilTributario'),
        permissaoPerfilUsuario: getPermissionFlags(userConta, 'perfilUsuario'),
        permissaoUsuarioConta: getPermissionFlags(userConta, 'usuarioConta'),
        permissaoEmpresa: getPermissionFlags(userConta, 'empresa'),
        permissaoPessoa: getPermissionFlags(userConta, 'pessoa'),
        permissaoVendedor: getPermissionFlags(userConta, 'vendedor'),
        permissaoServico: getPermissionFlags(userConta, 'servico'),
        permissaoOrdemServico: getPermissionFlags(userConta, 'ordemServico'),
        permissaoContrato: getPermissionFlags(userConta, 'contrato'),
        permissaoCategoriaContrato: getPermissionFlags(userConta, 'categoriaContrato'),
        permissaoFormaPagamento: getPermissionFlags(userConta, 'formaPagamento'),
        permissaoIntegracao: getPermissionFlags(userConta, 'integracao'),
        permissaoNfse: getPermissionFlags(userConta, 'nfse'),
        permissaoFinanceiro: getPermissionFlags(userConta, 'financas'),
        permissaoContaPagar: getPermissionFlags(userConta, 'contaPagar'),
        permissaoContaReceber: getPermissionFlags(userConta, 'contaReceber'),
        permissaoComissao: getPermissionFlags(userConta, 'comissao'),
        permissaoConfiguracoes: getPermissionFlags(userConta, 'configuracoes'),
        permissaoRelatorio: getPermissionFlags(userConta, 'relatorio'),
        is_usuario_principal: getPermissionFlags(userConta, 'is_usuario_principal'),


    };
};

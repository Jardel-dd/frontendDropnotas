import { useUser } from "./protected/UserContext";
import { getPermissionFlags } from "./permissionRules";

export const usePermissions = () => {
    const { userConta } = useUser();

    return {
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
        permissaoFinanceiro: getPermissionFlags(userConta, 'financeiro'),
        permissaoConfiguracoes: getPermissionFlags(userConta, 'configuracoes'),
    };
};

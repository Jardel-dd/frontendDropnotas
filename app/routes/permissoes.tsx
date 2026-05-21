import { useUser } from "./protected/UserContext";

export const usePermissions = () => {
    const { userConta } = useUser();

    return {
        permissaoPerfilUsuario: {
            create: !!userConta?.perfilUsuario?.perfilUsuarioCadastrar,
            update: !!userConta?.perfilUsuario?.perfilUsuarioAlterar,
            delete: !!userConta?.perfilUsuario?.perfilUsuarioDesativar,
            search: !!userConta?.perfilUsuario?.perfilUsuarioPesquisar,
        },

        permissaoUsuarioConta: {
            create: !!userConta?.perfilUsuario?.usuarioContaCadastrar,
            update: !!userConta?.perfilUsuario?.usuarioContaAlterar,
            delete: !!userConta?.perfilUsuario?.usuarioContaDesativar,
            search: !!userConta?.perfilUsuario?.usuarioContaPesquisar,
        },

        permissaoEmpresa: {
            create: !!userConta?.perfilUsuario?.empresaCadastrar,
            update: !!userConta?.perfilUsuario?.empresaAlterar,
            delete: !!userConta?.perfilUsuario?.empresaDesativar,
            search: !!userConta?.perfilUsuario?.empresaPesquisar,
        },

        permissaoPessoa: {
            create: !!userConta?.perfilUsuario?.pessoaCadastrar,
            update: !!userConta?.perfilUsuario?.pessoaAlterar,
            delete: !!userConta?.perfilUsuario?.pessoaDesativar,
            search: !!userConta?.perfilUsuario?.pessoaPesquisar,
        },

        permissaoVendedor: {
            create: !!userConta?.perfilUsuario?.vendedorCadastrar,
            update: !!userConta?.perfilUsuario?.vendedorAlterar,
            delete: !!userConta?.perfilUsuario?.vendedorDesativar,
            search: !!userConta?.perfilUsuario?.vendedorPesquisar,
        },

        permissaoServico: {
            create: !!userConta?.perfilUsuario?.servicoCadastrar,
            update: !!userConta?.perfilUsuario?.servicoAlterar,
            delete: !!userConta?.perfilUsuario?.servicoDesativar,
            search: !!userConta?.perfilUsuario?.servicoPesquisar,
        },

        permissaoOrdemServico: {
            create: !!userConta?.perfilUsuario?.ordemServicoCadastrar,
            update: !!userConta?.perfilUsuario?.ordemServicoAlterar,
            delete: !!userConta?.perfilUsuario?.ordemServicoDesativar,
            search: !!userConta?.perfilUsuario?.ordemServicoPesquisar,
        },

        permissaoContrato: {
            create: !!userConta?.perfilUsuario?.contratoCadastrar,
            update: !!userConta?.perfilUsuario?.contratoAlterar,
            delete: !!userConta?.perfilUsuario?.contratoDesativar,
            search: !!userConta?.perfilUsuario?.contratoPesquisar,
        },

        permissaoCategoriaContrato: {
            create: !!userConta?.perfilUsuario?.categoriaContratoCadastrar,
            update: !!userConta?.perfilUsuario?.categoriaContratoAlterar,
            delete: !!userConta?.perfilUsuario?.categoriaContratoDesativar,
            search: !!userConta?.perfilUsuario?.categoriaContratoPesquisar,
        },

        permissaoFormaPagamento: {
            create: !!userConta?.perfilUsuario?.formaPagamentoCadastrar,
            update: !!userConta?.perfilUsuario?.formaPagamentoAlterar,
            delete: !!userConta?.perfilUsuario?.formaPagamentoDesativar,
            search: !!userConta?.perfilUsuario?.formaPagamentoPesquisar,
        },

        permissaoIntegracao: {
            create: !!userConta?.perfilUsuario?.integracaoCadastrar,
            update: !!userConta?.perfilUsuario?.integracaoAlterar,
            delete: !!userConta?.perfilUsuario?.integracaoDesativar,
            search: !!userConta?.perfilUsuario?.integracaoPesquisar,
        },

        permissaoNfse: {
            create: !!userConta?.perfilUsuario?.nfseCadastrar,
            update: !!userConta?.perfilUsuario?.nfseAlterar,
            delete: !!userConta?.perfilUsuario?.nfseDesativar,
            search: !!userConta?.perfilUsuario?.nfsePesquisar,
        },

        permissaoConfiguracoes: {
            update: !!userConta?.perfilUsuario?.permiteAlterarConfiguracoes,
        },
    };
};
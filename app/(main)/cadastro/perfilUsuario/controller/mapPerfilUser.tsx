import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { TreeCheckboxSelectionKeys } from 'primereact/tree';

type BooleanKeysOf<T> = {
    [K in keyof T]: T[K] extends boolean | undefined ? K : never;
}[keyof T];

export const permissionsMap: Record<string, BooleanKeysOf<PerfilUser>> = {
    '0-0': 'perfilUsuarioCadastrar',
    '0-1': 'perfilUsuarioAlterar',
    '0-2': 'perfilUsuarioDesativar',
    '0-3': 'perfilUsuarioPesquisar',

    '1-0': 'usuarioContaCadastrar',
    '1-1': 'usuarioContaAlterar',
    '1-2': 'usuarioContaDesativar',
    '1-3': 'usuarioContaPesquisar',

    '2-0': 'empresaCadastrar',
    '2-1': 'empresaAlterar',
    '2-2': 'empresaDesativar',
    '2-3': 'empresaPesquisar',

    '3-0': 'pessoaCadastrar',
    '3-1': 'pessoaAlterar',
    '3-2': 'pessoaDesativar',
    '3-3': 'pessoaPesquisar',

    '4-0': 'vendedorCadastrar',
    '4-1': 'vendedorAlterar',
    '4-2': 'vendedorDesativar',
    '4-3': 'vendedorPesquisar',

    '5-0': 'servicoCadastrar',
    '5-1': 'servicoAlterar',
    '5-2': 'servicoDesativar',
    '5-3': 'servicoPesquisar',

    '6-0': 'ordemServicoCadastrar',
    '6-1': 'ordemServicoAlterar',
    '6-2': 'ordemServicoDesativar',
    '6-3': 'ordemServicoPesquisar',

    '7-0': 'contratoCadastrar',
    '7-1': 'contratoAlterar',
    '7-2': 'contratoDesativar',
    '7-3': 'contratoPesquisar',

    '8-0': 'categoriaContratoCadastrar',
    '8-1': 'categoriaContratoAlterar',
    '8-2': 'categoriaContratoDesativar',
    '8-3': 'categoriaContratoPesquisar',

    '9-0': 'formaPagamentoCadastrar',
    '9-1': 'formaPagamentoAlterar',
    '9-2': 'formaPagamentoDesativar',
    '9-3': 'formaPagamentoPesquisar',

    '10-0': 'nfseCadastrar',
    '10-1': 'nfseAlterar',
    '10-2': 'nfseDesativar',
    '10-3': 'nfsePesquisar',

    '11-0': 'integracaoCadastrar',
    '11-1': 'integracaoAlterar',
    '11-2': 'integracaoDesativar',
    '11-3': 'integracaoPesquisar'
};
export const getFormattedPermissions = (selectedKeys: TreeCheckboxSelectionKeys): Partial<PerfilUser> => {
    const permissions = Object.keys(permissionsMap).reduce<Partial<PerfilUser>>((acc, key) => {
        const permissionKey = permissionsMap[key];
        if (permissionKey) {
            acc[permissionKey] = !!selectedKeys[key]?.checked;
        }
        return acc;
    }, {});
    return permissions;
};

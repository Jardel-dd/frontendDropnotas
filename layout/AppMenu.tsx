import AppSubMenu from './AppSubMenu';
import { useUserContext } from '@/app/routes/protected/userUserContext';
import { filterVisibleMenuItems, hasPermissionAccess } from '@/app/routes/permissionRules';
import { useMemo } from 'react';
import {
    Briefcase,
    Buildings,
    ChartBar,
    ClipboardText,
    CreditCard,
    CurrencyDollar,
    Folders,
    GearSix,
    House,
    LockKey,
    Palette,
    Receipt,
    User,
    UsersThree,
    Wallet,
    Wrench
} from 'phosphor-react';

const AppMenu = () => {
    const { userConta } = useUserContext();

    const model = useMemo(() => {
        return filterVisibleMenuItems([
            {
                label: 'Dashboard',
                icon: House,
                to: '/dashboard',
                visible: hasPermissionAccess(userConta, 'dashboard')
            },
            {
                label: 'Cadastros',
                icon: Folders,
                items: [
                    {
                        label: 'Clientes e Fornecedores',
                        icon: UsersThree,
                        to: '/cadastro/pessoas',
                        visible: hasPermissionAccess(userConta, 'pessoa')
                    },
                    {
                        label: 'Serviços',
                        icon: Wrench,
                        to: '/cadastro/servicos',
                        visible: hasPermissionAccess(userConta, 'servico')
                    },
                    {
                        label: 'Vendedores',
                        icon: User,
                        to: '/cadastro/vendedores',
                        visible: hasPermissionAccess(userConta, 'vendedor')
                    },
                    {
                        label: 'Usuários',
                        icon: UsersThree,
                        to: '/cadastro/usuarios',
                        visible: hasPermissionAccess(userConta, 'usuarioConta')
                    },
                    {
                        label: 'Permissões',
                        icon: LockKey,
                        to: '/cadastro/permissoes',
                        visible: hasPermissionAccess(userConta, 'perfilUsuario')
                    },
                    {
                        label: 'Forma de Pagamento',
                        icon: CurrencyDollar,
                        to: '/cadastro/formaPagamento',
                        visible: hasPermissionAccess(userConta, 'formaPagamento')
                    },
                    {
                        label: 'Categoria Contratos',
                        icon: Folders,
                        to: '/cadastro/categoriaContratos',
                        visible: hasPermissionAccess(userConta, 'categoriaContrato')
                    }
                ]
            },
            {
                label: 'Contratos',
                icon: Briefcase,
                to: '/contrato',
                visible: hasPermissionAccess(userConta, 'contrato')
            },
            {
                label: 'Ordens de Serviços',
                icon: Wrench,
                to: '/ordemServicos',
                visible: hasPermissionAccess(userConta, 'ordemServico')
            },
            {
                label: 'NFS-e',
                icon: Receipt,
                to: '/notaServico',
                visible: hasPermissionAccess(userConta, 'nfse')
            },

            {
                label: 'Finanças',
                icon: Wallet,
                to: '/financas',
                visible: hasPermissionAccess(userConta, 'financeiro'),
                items: [
                    {
                        label: 'Contas a Pagar',
                        icon: Buildings,
                        to: '/financas/pagar'
                    },
                    {
                        label: 'Contas a Receber',
                        icon: Wallet,
                        to: '/financas/receber'
                    },
                    {
                        label: 'Comissões',
                        icon: CurrencyDollar,
                        to: '/financas/comissoes'
                    }
                ]
            },
            {
                label: 'Relatório',
                icon: ChartBar,
                items: [
                    {
                        label: 'Serviços',
                        icon: ClipboardText,
                        to: '/relatorios/servicos'
                    },
                    {
                        label: 'Recebimentos',
                        icon: Wallet,
                        to: '/relatorios/recebimentos'
                    }
                ]
            },
            {
                label: 'Assinaturas',
                icon: CreditCard,
                to: '/assinaturas',
                visible: hasPermissionAccess(userConta, 'financeiro')
            },
            {
                label: 'Configurações',
                icon: GearSix,
                to: '/configuracoes',
                visible: hasPermissionAccess(userConta, 'empresa') || hasPermissionAccess(userConta, 'is_usuario_principal'),
                items: [
                    {
                        label: 'Minhas Empresas',
                        icon: Buildings,
                        to: '/configuracoes/empresas',
                        visible: hasPermissionAccess(userConta, 'empresa')
                    },
                    {
                        label: 'Temas',
                        icon: Palette,
                        to: '/configuracoes/geral'
                    }
                ]
            }
        ]);
    }, [userConta]);

    return <AppSubMenu key={JSON.stringify(model)} model={model} />;
};

export default AppMenu;

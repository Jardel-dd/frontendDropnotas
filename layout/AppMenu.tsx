import AppSubMenu from './AppSubMenu';
import { useUserContext } from '@/app/routes/protected/userUserContext';
import { filterVisibleMenuItems, hasPermissionAccess } from '@/app/routes/permissionRules';
import { useMemo } from 'react';

const AppMenu = () => {
    const { userConta } = useUserContext();

    const model = useMemo(() => {
        
        return filterVisibleMenuItems([
            {
                label: 'Dashboard',
                icon: 'pi pi-fw pi-home',
                to: '/dashboard',
                visible: hasPermissionAccess(userConta, 'dashboard')
            },
            {
                label: 'Cadastros',
                icon: 'pi pi-fw pi-plus',
                items: [
                    {
                        label: 'Clientes e Fornecedores',
                        icon: 'pi pi-users',
                        to: '/cadastro/pessoas',
                        visible: hasPermissionAccess(userConta, 'pessoa')
                    },
                    {
                        label: 'Serviços',
                        icon: 'pi pi-ticket',
                        to: '/cadastro/servicos',
                        visible: hasPermissionAccess(userConta, 'servico')
                    },
                    {
                        label: 'Vendedores',
                        icon: 'pi pi-user',
                        to: '/cadastro/vendedores',
                        visible: hasPermissionAccess(userConta, 'vendedor')
                    },
                    {
                        label: 'Usuários',
                        icon: 'pi pi-users',
                        to: '/cadastro/usuarios',
                        visible: hasPermissionAccess(userConta, 'usuarioConta')
                    },
                    {
                        label: 'Permissões',
                        icon: 'pi pi-unlock',
                        to: '/cadastro/permissoes',
                        visible: hasPermissionAccess(userConta, 'perfilUsuario')
                    },
                    {
                        label: 'Forma de Pagamento',
                        icon: 'pi pi-money-bill',
                        to: '/cadastro/formaPagamento',
                        visible: hasPermissionAccess(userConta, 'formaPagamento')
                    },
                    {
                        label: 'Categoria Contratos',
                        icon: 'pi pi-folder',
                        to: '/cadastro/categoriaContratos',
                        visible: hasPermissionAccess(userConta, 'categoriaContrato')
                    }
                ]
            },
            {
                label: 'Contratos',
                icon: 'pi pi-briefcase',
                to: '/contrato',
                visible: hasPermissionAccess(userConta, 'contrato')
            },
            {
                label: 'Ordens de Serviços',
                icon: 'pi pi-wrench',
                to: '/ordemServicos',
                visible: hasPermissionAccess(userConta, 'ordemServico')
            },
            {
                label: 'NFS-e',
                icon: 'pi pi-book',
                to: '/notaServico',
                visible: hasPermissionAccess(userConta, 'nfse')
            },
            {
                label: 'Finanças',
                icon: 'pi pi-money-bill',
                to: '/financas',
                visible: hasPermissionAccess(userConta, 'financeiro'),
                items: [
                    {
                        label: 'Contas a Pagar',
                        icon: 'pi pi-building',
                        to: '/financas/pagar',
                    },
                    {
                        label: 'Contas a Receber',
                        icon: 'pi pi-palette',
                        to: '/financas/receber',
                    },
                    {
                        label: 'Comissões',
                        icon: 'pi pi-dollar',
                        to: '/financas/comissoes',
                    }
                ],
            },
            {
                label: 'Relatório',
                icon: 'pi pi-chart-bar',
                items: [
                    {
                        label: 'Serviços',
                        icon: 'pi pi-wrench',
                        to: '/relatorios/servicos',
                    },
                    {
                        label: 'Recebimentos',
                        icon: 'pi pi-wallet',
                        to: '/relatorios/recebimentos',
                    }
                ],
            },
            {
                label: 'Configurações',
                icon: 'pi pi-cog',
                to: '/configuracoes',
                visible: hasPermissionAccess(userConta, 'empresa') || hasPermissionAccess(userConta, 'is_usuario_principal'),
                items: [
                    {
                        label: 'Minhas Empresas',
                        icon: 'pi pi-building',
                        to: '/configuracoes/empresas',
                        visible: hasPermissionAccess(userConta, 'empresa'),
                    },
                    {
                        label: 'Temas',
                        icon: 'pi pi-palette',
                        to: '/configuracoes/geral',
                    }
                ],
                
            },
           
           
            
        ]);
    }, [userConta]);
  
    return <AppSubMenu key={JSON.stringify(model)} model={model}
     />;
};

export default AppMenu;

import AppSubMenu from './AppSubMenu';
import type { MenuModel } from '@/types';
import { useUserContext } from '@/app/routes/protected/userUserContext';

const AppMenu = () => {
    const { userConta } = useUserContext();
    const model: MenuModel[] = [
        userConta?.perfilUsuario?.empresa ? {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            to: '/dashboard',
        } : null,
        {
            label: 'Cadastros',
            icon: 'pi pi-fw pi-plus',
            items: [
                userConta?.perfilUsuario?.pessoa ? {
                    label: 'Clientes e Fornecedores',
                    icon: 'pi pi-users',
                    to: '/cadastro/clientesFornecedores',
                } : null,
                userConta?.perfilUsuario?.servico ? {
                    label: 'Serviços',
                    icon: 'pi pi-ticket',
                    to: '/cadastro/servicos',
                } : null,
                userConta?.perfilUsuario?.vendedor ? {
                    label: 'Vendedores',
                    icon: 'pi pi-user',
                    to: '/cadastro/vendedores',
                } : null,
                userConta?.perfilUsuario?.usuarioConta ? {
                    label: 'Usuários',
                    icon: 'pi pi-users',
                    to: '/cadastro/usuarios',
                } : null,
                userConta?.perfilUsuario?.perfilUsuario ? {
                    label: 'Permissões',
                    icon: 'pi pi-unlock',
                    to: '/cadastro/perfilUsuario',
                } : null,
                userConta?.perfilUsuario?.formaPagamento ? {
                    label: 'Forma de Pagamento',
                    icon: 'pi pi-money-bill',
                    to: '/cadastro/formaPagamento',
                } : null,
                  userConta?.perfilUsuario?.categoriaContrato ? {
                    label: 'Categoria Contratos',
                    icon: 'pi pi pi-folder	',
                    to: '/cadastro/categoriaContratos',
                } : null,
            ].filter(Boolean) as MenuModel[], 
        },
        userConta?.perfilUsuario?.contrato ? {
            label: 'Contratos',
            icon: 'pi pi-briefcase',
              to: '/contrato',
                } : null,
              
         
        userConta?.perfilUsuario?.ordemServico ? {
            label: 'Ordem de Serviços',
            icon: 'pi pi-wrench',
            to: '/ordemServicos',
        } : null,
        {
            label: 'Nota de Serviços',
            icon: 'pi pi-book',
            to: '/notaServico',
        },
        // {
        //     label: 'Cobranças',
        //     icon: 'pi pi-money-bill',
        //     to: '/cobrancas',
        //     className: 'menu-item-cobrancas',
        // },
        {
            label: 'Relatórios',
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
        userConta?.perfilUsuario?.empresa ? {
            label: 'Configurações',
            icon: 'pi pi-cog',
            to: '/configuracoes',
            items: [
                {
                    label: 'Minhas Empresas',
                    icon: 'pi pi-building',
                    to: '/configuracoes/empresas',
                },
                {
                    label: 'Temas',
                    icon: 'pi pi-palette',
                    to: '/configuracoes/geral',
                }
            ],
        } : null,
    ].filter(Boolean) as MenuModel[]; 

    return <AppSubMenu model={model} />;
};

export default AppMenu;

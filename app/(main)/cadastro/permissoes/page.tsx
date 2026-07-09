'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from '@/app/components/messages/GlobalMessages';
import ListarPerfilUsers from './tabela/perfilUsuario';
import { usePermissions } from '@/app/routes/permissoes';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import Input from '@/app/shared/include/input/input-all';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { ativarPerfilUser, deletarPerfilUser, listPerfilUser } from './controller/controller';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { MOBILE_LOAD_MORE_PAGE_SIZE, hasMoreMobileContent, mergePaginatedContent, rebuildLoadedMobilePages } from '@/app/components/paginator/mobileLoadMore';

const createInitialPagination = (pageSize: number) => ({
    content: [],
    pageable: {
        pageNumber: 0,
        pageSize,
        sort: {
            empty: true,
            unsorted: true,
            sorted: false
        }
    },
    totalPages: 0,
    totalElements: 0,
    last: false,
    size: pageSize,
    number: 0,
    sort: {
        empty: true,
        unsorted: true,
        sorted: false
    },
    numberOfElements: 0,
    first: true,
    empty: false
});

const PerfilUsuarios: React.FC = () => {
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const resolvedPageSize = isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : pageSize;
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { permissaoPerfilUsuario } = usePermissions();
    const [visible, setVisible] = useState<boolean>(false);
    const [perfilUser, setPerfilUser] = useState<PerfilUser>(
        new PerfilUser({
            ativo: true,
            id: 0,
            nome: '',
            perfilUsuario: false,
            perfilUsuarioCadastrar: false,
            perfilUsuarioAlterar: false,
            perfilUsuarioDesativar: false,
            perfilUsuarioPesquisar: false,
            usuarioConta: false,
            usuarioContaCadastrar: false,
            usuarioContaAlterar: false,
            usuarioContaDesativar: false,
            usuarioContaPesquisar: false,
            empresa: false,
            empresaCadastrar: false,
            empresaAlterar: false,
            empresaDesativar: false,
            empresaPesquisar: false,
            pessoa: false,
            pessoaCadastrar: false,
            pessoaAlterar: false,
            pessoaDesativar: false,
            pessoaPesquisar: false,
            vendedor: false,
            vendedorCadastrar: false,
            vendedorAlterar: false,
            vendedorDesativar: false,
            vendedorPesquisar: false,
            servico: false,
            servicoCadastrar: false,
            servicoAlterar: false,
            servicoDesativar: false,
            servicoPesquisar: false,
            ordemServico: false,
            ordemServicoCadastrar: false,
            ordemServicoAlterar: false,
            ordemServicoDesativar: false,
            ordemServicoPesquisar: false,
            ordemServicoTipoVisualizacao: '',
            contrato: false,
            contratoCadastrar: false,
            contratoAlterar: false,
            contratoDesativar: false,
            contratoPesquisar: false,
            contratoTipoVisualizacao: '',
            categoriaContrato: false,
            categoriaContratoCadastrar: false,
            categoriaContratoAlterar: false,
            categoriaContratoDesativar: false,
            categoriaContratoPesquisar: false,
            formaPagamento: false,
            formaPagamentoCadastrar: false,
            formaPagamentoAlterar: false,
            formaPagamentoDesativar: false,
            formaPagamentoPesquisar: false,
            nfseTipoVisualizacao: ''
        })
    );
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [isPerfilUsuarioCreated, setIsPerfilUsuarioCreated] = useState(false);
    const [selectedPerfilUser, setSelectedPerfilUser] = useState<PerfilUser | null>(null);
    const [listPaginationPerfilUser, setListPaginationPerfilUser] = useState<Record<string, any>>(createInitialPagination(resolvedPageSize));
    const safePagination = listPaginationPerfilUser ?? createInitialPagination(resolvedPageSize);
    const safePageable = safePagination.pageable ?? createInitialPagination(resolvedPageSize).pageable;

    const handleNavigate = () => {
        router.push('/cadastro/permissoes/created');
        setIsPerfilUsuarioCreated(true);
    };

    const fetchPerfilUserPage = async (
        pageNumber = 0,
        term = searchTerm,
        inactive = listarInativos
    ) => {
        const perfilUsers = await listPerfilUser(
            {
                ...safePagination,
                pageable: {
                    ...safePageable,
                    pageNumber,
                    pageSize: resolvedPageSize
                }
            },
            inactive,
            () => {},
            term
        );

        return perfilUsers ?? createInitialPagination(resolvedPageSize);
    };

    const handleListPerfilUser = async (
        pageNumber = 0,
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos,
        append = false
    ) => {
        if (!append) {
            setLoading(true);
        }

        try {
            const perfilUsers = await fetchPerfilUserPage(pageNumber, currentSearchTerm, currentListarInativos);
            setListPaginationPerfilUser((current) => {
                if (isMobile && append) {
                    return mergePaginatedContent(current, perfilUsers, pageNumber) ?? createInitialPagination(resolvedPageSize);
                }

                return perfilUsers ?? createInitialPagination(resolvedPageSize);
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao buscar Perfil de Usuario',
                life: 3000
            });
        } finally {
            if (!append) {
                setLoading(false);
            }
        }
    };

    const refreshVisiblePerfilUser = async (
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos
    ) => {
        setLoading(true);
        try {
            const currentPage = safePageable.pageNumber ?? 0;

            if (isMobile && currentPage > 0) {
                const rebuilt = await rebuildLoadedMobilePages({
                    lastLoadedPage: currentPage,
                    fetchPage: (page) => fetchPerfilUserPage(page, currentSearchTerm, currentListarInativos)
                });

                setListPaginationPerfilUser(rebuilt ?? createInitialPagination(resolvedPageSize));
                return;
            }

            const perfilUsers = await fetchPerfilUserPage(isMobile ? 0 : currentPage, currentSearchTerm, currentListarInativos);
            setListPaginationPerfilUser(perfilUsers ?? createInitialPagination(resolvedPageSize));
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao atualizar Perfil de Usuario',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePerfilUser = async (id: number) => {
        await deletarPerfilUser(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisiblePerfilUser(searchTerm, listarInativos);
    };

    const handleAtivarPerfilUser = async (id: number) => {
        await ativarPerfilUser(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisiblePerfilUser(searchTerm, listarInativos);
    };

    const handleLoadMorePerfilUser = async () => {
        if (loading || loadingMore || !hasMoreMobileContent(listPaginationPerfilUser)) {
            return;
        }

        setLoadingMore(true);
        try {
            await handleListPerfilUser((safePageable.pageNumber ?? 0) + 1, searchTerm, listarInativos, true);
        } finally {
            setLoadingMore(false);
        }
    };

    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setPerfilUser,
        field: 'nome',
        onSearch: (value) => handleListPerfilUser(0, value, listarInativos)
    });

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationPerfilUser((prev) => ({
            ...(prev ?? createInitialPagination(resolvedPageSize)),
            pageable: {
                ...(prev?.pageable ?? createInitialPagination(resolvedPageSize).pageable),
                pageNumber: selectedPage
            }
        }));
        handleListPerfilUser(selectedPage, searchTerm, listarInativos);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleSalvarFiltro = () => {
        handleListPerfilUser(0, searchTerm, listarInativos);
        setVisible(false);
    };

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };

    const handleClearFilters = () => {
        setListarInativos(false);
        handleListPerfilUser(0, '', false);
        setVisible(false);
    };

    useEffect(() => {
        handleListPerfilUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="grid formgrid p-2">
                            <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0 ">
                                <Input
                                    label="Pesquisar Descrição"
                                    outlined={true}
                                    id="nome"
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    loading={loading}
                                    onClickSearch={() => searchNow(searchTerm)}
                                    topLabel="Pesquisar:"
                                    showTopLabel
                                />
                            </div>
                            <div className="col-4 mb-0 lg:col-2">
                                <div className="container-BTN-Filter-Created  ">
                                    <FilterOverlay
                                        onApply={handleSalvarFiltro}
                                        onClear={handleClearFilters}
                                        buttonClassName="height-2-8rem-ml-1rem">
                                        <CheckBoxField
                                            inputId="listarInativos"
                                            label="Listar Desativadas"
                                            checked={listarInativos}
                                            onChange={handleCheckboxChange}
                                        />
                                    </FilterOverlay>
                                    {permissaoPerfilUsuario.create && <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
                            <ListarPerfilUsers
                                loading={loading}
                                listPaginationPerfilUser={listPaginationPerfilUser}
                                deletar={handleDeletePerfilUser}
                                ativar={handleAtivarPerfilUser}
                                setSelectedPerfilUser={setSelectedPerfilUser}
                                selectedPerfil={selectedPerfilUser}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                setListPaginationPerfilUser={setListPaginationPerfilUser}
                                listarInativos={listarInativos}
                                mobileLoadMoreVisible={hasMoreMobileContent(listPaginationPerfilUser)}
                                mobileLoadMoreLoading={loadingMore}
                                onMobileLoadMore={handleLoadMorePerfilUser}
                            />
                        </div>
                    </div>
                </>
            )}
            {isDesktop && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="p-0">
                            <div className="grid formgrid p-2">
                                <div className="col-12 lg:col-3 container-input-search-all">
                                    <Input
                                        label="Pesquisar Descrição"
                                        outlined={true}
                                        id="nome"
                                        useRightButton={true}
                                        iconRight={'pi pi-search'}
                                        onChange={handleSearchChange}
                                        value={searchTerm}
                                        loading={loading}
                                        onClickSearch={() => searchNow(searchTerm)}
                                        topLabel="Pesquisar:"
                                        showTopLabel
                                    />
                                </div>
                                <div className="Container-Btn-Filter-Desktop">
                                    <FilterOverlay
                                        onApply={handleSalvarFiltro}
                                        onClear={handleClearFilters}
                                        buttonClassName="Btn-Filter-Desktop">
                                        <CheckBoxField
                                            inputId="listarInativos"
                                            label="Listar Desativadas"
                                            checked={listarInativos}
                                            onChange={handleCheckboxChange}
                                        />
                                    </FilterOverlay>
                                </div>
                                {permissaoPerfilUsuario.create && (
                                    <div className="container-button-primary-novo">
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <ListarPerfilUsers
                                loading={loading}
                                listPaginationPerfilUser={listPaginationPerfilUser}
                                deletar={handleDeletePerfilUser}
                                ativar={handleAtivarPerfilUser}
                                setSelectedPerfilUser={setSelectedPerfilUser}
                                selectedPerfil={selectedPerfilUser}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                setListPaginationPerfilUser={setListPaginationPerfilUser}
                                listarInativos={listarInativos}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <CustomPaginator
                                first={safePageable.pageNumber * safePageable.pageSize}
                                rows={resolvedPageSize}
                                totalRecords={safePagination.totalElements}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PerfilUsuarios;

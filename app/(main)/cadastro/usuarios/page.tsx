'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import ListarUserConta from './tabela/usuarioListagem';
import Input from '@/app/shared/include/input/input-all';
import { usePermissions } from '@/app/routes/permissoes';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarUsuario, deletarUsuario, listUsuario } from './controller/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { MOBILE_LOAD_MORE_PAGE_SIZE, hasMoreMobileContent, mergePaginatedContent, rebuildLoadedMobilePages } from '@/app/components/paginator/mobileLoadMore';

const createInitialPagination = (pageSize: number) => ({
    content: [],
    pageable: {
        pageNumber: 0,
        pageSize,
        sort: {
            empty: true,
            sorted: false,
            unsorted: true
        },
        offset: 0,
        paged: true,
        unpaged: false
    },
    totalPages: 1,
    totalElements: 0,
    last: true,
    size: pageSize,
    number: 0,
    sort: {
        empty: true,
        sorted: false,
        unsorted: true
    },
    numberOfElements: 0,
    first: true,
    empty: false
});

const Usuarios: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const resolvedPageSize = isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : pageSize;
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const { permissaoUsuarioConta } = usePermissions();
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [isUserCreated, setIsUserCreated] = useState(false);
    const [userConta, setUserConta] = useState<UsuarioContaEntity>(
        new UsuarioContaEntity({
            ativo: true,
            foto_perfil: '',
            nome: '',
            email: '',
            senha: ''
        })
    );
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [listPaginationUsersConta, setListPaginationUsersConta] = useState<Record<string, any>>(createInitialPagination(resolvedPageSize));
    const safePagination = listPaginationUsersConta ?? createInitialPagination(resolvedPageSize);
    const safePageable = safePagination.pageable ?? createInitialPagination(resolvedPageSize).pageable;

    const handleNavigate = () => {
        router.push('/cadastro/usuarios/created');
        setIsUserCreated(true);
    };

    const fetchUsersContaPage = async (
        pageNumber = 0,
        term = searchTerm,
        inactive = listarInativos
    ) => {
        const userContas = await listUsuario(
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

        return userContas ?? createInitialPagination(resolvedPageSize);
    };

    const handleListUsersConta = async (
        pageNumber = 0,
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos,
        append = false
    ) => {
        if (!append) {
            setLoading(true);
        }

        try {
            const userContas = await fetchUsersContaPage(pageNumber, currentSearchTerm, currentListarInativos);
            setListPaginationUsersConta((current) => {
                if (isMobile && append) {
                    return mergePaginatedContent(current, userContas, pageNumber) ?? createInitialPagination(resolvedPageSize);
                }

                return userContas ?? createInitialPagination(resolvedPageSize);
            });
        } catch (error) {
            console.error('Erro ao buscar Usuario:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao buscar Usuario'
            });
        } finally {
            if (!append) {
                setLoading(false);
            }
        }
    };

    const refreshVisibleUsersConta = async (
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos
    ) => {
        setLoading(true);
        try {
            const currentPage = safePageable.pageNumber ?? 0;

            if (isMobile && currentPage > 0) {
                const rebuilt = await rebuildLoadedMobilePages({
                    lastLoadedPage: currentPage,
                    fetchPage: (page) => fetchUsersContaPage(page, currentSearchTerm, currentListarInativos)
                });

                setListPaginationUsersConta(rebuilt ?? createInitialPagination(resolvedPageSize));
                return;
            }

            const userContas = await fetchUsersContaPage(isMobile ? 0 : currentPage, currentSearchTerm, currentListarInativos);
            setListPaginationUsersConta(userContas ?? createInitialPagination(resolvedPageSize));
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao atualizar Usuario'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUsuario = async (id: number) => {
        await deletarUsuario(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleUsersConta(searchTerm, listarInativos);
    };

    const handleAtivarUsuario = async (id: number) => {
        await ativarUsuario(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleUsersConta(searchTerm, listarInativos);
    };

    const handleLoadMoreUsersConta = async () => {
        if (loading || loadingMore || !hasMoreMobileContent(listPaginationUsersConta)) {
            return;
        }

        setLoadingMore(true);
        try {
            await handleListUsersConta((safePageable.pageNumber ?? 0) + 1, searchTerm, listarInativos, true);
        } finally {
            setLoadingMore(false);
        }
    };

    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setUserConta,
        field: 'nome',
        onSearch: (value) => handleListUsersConta(0, value, listarInativos)
    });

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationUsersConta((prev) => ({
            ...(prev ?? createInitialPagination(resolvedPageSize)),
            pageable: {
                ...(prev?.pageable ?? createInitialPagination(resolvedPageSize).pageable),
                pageNumber: selectedPage
            }
        }));
        handleListUsersConta(selectedPage, searchTerm, listarInativos);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleSalvarFiltro = () => {
        handleListUsersConta(0, searchTerm, listarInativos);
        setVisible(false);
    };

    const handleClearFilters = () => {
        setListarInativos(false);
        handleListUsersConta(0, '', false);
        setVisible(false);
    };

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };

    const handleApplyFilters = () => {
        handleListUsersConta(0, searchTerm, listarInativos);
        setVisible(false);
    };

    useEffect(() => {
        handleListUsersConta();
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
                                    label="Pesquisar Nome"
                                    outlined={true}
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    id="nome"
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    loading={loading}
                                    onClickSearch={() => searchNow(searchTerm)}
                                    topLabel="Pesquisar:"
                                    showTopLabel
                                />
                            </div>
                            <div className="col-4 mb-0 lg:col-3 lg:mb-0">
                                <div className="container-BTN-Filter-Created">
                                    <FilterOverlay onApply={handleApplyFilters} onClear={handleClearFilters} buttonClassName="height-2-8rem-ml-1rem-mobile">
                                        <CheckBoxField
                                            inputId="listarInativos"
                                            label="Listar Desativadas"
                                            checked={listarInativos}
                                            onChange={handleCheckboxChange}
                                        />
                                    </FilterOverlay>
                                    {permissaoUsuarioConta.create && (
                                        <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
                            <ListarUserConta
                                loading={loading}
                                listPaginationUserConta={listPaginationUsersConta}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                listarInativos={listarInativos}
                                setListPaginationUserConta={setListPaginationUsersConta}
                                deletar={handleDeleteUsuario}
                                ativar={handleAtivarUsuario}
                                mobileLoadMoreVisible={hasMoreMobileContent(listPaginationUsersConta)}
                                mobileLoadMoreLoading={loadingMore}
                                onMobileLoadMore={handleLoadMoreUsersConta}
                            />
                        </div>
                    </div>
                </>
            )}
            {isDesktop && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="scrollable-container">
                            <div className="p-0">
                                <div className="grid formgrid">
                                    <div className="col-12 lg:col-3 container-input-search-all">
                                        <Input
                                            label="Pesquisar Nome"
                                            outlined={true}
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            id="nome"
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
                                    {permissaoUsuarioConta.create && (
                                        <div className="container-button-primary-novo">
                                            <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3">
                                    <ListarUserConta
                                        loading={loading}
                                        listPaginationUserConta={listPaginationUsersConta}
                                        setLoading={setLoading}
                                        searchTerm={searchTerm}
                                        listarInativos={listarInativos}
                                        setListPaginationUserConta={setListPaginationUsersConta}
                                        deletar={handleDeleteUsuario}
                                        ativar={handleAtivarUsuario}
                                    />
                                </div>
                            </div>
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

export default Usuarios;

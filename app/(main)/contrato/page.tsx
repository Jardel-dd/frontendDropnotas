'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from '@/app/components/messages/GlobalMessages';
import ListarContratos from './tabela/contratoListagem';
import Input from '@/app/shared/include/input/input-all';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarContrato, deletarContrato, listContrato } from './controller/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import { usePermissions } from '@/app/routes/permissoes';
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

const Contratos: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const resolvedPageSize = isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : pageSize;
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const { permissaoContrato } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [contrato, setContrato] = useState<ContratoEntity>(
        new ContratoEntity({
            ativo: true,
            id: 0,
            descricao: '',
            valor_servico: null,
            periodicidade: '',
            emitir_boleto: false,
            enviar_email: false,
            enviar_whatsapp: false,
            id_servico: 0,
            id_empresa: 0,
            id_categoria_contrato: null,
            id_forma_pagamento: null,
            id_clientes_contrato: [0]
        })
    );
    const [isContratosCreated, setIsContratosCreated] = useState(false);
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [listPaginationContratos, setListPaginationContratos] = useState<Record<string, any>>(createInitialPagination(resolvedPageSize));
    const safePagination = listPaginationContratos ?? createInitialPagination(resolvedPageSize);
    const safePageable = safePagination.pageable ?? createInitialPagination(resolvedPageSize).pageable;

    const handleNavigate = () => {
        router.push('/contrato/created');
        setIsContratosCreated(true);
    };

    const fetchContratosPage = async (
        pageNumber = 0,
        term = searchTerm,
        inactive = listarInativos
    ) => {
        const contratos = await listContrato(
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
            term,
            msgs
        );

        return contratos ?? createInitialPagination(resolvedPageSize);
    };

    const handleListContratos = async (
        pageNumber = 0,
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos,
        append = false
    ) => {
        if (!append) {
            setLoading(true);
        }

        try {
            const contratos = await fetchContratosPage(pageNumber, currentSearchTerm, currentListarInativos);
            setListPaginationContratos((current) => {
                if (isMobile && append) {
                    return mergePaginatedContent(current, contratos, pageNumber) ?? createInitialPagination(resolvedPageSize);
                }

                return contratos ?? createInitialPagination(resolvedPageSize);
            });
        } catch (error) {
            console.error('Erro ao buscar Contratos:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao buscar Contratos'
            });
        } finally {
            if (!append) {
                setLoading(false);
            }
        }
    };

    const refreshVisibleContratos = async (
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos
    ) => {
        setLoading(true);
        try {
            const currentPage = safePageable.pageNumber ?? 0;

            if (isMobile && currentPage > 0) {
                const rebuilt = await rebuildLoadedMobilePages({
                    lastLoadedPage: currentPage,
                    fetchPage: (page) => fetchContratosPage(page, currentSearchTerm, currentListarInativos)
                });

                setListPaginationContratos(rebuilt ?? createInitialPagination(resolvedPageSize));
                return;
            }

            const contratos = await fetchContratosPage(isMobile ? 0 : currentPage, currentSearchTerm, currentListarInativos);
            setListPaginationContratos(contratos ?? createInitialPagination(resolvedPageSize));
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao atualizar Contratos'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContrato = async (id: number) => {
        await deletarContrato(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleContratos(searchTerm, listarInativos);
    };

    const handleAtivarContrato = async (id: number) => {
        await ativarContrato(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleContratos(searchTerm, listarInativos);
    };

    const handleLoadMoreContratos = async () => {
        if (loading || loadingMore || !hasMoreMobileContent(listPaginationContratos)) {
            return;
        }

        setLoadingMore(true);
        try {
            await handleListContratos((safePageable.pageNumber ?? 0) + 1, searchTerm, listarInativos, true);
        } finally {
            setLoadingMore(false);
        }
    };

    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setContrato,
        field: 'descricao',
        onSearch: (value) => handleListContratos(0, value, listarInativos)
    });

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationContratos((prev) => ({
            ...(prev ?? createInitialPagination(resolvedPageSize)),
            pageable: {
                ...(prev?.pageable ?? createInitialPagination(resolvedPageSize).pageable),
                pageNumber: selectedPage
            }
        }));
        handleListContratos(selectedPage, searchTerm, listarInativos);
    };

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const newValue = e.checked ?? false;
        setListarInativos(newValue);
        handleListContratos(0, searchTerm, newValue);
        setVisible(false);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleSalvarFiltro = () => {
        handleListContratos(0, searchTerm, listarInativos);
        setVisible(false);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setListarInativos(false);
        setContrato(
            new ContratoEntity({
                ativo: true,
                id: 0,
                descricao: '',
                valor_servico: null,
                periodicidade: '',
                emitir_boleto: false,
                enviar_email: false,
                enviar_whatsapp: false,
                id_servico: 0,
                id_empresa: 0,
                id_categoria_contrato: null,
                id_forma_pagamento: null,
                id_clientes_contrato: [0]
            })
        );
        handleListContratos(0, '', false);
        setVisible(false);
    };

    useEffect(() => {
        handleListContratos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="p-fluid">
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="p-2">
                            <div className="grid formgrid" style={{ maxHeight: '74px' }}>
                                <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0 ">
                                    <Input
                                        label="Pesquisar Descrição/Razao Social"
                                        outlined={true}
                                        id="descricao"
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
                                <div className="col-4 mb-0 lg:col-2 p-0 ">
                                    <div className="container-BTN-Filter-Created">
                                        <FilterOverlay onApply={handleSalvarFiltro} onClear={handleClearFilters} buttonClassName="height-2-8rem-ml-1rem-mobile">
                                            <CheckBoxField
                                                inputId="listarInativos"
                                                label="Listar Desativadas"
                                                checked={listarInativos}
                                                onChange={handleCheckboxChange}
                                            />
                                        </FilterOverlay>
                                        {permissaoContrato.create && (
                                            <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }} className="mt-1">
                            <ListarContratos
                                loading={loading}
                                listPaginationContratos={listPaginationContratos}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                listarInativos={listarInativos}
                                setListPaginationContratos={setListPaginationContratos}
                                deletar={handleDeleteContrato}
                                ativar={handleAtivarContrato}
                                mobileLoadMoreVisible={hasMoreMobileContent(listPaginationContratos)}
                                mobileLoadMoreLoading={loadingMore}
                                onMobileLoadMore={handleLoadMoreContratos}
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
                                            label="Pesquisar Descrição/Razao Social"
                                            outlined={true}
                                            id="descricao"
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
                                    {permissaoContrato.create && (
                                        <div className="container-button-primary-novo">
                                            <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <ListarContratos
                                    loading={loading}
                                    listPaginationContratos={listPaginationContratos}
                                    setLoading={setLoading}
                                    searchTerm={searchTerm}
                                    listarInativos={listarInativos}
                                    setListPaginationContratos={setListPaginationContratos}
                                    deletar={handleDeleteContrato}
                                    ativar={handleAtivarContrato}
                                />
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

export default Contratos;

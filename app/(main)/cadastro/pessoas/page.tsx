'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import ListarPessoa from './tabela/pessoaListagem';
import { usePermissions } from '@/app/routes/permissoes';
import { ClienteFornecedorFilter } from './types/pessoa';
import Input from '@/app/shared/include/input/input-all';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import { DropdownChangeEvent } from 'primereact/dropdown';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { Messages } from '@/app/components/messages/GlobalMessages';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import { MOBILE_LOAD_MORE_PAGE_SIZE, hasMoreMobileContent, mergePaginatedContent, rebuildLoadedMobilePages } from '@/app/components/paginator/mobileLoadMore';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarPessoa, deletarPessoa, listPessoa } from './controller/controller';
import { DropDownFilterClienteFornecedor } from '@/app/shared/optionsDropDown/options';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';

const buildEmptyPessoaPagination = (pageSize: number) => ({
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

const defaultClienteFornecedorFilter: ClienteFornecedorFilter = {
    cliente: true,
    fornecedor: true
};

const ClientesFornecedores: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const resolvedPageSize = isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : pageSize;
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const hasLoadedInitialListRef = useRef(false);
    const { permissaoPessoa } = usePermissions();
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [, setSearchDraft] = useState({ razao_social: '' });
    const [selectedClienteFornecedor, setSelectedClienteFornecedor] = useState<ClienteFornecedorFilter>(defaultClienteFornecedorFilter);
    const [draftClienteFornecedor, setDraftClienteFornecedor] = useState<ClienteFornecedorFilter>(defaultClienteFornecedorFilter);
    const [listarInativos, setListarInativos] = useState(false);
    const { cliente, fornecedor } = selectedClienteFornecedor;
    const [listPaginationClientesFornecedores, setListPaginationClientesFornecedores] = useState<Record<string, any>>(() =>
        buildEmptyPessoaPagination(resolvedPageSize)
    );

    const safePagination = listPaginationClientesFornecedores ?? buildEmptyPessoaPagination(resolvedPageSize);
    const safePageable = safePagination.pageable ?? buildEmptyPessoaPagination(resolvedPageSize).pageable;

    const handleNavigate = () => {
        router.push('/cadastro/pessoas/created');
    };

    const fetchPessoasPage = async (
        pageNumber = 0,
        nextSearchTerm = searchTerm,
        filter = selectedClienteFornecedor,
        nextListarInativos = listarInativos
    ) => {
        const clientesFornecedores = await listPessoa(
            {
                ...safePagination,
                pageable: {
                    ...safePageable,
                    pageNumber,
                    pageSize: resolvedPageSize
                }
            },
            nextListarInativos,
            filter.cliente,
            filter.fornecedor,
            () => {},
            nextSearchTerm
        );

        return clientesFornecedores ?? buildEmptyPessoaPagination(resolvedPageSize);
    };

    const handleListClientesFornecedores = async (
        pageNumber = 0,
        nextSearchTerm = searchTerm,
        filter = selectedClienteFornecedor,
        nextListarInativos = listarInativos,
        append = false
    ) => {
        if (!append) {
            setLoading(true);
        }

        try {
            const clientesFornecedores = await fetchPessoasPage(pageNumber, nextSearchTerm, filter, nextListarInativos);
            setListPaginationClientesFornecedores((current) => {
                if (isMobile && append) {
                    return mergePaginatedContent(current, clientesFornecedores, pageNumber) ?? buildEmptyPessoaPagination(resolvedPageSize);
                }

                return clientesFornecedores ?? buildEmptyPessoaPagination(resolvedPageSize);
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao carregar Cliente ou Fornecedor.'
            });
        } finally {
            if (!append) {
                setLoading(false);
            }
        }
    };

    const refreshVisiblePessoas = async (
        nextSearchTerm = searchTerm,
        filter = selectedClienteFornecedor,
        nextListarInativos = listarInativos
    ) => {
        setLoading(true);
        try {
            const currentPage = safePageable.pageNumber ?? 0;

            if (isMobile && currentPage > 0) {
                const rebuilt = await rebuildLoadedMobilePages({
                    lastLoadedPage: currentPage,
                    fetchPage: (page) => fetchPessoasPage(page, nextSearchTerm, filter, nextListarInativos)
                });

                setListPaginationClientesFornecedores(rebuilt ?? buildEmptyPessoaPagination(resolvedPageSize));
                return;
            }

            const clientesFornecedores = await fetchPessoasPage(isMobile ? 0 : currentPage, nextSearchTerm, filter, nextListarInativos);
            setListPaginationClientesFornecedores(clientesFornecedores ?? buildEmptyPessoaPagination(resolvedPageSize));
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao atualizar Cliente ou Fornecedor.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePessoa = async (id: number) => {
        await deletarPessoa(
            id,
            msgs,
            safePagination,
            selectedClienteFornecedor.cliente,
            selectedClienteFornecedor.fornecedor,
            listarInativos,
            () => {},
            searchTerm
        );

        await refreshVisiblePessoas(searchTerm, selectedClienteFornecedor, listarInativos);
    };

    const handleAtivarPessoa = async (id: number) => {
        await ativarPessoa(
            id,
            msgs,
            safePagination,
            listarInativos,
            selectedClienteFornecedor.cliente,
            selectedClienteFornecedor.fornecedor,
            () => {},
            searchTerm
        );

        await refreshVisiblePessoas(searchTerm, selectedClienteFornecedor, listarInativos);
    };

    const handleLoadMorePessoas = async () => {
        if (loading || loadingMore || !hasMoreMobileContent(listPaginationClientesFornecedores)) {
            return;
        }

        setLoadingMore(true);
        try {
            await handleListClientesFornecedores(
                (safePageable.pageNumber ?? 0) + 1,
                searchTerm,
                selectedClienteFornecedor,
                listarInativos,
                true
            );
        } finally {
            setLoadingMore(false);
        }
    };

    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setSearchDraft,
        field: 'razao_social',
        onSearch: (value) => handleListClientesFornecedores(0, value, selectedClienteFornecedor, listarInativos)
    });

    const handleCheckboxChange = (event: CheckboxChangeEvent) => {
        setListarInativos(event.checked ?? false);
    };

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;

        setListPaginationClientesFornecedores((prev) => ({
            ...(prev ?? buildEmptyPessoaPagination(resolvedPageSize)),
            pageable: {
                ...(prev?.pageable ?? buildEmptyPessoaPagination(resolvedPageSize).pageable),
                pageNumber: selectedPage
            }
        }));

        handleListClientesFornecedores(selectedPage, searchTerm, selectedClienteFornecedor, listarInativos);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleClienteFornecedorChange = (event: DropdownChangeEvent) => {
        setDraftClienteFornecedor(event.value);
    };

    const syncDraftFilters = () => {
        setDraftClienteFornecedor(selectedClienteFornecedor);
    };

    const handleClearFilters = () => {
        setSelectedClienteFornecedor(defaultClienteFornecedorFilter);
        setDraftClienteFornecedor(defaultClienteFornecedorFilter);
        setListarInativos(false);
        void handleListClientesFornecedores(0, '', defaultClienteFornecedorFilter, false);
    };

    const handleApplyFilters = () => {
        const firstPage = 0;
        setSelectedClienteFornecedor(draftClienteFornecedor);
        void handleListClientesFornecedores(firstPage, searchTerm, draftClienteFornecedor, listarInativos);
    };

    useEffect(() => {
        if (hasLoadedInitialListRef.current) {
            return;
        }

        hasLoadedInitialListRef.current = true;
        void handleListClientesFornecedores();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const listProps = {
        loading,
        listPaginationClientesFornecedores,
        setListPaginationClientesFornecedores,
        setLoading,
        searchTerm,
        listarInativos,
        cliente,
        fornecedor,
        deletar: handleDeletePessoa,
        ativar: handleAtivarPessoa
    };

    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
                <div className="card styled-container-main-all-routes p-2">
                    <div className="grid formgrid p-2">
                        <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
                            <Input
                                label="Pesquisar Razao Social/CNPJ"
                                outlined
                                id="razao_social"
                                useRightButton
                                iconRight="pi pi-search"
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
                                <FilterOverlay
                                    onOpen={syncDraftFilters}
                                    onApply={handleApplyFilters}
                                    onClear={handleClearFilters}
                                    buttonClassName="height-2-8rem-ml-1rem-mobile"
                                >
                                    <Dropdown
                                        value={draftClienteFornecedor}
                                        options={DropDownFilterClienteFornecedor}
                                        onChange={handleClienteFornecedorChange}
                                        placeholder="Selecione o tipo"
                                        topLabel="Cliente ou Fornecedor:"
                                        showTopLabel
                                        label=""
                                    />
                                    <CheckBoxField
                                        inputId="listarInativos"
                                        label="Listar Desativadas"
                                        checked={listarInativos}
                                        onChange={handleCheckboxChange}
                                    />
                                </FilterOverlay>
                                {permissaoPessoa.create && (
                                    <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
                        <ListarPessoa
                            {...listProps}
                            mobileLoadMoreVisible={hasMoreMobileContent(listPaginationClientesFornecedores)}
                            mobileLoadMoreLoading={loadingMore}
                            onMobileLoadMore={handleLoadMorePessoas}
                        />
                    </div>
                </div>
            )}
            {isDesktop && (
                <div className="card styled-container-main-all-routes p-2">
                    <div className="scrollable-container">
                        <div className="p-0">
                            <div className="grid formgrid">
                                <div className="col-12 lg:col-12 container-input-search-all">
                                    <Input
                                        label="Pesquisar Razao Social/CNPJ"
                                        outlined
                                        id="razao_social"
                                        useRightButton
                                        iconRight="pi pi-search"
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
                                        onOpen={syncDraftFilters}
                                        onApply={handleApplyFilters}
                                        onClear={handleClearFilters}
                                        buttonClassName="Btn-Filter-Desktop"
                                    >
                                        <div className="grid formgrid">
                                            <div className="col-12 lg:col-12 ">
                                                <Dropdown
                                                    value={draftClienteFornecedor}
                                                    options={DropDownFilterClienteFornecedor}
                                                    onChange={handleClienteFornecedorChange}
                                                    placeholder="Selecione o tipo"
                                                    topLabel="Cliente ou Fornecedor:"
                                                    showTopLabel
                                                    label=""
                                                />
                                                <CheckBoxField
                                                    inputId="listarInativos"
                                                    label="Listar Desativadas"
                                                    checked={listarInativos}
                                                    onChange={handleCheckboxChange}
                                                />
                                            </div>
                                        </div>
                                    </FilterOverlay>
                                </div>
                                {permissaoPessoa.create && (
                                    <div className="container-button-primary-novo">
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <ListarPessoa {...listProps} />
                            </div>
                        </div>
                    </div>
                    <div className="p-2" style={{ marginTop: 'auto' }}>
                        <CustomPaginator
                            first={safePageable.pageNumber * safePageable.pageSize}
                            rows={resolvedPageSize}
                            totalRecords={safePagination.totalElements}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientesFornecedores;

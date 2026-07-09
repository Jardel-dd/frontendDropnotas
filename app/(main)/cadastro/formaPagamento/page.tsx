'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/app/routes/permissoes';
import Input from '@/app/shared/include/input/input-all';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import { DropdownChangeEvent } from 'primereact/dropdown';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ListarFormaPagamento from './tabela/formaPagamentoListagem';
import { Messages } from '@/app/components/messages/GlobalMessages';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import { tipo_forma_pagamento } from '@/app/shared/optionsDropDown/options';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { FormaPagamentoEntity, TipoFormaPagamento } from '@/app/entity/FormaPagamento';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { ativarFormaPagamento, deletarFormaPagamento, listFormaPagamento } from './controller/controller';
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

const CategoriaContrato: React.FC = () => {
    const router = useRouter();
    const isMobile = useIsMobile();
    const pageSize = usePageSize();
    const isDesktop = useIsDesktop();
    const resolvedPageSize = isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : pageSize;
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { permissaoFormaPagamento } = usePermissions();
    const [visible, setVisible] = useState<boolean>(false);
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoEntity>(
        new FormaPagamentoEntity({
            ativo: true,
            id: 0,
            descricao: '',
            observacao: '',
            tipo_forma_pagamento: '' as TipoFormaPagamento,
            tipo_taxa: '',
            valor_taxa: 0
        })
    );
    const [isFormaPagamentoCreated, setIsFormaPagamentoCreated] = useState(false);
    const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<string | null>(null);
    const [draftSelectedFormaPagamento, setDraftSelectedFormaPagamento] = useState<string | null>(null);
    const [listPaginationFormaPagamento, setListPaginationFormaPagamento] = useState<Record<string, any>>(createInitialPagination(resolvedPageSize));
    const safePagination = listPaginationFormaPagamento ?? createInitialPagination(resolvedPageSize);
    const safePageable = safePagination.pageable ?? createInitialPagination(resolvedPageSize).pageable;

    const handleNavigate = () => {
        router.push('/cadastro/formaPagamento/created');
        setIsFormaPagamentoCreated(true);
    };

    const fetchFormaPagamentoPage = async (
        pageNumber = 0,
        term = searchTerm,
        inactive = listarInativos,
        tipoFormaPagamento = selectedFormaPagamento ?? ''
    ) => {
        const formaPagamentoPage = await listFormaPagamento(
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
            tipoFormaPagamento
        );

        return formaPagamentoPage ?? createInitialPagination(resolvedPageSize);
    };

    const handleListFormaPagamento = async (
        pageNumber = 0,
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos,
        tipoFormaPagamento = selectedFormaPagamento ?? '',
        append = false
    ) => {
        if (!append) {
            setLoading(true);
        }

        try {
            const formaPagamentoPage = await fetchFormaPagamentoPage(pageNumber, currentSearchTerm, currentListarInativos, tipoFormaPagamento);
            setListPaginationFormaPagamento((current) => {
                if (isMobile && append) {
                    return mergePaginatedContent(current, formaPagamentoPage, pageNumber) ?? createInitialPagination(resolvedPageSize);
                }

                return formaPagamentoPage ?? createInitialPagination(resolvedPageSize);
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao buscar Forma de Pagamento',
                life: 3000
            });
        } finally {
            if (!append) {
                setLoading(false);
            }
        }
    };

    const refreshVisibleFormaPagamento = async (
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos,
        tipoFormaPagamento = selectedFormaPagamento ?? ''
    ) => {
        setLoading(true);
        try {
            const currentPage = safePageable.pageNumber ?? 0;

            if (isMobile && currentPage > 0) {
                const rebuilt = await rebuildLoadedMobilePages({
                    lastLoadedPage: currentPage,
                    fetchPage: (page) => fetchFormaPagamentoPage(page, currentSearchTerm, currentListarInativos, tipoFormaPagamento)
                });

                setListPaginationFormaPagamento(rebuilt ?? createInitialPagination(resolvedPageSize));
                return;
            }

            const formaPagamentoPage = await fetchFormaPagamentoPage(isMobile ? 0 : currentPage, currentSearchTerm, currentListarInativos, tipoFormaPagamento);
            setListPaginationFormaPagamento(formaPagamentoPage ?? createInitialPagination(resolvedPageSize));
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao atualizar Forma de Pagamento',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteFormaPagamento = async (id: number) => {
        await deletarFormaPagamento(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleFormaPagamento(searchTerm, listarInativos, selectedFormaPagamento ?? '');
    };

    const handleAtivarFormaPagamento = async (id: number) => {
        await ativarFormaPagamento(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleFormaPagamento(searchTerm, listarInativos, selectedFormaPagamento ?? '');
    };

    const handleLoadMoreFormaPagamento = async () => {
        if (loading || loadingMore || !hasMoreMobileContent(listPaginationFormaPagamento)) {
            return;
        }

        setLoadingMore(true);
        try {
            await handleListFormaPagamento((safePageable.pageNumber ?? 0) + 1, searchTerm, listarInativos, selectedFormaPagamento ?? '', true);
        } finally {
            setLoadingMore(false);
        }
    };

    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setFormaPagamento,
        field: 'descricao',
        onSearch: (value) => handleListFormaPagamento(0, value, listarInativos, selectedFormaPagamento ?? '')
    });

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationFormaPagamento((prev) => ({
            ...(prev ?? createInitialPagination(resolvedPageSize)),
            pageable: {
                ...(prev?.pageable ?? createInitialPagination(resolvedPageSize).pageable),
                pageNumber: selectedPage
            }
        }));
        handleListFormaPagamento(selectedPage, searchTerm, listarInativos, selectedFormaPagamento ?? '');
    };

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const syncDraftFilters = () => {
        setListarInativos(listarInativos);
        setDraftSelectedFormaPagamento(selectedFormaPagamento);
    };

    const handleClearFilters = () => {
        setListarInativos(false);
        setSelectedFormaPagamento(null);
        setDraftSelectedFormaPagamento(null);
        handleListFormaPagamento(0, '', false, '');
    };

    const handleTipoFormaPagamentoChange = (e: DropdownChangeEvent) => {
        setDraftSelectedFormaPagamento(e.value ?? null);
    };

    const handleApplyFilters = () => {
        setListarInativos(listarInativos);
        setSelectedFormaPagamento(draftSelectedFormaPagamento);
        handleListFormaPagamento(0, searchTerm, listarInativos, draftSelectedFormaPagamento ?? '');
        setVisible(false);
    };

    useEffect(() => {
        handleListFormaPagamento();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="grid formgrid p-2">
                            <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
                                <Input
                                    label="Pesquisar Descrição"
                                    outlined={true}
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    id="descricao"
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
                                        onClear={handleClearFilters}
                                        onApply={handleApplyFilters}
                                        buttonClassName="height-2-8rem-ml-1rem-mobile"
                                    >
                                        <div>
                                            <Dropdown
                                                value={draftSelectedFormaPagamento}
                                                options={tipo_forma_pagamento}
                                                onChange={handleTipoFormaPagamentoChange}
                                                placeholder="Selecione a Forma de Pagamento:"
                                                optionLabel="label"
                                                optionValue="value"
                                                topLabel="Forma de Pagamento:"
                                                showTopLabel
                                                label=""
                                            />
                                        </div>
                                        <CheckBoxField
                                            inputId="listarInativos"
                                            label="Listar Desativadas"
                                            checked={listarInativos}
                                            onChange={handleCheckboxChange}
                                        />
                                    </FilterOverlay>
                                    {permissaoFormaPagamento.create && (
                                        <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
                            <ListarFormaPagamento
                                loading={loading}
                                searchTerm={searchTerm}
                                setLoading={setLoading}
                                listarInativos={listarInativos}
                                setListPaginationFormaPagamento={setListPaginationFormaPagamento}
                                listPaginationFormaPagamento={listPaginationFormaPagamento}
                                deletar={handleDeleteFormaPagamento}
                                ativar={handleAtivarFormaPagamento}
                                tipo_forma_pagamento={selectedFormaPagamento ?? ''}
                                mobileLoadMoreVisible={hasMoreMobileContent(listPaginationFormaPagamento)}
                                mobileLoadMoreLoading={loadingMore}
                                onMobileLoadMore={handleLoadMoreFormaPagamento}
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
                                            label="Pesquisar Descrição "
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
                                        <FilterOverlay onOpen={syncDraftFilters} onClear={handleClearFilters} onApply={handleApplyFilters} buttonClassName="Btn-Filter-Desktop">
                                            <div>
                                                <Dropdown
                                                    value={draftSelectedFormaPagamento}
                                                    options={tipo_forma_pagamento}
                                                    onChange={handleTipoFormaPagamentoChange}
                                                    placeholder="Selecione a Forma de pagamento"
                                                    optionLabel="label"
                                                    optionValue="value"
                                                    topLabel="Forma de Pagamento:"
                                                    showTopLabel
                                                    label=""
                                                />
                                            </div>
                                            <CheckBoxField
                                                inputId="listarInativos"
                                                label="Listar Desativadas"
                                                checked={listarInativos}
                                                onChange={handleCheckboxChange}
                                            />
                                        </FilterOverlay>
                                    </div>
                                    {permissaoFormaPagamento.create && (
                                        <div className="container-button-primary-novo">
                                            <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <ListarFormaPagamento
                                        loading={loading}
                                        searchTerm={searchTerm}
                                        setLoading={setLoading}
                                        listarInativos={listarInativos}
                                        setListPaginationFormaPagamento={setListPaginationFormaPagamento}
                                        listPaginationFormaPagamento={listPaginationFormaPagamento}
                                        deletar={handleDeleteFormaPagamento}
                                        ativar={handleAtivarFormaPagamento}
                                        tipo_forma_pagamento={selectedFormaPagamento ?? ''}
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

export default CategoriaContrato;

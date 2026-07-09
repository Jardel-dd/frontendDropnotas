'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { usePermissions } from '@/app/routes/permissoes';
import Input from '@/app/shared/include/input/input-all';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import FormCategoriaContratoCreated from './form/controller';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { CategoriaContratoFormRef } from './types/categoriaContratos';
import { validateFieldsCategoriaContrato } from './controller/validate';
import ListarCategoriaContrato from './tabela/categoriaContratoListagem';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { ativarCategoriaContrato, deletarCategoriaContrato, listCategoriaContrato } from './controller/controller';
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
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const resolvedPageSize = isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : pageSize;
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { permissaoCategoriaContrato } = usePermissions();
    const formRef = useRef<CategoriaContratoFormRef>(null);
    const [visible, setVisible] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [reloadKeyCategoriaContrato, setReloadKeyCategoriaContrato] = useState(0);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [selectedCategoriaId, setSelectedCategoriaId] = useState<string | null>(null);
    const [showModalCategoriaContrato, setShowModalCategoriaContrato] = useState(false);
    const [selectedCategoriaContrato, setSelectedCategoriaContrato] = useState<CategoryContratosEntity | null>(null);
    const [categoriaContrato, setCategoriaContrato] = useState<CategoryContratosEntity>(
        new CategoryContratosEntity({
            id: 0,
            descricao: '',
            observacoes: '',
            ativo: true
        })
    );
    const [listPaginationCategoriaContrato, setListPaginationCategoriaContrato] = useState<Record<string, any>>(createInitialPagination(resolvedPageSize));
    const safePagination = listPaginationCategoriaContrato ?? createInitialPagination(resolvedPageSize);
    const safePageable = safePagination.pageable ?? createInitialPagination(resolvedPageSize).pageable;

    const handleCategoriaContratoSaved = async (created: CategoryContratosEntity) => {
        setShowModalCategoriaContrato(false);
        setSelectedCategoriaContrato(created);
        setReloadKeyCategoriaContrato((k) => k + 1);
        await handleListCategoriaContrato(0, searchTerm, listarInativos);
    };

    const handleCategoriaContrato = (updatedCategoriaContrato: CategoryContratosEntity) => {
        setCategoriaContrato(updatedCategoriaContrato);
    };

    const fetchCategoriaContratoPage = async (
        pageNumber = 0,
        term = searchTerm,
        inactive = listarInativos
    ) => {
        const categoriaContratos = await listCategoriaContrato(
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

        return categoriaContratos ?? createInitialPagination(resolvedPageSize);
    };

    const handleListCategoriaContrato = async (
        pageNumber = 0,
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos,
        append = false
    ) => {
        if (!append) {
            setLoading(true);
        }

        try {
            const categoriaContratos = await fetchCategoriaContratoPage(pageNumber, currentSearchTerm, currentListarInativos);
            setListPaginationCategoriaContrato((current) => {
                if (isMobile && append) {
                    return mergePaginatedContent(current, categoriaContratos, pageNumber) ?? createInitialPagination(resolvedPageSize);
                }

                return categoriaContratos ?? createInitialPagination(resolvedPageSize);
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao buscar Categoria Contrato',
                life: 3000
            });
        } finally {
            if (!append) {
                setLoading(false);
            }
        }
    };

    const refreshVisibleCategoriaContrato = async (
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos
    ) => {
        setLoading(true);
        try {
            const currentPage = safePageable.pageNumber ?? 0;

            if (isMobile && currentPage > 0) {
                const rebuilt = await rebuildLoadedMobilePages({
                    lastLoadedPage: currentPage,
                    fetchPage: (page) => fetchCategoriaContratoPage(page, currentSearchTerm, currentListarInativos)
                });

                setListPaginationCategoriaContrato(rebuilt ?? createInitialPagination(resolvedPageSize));
                return;
            }

            const categoriaContratos = await fetchCategoriaContratoPage(isMobile ? 0 : currentPage, currentSearchTerm, currentListarInativos);
            setListPaginationCategoriaContrato(categoriaContratos ?? createInitialPagination(resolvedPageSize));
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao atualizar Categoria Contrato',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategoriaContrato = async (id: number) => {
        await deletarCategoriaContrato(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleCategoriaContrato(searchTerm, listarInativos);
    };

    const handleAtivarCategoriaContrato = async (id: number) => {
        await ativarCategoriaContrato(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleCategoriaContrato(searchTerm, listarInativos);
    };

    const handleLoadMoreCategoriaContrato = async () => {
        if (loading || loadingMore || !hasMoreMobileContent(listPaginationCategoriaContrato)) {
            return;
        }

        setLoadingMore(true);
        try {
            await handleListCategoriaContrato((safePageable.pageNumber ?? 0) + 1, searchTerm, listarInativos, true);
        } finally {
            setLoadingMore(false);
        }
    };

    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setCategoriaContrato,
        field: 'descricao',
        onSearch: (value) => handleListCategoriaContrato(0, value, listarInativos)
    });

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationCategoriaContrato((prev) => ({
            ...(prev ?? createInitialPagination(resolvedPageSize)),
            pageable: {
                ...(prev?.pageable ?? createInitialPagination(resolvedPageSize).pageable),
                pageNumber: selectedPage
            }
        }));
        handleListCategoriaContrato(selectedPage, searchTerm, listarInativos);
    };

    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleNavigate = () => {
        setSelectedCategoriaId(null);
        setCategoriaContrato(
            new CategoryContratosEntity({
                id: 0,
                descricao: '',
                observacoes: '',
                ativo: true
            })
        );
        setShowModalCategoriaContrato(true);
    };

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };

    const handleEditCategoria = (categoria: CategoryContratosEntity) => {
        setSelectedCategoriaId(String(categoria.id));
        setCategoriaContrato(categoria);
        setShowModalCategoriaContrato(true);
    };

    const handleClearFilters = () => {
        setListarInativos(false);
        handleListCategoriaContrato(0, '', false);
        setVisible(false);
    };

    const handleApplyFilters = () => {
        handleListCategoriaContrato(0, searchTerm, listarInativos);
        setVisible(false);
    };

    const handleSalvarFiltro = () => {
        handleListCategoriaContrato(0, searchTerm, listarInativos);
        setVisible(false);
    };

    useEffect(() => {
        handleListCategoriaContrato();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsCategoriaContrato(categoriaContrato, setErrors, msgs);
        }
    }, [categoriaContrato, touchedFields, msgs]);

    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />

            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="grid formgrid p-2">
                            <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
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
                            <div className="col-4 mb-0 lg:col-3 lg:mb-0">
                                <div className="container-BTN-Filter-Created ">
                                    <FilterOverlay
                                        onApply={handleApplyFilters}
                                        onClear={handleClearFilters}
                                        buttonClassName="height-2-8rem-ml-1rem-mobile">
                                        <CheckBoxField
                                            inputId="listarInativos"
                                            label="Listar Desativadas"
                                            checked={listarInativos}
                                            onChange={handleCheckboxChange}
                                        />

                                    </FilterOverlay>
                                    {permissaoCategoriaContrato.create && (
                                        <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
                            <ListarCategoriaContrato
                                loading={loading}
                                listPaginationCategoriaContrato={listPaginationCategoriaContrato}
                                deletar={handleDeleteCategoriaContrato}
                                ativar={handleAtivarCategoriaContrato}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                setListPaginationCategoriaContrato={setListPaginationCategoriaContrato}
                                listarInativos={listarInativos}
                                onCategoriaClick={handleEditCategoria}
                                mobileLoadMoreVisible={hasMoreMobileContent(listPaginationCategoriaContrato)}
                                mobileLoadMoreLoading={loadingMore}
                                onMobileLoadMore={handleLoadMoreCategoriaContrato}
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
                                            label="Pesquisar Descrição"
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
                                    <div className="container-button-primary-novo">
                                        {permissaoCategoriaContrato.create && (
                                            <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ListarCategoriaContrato
                                    loading={loading}
                                    listPaginationCategoriaContrato={listPaginationCategoriaContrato}
                                    deletar={handleDeleteCategoriaContrato}
                                    ativar={handleAtivarCategoriaContrato}
                                    setLoading={setLoading}
                                    searchTerm={searchTerm}
                                    setListPaginationCategoriaContrato={setListPaginationCategoriaContrato}
                                    listarInativos={listarInativos}
                                    onCategoriaClick={handleEditCategoria}
                                />
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
                </>
            )}
            <DialogFilter
                header={selectedCategoriaId ? 'Editar Categoria de Contrato' : 'Adicionar Categoria de Contratos'}
                visible={showModalCategoriaContrato}
                onHide={() => {
                    setShowModalCategoriaContrato(false);
                    setSelectedCategoriaId(null);
                }}
                style={{ height: 'auto' }}
                breakpoints={{
                    '960px': '75vw',
                    '640px': '95vw'
                }}
            >
                <FormCategoriaContratoCreated
                    ref={formRef}
                    msgs={msgs}
                    initialId={selectedCategoriaId}
                    setCategoriaContrato={setCategoriaContrato}
                    onCategoriaContratoChange={handleCategoriaContrato}
                    onErrorsChange={handleErrorsChange}
                    redirectAfterSave={false}
                    onSaved={handleCategoriaContratoSaved}
                    onClose={() => setShowModalCategoriaContrato(false)}
                    showBTNPGCreatedDialog
                    onBackClick={() => setShowModalCategoriaContrato(false)}
                    categoriaContrato={categoriaContrato}
                />
            </DialogFilter>
        </div>
    );
};

export default CategoriaContrato;

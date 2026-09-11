'use client';
import './styles.css';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { usePermissions } from '@/app/routes/permissoes';
import Input from '@/app/shared/include/input/input-all';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import { MOBILE_LOAD_MORE_PAGE_SIZE, hasMoreMobileContent, mergePaginatedContent, rebuildLoadedMobilePages } from '@/app/components/paginator/mobileLoadMore';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { AppliedFiltersSummary } from '@/app/components/appliedFiltersSummary/AppliedFiltersSummary';
import { PerfilTributarioEntity } from '@/app/entity/perfilTributarioEntity';
import { ativarPerfilTributario, deletarPerfilTributario, listPerfilTributario } from './controller/controller';
import ListarPerfilTributario from './tabela/perfilTributarioListagem';

const createInitialPagination = (pageSize: number) => ({
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

function PerfilTributario() {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const { permissaoServico } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    const resolvedPageSize = isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : pageSize;

    const [perfilTributario, setPerfilTributario] = useState<PerfilTributarioEntity>(
        new PerfilTributarioEntity({
            ativo: true,
            id: 0,
            nome: '',
            item_lista_servico: '',
            exigibilidade_iss: '',
            iss_retido: '',
            observacoes: '',
            codigo_municipio: '',
            numero_processo: '',
            responsavel_retencao: '',
            codigo_cnae: '',
            codigo_nbs: '',
            codigo_inter_contr: '',
            codigo_indicador_operacao: '',
            tipo_operacao: '',
            finalidade_nfse: 0,
            indicador_finalidade: 0,
            indicador_destinatario: '',
            codigo_situacao_tributaria: '',
            codigo_classificacao_tributaria: '',
            codigo_situacao_tributaria_regular: '',
            codigo_classificacao_tributaria_regular: '',
            codigo_credito_presumido: '',
            percentual_diferencial_uf: 0,
            percentual_diferencial_municipal: 0,
            percentual_diferencial_cbs: 0,
        })
    );
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [draftListarInativos, setDraftListarInativos] = useState(false);
    const [listPaginationPerfilTributario, setListPaginationPerfilTributario] = useState<Record<string, any>>(createInitialPagination(resolvedPageSize));
    const safePagination = listPaginationPerfilTributario ?? createInitialPagination(resolvedPageSize);
    const safePageable = safePagination.pageable ?? createInitialPagination(resolvedPageSize).pageable;

    const fetchPerfilTributarioPage = async (pageNumber = 0, term = searchTerm, inactive = listarInativos) => {
        const servicos = await listPerfilTributario(
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

        return servicos ?? createInitialPagination(resolvedPageSize);
    };

    const handleNavigate = () => {
        router.push('/cadastro/perfilTributario/created');
    };

    const handleListPerfilTributario = async (pageNumber = 0, term = searchTerm, inactive = listarInativos, append = false) => {
        if (!append) {
            setLoading(true);
        }

        try {
            const servicos = await fetchPerfilTributarioPage(pageNumber, term, inactive);
            setListPaginationPerfilTributario((current) => {
                if (isMobile && append) {
                    return mergePaginatedContent(current, servicos, pageNumber) ?? createInitialPagination(resolvedPageSize);
                }

                return servicos ?? createInitialPagination(resolvedPageSize);
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Falha ao buscar Perfil Tributário',
                life: 3000
            });
        } finally {
            if (!append) {
                setLoading(false);
            }
        }
    };

    const refreshVisiblePerfilTributario = async (term = searchTerm, inactive = listarInativos) => {
        setLoading(true);
        try {
            const currentPage = safePageable.pageNumber ?? 0;
            if (isMobile && currentPage > 0) {
                const rebuilt = await rebuildLoadedMobilePages({
                    lastLoadedPage: currentPage,
                    fetchPage: (page) => fetchPerfilTributarioPage(page, term, inactive)
                });

                setListPaginationPerfilTributario(rebuilt ?? createInitialPagination(resolvedPageSize));
                return;
            }
            let servicos = await fetchPerfilTributarioPage(isMobile ? 0 : currentPage, term, inactive);

            const isEmptyDesktopPageWithRemainingRecords =
                !isMobile &&
                currentPage > 0 &&
                Array.isArray(servicos.content) &&
                servicos.content.length === 0 &&
                (servicos.totalElements ?? 0) > 0;

            if (isEmptyDesktopPageWithRemainingRecords) {
                servicos = await fetchPerfilTributarioPage(currentPage - 1, term, inactive);
            }

            setListPaginationPerfilTributario(servicos ?? createInitialPagination(resolvedPageSize));
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao atualizar Perfil Tributário',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePerfilTributario = async (id: number) => {
        await deletarPerfilTributario(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisiblePerfilTributario(searchTerm, listarInativos);
    };

    const handleAtivarPerfilTributario = async (id: number) => {
        await ativarPerfilTributario(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisiblePerfilTributario(searchTerm, listarInativos);
    };

    const handleLoadMorePerfilTributario = async () => {
        if (loading || loadingMore || !hasMoreMobileContent(listPaginationPerfilTributario)) {
            return;
        }
        setLoadingMore(true);
        try {
            await handleListPerfilTributario((safePageable.pageNumber ?? 0) + 1, searchTerm, listarInativos, true);
        } finally {
            setLoadingMore(false);
        }
    };

    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setPerfilTributario,
        field: 'nome',
        onSearch: (value) => handleListPerfilTributario(0, value, listarInativos)
    });

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationPerfilTributario((prev) => ({
            ...(prev ?? createInitialPagination(resolvedPageSize)),
            pageable: {
                ...(prev?.pageable ?? createInitialPagination(resolvedPageSize).pageable),
                pageNumber: selectedPage
            }
        }));
        handleListPerfilTributario(selectedPage, searchTerm, listarInativos);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleSalvarFiltro = () => {
        setListarInativos(draftListarInativos);
        handleListPerfilTributario(0, searchTerm, draftListarInativos);
    };

    const handleClearFilters = () => {
        setListarInativos(false);
        setDraftListarInativos(false);
        handleListPerfilTributario(0, '', false);
    };

    const handleRemoveInativosFilter = () => {
        setListarInativos(false);
        setDraftListarInativos(false);
        handleListPerfilTributario(0, searchTerm, false);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setDraftListarInativos(e.checked ?? false);
    };
    useEffect(() => {
        handleListPerfilTributario();
    }, []);

    const appliedFilterItems = [
        {
            label: 'Situação',
            value: listarInativos ? 'Listando inativos' : null,
            onRemove: handleRemoveInativosFilter
        }
    ];
    const activeFilterCount = appliedFilterItems.filter((item) => item.value).length;

    return (
        <div className="w-full cadastro-servicos-page">
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
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
                        <div className="col-4 mb-0 lg:col-3 lg:mb-0 ">
                            <div className="container-BTN-Filter-Created">
                                <FilterOverlay
                                    onOpen={() => setDraftListarInativos(listarInativos)}
                                    onApply={handleSalvarFiltro}
                                    onClear={handleClearFilters}
                                    buttonClassName="height-2-8rem-ml-1rem-mobile"
                                    activeFilterCount={activeFilterCount}>
                                    <CheckBoxField
                                        inputId="listarInativos"
                                        label="Listar Desativadas"
                                        checked={draftListarInativos}
                                        onChange={handleCheckboxChange}
                                    />
                                </FilterOverlay>
                                {permissaoServico.create && (
                                    <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                )}
                            </div>
                        </div>
                    </div>
                    <AppliedFiltersSummary items={appliedFilterItems} onClear={handleClearFilters} />
                    <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
                        <ListarPerfilTributario
                            loading={loading}
                            setLoading={setLoading}
                            searchTerm={searchTerm}
                            listarInativos={listarInativos}
                            listPaginationPerfilTributario={listPaginationPerfilTributario}
                            setListPaginationPerfilTributario={setListPaginationPerfilTributario}
                            deletar={handleDeletePerfilTributario}
                            ativar={handleAtivarPerfilTributario}
                            mobileLoadMoreVisible={hasMoreMobileContent(listPaginationPerfilTributario)}
                            mobileLoadMoreLoading={loadingMore}
                            onMobileLoadMore={handleLoadMorePerfilTributario}
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
                                        label="Pesquisar Descrição"
                                        outlined={true}
                                        useRightButton={true}
                                        iconRight={'pi pi-search'}
                                        id="descricao"
                                        value={searchTerm}
                                        loading={loading}
                                        onChange={handleSearchChange}
                                        onClickSearch={() => searchNow(searchTerm)}
                                        topLabel="Pesquisar:"
                                        showTopLabel
                                    />
                                </div>
                                <div className="Container-Btn-Filter-Desktop">
                                    <FilterOverlay
                                        onOpen={() => setDraftListarInativos(listarInativos)}
                                        onApply={handleSalvarFiltro}
                                        onClear={handleClearFilters}
                                        buttonClassName="Btn-Filter-Desktop"
                                        activeFilterCount={activeFilterCount}>
                                        <CheckBoxField
                                            inputId="listarInativos"
                                            label="Listar Desativadas"
                                            checked={draftListarInativos}
                                            onChange={handleCheckboxChange}
                                        />
                                    </FilterOverlay>
                                </div>
                                {permissaoServico.create && (
                                    <div className="container-button-primary-novo">
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                )}
                            </div>
                            <AppliedFiltersSummary items={appliedFilterItems} onClear={handleClearFilters} />
                            <div className="mt-3">
                                <ListarPerfilTributario
                                    loading={loading}
                                    setLoading={setLoading}
                                    searchTerm={searchTerm}
                                    listarInativos={listarInativos}
                                    listPaginationPerfilTributario={listPaginationPerfilTributario}
                                    setListPaginationPerfilTributario={setListPaginationPerfilTributario}
                                    deletar={handleDeletePerfilTributario}
                                    ativar={handleAtivarPerfilTributario}
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                        <CustomPaginator
                            first={safePageable.pageNumber * safePageable.pageSize}
                            rows={resolvedPageSize}
                            totalRecords={safePagination.totalElements ?? 0}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default PerfilTributario;

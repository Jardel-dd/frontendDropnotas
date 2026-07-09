'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from '@/app/components/messages/GlobalMessages';
import ListarServicos from './tabela/servicoListagem';
import { usePermissions } from '@/app/routes/permissoes';
import Input from '@/app/shared/include/input/input-all';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { CheckboxChangeEvent } from 'primereact/checkbox';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import { MOBILE_LOAD_MORE_PAGE_SIZE, hasMoreMobileContent, mergePaginatedContent, rebuildLoadedMobilePages } from '@/app/components/paginator/mobileLoadMore';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarServico, deletarServico, listServico } from './controller/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';

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

function Servicos() {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const resolvedPageSize = isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : pageSize;
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const { permissaoServico } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    const [service, setService] = useState<ServiceEntity>(
        new ServiceEntity({
            ativo: true,
            id: 0,
            descricao: '',
            descricao_completa: '',
            codigo: '',
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
            tipo_operacao: 0,
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
            valor_servico: null,
            valor_desconto: 0
        })
    );
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [listPaginationServicos, setListPaginationServicos] = useState<Record<string, any>>(createInitialPagination(resolvedPageSize));
    const safePagination = listPaginationServicos ?? createInitialPagination(resolvedPageSize);
    const safePageable = safePagination.pageable ?? createInitialPagination(resolvedPageSize).pageable;

    const fetchServicosPage = async (pageNumber = 0, term = searchTerm, inactive = listarInativos) => {
        const servicos = await listServico(
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
        router.push('/cadastro/servicos/created');
    };

    const handleListServicos = async (pageNumber = 0, term = searchTerm, inactive = listarInativos, append = false) => {
        if (!append) {
            setLoading(true);
        }

        try {
            const servicos = await fetchServicosPage(pageNumber, term, inactive);
            setListPaginationServicos((current) => {
                if (isMobile && append) {
                    return mergePaginatedContent(current, servicos, pageNumber) ?? createInitialPagination(resolvedPageSize);
                }

                return servicos ?? createInitialPagination(resolvedPageSize);
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao buscar Servicos',
                life: 3000
            });
        } finally {
            if (!append) {
                setLoading(false);
            }
        }
    };

    const refreshVisibleServicos = async (term = searchTerm, inactive = listarInativos) => {
        setLoading(true);
        try {
            const currentPage = safePageable.pageNumber ?? 0;

            if (isMobile && currentPage > 0) {
                const rebuilt = await rebuildLoadedMobilePages({
                    lastLoadedPage: currentPage,
                    fetchPage: (page) => fetchServicosPage(page, term, inactive)
                });

                setListPaginationServicos(rebuilt ?? createInitialPagination(resolvedPageSize));
                return;
            }

            const servicos = await fetchServicosPage(isMobile ? 0 : currentPage, term, inactive);
            setListPaginationServicos(servicos ?? createInitialPagination(resolvedPageSize));
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atencao:',
                detail: 'Falha ao atualizar Servicos',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteServico = async (id: number) => {
        await deletarServico(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleServicos(searchTerm, listarInativos);
    };

    const handleAtivarServico = async (id: number) => {
        await ativarServico(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleServicos(searchTerm, listarInativos);
    };

    const handleLoadMoreServicos = async () => {
        if (loading || loadingMore || !hasMoreMobileContent(listPaginationServicos)) {
            return;
        }

        setLoadingMore(true);
        try {
            await handleListServicos((safePageable.pageNumber ?? 0) + 1, searchTerm, listarInativos, true);
        } finally {
            setLoadingMore(false);
        }
    };

    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setService,
        field: 'descricao',
        onSearch: (value) => handleListServicos(0, value, listarInativos)
    });

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationServicos((prev) => ({
            ...(prev ?? createInitialPagination(resolvedPageSize)),
            pageable: {
                ...(prev?.pageable ?? createInitialPagination(resolvedPageSize).pageable),
                pageNumber: selectedPage
            }
        }));
        handleListServicos(selectedPage, searchTerm, listarInativos);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const handleSalvarFiltro = () => {
        handleListServicos(0, searchTerm, listarInativos);
    };

    const handleClearFilters = () => {
        setListarInativos(false);
        handleListServicos(0, ' ', false);
    };

    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };

    useEffect(() => {
        handleListServicos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="w-full">
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
                                    onApply={handleSalvarFiltro}
                                    onClear={handleClearFilters}
                                    buttonClassName="height-2-8rem-ml-1rem-mobile">
                                    <CheckBoxField
                                        inputId="listarInativos"
                                        label="Listar Desativadas"
                                        checked={listarInativos}
                                        onChange={handleCheckboxChange}
                                    />
                                </FilterOverlay>
                                {permissaoServico.create && (
                                    <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
                        <ListarServicos
                            loading={loading}
                            setLoading={setLoading}
                            searchTerm={searchTerm}
                            listarInativos={listarInativos}
                            listPaginationServicos={listPaginationServicos}
                            setListPaginationServicos={setListPaginationServicos}
                            deletar={handleDeleteServico}
                            ativar={handleAtivarServico}
                            mobileLoadMoreVisible={hasMoreMobileContent(listPaginationServicos)}
                            mobileLoadMoreLoading={loadingMore}
                            onMobileLoadMore={handleLoadMoreServicos}
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
                                {permissaoServico.create && (
                                    <div className="container-button-primary-novo">
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                )}
                            </div>
                            <div className="mt-3">
                                <ListarServicos
                                    loading={loading}
                                    setLoading={setLoading}
                                    searchTerm={searchTerm}
                                    listarInativos={listarInativos}
                                    listPaginationServicos={listPaginationServicos}
                                    setListPaginationServicos={setListPaginationServicos}
                                    deletar={handleDeleteServico}
                                    ativar={handleAtivarServico}
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

export default Servicos;

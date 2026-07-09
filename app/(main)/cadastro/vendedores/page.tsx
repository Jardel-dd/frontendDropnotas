'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/app/routes/permissoes';
import ListarVendedores from './tabela/vendedorListagem';
import Input from '@/app/shared/include/input/input-all';
import {  CheckboxChangeEvent } from 'primereact/checkbox';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { Messages } from '@/app/components/messages/GlobalMessages';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { activateVendedor, deletarVendedor, listVendedor } from './controller/controller';
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

const Vendedores: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const resolvedPageSize = isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : pageSize;
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const {permissaoVendedor} = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [vendedor, setVendedor] = useState<VendedorEntity>(
        new VendedorEntity({
            id: 0,
            razao_social: '',
            nome_fantasia: '',
            cpf: null,
            rg: null,
            email: '',
            documento_estrangeiro: null,
            cnpj: null,
            inscricao_estadual: '',
            inscricao_municipal: '',
            atividade_principal: '',
            codigo_regime_tributario: '',
            tipo_pessoa: 'PESSOA_JURIDICA',
            contribuinte: '',
            telefone: '',
            endereco: {} as EnderecoEntity,
            arquivo_contrato: '',
            id_vendedor_padrao: null,
            percentual_comissao: null,
            ativo: true,
            pais: ''
        })
    );
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [isVendedoresCreated, setIsVendedoresCreated] = useState(false);
    const [listPaginationVendedores, setListPaginationVendedores] = useState<Record<string, any>>(createInitialPagination(resolvedPageSize));
    const safePagination = listPaginationVendedores ?? createInitialPagination(resolvedPageSize);
    const safePageable = safePagination.pageable ?? createInitialPagination(resolvedPageSize).pageable;
    const handleNavigate = () => {
        router.push('/cadastro/vendedores/created');
        setIsVendedoresCreated(true);
    };

    const fetchVendedoresPage = async (
        pageNumber = 0,
        term = searchTerm,
        inactive = listarInativos
    ) => {
        const vendedores = await listVendedor(
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

        return vendedores ?? createInitialPagination(resolvedPageSize);
    };

    const handleListVendedores = async (
        pageNumber = 0,
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos,
        append = false
    ) => {
        if (!append) {
            setLoading(true);
        }

        try {
            const vendedores = await fetchVendedoresPage(pageNumber, currentSearchTerm, currentListarInativos);
            setListPaginationVendedores((current) => {
                if (isMobile && append) {
                    return mergePaginatedContent(current, vendedores, pageNumber) ?? createInitialPagination(resolvedPageSize);
                }

                return vendedores ?? createInitialPagination(resolvedPageSize);
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Falha Vendedor '
            });
        } finally {
            if (!append) {
                setLoading(false);
            }
        }
    };

    const refreshVisibleVendedores = async (
        currentSearchTerm = searchTerm,
        currentListarInativos = listarInativos
    ) => {
        setLoading(true);
        try {
            const currentPage = safePageable.pageNumber ?? 0;

            if (isMobile && currentPage > 0) {
                const rebuilt = await rebuildLoadedMobilePages({
                    lastLoadedPage: currentPage,
                    fetchPage: (page) => fetchVendedoresPage(page, currentSearchTerm, currentListarInativos)
                });

                setListPaginationVendedores(rebuilt ?? createInitialPagination(resolvedPageSize));
                return;
            }

            const vendedores = await fetchVendedoresPage(isMobile ? 0 : currentPage, currentSearchTerm, currentListarInativos);
            setListPaginationVendedores(vendedores ?? createInitialPagination(resolvedPageSize));
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Falha ao atualizar vendedores'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteVendedor = async (id: number) => {
        await deletarVendedor(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleVendedores(searchTerm, listarInativos);
    };

    const handleAtivarVendedor = async (id: number) => {
        await activateVendedor(id, msgs, safePagination, listarInativos, () => {}, searchTerm);
        await refreshVisibleVendedores(searchTerm, listarInativos);
    };

    const handleLoadMoreVendedores = async () => {
        if (loading || loadingMore || !hasMoreMobileContent(listPaginationVendedores)) {
            return;
        }

        setLoadingMore(true);
        try {
            await handleListVendedores((safePageable.pageNumber ?? 0) + 1, searchTerm, listarInativos, true);
        } finally {
            setLoadingMore(false);
        }
    };

    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setVendedor,
        field: 'razao_social',
        onSearch: (value) => handleListVendedores(0, value, listarInativos)
    });
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationVendedores((prev) => ({
            ...(prev ?? createInitialPagination(resolvedPageSize)),
            pageable: {
                ...(prev?.pageable ?? createInitialPagination(resolvedPageSize).pageable),
                pageNumber: selectedPage
            }
        }));
        handleListVendedores(selectedPage, searchTerm, listarInativos);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleClearFilters = () => {
        setListarInativos(false);
        handleListVendedores(0, '', false);
        setVisible(false);
    };
    const handleApplyFilters = () => {
        handleListVendedores(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    const handleSalvarFiltro = () => {
        handleListVendedores(0, searchTerm, listarInativos);
        setVisible(false);
    };
    useEffect(() => {
        handleListVendedores();
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
                                    label="Pesquisar Nome"
                                    outlined={true}
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    id="razao_social"
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
                                    {permissaoVendedor.create && (
                                    <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                    )}
                                    </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, flexDirection: 'column' }}>
                            <ListarVendedores
                                loading={loading}
                                listPaginationVendedores={listPaginationVendedores}
                                deletar={handleDeleteVendedor}
                                ativar={handleAtivarVendedor}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                listarInativos={listarInativos}
                                setListPaginationVendedores={setListPaginationVendedores}
                                mobileLoadMoreVisible={hasMoreMobileContent(listPaginationVendedores)}
                                mobileLoadMoreLoading={loadingMore}
                                onMobileLoadMore={handleLoadMoreVendedores}
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
                                            id="razao_social"
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
                                     {permissaoVendedor.create && (
                                    <div className="container-button-primary-novo">
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                     )}
                                </div>
                            </div>
                            <div>
                                <ListarVendedores
                                    loading={loading}
                                    listPaginationVendedores={listPaginationVendedores}
                                    deletar={handleDeleteVendedor}
                                    ativar={handleAtivarVendedor}
                                    setLoading={setLoading}
                                    searchTerm={searchTerm}
                                    listarInativos={listarInativos}
                                    setListPaginationVendedores={setListPaginationVendedores}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <CustomPaginator first={safePageable.pageNumber * safePageable.pageSize} rows={resolvedPageSize} totalRecords={safePagination.totalElements} onPageChange={onPageChange} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default Vendedores;


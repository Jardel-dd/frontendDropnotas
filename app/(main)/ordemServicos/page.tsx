'use client';
import dayjs from 'dayjs';
import './fotter.css';
import '@/app/styles/styledGlobal.css';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/app/routes/permissoes';
import Input from '@/app/shared/include/input/input-all';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { OrdemServicoParams } from './types/ordemServico';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import ListarOrdemServico from './tabela/ordemServicoListagem';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { Formas_recebimento } from '@/app/entity/FormaPagamento';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { DetalServiceOSEntity } from '@/app/entity/ServiceEntity';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import {
    MOBILE_LOAD_MORE_PAGE_SIZE,
    hasMoreMobileContent,
    mergePaginatedContent,
    rebuildLoadedMobilePages
} from '@/app/components/paginator/mobileLoadMore';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { mapDateRangeToParams } from '@/app/components/calendarComponent/controller';
import { DateRangePicker } from '@/app/components/calendarComponent/dataRangerPicker';
import { DropDownFilterOrdemOrdemServico } from '@/app/shared/optionsDropDown/options';
import { deletarOrdemServico, fetchOrdemServico, listOrdemServico, preparar } from './controller/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { DateRangeValue, todayRange } from '@/app/components/calendarComponent/types/types';
import { fetchFilteredPessoa, listThePessoas } from '../cadastro/pessoas/controller/controller';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { fetchFilteredEmpresa, listTheEmpresa } from '../configuracoes/empresas/controller/controller';

const buildEmptyOrdemServicoPagination = (pageSize: number, pageNumber = 0) => ({
    content: [],
    pageable: {
        pageNumber,
        pageSize,
        sort: {
            empty: true,
            sorted: false,
            unsorted: true
        },
        offset: pageNumber * pageSize,
        paged: true,
        unpaged: false
    },
    totalPages: 0,
    totalElements: 0,
    last: true,
    size: pageSize,
    number: pageNumber,
    sort: {
        empty: true,
        sorted: false,
        unsorted: true
    },
    numberOfElements: 0,
    first: pageNumber === 0,
    empty: true
});

const OrdemServicos: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const resolvedPageSize = isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : pageSize;
    const msgs = useRef<Messages | null>(null);
    const hasLoadedInitialList = useRef(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const { permissaoOrdemServico } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [emitirOS, setEmitirOS] = useState<ServiceOrderEntity>(
        new ServiceOrderEntity({
            id: 0,
            numero: 0,
            ativo: true,
            descricao: '',
            consideracoes_finais: '',
            data_hora_inicio: new Date(),
            data_hora_prevista: new Date(),
            data_hora_conclusao: new Date(),
            observacao_servico: '',
            observacao_interna: '',
            id_vendedor: 0,

            servicos: new DetalServiceOSEntity({
                id_servico: 0,
                descricao: '',
                descricao_completa: '',
                codigo: '',
                quantidade: 0,
                valor_servico: 0,
                valor_desconto: 0
            }),

            formas_recebimento: new Formas_recebimento({
                id_forma_recebimento: 0,
                valor_taxa: 0,
                valor_recebido: 0,
                percentual_taxa: 0
            }),

            id_cliente: 0,
            id_empresa: 0,
            id_forma_pagamento: 0,
            orcar: true
        })
    );
    const [relatorio, setRelatorio] = useState<any | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<DateRangeValue>(todayRange);
    const [selectedPessoa, setSelectedPessoa] = useState<PessoaEntity | null>(null);
    const [draftSelectedPessoa, setDraftSelectedPessoa] = useState<PessoaEntity | null>(null);
    const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity | null>(null);
    const [draftSelectedEmpresa, setDraftSelectedEmpresa] = useState<CompanyEntity | null>(null);
    const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
    const [selectedStatusOrdemServico, setSelectedStatusOrdemServico] = useState<string>('');
    const [draftSelectedStatusOrdemServico, setDraftSelectedStatusOrdemServico] = useState<string>('');
    const [listPaginationOrdemServico, setListPaginationOrdemServico] = useState<Record<string, any>>(
        () => buildEmptyOrdemServicoPagination(resolvedPageSize)
    );
    const safePagination =
        listPaginationOrdemServico ?? buildEmptyOrdemServicoPagination(resolvedPageSize);
    const safePageable =
        safePagination.pageable ?? buildEmptyOrdemServicoPagination(resolvedPageSize).pageable;
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setEmitirOS,
        field: 'descricao',
        onSearch: (value) => handleListOrdemServico(0, value, listarInativos)
    });
    const syncDraftFilters = () => {
        setDraftSelectedEmpresa(selectedEmpresa);
        setDraftSelectedPessoa(selectedPessoa);
        setDraftSelectedStatusOrdemServico(selectedStatusOrdemServico);
    };
    const handleDesktopDateRangeSearch = (inicio: Date, fim: Date) => {
        const nextDateRange: DateRangeValue = [dayjs(inicio), dayjs(fim)];
        setDateRange(nextDateRange);
        handleListOrdemServico(0, searchTerm, listarInativos, selectedStatusOrdemServico, nextDateRange);
    };
    const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
        let value = event.target.value;
        if (event.target.type === 'checkbox' || event.target.type === 'switch') {
            value = event.target.checked;
        } else if (event.target.type === 'number') {
            value = value === '' ? null : Number(value);
        }
        const _empresa = emitirOS!.copyWith({ [event.target.id]: value });
        setEmitirOS(_empresa);
    };
    const fetchOrdemServicoPage = useCallback(
        async (
            pageNumber = 0,
            term = searchTerm,
            inactive = listarInativos,
            status = selectedStatusOrdemServico,
            periodo = dateRange
        ) => {
            return (
                (await listOrdemServico(
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
                    status,
                    periodo,
                    msgs
                )) ?? buildEmptyOrdemServicoPagination(resolvedPageSize, pageNumber)
            );
        },
        [
            dateRange,
            listarInativos,
            resolvedPageSize,
            safePageable,
            safePagination,
            searchTerm,
            selectedStatusOrdemServico
        ]
    );
    const handleListOrdemServico = useCallback(
        async (
            pageNumber = 0,
            term = searchTerm,
            inactive = listarInativos,
            status = selectedStatusOrdemServico,
            periodo = dateRange,
            append = false
        ) => {
            if (!append) {
                setLoading(true);
            }

            try {
                const ordemServicos = await fetchOrdemServicoPage(
                    pageNumber,
                    term,
                    inactive,
                    status,
                    periodo
                );

                setListPaginationOrdemServico((current) => {
                    if (isMobile && append) {
                        return (
                            mergePaginatedContent(current, ordemServicos, pageNumber) ??
                            buildEmptyOrdemServicoPagination(resolvedPageSize, pageNumber)
                        );
                    }

                    return ordemServicos ?? buildEmptyOrdemServicoPagination(resolvedPageSize, pageNumber);
                });
            } finally {
                if (!append) {
                    setLoading(false);
                }
            }
        },
        [
            dateRange,
            fetchOrdemServicoPage,
            isMobile,
            listarInativos,
            resolvedPageSize,
            searchTerm,
            selectedStatusOrdemServico
        ]
    );
    const refreshVisibleOrdemServico = useCallback(
        async (
            term = searchTerm,
            inactive = listarInativos,
            status = selectedStatusOrdemServico,
            periodo = dateRange
        ) => {
            setLoading(true);
            try {
                const currentPage = safePageable.pageNumber ?? 0;

                if (isMobile && currentPage > 0) {
                    const rebuilt = await rebuildLoadedMobilePages({
                        lastLoadedPage: currentPage,
                        fetchPage: (page) =>
                            fetchOrdemServicoPage(page, term, inactive, status, periodo)
                    });

                    setListPaginationOrdemServico(
                        rebuilt ?? buildEmptyOrdemServicoPagination(resolvedPageSize)
                    );
                    return;
                }

                const ordemServicos = await fetchOrdemServicoPage(
                    isMobile ? 0 : currentPage,
                    term,
                    inactive,
                    status,
                    periodo
                );
                setListPaginationOrdemServico(
                    ordemServicos ?? buildEmptyOrdemServicoPagination(resolvedPageSize)
                );
            } finally {
                setLoading(false);
            }
        },
        [
            dateRange,
            fetchOrdemServicoPage,
            isMobile,
            listarInativos,
            resolvedPageSize,
            safePageable.pageNumber,
            searchTerm,
            selectedStatusOrdemServico
        ]
    );
    const handleDeleteOrdemServico = useCallback(
        async (rowData: ServiceOrderEntity) => {
            await deletarOrdemServico(
                rowData.id!,
                msgs,
                safePagination,
                () => {},
                searchTerm
            );
            await refreshVisibleOrdemServico(
                searchTerm,
                listarInativos,
                selectedStatusOrdemServico,
                dateRange
            );
        },
        [
            dateRange,
            listarInativos,
            refreshVisibleOrdemServico,
            safePagination,
            searchTerm,
            selectedStatusOrdemServico
        ]
    );
    const handleLoadMoreOrdemServico = async () => {
        if (loading || loadingMore || !hasMoreMobileContent(listPaginationOrdemServico)) {
            return;
        }

        setLoadingMore(true);
        try {
            await handleListOrdemServico(
                (safePageable.pageNumber ?? 0) + 1,
                searchTerm,
                listarInativos,
                selectedStatusOrdemServico,
                dateRange,
                true
            );
        } finally {
            setLoadingMore(false);
        }
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleCompanyChange = (empresa: CompanyEntity | null) => {
        setDraftSelectedEmpresa(empresa);
        if (empresa) {
            handleAllChanges({
                target: {
                    id: 'id_empresa',
                    value: empresa ? empresa.id : null,
                    type: 'input'
                }
            });
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedEmpresa;
            return newErrors;
        });
    };
    const handlePessoaChange = (pessoa: PessoaEntity | null) => {
        setDraftSelectedPessoa(pessoa);
        if (pessoa) {
            handleAllChanges({
                target: { id: 'id_pessoa', value: pessoa.id, type: 'input' }
            });
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedPessoa;
            return newErrors;
        });
    };
    const handleClearFilters = () => {
        setSelectedEmpresa(null);
        setDraftSelectedEmpresa(null);
        setSelectedPessoa(null);
        setDraftSelectedPessoa(null);
        setSelectedStatusOrdemServico('');
        setDraftSelectedStatusOrdemServico('');
        handleListOrdemServico(0, '', false, '', dateRange);
        search(null, null, '');
        setVisible(false);
    };
    const search = async (
        empresa: CompanyEntity | null = selectedEmpresa,
        pessoa: PessoaEntity | null = selectedPessoa,
        status: string = selectedStatusOrdemServico
    ) => {
        if (!dateRange) return;
        const [inicio, fim] = dateRange;
        if (!inicio || !fim) return;
        setLoading(true);
        try {
            const { data_hora_inicio, data_hora_fim } = mapDateRangeToParams([inicio, fim]);
            const params: OrdemServicoParams = {
                termo: searchTerm,
                idEmpresa: empresa?.id ?? null,
                idCliente: pessoa?.id ?? null,
                idVendedor: selectedVendedor?.id ?? null,
                status,
                data_hora_inicio,
                data_hora_fim
            };
            const resultado = await fetchOrdemServico(params, msgs);
            setRelatorio(resultado);
        } finally {
            setLoading(false);
        }
    };
    const handleApplyFilters = () => {
        setSelectedEmpresa(draftSelectedEmpresa);
        setSelectedPessoa(draftSelectedPessoa);
        setSelectedStatusOrdemServico(draftSelectedStatusOrdemServico);
        handleListOrdemServico(0, searchTerm, listarInativos, draftSelectedStatusOrdemServico, dateRange);
        search(draftSelectedEmpresa, draftSelectedPessoa, draftSelectedStatusOrdemServico);
        setVisible(false);
    };
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationOrdemServico((prev) => ({
            ...(prev ?? buildEmptyOrdemServicoPagination(resolvedPageSize)),
            pageable: {
                ...(prev?.pageable ?? buildEmptyOrdemServicoPagination(resolvedPageSize).pageable),
                pageNumber: selectedPage
            }
        }));
        handleListOrdemServico(selectedPage, searchTerm, listarInativos, selectedStatusOrdemServico, dateRange);
    };
    useEffect(() => {
        if (hasLoadedInitialList.current) return;
        hasLoadedInitialList.current = true;
        handleListOrdemServico(0, searchTerm, listarInativos, selectedStatusOrdemServico, dateRange);
    }, [dateRange, handleListOrdemServico, listarInativos, searchTerm, selectedStatusOrdemServico]);
    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />
            <div className="p-0">
                {isMobile && (
                    <>
                        <div className="card styled-container-main-all-routes">
                            <div style={{ padding: "8px" }}>
                                <div className="grid formgrid" style={{ maxHeight: '74px' }}>
                                    <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0 ">
                                        <Input
                                            label="Buscar"
                                            outlined={true}
                                            id="referencia"
                                            useRightButton={true}
                                            iconRight="pi pi-search"
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Ordem de Serviço:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="col-4 mb-0 lg:col-2 p-0 " >
                                        <div className="container-BTN-Filter-Created">
                                            <FilterOverlay
                                                onOpen={syncDraftFilters}
                                                onApply={handleApplyFilters}
                                                onClear={handleClearFilters}
                                                buttonClassName="height-2-8rem-ml-1rem-mobile">
                                                <div className="col-12 lg:col-12 ">
                                                    <DateRangePicker
                                                        showTopLabel
                                                        topLabel="Filtar por Data:"
                                                        onBuscar={(inicio: Date, fim: Date) => {
                                                            handleSearchChange;
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <DropdownSearch<CompanyEntity>
                                                        id="selectedEmpresa"
                                                        selectedItem={draftSelectedEmpresa}
                                                        onItemChange={handleCompanyChange}
                                                        fetchAllItems={listTheEmpresa}
                                                        fetchFilteredItems={fetchFilteredEmpresa}
                                                        optionLabel="razao_social"
                                                        placeholder="Selecione a Empresa"
                                                        topLabel="Empresa:"
                                                        showTopLabel
                                                        autoLoadAndSelectSingle={false}
                                                    />

                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <DropdownSearch<PessoaEntity>
                                                        id="selectedPessoa"
                                                        selectedItem={draftSelectedPessoa}
                                                        onItemChange={handlePessoaChange}
                                                        fetchAllItems={listThePessoas}
                                                        fetchFilteredItems={fetchFilteredPessoa}
                                                        optionLabel="razao_social"
                                                        placeholder="Selecione um cliente ou Fornecedor"
                                                        topLabel="Cliente ou fornecedor:"
                                                        showTopLabel
                                                        autoLoadAndSelectSingle={false}
                                                    />

                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <Dropdown
                                                        id="selectedstatusOrdemServico"
                                                        value={draftSelectedStatusOrdemServico}
                                                        options={DropDownFilterOrdemOrdemServico}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                        placeholder="Selecione"
                                                        onChange={(e) => setDraftSelectedStatusOrdemServico(e.value)}
                                                        className="custom-multiselect w-full"
                                                        label={''}
                                                        topLabel="Status:"
                                                        showTopLabel
                                                    />
                                                </div>
                                            </FilterOverlay>
                                            {permissaoOrdemServico.create && (
                                                <Button
                                                    label=""
                                                    className="ml-1rem"
                                                    icon="pi pi-plus"
                                                    onClick={async () => {
                                                        try {
                                                            const ordem = await preparar(msgs);
                                                            if (ordem?.numero != null) {
                                                                const queryParams = new URLSearchParams({
                                                                    numero: ordem.numero.toString()
                                                                });
                                                                router.push(`/ordemServicos/created?${queryParams.toString()}`);
                                                            }
                                                        } catch (error) { }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="mt-3"
                                style={{
                                    display: 'flex',
                                    flex: '1 1 auto',
                                    minHeight: 0,
                                    flexDirection: 'column'
                                }}
                            >
                                <ListarOrdemServico
                                    loading={loading}
                                    listPaginationOrdemServico={listPaginationOrdemServico}
                                    searchTerm={searchTerm}
                                    listarInativos={listarInativos}
                                    onDelete={handleDeleteOrdemServico}
                                    mobileLoadMoreVisible={hasMoreMobileContent(listPaginationOrdemServico)}
                                    mobileLoadMoreLoading={loadingMore}
                                    onMobileLoadMore={handleLoadMoreOrdemServico}
                                />
                            </div>
                        </div>
                    </>
                )}
                {isDesktop && (
                    <>
                        <div className="card styled-container-main-all-routes">
                            <div className="scrollable-container">
                                <div className="p-0">
                                    <div className="grid formgrid">
                                        <div className="col-12 lg:col-3 container-input-search-all">
                                            <Input
                                                label="Buscar"
                                                outlined={true}
                                                id="referencia"
                                                useRightButton={true}
                                                iconRight="pi pi-search"
                                                onChange={handleSearchChange}
                                                value={searchTerm}
                                                loading={loading}
                                                onClickSearch={() => searchNow(searchTerm)}
                                                topLabel="Ordem de Serviço:"
                                                showTopLabel
                                            />
                                        </div>
                                        <div>
                                            <DateRangePicker showTopLabel topLabel="Filtar por Data:" onBuscar={handleDesktopDateRangeSearch} />
                                        </div>
                                        <div className="Container-Btn-Filter-Desktop">
                                            <FilterOverlay
                                                onOpen={syncDraftFilters}
                                                onApply={handleApplyFilters}
                                                onClear={handleClearFilters}
                                                buttonClassName="Btn-Filter-Desktop">
                                                <div className="grid formgrid">
                                                    <div className="col-12 lg:col-12 ">
                                                        <DropdownSearch<CompanyEntity>
                                                            id="selectedEmpresa"
                                                            selectedItem={draftSelectedEmpresa}
                                                            onItemChange={handleCompanyChange}
                                                            fetchAllItems={listTheEmpresa}
                                                            fetchFilteredItems={fetchFilteredEmpresa}
                                                            optionLabel="razao_social"
                                                            placeholder="Selecione a Empresa"
                                                            topLabel="Empresa:"
                                                            showTopLabel
                                                            autoLoadAndSelectSingle={false}
                                                        />
                                                    </div>
                                                    <div className="col-12 lg:col-12 ">
                                                        <DropdownSearch<PessoaEntity>
                                                            id="selectedPessoa"
                                                            selectedItem={draftSelectedPessoa}
                                                            onItemChange={handlePessoaChange}
                                                            fetchAllItems={listThePessoas}
                                                            fetchFilteredItems={fetchFilteredPessoa}
                                                            optionLabel="razao_social"
                                                            placeholder="Selecione um cliente ou Fornecedor"
                                                            topLabel="Cliente ou fornecedor:"
                                                            showTopLabel
                                                            autoLoadAndSelectSingle={false}
                                                        />
                                                    </div>
                                                    <div className="col-12 lg:col-12 ">
                                                        <Dropdown
                                                            id="selectedstatusOrdemServico"
                                                            value={draftSelectedStatusOrdemServico}
                                                            options={DropDownFilterOrdemOrdemServico}
                                                            optionLabel="label"
                                                            optionValue="value"
                                                            placeholder="Selecione"
                                                            onChange={(e) => setDraftSelectedStatusOrdemServico(e.value)}
                                                            className="custom-multiselect w-full"
                                                            label={''}
                                                            topLabel="Status:"
                                                            showTopLabel
                                                        />
                                                    </div>
                                                </div>
                                            </FilterOverlay>
                                        </div>
                                        {permissaoOrdemServico.create && (
                                            <div className="container-button-primary-novo">
                                                <Button
                                                    label="Novo"
                                                    className="p-button-primary-novo"
                                                    icon="pi pi-plus"
                                                    onClick={async () => {
                                                        try {
                                                            const ordem = await preparar(msgs);
                                                            if (ordem?.numero != null) {
                                                                const queryParams = new URLSearchParams({
                                                                    numero: ordem.numero.toString()
                                                                });
                                                                router.push(`/ordemServicos/created?${queryParams.toString()}`);
                                                            }
                                                        } catch (error) { }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3">
                                        <ListarOrdemServico
                                            loading={loading}
                                            listPaginationOrdemServico={listPaginationOrdemServico}
                                            searchTerm={searchTerm}
                                            listarInativos={listarInativos}
                                            onDelete={handleDeleteOrdemServico}
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
        </div>
    );
};
export default OrdemServicos;


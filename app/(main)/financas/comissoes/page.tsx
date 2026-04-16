'use client';
import dayjs from 'dayjs';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { Checkbox } from 'primereact/checkbox';
import ListarComissoes from './tabela/comissoes';
import Input from '@/app/shared/include/input/input-all';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { ComissaoEntity } from '@/app/entity/comissoesEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { aprovarComissoes, listComissoes, ListComissoesFilters } from './controller/controller';
import { DropDownFilterTipoOrigem } from '@/app/shared/optionsDropDown/options';
import VendedorDropdownField from '../../cadastro/vendedores/dropDown/DropdownVendedor';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { DateRangePicker} from '@/app/components/calendarComponent/dataRangerPicker';
import { DateRangeValue } from '@/app/components/calendarComponent/types/types';

const Comissoes: React.FC = () => {
    const router = useRouter();
    const isMobile = useIsMobile();
    const pageSize = usePageSize();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const hasLoadedInitialList = useRef(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [selectedComissoes, setSelectedComissoes] = useState<ComissaoEntity[]>([]);
    const [comissoes, setComissoes] = useState<ComissaoEntity>(
        new ComissaoEntity({
            ativo: true,
            id: 0,
            id_comissao: 0,
            id_vendedor: 0,
            tipo_origem: "",
            id_origem: 0,
            valor_venda: null,
            percentual_comissao: null,
            valor_comissao: null,
            comissao_fechada: false,
            data_hora_venda: null,
            data_hora_fechamento: null
        })
    );
    const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
    const [selectedTipoOrigem, setSelectedTipoOrigem] = useState<string>('');
    const [filtrarComissaoFechada, setFiltrarComissaoFechada] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<DateRangeValue>([null, null]);
    const [dateRangePickerKey, setDateRangePickerKey] = useState(0);
    const [listPaginationComissoes, setListPaginationComissoes] = useState<Record<string, any>>({
        content: [],
        pageable: {
            pageNumber: 0,
            pageSize: pageSize,
            sort: {
                empty: true,
                unsorted: true,
                sorted: false
            }
        },
        totalPages: 0,
        totalElements: 0,
        last: false,
        size: 10,
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
    const selectedComissoesPendentes = selectedComissoes.filter((comissao) => !comissao.comissao_fechada);
    const buildDateRangeFilters = useCallback((periodo: DateRangeValue = dateRange): Pick<ListComissoesFilters, 'data_inicio' | 'data_fim'> => {
        const [inicio, fim] = periodo;

        if (!inicio || !fim) {
            return {
                data_inicio: null,
                data_fim: null
            };
        }

        return {
            data_inicio: inicio.startOf('day').format('YYYY-MM-DDTHH:mm:ss'),
            data_fim: fim.endOf('day').format('YYYY-MM-DDTHH:mm:ss')
        };
    }, [dateRange]);
    const buildCurrentFilters = useCallback((overrides: Partial<ListComissoesFilters> = {}, periodo: DateRangeValue = dateRange): ListComissoesFilters => ({
        id_vendedor: selectedVendedor?.id ?? null,
        tipo_origem: selectedTipoOrigem || null,
        comissao_fechada: filtrarComissaoFechada ? true : null,
        ...buildDateRangeFilters(periodo),
        ...overrides
    }), [buildDateRangeFilters, dateRange, filtrarComissaoFechada, selectedTipoOrigem, selectedVendedor]);

    const handleVendedorChange = (vendedorSelecionado: VendedorEntity | null) => {
        setSelectedVendedor(vendedorSelecionado);
    };
    const handleListComissoes = useCallback(async (
        pageNumber?: number,
        _searchTerm?: string,
        listarInativosParam = listarInativos,
        filters: ListComissoesFilters = buildCurrentFilters()
    ) => {
        setLoading(true);
        try {
            const comissoesResponse = await listComissoes(
                {
                    ...listPaginationComissoes,
                    pageable: {
                        ...listPaginationComissoes.pageable,
                        pageNumber: pageNumber ?? listPaginationComissoes.pageable.pageNumber,
                        pageSize: pageSize
                    }
                },
                listarInativosParam,
                setLoading,
                _searchTerm ?? searchTerm,
                filters
            );
            setListPaginationComissoes(comissoesResponse);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao buscar Comissões ',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    }, [buildCurrentFilters, listPaginationComissoes, listarInativos, pageSize, searchTerm]);
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setComissoes,
        field: 'valor_comissao',
        onSearch: (value) => handleListComissoes(0, value, listarInativos, buildCurrentFilters())
    });
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationComissoes((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListComissoes(selectedPage, searchTerm, listarInativos, buildCurrentFilters());
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleDateRangePeriodChange = (periodo: Date[] | null) => {
        if (!periodo?.length) {
            setDateRange([null, null]);
            return;
        }

        setDateRange([
            periodo[0] ? dayjs(periodo[0]) : null,
            periodo[1] ? dayjs(periodo[1]) : null
        ]);
    };
    const handleDateRangeFilter = (inicio: Date, fim: Date) => {
        const nextRange: DateRangeValue = [dayjs(inicio), dayjs(fim)];
        setDateRange(nextRange);
        handleListComissoes(0, searchTerm, listarInativos, buildCurrentFilters({}, nextRange));
    };
    const handleDateRangeClear = () => {
        const clearedRange: DateRangeValue = [null, null];
        setDateRange(clearedRange);
        handleListComissoes(0, searchTerm, listarInativos, buildCurrentFilters({}, clearedRange));
    };
    const handleClearFilters = () => {
        setListarInativos(false);
        setSelectedTipoOrigem('');
        setSelectedVendedor(null);
        setFiltrarComissaoFechada(false);
        setDateRange([null, null]);
        setDateRangePickerKey((prev) => prev + 1);
        handleListComissoes(0, searchTerm, false, {
            id_vendedor: null,
            tipo_origem: null,
            comissao_fechada: null,
            data_inicio: null,
            data_fim: null
        });
    };
    const handleApplyFilters = () => {
        const firstPage = 0;
        handleListComissoes(firstPage, searchTerm, listarInativos, buildCurrentFilters());
    };
    const handleAprovarComissoes = useCallback(async () => {
        if (selectedComissoesPendentes.length === 0) return;

        setLoading(true);
        try {
            await aprovarComissoes(selectedComissoesPendentes);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `${selectedComissoesPendentes.length} comiss${selectedComissoesPendentes.length > 1 ? 'ões aprovadas' : 'ão aprovada'} com sucesso.`,
                life: 3000
            });
            setSelectedComissoes([]);
            await handleListComissoes(
                listPaginationComissoes.pageable.pageNumber,
                searchTerm,
                listarInativos,
                buildCurrentFilters()
            );
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Não foi possível aprovar as comissões selecionadas.',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    }, [buildCurrentFilters, handleListComissoes, listPaginationComissoes, listarInativos, searchTerm, selectedComissoesPendentes]);
    useEffect(() => {
        if (hasLoadedInitialList.current) return;
        hasLoadedInitialList.current = true;
        handleListComissoes();
    }, [handleListComissoes]);
    return (
        <div className="w-full">
            <Toast ref={toast} />
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="grid formgrid p-2" >
                            <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
                                <Input
                                    label="Buscar"
                                    outlined={true}
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    id="descricao"
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    loading={loading}
                                    onClickSearch={() => searchNow(searchTerm)}
                                    topLabel="Descrição:"
                                    showTopLabel
                                />
                            </div>
                           <div className="col-4 mb-0 lg:col-3 lg:mb-0">
                                <div className="container-BTN-Filter-Created">
                                    <FilterOverlay
                                        onClear={handleClearFilters}
                                        onApply={handleApplyFilters}>
                                          <div className="col-12 lg:col-4 w-full p-0">
                                            <DateRangePicker
                                                key={`mobile-${dateRangePickerKey}`}
                                                showTopLabel
                                                topLabel="Filtrar por Data:"
                                                onBuscar={handleDateRangeFilter}
                                                onPeriodoChange={handleDateRangePeriodChange}
                                                onClear={handleDateRangeClear}
                                            />
                                        </div>
                                        <Dropdown
                                            id="selectedTipoOrigem"
                                            value={selectedTipoOrigem}
                                            options={DropDownFilterTipoOrigem}
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="Selecione"
                                            onChange={(e) => setSelectedTipoOrigem(e.value)}
                                            className="custom-multiselect w-full"
                                            label={''}
                                            topLabel="Origem:"
                                            showTopLabel
                                        />
                                        <VendedorDropdownField
                                            selectedVendedor={selectedVendedor}
                                            selectedVendedorId={selectedVendedor?.id ?? null}
                                            onVendedorChange={handleVendedorChange}
                                            onAddClick={() => router.push('/cadastro/vendedores/created')}
                                        />
                                        <div className="col-12 lg:col-12 mt-3 flex align-items-center gap-2">
                                            <Checkbox
                                                inputId="comissaoFechada"
                                                onChange={(e) => setFiltrarComissaoFechada(e.checked ?? false)}
                                                checked={filtrarComissaoFechada}
                                            />
                                            <label htmlFor="comissaoFechada">
                                                Comissao Fechada
                                            </label>
                                        </div>
                                    </FilterOverlay>
                                    <Button icon="pi pi-plus" className="ml-1rem" />
                                </div>
                            </div>
                        </div>
                        <div>
                            {selectedComissoesPendentes.length > 0 && (
                                <div className="flex justify-content-end mb-3">
                                    <Button
                                        icon="pi pi-check"
                                        label={`Aprovar ${selectedComissoesPendentes.length} comissão${selectedComissoesPendentes.length > 1 ? 'ões' : ''}`}
                                        onClick={handleAprovarComissoes}
                                        outlined
                                        severity="success"
                                    />
                                </div>
                            )}
                            <ListarComissoes
                                loading={loading}
                                searchTerm={searchTerm}
                                setLoading={setLoading}
                                listarInativos={listarInativos}
                                setListPaginationComissoes={setListPaginationComissoes}
                                listPaginationComissoes={listPaginationComissoes}
                                selectedComissoes={selectedComissoes}
                                setSelectedComissoes={setSelectedComissoes}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <CustomPaginator
                                    first={listPaginationComissoes.pageable.pageNumber * listPaginationComissoes.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationComissoes.totalElements}
                                    onPageChange={onPageChange}
                                    isMobile
                                />
                            </div>
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
                                            label="Buscar "
                                            outlined={true}
                                            id="descricao"
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Descrição:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div>
                                                <DateRangePicker
                                                    key={`desktop-${dateRangePickerKey}`}
                                                    showTopLabel
                                                    topLabel="Filtrar por Data:"
                                                    onBuscar={handleDateRangeFilter}
                                                    onPeriodoChange={handleDateRangePeriodChange}
                                                    onClear={handleDateRangeClear}
                                                />
                                            </div>
                                    <div className="Container-Btn-Filter-Desktop">
                                        <FilterOverlay
                                            onClear={handleClearFilters}
                                            onApply={handleApplyFilters}
                                            buttonClassName="ml-1rem"
                                            
                                        >
                                            <Dropdown
                                                id="selectedTipoOrigem"
                                                value={selectedTipoOrigem}
                                                options={DropDownFilterTipoOrigem}
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Selecione"
                                                onChange={(e) => setSelectedTipoOrigem(e.value)}
                                                className="custom-multiselect w-full"
                                                label={''}
                                                topLabel="Origem:"
                                                showTopLabel
                                            />
                                            <VendedorDropdownField
                                                selectedVendedor={selectedVendedor}
                                                selectedVendedorId={selectedVendedor?.id ?? null}
                                                onVendedorChange={handleVendedorChange}
                                                onAddClick={() => router.push('/cadastro/vendedores/created')}
                                            />
                                            <div className="col-12 lg:col-12  flex align-items-center gap-2">
                                                <Checkbox
                                                    inputId="comissaoFechada"
                                                    onChange={(e) => setFiltrarComissaoFechada(e.checked ?? false)}
                                                    checked={filtrarComissaoFechada}
                                                />
                                                <label htmlFor="comissaoFechada">
                                                    Listar Comissões Fechadas
                                                </label>
                                            </div>
                                        </FilterOverlay>
                                    </div>

                                </div>
                                <div >
                                    {selectedComissoesPendentes.length > 0 && (
                                        <div className="flex justify-content-end mb-3">
                                            <Button
                                                icon="pi pi-check"
                                                label={`Aprovar ${selectedComissoesPendentes.length} comissão${selectedComissoesPendentes.length > 1 ? 'ões' : ''}`}
                                                onClick={handleAprovarComissoes}
                                                outlined
                                                severity="success"
                                            />
                                        </div>
                                    )}
                                    <ListarComissoes
                                        loading={loading}
                                        searchTerm={searchTerm}
                                        setLoading={setLoading}
                                        listarInativos={listarInativos}
                                        setListPaginationComissoes={setListPaginationComissoes}
                                        listPaginationComissoes={listPaginationComissoes}
                                        selectedComissoes={selectedComissoes}
                                        setSelectedComissoes={setSelectedComissoes}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <CustomPaginator first={listPaginationComissoes.pageable.pageNumber * listPaginationComissoes.pageable.pageSize} rows={pageSize} totalRecords={listPaginationComissoes.totalElements} onPageChange={onPageChange} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Comissoes;

'use client';
import './fotter.css';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import Input from '@/app/shared/include/input/input-all';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { Formas_recebimento } from '@/app/entity/FormaPagamento';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DetalServiceOSEntity } from '@/app/entity/ServiceEntity';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';
import ListarOrdemServico from './listServiceNote/list-ordemService';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { mapDateRangeToParams } from '@/app/components/calendarComponent/controller';
import { DropDownFilterOrdemOrdemServico } from '@/app/shared/optionsDropDown/options';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { fetchFilteredCompany, listTheCompany } from '@/app/components/fetchAll/listAllCompany/controller';
import { fetchFilteredPessoas, listThePessoas } from '@/app/components/fetchAll/listAllPessoas/controller';
import { DateRangePicker, DateRangeValue, todayRange } from '@/app/components/calendarComponent/dataRangerPicker';
import { deletar, fetchOrdemServico, list, OrdemServicoParams, preparar } from './controller/controller';
const OrdemServicos: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
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
    const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity | null>(null);
    const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
    const [selectedStatusOrdemServico, setSelectedStatusOrdemServico] = useState<string>('');
    const [listPaginationOrdemServico, setListPaginationOrdemServico] = useState<Record<string, any>>({
        pageable: {
            pageNumber: 0,
            pageSize: 10,
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
        totalElements: 2,
        last: true,
        size: 20,
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
    const handleListOrdemServico = async (pageNumber?: number, _searchTerm?: string, listarInativos = false, status?: string, periodo?: DateRangeValue) => {
        setLoading(true);
        try {
            const periodoToSend = periodo ?? dateRange;
            const statusToSend = status ?? selectedStatusOrdemServico;
            const ordemServicos = await list(
                {
                    ...listPaginationOrdemServico,
                    pageable: {
                        ...listPaginationOrdemServico.pageable,
                        pageNumber: pageNumber ?? listPaginationOrdemServico.pageable.pageNumber,
                        pageSize: pageSize
                    }
                },
                listarInativos,
                setLoading,
                _searchTerm ?? searchTerm,
                statusToSend,
                periodoToSend
            );
            setListPaginationOrdemServico((prev) => ({
                ...prev,
                ...(ordemServicos ?? {})
            }));
        } finally {
            setLoading(false);
        }
    };
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationOrdemServico((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListOrdemServico(selectedPage, searchTerm, listarInativos, selectedStatusOrdemServico, dateRange);
    };
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setEmitirOS,
        field: 'descricao',
        onSearch: (value) => handleListOrdemServico(0, value, listarInativos)
    });
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleCompanyChange = (empresa: CompanyEntity | null) => {
        setSelectedEmpresa(empresa);
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
        setSelectedPessoa(pessoa);
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
        setSelectedPessoa(null);
        setSelectedStatusOrdemServico('');
        buscar();
        setVisible(false);
    };
    const buscar = async () => {
        if (!dateRange) return;
        const [inicio, fim] = dateRange;
        if (!inicio || !fim) return;
        setLoading(true);
        try {
            const { data_hora_inicio, data_hora_fim } = mapDateRangeToParams([inicio, fim]);
            const params: OrdemServicoParams = {
                termo: searchTerm,
                idEmpresa: selectedEmpresa?.id ?? null,
                idCliente: selectedPessoa?.id ?? null,
                idVendedor: selectedVendedor?.id ?? null,
                status: selectedStatusOrdemServico,
                data_hora_inicio,
                data_hora_fim
            };
            const resultado = await fetchOrdemServico(params);
            setRelatorio(resultado);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        buscar();
    }, [searchTerm, selectedEmpresa, selectedPessoa, selectedVendedor, selectedStatusOrdemServico, dateRange]);
    useEffect(() => {
        handleListOrdemServico(0, searchTerm, listarInativos, selectedStatusOrdemServico, dateRange);
    }, [dateRange]);
    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />
            <div className="p-0">
                {isMobile && (
                    <>
                        <div className="card styled-container-main-all-routes">
                            <div style={{padding:"8px"}}>
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
                                            onClickSearch={() => handleSearchChange({ target: { value: searchTerm } } as ChangeEvent<HTMLInputElement>)}
                                            topLabel="Ordem de Serviço:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="col-4 mb-0 lg:col-2 p-0 " style={{ marginTop: '3px' }}>
                                        <div className="container-BTN-Filter-Created">
                                            <FilterOverlay onApply={buscar} onClear={handleClearFilters} buttonClassName="height-2-8rem-ml-1rem">
                                                <div className="col-12 lg:col-12 w-full">
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
                                                        selectedItem={selectedEmpresa}
                                                        onItemChange={handleCompanyChange}
                                                        fetchAllItems={listTheCompany}
                                                        fetchFilteredItems={fetchFilteredCompany}
                                                        optionLabel="razao_social"
                                                        optionValue="id"
                                                        topLabel="Empresa:"
                                                        showTopLabel
                                                        placeholder="Selecione a Empresa"
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <DropdownSearch<PessoaEntity>
                                                        id="selectedPessoa"
                                                        selectedItem={selectedPessoa}
                                                        onItemChange={handlePessoaChange}
                                                        fetchAllItems={listThePessoas}
                                                        fetchFilteredItems={fetchFilteredPessoas}
                                                        optionLabel="razao_social"
                                                        optionValue="id"
                                                        topLabel="Cliente ou Fornecedor:"
                                                        showTopLabel
                                                        placeholder=" Selecione o Cliente ou Fornecedor"
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <Dropdown
                                                        id="selectedstatusOrdemServico"
                                                        value={selectedStatusOrdemServico}
                                                        options={DropDownFilterOrdemOrdemServico}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                        placeholder="Selecione"
                                                        onChange={(e) => setSelectedStatusOrdemServico(e.value)}
                                                        className="custom-multiselect w-full"
                                                        label={''}
                                                        topLabel="Status:"
                                                        showTopLabel
                                                    />
                                                </div>
                                            </FilterOverlay>
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
                                                    } catch (error) {}
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <ListarOrdemServico
                                    loading={loading}
                                    setLoading={setLoading}
                                    listPaginationOrdemServico={listPaginationOrdemServico}
                                    setListPaginationOrdemServico={setListPaginationOrdemServico}
                                    searchTerm={searchTerm}
                                    listarInativos={false}
                                    deletar={(id) => deletar(id, msgs, setLoading, searchTerm)}
                                />
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <div className="custom-paginator">
                                    <Paginator
                                        first={listPaginationOrdemServico.pageable.pageNumber * listPaginationOrdemServico.pageable.pageSize}
                                        rows={listPaginationOrdemServico.pageable.pageSize}
                                        totalRecords={listPaginationOrdemServico.totalElements}
                                        onPageChange={onPageChange}
                                        template={{
                                            layout: 'PrevPageLink CurrentPageReport NextPageLink',
                                            CurrentPageReport: (options) => {
                                                const pageNumber = Math.floor(options.first / options.rows) + 1;
                                                return (
                                                    <span>
                                                        Página {pageNumber} de {options.totalPages}
                                                    </span>
                                                );
                                            }
                                        }}
                                    />
                                </div>
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
                                                onClickSearch={() => handleSearchChange({ target: { value: searchTerm } } as ChangeEvent<HTMLInputElement>)}
                                                topLabel="Ordem de Serviço:"
                                                showTopLabel
                                            />
                                        </div>
                                        <div className="col-12 lg:col-2 p-0">
                                            <DateRangePicker showTopLabel topLabel="Filtar por Data:" onBuscar={buscar} />
                                        </div>
                                        <div className="Container-Btn-Filter-Desktop">
                                            <FilterOverlay onApply={buscar} onClear={handleClearFilters} buttonClassName="Btn-Filter-Desktop">
                                                <div className="col-12 lg:col-12 ">
                                                    <DropdownSearch<CompanyEntity>
                                                        id="selectedEmpresa"
                                                        selectedItem={selectedEmpresa}
                                                        onItemChange={handleCompanyChange}
                                                        fetchAllItems={listTheCompany}
                                                        fetchFilteredItems={fetchFilteredCompany}
                                                        optionLabel="razao_social"
                                                        optionValue="id"
                                                        topLabel="Empresa:"
                                                        showTopLabel
                                                        placeholder="Selecione a Empresa"
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <DropdownSearch<PessoaEntity>
                                                        id="selectedPessoa"
                                                        selectedItem={selectedPessoa}
                                                        onItemChange={handlePessoaChange}
                                                        fetchAllItems={listThePessoas}
                                                        fetchFilteredItems={fetchFilteredPessoas}
                                                        optionLabel="razao_social"
                                                        optionValue="id"
                                                        topLabel="Cliente ou Fornecedor:"
                                                        showTopLabel
                                                        placeholder=" Selecione o Cliente ou Fornecedor"
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <Dropdown
                                                        id="selectedstatusOrdemServico"
                                                        value={selectedStatusOrdemServico}
                                                        options={DropDownFilterOrdemOrdemServico}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                        placeholder="Selecione"
                                                        onChange={(e) => setSelectedStatusOrdemServico(e.value)}
                                                        className="custom-multiselect w-full"
                                                        label={''}
                                                        topLabel="Status:"
                                                        showTopLabel
                                                    />
                                                </div>
                                            </FilterOverlay>
                                        </div>
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
                                                    } catch (error) {}
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <ListarOrdemServico
                                            loading={loading}
                                            setLoading={setLoading}
                                            listPaginationOrdemServico={listPaginationOrdemServico}
                                            setListPaginationOrdemServico={setListPaginationOrdemServico}
                                            searchTerm={searchTerm}
                                            listarInativos={false}
                                            deletar={(id) => deletar(id, msgs, setLoading, searchTerm)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <Paginator
                                    first={listPaginationOrdemServico.pageable.pageNumber * listPaginationOrdemServico.pageable.pageSize}
                                    rows={listPaginationOrdemServico.pageable.pageSize}
                                    totalRecords={listPaginationOrdemServico.totalElements}
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

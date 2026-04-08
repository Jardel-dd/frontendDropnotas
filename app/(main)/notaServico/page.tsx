'use client';
import './styled.css';
import dayjs from 'dayjs';
import api from '@/app/services/api';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import Input from '@/app/shared/include/input/input-all';
import ListarNotaServico from './tabela/notaServicoListagem';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { NfsEntity, PrepararNfs } from '@/app/entity/NfsEntity';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { validateFieldsPrepararNfs } from './controller/validation';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { listNotaServico, NotaFiscalParams } from './controller/controller';
import { DetalTomadorEntity, PessoaEntity } from '@/app/entity/PessoaEntity';
import { DropDownFilterNotaServico } from '@/app/shared/optionsDropDown/options';
import { CompanyEntity, DetalPrestadorEntity } from '@/app/entity/CompanyEntity';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { mapDateRangeToParams } from '@/app/components/calendarComponent/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { DateRangePicker, DateRangeValue } from '@/app/components/calendarComponent/dataRangerPicker';
import { fetchFilteredCompany, listTheCompany } from '../configuracoes/empresas/controller/controller';
import { fetchFilteredPessoas, listThePessoas } from '@/app/(main)/cadastro/pessoas/controller/controller';
import { DetalPrestadorValoresEntity, DetalServiceEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import { fetchFilteredService, listTheService } from '@/app/(main)/cadastro/servicos/controller/controller';
import { fetchFilteredVendedor, listTheVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
import PessoaDropdownField from '../cadastro/pessoas/dropDown/pessoa';
import ServicoDropdownField from '../cadastro/servicos/dropdown/servico';
import EmpresaDropdownField from '../configuracoes/empresas/dropDown/empresa';

const NotaServico: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [reloadKeyPessoa, setReloadKeyPessoa] = useState(0);
    const [selectedNotas, setSelectedNotas] = useState<NfsEntity[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [dateRange, setDateRange] = useState<DateRangeValue>([null, null]);
    const [showDialogPreparaNfs, setShowDialogPreparaNfs] = useState(false);
    const [selectedPessoa, setSelectedPessoa] = useState<PessoaEntity | null>(null);
    const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity | null>(null);
    const [selectedPessoaDialog, setSelectedPessoaDialog] = useState<PessoaEntity | null>(null);
    const [selectedServicoDialog, setSelectedServicoDialog] = useState<ServiceEntity | null>(null);
    const [selectedEmpresaDialog, setSelectedEmpresaDialog] = useState<CompanyEntity | null>(null);
    const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
    const [selectedStatusNotaServico, setSelectedStatusNotaServico] = useState<string>('');
    const [stateDisableBtnPrepararNfse, setStateDisableBtnPrepararNfse] = useState(false);
    const [listPaginationNotaServico, setListPaginationNotaServico] = useState<Record<string, any>>({
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
        size: 10,
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
    const [loadingPrepararNfs, setLoadingPrepararNfs] = useState(false);
    const [prepararNfs, setPrepararNfs] = useState<PrepararNfs>(
        new PrepararNfs({
            id_cliente: 0,
            id_servico: 0,
            id_empresa: 0
        })
    );
    const [gerarNfse, setGerarNfse] = useState<NfsEntity>(
        new NfsEntity({
            referencia: '',
            competencia: '',
            razao_social_empresa: '',
            razao_social_cliente: '',
            total_valor_servico: '',
            regime_especial_tributacao: '',
            prestador: new DetalPrestadorEntity({
                cpf_cnpj: 0,
                inscricao_municipal: '',
                razao_social: '',
                nome_fantasia: '',
                telefone: 0,
                email: '',
                prestacao_sus: false,
                optante_simples_nacional: false,
                incentivo_fiscal: false,
                endereco: new EnderecoEntity({
                    cep: '',
                    logradouro: '',
                    complemento: '',
                    numero: '',
                    bairro: '',
                    municipio: '',
                    codigo_municipio: '',
                    codigo_pais: '',
                    nome_pais: '',
                    uf: '',
                    telefone: ''
                })
            }),
            servico: new DetalServiceEntity({
                id_servico: 0,
                descricao: '',
                codigo: '',
                codigo_municipio: '',
                valor_total: 0,
                valores: new DetalPrestadorValoresEntity({
                    base_calculo: 0,
                    valor_servico: 0,
                    aliquota_iss: 0,
                    aliquota_deducoes: 0,
                    aliquota_pis: 0,
                    aliquota_cofins: 0,
                    aliquota_inss: 0,
                    aliquota_ir: 0,
                    aliquota_csll: 0,
                    aliquota_outras_retencoes: 0,
                    percentual_desconto_incondicionado: 0,
                    percentual_desconto_condicionado: 0
                })
            }),
            tomador: new DetalTomadorEntity({
                cpf_cnpj: 0,
                razao_social: '',
                email: '',
                endereco: new EnderecoEntity({
                    cep: '',
                    logradouro: '',
                    complemento: '',
                    numero: '',
                    bairro: '',
                    municipio: '',
                    codigo_municipio: '',
                    codigo_pais: '',
                    nome_pais: '',
                    uf: '',
                    telefone: ''
                })
            })
        })
    );
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setGerarNfse,
        field: ['razao_social_cliente'],
        onSearch: (value) => handleListNotaServico(0, value)
    });
    const handleListNotaServico = async (pageNumber = 0, termo = searchTerm) => {
        setLoading(true);
        try {
            const data = await listNotaServico({
                page: pageNumber,
                size: pageSize,
                termo,
                status: selectedStatusNotaServico,
                dateRange,
                id_empresa: selectedEmpresa?.id,
                id_cliente: selectedPessoa?.id,
                id_vendedor: selectedVendedor?.id
            });

            setListPaginationNotaServico(data);
        } finally {
            setLoading(false);
        }
    };
    const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
        const value = event.target.type === 'checkbox' || event.target.type === 'switch' ? event.target.checked : event.target.value;
        const _prepararNfs = prepararNfs!.copyWith({
            ...prepararNfs,
            [event.target.id]: value
        });

        setPrepararNfs(_prepararNfs);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        handleListNotaServico(event.page);
    };
    const handleVendedorChange = (vendedor: VendedorEntity | null) => {
        if (!vendedor) return;
        setSelectedVendedor(vendedor);
    };
    const validatePrepararNfsDialog = (empresa = selectedEmpresaDialog, servico = selectedServicoDialog, cliente = selectedPessoaDialog) => validateFieldsPrepararNfs(prepararNfs, empresa, servico, cliente, setErrors, msgs);
    const handlePrepararNfsChange = (field: 'id_empresa' | 'id_cliente' | 'id_servico', value: number) => {
        setPrepararNfs((prev) =>
            prev.copyWith({
                [field]: value
            })
        );
    };
    const clearPreparaNfsDialog = () => {
        setSelectedEmpresaDialog(null);
        setSelectedPessoaDialog(null);
        setSelectedServicoDialog(null);
        setPrepararNfs(
            new PrepararNfs({
                id_cliente: 0,
                id_servico: 0,
                id_empresa: 0
            })
        );
        setErrors({});
    };
    const handleNavigate = () => {
        clearPreparaNfsDialog();
        setShowDialogPreparaNfs(true);
    };
    const handleEmitirNotas = async () => {
        if (selectedNotas.length === 0) return;
        const notaIds = selectedNotas.map((nota) => nota.id);
        console.log('IDs das notas selecionadas para emissão:', notaIds);
        try {
            const response = await api.post('/nfse/emitir-pendentes', { ids: notaIds });
            console.log('Notas enviadas com sucesso:', response);
            toast.current?.show({
                severity: 'success',
                summary: 'Sucesso',
                detail: `Foram enviadas ${notaIds.length} nota${notaIds.length > 1 ? 's' : ''} para emissão.`
            });
        } catch (error) {
            console.error('Erro ao emitir notas pendentes:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao emitir notas pendentes.'
            });
        }
    };
    const handleClearFilters = () => {
        setSelectedEmpresa(null);
        setSelectedPessoa(null);
        setVisible(false);
    };
    const handleEmpresaChange = (empresa: CompanyEntity | null) => {
        setSelectedEmpresa(empresa);
    };
    const handlePessoaChange = (pessoa: PessoaEntity | null) => {
        setSelectedPessoa(pessoa);
    };
    const handleEmpresaChangeDialog = (empresa: CompanyEntity | null) => {
        setSelectedEmpresaDialog(empresa);
        handlePrepararNfsChange('id_empresa', empresa?.id ?? 0);
    };
    const handleServicoChangeDialog = (servico: ServiceEntity | null) => {
        setSelectedServicoDialog(servico);
        handlePrepararNfsChange('id_servico', servico?.id ?? 0);
    };
    const handlePessoaChangeDialog = (pessoa: PessoaEntity | null) => {
        setSelectedPessoaDialog(pessoa);
        handlePrepararNfsChange('id_cliente', pessoa?.id ?? 0);
    };
    const buscar = async () => {
        setLoading(true);
        try {
            const params: NotaFiscalParams = {
                termo: searchTerm ?? null,
                id_empresa: selectedEmpresa?.id ?? null,
                id_cliente: selectedPessoa?.id ?? null,
                id_vendedor: selectedVendedor?.id ?? null,
                status: selectedStatusNotaServico ?? null,
                ...mapDateRangeToParams(dateRange)
            };
            const resultado = await listNotaServico({
                page: 0,
                size: pageSize,
                termo: searchTerm,
                status: selectedStatusNotaServico,
                dateRange,
                id_empresa: selectedEmpresa?.id,
                id_cliente: selectedPessoa?.id,
                id_vendedor: selectedVendedor?.id
            });
            setListPaginationNotaServico(resultado);
        } finally {
            setLoading(false);
        }
    };
    const handleConfirmPreparaNfs = async () => {
        const isValid = validatePrepararNfsDialog();
        if (!isValid) return;

        setLoadingPrepararNfs(true);

        try {
            const query = new URLSearchParams({
                id_empresa: String(selectedEmpresaDialog!.id),
                id_cliente: String(selectedPessoaDialog!.id),
                id_servico: String(selectedServicoDialog!.id)
            });

            setShowDialogPreparaNfs(false);
            router.push(`/notaServico/created?${query.toString()}`);
        } catch (error) {
            setLoadingPrepararNfs(false);
        }
    };
    useEffect(() => {
        if (!showDialogPreparaNfs) return;

        validatePrepararNfsDialog();
    }, [showDialogPreparaNfs, selectedEmpresaDialog, selectedPessoaDialog, selectedServicoDialog]);
    useEffect(() => {
        buscar();
    }, [selectedEmpresa, selectedPessoa, selectedVendedor, selectedStatusNotaServico, dateRange]);
    useEffect(() => {
        handleListNotaServico();
    }, []);
    if (loadingPrepararNfs) {
        return <LoadingScreen loadingText={'Preparando NFS-E...'} />;
    }
    const disableConfirmarPrepararNfs = stateDisableBtnPrepararNfse || Object.keys(errors).length > 0 || !selectedEmpresaDialog || !selectedPessoaDialog || !selectedServicoDialog;
    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />
            <div className="p-0">
                {isMobile && (
                    <>
                        <div className="card styled-container-main-all-routes">
                            <div style={{ marginTop: "8px", marginLeft: "8px" }}>
                                <div className="grid formgrid w-full" style={{ maxHeight: '74px' }}>
                                    <div className="col-8 mb-0 lg:col-8  ">
                                        <Input
                                            label="Buscar"
                                            outlined={true}
                                            id="razao_social_cliente"
                                            useRightButton={true}
                                            iconRight="pi pi-search"
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Buscar:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="col-4 mb-0 lg:col-3 ">
                                        <div className="nota-servico-mobile-buttons" style={{ position: "relative" }}>
                                            {selectedNotas.length > 0 && (
                                                <Button
                                                    icon="pi pi-send"
                                                     label={`Emitir selecionadas (${selectedNotas.length})`}
                                                    onClick={handleEmitirNotas}
                                                    outlined
                                                    severity='success'
                                                    style={{
                                                        position: "absolute",
                                                        top: "-10px",
                                                        width: "200px",
                                                        right: "0",
                                                        height: "28px", 
                                                        boxShadow:"none"
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="container-BTN-Filter-Created nota-servico-mobile-actions">
                                            <FilterOverlay
                                                onApply={buscar}
                                                onClear={handleClearFilters}
                                                buttonClassName="height-2-8rem-ml-1rem-mobile"
                                            >
                                                <div className="col-12 lg:col-12 ">
                                                    <DateRangePicker
                                                        showTopLabel
                                                        topLabel="Filtar por Data:"
                                                        onBuscar={(inicio: Date, fim: Date) => {
                                                            setDateRange([dayjs(inicio), dayjs(fim)]);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <EmpresaDropdownField
                                                        selectedCompany={selectedEmpresa}
                                                        onCompanyChange={handleEmpresaChange}
                                                        hasError={!!errors.selectedCompany}
                                                        errorMessage={errors.selectedCompany}
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <PessoaDropdownField selectedPessoa={selectedPessoa} onPessoaChange={handlePessoaChange} reloadKey={reloadKeyPessoa} hasError={!!errors.selectedPessoa} errorMessage={errors.selectedPessoa} />
                                                </div>
                                                <div className="col-12 lg:col-12">
                                                    <DropdownSearch<VendedorEntity>
                                                        id="selectedVendedor"
                                                        selectedItem={selectedVendedor}
                                                        onItemChange={handleVendedorChange}
                                                        fetchAllItems={listTheVendedor}
                                                        fetchFilteredItems={fetchFilteredVendedor}
                                                        optionLabel="razao_social"
                                                        placeholder="Selecione o Serviço"
                                                        hasError={!!errors.selectedVendedor}
                                                        errorMessage={errors.selectedVendedor}
                                                        topLabel="Vendedor:"
                                                        showTopLabel
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <Dropdown
                                                        id="selectedStatusNotaServico"
                                                        value={selectedStatusNotaServico}
                                                        options={DropDownFilterNotaServico}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                        placeholder="Selecione"
                                                        onChange={(e) => setSelectedStatusNotaServico(e.value)}
                                                        className="custom-multiselect w-full"
                                                        label={''}
                                                        topLabel="Status:"
                                                        showTopLabel
                                                    />
                                                </div>
                                            </FilterOverlay>
                                            <div className="nota-servico-mobile-buttons">

                                                <Button label="" icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <ListarNotaServico
                                    loading={loading}
                                    setLoading={setLoading}
                                    listPaginationNotaServico={listPaginationNotaServico}
                                    setListPaginationNotaServico={setListPaginationNotaServico}
                                    searchTerm={searchTerm}
                                    selectedNotas={selectedNotas}
                                    setSelectedNotas={setSelectedNotas}
                                    listarInativos={false}
                                />
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <div className="custom-paginator">
                                    <Paginator
                                        first={listPaginationNotaServico.pageable.pageNumber * listPaginationNotaServico.pageable.pageSize}
                                        rows={listPaginationNotaServico.pageable.pageSize}
                                        totalRecords={listPaginationNotaServico.totalElements}
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
                            <div style={{ padding: '0.5rem' }}>
                                <div className="grid formgrid">
                                    <div className="col-12 lg:col-3 container-input-search-all">
                                        <Input
                                            label="Buscar"
                                            outlined={true}
                                            id="razao_social_cliente"
                                            useRightButton={true}
                                            iconRight="pi pi-search"
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Buscar:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="col-12 lg:col-2 ">
                                        <DateRangePicker
                                            showTopLabel
                                            topLabel="Filtar por Data:"
                                            onBuscar={(inicio: Date, fim: Date) => {
                                                setDateRange([dayjs(inicio), dayjs(fim)]);
                                            }}
                                        />
                                    </div>
                                    <div className="Container-Btn-Filter-Desktop">
                                        <FilterOverlay onApply={buscar} onClear={handleClearFilters} buttonClassName="Btn-Filter-Desktop">
                                            <div className="col-12 lg:col-12 ">
                                                <EmpresaDropdownField
                                                    selectedCompany={selectedEmpresa}
                                                    onCompanyChange={handleEmpresaChange}
                                                    hasError={!!errors.selectedCompany}
                                                    errorMessage={errors.selectedCompany}
                                                    showAddButton
                                                    autoSelectSingle={true}
                                                />
                                            </div>
                                            <div className="col-12 lg:col-12 ">
                                                <PessoaDropdownField selectedPessoa={selectedPessoa} onPessoaChange={handlePessoaChange} reloadKey={reloadKeyPessoa} hasError={!!errors.selectedPessoa} errorMessage={errors.selectedPessoa} />
                                            </div>
                                            <div className="col-12 lg:col-12">
                                                <DropdownSearch<VendedorEntity>
                                                    id="selectedVendedor"
                                                    selectedItem={selectedVendedor}
                                                    onItemChange={handleVendedorChange}
                                                    fetchAllItems={listTheVendedor}
                                                    fetchFilteredItems={fetchFilteredVendedor}
                                                    optionLabel="razao_social"
                                                    placeholder="Selecione o Serviço"
                                                    hasError={!!errors.selectedVendedor}
                                                    errorMessage={errors.selectedVendedor}
                                                    topLabel="Vendedor:"
                                                    showTopLabel
                                                />
                                            </div>
                                            <div className="col-12 lg:col-12 ">
                                                <Dropdown
                                                    id="selectedStatusNotaServico"
                                                    value={selectedStatusNotaServico}
                                                    options={DropDownFilterNotaServico}
                                                    optionLabel="label"
                                                    optionValue="value"
                                                    placeholder="Selecione"
                                                    onChange={(e) => setSelectedStatusNotaServico(e.value)}
                                                    className="custom-multiselect w-full"
                                                    label={''}
                                                    topLabel="Status:"
                                                    showTopLabel
                                                />
                                            </div>
                                        </FilterOverlay>
                                    </div>
                                    <div className="container-button-primary-novo">
                                        <div className="p-2">{selectedNotas.length > 0 && <Button label={`Emitir ${selectedNotas.length} Nota${selectedNotas.length > 1 ? 's' : ''}`} icon="pi pi-send" onClick={handleEmitirNotas} outlined />}</div>
                                        <div>
                                            <Button label="Novo" icon="pi pi-plus" onClick={handleNavigate} className="p-button-primary-novo" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ListarNotaServico
                                    loading={loading}
                                    setLoading={setLoading}
                                    listPaginationNotaServico={listPaginationNotaServico}
                                    setListPaginationNotaServico={setListPaginationNotaServico}
                                    searchTerm={searchTerm}
                                    selectedNotas={selectedNotas}
                                    setSelectedNotas={setSelectedNotas}
                                    listarInativos={false}
                                />
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <Paginator
                                    first={listPaginationNotaServico.pageable.pageNumber * listPaginationNotaServico.pageable.pageSize}
                                    rows={listPaginationNotaServico.pageable.pageSize}
                                    totalRecords={listPaginationNotaServico.totalElements}
                                    onPageChange={onPageChange}
                                />
                            </div>
                        </div>
                        <Dialog
                            header="Preparar NFS-e"
                            visible={showDialogPreparaNfs}
                            style={{ width: '500px' }}
                            onHide={() => {
                                clearPreparaNfsDialog();
                                setShowDialogPreparaNfs(false);
                            }}
                            footer={
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0.5rem' }}>
                                    <Button label="Confirmar" style={{ boxShadow: 'none' }} disabled={disableConfirmarPrepararNfs} onClick={handleConfirmPreparaNfs} outlined />

                                    <Button
                                        label="Cancelar"
                                        onClick={() => {
                                            clearPreparaNfsDialog();
                                            setShowDialogPreparaNfs(false);
                                        }}
                                        outlined
                                        severity="secondary"
                                        style={{ boxShadow: 'none' }}
                                    />
                                </div>
                            }
                        >
                            <div className="col-12 lg:col-12 ">
                                <EmpresaDropdownField
                                    selectedCompany={selectedEmpresaDialog}
                                    onCompanyChange={handleEmpresaChangeDialog}
                                    hasError={!!errors.selectedEmpresa}
                                    errorMessage={errors.selectedEmpresa}
                                    showAddButton
                                    autoSelectSingle={true}
                                />
                            </div>
                            <div className="col-12 lg:col-12 ">
                                <PessoaDropdownField id="selectedCliente" selectedPessoa={selectedPessoaDialog} onPessoaChange={handlePessoaChangeDialog} hasError={!!errors.selectedCliente} errorMessage={errors.selectedCliente} />
                            </div>
                            <div className="col-12 lg:col-12">
                                <ServicoDropdownField
                                    id="selectedServico"
                                    selectedService={selectedServicoDialog}
                                    onServiceChange={handleServicoChangeDialog}
                                    placeholder="Selecione o serviço"
                                    topLabel="Serviço:"
                                    showTopLabel
                                    required
                                    hasError={!!errors.selectedServico}
                                    errorMessage={errors.selectedServico}
                                />
                            </div>
                        </Dialog>
                    </>
                )}
            </div>
        </div>
    );
};
export default NotaServico;

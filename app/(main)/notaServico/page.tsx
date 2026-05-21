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
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { NfsEntity, PrepararNfs } from '@/app/entity/NfsEntity';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { PessoaFormRef } from '../cadastro/pessoas/types/pessoa';
import { validateFieldsPrepararNfs } from './controller/validation';
import PessoaDropdownField from '../cadastro/pessoas/dropDown/pessoa';
import { FormCreatedPessoa } from '../cadastro/pessoas/form/controller';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import ServicoDropdownField from '../cadastro/servicos/dropdown/servico';
import { FormCreatedServico } from '../cadastro/servicos/form/controller';
import FormEmpresaCreated from '../configuracoes/empresas/form/controller';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { DetalTomadorEntity, PessoaEntity } from '@/app/entity/PessoaEntity';
import EmpresaDropdownField from '../configuracoes/empresas/dropDown/empresa';
import { DateRangeValue } from '@/app/components/calendarComponent/types/types';
import { DropDownFilterNotaServico } from '@/app/shared/optionsDropDown/options';
import { CompanyEntity, DetalPrestadorEntity } from '@/app/entity/CompanyEntity';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { exportarPdfNotasServico, listNotaServico } from './controller/controller';
import { mapDateRangeToParams } from '@/app/components/calendarComponent/controller';
import { DateRangePicker } from '@/app/components/calendarComponent/dataRangerPicker';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { createEmptyEmpresa, createEmptyServico } from '../ordemServicos/types/ordemServico';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';

import { DetalPrestadorValoresEntity, DetalServiceEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import { fetchFilteredVendedor, listTheVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
import { usePermissions } from '@/app/routes/permissoes';

const createEmptyPessoa = () =>
    new PessoaEntity({
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
        cnae_fiscal: null,
        data_fundacao: '',
        pessoa_cliente: false,
        pessoa_fornecedor: false,
        codigo_regime_tributario: '',
        tipo_pessoa: 'PESSOA_JURIDICA',
        contribuinte: '',
        endereco: {} as EnderecoEntity,
        arquivo_contrato: '',
        id_vendedor_padrao: null,
        ativo: true,
        pais: ''
    });

const NotaServico: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const {permissaoNfse} = usePermissions();
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<PessoaFormRef>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [reloadKeyPessoa, setReloadKeyPessoa] = useState(0);
    const [reloadKeyEmpresa, setReloadKeyEmpresa] = useState(0);
    const [reloadKeyServico, setReloadKeyServico] = useState(0);
    const [showModalPessoa, setShowModalPessoa] = useState(false);
    const [showModalEmpresa, setShowModalEmpresa] = useState(false);
    const [showModalServico, setShowModalServico] = useState(false);
    const [loadingExportPdf, setLoadingExportPdf] = useState(false);
    const [selectedNotas, setSelectedNotas] = useState<NfsEntity[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [pessoa, setPessoa] = useState<PessoaEntity>(createEmptyPessoa());
    const [showDialogPreparaNfs, setShowDialogPreparaNfs] = useState(false);
    const [dateRange, setDateRange] = useState<DateRangeValue>([null, null]);
    const [empresa, setEmpresa] = useState<CompanyEntity>(createEmptyEmpresa());
     const [servico, setServico] = useState<ServiceEntity>(createEmptyServico());
    const [selectedPessoa, setSelectedPessoa] = useState<PessoaEntity | null>(null);
    const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity | null>(null);
    const [selectedServico, setSelectedServico] = useState<ServiceEntity | null>(null);
    const [draftDateRange, setDraftDateRange] = useState<DateRangeValue>([null, null]);
    const [stateDisableBtnPrepararNfse, setStateDisableBtnPrepararNfse] = useState(false);
    const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
    const [selectedStatusNotaServico, setSelectedStatusNotaServico] = useState<string>('');
    const [draftSelectedPessoa, setDraftSelectedPessoa] = useState<PessoaEntity | null>(null);
    const [selectedPessoaDialog, setSelectedPessoaDialog] = useState<PessoaEntity | null>(null);
    const [draftSelectedEmpresa, setDraftSelectedEmpresa] = useState<CompanyEntity | null>(null);
    const [selectedEmpresaDialog, setSelectedEmpresaDialog] = useState<CompanyEntity | null>(null);
    const [selectedServicoDialog, setSelectedServicoDialog] = useState<ServiceEntity | null>(null);
    const [draftSelectedVendedor, setDraftSelectedVendedor] = useState<VendedorEntity | null>(null);
    const [draftSelectedStatusNotaServico, setDraftSelectedStatusNotaServico] = useState<string>('');
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
    const handleListNotaServico = async (
        pageNumber = 0,
        termo = searchTerm,
        filters?: {
            dateRange: DateRangeValue;
            selectedEmpresa: CompanyEntity | null;
            selectedPessoa: PessoaEntity | null;
            selectedVendedor: VendedorEntity | null;
            selectedStatusNotaServico: string;
        }
    ) => {
        setLoading(true);
        try {
            const appliedFilters = filters ?? {
                dateRange,
                selectedEmpresa,
                selectedPessoa,
                selectedVendedor,
                selectedStatusNotaServico
            };
            const data = await listNotaServico({
                page: pageNumber,
                size: pageSize,
                termo,
                status: appliedFilters.selectedStatusNotaServico,
                dateRange: appliedFilters.dateRange,
                id_empresa: appliedFilters.selectedEmpresa?.id,
                id_cliente: appliedFilters.selectedPessoa?.id,
                id_vendedor: appliedFilters.selectedVendedor?.id
            }, msgs);

            setListPaginationNotaServico(data);
        } finally {
            setLoading(false);
        }
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
        setDraftSelectedVendedor(vendedor);
    };
    const validatePrepararNfsDialog = (empresa = selectedEmpresaDialog, servico = selectedServicoDialog, cliente = selectedPessoaDialog) => 
    validateFieldsPrepararNfs(prepararNfs, empresa, servico, cliente, setErrors, msgs);
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
        const notaIds = selectedNotas
            .filter((nota) => nota.status_nota?.trim().toUpperCase() === 'PENDENTE')
            .map((nota) => nota.id);
        if (notaIds.length === 0) return;
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
    const handleSelectedNotasChange = (notas: NfsEntity[]) => {
        setSelectedNotas(
            notas.filter((nota) => nota.status_nota?.trim().toUpperCase() === 'PENDENTE')
        );
    };
    const getActiveFilters = () => ({
        dateRange,
        selectedEmpresa,
        selectedPessoa,
        selectedVendedor,
        selectedStatusNotaServico
    });
    const handleExportPdf = async () => {
        if (loadingExportPdf) return;
        const activeFilters = getActiveFilters();
        setLoadingExportPdf(true);
        try {
            const totalRegistros = Number(listPaginationNotaServico?.totalElements ?? 0);
            const response = await listNotaServico({
                page: 0,
                size: Math.max(totalRegistros, pageSize, 1),
                termo: searchTerm,
                status: activeFilters.selectedStatusNotaServico,
                dateRange: activeFilters.dateRange,
                id_empresa: activeFilters.selectedEmpresa?.id,
                id_cliente: activeFilters.selectedPessoa?.id,
                id_vendedor: activeFilters.selectedVendedor?.id
            }, msgs);

            const referencias = (response?.content ?? [])
                .map((nota: NfsEntity) => nota.referencia?.trim())
                .filter((referencia: string | undefined): referencia is string => Boolean(referencia));
          

            const dateParams = mapDateRangeToParams(activeFilters.dateRange);

            await exportarPdfNotasServico(
                {
                    data_hora_inicio: dateParams.data_hora_inicio ?? '',
                    data_hora_fim: dateParams.data_hora_fim ?? '',
                },
                msgs
            );
        } finally {
            setLoadingExportPdf(false);
        }
    };
    const handleClearFilters = () => {
        const clearedDateRange: DateRangeValue = [null, null];
        setSelectedEmpresa(null);
        setDraftSelectedEmpresa(null);
        setSelectedPessoa(null);
        setDraftSelectedPessoa(null);
        setSelectedVendedor(null);
        setDraftSelectedVendedor(null);
        setSelectedStatusNotaServico('');
        setDraftSelectedStatusNotaServico('');
        setDateRange(clearedDateRange);
        setDraftDateRange(clearedDateRange);
        handleListNotaServico(0, searchTerm, {
            dateRange: clearedDateRange,
            selectedEmpresa: null,
            selectedPessoa: null,
            selectedVendedor: null,
            selectedStatusNotaServico: ''
        });
        setVisible(false);
    };
    const syncDraftFilters = () => {
        setDraftDateRange(dateRange);
        setDraftSelectedEmpresa(selectedEmpresa);
        setDraftSelectedPessoa(selectedPessoa);
        setDraftSelectedVendedor(selectedVendedor);
        setDraftSelectedStatusNotaServico(selectedStatusNotaServico);
    };
    const handleEmpresaChange = (empresa: CompanyEntity | null) => {
        setDraftSelectedEmpresa(empresa);
    };
    const handlePessoaChange = (pessoa: PessoaEntity | null) => {
        setDraftSelectedPessoa(pessoa);
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
    const handlePessoaContrato = (updatedPessoa: PessoaEntity) => {
        setPessoa(updatedPessoa);
    };
    const handlePessoaSaved = (created: PessoaEntity) => {
        setShowModalPessoa(false);
        setSelectedPessoaDialog(created);
        handlePrepararNfsChange('id_cliente', created.id);
        setReloadKeyPessoa((current) => current + 1);
    };
    const search = async (filters?: {
        dateRange: DateRangeValue;
        selectedEmpresa: CompanyEntity | null;
        selectedPessoa: PessoaEntity | null;
        selectedVendedor: VendedorEntity | null;
        selectedStatusNotaServico: string;
    }) => {
        await handleListNotaServico(0, searchTerm, filters);
    };
    const handleApplyFilters = () => {
        const nextFilters = {
            dateRange: draftDateRange,
            selectedEmpresa: draftSelectedEmpresa,
            selectedPessoa: draftSelectedPessoa,
            selectedVendedor: draftSelectedVendedor,
            selectedStatusNotaServico: draftSelectedStatusNotaServico
        };
        setDateRange(draftDateRange);
        setSelectedEmpresa(draftSelectedEmpresa);
        setSelectedPessoa(draftSelectedPessoa);
        setSelectedVendedor(draftSelectedVendedor);
        setSelectedStatusNotaServico(draftSelectedStatusNotaServico);
        search(nextFilters);
        setVisible(false);
    };
    const handleDesktopDateRangeSearch = (inicio: Date, fim: Date) => {
        const nextDateRange: DateRangeValue = [dayjs(inicio), dayjs(fim)];
        const nextFilters = {
            dateRange: nextDateRange,
            selectedEmpresa,
            selectedPessoa,
            selectedVendedor,
            selectedStatusNotaServico
        };
        setDateRange(nextDateRange);
        setDraftDateRange(nextDateRange);
        search(nextFilters);
    };
    const handleDesktopDateRangeClear = () => {
        const clearedDateRange: DateRangeValue = [null, null];
        const nextFilters = {
            dateRange: clearedDateRange,
            selectedEmpresa,
            selectedPessoa,
            selectedVendedor,
            selectedStatusNotaServico
        };
        setDateRange(clearedDateRange);
        setDraftDateRange(clearedDateRange);
        search(nextFilters);
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
    const handleServico = (updatedServico: ServiceEntity) => {
            setServico(updatedServico);
    };
    const handleEmpresa = (updatedEmpresa: CompanyEntity) => {
            setEmpresa(updatedEmpresa);
    };
    const handleEmpresaSaved = (created: CompanyEntity) => {
            setShowModalEmpresa(false);
            setSelectedEmpresa(created);
            handlePrepararNfsChange('id_empresa', created.id);
            setReloadKeyEmpresa((current) => current + 1);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
            setErrors(updatedErrors);
    };
    const handleServiceSaved = (created: ServiceEntity) => {
            setShowModalServico(false);
            setSelectedServico(created);
            handlePrepararNfsChange('id_servico', created.id);
            setReloadKeyServico((current) => current + 1);
        };
    useEffect(() => {
        if (!showDialogPreparaNfs) return;

        validatePrepararNfsDialog();
    }, [showDialogPreparaNfs, selectedEmpresaDialog, selectedPessoaDialog, selectedServicoDialog]);
    useEffect(() => {
        handleListNotaServico();
    }, []);
    if (loadingPrepararNfs) {
        return <LoadingScreen loadingText={'Preparando NFS-E...'} />;
    }
    const disableConfirmarPrepararNfs = stateDisableBtnPrepararNfse || Object.keys(errors).length > 0 || !selectedEmpresaDialog || !selectedPessoaDialog || !selectedServicoDialog;
    return (
        <div className="w-full">
            <Toast ref={toast} />
            <Messages ref={msgs} className="custom-messages" />
            <div className="p-0">
                {isMobile && (
                    <>
                        <div className="card styled-container-main-all-routes">
                            <div style={{ marginTop: "8px", marginLeft: "8px" }}>
                                <div className="grid formgrid w-full" style={{ maxHeight: '74px' }}>
                                    <div className="col-8 mb-0 lg:col-8  ">
                                        <Input
                                            label="Digite o nome Cliente"
                                            outlined={true}
                                            id="razao_social_cliente"
                                            useRightButton={true}
                                            iconRight="pi pi-search"
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Pesquise:"
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
                                                onOpen={syncDraftFilters}
                                                onApply={handleApplyFilters}
                                                onClear={handleClearFilters}
                                                buttonClassName="height-2-8rem-ml-1rem-mobile"
                                            >
                                                <div className="col-12 lg:col-12 ">
                                                    <DateRangePicker
                                                        showTopLabel
                                                        topLabel="Filtar por Data:"
                                                        onClear={() => setDraftDateRange([null, null])}
                                                        onBuscar={(inicio: Date, fim: Date) => {
                                                            setDraftDateRange([dayjs(inicio), dayjs(fim)]);
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <EmpresaDropdownField
                                                        selectedEmpresa={draftSelectedEmpresa}
                                                        onEmpresaChange={handleEmpresaChange}
                                                        hasError={!!errors.selectedCompany}
                                                        errorMessage={errors.selectedCompany}
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <PessoaDropdownField 
                                                    selectedPessoa={draftSelectedPessoa} 
                                                    onPessoaChange={handlePessoaChange} 
                                                    reloadKey={reloadKeyPessoa} 
                                                    hasError={!!errors.selectedPessoa} 
                                                    errorMessage={errors.selectedPessoa} 
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12">
                                                    <DropdownSearch<VendedorEntity>
                                                        id="selectedVendedor"
                                                        selectedItem={draftSelectedVendedor}
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
                                                        value={draftSelectedStatusNotaServico}
                                                        options={DropDownFilterNotaServico}
                                                        optionLabel="label"
                                                        optionValue="value"
                                                        placeholder="Selecione"
                                                        onChange={(e) => setDraftSelectedStatusNotaServico(e.value)}
                                                        className="custom-multiselect w-full"
                                                        label={''}
                                                        topLabel="Status:"
                                                        showTopLabel
                                                    />
                                                </div>
                                            </FilterOverlay>
                                            <div className="nota-servico-mobile-buttons">
                                                <Button
                                                    label=""
                                                    icon="pi pi-file-pdf"
                                                    severity="secondary"
                                                    outlined
                                                    tooltip="Exportar PDF"
                                                    loading={loadingExportPdf}
                                                    disabled={loadingExportPdf}
                                                    className="ml-1rem"
                                                    onClick={handleExportPdf}
                                                />
                                                 {permissaoNfse.create && (
                                                <Button label="" icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                                 )}
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
                                    setSelectedNotas={handleSelectedNotasChange}
                                    listarInativos={false}
                                />
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <div className="custom-paginator">
                                    <CustomPaginator
                                        first={listPaginationNotaServico.pageable.pageNumber * listPaginationNotaServico.pageable.pageSize}
                                        rows={listPaginationNotaServico.pageable.pageSize}
                                        totalRecords={listPaginationNotaServico.totalElements}
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
                        <div className="card styled-container-main-all-routes">
                            <div style={{ padding: '0.5rem' }}>
                                <div className="grid formgrid">
                                    <div className="col-12 lg:col-3 container-input-search-all">
                                        <Input
                                            label="Digite nome do Cliente"
                                            outlined={true}
                                            id="razao_social_cliente"
                                            useRightButton={true}
                                            iconRight="pi pi-search"
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Pesquise:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div>
                                        <DateRangePicker
                                            showTopLabel
                                            topLabel="Filtar por Data:"
                                            onClear={handleDesktopDateRangeClear}
                                            onBuscar={(inicio: Date, fim: Date) => {
                                                handleDesktopDateRangeSearch(inicio, fim);
                                            }}
                                        />
                                    </div>
                                    <div className="Container-Btn-Filter-Desktop">
                                        <FilterOverlay onOpen={syncDraftFilters} onApply={handleApplyFilters} onClear={handleClearFilters} buttonClassName="Btn-Filter-Desktop">
                                            <div className="grid formgrid">
                                            <div className="col-12 lg:col-12 ">
                                                <EmpresaDropdownField
                                                    selectedEmpresa={draftSelectedEmpresa}
                                                    onEmpresaChange={handleEmpresaChange}
                                                    hasError={!!errors.selectedCompany}
                                                    errorMessage={errors.selectedCompany}
                                                />
                                            </div>
                                            <div className="col-12 lg:col-12 ">
                                                <PessoaDropdownField 
                                                selectedPessoa={draftSelectedPessoa}
                                                onPessoaChange={handlePessoaChange}
                                                reloadKey={reloadKeyPessoa} 
                                                hasError={!!errors.selectedPessoa}
                                                errorMessage={errors.selectedPessoa} />
                                            </div>
                                            <div className="col-12 lg:col-12">
                                                <DropdownSearch<VendedorEntity>
                                                    id="selectedVendedor"
                                                    selectedItem={draftSelectedVendedor}
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
                                                    value={draftSelectedStatusNotaServico}
                                                    options={DropDownFilterNotaServico}
                                                    optionLabel="label"
                                                    optionValue="value"
                                                    placeholder="Selecione"
                                                    onChange={(e) => setDraftSelectedStatusNotaServico(e.value)}
                                                    className="custom-multiselect w-full"
                                                    label={''}
                                                    topLabel="Status:"
                                                    showTopLabel
                                                />
                                            </div>
                                            </div>
                                        </FilterOverlay>
                                    </div>
                                    <div className="container-button-primary-novo">
                                        <div className="p-2">{selectedNotas.length > 0 && <Button label={`Emitir ${selectedNotas.length} Nota${selectedNotas.length > 1 ? 's' : ''}`} icon="pi pi-send" onClick={handleEmitirNotas} outlined />}</div>
                                        <div className="p-2">
                                            <Button
                                                icon="pi pi-file-pdf"
                                                severity="secondary"
                                                outlined
                                                tooltip="Exportar PDF"
                                                aria-label="Exportar PDF"
                                                loading={loadingExportPdf}
                                                disabled={loadingExportPdf}
                                                style={{ width: '2.8rem', height: '38px', boxShadow: 'none' }}
                                                onClick={handleExportPdf}
                                            />
                                        </div>
                                        {permissaoNfse.create && (
                                        <div>
                                            <Button label="Novo" icon="pi pi-plus" onClick={handleNavigate} className="p-button-primary-novo" />
                                        </div>
                                         )}
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
                                    setSelectedNotas={handleSelectedNotasChange}
                                    listarInativos={false}
                                />
                            </div>
                            <div style={{ marginTop: 'auto' }}>
                                <CustomPaginator
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
                            draggable={false}
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
                                    id="selectedEmpresa" 
                                    reloadKey={reloadKeyEmpresa}
                                    selectedEmpresa={selectedEmpresaDialog}
                                    onEmpresaChange={handleEmpresaChangeDialog}
                                    showAddButton
                                    onAddClick={() => setShowModalEmpresa(true)}
                                    hasError={!!errors.selectedEmpresa}
                                    errorMessage={errors.selectedEmpresa}
                                />
                            </div>
                            <div className="col-12 lg:col-12 ">
                                <PessoaDropdownField 
                                id="selectedCliente" 
                                reloadKey={reloadKeyPessoa}
                                selectedPessoa={selectedPessoaDialog} 
                                onPessoaChange={handlePessoaChangeDialog} 
                                showAddButton
                                onAddClick={() => setShowModalPessoa(true)}
                                hasError={!!errors.selectedCliente} 
                                errorMessage={errors.selectedCliente} 
                                />
                            </div>
                            <div className="col-12 lg:col-12">
                                <ServicoDropdownField
                                    id="selectedServico"
                                    reloadKey={reloadKeyServico}
                                    selectedService={selectedServicoDialog}
                                    onServiceChange={handleServicoChangeDialog}
                                    showAddButton
                                    onAddClick={() => setShowModalServico(true)}
                                    hasError={!!errors.selectedServico}
                                    errorMessage={errors.selectedServico}
                                />
                            </div>
                        </Dialog>
                        <DialogFilter header="Adicionar Empresa" visible={showModalEmpresa} onHide={() => setShowModalEmpresa(false)}>
                        <FormEmpresaCreated
                            msgs={msgs}
                            ref={formRef}
                            empresa={empresa}
                            initialId={null}
                            setEmpresa={setEmpresa}
                            onEmpresaChange={handleEmpresa}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            onSaved={handleEmpresaSaved}
                            onClose={() => setShowModalEmpresa(false)}
                            showBTNPGCreatedDialog
                            onBackClick={() => setShowModalEmpresa(false)}
                        />
                    </DialogFilter>
                        <DialogFilter header="Adicionar Cliente ou Fornecedor" visible={showModalPessoa} onHide={() => setShowModalPessoa(false)}>
                            <FormCreatedPessoa
                                msgs={msgs}
                                ref={formRef}
                                pessoa={pessoa}
                                initialId={null}
                                setPessoa={setPessoa}
                                onPessoaChange={handlePessoaContrato}
                                onErrorsChange={() => {}}
                                redirectAfterSave={false}
                                onSaved={handlePessoaSaved}
                                onClose={() => setShowModalPessoa(false)}
                                showBTNPGCreatedDialog
                                onBackClick={() => setShowModalPessoa(false)}
                            />
                        </DialogFilter>
                          <DialogFilter header="Adicionar Serviço" visible={showModalServico} onHide={() => setShowModalServico(false)}>
                        <FormCreatedServico
                            msgs={msgs}
                            ref={formRef}
                            servico={servico}
                            initialId={null}
                            setServico={setServico}
                            onServicoChange={handleServico}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            onSaved={handleServiceSaved}
                            onClose={() => setShowModalServico(false)}
                            showBTNPGCreatedDialog
                            onBackClick={() => setShowModalServico(false)}
                        />
                    </DialogFilter>
                    </>
                )}
            </div>
        </div>
    );
};
export default NotaServico;

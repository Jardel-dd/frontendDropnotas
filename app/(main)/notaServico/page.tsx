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
import { usePermissions } from '@/app/routes/permissoes';
import Input from '@/app/shared/include/input/input-all';
import ListarNotaServico from './tabela/notaServicoListagem';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { NfsEntity, PrepararNfs } from '@/app/entity/NfsEntity';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import type { ExportarPdfNfsePayload } from './types/notaServico';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { validateFieldsPrepararNfs } from './controller/validation';
import PessoaDropdownField from '../cadastro/pessoas/dropDown/pessoa';
import { FormCreatedPessoa } from '../cadastro/pessoas/form/controller';
import MobileSearchPicker from '@/app/shared/mobile/MobileSearchPicker';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import ServicoDropdownField from '../cadastro/servicos/dropdown/servico';
import { FormCreatedServico } from '../cadastro/servicos/form/controller';
import FormEmpresaCreated from '../configuracoes/empresas/form/controller';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import EmpresaDropdownField from '../configuracoes/empresas/dropDown/empresa';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { PreloadedServicoData } from '../cadastro/servicos/types/servico';
import { DateRangeValue } from '@/app/components/calendarComponent/types/types';
import { DropDownFilterNotaServico } from '@/app/shared/optionsDropDown/options';
import { CompanyEntity, DetalPrestadorEntity } from '@/app/entity/CompanyEntity';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { buildMobilePickerPageResult } from '@/app/shared/PageMobile/pageMobile';
import type { PreloadedEmpresaData } from '../configuracoes/empresas/types/empresa';
import { mapDateRangeToParams } from '@/app/components/calendarComponent/controller';
import { DateRangePicker } from '@/app/components/calendarComponent/dataRangerPicker';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import type { PessoaFormRef, PreloadedPessoaData } from '../cadastro/pessoas/types/pessoa';
import { ContatoEntity, DetalTomadorEntity, PessoaEntity } from '@/app/entity/PessoaEntity';
import { createEmptyEmpresa, createEmptyServico } from '../ordemServicos/types/ordemServico';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { DetalPrestadorValoresEntity, DetalServiceEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import { downloadPdfButton, downloadXmlButton } from '@/app/components/dataTableComponent/dataTableSelectAll';
import { fetchFilteredVendedor, listTheVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
import { consumeNotaServicoFeedback, downloadArquivosNota, exportarPdfNotasServico, listNotaServico } from './controller/controller';
import { MOBILE_LOAD_MORE_PAGE_SIZE, hasMoreMobileContent, mergePaginatedContent } from '@/app/components/paginator/mobileLoadMore';
import { buildEmptyNotaServicoPagination, createEmptyPessoa, formatAuthorizedNotaDateTime, formatAuthorizedNotaValue } from './types/notaServico';
import { fetchFilteredPessoa, fetchPessoaMobilePage, fetchPessoasById, listThePessoas } from '@/app/(main)/cadastro/pessoas/controller/controller';
import { fetchFilteredService, fetchServiceFormDataByID, fetchServicesByID, listTheService } from '@/app/(main)/cadastro/servicos/controller/controller';
import { fetchCompanyDropdownByID, fetchCompanyFormDataByID, fetchFilteredEmpresa, listTheEmpresa } from '@/app/(main)/configuracoes/empresas/controller/controller';


const getAuthorizedNotaEmail = (nota: Partial<NfsEntity> | null) =>
    nota?.tomador?.contato?.email ||
    (nota?.tomador as any)?.email ||
    (nota as any)?.cliente?.email ||
    '-';
const NOTA_SERVICO_MOBILE_CARD_FALLBACK_HEIGHT = 224;
const NOTA_SERVICO_MOBILE_CARD_GAP = 12;

const NotaServico: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const { permissaoNfse } = usePermissions();
    const canSearchNotaServico = permissaoNfse.search;
    const canCreateNotaServico = permissaoNfse.create;
    const canUpdateNotaServico = permissaoNfse.update;
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<PessoaFormRef>(null);
    const mobileListWrapperRef = useRef<HTMLDivElement | null>(null);
    const hasLoadedNotaServicoRef = useRef(false);
    const searchTermRef = useRef('');
    const activeFiltersRef = useRef<{
        dateRange: DateRangeValue;
        selectedEmpresa: CompanyEntity | null;
        selectedPessoa: PessoaEntity | null;
        selectedVendedor: VendedorEntity | null;
        selectedStatusNotaServico: string;
    }>({
        dateRange: [null, null],
        selectedEmpresa: null,
        selectedPessoa: null,
        selectedVendedor: null,
        selectedStatusNotaServico: ''
    });
    const [loading, setLoading] = useState(true);
    const [mobilePageSize, setMobilePageSize] = useState(() => Math.max(pageSize, 1));
    const [mobilePageSizeReady, setMobilePageSizeReady] = useState(() => !isMobile);
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [reloadKeyPessoa, setReloadKeyPessoa] = useState(0);
    const [reloadKeyEmpresa, setReloadKeyEmpresa] = useState(0);
    const [reloadKeyServico, setReloadKeyServico] = useState(0);
    const [empresaDialogKey, setEmpresaDialogKey] = useState(0);
    const [pessoaDialogKey, setPessoaDialogKey] = useState(0);
    const [servicoDialogKey, setServicoDialogKey] = useState(0);
    const [showModalPessoa, setShowModalPessoa] = useState(false);
    const [showModalEmpresa, setShowModalEmpresa] = useState(false);
    const [showModalServico, setShowModalServico] = useState(false);
    const [isPessoaDialogLoading, setIsPessoaDialogLoading] = useState(false);
    const [isEmpresaDialogLoading, setIsEmpresaDialogLoading] = useState(false);
    const [isServicoDialogLoading, setIsServicoDialogLoading] = useState(false);
    const [loadingExportPdf, setLoadingExportPdf] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedNotas, setSelectedNotas] = useState<NfsEntity[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showExportPdfDialog, setShowExportPdfDialog] = useState(false);
    const [showAuthorizedNotaDialog, setShowAuthorizedNotaDialog] = useState(false);
    const [authorizedNota, setAuthorizedNota] = useState<Partial<NfsEntity> | null>(null);
    const [pessoa, setPessoa] = useState<PessoaEntity>(createEmptyPessoa());
    const [showDialogPreparaNfs, setShowDialogPreparaNfs] = useState(false);
    const [isMobileKeyboardOpen, setIsMobileKeyboardOpen] = useState(false);
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
    const [preloadedPessoa, setPreloadedPessoa] = useState<PreloadedPessoaData | null>(null);
    const [editingPessoaId, setEditingPessoaId] = useState<string | null>(null);
    const [draftSelectedEmpresa, setDraftSelectedEmpresa] = useState<CompanyEntity | null>(null);
    const [selectedEmpresaDialog, setSelectedEmpresaDialog] = useState<CompanyEntity | null>(null);
    const [preloadedEmpresa, setPreloadedEmpresa] = useState<PreloadedEmpresaData | null>(null);
    const [editingEmpresaId, setEditingEmpresaId] = useState<string | null>(null);
    const [selectedServicoDialog, setSelectedServicoDialog] = useState<ServiceEntity | null>(null);
    const [preloadedServico, setPreloadedServico] = useState<PreloadedServicoData | null>(null);
    const [editingServicoId, setEditingServicoId] = useState<string | null>(null);
    const [draftSelectedVendedor, setDraftSelectedVendedor] = useState<VendedorEntity | null>(null);
    const [draftSelectedStatusNotaServico, setDraftSelectedStatusNotaServico] = useState<string>('');
    const [listPaginationNotaServico, setListPaginationNotaServico] = useState<Record<string, any>>(() =>
        buildEmptyNotaServicoPagination(isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : Math.max(pageSize, 1))
    );
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
                contato: new ContatoEntity({
                    email: ''
                }),
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
    const resolvedPageSize = isMobile ? MOBILE_LOAD_MORE_PAGE_SIZE : pageSize;
    const safeNotaPagination = listPaginationNotaServico ?? buildEmptyNotaServicoPagination(resolvedPageSize);
    const safeNotaPageable = safeNotaPagination.pageable ?? buildEmptyNotaServicoPagination(resolvedPageSize).pageable;
    const clearNotaServicoResults = useCallback((pageNumber = 0) => {
        setSelectedNotas([]);
        setListPaginationNotaServico(buildEmptyNotaServicoPagination(resolvedPageSize, pageNumber));
    }, [resolvedPageSize]);
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setGerarNfse,
        field: ['razao_social_cliente'],
        onSearch: (value) => handleListNotaServico(0, value, ),
    });
    const getActiveFilters = useCallback(() => ({
        dateRange,
        selectedEmpresa,
        selectedPessoa,
        selectedVendedor,
        selectedStatusNotaServico
    }), [dateRange, selectedEmpresa, selectedPessoa, selectedVendedor, selectedStatusNotaServico]);
    const fetchNotaServicoPage = useCallback(async (
        pageNumber = 0,
        termo = searchTermRef.current,
        filters = activeFiltersRef.current
    ) => {
        if (!canSearchNotaServico) {
            return buildEmptyNotaServicoPagination(resolvedPageSize, pageNumber);
        }

        return await listNotaServico(
            {
                page: pageNumber,
                size: resolvedPageSize,
                termo,
                status: filters.selectedStatusNotaServico,
                dateRange: filters.dateRange,
                id_empresa: filters.selectedEmpresa?.id,
                id_cliente: filters.selectedPessoa?.id,
                id_vendedor: filters.selectedVendedor?.id
            },
            msgs
        );
    }, [canSearchNotaServico, resolvedPageSize]);
    const handleListNotaServico = useCallback(async (
        pageNumber = 0,
        termo = searchTermRef.current,
        filters = activeFiltersRef.current,
        append = false
    ) => {
        if (!canSearchNotaServico) {
            clearNotaServicoResults(pageNumber);
            setLoading(false);
            return;
        }

        if (!append) {
            setLoading(true);
        }

        try {
            const data = await fetchNotaServicoPage(pageNumber, termo, filters);

            setListPaginationNotaServico((current) => {
                if (isMobile && append) {
                    return mergePaginatedContent(current, data, pageNumber) ?? buildEmptyNotaServicoPagination(resolvedPageSize, pageNumber);
                }

                return data ?? buildEmptyNotaServicoPagination(resolvedPageSize, pageNumber);
            });
        } finally {
            if (!append) {
                setLoading(false);
            }
        }
    }, [canSearchNotaServico, clearNotaServicoResults, fetchNotaServicoPage, isMobile, resolvedPageSize]);
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!canSearchNotaServico) {
            return;
        }

        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        if (!canSearchNotaServico) {
            return;
        }

        handleListNotaServico(event.page);
    };
    const handleLoadMoreNotaServico = async () => {
        if (loading || loadingMore || !hasMoreMobileContent(listPaginationNotaServico)) {
            return;
        }

        setLoadingMore(true);
        try {
            await handleListNotaServico(
                (safeNotaPageable.pageNumber ?? 0) + 1,
                searchTerm,
                getActiveFilters(),
                true
            );
        } finally {
            setLoadingMore(false);
        }
    };
    const handleVendedorChange = (vendedor: VendedorEntity | null) => {
        setDraftSelectedVendedor(vendedor);
    };
    const validatePrepararNfsDialog = (empresa = selectedEmpresaDialog, servico = selectedServicoDialog, cliente = selectedPessoaDialog) => validateFieldsPrepararNfs(prepararNfs, empresa, servico, cliente, setErrors, msgs);
    const handlePrepararNfsChange = (field: 'id_empresa' | 'id_cliente' | 'id_servico', value: number) => {
        setPrepararNfs((prev) =>
            prev.copyWith({
                [field]: value
            })
        );
    };
    const fetchEmpresaMobilePage = useCallback(async ({ searchTerm: termo, page, size }: { searchTerm: string; page: number; size: number }) => {
        const response = await api.get('/empresa', {
            params: {
                page,
                size,
                termo: termo || undefined
            }
        });

        return buildMobilePickerPageResult<CompanyEntity>(response.data);
    }, []);
 
    const fetchServicoMobilePage = useCallback(async ({ searchTerm: termo, page, size }: { searchTerm: string; page: number; size: number }) => {
        const response = await api.get('/servico', {
            params: {
                page,
                size,
                termo: termo || undefined
            }
        });

        return buildMobilePickerPageResult<ServiceEntity>(response.data);
    }, []);
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
    const handleClosePreparaNfsDialog = () => {
        setShowDialogPreparaNfs(false);
        setIsMobileKeyboardOpen(false);
    };
    const handleNavigate = () => {
        if (!canCreateNotaServico) {
            return;
        }

        clearPreparaNfsDialog();
        setShowDialogPreparaNfs(true);
    };
    const handleEmitirNotas = async () => {
        if (!canUpdateNotaServico || selectedNotas.length === 0) return;
        const notaReferencias = selectedNotas
            .filter((nota) => nota.status_nota?.trim().toUpperCase() === 'PENDENTE')
            .map((nota) => nota.referencia?.trim())
            .filter((referencia): referencia is string => Boolean(referencia));
        if (notaReferencias.length === 0) return;
        console.log('Referências das notas selecionadas para emissão:', notaReferencias);
        try {
            const response = await api.post('/nfse/emitir-lote', { referencias: notaReferencias });
            console.log('Notas enviadas com sucesso:', response);
            msgs.current?.show({
                severity: 'success',
                summary: 'Sucesso:',
                detail: `Foram enviadas ${notaReferencias.length} nota${notaReferencias.length > 1 ? 's' : ''} para emissão.`
            });
        } catch (error) {
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Falha ao emitir notas pendentes.'
            });
        }
    };
    const handleSelectedNotasChange = (notas: NfsEntity[]) => {
        if (!canUpdateNotaServico) {
            setSelectedNotas([]);
            return;
        }

        setSelectedNotas(notas.filter((nota) => nota.status_nota?.trim().toUpperCase() === 'PENDENTE'));
    };
    const formatExportDate = (value: unknown) => {
        if (!value) {
            return '-';
        }
        const parsedDate = dayjs(value as dayjs.ConfigType);
        return parsedDate.isValid() ? parsedDate.format('DD/MM/YYYY') : '-';
    };
    const handleOpenExportPdfDialog = () => {
        if (!canSearchNotaServico || loadingExportPdf) return;
        setShowExportPdfDialog(true);
    };
    const handleCloseExportPdfDialog = () => {
        if (loadingExportPdf) return;
        setShowExportPdfDialog(false);
    };
    const handleConfirmExportPdf = async () => {
        if (!canSearchNotaServico || loadingExportPdf) return;
        const activeFilters = getActiveFilters();
        setLoadingExportPdf(true);
        try {
            const totalRegistros = Number(listPaginationNotaServico?.totalElements ?? 0);
            const response = await listNotaServico(
                {
                    page: 0,
                    size: Math.max(totalRegistros, resolvedPageSize, 1),
                    termo: searchTerm,
                    status: activeFilters.selectedStatusNotaServico,
                    dateRange: activeFilters.dateRange,
                    id_empresa: activeFilters.selectedEmpresa?.id,
                    id_cliente: activeFilters.selectedPessoa?.id,
                    id_vendedor: activeFilters.selectedVendedor?.id
                },
                msgs
            );
            const referencias = (response?.content ?? []).map((nota: NfsEntity) => nota.referencia?.trim()).filter((referencia: string | undefined): referencia is string => Boolean(referencia));
            const dateParams = mapDateRangeToParams(activeFilters.dateRange);
            const exportPayload: ExportarPdfNfsePayload = {};

            if (dateParams.data_hora_inicio && dateParams.data_hora_fim) {
                exportPayload.data_hora_inicio = dateParams.data_hora_inicio;
                exportPayload.data_hora_fim = dateParams.data_hora_fim;
            }

            if (referencias.length > 0) {
                exportPayload.referencias = referencias;
            }

            if (activeFilters.selectedStatusNotaServico) {
                exportPayload.status = [activeFilters.selectedStatusNotaServico];
            }

            if (activeFilters.selectedEmpresa?.id) {
                exportPayload.id_empresa = activeFilters.selectedEmpresa.id;
            }

            if (activeFilters.selectedPessoa?.id) {
                exportPayload.id_cliente = activeFilters.selectedPessoa.id;
            }

            if (!exportPayload.data_hora_inicio && !exportPayload.referencias?.length) {
                msgs.current?.show({
                    severity: 'warn',
                    summary: 'Filtros insuficientes',
                    detail: 'Informe um periodo ou mantenha notas filtradas para montar o PDF.',
                    life: 5000
                });
                return;
            }

            await exportarPdfNotasServico(
                exportPayload,
                msgs
            );
            setShowExportPdfDialog(false);
        } finally {
            setLoadingExportPdf(false);
        }
    };
    const handleClearFilters = () => {
        if (!canSearchNotaServico) {
            return;
        }

        const clearedDateRange: DateRangeValue = [null, null];
        setSelectedNotas([]);
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
        handleListNotaServico(0, '', {
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
    const openCreatePessoaDialog = () => {
        setIsPessoaDialogLoading(true);
        setEditingPessoaId(null);
        setPreloadedPessoa(null);
        setPessoaDialogKey((current) => current + 1);
        setShowModalPessoa(true);
    };
    const openEditPessoaDialog = async (pessoaSelecionada: PessoaEntity) => {
        if (!pessoaSelecionada?.id) {
            return;
        }
        setIsPessoaDialogLoading(true);
        try {
            const pessoaId = String(pessoaSelecionada.id);
            const pessoaPrecarregada = await fetchPessoasById(pessoaId);
            setPreloadedPessoa({
                dataPessoa: pessoaPrecarregada.dataPessoa,
                selectedVendedor: pessoaPrecarregada.selectedVendedor ?? null,
                selectedContrato: pessoaPrecarregada.selectedContrato ?? null
            });
            setEditingPessoaId(pessoaId);
            setPessoaDialogKey((current) => current + 1);
            setShowModalPessoa(true);
        } catch (error) {
            console.error('Erro ao prÃ©-carregar cliente/fornecedor para ediÃ§Ã£o:', error);
            setIsPessoaDialogLoading(false);
        }
    };
    const closePessoaDialog = () => {
        setShowModalPessoa(false);
        setEditingPessoaId(null);
        setIsPessoaDialogLoading(true);
        setPreloadedPessoa(null);
    };
    const handlePessoaSaved = async (created: PessoaEntity) => {
        setIsPessoaDialogLoading(true);
        let pessoaAtualizada = created;

        try {
            if (created?.id) {
                const response = await fetchPessoasById(String(created.id));
                pessoaAtualizada = response.dataPessoa;
            }

            setSelectedPessoaDialog(pessoaAtualizada);
            handlePrepararNfsChange('id_cliente', pessoaAtualizada.id);
            setReloadKeyPessoa((current) => current + 1);
        } finally {
            closePessoaDialog();
        }
    };
    const search = async (filters?: { dateRange: DateRangeValue; selectedEmpresa: CompanyEntity | null; selectedPessoa: PessoaEntity | null; selectedVendedor: VendedorEntity | null; selectedStatusNotaServico: string }) => {
        if (!canSearchNotaServico) {
            clearNotaServicoResults();
            return;
        }

        await handleListNotaServico(0, searchTerm, filters);
    };
    const handleApplyFilters = () => {
        if (!canSearchNotaServico) {
            return;
        }

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
        if (!canSearchNotaServico) {
            return;
        }

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
        if (!canSearchNotaServico) {
            return;
        }

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
        if (!canCreateNotaServico) {
            return;
        }

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
    const openCreateEmpresaDialog = () => {
        setIsEmpresaDialogLoading(true);
        setEditingEmpresaId(null);
        setPreloadedEmpresa(null);
        setEmpresaDialogKey((current) => current + 1);
        setShowModalEmpresa(true);
    };
    const openEditEmpresaDialog = async (empresaSelecionada: CompanyEntity) => {
        if (!empresaSelecionada?.id) {
            return;
        }

        setIsEmpresaDialogLoading(true);
        try {
            const empresaId = String(empresaSelecionada.id);
            const companyFormData = await fetchCompanyFormDataByID(empresaId);
            setPreloadedEmpresa(companyFormData);
            setEditingEmpresaId(empresaId);
            setEmpresaDialogKey((current) => current + 1);
            setShowModalEmpresa(true);
        } catch (error) {
            console.error('Erro ao prÃ©-carregar empresa para ediÃ§Ã£o:', error);
            setIsEmpresaDialogLoading(false);
        } finally {
        }
    };
    const closeEmpresaDialog = () => {
        setShowModalEmpresa(false);
        setEditingEmpresaId(null);
        setIsEmpresaDialogLoading(true);
        setPreloadedEmpresa(null);
    };
    const handleEmpresaSaved = async (created: CompanyEntity) => {
        setIsEmpresaDialogLoading(true);
        let empresaAtualizada = created;

        try {
            if (created?.id) {
                const response = await fetchCompanyDropdownByID(String(created.id));
                if (response) {
                    empresaAtualizada = response;
                }
            }

            setSelectedEmpresaDialog(empresaAtualizada);
            handlePrepararNfsChange('id_empresa', empresaAtualizada.id);
            setReloadKeyEmpresa((current) => current + 1);
        } finally {
            closeEmpresaDialog();
        }
    };
    const openCreateServicoDialog = () => {
        setIsServicoDialogLoading(true);
        setEditingServicoId(null);
        setPreloadedServico(null);
        setServicoDialogKey((current) => current + 1);
        setShowModalServico(true);
    };
    const openEditServicoDialog = async (servicoSelecionado: ServiceEntity) => {
        if (!servicoSelecionado?.id) {
            return;
        }
        setIsServicoDialogLoading(true);
        try {
            const servicoId = String(servicoSelecionado.id);
            const serviceFormData = await fetchServiceFormDataByID(servicoId);
            setPreloadedServico(serviceFormData);
            setEditingServicoId(servicoId);
            setServicoDialogKey((current) => current + 1);
            setShowModalServico(true);
        } catch (error) {
            console.error('Erro ao prÃ©-carregar serviÃ§o para ediÃ§Ã£o:', error);
            setIsServicoDialogLoading(false);
        }
    };
    const closeServicoDialog = () => {
        setShowModalServico(false);
        setEditingServicoId(null);
        setIsServicoDialogLoading(true);
        setPreloadedServico(null);
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    const handleServiceSaved = async (created: ServiceEntity) => {
        setIsServicoDialogLoading(true);
        let servicoAtualizado = created;

        try {
            if (created?.id) {
                const response = await fetchServicesByID(String(created.id));
                servicoAtualizado = response.servico;
            }

            setSelectedServicoDialog(servicoAtualizado);
            handlePrepararNfsChange('id_servico', servicoAtualizado.id);
            setReloadKeyServico((current) => current + 1);
        } finally {
            closeServicoDialog();
        }
    };
    useEffect(() => {
        searchTermRef.current = searchTerm;
    }, [searchTerm]);
    useEffect(() => {
        activeFiltersRef.current = {
            dateRange,
            selectedEmpresa,
            selectedPessoa,
            selectedVendedor,
            selectedStatusNotaServico
        };
    }, [dateRange, selectedEmpresa, selectedPessoa, selectedStatusNotaServico, selectedVendedor]);
    useEffect(() => {
        if (!showDialogPreparaNfs) return;

        validateFieldsPrepararNfs(prepararNfs, selectedEmpresaDialog, selectedServicoDialog, selectedPessoaDialog, setErrors, msgs);
    }, [prepararNfs, selectedEmpresaDialog, selectedPessoaDialog, selectedServicoDialog, showDialogPreparaNfs]);
    useEffect(() => {
        if (!showDialogPreparaNfs || !isMobile) {
            setIsMobileKeyboardOpen(false);
            return;
        }

        const updateKeyboardState = () => {
            const viewportHeight = window.visualViewport?.height;

            if (!viewportHeight) {
                setIsMobileKeyboardOpen(false);
                return;
            }

            setIsMobileKeyboardOpen(window.innerHeight - viewportHeight > 120);
        };

        updateKeyboardState();
        window.visualViewport?.addEventListener('resize', updateKeyboardState);
        window.visualViewport?.addEventListener('scroll', updateKeyboardState);

        return () => {
            window.visualViewport?.removeEventListener('resize', updateKeyboardState);
            window.visualViewport?.removeEventListener('scroll', updateKeyboardState);
        };
    }, [isMobile, showDialogPreparaNfs]);
    useEffect(() => {
        if (!isMobile) {
            setMobilePageSizeReady(true);
            return;
        }

        const calculateMobilePageSize = () => {
            const wrapper = mobileListWrapperRef.current;

            if (!wrapper) {
                setMobilePageSize((current) => (current === Math.max(pageSize, 1) ? current : Math.max(pageSize, 1)));
                setMobilePageSizeReady(true);
                return;
            }

            const wrapperHeight = wrapper.getBoundingClientRect().height;
            const selectAll = wrapper.querySelector('.nota-servico-mobile-select-all') as HTMLElement | null;
            const cards = Array.from(wrapper.querySelectorAll('.nota-servico-mobile-card')) as HTMLElement[];
            const reservedHeight =
                (selectAll?.getBoundingClientRect().height ?? 0) +
                (selectAll ? NOTA_SERVICO_MOBILE_CARD_GAP : 0);
            const measuredCardHeight =
                cards.length > 0
                    ? Math.max(...cards.map((card) => card.getBoundingClientRect().height))
                    : NOTA_SERVICO_MOBILE_CARD_FALLBACK_HEIGHT;
            const measuredStride =
                cards.length > 1
                    ? cards[1].getBoundingClientRect().top - cards[0].getBoundingClientRect().top
                    : measuredCardHeight + NOTA_SERVICO_MOBILE_CARD_GAP;

            if (wrapperHeight <= 0) {
                setMobilePageSize((current) => (current === Math.max(pageSize, 1) ? current : Math.max(pageSize, 1)));
                setMobilePageSizeReady(true);
                return;
            }

            const availableHeight = Math.max(wrapperHeight - reservedHeight, measuredCardHeight);
            const nextPageSize =
                availableHeight <= measuredCardHeight
                    ? 1
                    : Math.max(
                        1,
                        1 + Math.floor((availableHeight - measuredCardHeight) / measuredStride)
                    );

            setMobilePageSize((current) => (current === nextPageSize ? current : nextPageSize));
            setMobilePageSizeReady(true);
        };

        calculateMobilePageSize();

        const wrapper = mobileListWrapperRef.current;
        const resizeObserver =
            wrapper && typeof ResizeObserver !== 'undefined'
                ? new ResizeObserver(() => {
                    calculateMobilePageSize();
                })
                : null;

        if (wrapper && resizeObserver) {
            resizeObserver.observe(wrapper);
        }

        const handleWindowResize = () => {
            calculateMobilePageSize();
        };

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
            resizeObserver?.disconnect();
        };
    }, [isMobile, pageSize, listPaginationNotaServico?.content?.length]);
    useEffect(() => {
        if (isMobile && !mobilePageSizeReady) {
            return;
        }

        if (!canSearchNotaServico) {
            setSelectedNotas([]);
            setListPaginationNotaServico(buildEmptyNotaServicoPagination(resolvedPageSize));
            setLoading(false);
            return;
        }

        const activeFilters = hasLoadedNotaServicoRef.current
            ? activeFiltersRef.current
            : {
                dateRange: [null, null] as DateRangeValue,
                selectedEmpresa: null,
                selectedPessoa: null,
                selectedVendedor: null,
                selectedStatusNotaServico: ''
            };
        const termo = hasLoadedNotaServicoRef.current ? searchTermRef.current : '';

        handleListNotaServico(0, termo, activeFilters).finally(() => {
            hasLoadedNotaServicoRef.current = true;
        });
    }, [canSearchNotaServico, handleListNotaServico, isMobile, mobilePageSizeReady, resolvedPageSize]);
    useEffect(() => {
        const feedback = consumeNotaServicoFeedback();
        if (!feedback) {
            return;
        }

        const { notaAutorizada, ...messageFeedback } = feedback;

        msgs.current?.show({
            ...messageFeedback,
            life: 7000
        });

        if (notaAutorizada) {
            setAuthorizedNota(notaAutorizada);
            setShowAuthorizedNotaDialog(true);
        }
    }, []);
    if (loadingPrepararNfs) {
        return <LoadingScreen loadingText={'Preparando NFS-E...'} />;
    }
    const disableConfirmarPrepararNfs = stateDisableBtnPrepararNfse || Object.keys(errors).length > 0 || !selectedEmpresaDialog || !selectedPessoaDialog || !selectedServicoDialog;
    const authorizedNotaEmpresa =
        authorizedNota?.razao_social_empresa ||
        (authorizedNota as any)?.empresa?.razao_social ||
        (authorizedNota as any)?.empresa?.nome_fantasia ||
        authorizedNota?.prestador?.razao_social ||
        '-';
    const authorizedNotaCliente =
        authorizedNota?.razao_social_cliente ||
        (authorizedNota as any)?.cliente?.razao_social ||
        (authorizedNota as any)?.cliente?.nome_fantasia ||
        authorizedNota?.tomador?.razao_social ||
        '-';
    const canDownloadAuthorizedNota = Boolean(authorizedNota?.id);
    return (
        <div className="w-full">
            <Toast ref={toast} />
            <Messages ref={msgs} className="custom-messages" />
            <div className="p-0">
                {isMobile && (
                    <>
                        <div className="card styled-container-main-all-routes">
                            <div style={{ marginTop: '8px', marginLeft: '8px', width: '100%' }}>
                                <div className="grid formgrid w-full" style={{ maxHeight: '74px' }}>
                                    {canSearchNotaServico && (
                                        <div className="col-7 mb-0 lg:col-4  ">
                                            <Input
                                                label="Digite o nome Cliente / N° da NFS-e"
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
                                    )}
                                    <div className={`${canSearchNotaServico} mb-0 lg:col-3 `}>
                                        <div className="nota-servico-mobile-buttons" style={{ position: 'relative' }}>
                                            {canUpdateNotaServico && selectedNotas.length > 0 && (
                                                <Button
                                                    icon="pi pi-send"
                                                    label={`Emitir selecionadas (${selectedNotas.length})`}
                                                    onClick={handleEmitirNotas}
                                                    outlined
                                                    severity="success"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-10px',
                                                        width: '200px',
                                                        right: '0',
                                                        height: '28px',
                                                        boxShadow: 'none'
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <div className="container-BTN-Filter-Created nota-servico-mobile-actions">
                                            {canSearchNotaServico && (
                                                <FilterOverlay onOpen={syncDraftFilters} onApply={handleApplyFilters} onClear={handleClearFilters} buttonClassName="height-2-8rem-ml-1rem-mobile">
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
                                                        <DropdownSearch<CompanyEntity>
                                                            id="selectedEmpresa"
                                                            selectedItem={draftSelectedEmpresa}
                                                            onItemChange={handleEmpresaChange}
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
                                            )}
                                            <div className="nota-servico-mobile-buttons">
                                                {canSearchNotaServico && (
                                                    <Button
                                                        label=""
                                                        icon="pi pi-file-pdf"
                                                        severity="secondary"
                                                        outlined
                                                        tooltip="Exportar PDF"
                                                        loading={loadingExportPdf}
                                                        disabled={loadingExportPdf}
                                                        onClick={handleOpenExportPdfDialog}
                                                    />
                                                )}
                                                {canCreateNotaServico && <Button label="" icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div ref={mobileListWrapperRef} className="nota-servico-mobile-list-wrapper mt-3">
                                {canSearchNotaServico ? (
                                    <ListarNotaServico
                                        loading={loading}
                                        setLoading={setLoading}
                                        listPaginationNotaServico={listPaginationNotaServico}
                                        setListPaginationNotaServico={setListPaginationNotaServico}
                                        searchTerm={searchTerm}
                                        selectedNotas={selectedNotas}
                                        setSelectedNotas={handleSelectedNotasChange}
                                        listarInativos={false}
                                        mobileLoadMoreVisible={hasMoreMobileContent(listPaginationNotaServico)}
                                        mobileLoadMoreLoading={loadingMore}
                                        onMobileLoadMore={handleLoadMoreNotaServico}
                                    />
                                ) : (
                                    <div className="p-3">Sem permissao para pesquisar notas fiscais.</div>
                                )}
                            </div>
                        </div>
                    </>
                )}
                {isDesktop && (
                    <>
                        <div className="card styled-container-main-all-routes">
                            <div style={{ padding: '0.5rem' }}>
                                <div className="grid formgrid">
                                    {canSearchNotaServico && (
                                        <div className="col-12 lg:col-3 container-input-search-all">
                                            <Input
                                                label="Digite nome do Cliente N° da NFS-e"
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
                                    )}
                                    {canSearchNotaServico && (
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
                                    )}
                                    {canSearchNotaServico && (
                                        <div className="Container-Btn-Filter-Desktop">
                                            <FilterOverlay onOpen={syncDraftFilters} onApply={handleApplyFilters} onClear={handleClearFilters} buttonClassName="Btn-Filter-Desktop">
                                                <div className="grid formgrid">
                                                    <div className="col-12 lg:col-12 ">
                                                        <DropdownSearch<CompanyEntity>
                                                            id="selectedEmpresa"
                                                            selectedItem={draftSelectedEmpresa}
                                                            onItemChange={handleEmpresaChange}
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
                                                            autoLoadAndSelectSingle={false}
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
                                    )}
                                    <div className="container-button-primary-novo">
                                        <div className="p-2">
                                            {canUpdateNotaServico && selectedNotas.length > 0 && <Button label={`Emitir ${selectedNotas.length} Nota${selectedNotas.length > 1 ? 's' : ''}`} icon="pi pi-send" onClick={handleEmitirNotas} outlined />}
                                        </div>
                                        {canSearchNotaServico && (
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
                                                    onClick={handleOpenExportPdfDialog}
                                                />
                                            </div>
                                        )}
                                        {canCreateNotaServico && (
                                            <div>
                                                <Button label="Emitir" icon="pi pi-plus" onClick={handleNavigate} className="p-button-primary-novo" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {canSearchNotaServico ? (
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
                                ) : (
                                    <div className="p-3">Sem permissao para pesquisar notas fiscais.</div>
                                )}
                            </div>
                            {canSearchNotaServico && (
                                <div style={{ marginTop: 'auto' }}>
                                    <CustomPaginator
                                        first={safeNotaPageable.pageNumber * safeNotaPageable.pageSize}
                                        rows={safeNotaPageable.pageSize}
                                        totalRecords={safeNotaPagination.totalElements}
                                        onPageChange={onPageChange}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}
                <Dialog
                    header="Nota fiscal emitida"
                    visible={showAuthorizedNotaDialog}
                    onHide={() => {
                        setShowAuthorizedNotaDialog(false);
                        setAuthorizedNota(null);
                    }}
                    draggable={false}
                    dismissableMask
                    breakpoints={{ '960px': '92vw' }}
                    style={{ width: isMobile ? '95vw' : '40rem' }}
                    footer={
                        <div className="nota-servico-authorized-dialog-footer">
                            <div className="nota-servico-authorized-dialog-actions">
                                {canDownloadAuthorizedNota ? (
                                    <>
                                        {downloadXmlButton(authorizedNota as NfsEntity, msgs, {
                                            label: 'XML',
                                            className: 'p-button-outlined p-button-info nota-servico-authorized-dialog-button',
                                            style: {
                                                width: 'auto',
                                                height: 'auto',
                                                boxShadow: 'none'
                                            }
                                        })}
                                        {downloadPdfButton(authorizedNota as NfsEntity, msgs, {
                                            label: 'PDF',
                                            className: 'p-button-outlined nota-servico-authorized-dialog-button',
                                            style: {
                                                width: 'auto',
                                                height: 'auto',
                                                boxShadow: 'none'
                                            }
                                        })}
                                        <Button
                                            icon="pi pi-download"
                                            label="PDF e XML"
                                            className="p-button-outlined p-button-success nota-servico-authorized-dialog-button"
                                            style={{
                                                width: 'auto',
                                                height: 'auto',
                                                boxShadow: 'none'
                                            }}
                                            onClick={() => downloadArquivosNota(authorizedNota as NfsEntity, msgs)}
                                        />
                                    </>
                                ) : (
                                    <span className="text-sm text-600">Arquivos ainda indisponíveis para download.</span>
                                )}
                            </div>
                            <Button
                                label="Fechar"
                                outlined
                                severity="secondary"
                                className="nota-servico-authorized-dialog-button"
                                style={{ boxShadow: 'none' }}
                                onClick={() => {
                                    setShowAuthorizedNotaDialog(false);
                                    setAuthorizedNota(null);
                                }}
                            />

                        </div>
                    }
                >
                    <div className="flex flex-column gap-4 p-2">
                        <div className="flex align-items-center gap-3">
                            <i className="pi pi-check-circle text-green-500" style={{ fontSize: '2rem' }} />
                            <div className="flex flex-column gap-1">
                                <span className="text-xl font-semibold">NFS-e autorizada com sucesso</span>
                                <span className="text-600 text-sm">Confira abaixo os principais dados da nota emitida.</span>
                            </div>
                        </div>
                        <div className="grid">
                            <div className="col-12 md:col-6">
                                <div className="border-1 border-200 border-round-xl p-3 surface-50 h-full">
                                    <span className="text-600 text-sm block mb-2">Nome da empresa</span>
                                    <strong className="block">{authorizedNotaEmpresa}</strong>
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="border-1 border-200 border-round-xl p-3 surface-50 h-full">
                                    <span className="text-600 text-sm block mb-2">Nome do cliente</span>
                                    <strong className="block">{authorizedNotaCliente}</strong>
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="border-1 border-200 border-round-xl p-3 surface-50 h-full">
                                    <span className="text-600 text-sm block mb-2">Data e hora de emissão</span>
                                    <strong className="block">{formatAuthorizedNotaDateTime(authorizedNota?.data_emissao)}</strong>
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="border-1 border-200 border-round-xl p-3 surface-50 h-full">
                                    <span className="text-600 text-sm block mb-2">Email do tomador</span>
                                    <strong className="block">{getAuthorizedNotaEmail(authorizedNota)}</strong>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="border-1 border-200 border-round-xl p-3 surface-50">
                                    <span className="text-600 text-sm block mb-2">Valor</span>
                                    <strong className="block text-xl">{formatAuthorizedNotaValue(authorizedNota?.total_valor_servico)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </Dialog>
                <Dialog
                    header="Preparar NFS-e"
                    visible={showDialogPreparaNfs}
                    className={`nota-servico-preparar-dialog${isMobileKeyboardOpen ? ' nota-servico-preparar-dialog--keyboard-open' : ''}`}
                    contentClassName="nota-servico-preparar-dialog-content"
                    breakpoints={{ '960px': '95vw' }}
                    style={{ width: isMobile ? '95vw' : '500px', maxWidth: '95vw' }}
                    position={isMobileKeyboardOpen ? 'top' : undefined}
                    draggable={false}
                    onHide={handleClosePreparaNfsDialog}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0.5rem' }}>
                            <Button label="Preparar" style={{ boxShadow: 'none' }} disabled={disableConfirmarPrepararNfs} onClick={handleConfirmPreparaNfs} />
                            <Button
                                label="Cancelar"
                                onClick={handleClosePreparaNfsDialog}
                                outlined
                                severity="secondary"
                                style={{ boxShadow: 'none' }}
                            />
                        </div>
                    }
                >
                    <div className="nota-servico-preparar-dialog-body">
                        {isDesktop &&
                            <>
                                <div className="col-12 lg:col-12">
                                    <EmpresaDropdownField
                                        id="selectedEmpresa"
                                        reloadKey={reloadKeyEmpresa}
                                        selectedEmpresa={selectedEmpresaDialog}
                                        onEmpresaChange={handleEmpresaChangeDialog}
                                        showAddButton
                                        onAddClick={openCreateEmpresaDialog}
                                        onEditClick={openEditEmpresaDialog}
                                        hasError={!!errors.selectedEmpresa}
                                        errorMessage={errors.selectedEmpresa}
                                        autoLoadAndSelectSingle={showDialogPreparaNfs}
                                    />
                                </div>
                                <div className="col-12 lg:col-12">
                                    <PessoaDropdownField
                                        id="selectedCliente"
                                        reloadKey={reloadKeyPessoa}
                                        selectedPessoa={selectedPessoaDialog}
                                        onPessoaChange={handlePessoaChangeDialog}
                                        showAddButton
                                        onAddClick={openCreatePessoaDialog}
                                        onEditClick={openEditPessoaDialog}
                                        hasError={!!errors.selectedCliente}
                                        errorMessage={errors.selectedCliente}
                                        autoLoadAndSelectSingle={showDialogPreparaNfs}
                                    />
                                </div>
                                <div className="col-12 lg:col-12">
                                    <ServicoDropdownField
                                        id="selectedServico"
                                        reloadKey={reloadKeyServico}
                                        selectedService={selectedServicoDialog}
                                        onServiceChange={handleServicoChangeDialog}
                                        showAddButton
                                        onAddClick={openCreateServicoDialog}
                                        onEditClick={openEditServicoDialog}
                                        hasError={!!errors.selectedServico}
                                        errorMessage={errors.selectedServico}
                                        autoLoadAndSelectSingle={showDialogPreparaNfs}
                                    />
                                </div>
                            </>
                        }
                        {isMobile &&
                            <>
                                <div>
                                    <MobileSearchPicker<CompanyEntity>
                                        selectedItem={selectedEmpresaDialog}
                                        onItemChange={handleEmpresaChangeDialog}
                                        fetchAllItems={listTheEmpresa}
                                        fetchFilteredItems={fetchFilteredEmpresa}
                                        fetchItemsPage={fetchEmpresaMobilePage}
                                        optionValue="id"
                                        topLabel="Empresa:"
                                        loadMoreRows={20}
                                        placeholder="Selecione a Empresa"
                                        dialogTitle="Selecionar a Empresa"
                                        hasError={!!errors.selectedEmpresa}
                                        errorMessage={errors.selectedEmpresa}
                                        onAddClick={openCreateEmpresaDialog}
                                        onEditClick={openEditEmpresaDialog}
                                        dialogPosition={isMobileKeyboardOpen ? 'top' : undefined}
                                        autoLoadAndSelectSingle
                                        optionLabel={'razao_social'}
                                    />
                                </div>
                                <div>
                                    <MobileSearchPicker<PessoaEntity>
                                        selectedItem={selectedPessoaDialog}
                                        onItemChange={handlePessoaChangeDialog}
                                        fetchAllItems={listThePessoas}
                                        fetchFilteredItems={fetchFilteredPessoa}
                                        fetchItemsPage={fetchPessoaMobilePage}
                                        loadMoreRows={20}
                                        optionLabel="razao_social"
                                        optionValue="id"
                                        topLabel="Cliente ou Fornecedor:"
                                        placeholder="Selecione o Cliente ou Fornecedor"
                                        dialogTitle="Selecionar Cliente ou Fornecedor"
                                        hasError={!!errors.selectedCliente}
                                        errorMessage={errors.selectedCliente}
                                        onAddClick={openCreatePessoaDialog}
                                        onEditClick={openEditPessoaDialog}
                                        dialogPosition={isMobileKeyboardOpen ? 'top' : undefined}
                                        autoLoadAndSelectSingle
                                    />
                                </div>
                                <div>
                                    <MobileSearchPicker<ServiceEntity>
                                        selectedItem={selectedServicoDialog}
                                        onItemChange={handleServicoChangeDialog}
                                        fetchAllItems={listTheService}
                                        fetchFilteredItems={fetchFilteredService}
                                        fetchItemsPage={fetchServicoMobilePage}
                                        optionValue="id"
                                        loadMoreRows={20}
                                        topLabel="Cliente ou Fornecedor:"
                                        placeholder="Selecione o Serviço"
                                        dialogTitle="Selecionar o Serviço"
                                        hasError={!!errors.selectedServico}
                                        errorMessage={errors.selectedServico}
                                        onAddClick={openCreateServicoDialog}
                                        onEditClick={openEditServicoDialog}
                                        dialogPosition={isMobileKeyboardOpen ? 'top' : undefined}
                                        autoLoadAndSelectSingle
                                        optionLabel={'descricao'}
                                    />
                                </div>
                            </>
                        }
                    </div>
                </Dialog>
                <DialogFilter
                    header="Confirmar exportação PDF"
                    visible={showExportPdfDialog}
                    onHide={handleCloseExportPdfDialog}
                    onSave={handleConfirmExportPdf}
                    onCancel={handleCloseExportPdfDialog}
                    saveLabel="Confirmar"
                    cancelLabel="Cancelar"
                    showSaveButton
                    showCancelButton
                    saveDisabled={loadingExportPdf}
                    cancelDisabled={loadingExportPdf}
                    width="32rem"
                >
                    <div className="flex flex-column gap-4 p-4">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-file-pdf text-red-500" style={{ fontSize: '2rem' }} />
                            <div className="flex flex-column">
                                <span className="text-xl font-semibold">Exportação de PDF</span>
                                <span className="text-600 text-sm">Confirme o período que será utilizado na exportação.</span>
                            </div>
                        </div>
                        <div className="border-1 border-200 border-round-xl p-4 surface-50">
                            <div className="flex flex-column gap-3">
                                <div className="flex justify-content-between align-items-center">
                                    <span className="font-medium text-700">Data inicial</span>
                                    <span className="font-semibold">{formatExportDate(dateRange?.[0])}</span>
                                </div>
                                <div className="flex justify-content-between align-items-center">
                                    <span className="font-medium text-700">Data final</span>
                                    <span className="font-semibold">{formatExportDate(dateRange?.[1])}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogFilter>
                <DialogFilter
                    header={editingEmpresaId ? 'Editar Empresa' : 'Adicionar Empresa'}
                    visible={showModalEmpresa}
                    onHide={closeEmpresaDialog}
                    loading={isEmpresaDialogLoading}
                    loadingText={editingEmpresaId ? 'Carregando informações da Empresa...' : 'Abrindo cadastro de Empresa...'}
                >
                    <FormEmpresaCreated
                        key={`${editingEmpresaId ?? 'novo'}-${empresaDialogKey}`}
                        msgs={msgs}
                        ref={formRef}
                        empresa={empresa}
                        initialId={editingEmpresaId}
                        preloadedEmpresa={preloadedEmpresa}
                        setEmpresa={setEmpresa}
                        onEmpresaChange={handleEmpresa}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handleEmpresaSaved}
                        onLoadingChange={setIsEmpresaDialogLoading}
                        onClose={closeEmpresaDialog}
                        showBTNPGCreatedDialog
                        onBackClick={closeEmpresaDialog}
                    />
                </DialogFilter>
                <DialogFilter
                    header={editingPessoaId ? 'Editar Cliente ou Fornecedor' : 'Adicionar Cliente ou Fornecedor'}
                    visible={showModalPessoa}
                    onHide={closePessoaDialog}
                    loading={isPessoaDialogLoading}
                    loadingText={editingPessoaId ? 'Carregando informações do Cliente ou Fornecedor...' : 'Abrindo cadastro de Cliente ou Fornecedor...'}
                >
                    <FormCreatedPessoa
                        key={`${editingPessoaId ?? 'novo'}-${pessoaDialogKey}`}
                        msgs={msgs}
                        ref={formRef}
                        pessoa={pessoa}
                        initialId={editingPessoaId}
                        preloadedPessoa={preloadedPessoa}
                        setPessoa={setPessoa}
                        onPessoaChange={handlePessoaContrato}
                        onErrorsChange={() => { }}
                        redirectAfterSave={false}
                        onSaved={handlePessoaSaved}
                        onLoadingChange={setIsPessoaDialogLoading}
                        onClose={closePessoaDialog}
                        showBTNPGCreatedDialog
                        onBackClick={closePessoaDialog}
                    />
                </DialogFilter>
                <DialogFilter
                    header={editingServicoId ? 'Editar Serviço' : 'Adicionar Serviço'}
                    visible={showModalServico}
                    onHide={closeServicoDialog}
                    loading={isServicoDialogLoading}
                    loadingText={editingServicoId ? 'Carregando informações do Serviço...' : 'Abrindo cadastro de Serviço...'}
                >
                    <FormCreatedServico
                        key={`${editingServicoId ?? 'novo'}-${servicoDialogKey}`}
                        msgs={msgs}
                        ref={formRef}
                        servico={servico}
                        initialId={editingServicoId}
                        preloadedServico={preloadedServico}
                        setServico={setServico}
                        onServicoChange={handleServico}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handleServiceSaved}
                        onLoadingChange={setIsServicoDialogLoading}
                        onClose={closeServicoDialog}
                        showBTNPGCreatedDialog
                        onBackClick={closeServicoDialog}
                    />
                </DialogFilter>
            </div>
        </div>
    );
};
export default NotaServico;

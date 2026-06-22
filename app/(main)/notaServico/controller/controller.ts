import axios from 'axios';
import api from '@/app/services/api';
import { Messages } from 'primereact/messages';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { NfsEntity, PrepararNfs } from '@/app/entity/NfsEntity';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { buildMobilePickerPageResult } from '@/app/shared/PageMobile/pageMobile';
import { mapDateRangeToParams } from '@/app/components/calendarComponent/controller';
import { DetalPrestadorValoresEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import { CreatedNotaServicoResult, ExportarPdfNfsePayload, ListNotaServicoParams, NotaFiscalParams, NotaFiscalQueryParams, NotaServicoFeedback } from '../types/notaServico';

const NOTA_SERVICO_FEEDBACK_KEY = 'notaServicoFeedback';
const inflightNotaServicoRequests = new Map<string, Promise<any>>();


const extractBackendErrorMessage = (data: any, fallback: string): string => {
    if (!data) {
        return fallback;
    }

    if (typeof data === 'string') {
        return data.trim() || fallback;
    }

    if (typeof data?.message === 'string' && data.message.trim()) {
        return data.message.trim();
    }

    if (typeof data?.mensagem === 'string' && data.mensagem.trim()) {
        return data.mensagem.trim();
    }

    if (Array.isArray(data?.errors)) {
        const firstError = data.errors.find((item: unknown) => typeof item === 'string' && item.trim());
        if (firstError) {
            return firstError.trim();
        }
    }

    return fallback;
};
const normalizeOptionalNumberToZero = (value: unknown): number => {
    if (value === null || value === undefined || value === '') {
        return 0;
    }
    if (typeof value === 'string') {
        const normalized = Number(value.replace(',', '.'));
        return Number.isFinite(normalized) ? normalized : 0;
    }
    const normalized = Number(value);
    return Number.isFinite(normalized) ? normalized : 0;
};
const sanitizeDownloadFileNamePart = (value?: string | null): string => {
    const normalizedValue = (value ?? '')
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[\\/:*?"<>|]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    return normalizedValue;
};
const extractNotaServicoStatus = (data: any): string => {
    const status = data?.status_nota ?? data?.nfse?.status_nota ?? data?.dados_emissao?.status_nota ?? data?.dados_emissao?.nfse?.status_nota;

    return typeof status === 'string' ? status.trim().toUpperCase() : '';
};
const extractNotaServicoPayload = (data: any): Partial<NfsEntity> | null => {
    if (!data || typeof data !== 'object') {
        return null;
    }

    const payload = data?.dados_emissao?.nfse ?? data?.nfse ?? data;

    if (!payload || typeof payload !== 'object') {
        return null;
    }

    const empresaResumo = payload.empresa ?? data?.empresa ?? {};
    const clienteResumo = payload.cliente ?? data?.cliente ?? {};
    const prestador = payload.prestador ?? data?.prestador ?? {};
    const tomador = payload.tomador ?? data?.tomador ?? {};
    const contato = tomador?.contato ?? {};

    return {
        ...payload,
        id: payload.id ?? payload.id_nfse ?? data?.id ?? data?.id_nfse,
        status_nota: payload.status_nota ?? data?.status_nota ?? data?.dados_emissao?.status_nota,
        data_emissao: payload.data_emissao ?? data?.data_emissao ?? data?.dados_emissao?.data_emissao,
        razao_social_empresa:
            payload.razao_social_empresa ??
            empresaResumo?.razao_social ??
            empresaResumo?.nome_fantasia ??
            prestador?.razao_social ??
            data?.razao_social_empresa,
        razao_social_cliente:
            payload.razao_social_cliente ??
            clienteResumo?.razao_social ??
            clienteResumo?.nome_fantasia ??
            tomador?.razao_social ??
            data?.razao_social_cliente,
        total_valor_servico: payload.total_valor_servico ?? payload.servico?.valores?.valor_servico ?? data?.total_valor_servico,
        prestador: {
            ...prestador,
            razao_social:
                prestador?.razao_social ??
                empresaResumo?.razao_social ??
                empresaResumo?.nome_fantasia ??
                '',
            nome_fantasia:
                prestador?.nome_fantasia ??
                empresaResumo?.nome_fantasia ??
                empresaResumo?.razao_social ??
                ''
        },
        tomador: {
            ...tomador,
            razao_social:
                tomador?.razao_social ??
                clienteResumo?.razao_social ??
                clienteResumo?.nome_fantasia ??
                '',
            contato: {
                ...contato,
                email:
                    contato?.email ??
                    tomador?.email ??
                    clienteResumo?.email ??
                    data?.tomador?.contato?.email ??
                    data?.tomador?.email ??
                    ''
            }
        }
    };
};
const persistNotaServicoFeedback = (feedback: NotaServicoFeedback) => {
    if (typeof window === 'undefined') {
        return;
    }

    window.sessionStorage.setItem(NOTA_SERVICO_FEEDBACK_KEY, JSON.stringify(feedback));
};
export const consumeNotaServicoFeedback = (): NotaServicoFeedback | null => {
    if (typeof window === 'undefined') {
        return null;
    }
    const rawFeedback = window.sessionStorage.getItem(NOTA_SERVICO_FEEDBACK_KEY);
    if (!rawFeedback) {
        return null;
    }
    window.sessionStorage.removeItem(NOTA_SERVICO_FEEDBACK_KEY);
    try {
        return JSON.parse(rawFeedback) as NotaServicoFeedback;
    } catch (error) {
        console.error('Erro ao ler feedback da nota de servico:', error);
        return null;
    }
};
export const normalizeNfseServiceValores = (valores?: Partial<DetalPrestadorValoresEntity> | null): DetalPrestadorValoresEntity =>
    new DetalPrestadorValoresEntity({
        base_calculo: normalizeOptionalNumberToZero(valores?.base_calculo),
        valor_servico: normalizeOptionalNumberToZero(valores?.valor_servico),
        aliquota_iss: normalizeOptionalNumberToZero(valores?.aliquota_iss),
        aliquota_deducoes: normalizeOptionalNumberToZero(valores?.aliquota_deducoes),
        aliquota_pis: normalizeOptionalNumberToZero(valores?.aliquota_pis),
        aliquota_cofins: normalizeOptionalNumberToZero(valores?.aliquota_cofins),
        aliquota_inss: normalizeOptionalNumberToZero(valores?.aliquota_inss),
        aliquota_ir: normalizeOptionalNumberToZero(valores?.aliquota_ir),
        aliquota_csll: normalizeOptionalNumberToZero(valores?.aliquota_csll),
        aliquota_outras_retencoes: normalizeOptionalNumberToZero(valores?.aliquota_outras_retencoes),
        percentual_desconto_incondicionado: normalizeOptionalNumberToZero(valores?.percentual_desconto_incondicionado),
        percentual_desconto_condicionado: normalizeOptionalNumberToZero(valores?.percentual_desconto_condicionado)
});
export const fetchNotaServico = async (params: NotaFiscalParams, msgs?: any) => {
    try {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value != null && value !== '') {
                searchParams.append(key, String(value));
            }
        });

        const requestKey = searchParams.toString();
        const existingRequest = inflightNotaServicoRequests.get(requestKey);
        if (existingRequest) {
            return await existingRequest;
        }

        const requestPromise = api
            .get(`/nfse?${requestKey}`)
            .then((response) => {
                console.log('resposta', response.data);
                return response.data;
            })
            .finally(() => {
                inflightNotaServicoRequests.delete(requestKey);
            });

        inflightNotaServicoRequests.set(requestKey, requestPromise);
        return await requestPromise;
    } catch (error: any) {
        console.error('Erro ao buscar notas fiscais:', error);
        if (error.response?.status === 403) {
            msgs?.current?.show({
                severity: 'warn',
                summary: 'Acesso negado',
                detail: 'Você não possui permissão para visualizar notas fiscais.',
                life: 6000
            });
            return {
                content: [],
                pageable: {
                    pageNumber: 0,
                    pageSize: 10
                },
                totalElements: 0,
                totalPages: 0,
                last: true,
                first: true,
                empty: true
            };
        }
        if (error.response) {
            msgs?.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: error.response?.data?.mensagem || 'Não foi possível carregar as notas fiscais.',
                life: 5000
            });
        } else {
            msgs?.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: error.message || 'Ocorreu um erro inesperado ao carregar as notas fiscais.',
                life: 5000
            });
        }
        return {
            content: [],
            pageable: {
                pageNumber: 0,
                pageSize: 10
            },
            totalElements: 0,
            totalPages: 0,
            last: true,
            first: true,
            empty: true
        };
    }
};
export const listNotaServico = async (params: ListNotaServicoParams, msgs?: any) => {
    const dateParams = mapDateRangeToParams(params.dateRange);
    const query: NotaFiscalQueryParams = {
        page: params.page,
        size: params.size,
        termo: params.termo ?? '',
        status: params.status,
        id_empresa: params.id_empresa ?? undefined,
        id_cliente: params.id_cliente ?? undefined,
        id_vendedor: params.id_vendedor ?? undefined,
        sort: 'dataEmissao,desc',
        ...dateParams
    };

    return await fetchNotaServico(query, msgs);
};
export const fetchNotaServicoByID = async (id: string | number) => {
    try {
        const response = await api.get(`/nfse/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar NFS-e por ID:', error);
        throw error;
    }
};
export const prepararCorrecaoNotaServico = async (params: { referencia?: string | null; id?: string | number | null }, msgs?: any) => {
    try {
        const payload = params.referencia ? { referencia: params.referencia } : { id: params.id };
        console.group('[NotaServico] Preparar correcao da NFS-e');
        console.log('Payload enviado para /nfse/preparar-emissao:', payload);
        const response = await api.post('/nfse/preparar-emissao', payload);
        console.log('Status HTTP:', response.status);
        console.log('Headers da resposta:', response.headers);
        console.log('Body retornado pelo backend:', response.data);
        console.groupEnd();

        return response.data;
    } catch (error: any) {
        console.group('[NotaServico] Erro ao preparar correcao da NFS-e');
        console.log('Payload original:', params);
        console.log('Status HTTP:', error.response?.status);
        console.log('Headers da resposta:', error.response?.headers);
        console.log('Body retornado pelo backend:', error.response?.data);
        console.error('Erro ao preparar correcao da NFS-e:', error);
        console.groupEnd();

        msgs?.current?.show({
            severity: 'error',
            summary: 'Atenção:',
            detail: error.response?.data?.message || error.response?.data?.mensagem || 'Nao foi possivel carregar os dados da NFS-e para correcao.',
            life: 5000
        });

        throw error;
    }
};
export const deletarNotaServico = async (nfsId: number, msgs: any, listPaginationNotaServico: Record<string, any>, listarInativos: boolean, setLoading: (state: boolean) => void, searchTerm: string) => {
    try {
        await api.delete(`/nfse/cancelar${String(nfsId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso:',
                detail: 'Nfse Cancelada com sucesso.'
            }
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Houve um erro ao tentar Cancelar Nfse, tente novamente.'
            }
        ]);
    }
};
export const prepararNotaServico = async (
    prepararNfs: PrepararNfs,
    selectedEmpresa: CompanyEntity | null,
    selectedCliente: PessoaEntity | null,
    selectedServico: ServiceEntity | null,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router?: AppRouterInstance
) => {
    try {
        console.group('[NotaServico] Preparar emissao da NFS-e');
        console.log('Payload enviado para /nfse/preparar-emissao:', prepararNfs);
        const response = await api.post('/nfse/preparar-emissao', prepararNfs);
        console.log('Status HTTP:', response.status);
        console.log('Headers da resposta:', response.headers);
        console.log('Body retornado pelo backend:', response.data);
        console.groupEnd();
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.group('[NotaServico] Erro ao preparar emissao da NFS-e');
            console.log('Payload original:', prepararNfs);
            console.log('Status HTTP:', error.response?.status);
            console.log('Headers da resposta:', error.response?.headers);
            console.log('Body retornado pelo backend:', error.response?.data);
            console.groupEnd();
        }
        console.error('Erro ao preparar NFS-e:', error);
        if (axios.isAxiosError(error)) {
            const msg = error.response?.data?.message || 'Erro ao preparar NFS-e.';
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: msg,
                life: 5000
            });
        } else {
            msgs.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Erro inesperado ao preparar NFS-e.',
                life: 5000
            });
        }
    }
};
export const createdNotaServico = async (nfs: NfsEntity, setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>, msgs: any, router: AppRouterInstance, redirectAfterSave = true): Promise<CreatedNotaServicoResult> => {
    try {
        const valoresNormalizados = normalizeNfseServiceValores(nfs.servico?.valores);
        const valorServicoNormalizado = (() => {
            const raw = nfs.servico.valores?.valor_servico as string | number | undefined;
            if (typeof raw === 'string') {
                const normalized = raw.replace(',', '.');
                return parseFloat(normalized) || 0;
            }
            return parseFloat(Number(raw ?? 0).toFixed(2));
        })();
        const dataNfse = {
            ...nfs,
            servico: {
                ...nfs.servico,
                valores: valoresNormalizados.copyWith({
                    valor_servico: valorServicoNormalizado
                })
            }
        };
        console.log('Envio:', { nfse: dataNfse });
        const response = await api.post('/nfse', { nfse: dataNfse });
        console.log('Response NFS:', response);
        const statusNota = extractNotaServicoStatus(response.data);
        const notaAutorizada = statusNota === 'AUTORIZADA' ? extractNotaServicoPayload(response.data) : null;
        if (statusNota === 'REJEITADA' && redirectAfterSave) {
            persistNotaServicoFeedback({
                severity: 'error',
                summary: 'Atenção',
                detail: 'Não foi possivel emitir o Nota Fiscal no momento, efetue a correção ou a emissao de uma nova Nota.'
            });
            router.push('/notaServico');
            return {
                wasCreated: false,
                redirected: true
            };
        }
        if (redirectAfterSave) {
            persistNotaServicoFeedback({
                severity: 'success',
                summary: 'Sucesso:',
                detail: 'NFS-e Emitida com sucesso!',
                notaAutorizada
            });
            router.push('/notaServico');
            return {
                wasCreated: true,
                redirected: true
            };
        }
        if (statusNota === 'REJEITADA') {
            msgs.current?.show({
                severity: 'warn',
                summary: 'Emissao nao concluida',
                detail: 'Não foi possivel emitir a Nota fiscal no momento, efetue a correcão ou a emissao de uma nova Nota Fiscal.',
                life: 7000
            });
            return {
                wasCreated: false,
                redirected: false
            };
        }
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso:',
            detail: 'NFS-e Emitida com sucesso!'
        });
        return {
            wasCreated: true,
            redirected: false
        };
    } catch (error: any) {
        let detailMessage = 'Ocorreu um erro ao cadastrar a NFS-e.';
        if (error.response) {
            console.group('retorno:');
            console.log('Status:', error.response.status);
            console.log('Headers:', error.response.headers);
            console.log('resp:', error.response.data);
            console.groupEnd();
            detailMessage = extractBackendErrorMessage(error.response.data, 'Ocorreu um erro ao cadastrar a NFS-e.');
            if (error.response?.status === 409) {
                msgs.current?.show({
                    severity: 'warn',
                    summary: 'Nota já emitida',
                    detail: detailMessage || 'Já existe uma emissão recente de Nota Fiscal para esta empresa, cliente e serviço.',
                    life: 7000
                });
                return {
                    wasCreated: false,
                    redirected: false
                };
            }
        } else {
            detailMessage = error.message || 'Ocorreu um erro inesperado.';
            console.error('Erro interno:', error);
        }
        msgs.current?.show({
            severity: 'error',
            summary: 'Atenção:',
            detail: detailMessage,
            life: 6000
        });
        return {
            wasCreated: false,
            redirected: false
        };
    }
};
export const downloadPdfNota = async (nota: NfsEntity, msgs: React.RefObject<Messages | null>) => {
    try {
        const response = await api.get(`/nfse/${nota.id}/pdf`, {
            responseType: 'blob'
        });
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        const fileName = `${nota.razao_social_cliente} Valor Serviço- ${nota.total_valor_servico}.pdf`;
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(fileURL);
    } catch (error) {
        console.log('Erro ao baixar PDF:', error);
        msgs.current?.show({
            severity: 'error',
            summary: 'Atenção:',
            detail: 'Erro ao baixar PDF da Nota Fiscal. Tente novamente em instantes. Caso o problema persista, entre em contato com o suporte.',
            life: 5000
        });
    }
};
export const downloadXmlNota = async (nota: NfsEntity, msgs: React.RefObject<Messages | null>) => {
    try {
        const response = await api.get(`/nfse/${nota.id}/xml`, {
            responseType: 'blob'
        });
        const blob = new Blob([response.data], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${nota.razao_social_cliente} Valor Serviço- ${nota.total_valor_servico}.xml`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error(' Erro ao baixar XML:', error);
        msgs.current?.show({
            severity: 'error',
            summary: 'Atenção:',
            detail: 'Erro ao baixar XML da Nota Fiscal. Tente novamente em instantes. Caso o problema persista, entre em contato com o suporte.',
            life: 5000
        });
    }
};
export const downloadArquivosNota = async (nota: NfsEntity, msgs: React.RefObject<Messages | null>) => {
    try {
        const response = await api.get(`/nfse/${nota.id}/arquivos`, {
            responseType: 'blob'
        });
        const blob = new Blob([response.data], { type: 'application/zip' });
        const fileURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        const clientName = sanitizeDownloadFileNamePart(
            nota.razao_social_cliente ?? (nota.tomador as any)?.razao_social ?? null
        );

        link.href = fileURL;
        link.download = `PDFeXML-${clientName || `nfse-${nota.id}`}.zip`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(fileURL);
    } catch (error) {
        console.error('Erro ao baixar ZIP da NFS-e:', error);
        msgs.current?.show({
            severity: 'error',
            summary: 'AtenÃ§Ã£o:',
            detail: 'Erro ao baixar os arquivos PDF e XML da Nota Fiscal. Tente novamente em instantes.',
            life: 5000
        });
    }
};
export const visualizarPdfNota = async (nota: NfsEntity, msgs: React.RefObject<Messages | null>) => {
    try {
        const response = await api.get(`/nfse/${nota.id}/pdf`, {
            responseType: 'blob'
        });
        const fileURL = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const newWindow = window.open(fileURL, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
            msgs.current?.show({
                severity: 'warn',
                summary: 'Aviso',
                detail: 'O navegador bloqueou a abertura automática do PDF. Clique para permitir pop-ups.',
                life: 5000
            });
        }
        setTimeout(() => window.URL.revokeObjectURL(fileURL), 5000);
    } catch (error) {
        msgs.current?.show({
            severity: 'error',
            summary: 'Atenção:',
            detail: 'Não foi possível abrir o PDF da nota.',
            life: 5000
        });
    }
};
export const exportarPdfNotasServico = async (payload: ExportarPdfNfsePayload, msgs: React.RefObject<Messages | null>) => {
    try {
        const response = await api.post('/nfse/exportar-pdf', payload, {
            responseType: 'blob'
        });
        const blob = new Blob([response.data], {
            type: 'application/pdf'
        });
        const fileURL = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = fileURL;
        link.setAttribute('download', 'notas-servico.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(fileURL);
    } catch (error) {
        console.error('Erro ao exportar PDF das notas:', error);
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            msgs.current?.show({
                severity: 'warn',
                detail: 'Nenhuma nota fiscal autorizada foi encontrada para o período e filtros selecionados.',
                life: 5000
            });
            return;
        }
        if (axios.isAxiosError(error) && error.response?.status === 400) {
            msgs.current?.show({
                severity: 'warn',
                summary: 'Período não informado',
                detail: 'Selecione uma data inicial e uma data final para realizar a exportação do PDF.',
                life: 5000
            });

            return;
        }
        msgs.current?.show({
            severity: 'error',
            summary: 'Atenção:',
            detail: 'Ocorreu um erro inesperado ao gerar o PDF. Tente novamente.',
            life: 5000
        });
    }
};

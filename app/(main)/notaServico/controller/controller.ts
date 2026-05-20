import axios from 'axios';
import api from '@/app/services/api';
import { Messages } from 'primereact/messages';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { NfsEntity, PrepararNfs } from '@/app/entity/NfsEntity';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { mapDateRangeToParams } from '@/app/components/calendarComponent/controller';
import { DetalPrestadorValoresEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import { ExportarPdfNfsePayload, ListNotaServicoParams, NotaFiscalParams, NotaFiscalQueryParams } from '../types/notaServico';


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
export const fetchNotaServico = async (
    params: NotaFiscalParams,
    msgs?: any
) => {
    try {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value != null && value !== '') {
                searchParams.append(key, String(value));
            }
        });

        const response = await api.get(`/nfse?${searchParams.toString()}`);

        console.log('resposta', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Erro ao buscar notas fiscais:', error);
        if (error.response?.status === 403) {
            msgs?.current?.show({
                severity: 'warn',
                summary: 'Acesso negado',
                detail:
                    'Você não possui permissão para visualizar notas fiscais.',
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
                summary: 'Erro',
                detail:
                    error.response?.data?.mensagem ||
                    'Não foi possível carregar as notas fiscais.',
                life: 5000
            });
        } else {
            msgs?.current?.show({
                severity: 'error',
                summary: 'Erro interno',
                detail:
                    error.message ||
                    'Ocorreu um erro inesperado ao carregar as notas fiscais.',
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
export const listNotaServico = async (
    params: ListNotaServicoParams,
    msgs?: any
) => {
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
export const deletarNotaServico = async (nfsId: number, msgs: any, listPaginationNotaServico: Record<string, any>, listarInativos: boolean, setLoading: (state: boolean) => void, searchTerm: string) => {
    try {
        await api.delete(`/nfse/cancelar${String(nfsId)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Nfse Cancelada com sucesso.'
            }
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Erro',
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
        const response = await api.post('/nfse/preparar-emissao', prepararNfs);
        console.log('[NotaServico] Retorno do backend ao preparar NFS-e:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao preparar NFS-e:', error);
        if (axios.isAxiosError(error)) {
            const msg = error.response?.data?.message || 'Erro ao preparar NFS-e.';
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: msg,
                life: 5000
            });
        } else {
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro inesperado ao preparar NFS-e.',
                life: 5000
            });
        }
    }
};
export const createdNotaServico = async (
    nfs: NfsEntity,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    msgs: any,
    router: AppRouterInstance
) => {
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
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'NFS-e cadastrada com sucesso!'
        });
        console.log('Response NFS:', response);
        router.push('/notaServico');
    } catch (error: any) {
        let summaryMessage = 'Erro';
        let detailMessage = 'Ocorreu um erro ao cadastrar a NFS-e.';
        if (error.response) {
            console.group('retorno:');
            console.log('Status:', error.response.status);
            console.log('Headers:', error.response.headers);
            console.log('resp:', error.response.data);
            console.groupEnd();
            if (error.response?.status === 409) {
                msgs.current?.show({
                    severity: 'warn',
                    summary: 'Nota já emitida',
                    detail: 'Já existe uma emissão recente de Nota Fiscal para esta empresa, cliente e serviço.',
                    life: 7000
                });
                return;
            }
        } else {
            summaryMessage = 'Erro interno';
            detailMessage =
                error.message || 'Ocorreu um erro inesperado.';

            console.error('Erro interno:', error);
        }
        msgs.current?.show({
            severity: 'error',
            summary: summaryMessage,
            detail: detailMessage,
            life: 6000
        });
    }
};
// export const createdNotaServico = async (nfs: NfsEntity, setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>, msgs: any, router: AppRouterInstance) => {
//     try {
//         const valoresNormalizados = normalizeNfseServiceValores(nfs.servico?.valores);
//         const valorServicoNormalizado = (() => {
//             const raw = nfs.servico.valores?.valor_servico as string | number | undefined;
//             if (typeof raw === 'string') {
//                 const normalized = raw.replace(',', '.');
//                 return parseFloat(normalized) || 0;
//             }

//             return parseFloat(Number(raw ?? 0).toFixed(2));
//         })();
//         const dataNfse = {
//             ...nfs,
//             servico: {
//                 ...nfs.servico,
//                 valores: valoresNormalizados.copyWith({
//                     valor_servico: valorServicoNormalizado
//                 })
//             }
//         };
//         console.log('Envio:', { nfse: dataNfse });
//         const response = await api.post('/nfse', { nfse: dataNfse });
//         msgs.current?.show({
//             severity: 'success',
//             summary: 'Sucesso',
//             detail: 'NFS-E cadastrada com sucesso!'
//         });
//         console.log('Response NFS:', response);
//         router.push('/notaServico');
//     } catch (error: any) {
//         let summaryMessage = 'Erro';
//         let detailMessage = 'Ocorreu um erro ao cadastrar a NFS.';
//         if (error.response) {
//             console.group('retorno:');
//             console.log('Status:', error.response.status);
//             console.log('Headers:', error.response.headers);
//             console.log('resp:', error.response.data);
//             console.groupEnd();
//             detailMessage = error.response.data?.mensagem || detailMessage;
//         } else {
//             summaryMessage = 'Erro Interno';
//             detailMessage = error.message || 'Ocorreu um erro inesperado.';
//             console.error('Erro interno:', error);
//         }

//         msgs.current?.show({
//             severity: 'error',
//             summary: summaryMessage,
//             detail: detailMessage,
//             life: 5000
//         });
//     }
// };
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
            detail: 'Erro ao baixar XML da Nota Fiscal. Tente novamente em instantes. Caso o problema persista, entre em contato com o suporte.',
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
            summary: 'Erro',
            detail: 'Não foi possível abrir o PDF da nota.',
            life: 5000
        });
    }
};
export const exportarPdfNotasServico = async (
    payload: ExportarPdfNfsePayload,
    msgs: React.RefObject<Messages | null>
) => {
    try {
        const response = await api.post('/nfse/exportar-pdf', payload, {
            responseType: 'blob'
        });
        const blob = new Blob([response.data], { type: 'application/pdf' });
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
        msgs.current?.show({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível exportar o PDF das notas.',
            life: 5000
        });
    }
};

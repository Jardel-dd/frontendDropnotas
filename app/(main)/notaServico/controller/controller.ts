import axios from 'axios';
import api from '@/app/services/api';
import { Messages } from 'primereact/messages';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { NfsEntity, PrepararNfs } from '@/app/entity/NfsEntity';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { DateRangeValue } from '@/app/components/calendarComponent/dataRangerPicker';
import { mapDateRangeToParams } from '@/app/components/calendarComponent/controller';
export type NotaFiscalQueryParams = NotaFiscalParams & {
    page?: number;
    size?: number;
};
export interface ListNotaServicoParams {
    page: number;
    size: number;
    termo?: string;
    status?: string;
    dateRange?: DateRangeValue;
    id_empresa?: number | null;
    id_cliente?: number | null;
    id_vendedor?: number | null;
}
export type NotaFiscalParams = {
    termo?: string | null;
    id_empresa?: number | null;
    id_cliente?: number | null;
    id_vendedor?: number | null;
    status?: string | null;
    data_hora_inicio?: string | null;
    data_hora_fim?: string | null;
    sort?: string;
};
export const fetchNotaServico = async (params: NotaFiscalParams) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value != null && value !== '') {
            searchParams.append(key, String(value));
        }
    });
    const response = await api.get(`/nfse?${searchParams.toString()}`);
    console.log('resposta', response.data);

    return response.data;
};
export const listNotaServico = async (params: ListNotaServicoParams) => {
    const dateParams = mapDateRangeToParams(params.dateRange);

    const query: NotaFiscalQueryParams = {
        page: params.page,
        size: params.size,
        termo: params.termo ?? '',
        status: params.status,
        id_empresa: params.id_empresa ?? undefined,
        id_cliente: params.id_cliente ?? undefined,
        id_vendedor: params.id_vendedor ?? undefined,
        sort: 'asc',
        ...dateParams
    };

    return await fetchNotaServico(query);
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
// export const fetchEmpresaController = async (): Promise<CompanyEntity[]> => {
//     try {
//         const response = await api.get('/empresa', {
//             params: { ativo: true }
//         });
//         let empresa = [];
//         if (Array.isArray(response.data)) {
//             empresa = response.data;
//         } else if (response.data && Array.isArray(response.data.content)) {
//             empresa = response.data.content;
//         }
//         const idsData: CompanyEntity[] = empresa.map((user: any) => ({
//             id: user.id,
//             nome: user.razao_social
//         }));
//         console.log('Empresa carregados para o seleção:', idsData);
//         return idsData;
//     } catch (error) {
//         console.error('Erro ao carregar empresa :', error);
//         return [];
//     }
// };
// export const fetchServiceController = async (): Promise<ServiceEntity[]> => {
//     try {
//         const response = await api.get('/servico/', {
//             params: { ativo: true }
//         });
//         let servico = [];
//         if (Array.isArray(response.data)) {
//             servico = response.data;
//         } else if (response.data && Array.isArray(response.data.content)) {
//             servico = response.data.content;
//         }
//         const idsDataServico: ServiceEntity[] = servico.map((user: any) => ({
//             id: user.id,
//             nome: user.descricao
//         }));
//         console.log('Servico carregados para o seleção:', idsDataServico);
//         return idsDataServico;
//     } catch (error) {
//         console.error('Erro ao carregar Servico :', error);
//         return [];
//     }
// };
// export const fetchPessoaController = async (): Promise<PessoaEntity[]> => {
//     try {
//         const response = await api.get('/pessoa', {
//             params: { ativo: true }
//         });
//         let pessoa = [];
//         if (Array.isArray(response.data)) {
//             pessoa = response.data;
//         } else if (response.data && Array.isArray(response.data.content)) {
//             pessoa = response.data.content;
//         }
//         const idsDataPessoa: PessoaEntity[] = pessoa.map((user: any) => ({
//             id: user.id,
//             nome: user.razao_social
//         }));
//         console.log('Pessoa carregados para o seleção:', idsDataPessoa);
//         return idsDataPessoa;
//     } catch (error) {
//         console.error('Erro ao carregar Pessoa :', error);
//         return [];
//     }
// };
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
        return response.data;
    } catch (error) {
        console.error('Erro ao preparar NFS-e:', error);
        if (axios.isAxiosError(error)) {
            const msg = error.response?.data?.message || 'Erro ao preparar NFS-e.';
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: msg,
                sticky: true
            });
        } else {
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro inesperado ao preparar NFS-e.',
                sticky: true
            });
        }
    }
};
export const createdNotaServico = async (nfs: NfsEntity, setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>, msgs: any, router: AppRouterInstance) => {
    try {
        const dataNfse = {
            ...nfs,
            servico: {
                ...nfs.servico,
                valores: {
                    ...nfs.servico.valores,
                    valor_servico: (() => {
                        const raw = nfs.servico.valores?.valor_servico as string | number | undefined;
                        if (typeof raw === 'string') {
                            const normalized = raw.replace(',', '.');
                            return parseFloat(normalized) || 0;
                        }

                        return parseFloat(Number(raw ?? 0).toFixed(2));
                    })()
                }
            }
        };
        console.log('Envio:', { nfse: dataNfse });
        const response = await api.post('/nfse', { nfse: dataNfse });
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'NFS-E cadastrada com sucesso!'
        });
        console.log('Response NFS:', response);
        router.push('/notaServico');
    } catch (error: any) {
        let summaryMessage = 'Erro';
        let detailMessage = 'Ocorreu um erro ao cadastrar a NFS.';
        if (error.response) {
            console.group('retorno:');
            console.log('Status:', error.response.status);
            console.log('Headers:', error.response.headers);
            console.log('resp:', error.response.data);
            console.groupEnd();
            detailMessage = error.response.data?.mensagem || detailMessage;
        } else {
            summaryMessage = 'Erro Interno';
            detailMessage = error.message || 'Ocorreu um erro inesperado.';
            console.error('Erro interno:', error);
        }

        msgs.current?.show({
            severity: 'error',
            summary: summaryMessage,
            detail: detailMessage,
            life: 5000
        });
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
            summary: 'Erro',
            detail: 'Não foi possível baixar o PDF da nota.',
            sticky: true
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
            summary: 'Erro',
            detail: 'Não foi possível baixar o XML da nota.',
            sticky: true
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
                sticky: true
            });
        }
        setTimeout(() => window.URL.revokeObjectURL(fileURL), 5000);
    } catch (error) {
        msgs.current?.show({
            severity: 'error',
            summary: 'Erro',
            detail: 'Não foi possível abrir o PDF da nota.',
            sticky: true
        });
    }
};

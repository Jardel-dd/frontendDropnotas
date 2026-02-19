import axios from 'axios';
import api from '@/app/services/api';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { DateRangeValue } from '@/app/components/calendarComponent/dataRangerPicker';

export type OrdemServicoParams = {
    termo?: string | null;
    idEmpresa?: number | null;
    idCliente?: number | null;
    idVendedor?: number | null;
    status?: string | null;
    data_hora_inicio?: string | null;
    data_hora_fim?: string | null;
    tipo_data?: string | null;
};
export const fetchOrdemServico = async (params: OrdemServicoParams) => {
    const searchParams = new URLSearchParams();
    if (params.termo != null) {
        searchParams.append('termo', String(params.termo));
    }
    if (params.idEmpresa != null) {
        searchParams.append('id_empresa', String(params.idEmpresa));
    }
    if (params.idCliente != null) {
        searchParams.append('id_cliente', String(params.idCliente));
    }
    if (params.status) {
        searchParams.append('status', params.status);
    }
    if (params.data_hora_inicio) {
        searchParams.append('data_hora_inicio', params.data_hora_inicio);
    }
    if (params.data_hora_fim) {
        searchParams.append('data_hora_final', params.data_hora_fim);
    }
    if (params.tipo_data) {
        searchParams.append('tipo_data', params.tipo_data);
    }
    const queryString = searchParams.toString();
    const url = `/ordem-servico${queryString ? `?${queryString}` : ''}`;

    const response = await api.get(url);
    return response.data;
};
export const list = async (pagination: any, listarInativos: boolean, setLoading: (v: boolean) => void, termo?: string, status?: string, periodo?: DateRangeValue) => {
    const params: any = {
        page: pagination.pageable.pageNumber,
        size: pagination.pageable.pageSize
    };
    if (termo) params.termo = termo;
    if (status !== undefined && status !== null && status !== '') {
        params.status = status;
    }
    return api.get('/ordem-servico', { params });
};
export const deletar = async (id: number, msgs: any, setLoading: (state: boolean) => void, searchTerm: string) => {
    try {
        await api.delete(`/ordem-servico/${String(id)}`);
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Ordem de Serviço Cancelada com sucesso.'
            }
        ]);
    } catch (error) {
        msgs.current?.clear();
        msgs.current?.show([
            {
                life: 3000,
                severity: 'error',
                summary: 'Erro',
                detail: 'Houve um erro ao tentar Cancelar Ordem de Serviço, tente novamente.'
            }
        ]);
    }
};
export const preparar = async (msgs: any) => {
    try {
        const response = await api.post('/ordem-servico/preparar');
        console.log(' Resposta do backend:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao preparar OS:', error);
        if (axios.isAxiosError(error)) {
            const msg = error.response?.data?.message || 'Erro ao preparar Ordem de Serviço.';
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
                detail: 'Erro inesperado ao preparar Ordem de Serviço.',
                sticky: true
            });
        }
    }
};
export const createdOrdemServico = async (
    ordemServico: ServiceOrderEntity,
    selectedEmpresa: CompanyEntity | null,
    selectedCliente: PessoaEntity | null,
    selectedServico: ServiceEntity | null,
    selectedVendedor: VendedorEntity | null,
    selectedFormaPagamento: FormaPagamentoEntity | null,
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
    setEmitirOS: React.Dispatch<React.SetStateAction<ServiceOrderEntity>>,
    redirectAfterSave: boolean,
    router: AppRouterInstance,
    msgs: any
) => {
    const toISO = (d?: Date | string | null): string => {
        if (!d) return new Date().toISOString();
        const dt = d instanceof Date ? d : new Date(d);
        return isNaN(dt.getTime()) ? new Date().toISOString() : dt.toISOString();
    };

    const num = (v: unknown, fallback = 0): number => {
        const n = typeof v === 'string' ? Number((v as string).replace(',', '.')) : Number(v);
        return Number.isFinite(n) ? n : fallback;
    };
    const servicoFromState: any = (ordemServico as any).servicos;
    const servicoObjState = Array.isArray(servicoFromState) ? servicoFromState[0] : servicoFromState;
    const baseServico = selectedServico ?? servicoObjState ?? null;
    const formaArrFromState: any[] = (ordemServico as any).formas_recebimento;
    const formaObjFromState: any = (ordemServico as any).forma_recebimento;
    const baseForma = selectedFormaPagamento ?? (Array.isArray(formaArrFromState) ? formaArrFromState[0] : formaObjFromState) ?? null;
    const newErrors: Record<string, string> = {};
    if (!selectedEmpresa && !ordemServico.id_empresa) newErrors.selectedEmpresa = 'Selecione a empresa.';
    if (!selectedCliente && !ordemServico.id_cliente) newErrors.selectedCliente = 'Selecione o cliente.';
    if (!baseServico) newErrors.selectedServico = 'Selecione o serviço.';
    if (!selectedVendedor && !ordemServico.id_vendedor) {
    }
    if (!baseForma) newErrors.selectedFormaPagamento = 'Selecione a forma de pagamento.';
    if (Object.keys(newErrors).length > 0) {
        setErrors((prev) => ({ ...prev, ...newErrors }));
        msgs.current?.show({
            severity: 'warn',
            summary: 'Campos obrigatórios',
            detail: 'Preencha os campos destacados antes de emitir.',
            life: 4000
        });
        return;
    }
    const servicos = baseServico
        ? [
              {
                  id_servico: num((baseServico as any).id_servico ?? (baseServico as any).id, 0),
                  descricao: (baseServico as any).descricao ?? '',
                  descricao_completa: (baseServico as any).descricao_completa ?? '',
                  codigo: (baseServico as any).codigo ?? '',
                  quantidade: num((baseServico as any).quantidade, 0),
                  valor_servico: num((baseServico as any).valor_servico, 0),
                  valor_desconto: num((baseServico as any).valor_desconto, 0)
              }
          ]
        : [];
    const formas_recebimento = baseForma
        ? [
              {
                  id_forma_recebimento: num((baseForma as any).id_forma_recebimento ?? (baseForma as any).id, 0),
                  valor_recebido: num((baseForma as any).valor_recebido, 0),
                  valor_taxa: num((baseForma as any).valor_taxa, 0),
                  percentual_taxa: num((baseForma as any).percentual_taxa, 0)
              }
          ]
        : [];

    const OrdemServicoData = {
        numero: num(ordemServico.numero, 0),
        descricao: ordemServico.descricao ?? '',
        consideracoes_finais: ordemServico.consideracoes_finais ?? '',
        data_hora_inicio: toISO(ordemServico.data_hora_inicio),
        data_hora_prevista: toISO(ordemServico.data_hora_prevista),
        data_hora_conclusao: toISO(ordemServico.data_hora_conclusao),
        orcar: !!ordemServico.orcar,
        observacao_servico: ordemServico.observacao_servico ?? '',
        observacao_interna: ordemServico.observacao_interna ?? '',
        id_vendedor: num(selectedVendedor?.id ?? (ordemServico as any).id_vendedor, 0),
        id_cliente: num(selectedCliente?.id ?? (ordemServico as any).id_cliente, 0),
        id_empresa: num(selectedEmpresa?.id ?? (ordemServico as any).id_empresa, 0),
        servicos,
        formas_recebimento
    };
    try {
        const resp = await api.post('/ordem-servico', OrdemServicoData);
        const created = new ServiceOrderEntity(resp.data?.ordemServico ?? resp.data);
        msgs.current?.show({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Ordem de Serviço cadastrada com sucesso!'
        });
        console.log('Payload enviado:', OrdemServicoData);
        if (redirectAfterSave) {
            router.push('/ordemServicos');
        }
        setEmitirOS(created);
        return created;
    } catch (error: any) {
        console.group('Erro ao criar OS');
        console.error('Erro completo:', error);
        console.log(' Payload enviado:', OrdemServicoData);
        if (error?.response) {
            const { status, data } = error.response;
            if (data?.errors && typeof data.errors === 'object') {
                console.log('Errors de validação:', data.errors);
                setErrors((prev) => ({ ...prev, ...data.errors }));
            }
            console.groupEnd();
            msgs.current?.show({
                severity: 'error',
                summary: `Erro ${status}`,
                detail: data?.mensagem || 'Erro ao cadastrar a Ordem de Serviço.',
                life: 6000
            });
        } else {
            console.groupEnd();
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro Interno',
                detail: error?.message || 'Falha na comunicação com o servidor.',
                life: 6000
            });
        }
    }
};

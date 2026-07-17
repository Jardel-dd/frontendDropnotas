'use client';
import LoadingScreen from '@/app/loading';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { OrdemServicoFields } from './ordemServico';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { useRouter, useSearchParams } from 'next/navigation';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';
import { FormCreatedPessoa } from '../../cadastro/pessoas/form/controller';
import { FormCreatedServico } from '../../cadastro/servicos/form/controller';
import { FormCreatedVendedor } from '../../cadastro/vendedores/form/controller';
import { DetalServiceOSEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import FormEmpresaCreated from '@/app/(main)/configuracoes/empresas/form/controller';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FormaPagamentoEntity, Formas_recebimento } from '@/app/entity/FormaPagamento';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { FormCreatedFormaPagamento} from '../../cadastro/formaPagamento/form/controller';
import { validateFieldsOrdemServico } from '@/app/(main)/ordemServicos/controller/validation';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { createdOrdemServico, fetchOrdemServiceByID } from '@/app/(main)/ordemServicos/controller/controller';
import type { PreloadedPessoaData } from '@/app/(main)/cadastro/pessoas/types/pessoa';
import type { PreloadedServicoData } from '@/app/(main)/cadastro/servicos/types/servico';
import type { PreloadedEmpresaData } from '@/app/(main)/configuracoes/empresas/types/empresa';
import { fetchPessoasById } from '@/app/(main)/cadastro/pessoas/controller/controller';
import { fetchServiceFormDataByID, fetchServicesByID } from '@/app/(main)/cadastro/servicos/controller/controller';
import { fetchVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
import { fetchCompanyDropdownByID, fetchCompanyFormDataByID } from '@/app/(main)/configuracoes/empresas/controller/controller';
import { fetchFormaPagamentoByID } from '@/app/(main)/cadastro/formaPagamento/controller/controller';
import { toFormaPagamentoEntity } from '@/app/(main)/cadastro/formaPagamento/types/formaPagamento';
import { createEmptyEmpresa, createEmptyFormaPagamento, createEmptyOrdemServico, createEmptyPessoa, createEmptyServico, createEmptyVendedor, type FormCreatedOrdemServicoProps, type NestedFormRef, type OrdemServicoFieldsProps, type OrdemServicoFormProps, type OrdemServicoFormRef } from '../types/ordemServico';
export const OrdemServicoFormContainer = forwardRef<OrdemServicoFormRef, OrdemServicoFormProps>(
    ({ initialId, msgs, onOrdemServicoChange, onErrorsChange, redirectAfterSave = true, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
        const router = useRouter();
        const searchParams = useSearchParams();
        const formRef = useRef<NestedFormRef>(null);
        const onOrdemServicoChangeRef = useRef(onOrdemServicoChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [emitirOS, setEmitirOS] = useState<ServiceOrderEntity>(createEmptyOrdemServico());
        const [servico, setServico] = useState<ServiceEntity>(createEmptyServico());
        const [pessoa, setPessoa] = useState<PessoaEntity[]>([createEmptyPessoa()]);
        const [empresa, setEmpresa] = useState<CompanyEntity>(createEmptyEmpresa());
        const [vendedor, setVendedor] = useState<VendedorEntity>(createEmptyVendedor());
        const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoEntity>(createEmptyFormaPagamento());
        const [reloadKeyPessoa, setReloadKeyPessoa] = useState(0);
        const [reloadKeyEmpresa, setReloadKeyEmpresa] = useState(0);
        const [reloadKeyServico, setReloadKeyServico] = useState(0);
        const [reloadKeyVendedor, setReloadKeyVendedor] = useState(0);
        const [reloadKeyFormaPagamento, setReloadKeyFormaPagamento] = useState(0);
        const [pessoaDialogKey, setPessoaDialogKey] = useState(0);
        const [empresaDialogKey, setEmpresaDialogKey] = useState(0);
        const [servicoDialogKey, setServicoDialogKey] = useState(0);
        const [vendedorDialogKey, setVendedorDialogKey] = useState(0);
        const [formaPagamentoDialogKey, setFormaPagamentoDialogKey] = useState(0);
        const [showModalPessoa, setShowModalPessoa] = useState(false);
        const [showModalEmpresa, setShowModalEmpresa] = useState(false);
        const [showModalServico, setShowModalServico] = useState(false);
        const [showModalVendedor, setShowModalVendedor] = useState(false);
        const [showModalFormaPagamento, setShowModalFormaPagamento] = useState(false);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [selectedCliente, setSelectedCliente] = useState<PessoaEntity | null>(null);
        const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity | null>(null);
        const [selectedServico, setSelectedServico] = useState<ServiceEntity | null>(null);
        const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
        const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<FormaPagamentoEntity | null>(null);
        const [isPessoaDialogLoading, setIsPessoaDialogLoading] = useState(false);
        const [isEmpresaDialogLoading, setIsEmpresaDialogLoading] = useState(false);
        const [isServicoDialogLoading, setIsServicoDialogLoading] = useState(false);
        const [isVendedorDialogLoading, setIsVendedorDialogLoading] = useState(false);
        const [isFormaPagamentoDialogLoading, setIsFormaPagamentoDialogLoading] = useState(false);
        const [editingPessoaId, setEditingPessoaId] = useState<string | null>(null);
        const [editingEmpresaId, setEditingEmpresaId] = useState<string | null>(null);
        const [editingServicoId, setEditingServicoId] = useState<string | null>(null);
        const [editingVendedorId, setEditingVendedorId] = useState<string | null>(null);
        const [editingFormaPagamentoId, setEditingFormaPagamentoId] = useState<string | null>(null);
        const [preloadedPessoa, setPreloadedPessoa] = useState<PreloadedPessoaData | null>(null);
        const [preloadedEmpresa, setPreloadedEmpresa] = useState<PreloadedEmpresaData | null>(null);
        const [preloadedServico, setPreloadedServico] = useState<PreloadedServicoData | null>(null);
        const [preloadedVendedor, setPreloadedVendedor] = useState<VendedorEntity | null>(null);
        const [preloadedFormaPagamento, setPreloadedFormaPagamento] = useState<FormaPagamentoEntity | null>(null);
        const [stateDisableBtnCreatedOrdemServico, setStateDisableBtnCreatedOrdemServico] = useState(false);
        const clearFieldError = (field: string) => {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        };
        const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
            const { id, value, checked, type } = event.target;
            let newValue: any = type === 'checkbox' || type === 'switch' ? !!checked : type === 'number' ? Number(value) : value;
            if (newValue instanceof Date) {
                newValue = new Date(newValue.getTime());
            }
            setEmitirOS((prev) => {
                const state = prev as any;
                if (id.includes('.')) {
                    const [parent, child] = id.split('.');
                    return prev.copyWith({
                        [parent]: state[parent]?.copyWith ? state[parent].copyWith({ [child]: newValue }) : { ...state[parent], [child]: newValue }
                    });
                }
                return prev.copyWith({ [id]: newValue });
            });
        };

        const handleEmpresaChange = (empresaSelecionada: CompanyEntity | null) => {
            setSelectedEmpresa(empresaSelecionada);
            if (empresaSelecionada) {
                handleAllChanges({ target: { id: 'id_empresa', value: empresaSelecionada.id, type: 'input' } });
            }
            clearFieldError('selectedEmpresa');
        };

        const handleServicoChange = (servicoSelecionado: ServiceEntity | null) => {
            if (!servicoSelecionado) {
                setSelectedServico(null);
                setEmitirOS((prev) =>
                    prev.copyWith({
                        servicos: new DetalServiceOSEntity({
                            ...prev.servicos,
                            id_servico: 0,
                            descricao: '',
                            codigo: '',
                            descricao_completa: '',
                            valor_servico: 0,
                            valor_desconto: 0,
                            quantidade: prev.servicos.quantidade || 1
                        })
                    })
                );
                clearFieldError('selectedService');
                return;
            }

            setSelectedServico(servicoSelecionado);
            setEmitirOS((prev) =>
                prev.copyWith({
                    servicos: new DetalServiceOSEntity({
                        id_servico: servicoSelecionado.id,
                        descricao: servicoSelecionado.descricao,
                        codigo: servicoSelecionado.codigo ?? '',
                        descricao_completa: servicoSelecionado.descricao_completa ?? '',
                        valor_servico: servicoSelecionado.valor_servico ?? 0,
                        valor_desconto: servicoSelecionado.valor_desconto ?? 0,
                        quantidade: prev.servicos.quantidade || 1
                    })
                })
            );
            clearFieldError('selectedService');
        };

        const handleFormaPagamentoChange = (formaPagamentoSelecionada: FormaPagamentoEntity | null) => {
            if (!formaPagamentoSelecionada) {
                setSelectedFormaPagamento(null);
                setEmitirOS((prev) =>
                    prev.copyWith({
                        id_forma_pagamento: 0,
                        formas_recebimento: new Formas_recebimento({
                            id_forma_recebimento: 0,
                            valor_taxa: 0,
                            valor_recebido: 0,
                            percentual_taxa: 0
                        })
                    })
                );
                clearFieldError('selectedFormaPagamento');
                return;
            }

            setSelectedFormaPagamento(formaPagamentoSelecionada);
            setEmitirOS((prev) =>
                prev.copyWith({
                    id_forma_pagamento: formaPagamentoSelecionada.id,
                    formas_recebimento: new Formas_recebimento({
                        id_forma_recebimento: formaPagamentoSelecionada.id,
                        valor_taxa: formaPagamentoSelecionada.valor_taxa,
                        valor_recebido: formaPagamentoSelecionada.valor_recebido,
                        percentual_taxa: formaPagamentoSelecionada.percentual_taxa
                    })
                })
            );
            clearFieldError('selectedFormaPagamento');
        };

        const handleVendedorChange = (vendedorSelecionado: VendedorEntity | null) => {
            if (!vendedorSelecionado) {
                setSelectedVendedor(null);
                handleAllChanges({ target: { id: 'id_vendedor', value: 0, type: 'input' } });
                clearFieldError('selectedVendedor');
                return;
            }

            setSelectedVendedor(vendedorSelecionado);
            handleAllChanges({ target: { id: 'id_vendedor', value: vendedorSelecionado.id, type: 'input' } });
            clearFieldError('selectedVendedor');
        };

        const handlePessoaChange = (pessoaSelecionada: PessoaEntity | null) => {
            setSelectedCliente(pessoaSelecionada);
            if (pessoaSelecionada) {
                handleAllChanges({ target: { id: 'id_cliente', value: pessoaSelecionada.id, type: 'input' } });
            }
            clearFieldError('selectedCliente');
        };
        const handleValidateDescricao = () => {
            setTouchedFields((prev) => ({ ...prev, descricao: true }));
            validateFieldsOrdemServico(emitirOS, selectedEmpresa, selectedCliente, selectedServico, selectedVendedor, selectedFormaPagamento, setErrors, msgs);
        };
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) event.preventDefault();
            msgs.current?.clear();
            if (isLoadingBtnCreated) return;
            const isValid = validateFieldsOrdemServico(emitirOS, selectedEmpresa, selectedCliente, selectedServico, selectedVendedor, selectedFormaPagamento, setErrors, msgs);
            if (!isValid) {
                setTouchedFields((prev) => ({ ...prev, submit: true }));
                return;
            }
            setIsLoadingBtnCreated(true);
            setStateDisableBtnCreatedOrdemServico(true);
            try {
                const created = await createdOrdemServico(emitirOS, selectedEmpresa, selectedCliente, selectedServico, selectedVendedor, selectedFormaPagamento, setErrors, setEmitirOS, redirectAfterSave, router, msgs);
                if (created) {
                    onSaved?.(created);
                    onClose?.();
                }
            } finally {
                setIsLoadingBtnCreated(false);
                setStateDisableBtnCreatedOrdemServico(false);
            }
        };
        const listagemOrdemServicoID = async (id: string) => {
            try {
                setIsLoading(true);
                const { dataOrdemServico, selectedEmpresa, selectedCliente, selectedService, selectedVendedor, selectedFormaPagamento } = await fetchOrdemServiceByID(id);
                setEmitirOS(dataOrdemServico);
                setSelectedEmpresa(selectedEmpresa);
                setSelectedCliente(selectedCliente);
                setSelectedServico(selectedService);
                setSelectedVendedor(selectedVendedor);
                setSelectedFormaPagamento(selectedFormaPagamento);
            } finally {
                setIsLoading(false);
            }
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
                console.error('Erro ao pre-carregar empresa para edicao da ordem de servico:', error);
                setIsEmpresaDialogLoading(false);
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

                setEmpresa(empresaAtualizada);
                setSelectedEmpresa(empresaAtualizada);
                handleAllChanges({ target: { id: 'id_empresa', value: empresaAtualizada.id, type: 'input' } });
                clearFieldError('selectedEmpresa');
                setReloadKeyEmpresa((current) => current + 1);
            } finally {
                closeEmpresaDialog();
            }
        };
        const handlePessoa = (updatedPessoa: PessoaEntity) => {
            setPessoa([updatedPessoa]);
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
                console.error('Erro ao pre-carregar cliente/fornecedor para edicao da ordem de servico:', error);
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

                setPessoa([pessoaAtualizada]);
                setSelectedCliente(pessoaAtualizada);
                handleAllChanges({ target: { id: 'id_cliente', value: pessoaAtualizada.id, type: 'input' } });
                clearFieldError('selectedCliente');
                setReloadKeyPessoa((current) => current + 1);
            } finally {
                closePessoaDialog();
            }
        };
        const handleServico = (updatedServico: ServiceEntity) => {
            setServico(updatedServico);
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
                console.error('Erro ao pre-carregar servico para edicao da ordem de servico:', error);
                setIsServicoDialogLoading(false);
            }
        };
        const closeServicoDialog = () => {
            setShowModalServico(false);
            setEditingServicoId(null);
            setIsServicoDialogLoading(true);
            setPreloadedServico(null);
        };
        const handleServiceSaved = async (created: ServiceEntity) => {
            setIsServicoDialogLoading(true);
            let servicoAtualizado = created;

            try {
                if (created?.id) {
                    const response = await fetchServicesByID(String(created.id));
                    servicoAtualizado = response.servico;
                }

                setServico(servicoAtualizado);
                handleServicoChange(servicoAtualizado);
                setReloadKeyServico((current) => current + 1);
            } finally {
                closeServicoDialog();
            }
        };

        const handleVendedor = (updatedVendedor: VendedorEntity) => {
            setVendedor(updatedVendedor);
        };
        const openCreateVendedorDialog = () => {
            setIsVendedorDialogLoading(true);
            setEditingVendedorId(null);
            setPreloadedVendedor(null);
            setVendedorDialogKey((current) => current + 1);
            setShowModalVendedor(true);
        };
        const openEditVendedorDialog = async (vendedorSelecionado: VendedorEntity) => {
            if (!vendedorSelecionado?.id) {
                return;
            }

            setIsVendedorDialogLoading(true);
            try {
                const vendedorId = String(vendedorSelecionado.id);
                const { dataVendedor } = await fetchVendedor(vendedorId);
                setPreloadedVendedor(dataVendedor);
                setEditingVendedorId(vendedorId);
                setVendedorDialogKey((current) => current + 1);
                setShowModalVendedor(true);
            } catch (error) {
                console.error('Erro ao pre-carregar vendedor para edicao da ordem de servico:', error);
                setIsVendedorDialogLoading(false);
            }
        };
        const closeVendedorDialog = () => {
            setShowModalVendedor(false);
            setEditingVendedorId(null);
            setIsVendedorDialogLoading(true);
            setPreloadedVendedor(null);
        };
        const handleVendedorSaved = async (created: VendedorEntity) => {
            setIsVendedorDialogLoading(true);
            let vendedorAtualizado = created;

            try {
                if (created?.id) {
                    const { dataVendedor } = await fetchVendedor(String(created.id));
                    vendedorAtualizado = dataVendedor;
                }

                setVendedor(vendedorAtualizado);
                setSelectedVendedor(vendedorAtualizado);
                handleAllChanges({ target: { id: 'id_vendedor', value: vendedorAtualizado.id, type: 'input' } });
                clearFieldError('selectedVendedor');
                setReloadKeyVendedor((current) => current + 1);
            } finally {
                closeVendedorDialog();
            }
        };

        const handleFormaPagamento = (updatedFormaPagamento: FormaPagamentoEntity) => {
            setFormaPagamento(updatedFormaPagamento);
        };
        const openCreateFormaPagamentoDialog = () => {
            setIsFormaPagamentoDialogLoading(true);
            setEditingFormaPagamentoId(null);
            setPreloadedFormaPagamento(null);
            setFormaPagamentoDialogKey((current) => current + 1);
            setShowModalFormaPagamento(true);
        };
        const openEditFormaPagamentoDialog = async (formaPagamentoSelecionada: FormaPagamentoEntity) => {
            if (!formaPagamentoSelecionada?.id) {
                return;
            }

            setIsFormaPagamentoDialogLoading(true);

            try {
                const formaPagamentoId = String(formaPagamentoSelecionada.id);
                const response = await fetchFormaPagamentoByID(formaPagamentoId);
                setPreloadedFormaPagamento(toFormaPagamentoEntity(response.formaPagamento));
                setEditingFormaPagamentoId(formaPagamentoId);
                setFormaPagamentoDialogKey((current) => current + 1);
                setShowModalFormaPagamento(true);
            } catch (error) {
                console.error('Erro ao pre-carregar forma de pagamento para edicao da ordem de servico:', error);
                setIsFormaPagamentoDialogLoading(false);
            }
        };
        const closeFormaPagamentoDialog = () => {
            setShowModalFormaPagamento(false);
            setEditingFormaPagamentoId(null);
            setIsFormaPagamentoDialogLoading(true);
            setPreloadedFormaPagamento(null);
        };
        const handleFormaPagamentoSaved = async (created: FormaPagamentoEntity) => {
            setIsFormaPagamentoDialogLoading(true);
            let formaPagamentoAtualizada = created;

            try {
                if (created?.id) {
                    const response = await fetchFormaPagamentoByID(String(created.id));
                    formaPagamentoAtualizada = toFormaPagamentoEntity(response.formaPagamento);
                }

                setFormaPagamento(formaPagamentoAtualizada);
                handleFormaPagamentoChange(formaPagamentoAtualizada);
                setReloadKeyFormaPagamento((current) => current + 1);
            } finally {
                closeFormaPagamentoDialog();
            }
        };

        const handleErrorsChange = (updatedErrors: Record<string, string>) => {
            setErrors(updatedErrors);
        };

        const handleDateChange = (field: keyof ServiceOrderEntity, value: Date | null) => {
            setEmitirOS((prev) => prev.copyWith({ [field]: value }));
        };

        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));

        useEffect(() => {
            onOrdemServicoChangeRef.current = onOrdemServicoChange;
        }, [onOrdemServicoChange]);

        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);

        useEffect(() => {
            const numeroOSParam = searchParams.get('numero');
            const idParam = searchParams.get('id');
            if (numeroOSParam && !idParam) {
                setEmitirOS((prev) => prev.copyWith({ numero: Number(numeroOSParam) }));
            }
        }, [searchParams]);

        useEffect(() => {
            if (initialId) {
                listagemOrdemServicoID(initialId).finally(() => setIsLoading(false));
                return;
            }
            setIsLoading(false);
        }, [initialId]);

        useEffect(() => {
            if (Object.values(touchedFields).some(Boolean)) {
                validateFieldsOrdemServico(emitirOS, selectedEmpresa, selectedCliente, selectedServico, selectedVendedor, selectedFormaPagamento, setErrors, msgs);
            }
        }, [emitirOS, selectedEmpresa, selectedCliente, selectedServico, selectedVendedor, selectedFormaPagamento, touchedFields, msgs]);

        useEffect(() => {
            onOrdemServicoChangeRef.current?.(emitirOS);
        }, [emitirOS]);

        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);

        if (isLoading && initialId) {
            return <LoadingScreen loadingText="Carregando dados para emissao da Ordem de Servico..." />;
        }

        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        const isSubmitDisabled =
            stateDisableBtnCreatedOrdemServico ||
            isLoadingBtnCreated ||
            Object.keys(errors).length > 0 ||
            !emitirOS.descricao?.trim() ||
            !emitirOS.id_empresa ||
            !emitirOS.id_cliente ||
            !emitirOS.id_vendedor ||
            !emitirOS.id_forma_pagamento ||
            !emitirOS.servicos.quantidade;

        return (
            <>
                <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                    <Messages ref={msgs} className="custom-messages" />
                    <div className="scrollable-container shared-form-content">
                        <OrdemServicoFields
                            emitirOS={emitirOS}
                            errors={errors}
                            reloadKeyPessoa={reloadKeyPessoa}
                            reloadKeyEmpresa={reloadKeyEmpresa}
                            reloadKeyServico={reloadKeyServico}
                            reloadKeyVendedor={reloadKeyVendedor}
                            reloadKeyFormaPagamento={reloadKeyFormaPagamento}
                            selectedCliente={selectedCliente}
                            selectedEmpresa={selectedEmpresa}
                            selectedServico={selectedServico}
                            selectedVendedor={selectedVendedor}
                            selectedFormaPagamento={selectedFormaPagamento}
                            onChange={handleAllChanges}
                            onDateChange={handleDateChange}
                            onEmpresaChange={handleEmpresaChange}
                            onPessoaChange={handlePessoaChange}
                            onVendedorChange={handleVendedorChange}
                            onFormaPagamentoChange={handleFormaPagamentoChange}
                            onServicoChange={handleServicoChange}
                            onAddEmpresa={openCreateEmpresaDialog}
                            onEditEmpresa={openEditEmpresaDialog}
                            onAddPessoa={openCreatePessoaDialog}
                            onEditPessoa={openEditPessoaDialog}
                            onAddVendedor={openCreateVendedorDialog}
                            onEditVendedor={openEditVendedorDialog}
                            onAddFormaPagamento={openCreateFormaPagamentoDialog}
                            onEditFormaPagamento={openEditFormaPagamentoDialog}
                            onAddServico={openCreateServicoDialog}
                            onEditServico={openEditServicoDialog}
                            onValidateDescricao={handleValidateDescricao}
                        />
                    </div>
                    <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                        {showBTNPGCreatedAll &&
                         <BTNPGCreatedAll onClick={handleSubmit} label="Criar" disabled={isSubmitDisabled} icon="pi pi-save" />}
                        {showBTNPGCreatedDialog && 
                        <BTNPGCreatedDialog onClick={handleSubmit} label="Criar" disabled={isSubmitDisabled} icon="pi pi-save" onBackClick={onBackClick} onClose={onClose} />}
                    </div>
                </div>
                <DialogFilter
                    header={editingEmpresaId ? 'Editar Empresa' : 'Adicionar Empresa'}
                    visible={showModalEmpresa}
                    onHide={closeEmpresaDialog}
                    loading={isEmpresaDialogLoading}
                    loadingText={editingEmpresaId ? 'Carregando informacoes da Empresa...' : 'Abrindo cadastro de Empresa...'}
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
                    header={editingServicoId ? 'Editar Servico' : 'Adicionar Servico'}
                    visible={showModalServico}
                    onHide={closeServicoDialog}
                    loading={isServicoDialogLoading}
                    loadingText={editingServicoId ? 'Carregando informacoes do Servico...' : 'Abrindo cadastro de Servico...'}
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
                <DialogFilter
                    header={editingPessoaId ? 'Editar Cliente ou Fornecedor' : 'Adicionar Cliente ou Fornecedor'}
                    visible={showModalPessoa}
                    onHide={closePessoaDialog}
                    loading={isPessoaDialogLoading}
                    loadingText={editingPessoaId ? 'Carregando informacoes do Cliente ou Fornecedor...' : 'Abrindo cadastro de Cliente ou Fornecedor...'}
                >
                    <FormCreatedPessoa
                        key={`${editingPessoaId ?? 'novo'}-${pessoaDialogKey}`}
                        msgs={msgs}
                        ref={formRef}
                        pessoa={pessoa[0]}
                        initialId={editingPessoaId}
                        preloadedPessoa={preloadedPessoa}
                        setPessoa={setPessoa}
                        onPessoaChange={handlePessoa}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handlePessoaSaved}
                        onLoadingChange={setIsPessoaDialogLoading}
                        onClose={closePessoaDialog}
                        showBTNPGCreatedDialog
                        onBackClick={closePessoaDialog}
                    />
                </DialogFilter>
                <DialogFilter
                    header={editingFormaPagamentoId ? 'Editar Forma de Pagamento' : 'Adicionar Forma de Pagamento'}
                    visible={showModalFormaPagamento}
                    onHide={closeFormaPagamentoDialog}
                    loading={isFormaPagamentoDialogLoading}
                    loadingText={editingFormaPagamentoId ? 'Carregando informacoes da Forma de Pagamento...' : 'Abrindo cadastro de Forma de Pagamento...'}
                >
                    <FormCreatedFormaPagamento
                        key={`${editingFormaPagamentoId ?? 'novo'}-${formaPagamentoDialogKey}`}
                        msgs={msgs}
                        ref={formRef}
                        formaPagamento={formaPagamento}
                        initialId={editingFormaPagamentoId}
                        preloadedFormaPagamento={preloadedFormaPagamento}
                        setFormaPagamento={setFormaPagamento}
                        onFormaPagamentoChange={handleFormaPagamento}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handleFormaPagamentoSaved}
                        onLoadingChange={setIsFormaPagamentoDialogLoading}
                        onClose={closeFormaPagamentoDialog}
                        showBTNPGCreatedDialog
                        onBackClick={closeFormaPagamentoDialog}
                    />
                </DialogFilter>
                <DialogFilter
                    header={editingVendedorId ? 'Editar Vendedor' : 'Adicionar Vendedor'}
                    visible={showModalVendedor}
                    onHide={closeVendedorDialog}
                    loading={isVendedorDialogLoading}
                    loadingText={editingVendedorId ? 'Carregando informacoes do Vendedor...' : 'Abrindo cadastro de Vendedor...'}
                >
                    <FormCreatedVendedor
                        key={`${editingVendedorId ?? 'novo'}-${vendedorDialogKey}`}
                        msgs={msgs}
                        ref={formRef}
                        vendedor={vendedor}
                        initialId={editingVendedorId}
                        preloadedVendedor={preloadedVendedor}
                        setVendedor={setVendedor}
                        onVendedorChange={handleVendedor}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handleVendedorSaved}
                        onLoadingChange={setIsVendedorDialogLoading}
                        onClose={closeVendedorDialog}
                        showBTNPGCreatedDialog
                        onBackClick={closeVendedorDialog}
                    />
                </DialogFilter>
            </>
        );
    }
);
OrdemServicoFormContainer.displayName = 'OrdemServicoFormContainer';
function isOrdemServicoFormProps(props: FormCreatedOrdemServicoProps): props is OrdemServicoFormProps {
    return 'msgs' in props;
}
export const FormOrdemServicoCreated = forwardRef<OrdemServicoFormRef, FormCreatedOrdemServicoProps>((props, ref) => {
    if (isOrdemServicoFormProps(props)) {
        return <OrdemServicoFormContainer {...props} ref={ref} />;
    }
    return <OrdemServicoFields {...props} />;
});
FormOrdemServicoCreated.displayName = 'FormOrdemServicoCreated';

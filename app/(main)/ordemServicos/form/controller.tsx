'use client';
import LoadingScreen from '@/app/loading';
import { Messages } from 'primereact/messages';
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
        const [reloadKeyFormaPagamento, setReloadKeyFormaPagamento] = useState(0);
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
            if (!servicoSelecionado) return;
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
            if (!formaPagamentoSelecionada) return;
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
            if (!vendedorSelecionado) return;
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
        const handleEmpresaSaved = (created: CompanyEntity) => {
            setShowModalEmpresa(false);
            setEmpresa(created);
            setSelectedEmpresa(created);
            handleAllChanges({ target: { id: 'id_empresa', value: created.id, type: 'input' } });
            clearFieldError('selectedEmpresa');
            setReloadKeyEmpresa((current) => current + 1);
        };
        const handlePessoa = (updatedPessoa: PessoaEntity) => {
            setPessoa([updatedPessoa]);
        };
        const handlePessoaSaved = (created: PessoaEntity) => {
            setShowModalPessoa(false);
            setSelectedCliente(created);
            handleAllChanges({ target: { id: 'id_cliente', value: created.id, type: 'input' } });
            clearFieldError('selectedCliente');
            setReloadKeyPessoa((current) => current + 1);
        };
        const handleServico = (updatedServico: ServiceEntity) => {
            setServico(updatedServico);
        };

        const handleServiceSaved = (created: ServiceEntity) => {
            setShowModalServico(false);
            setServico(created);
            handleServicoChange(created);
            setReloadKeyServico((current) => current + 1);
        };

        const handleVendedor = (updatedVendedor: VendedorEntity) => {
            setVendedor(updatedVendedor);
        };

        const handleVendedorSaved = (created: VendedorEntity) => {
            setShowModalVendedor(false);
            setVendedor(created);
            setSelectedVendedor(created);
            handleAllChanges({ target: { id: 'id_vendedor', value: created.id, type: 'input' } });
            clearFieldError('selectedVendedor');
        };

        const handleFormaPagamento = (updatedFormaPagamento: FormaPagamentoEntity) => {
            setFormaPagamento(updatedFormaPagamento);
        };

        const handleFormaPagamentoSaved = (created: FormaPagamentoEntity) => {
            const createdId = Number((created as any).id ?? (created as any).id_forma_pagamento ?? 0);
            const createdEntity = new FormaPagamentoEntity({ ...createEmptyFormaPagamento(), ...created, id: createdId } as any);
            setShowModalFormaPagamento(false);
            setFormaPagamento(createdEntity);
            handleFormaPagamentoChange(createdEntity);
            setReloadKeyFormaPagamento((current) => current + 1);
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
                            onAddEmpresa={() => setShowModalEmpresa(true)}
                            onAddPessoa={() => setShowModalPessoa(true)}
                            onAddVendedor={() => setShowModalVendedor(true)}
                            onAddFormaPagamento={() => setShowModalFormaPagamento(true)}
                            onAddServico={() => setShowModalServico(true)}
                            onValidateDescricao={handleValidateDescricao}
                        />
                    </div>
                    <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                        {showBTNPGCreatedAll && <BTNPGCreatedAll onClick={handleSubmit} label="Emitir Ordem" disabled={isSubmitDisabled} icon="" />}
                        {showBTNPGCreatedDialog && <BTNPGCreatedDialog onClick={handleSubmit} label="Emitir Ordem" disabled={isSubmitDisabled} icon="" onBackClick={onBackClick} onClose={onClose} />}
                    </div>
                </div>
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
                <DialogFilter header="Adicionar Servico" visible={showModalServico} onHide={() => setShowModalServico(false)}>
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
                <DialogFilter header="Adicionar Cliente ou Fornecedor" visible={showModalPessoa} onHide={() => setShowModalPessoa(false)}>
                    <FormCreatedPessoa
                        msgs={msgs}
                        ref={formRef}
                        pessoa={pessoa}
                        initialId={null}
                        setPessoa={setPessoa}
                        onPessoaChange={handlePessoa}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handlePessoaSaved}
                        onClose={() => setShowModalPessoa(false)}
                        showBTNPGCreatedDialog
                        onBackClick={() => setShowModalPessoa(false)}
                    />
                </DialogFilter>
                <DialogFilter header="Adicionar Forma de Pagamento" visible={showModalFormaPagamento} onHide={() => setShowModalFormaPagamento(false)}>
                    <FormCreatedFormaPagamento
                        msgs={msgs}
                        ref={formRef}
                        formaPagamento={formaPagamento}
                        initialId={null}
                        setFormaPagamento={setFormaPagamento}
                        onFormaPagamentoChange={handleFormaPagamento}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handleFormaPagamentoSaved}
                        onClose={() => setShowModalFormaPagamento(false)}
                        showBTNPGCreatedDialog
                        onBackClick={() => setShowModalFormaPagamento(false)}
                    />
                </DialogFilter>
                <DialogFilter header="Adicionar Vendedor" visible={showModalVendedor} onHide={() => setShowModalVendedor(false)}>
                    <FormCreatedVendedor
                        msgs={msgs}
                        ref={formRef}
                        vendedor={vendedor}
                        initialId={null}
                        setVendedor={setVendedor}
                        onVendedorChange={handleVendedor}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handleVendedorSaved}
                        onClose={() => setShowModalVendedor(false)}
                        showBTNPGCreatedDialog
                        onBackClick={() => setShowModalVendedor(false)}
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

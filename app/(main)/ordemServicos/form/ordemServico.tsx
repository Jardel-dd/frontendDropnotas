'use client';

import LoadingScreen from '@/app/loading';
import { Messages } from 'primereact/messages';
import FormEmpresaCreated from '@/app/(main)/configuracoes/empresas/form/empresa';
import { IconNumero } from '@/app/utils/icons/icons';
import { InputSwitch } from 'primereact/inputswitch';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import Input from '@/app/shared/include/input/input-all';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { DatePicker } from '@/app/components/calendarComponent/datePicker';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';
import ServiceForm from '@/app/(main)/cadastro/servicos/form/servico';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import FormPessoaCreated from '@/app/(main)/cadastro/pessoas/form/pessoa';
import VendedorForm from '@/app/(main)/cadastro/vendedores/form/vendedor';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import PessoaDropdownField from '@/app/(main)/cadastro/pessoas/dropDown/pessoa';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { DetalServiceOSEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import ServicoDropdownField from '@/app/(main)/cadastro/servicos/dropdown/servico';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { validateFieldsOrdemServico } from '@/app/(main)/ordemServicos/controller/validation';
import { FormaPagamentoEntity, Formas_recebimento, TipoFormaPagamento } from '@/app/entity/FormaPagamento';
import { createdOrdemServico, fetchOrdemServiceByID } from '@/app/(main)/ordemServicos/controller/controller';
import { fetchAllVendedores, fetchFilteredVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
import FormaPagamentoForm from '@/app/(main)/cadastro/formaPagamento/form/formaPagamento';
import FormaPagamentoDropdownField from '@/app/(main)/cadastro/formaPagamento/dropDown/formaPagamento';
import EmpresaDropdownField from '@/app/(main)/configuracoes/empresas/dropDown/empresa';
import { fetchFilteredService, listTheService } from '@/app/(main)/cadastro/servicos/controller/controller';
import type { FormCreatedOrdemServicoProps, NestedFormRef, OrdemServicoFieldsProps, OrdemServicoFormProps, OrdemServicoFormRef } from '../types/ordemServico';

export type { FormCreatedOrdemServicoProps, OrdemServicoFieldsProps, OrdemServicoFormProps, OrdemServicoFormRef } from '../types/ordemServico';



const createEmptyOrdemServico = () =>
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
        servicos: new DetalServiceOSEntity({
            id_servico: 0,
            descricao: '',
            descricao_completa: '',
            codigo: '',
            quantidade: 1,
            valor_servico: 0,
            valor_desconto: 0
        }),
        formas_recebimento: new Formas_recebimento({
            id_forma_recebimento: 0,
            valor_taxa: 0,
            valor_recebido: 0,
            percentual_taxa: 0
        }),
        id_vendedor: 0,
        id_forma_pagamento: 0,
        id_cliente: 0,
        id_empresa: 0,
        orcar: true
    });

const createEmptyServico = () =>
    new ServiceEntity({
        ativo: true,
        id: null,
        descricao: '',
        descricao_completa: '',
        codigo: '',
        item_lista_servico: '',
        exigibilidade_iss: '',
        iss_retido: 'NAO',
        codigo_municipio: '',
        numero_processo: '',
        responsavel_retencao: '',
        codigo_cnae: '',
        valor_servico: null
    });

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
        cnae_fiscal: '',
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

const createEmptyEmpresa = () =>
    new CompanyEntity({
        id: 0,
        id_usuarios_acesso: [0],
        cnpj: '',
        razao_social: '',
        nome_fantasia: '',
        logo_empresa: '',
        atividade_principal: '',
        inscricao_estadual: '',
        inscricao_municipal: '',
        codigo_regime_tributario: '',
        tipo_rps: '',
        endereco: {} as EnderecoEntity,
        cnaes_secundarios: ['0'],
        certificado_digital: '',
        data_vencimento_certificado_digital: '',
        senha_certificado_digital: '',
        nome_certificado_digital: '',
        serie_emissao_nfse: '',
        proximo_numero_rps: null,
        proximo_numero_lote: null,
        aliquota_iss: null,
        cnae_fiscal: '',
        prestacao_sus: false,
        regime_especial_tributacao: '',
        incentivo_fiscal: false,
        email: '',
        telefone: '',
        ativo: true,
        aliquota_pis: 0,
        aliquota_cofins: 0,
        aliquota_inss: 0,
        aliquota_ir: 0,
        aliquota_csll: 0,
        aliquota_outras_retencoes: 0,
        aliquota_deducoes: 0,
        percentual_desconto_incondicionado: 0,
        percentual_desconto_condicionado: 0
    });

const createEmptyVendedor = () =>
    new VendedorEntity({
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
        codigo_regime_tributario: '',
        tipo_pessoa: 'PESSOA_JURIDICA',
        contribuinte: '',
        telefone: '',
        endereco: {} as EnderecoEntity,
        arquivo_contrato: '',
        percentual_comissao: 0,
        id_vendedor_padrao: null,
        ativo: true
    });

const createEmptyFormaPagamento = () =>
    new FormaPagamentoEntity({
        ativo: true,
        id: null,
        descricao: '',
        aplicar_taxa_servico: false,
        observacao: '',
        tipo_forma_pagamento: '' as TipoFormaPagamento,
        tipo_taxa: '',
        valor_taxa: 0
    });

export function OrdemServicoFields({
    emitirOS,
    errors,
    reloadKeyPessoa,
    reloadKeyEmpresa,
    reloadKeyServico,
    reloadKeyFormaPagamento,
    selectedCliente,
    selectedEmpresa,
    selectedServico,
    selectedVendedor,
    selectedFormaPagamento,
    onChange,
    onDateChange,
    onEmpresaChange,
    onPessoaChange,
    onVendedorChange,
    onFormaPagamentoChange,
    onServicoChange,
    onAddEmpresa,
    onAddPessoa,
    onAddVendedor,
    onAddFormaPagamento,
    onAddServico,
    onValidateDescricao
}: OrdemServicoFieldsProps) {
    return (
        <>
            <div className="grid formgrid">
                <div className="col-12 lg:col-3 mt-1">
                    <Input value={emitirOS.numero || ''} onChange={onChange} label="Numero" id="numero" disabled iconLeft={<IconNumero isDarkMode={false} />} showTopLabel required topLabel="Numero:" />
                </div>
                <div className="col-12 lg:col-12 mt-1">
                    <Input
                        value={emitirOS.descricao || ''}
                        onChange={onChange}
                        label="Descricao"
                        id="descricao"
                        hasError={!!errors.descricao}
                        errorMessage={errors.descricao}
                        showTopLabel
                        required
                        topLabel="Descricao:"
                        autoFocus
                        onBlur={onValidateDescricao}
                    />
                </div>
                <div className="col-12 lg:col-6 mt-1">
                    <EmpresaDropdownField
                        selectedCompany={selectedEmpresa}
                        onCompanyChange={onEmpresaChange}
                        reloadKey={reloadKeyEmpresa}
                        hasError={!!errors.selectedEmpresa}
                        errorMessage={errors.selectedEmpresa}
                        showAddButton
                        onAddClick={onAddEmpresa}
                        autoSelectSingle
                    />
                </div>
                <div className="col-12 lg:col-6 mt-1">
                    <PessoaDropdownField
                        id="selectedCliente"
                        selectedPessoa={selectedCliente}
                        onPessoaChange={onPessoaChange}
                        reloadKey={reloadKeyPessoa}
                        hasError={!!errors.selectedCliente}
                        errorMessage={errors.selectedCliente}
                        placeholder="Selecione o Cliente"
                        autoSelectSingle
                        showAddButton
                        onAddClick={onAddPessoa}
                        topLabel="Cliente ou Fornecedor:"
                    />
                </div>
                <div className="col-12 lg:col-6 mt-1">
                    <DropdownSearch<VendedorEntity>
                        id="selectedVendedor"
                        selectedItem={selectedVendedor}
                        onItemChange={onVendedorChange}
                        fetchAllItems={fetchAllVendedores}
                        fetchFilteredItems={fetchFilteredVendedor}
                        optionLabel="razao_social"
                        placeholder="Selecione o Vendedor"
                        hasError={!!errors.selectedVendedor}
                        errorMessage={errors.selectedVendedor}
                        autoSelectSingle={false}
                        showAddButton
                        onAddClick={onAddVendedor}
                        showTopLabel
                        required
                        topLabel="Vendedor:"
                    />
                </div>
                <div className="col-12 lg:col-6 mt-1">
                    <FormaPagamentoDropdownField
                        selectedFormaPagamento={selectedFormaPagamento}
                        onFormaPagamentoChange={onFormaPagamentoChange}
                        reloadKey={reloadKeyFormaPagamento}
                        hasError={!!errors.selectedFormaPagamento}
                        errorMessage={errors.selectedFormaPagamento}
                        showAddButton
                        onAddClick={onAddFormaPagamento}
                    />
                </div>
                <div className="col-12 lg:col-6 mt-1">
                    <ServicoDropdownField
                        id="selectedService"
                        selectedService={selectedServico}
                        onServiceChange={onServicoChange}
                        reloadKey={reloadKeyServico}
                        fetchAllItems={listTheService}
                        fetchFilteredItems={fetchFilteredService}
                        placeholder="Selecione o Servico"
                        hasError={!!errors.selectedService}
                        errorMessage={errors.selectedService}
                        autoSelectSingle
                        showAddButton
                        onAddClick={onAddServico}
                        showTopLabel
                        required
                        topLabel="Servico:"
                    />
                </div>
                <div className="col-12 lg:col-4 mt-1">
                    <Input
                        min={1}
                        value={emitirOS.servicos.quantidade || ''}
                        onChange={onChange}
                        label="Ex: 3 servicos iguais"
                        id="servicos.quantidade"
                        type="number"
                        showTopLabel
                        topLabel="Quantidade de servicos:"
                        hasError={!!errors['servicos.quantidade']}
                        errorMessage={errors['servicos.quantidade']}
                    />
                </div>
            </div>
            <div className="grid formgrid w-full">
                <div className="col-12 lg:col-4 mt-1">
                    <DatePicker value={emitirOS.data_hora_inicio ?? null} onChange={(date) => onDateChange('data_hora_inicio', date)} showTopLabel topLabel="Data inicio" />
                </div>
                <div className="col-12 lg:col-4 mt-1">
                    <DatePicker value={emitirOS.data_hora_prevista ?? null} onChange={(date) => onDateChange('data_hora_prevista', date)} showTopLabel topLabel="Data prevista" />
                </div>
                <div className="col-12 lg:col-4 mt-1">
                    <DatePicker value={emitirOS.data_hora_conclusao ?? null} onChange={(date) => onDateChange('data_hora_conclusao', date)} showTopLabel topLabel="Data conclusao" />
                </div>
            </div>
            <div className="grid formgrid w-full">
                <div className="col-12 lg:col-12 mt-1">
                    <InputTextarea value={emitirOS.consideracoes_finais || ''} onChange={onChange} rows={5} cols={30} label="" id="consideracoes_finais" showTopLabel topLabel="Consideracoes finais:" />
                </div>
                <div className="col-12 lg:col-12 mt-1">
                    <InputTextarea value={emitirOS.observacao_interna || ''} onChange={onChange} rows={5} cols={30} label="" id="observacao_interna" showTopLabel topLabel="Observacoes internas:" />
                </div>
                <div className="col-12 lg:col-12 mt-1">
                    <InputTextarea value={emitirOS.observacao_servico || ''} onChange={onChange} rows={5} cols={30} label="" id="observacao_servico" showTopLabel topLabel="Observacoes do Servico:" />
                </div>
                <div className="flex items-center gap-2 p-2 mt-3">
                    <InputSwitch
                        id="orcar"
                        checked={emitirOS.orcar ?? false}
                        onChange={(event) =>
                            onChange({
                                target: {
                                    id: 'orcar',
                                    value: event.value,
                                    checked: event.value,
                                    type: 'switch'
                                }
                            })
                        }
                    />
                    <span style={{ alignItems: 'center', display: 'flex' }}>Orcar</span>
                </div>
            </div>
        </>
    );
}

const OrdemServicoFormContainer = forwardRef<OrdemServicoFormRef, OrdemServicoFormProps>(
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
                    <ServiceForm
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
                    <FormPessoaCreated
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
                    <FormaPagamentoForm
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
                    <VendedorForm
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

const FormOrdemServicoCreated = forwardRef<OrdemServicoFormRef, FormCreatedOrdemServicoProps>((props, ref) => {
    if (isOrdemServicoFormProps(props)) {
        return <OrdemServicoFormContainer {...props} ref={ref} />;
    }
    return <OrdemServicoFields {...props} />;
});

FormOrdemServicoCreated.displayName = 'FormOrdemServicoCreated';

export default FormOrdemServicoCreated;

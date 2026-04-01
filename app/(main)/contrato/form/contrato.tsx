'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { Messages } from 'primereact/messages';
import { IconReal } from '@/app/utils/icons/icons';
import { InputSwitch } from 'primereact/inputswitch';
import Input from '@/app/shared/include/input/input-all';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { useRouter, useSearchParams } from 'next/navigation';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import {
    useRef,
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle
} from 'react';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import FormPessoaCreated from '@/app/(main)/cadastro/pessoas/form/pessoa';
import { OptionsPeriodicidade } from '@/app/shared/optionsDropDown/options';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import ServicoDropdownField from '@/app/(main)/cadastro/servicos/dropdown/servico';
import { validateFieldsContrato } from '@/app/(main)/contrato/controller/validation';
import { FormaPagamentoEntity, TipoFormaPagamento } from '@/app/entity/FormaPagamento';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import { VendedorFormRef } from '@/app/(main)/cadastro/vendedores/types/vendedor';
import { listTheFormaPagamento } from '@/app/(main)/cadastro/formaPagamento/controller/controller';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import EmpresaDropdownField from '@/app/(main)/configuracoes/empresas/dropDown/empresa';
import FormaPagamentoDropdownField from '@/app/(main)/cadastro/formaPagamento/dropDown/formaPagamento';
import FormaPagamentoForm from '@/app/(main)/cadastro/formaPagamento/form/formaPagamento';
import PessoaDropdownField from '@/app/(main)/cadastro/pessoas/dropDown/pessoa';
import { createContrato, fetchContratosById, updateContrato } from '@/app/(main)/contrato/controller/controller';
import CategoriaContratoDropdownField from '@/app/(main)/cadastro/categoriaContratos/dropDown/categoriaContratos';
import FormCreatedServico from '@/app/(main)/cadastro/servicos/form/servico';
import FormCategoriaContratoCreated from '@/app/(main)/cadastro/categoriaContratos/form/categoriaContratos';
import FormEmpresaCreated from '@/app/(main)/configuracoes/empresas/form/empresa';
import type {
    ContratoFieldsProps,
    ContratoFormProps,
    ContratoFormRef,
} from '../types/contratos';

export type {
    ContratoFieldsProps,
    ContratoFormProps,
    ContratoFormRef,
    FormContratoCreatedProps
} from '../types/contratos';

export function ContratoFields({
    contrato,
    errors,
    selectedPessoa,
    selectedCompany,
    selectedService,
    selectedCategoriaContrato,
    selectedFormaPagamento,
    reloadKeyPessoa,
    reloadKeyEmpresa,
    reloadKeyServico,
    reloadKeyCategoriaContrato,
    reloadKeyFormaPagamento,
    onChange,
    onDropdownChange,
    onNumberChange,
    onCompanyChange,
    onServiceChange,
    onCategoriaContratoChange,
    onFormaPagamentoChange,
    onPessoaChange,
    onAddEmpresa,
    onAddServico,
    onAddCategoriaContrato,
    onAddFormaPagamento,
    onAddPessoa,
    onValidateDescricao
}: ContratoFieldsProps) {
    return (
        <div className="scrollable-container">
            <div className="custom-flex-row">
                <div className="w-full">
                    <div className="grid formgrid ">
                        <div className="col-12 lg:col-10 mt-1">
                            <Input
                                id="descricao"
                                value={contrato.descricao || ''}
                                onChange={onChange}
                                hasError={!!errors.descricao}
                                errorMessage={errors.descricao}
                                label={'Descricao do Contrato'}
                                onBlur={onValidateDescricao}
                                autoFocus={true}
                                topLabel="Descricao:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 lg:col-2 mt-1">
                            <CustomInputNumber
                                id="valor_servico"
                                value={contrato.valor_servico || 0}
                                onChange={onNumberChange}
                                label="Valor Servicos"
                                useRightButton={true}
                                outlined={true}
                                hasError={!!errors.valor_servico}
                                errorMessage={errors.valor_servico}
                                iconLeft={<IconReal isDarkMode={false} />}
                                topLabel="Valor Servico:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 lg:col-3 mt-1">
                            <Dropdown
                                id="periodicidade"
                                value={contrato.periodicidade ?? ''}
                                options={OptionsPeriodicidade}
                                onChange={onDropdownChange}
                                label="Selecione a Periodicidade"
                                hasError={!!errors.periodicidade}
                                errorMessage={errors.periodicidade}
                                topLabel="Periodicidade:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 lg:col-3 mt-1">
                            <EmpresaDropdownField
                                selectedCompany={selectedCompany}
                                selectedCompanyId={contrato.id_empresa ?? null}
                                onCompanyChange={onCompanyChange}
                                reloadKey={reloadKeyEmpresa}
                                hasError={!!errors.selectedCompany}
                                errorMessage={errors.selectedCompany}
                                showAddButton
                                onAddClick={onAddEmpresa}
                                autoSelectSingle
                            />
                        </div>
                        <div className="col-12 lg:col-3 mt-1">
                            <ServicoDropdownField
                                selectedService={selectedService}
                                selectedServiceId={contrato.id_servico ?? null}
                                onServiceChange={onServiceChange}
                                reloadKey={reloadKeyServico}
                                hasError={!!errors.selectedService}
                                errorMessage={errors.selectedService}
                                showAddButton
                                onAddClick={onAddServico}
                                autoSelectSingle
                            />
                        </div>
                        <div className="col-12 lg:col-3 mt-1">
                            <CategoriaContratoDropdownField
                                selectedCategoriaContrato={selectedCategoriaContrato}
                                selectedCategoriaContratoId={contrato.id_categoria_contrato ?? null}
                                onCategoriaContratoChange={
                                    onCategoriaContratoChange
                                }
                                reloadKey={reloadKeyCategoriaContrato}
                                hasError={!!errors.selectedCategoriaContrato}
                                errorMessage={
                                    errors.selectedCategoriaContrato
                                }
                                showAddButton
                                onAddClick={onAddCategoriaContrato}
                                autoSelectSingle
                            />
                        </div>
                        <div className="col-12 lg:col-3 mt-1">
                            <FormaPagamentoDropdownField
                                selectedFormaPagamento={
                                    selectedFormaPagamento
                                }
                                selectedFormaPagamentoId={contrato.id_forma_pagamento ?? null}
                                onFormaPagamentoChange={
                                    onFormaPagamentoChange
                                }
                                reloadKey={reloadKeyFormaPagamento}
                                hasError={!!errors.selectedFormadePagamento}
                                errorMessage={errors.selectedFormadePagamento}
                                showAddButton
                                onAddClick={onAddFormaPagamento}
                                autoSelectSingle={false}
                            />
                        </div>
                        <div className="col-12 lg:col-6 mt-1">
                            <PessoaDropdownField
                                hasError={!!errors.selectedPessoa}
                                errorMessage={errors.selectedPessoa}
                                selectedPessoa={selectedPessoa}
                                selectedPessoaId={contrato.id_clientes_contrato?.[0] ?? null}
                                onPessoaChange={onPessoaChange}
                                reloadKey={reloadKeyPessoa}
                                autoSelectSingle
                                showAddButton
                                onAddClick={onAddPessoa}
                            />
                        </div>
                    </div>
                    <div className="grid formgrid mt-3 p-2 contrato-switch-group">
                        <div className="col-12 md:col-4">
                            <div className="contrato-switch-item">
                            <InputSwitch
                                inputId="emitir_boleto"
                                className="contrato-inputswitch"
                                checked={contrato.emitir_boleto ?? false}
                                onChange={(event) => {
                                    onChange({
                                        target: {
                                            id: 'emitir_boleto',
                                            value: event.value,
                                            type: 'input'
                                        }
                                    });
                                }}
                            />
                                <label htmlFor="emitir_boleto" className="contrato-switch-label">
                                    Enviar Boleto
                                </label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="contrato-switch-item">
                            <InputSwitch
                                inputId="enviar_email"
                                className="contrato-inputswitch"
                                checked={contrato.enviar_email ?? false}
                                onChange={(event) => {
                                    onChange({
                                        target: {
                                            id: 'enviar_email',
                                            value: event.value,
                                            type: 'input'
                                        }
                                    });
                                }}
                            />
                                <label htmlFor="enviar_email" className="contrato-switch-label">
                                    Enviar Email
                                </label>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="contrato-switch-item">
                            <InputSwitch
                                inputId="enviar_whatsapp"
                                className="contrato-inputswitch"
                                checked={contrato.enviar_whatsapp ?? false}
                                onChange={(event) => {
                                    onChange({
                                        target: {
                                            id: 'enviar_whatsapp',
                                            value: event.value,
                                            type: 'input'
                                        }
                                    });
                                }}
                            />
                                <label htmlFor="enviar_whatsapp" className="contrato-switch-label">
                                    Enviar WhatsApp
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const ContratoFormCreated = forwardRef<
    ContratoFormRef,
    ContratoFormProps
>(({ initialId, msgs, onContratoChange, onErrorsChange, redirectAfterSave, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }: ContratoFormProps, ref) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const onContratoChangeRef = useRef(onContratoChange);
    const onErrorsChangeRef = useRef(onErrorsChange);
    const contratoId = searchParams.get('id');
    const formRef = useRef<VendedorFormRef>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [servico, setServico] = useState<ServiceEntity>(
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
        })
    );
    const [pessoa, setPessoa] = useState<PessoaEntity[]>([
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
            // telefone: '',
            endereco: {} as EnderecoEntity,
            arquivo_contrato: '',
            id_vendedor_padrao: null,
            ativo: true,
            pais: ''
        })
    ]);
    const [empresa, setEmpresa] = useState<CompanyEntity>(
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
        })
    );
    const [contrato, setContrato] = useState<ContratoEntity>(
        new ContratoEntity({
            ativo: true,
            id: 0,
            descricao: '',
            valor_servico: null,
            periodicidade: '',
            emitir_boleto: false,
            enviar_email: false,
            enviar_whatsapp: false,
            id_servico: null,
            id_empresa: null,
            id_categoria_contrato: null,
            id_forma_pagamento: null,
            id_clientes_contrato: []
        })
    );
    const [reloadKeyPessoa, setReloadKeyPessoa] = useState(0);
    const [reloadKeyEmpresa, setReloadKeyEmpresa] = useState(0);
    const [reloadKeyServico, setReloadKeyServico] = useState(0);
    const [showModalPessoa, setShowModalPessoa] = useState(false);
    const [showModalServico, setShowModalServico] = useState(false);
    const [showModalEmpresa, setShowModalEmpresa] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
    const [selectedPessoa, setSelectedPessoa] = useState<PessoaEntity | null>(null);
    const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity[]>([]);
    const [reloadKeyFormaPagamento, setReloadKeyFormaPagamento] = useState(0);
    const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoEntity>(
        new FormaPagamentoEntity({
            ativo: true,
            id: 0,
            descricao: '',
            aplicar_taxa_servico: false,
            observacao: '',
            tipo_forma_pagamento: '' as TipoFormaPagamento,
            tipo_taxa: '',
            valor_taxa: 0
        })
    );
    const [showModalFormaPagamento, setShowModalFormaPagamento] = useState(false);
    const [reloadKeyCategoriaContrato, setReloadKeyCategoriaContrato] = useState(0);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [selectedCompany, setSelectedCompany] = useState<CompanyEntity | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceEntity | null>(null);
    const [showModalCategoriaContrato, setShowModalCategoriaContrato] = useState(false);
    const [categoriaContrato, setCategoriaContrato] = useState<CategoryContratosEntity>(
        new CategoryContratosEntity({
            id: 0,
            descricao: '',
            observacoes: '',
            ativo: true
        })
    );
    const [stateDisableBtnCreatedContrato, setStateDisableBtnCreatedContrato] = useState(false);
    const [selectedFormadePagamento, setSelectedFormadePagamento] = useState<FormaPagamentoEntity | null>(null);
    const [selectedCategoriaContrato, setSelectedCategoriaContrato] = useState<CategoryContratosEntity | null>(null);
    const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
        const _contrato = contrato!.copyWith({
            [event.target.id]: event.target.type === 'checkbox' || event.target.type === 'switch' ? event.target.checked : event.target.value
        });
        setContrato(_contrato);
        if (touchedFields[event.target.id]) {
            validateFieldsContrato(_contrato, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa, setErrors, msgs);
        }
    };
    const handleServico = (updatedServico: ServiceEntity) => {
        setServico(updatedServico);
    };
    const handleServicoChange = (service: ServiceEntity | null) => {
        console.log(' Serviço selecionado:', service);
        setSelectedService(service);
        if (service) {
            console.log(` Serviço ID: ${service.id} | Descrição: ${service.descricao}`);
            handleAllChanges({
                target: { id: 'id_servico', value: service.id, type: 'input' }
            });
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.service;
            return newErrors;
        });
    };
    const handleServiceSaved = (created: ServiceEntity) => {
        setShowModalServico(false);
        setSelectedService(created);
        setReloadKeyServico((k) => k + 1);
    };
    const handleFormaPagamentoChange = (fp: FormaPagamentoEntity | null) => {
        setSelectedFormadePagamento(fp);
        console.log('[Dropdown] formaPagamento selecionado:', fp);
        if (fp) {
            console.log(`[Dropdown] ID: ${fp.id} | Descrição: ${fp.descricao}`);
            handleAllChanges({
                target: { id: 'id_forma_pagamento', value: fp.id, type: 'input' }
            });
        }
        setErrors((prev) => {
            const next = { ...prev };
            delete next.formaPagamento;
            delete next.selectedFormadePagamento;
            return next;
        });
    };
    const handleFormaPagamento = (updatedFormaPagamento: FormaPagamentoEntity) => {
        setFormaPagamento(updatedFormaPagamento);
    };
    const handleFormaPagamentoSaved = async (created: FormaPagamentoEntity) => {
        try {
            setShowModalFormaPagamento(false);
            const createdId = Number((created as any).id ?? (created as any).id_forma_pagamento);
            const all = await listTheFormaPagamento();
            const match = all.find((f: any) => Number(f.id) === createdId);
            if (match) {
                setSelectedFormadePagamento(match);
                handleAllChanges({
                    target: { id: 'id_forma_pagamento', value: match.id, type: 'input' }
                });
            } else {
                const fallback = new FormaPagamentoEntity({
                    ...created,
                    id: createdId
                } as any);
                setSelectedFormadePagamento(fallback);
                handleAllChanges({
                    target: { id: 'id_forma_pagamento', value: createdId, type: 'input' }
                });
                setReloadKeyFormaPagamento((k) => k + 1);
            }

            console.log('[handleFormaPagamentoSaved] Selecionado ID:', createdId);
        } catch (e) {
            console.error('[handleFormaPagamentoSaved] erro:', e);
            setReloadKeyFormaPagamento((k) => k + 1);
        }
    };
    const handleCategoriaContratoSaved = (created: CategoryContratosEntity) => {
        setShowModalCategoriaContrato(false);
        setSelectedCategoriaContrato(created);
        setReloadKeyCategoriaContrato((k) => k + 1);
    };
    const handleCategoriaContrato = (updatedCategoriaContrato: CategoryContratosEntity) => {
        setCategoriaContrato(updatedCategoriaContrato);
    };
    const handleCategoriaContratoChange = (categoriaContrato: CategoryContratosEntity | null) => {
        console.log(' Categoria selecionada:', categoriaContrato);
        setSelectedCategoriaContrato(categoriaContrato);
        if (categoriaContrato) {
            handleAllChanges({
                target: { id: 'id_categoria_contrato', value: categoriaContrato.id, type: 'input' }
            });
            console.log(` Categoria ID: ${categoriaContrato.id} | Descrição: ${categoriaContrato.descricao}`);
        } else {
            console.log('Nenhuma categoria selecionada (valor nulo).');
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.categoriaContrato;
            return newErrors;
        });
    };
    const handlePessoaSaved = (created: PessoaEntity) => {
        setShowModalPessoa(false);
        setSelectedPessoa(created);
        handleAllChanges({
            target: { id: 'id_clientes_contrato', value: [created.id], type: 'input' }
        });
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedPessoa;
            return newErrors;
        });
        setReloadKeyPessoa((k) => k + 1);
    };
    const handlePessoaContrato = (updatedPessoa: PessoaEntity) => {
        setPessoa([updatedPessoa]);
    };
    const handlePessoaChange = (pessoa: PessoaEntity | null) => {
        setSelectedPessoa(pessoa);
        handleAllChanges({
            target: {
                id: 'id_clientes_contrato',
                value: pessoa ? [pessoa.id] : [],
                type: 'input'
            }
        });
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedPessoa;
            return newErrors;
        });
    };
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isLoadingBtnCreated) return;
        setIsLoadingBtnCreated(true);
        msgs.current?.clear();
        try {
            const isValid = validateFieldsContrato(contrato, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa, setErrors, msgs);
            if (isValid) {
                if (isEditMode && contratoId) {
                    await updateContrato(contratoId, contrato, setErrors, msgs, router, setContrato);
                } else {
                    await createContrato(
                        contrato,
                        selectedCategoriaContrato,
                        selectedCompany!,
                        selectedFormadePagamento!,
                        selectedPessoa,
                        setSelectedCategoriaContrato,
                        setSelectedCompany,
                        setSelectedFormadePagamento,
                        setSelectedPessoa,
                        setErrors,
                        msgs,
                        router
                    );
                }
            }
        } finally {
            setIsLoadingBtnCreated(false);
        }
    };
    const handleDropdownChange = (e: DropdownChangeEvent) => {
        const _contrato = contrato.copyWith({
            [e.target.id]: e.value
        });
        setContrato(_contrato);
    };
    const handleNumberChange = (e: InputNumberValueChangeEvent) => {
        const _contrato = contrato.copyWith({
            [e.target.id]: e.value ?? 0
        });
        setContrato(_contrato);
        setTouchedFields((prev) => ({
            ...prev,
            [e.target.id]: true
        }));
        validateFieldsContrato(contrato, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa, setErrors, msgs);
    };
    const handleCompanyChange = (empresa: CompanyEntity | null) => {
        setSelectedCompany(empresa);
        if (empresa) {
            handleAllChanges({
                target: { id: 'id_empresa', value: empresa.id, type: 'input' }
            });
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedCompany;
            return newErrors;
        });
    };
    const handleEmpresa = (updatedEmpresa: CompanyEntity) => {
        setEmpresa(updatedEmpresa);
    };
    const handleEmpresaSaved = (created: CompanyEntity) => {
        setShowModalEmpresa(false);
        setSelectedEmpresa((prev) => [...prev, created]);
        setReloadKeyEmpresa((k) => k + 1);
    };
    const ListagemContratoID = async (contratoId: string) => {
        try {
            setIsLoading(true);
            const { dataContrato, selectedEmpresa, selectedService, selectedCategoriaContrato, selectedFormaPagamento, selectedPessoa, pessoa } = await fetchContratosById(contratoId);
            setContrato(dataContrato);
            setSelectedCompany(selectedEmpresa ?? null);
            setSelectedService(selectedService ?? null);
            setSelectedCategoriaContrato(selectedCategoriaContrato ?? null);
            setSelectedFormadePagamento(selectedFormaPagamento ?? null);
            setPessoa(pessoa);
            setSelectedPessoa(selectedPessoa);
            console.log('Contrato ID:', dataContrato.id);
            console.log('dataContrato', dataContrato);
        } catch (error) {
            console.error('Erro ao carregar contrato:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    useImperativeHandle(ref, () => ({
        handleSave: async () => {
            await handleSubmit();
        }
    }));
    useEffect(() => {
        onContratoChangeRef.current = onContratoChange;
    }, [onContratoChange]);
    useEffect(() => {
        onErrorsChangeRef.current = onErrorsChange;
    }, [onErrorsChange]);
    useEffect(() => {
        if (contratoId) {
            setIsEditMode(true);
            ListagemContratoID(contratoId);
        } else {
            setSelectedPessoa(null);
            setIsLoading(false);
        }
    }, [contratoId]);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsContrato(contrato, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa, setErrors, msgs);
        }
    }, [contrato, touchedFields, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa, msgs]);
    useEffect(() => {
        onContratoChangeRef.current?.(contrato);
    }, [contrato]);
    useEffect(() => {
        onErrorsChangeRef.current?.(errors);
    }, [errors]);
    if (isLoading && contratoId) {
        return <LoadingScreen loadingText={'Carregando informações do Contrato selecionado...'} />;
    }
    return (
        <>
            <div className="p-fluid">
                <Messages ref={msgs} className="custom-messages" />
                <div className="card styled-container-main-all-routes">
                    <div className="scrollable-container">
                        <div className="custom-flex-row">
                            <div className="w-full">
                                <div className="grid formgrid ">
                                    <div className="col-12 lg:col-10 mt-1">
                                        <Input
                                            id="descricao"
                                            value={contrato.descricao || ''}
                                            onChange={handleAllChanges}
                                            hasError={!!errors.descricao}
                                            errorMessage={errors.descricao}
                                            label={'Descrição do Contrato'}
                                            onBlur={() => {
                                                setTouchedFields((prev) => ({ ...prev, descricao: true }));
                                                validateFieldsContrato(contrato, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa, setErrors, msgs);
                                            }}
                                            autoFocus={true}
                                            topLabel="Descrição:"
                                            showTopLabel
                                            required
                                        />
                                    </div>
                                    <div className="col-12 lg:col-2 mt-1">
                                        <CustomInputNumber
                                            id="valor_servico"
                                            value={contrato.valor_servico || 0}
                                            onChange={handleNumberChange}
                                            label="Valor Serviços"
                                            useRightButton={true}
                                            outlined={true}
                                            hasError={!!errors.valor_servico}
                                            errorMessage={errors.valor_servico}
                                            iconLeft={<IconReal isDarkMode={false} />}
                                            topLabel="Valor Serviço:"
                                            showTopLabel
                                            required
                                        />
                                    </div>
                                    <div className="col-12 lg:col-3 mt-1">
                                        <Dropdown
                                            id="periodicidade"
                                            value={contrato.periodicidade ?? ''}
                                            options={OptionsPeriodicidade}
                                            onChange={handleDropdownChange}
                                            label="Selecione a Periodicidade"
                                            hasError={!!errors.periodicidade}
                                            errorMessage={errors.periodicidade}
                                            topLabel="Periodicidade:"
                                            showTopLabel
                                            required
                                        />
                                    </div>
                                    <div className="col-12 lg:col-3 mt-1">
                                        <EmpresaDropdownField
                                            selectedCompany={selectedCompany}
                                            selectedCompanyId={contrato.id_empresa ?? null}
                                            onCompanyChange={handleCompanyChange}
                                            reloadKey={reloadKeyEmpresa}
                                            hasError={!!errors.selectedCompany}
                                            errorMessage={errors.selectedCompany}
                                            showAddButton
                                            onAddClick={() => setShowModalEmpresa(true)}
                                            autoSelectSingle
                                        />
                                    </div>
                                    <div className="col-12 lg:col-3 mt-1">
                                        <ServicoDropdownField
                                            selectedService={selectedService}
                                            selectedServiceId={contrato.id_servico ?? null}
                                            onServiceChange={handleServicoChange}
                                            reloadKey={reloadKeyServico}
                                            hasError={!!errors.selectedService}
                                            errorMessage={errors.selectedService}
                                            showAddButton
                                            onAddClick={() => setShowModalServico(true)}
                                            autoSelectSingle
                                        />
                                    </div>
                                    <div className="col-12 lg:col-3 mt-1">
                                        <CategoriaContratoDropdownField
                                            selectedCategoriaContrato={selectedCategoriaContrato}
                                            selectedCategoriaContratoId={contrato.id_categoria_contrato ?? null}
                                            onCategoriaContratoChange={handleCategoriaContratoChange}
                                            reloadKey={reloadKeyCategoriaContrato}
                                            hasError={!!errors.selectedCategoriaContrato}
                                            errorMessage={errors.selectedCategoriaContrato}
                                            showAddButton
                                            onAddClick={() => setShowModalCategoriaContrato(true)}
                                            autoSelectSingle
                                        />
                                    </div>
                                    <div className="col-12 lg:col-3 mt-1">
                                        <FormaPagamentoDropdownField
                                            selectedFormaPagamento={selectedFormadePagamento}
                                            selectedFormaPagamentoId={contrato.id_forma_pagamento ?? null}
                                            onFormaPagamentoChange={handleFormaPagamentoChange}
                                            reloadKey={reloadKeyFormaPagamento}
                                            hasError={!!errors.selectedFormadePagamento}
                                            errorMessage={errors.selectedFormadePagamento}
                                            showAddButton
                                            onAddClick={() => setShowModalFormaPagamento(true)}
                                            autoSelectSingle={false}
                                        />
                                    </div>
                                    <div className="col-12 lg:col-6 mt-1">
                                        <PessoaDropdownField
                                            hasError={!!errors.selectedPessoa}
                                            errorMessage={errors.selectedPessoa}
                                            selectedPessoa={selectedPessoa}
                                            selectedPessoaId={contrato.id_clientes_contrato?.[0] ?? null}
                                            onPessoaChange={handlePessoaChange}
                                            reloadKey={reloadKeyPessoa}
                                            autoSelectSingle
                                            showAddButton
                                            onAddClick={() => setShowModalPessoa(true)}
                                        />
                                    </div>
                                </div>
                                <div className="grid formgrid mt-3 p-2 contrato-switch-group">
                                    <div className="col-3 md:col-2">
                                        <div className="contrato-switch-item">
                                        <InputSwitch
                                            inputId="emitir_boleto"
                                            className="contrato-inputswitch"
                                            checked={contrato.emitir_boleto ?? false}
                                            onChange={(event) => {
                                                handleAllChanges({
                                                    target: { id: 'emitir_boleto', value: event.value, type: 'input' }
                                                });
                                            }}
                                        />
                                            <label htmlFor="emitir_boleto" className="contrato-switch-label">Enviar Boleto</label>
                                        </div>
                                    </div>
                                    <div className="col-3 md:col-2">
                                        <div className="contrato-switch-item">
                                        <InputSwitch
                                            inputId="enviar_email"
                                            className="contrato-inputswitch"
                                            checked={contrato.enviar_email ?? false}
                                            onChange={(event) => {
                                                handleAllChanges({
                                                    target: {
                                                        id: 'enviar_email',
                                                        value: event.value,
                                                        type: 'input'
                                                    }
                                                });
                                            }}
                                        />
                                            <label htmlFor="enviar_email" className="contrato-switch-label">Enviar Email</label>
                                        </div>
                                    </div>
                                    <div className="col-3 md:col-2">
                                        <div className="contrato-switch-item">
                                        <InputSwitch
                                            inputId="enviar_whatsapp"
                                            className="contrato-inputswitch"
                                            checked={contrato.enviar_whatsapp ?? false}
                                            onChange={(event) => {
                                                handleAllChanges({
                                                    target: { id: 'enviar_whatsapp', value: event.value, type: 'input' }
                                                });
                                            }}
                                        />
                                            <label htmlFor="enviar_whatsapp" className="contrato-switch-label">Enviar WhatsApp</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="StyleContainer-btn-Created">
                        {showBTNPGCreatedAll && (
                            <BTNPGCreatedAll
                                onClick={async () => await handleSubmit()}
                                label={'Salvar'}
                                disabled={
                                    stateDisableBtnCreatedContrato ||
                                    Object.keys(errors).length > 0 ||
                                    !contrato.descricao ||
                                    !contrato.valor_servico ||
                                    (!selectedCompany && !contrato.id_empresa) ||
                                    (!selectedService && !contrato.id_servico) ||
                                    (!selectedCategoriaContrato && !contrato.id_categoria_contrato) ||
                                    (!selectedFormadePagamento && !contrato.id_forma_pagamento) ||
                                    (!selectedPessoa && !(contrato.id_clientes_contrato?.length ?? 0)) ||
                                    !contrato.periodicidade
                                }
                            />
                        )}
                        {showBTNPGCreatedDialog && (
                            <BTNPGCreatedDialog
                                onClick={async () => await handleSubmit()}
                                disabled={
                                    stateDisableBtnCreatedContrato ||
                                    Object.keys(errors).length > 0 ||
                                    !contrato.descricao ||
                                    !contrato.valor_servico ||
                                    (!selectedCompany && !contrato.id_empresa) ||
                                    (!selectedService && !contrato.id_servico) ||
                                    (!selectedCategoriaContrato && !contrato.id_categoria_contrato) ||
                                    (!selectedFormadePagamento && !contrato.id_forma_pagamento) ||
                                    (!selectedPessoa && !(contrato.id_clientes_contrato?.length ?? 0)) ||
                                    !contrato.periodicidade
                                }
                                icon={''}
                                onBackClick={onBackClick}
                                onClose={onClose}
                                label={'Salvar'}
                            />
                        )}
                    </div>
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
                            showBTNPGCreatedDialog={true}
                            onBackClick={() => setShowModalServico(false)}
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
                            showBTNPGCreatedDialog={true}
                            onBackClick={() => setShowModalFormaPagamento(false)}
                        />
                    </DialogFilter>
                    <DialogFilter header="Adicionar Categoria de Contratos" visible={showModalCategoriaContrato} onHide={() => setShowModalCategoriaContrato(false)}>
                        <FormCategoriaContratoCreated
                            msgs={msgs}
                            ref={formRef}
                            categoriaContrato={categoriaContrato}
                            initialId={null}
                            setCategoriaContrato={setCategoriaContrato}
                            onCategoriaContratoChange={handleCategoriaContrato}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            onSaved={handleCategoriaContratoSaved}
                            onClose={() => setShowModalCategoriaContrato(false)}
                            showBTNPGCreatedDialog={true}
                            onBackClick={() => setShowModalCategoriaContrato(false)}
                        />
                    </DialogFilter>
                    <DialogFilter header="Adicionar Cliente ou Fornecedor" visible={showModalPessoa} onHide={() => setShowModalPessoa(false)}>
                        <FormPessoaCreated
                            msgs={msgs}
                            ref={formRef}
                            pessoa={pessoa}
                            initialId={null}
                            setPessoa={setPessoa}
                            onPessoaChange={handlePessoaContrato}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            onSaved={handlePessoaSaved}
                            onClose={() => setShowModalPessoa(false)}
                            showBTNPGCreatedDialog={true}
                            onBackClick={() => setShowModalPessoa(false)}
                        />
                    </DialogFilter>
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
                            showBTNPGCreatedAll={true}
                            onSaved={handleEmpresaSaved}
                            onClose={() => setShowModalEmpresa(false)}
                            onBackClick={() => setShowModalEmpresa(false)}
                        />
                    </DialogFilter>
                </div>
            </div>
        </>
    );
});
ContratoFormCreated.displayName = 'ContratoFormCreated';

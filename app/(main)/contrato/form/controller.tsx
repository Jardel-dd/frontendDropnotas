'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { ContratoFields } from './contrato';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import { FormCreatedServico } from '../../cadastro/servicos/form/controller';
import { FormCreatedPessoa } from '@/app/(main)/cadastro/pessoas/form/controller';
import { VendedorFormRef } from '@/app/(main)/cadastro/vendedores/types/vendedor';
import FormEmpresaCreated from '@/app/(main)/configuracoes/empresas/form/controller';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { validateFieldsContrato } from '@/app/(main)/contrato/controller/validation';
import { FormaPagamentoEntity, TipoFormaPagamento } from '@/app/entity/FormaPagamento';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { FormCreatedFormaPagamento } from '../../cadastro/formaPagamento/form/controller';
import FormCategoriaContratoCreated from '../../cadastro/categoriaContratos/form/controller';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import { listTheFormaPagamento } from '@/app/(main)/cadastro/formaPagamento/controller/controller';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import type {ContratoFormProps, ContratoFormRef,FormContratoCreatedProps} from '../types/contratos';
import { createContrato, fetchContratosById, updateContrato } from '@/app/(main)/contrato/controller/controller';
export type {ContratoFieldsProps, ContratoFormProps,ContratoFormRef,FormContratoCreatedProps} from '../types/contratos';
const ContratoFormContainer = forwardRef<ContratoFormRef, ContratoFormProps>(
    (
        {
            initialId,
            msgs,
            onContratoChange,
            onErrorsChange,
            onClose,
            showBTNPGCreatedDialog,
            showBTNPGCreatedAll,
            onBackClick
        },
        ref
    ) => {
        const router = useRouter();
        const contratoId = initialId;
        const onContratoChangeRef = useRef(onContratoChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
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
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [selectedPessoa, setSelectedPessoa] = useState<PessoaEntity[]>([]);
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
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
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
        const [selectedFormadePagamento, setSelectedFormadePagamento] = useState<FormaPagamentoEntity | null>(null);
        const [selectedCategoriaContrato, setSelectedCategoriaContrato] = useState<CategoryContratosEntity | null>(null);
        const clearErrors = (...keys: string[]) => {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                keys.forEach((key) => {
                    delete newErrors[key];
                });
                return newErrors;
            });
        };
        const validateContratoForm = (
            contratoAtual = contrato,
            companyAtual = selectedCompany,
            serviceAtual = selectedService,
            categoriaAtual = selectedCategoriaContrato,
            formaPagamentoAtual = selectedFormadePagamento,
            pessoaAtual = selectedPessoa
        ) =>
            validateFieldsContrato(
                contratoAtual,
                companyAtual,
                serviceAtual,
                categoriaAtual,
                formaPagamentoAtual,
                pessoaAtual,
                setErrors,
                msgs
            );

        const updateContratoField = (id: string, value: any) => {
            handleAllChanges({
                target: {
                    id,
                    value,
                    type: 'input'
                }
            });
        };
        const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
            const updatedContrato = contrato.copyWith({
                [event.target.id]:
                    event.target.type === 'checkbox' || event.target.type === 'switch'
                        ? event.target.checked
                        : event.target.value
            });

            setContrato(updatedContrato);

            if (touchedFields[event.target.id]) {
                validateContratoForm(updatedContrato);
            }
        };
        const handleServico = (updatedServico: ServiceEntity) => {
            setServico(updatedServico);
        };
        const handleServicoChange = (service: ServiceEntity | null) => {
            setSelectedService(service);

            if (service) {
                updateContratoField('id_servico', service.id);
            }

            clearErrors('service', 'selectedService');
        };
        const handleServiceSaved = (created: ServiceEntity) => {
            setShowModalServico(false);
            setSelectedService(created);
            updateContratoField('id_servico', created.id);
            clearErrors('service', 'selectedService');
            setReloadKeyServico((current) => current + 1);
        };
        const handleFormaPagamentoChange = (formaPagamentoSelecionada: FormaPagamentoEntity | null) => {
            setSelectedFormadePagamento(formaPagamentoSelecionada);

            if (formaPagamentoSelecionada) {
                updateContratoField('id_forma_pagamento', formaPagamentoSelecionada.id);
            }

            clearErrors('formaPagamento', 'selectedFormadePagamento');
        };
        const handleFormaPagamento = (updatedFormaPagamento: FormaPagamentoEntity) => {
            setFormaPagamento(updatedFormaPagamento);
        };
        const handleFormaPagamentoSaved = async (created: FormaPagamentoEntity) => {
            try {
                setShowModalFormaPagamento(false);
                const createdId = Number((created as any).id ?? (created as any).id_forma_pagamento);
                const allFormaPagamento = await listTheFormaPagamento();
                const match = allFormaPagamento.find((item: any) => Number(item.id) === createdId);

                if (match) {
                    setSelectedFormadePagamento(match);
                    updateContratoField('id_forma_pagamento', match.id);
                } else {
                    const fallback = new FormaPagamentoEntity({
                        ...created,
                        id: createdId
                    } as any);

                    setSelectedFormadePagamento(fallback);
                    updateContratoField('id_forma_pagamento', createdId);
                    setReloadKeyFormaPagamento((current) => current + 1);
                }

                clearErrors('formaPagamento', 'selectedFormadePagamento');
            } catch (error) {
                console.error('[handleFormaPagamentoSaved] erro:', error);
                setReloadKeyFormaPagamento((current) => current + 1);
            }
        };
        const handleCategoriaContratoSaved = (created: CategoryContratosEntity) => {
            setShowModalCategoriaContrato(false);
            setSelectedCategoriaContrato(created);
            updateContratoField('id_categoria_contrato', created.id);
            clearErrors('categoriaContrato', 'selectedCategoriaContrato');
            setReloadKeyCategoriaContrato((current) => current + 1);
        };
        const handleCategoriaContrato = (updatedCategoriaContrato: CategoryContratosEntity) => {
            setCategoriaContrato(updatedCategoriaContrato);
        };
        const handleCategoriaContratoChange = (categoriaContratoSelecionada: CategoryContratosEntity | null) => {
            setSelectedCategoriaContrato(categoriaContratoSelecionada);

            if (categoriaContratoSelecionada) {
                updateContratoField('id_categoria_contrato', categoriaContratoSelecionada.id);
            }

            clearErrors('categoriaContrato', 'selectedCategoriaContrato');
        };
        const handlePessoaSaved = (created: PessoaEntity) => {
            setShowModalPessoa(false);
            setSelectedPessoa((prev) => {
                const nextSelectedPessoa = prev.some((pessoaSelecionada) => pessoaSelecionada.id === created.id)
                    ? prev
                    : [...prev, created];
                updateContratoField('id_clientes_contrato', nextSelectedPessoa.map((pessoaSelecionada) => pessoaSelecionada.id));
                return nextSelectedPessoa;
            });
            clearErrors('selectedPessoa');
            setReloadKeyPessoa((current) => current + 1);
        };
        const handlePessoaContrato = (updatedPessoa: PessoaEntity) => {
            setPessoa((prev) => {
                const exists = prev.some((pessoaExistente) => pessoaExistente.id === updatedPessoa.id);
                return exists ? prev : [...prev, updatedPessoa];
            });
        };
        const handlePessoaChange = (pessoasSelecionadas: PessoaEntity[]) => {
            setSelectedPessoa(pessoasSelecionadas);
            updateContratoField('id_clientes_contrato', pessoasSelecionadas.map((pessoaSelecionada) => pessoaSelecionada.id));
            clearErrors('selectedPessoa');
        };
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) event.preventDefault();
            if (isLoadingBtnCreated) return;

            setIsLoadingBtnCreated(true);
            msgs.current?.clear();

            try {
                const isValid = validateContratoForm();

                if (!isValid) {
                    return;
                }

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
            } finally {
                setIsLoadingBtnCreated(false);
            }
        };
        const handleDropdownChange = (event: DropdownChangeEvent) => {
            const updatedContrato = contrato.copyWith({
                [event.target.id]: event.value
            });

            setContrato(updatedContrato);
        };
        const handleNumberChange = (event: InputNumberValueChangeEvent) => {
            const updatedContrato = contrato.copyWith({
                [event.target.id]: event.value ?? 0
            });

            setContrato(updatedContrato);
            setTouchedFields((prev) => ({
                ...prev,
                [event.target.id]: true
            }));
            validateContratoForm(updatedContrato);
        };
        const handleCompanyChange = (empresaSelecionada: CompanyEntity | null) => {
            setSelectedCompany(empresaSelecionada);

            if (empresaSelecionada) {
                updateContratoField('id_empresa', empresaSelecionada.id);
            }

            clearErrors('selectedCompany');
        };
        const handleEmpresa = (updatedEmpresa: CompanyEntity) => {
            setEmpresa(updatedEmpresa);
        };
        const handleEmpresaSaved = (created: CompanyEntity) => {
            setShowModalEmpresa(false);
            setSelectedCompany(created);
            updateContratoField('id_empresa', created.id);
            clearErrors('selectedCompany');
            setReloadKeyEmpresa((current) => current + 1);
        };
        const listagemContratoId = async (currentContratoId: string) => {
            try {
                setIsLoading(true);
                const {
                    dataContrato,
                    selectedEmpresa,
                    selectedService,
                    selectedCategoriaContrato,
                    selectedFormaPagamento,
                    selectedPessoa,
                    pessoa
                } = await fetchContratosById(currentContratoId);

                setContrato(dataContrato);
                setSelectedCompany(selectedEmpresa ?? null);
                setSelectedService(selectedService ?? null);
                setSelectedCategoriaContrato(selectedCategoriaContrato ?? null);
                setSelectedFormadePagamento(selectedFormaPagamento ?? null);
                setPessoa(pessoa);
                setSelectedPessoa(selectedPessoa);
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
            handleSave: handleSubmit
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
                listagemContratoId(contratoId);
                return;
            }

            setSelectedPessoa([]);
            setIsLoading(false);
        }, [contratoId]);
        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validateFieldsContrato(
                    contrato,
                    selectedCompany,
                    selectedService,
                    selectedCategoriaContrato,
                    selectedFormadePagamento,
                    selectedPessoa,
                    setErrors,
                    msgs
                );
            }
        }, [contrato, touchedFields, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa, msgs]);
        useEffect(() => {
            onContratoChangeRef.current?.(contrato);
        }, [contrato]);
        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);
        if (isLoading && contratoId) {
            return <LoadingScreen loadingText="Carregando informações do Contrato selecionado..." />;
        }
        const isSubmitDisabled =
            isLoadingBtnCreated ||
            Object.keys(errors).length > 0 ||
            !contrato.descricao ||
            !contrato.valor_servico ||
            (!selectedCompany && !contrato.id_empresa) ||
            (!selectedService && !contrato.id_servico) ||
            (!selectedCategoriaContrato && !contrato.id_categoria_contrato) ||
            (!selectedFormadePagamento && !contrato.id_forma_pagamento) ||
            (selectedPessoa.length === 0 && !(contrato.id_clientes_contrato?.length ?? 0)) ||
            !contrato.periodicidade;
        return (
            <div className="p-fluid">
                <Messages ref={msgs} className="custom-messages" />
                <div className="card styled-container-main-all-routes">
                    <ContratoFields
                        contrato={contrato}
                        errors={errors}
                        selectedPessoa={selectedPessoa}
                        pessoaOptions={pessoa}
                        selectedCompany={selectedCompany}
                        selectedService={selectedService}
                        selectedCategoriaContrato={selectedCategoriaContrato}
                        selectedFormaPagamento={selectedFormadePagamento}
                        reloadKeyPessoa={reloadKeyPessoa}
                        reloadKeyEmpresa={reloadKeyEmpresa}
                        reloadKeyServico={reloadKeyServico}
                        reloadKeyCategoriaContrato={reloadKeyCategoriaContrato}
                        reloadKeyFormaPagamento={reloadKeyFormaPagamento}
                        onChange={handleAllChanges}
                        onDropdownChange={handleDropdownChange}
                        onNumberChange={handleNumberChange}
                        onCompanyChange={handleCompanyChange}
                        onServiceChange={handleServicoChange}
                        onCategoriaContratoChange={handleCategoriaContratoChange}
                        onFormaPagamentoChange={handleFormaPagamentoChange}
                        onPessoaChange={handlePessoaChange}
                        onAddEmpresa={() => setShowModalEmpresa(true)}
                        onAddServico={() => setShowModalServico(true)}
                        onAddCategoriaContrato={() => setShowModalCategoriaContrato(true)}
                        onAddFormaPagamento={() => setShowModalFormaPagamento(true)}
                        onAddPessoa={() => setShowModalPessoa(true)}
                        onValidateDescricao={() => {
                            setTouchedFields((prev) => ({ ...prev, descricao: true }));
                            validateContratoForm();
                        }}
                    />
                    <div className="StyleContainer-btn-Created">
                        {showBTNPGCreatedAll && (
                            <BTNPGCreatedAll
                                onClick={async () => await handleSubmit()}
                                label="Salvar"
                                disabled={isSubmitDisabled}
                                icon="pi pi-save"
                            />
                        )}
                        {showBTNPGCreatedDialog && (
                            <BTNPGCreatedDialog
                                onClick={async () => await handleSubmit()}
                                disabled={isSubmitDisabled}
                                icon="pi pi-save"
                                onBackClick={onBackClick}
                                onClose={onClose}
                                label="Salvar"
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
                            showBTNPGCreatedDialog
                            onBackClick={() => setShowModalServico(false)}
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
                            showBTNPGCreatedDialog
                            onBackClick={() => setShowModalCategoriaContrato(false)}
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
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            onSaved={handlePessoaSaved}
                            onClose={() => setShowModalPessoa(false)}
                            showBTNPGCreatedDialog
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
                            onSaved={handleEmpresaSaved}
                            onClose={() => setShowModalEmpresa(false)}
                            showBTNPGCreatedDialog
                            onBackClick={() => setShowModalEmpresa(false)}
                        />
                    </DialogFilter>
                </div>
            </div>
        );
    }
);
ContratoFormContainer.displayName = 'ContratoFormContainer';
function isContratoFormProps(props: FormContratoCreatedProps): props is ContratoFormProps {
    return 'msgs' in props;
}
export const ContratoFormCreated = forwardRef<ContratoFormRef, FormContratoCreatedProps>((props, ref) => {
    if (isContratoFormProps(props)) {
        return <ContratoFormContainer {...props} ref={ref} />;
    }
    return <ContratoFields {...props} />;
});
ContratoFormCreated.displayName = 'ContratoFormCreated';

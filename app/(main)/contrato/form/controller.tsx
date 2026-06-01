'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { ContratoFields } from './contrato';
import { useRouter } from 'next/navigation';
import { Messages } from '@/app/components/messages/GlobalMessages';
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
import { toFormaPagamentoEntity } from '@/app/(main)/cadastro/formaPagamento/types/formaPagamento';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import type { ContratoFormProps, ContratoFormRef, FormContratoCreatedProps } from '../types/contratos';
import { createContrato, fetchContratosById, updateContrato } from '@/app/(main)/contrato/controller/controller';
import type { PreloadedEmpresaData } from '@/app/(main)/configuracoes/empresas/types/empresa';
import { fetchCompanyDropdownByID, fetchCompanyFormDataByID } from '@/app/(main)/configuracoes/empresas/controller/controller';
import type { PreloadedPessoaData } from '@/app/(main)/cadastro/pessoas/types/pessoa';
import { fetchPessoasById } from '@/app/(main)/cadastro/pessoas/controller/controller';
import type { PreloadedServicoData } from '@/app/(main)/cadastro/servicos/types/servico';
import { fetchServiceFormDataByID, fetchServicesByID } from '@/app/(main)/cadastro/servicos/controller/controller';
import { fetchFormaPagamentoByID } from '@/app/(main)/cadastro/formaPagamento/controller/controller';
import { fetchCategoriaContratoByID } from '@/app/(main)/cadastro/categoriaContratos/controller/controller';
export type { ContratoFieldsProps, ContratoFormProps, ContratoFormRef, FormContratoCreatedProps } from '../types/contratos';
const ContratoFormContainer = forwardRef<ContratoFormRef, ContratoFormProps>(
    (
        {
            initialId,
            preloadedContrato,
            msgs,
            onContratoChange,
            onErrorsChange,
            redirectAfterSave,
            onClose,
            onSaved,
            onLoadingChange,
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
        const [pessoaDialogKey, setPessoaDialogKey] = useState(0);
        const [empresaDialogKey, setEmpresaDialogKey] = useState(0);
        const [servicoDialogKey, setServicoDialogKey] = useState(0);
        const [formaPagamentoDialogKey, setFormaPagamentoDialogKey] = useState(0);
        const [categoriaContratoDialogKey, setCategoriaContratoDialogKey] = useState(0);
        const [showModalPessoa, setShowModalPessoa] = useState(false);
        const [showModalServico, setShowModalServico] = useState(false);
        const [showModalEmpresa, setShowModalEmpresa] = useState(false);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [isPessoaDialogLoading, setIsPessoaDialogLoading] = useState(false);
        const [isEmpresaDialogLoading, setIsEmpresaDialogLoading] = useState(false);
        const [isServicoDialogLoading, setIsServicoDialogLoading] = useState(false);
        const [isFormaPagamentoDialogLoading, setIsFormaPagamentoDialogLoading] = useState(false);
        const [isCategoriaContratoDialogLoading, setIsCategoriaContratoDialogLoading] = useState(false);
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
        const [preloadedPessoa, setPreloadedPessoa] = useState<PreloadedPessoaData | null>(null);
        const [editingPessoaId, setEditingPessoaId] = useState<string | null>(null);
        const [preloadedEmpresa, setPreloadedEmpresa] = useState<PreloadedEmpresaData | null>(null);
        const [editingEmpresaId, setEditingEmpresaId] = useState<string | null>(null);
        const [preloadedServico, setPreloadedServico] = useState<PreloadedServicoData | null>(null);
        const [editingServicoId, setEditingServicoId] = useState<string | null>(null);
        const [preloadedFormaPagamento, setPreloadedFormaPagamento] = useState<FormaPagamentoEntity | null>(null);
        const [editingFormaPagamentoId, setEditingFormaPagamentoId] = useState<string | null>(null);
        const [preloadedCategoriaContrato, setPreloadedCategoriaContrato] = useState<CategoryContratosEntity | null>(null);
        const [editingCategoriaContratoId, setEditingCategoriaContratoId] = useState<string | null>(null);
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
                console.error('Erro ao pre-carregar servico para edicao do contrato:', error);
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

                setSelectedService(servicoAtualizado);
                updateContratoField('id_servico', servicoAtualizado.id);
                clearErrors('service', 'selectedService');
                setReloadKeyServico((current) => current + 1);
            } finally {
                closeServicoDialog();
            }
        };
        const handleFormaPagamentoChange = (formaPagamentoSelecionada: FormaPagamentoEntity | null) => {
            setSelectedFormadePagamento(formaPagamentoSelecionada);

            if (formaPagamentoSelecionada) {
                updateContratoField('id_forma_pagamento', formaPagamentoSelecionada.id);
            }

            clearErrors('formaPagamento', 'selectedFormadePagamento');
        };
        const handleFormaPagamento = (updatedFormaPagamento: FormaPagamentoEntity) => {
            setFormaPagamento(toFormaPagamentoEntity(updatedFormaPagamento));
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
                const formaPagamentoPrecarregada = toFormaPagamentoEntity(response.formaPagamento);
                setFormaPagamento(formaPagamentoPrecarregada);
                setPreloadedFormaPagamento(formaPagamentoPrecarregada);
                setEditingFormaPagamentoId(formaPagamentoId);
                setFormaPagamentoDialogKey((current) => current + 1);
                setShowModalFormaPagamento(true);
            } catch (error) {
                console.error('Erro ao pre-carregar forma de pagamento para edicao do contrato:', error);
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
            try {
                setIsFormaPagamentoDialogLoading(true);
                const createdId = Number((created as any).id ?? (created as any).id_forma_pagamento);
                const response = createdId ? await fetchFormaPagamentoByID(String(createdId)) : null;
                const match = response?.formaPagamento ? toFormaPagamentoEntity(response.formaPagamento) : null;

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
            } finally {
                closeFormaPagamentoDialog();
            }
        };
        const handleCategoriaContratoSaved = async (created: CategoryContratosEntity) => {
            setIsCategoriaContratoDialogLoading(true);
            try {
                const response = created?.id ? await fetchCategoriaContratoByID(String(created.id)) : null;
                const categoriaAtualizada = response?.categoriaContrato
                    ? new CategoryContratosEntity(response.categoriaContrato)
                    : created;

                setSelectedCategoriaContrato(categoriaAtualizada);
                updateContratoField('id_categoria_contrato', categoriaAtualizada.id);
                clearErrors('categoriaContrato', 'selectedCategoriaContrato');
                setReloadKeyCategoriaContrato((current) => current + 1);
            } finally {
                closeCategoriaContratoDialog();
            }
        };
        const handleCategoriaContrato = (updatedCategoriaContrato: CategoryContratosEntity) => {
            setCategoriaContrato(updatedCategoriaContrato);
        };
        const openCreateCategoriaContratoDialog = () => {
            setIsCategoriaContratoDialogLoading(true);
            setEditingCategoriaContratoId(null);
            setPreloadedCategoriaContrato(null);
            setCategoriaContratoDialogKey((current) => current + 1);
            setShowModalCategoriaContrato(true);
        };
        const openEditCategoriaContratoDialog = async (categoriaContratoSelecionada: CategoryContratosEntity) => {
            if (!categoriaContratoSelecionada?.id) {
                return;
            }

            setIsCategoriaContratoDialogLoading(true);

            try {
                const categoriaContratoId = String(categoriaContratoSelecionada.id);
                const response = await fetchCategoriaContratoByID(categoriaContratoId);
                setPreloadedCategoriaContrato(new CategoryContratosEntity(response.categoriaContrato));
                setEditingCategoriaContratoId(categoriaContratoId);
                setCategoriaContratoDialogKey((current) => current + 1);
                setShowModalCategoriaContrato(true);
            } catch (error) {
                console.error('Erro ao pre-carregar categoria de contrato para edicao do contrato:', error);
                setIsCategoriaContratoDialogLoading(false);
            }
        };
        const closeCategoriaContratoDialog = () => {
            setShowModalCategoriaContrato(false);
            setEditingCategoriaContratoId(null);
            setIsCategoriaContratoDialogLoading(true);
            setPreloadedCategoriaContrato(null);
        };
        const handleCategoriaContratoChange = (categoriaContratoSelecionada: CategoryContratosEntity | null) => {
            setSelectedCategoriaContrato(categoriaContratoSelecionada);

            if (categoriaContratoSelecionada) {
                updateContratoField('id_categoria_contrato', categoriaContratoSelecionada.id);
            }

            clearErrors('categoriaContrato', 'selectedCategoriaContrato');
        };
        const upsertPessoaInList = (lista: PessoaEntity[], pessoaAtualizada: PessoaEntity) => {
            const hasPessoa = lista.some((pessoaExistente) => pessoaExistente.id === pessoaAtualizada.id);

            if (!hasPessoa) {
                return [...lista, pessoaAtualizada];
            }

            return lista.map((pessoaExistente) =>
                pessoaExistente.id === pessoaAtualizada.id ? pessoaAtualizada : pessoaExistente
            );
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
                    selectedVendedor: pessoaPrecarregada.selectedVendedor ?? null
                });
                setEditingPessoaId(pessoaId);
                setPessoaDialogKey((current) => current + 1);
                setShowModalPessoa(true);
            } catch (error) {
                console.error('Erro ao pre-carregar cliente/fornecedor para edicao do contrato:', error);
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

                setPessoa((prev) => upsertPessoaInList(prev, pessoaAtualizada));
                setSelectedPessoa((prev) => {
                    const nextSelectedPessoa = upsertPessoaInList(prev, pessoaAtualizada);
                    updateContratoField('id_clientes_contrato', nextSelectedPessoa.map((pessoaSelecionada) => pessoaSelecionada.id));
                    return nextSelectedPessoa;
                });
                clearErrors('selectedPessoa');
                setReloadKeyPessoa((current) => current + 1);
            } finally {
                closePessoaDialog();
            }
        };
        const handlePessoaContrato = (updatedPessoa: PessoaEntity) => {
            setPessoa((prev) => upsertPessoaInList(prev, updatedPessoa));
        };
        const handlePessoaChange = (pessoasSelecionadas: PessoaEntity[]) => {
            setSelectedPessoa(pessoasSelecionadas);
            updateContratoField('id_clientes_contrato', pessoasSelecionadas.map((pessoaSelecionada) => pessoaSelecionada.id));
            clearErrors('selectedPessoa');
        };
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) event.preventDefault();
            if (isLoadingBtnCreated) return;

            console.log('[ContratoForm] handleSubmit iniciado', {
                isEditMode,
                contratoId,
                redirectAfterSave
            });
            setIsLoadingBtnCreated(true);
            msgs.current?.clear();

            try {
                const isValid = validateContratoForm();
                console.log('[ContratoForm] resultado da validacao', { isValid });

                if (!isValid) {
                    console.log('[ContratoForm] envio interrompido por validacao');
                    return;
                }

                if (isEditMode && contratoId) {
                    const updated = await updateContrato(contratoId, contrato, setErrors, msgs, router, setContrato, redirectAfterSave ?? true);
                    console.log('[ContratoForm] retorno do updateContrato', updated);

                    if (updated) {
                        const normalizedContrato = updated instanceof ContratoEntity ? updated : new ContratoEntity(updated);
                        console.log('[ContratoForm] chamando onSaved do contrato', normalizedContrato);
                        await onSaved?.(normalizedContrato);
                        if (!onSaved) {
                            console.log('[ContratoForm] chamando onClose do contrato');
                            onClose?.();
                        }
                    }
                } else {
                    const created = await createContrato(
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
                        router,
                        redirectAfterSave ?? true
                    );
                    console.log('[ContratoForm] retorno do createContrato', created);

                    if (created) {
                        const normalizedContrato = created instanceof ContratoEntity ? created : new ContratoEntity(created);
                        console.log('[ContratoForm] chamando onSaved do contrato criado', normalizedContrato);
                        await onSaved?.(normalizedContrato);
                        if (!onSaved) {
                            console.log('[ContratoForm] chamando onClose do contrato criado');
                            onClose?.();
                        }
                    }
                }
            } finally {
                console.log('[ContratoForm] finalizando submit');
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
                console.error('Erro ao pre-carregar empresa para edicao do contrato:', error);
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

                setSelectedCompany(empresaAtualizada);
                updateContratoField('id_empresa', empresaAtualizada.id);
                clearErrors('selectedCompany');
                setReloadKeyEmpresa((current) => current + 1);
            } finally {
                closeEmpresaDialog();
            }
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

                if (preloadedContrato && String(preloadedContrato.dataContrato.id) === String(contratoId)) {
                    setContrato(preloadedContrato.dataContrato);
                    setSelectedCompany(preloadedContrato.selectedEmpresa ?? null);
                    setSelectedService(preloadedContrato.selectedService ?? null);
                    setSelectedCategoriaContrato(preloadedContrato.selectedCategoriaContrato ?? null);
                    setSelectedFormadePagamento(preloadedContrato.selectedFormaPagamento ?? null);
                    setPessoa(preloadedContrato.pessoa ?? []);
                    setSelectedPessoa(preloadedContrato.selectedPessoa ?? []);
                    setIsLoading(false);
                    return;
                }

                listagemContratoId(contratoId);
                return;
            }

            setIsEditMode(false);
            setSelectedPessoa([]);
            setIsLoading(false);
        }, [contratoId, preloadedContrato]);
        useEffect(() => {
            console.log('[ContratoForm] loading alterado', {
                isLoading,
                isLoadingBtnCreated,
                loadingCombinado: isLoading || isLoadingBtnCreated
            });
            onLoadingChange?.(isLoading || isLoadingBtnCreated);
        }, [isLoading, isLoadingBtnCreated, onLoadingChange]);
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
        const isDialogMode = Boolean(showBTNPGCreatedDialog || onClose || onBackClick);
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
            <>
                <div className={` shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                    <Messages ref={msgs} className="custom-messages" />
                    <div className="scrollable-container shared-form-content">
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
                            onAddEmpresa={openCreateEmpresaDialog}
                            onEditEmpresa={openEditEmpresaDialog}
                            onAddServico={openCreateServicoDialog}
                            onEditServico={openEditServicoDialog}
                            onAddCategoriaContrato={openCreateCategoriaContratoDialog}
                            onEditCategoriaContrato={openEditCategoriaContratoDialog}
                            onAddFormaPagamento={openCreateFormaPagamentoDialog}
                            onEditFormaPagamento={openEditFormaPagamentoDialog}
                            onAddPessoa={openCreatePessoaDialog}
                            onEditPessoa={openEditPessoaDialog}
                            onValidateDescricao={() => {
                                setTouchedFields((prev) => ({ ...prev, descricao: true }));
                                validateContratoForm();
                            }}
                        />
                    </div>


                </div>
                <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
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
                    header={editingCategoriaContratoId ? 'Editar Categoria de Contratos' : 'Adicionar Categoria de Contratos'}
                    visible={showModalCategoriaContrato}
                    onHide={closeCategoriaContratoDialog}
                    loading={isCategoriaContratoDialogLoading}
                    loadingText={editingCategoriaContratoId ? 'Carregando informacoes da Categoria de Contratos...' : 'Abrindo cadastro de Categoria de Contratos...'}
                >
                    <FormCategoriaContratoCreated
                        key={`${editingCategoriaContratoId ?? 'novo'}-${categoriaContratoDialogKey}`}
                        msgs={msgs}
                        ref={formRef}
                        categoriaContrato={categoriaContrato}
                        initialId={editingCategoriaContratoId}
                        preloadedCategoriaContrato={preloadedCategoriaContrato}
                        setCategoriaContrato={setCategoriaContrato}
                        onCategoriaContratoChange={handleCategoriaContrato}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handleCategoriaContratoSaved}
                        onLoadingChange={setIsCategoriaContratoDialogLoading}
                        onClose={closeCategoriaContratoDialog}
                        showBTNPGCreatedDialog
                        onBackClick={closeCategoriaContratoDialog}
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
                        pessoa={pessoa}
                        initialId={editingPessoaId}
                        preloadedPessoa={preloadedPessoa}
                        setPessoa={setPessoa}
                        onPessoaChange={handlePessoaContrato}
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
            </>
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

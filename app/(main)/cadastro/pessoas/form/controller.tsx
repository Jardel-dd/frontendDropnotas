'use client';
import '@/app/styles/styledGlobal.css';
import { PessoaFields } from './pessoa';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { getCitiesFromState } from '@/app/entity/maps';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { VendedorFormRef } from '../../vendedores/types/vendedor';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { FormCreatedVendedor } from '../../vendedores/form/controller';
import MobileSearchPicker from '@/app/shared/mobile/MobileSearchPicker';
import ContratoDropdownField from '@/app/(main)/contrato/dropDown/contrato';
import { useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { ContratoFormCreated } from '@/app/(main)/contrato/form/controller';
import { handleSearchCep } from '@/app/components/seachs/searchCep/controller';
import { handleSearchCNPJ } from '@/app/components/seachs/searchCnpj/controller';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import EnderecoForm from '@/app/components/enderecos/enderecoFormComponent/enderecoForm';
import { validateFieldsPessoa } from '@/app/(main)/cadastro/pessoas/controller/validate';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import VendedorDropdownField from '@/app/(main)/cadastro/vendedores/dropDown/DropdownVendedor';
import { ContratoFormRef, PreloadedContratoData } from '@/app/(main)/contrato/types/contratos';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { fetchAllCnae, fetchFilteredCnae } from '@/app/components/fetchAll/listAllCnae/controller';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { createdPessoa, fetchPessoasById, updatePessoa } from '@/app/(main)/cadastro/pessoas/controller/controller';
import { FormPessoaCreatedProps, mapPessoaContatoToSelection, PessoaFormProps, PessoaFormRef } from '../types/pessoa';
import { fetchFilteredVendedor, fetchVendedor, fetchVendedorMobilePage, listTheVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
import { fetchContratoByID, fetchContratoMobilePage, fetchContratosById, fetchFilteredContrato, listTheContrato } from '@/app/(main)/contrato/controller/controller';
import { SectionCard, SectionGrid } from '@/app/components/cardForm/SectionCard';
import { useSectionCardFlow } from '@/app/components/cardForm/useSectionCardFlow';

const mapContatoSelectionToFlags = (selectedContato: string | null) => ({
    pessoa_cliente: selectedContato === 'AMBOS' || selectedContato === 'pessoa_cliente',
    pessoa_fornecedor: selectedContato === 'AMBOS' || selectedContato === 'pessoa_fornecedor'
});
const buildContratoSelectionFromResumo = (contratoResumo: Partial<ContratoEntity> | null | undefined, contratoId?: number | null) => {
    const resolvedContratoId = contratoResumo?.id ?? contratoId ?? null;

    if (!resolvedContratoId) {
        return null;
    }
    return new ContratoEntity({
        id: resolvedContratoId,
        descricao: contratoResumo?.descricao ?? '',
        valor_servico: contratoResumo?.valor_servico ?? null,
        periodicidade: contratoResumo?.periodicidade ?? '',
        emitir_boleto: contratoResumo?.emitir_boleto ?? false,
        enviar_email: contratoResumo?.enviar_email ?? false,
        enviar_whatsapp: contratoResumo?.enviar_whatsapp ?? false,
        id_servico: contratoResumo?.id_servico ?? null,
        id_empresa: contratoResumo?.id_empresa ?? null,
        id_categoria_contrato: contratoResumo?.id_categoria_contrato ?? null,
        id_forma_pagamento: contratoResumo?.id_forma_pagamento ?? null,
        id_clientes_contrato: contratoResumo?.id_clientes_contrato ?? [0]
    });
};

const pessoaSectionFlowConfig = [
    {
        id: 'dados-cliente',
        errorFields: [
            'tipoPessoa',
            'cnpj',
            'cpf',
            'rg',
            'razao_social',
            'nome_fantasia',
            'documento_estrangeiro',
            'pais',
            'selectedRegime',
            'contribuinte',
            'inscricao_estadual',
            'inscricao_municipal',
            'atividade_principal',
            'cnae_fiscal',
            'selectedContato',
            'email'
        ]
    },
    {
        id: 'relacoes',
        errorFields: ['selectedContrato', 'selectedVendedor']
    },
    {
        id: 'endereco',
        errorFields: [
            'cep',
            'logradouro',
            'numero',
            'bairro',
            'uf',
            'municipio',
            'codigo_municipio',
            'codigo_pais',
            'nome_pais',
            'telefone'
        ]
    }
];
const PessoaFormContainer = forwardRef<PessoaFormRef, PessoaFormProps>(
    (
        {
            initialId,
            preloadedPessoa,
            msgs,
            onPessoaChange,
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
        const isMobile = useIsMobile();
        const pessoaId = initialId;
        const [reloadKeyContrato] = useState(0);
        const formRef = useRef<VendedorFormRef>(null);
        const onPessoaChangeRef = useRef(onPessoaChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [hasFocused, setHasFocused] = useState(false);
        const [isEditMode, setIsEditMode] = useState(false);
        const [loadingCep, setLoadingCep] = useState(false);
        const [loadingCnpj, setLoadingCnpj] = useState(false);
        const formContratoRef = useRef<ContratoFormRef>(null);
        const [error, setError] = useState<string | null>(null);
        const [vendedor, setVendedor] = useState<VendedorEntity>(
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
            })
        );
        const [reloadKeyVendedor, setReloadKeyVendedor] = useState(0);
        const [vendedorDialogKey, setVendedorDialogKey] = useState(0);
        const [contratoDialogKey, setContratoDialogKey] = useState(0);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [showModalVendedor, setShowModalVendedor] = useState(false);
        const [showModalContrato, setShowModalContrato] = useState(false);
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [selectedContato, setSelectedContato] = useState<string | null>(null);
        const [isVendedorDialogLoading, setIsVendedorDialogLoading] = useState(true);
        const [isContratoDialogLoading, setIsContratoDialogLoading] = useState(true);
        const [reloadKeyContratoDropdown, setReloadKeyContratoDropdown] = useState(0);
        const [editingVendedorId, setEditingVendedorId] = useState<string | null>(null);
        const [editingContratoId, setEditingContratoId] = useState<string | null>(null);
        const [selectedCNAE, setSelectedCNAE] = useState<TableCNAEEntity | null>(null);
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [selectedContrato, setSelectedContrato] = useState<ContratoEntity | null>(null);
        const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
        const [preloadedVendedor, setPreloadedVendedor] = useState<VendedorEntity | null>(null);
        const [preloadedContrato, setPreloadedContrato] = useState<PreloadedContratoData | null>(null);
        const [stateDisableBtnCreatedClienteFornecedor, setStateDisableBtnCreatedClienteFornecedor] = useState(false);
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
                id_clientes_contrato: [0]
            })
        );
        const [pessoa, setPessoa] = useState<PessoaEntity>(
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
                cnae_fiscal: null,
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
        );
        const validatePessoaForm = useCallback(
            () => validateFieldsPessoa(pessoa, setErrors, msgs),
            [msgs, pessoa]
        );
        const {
            isSectionExpanded,
            toggleSection,
            syncExpandedSectionWithErrors
        } = useSectionCardFlow({
            sections: pessoaSectionFlowConfig,
            initialExpandedId: 'dados-cliente'
        });
        const resolveSelectedContrato = useCallback(async (
            contratoId?: number | null,
            contratoResumo?: Partial<ContratoEntity> | null,
            shouldFetchFallback = true
        ) => {
            const contratoPreselecionado = buildContratoSelectionFromResumo(contratoResumo, contratoId);

            if (contratoPreselecionado) {
                setSelectedContrato(contratoPreselecionado);
                return;
            }

            if (!contratoId || !shouldFetchFallback) {
                setSelectedContrato(null);
                return;
            }

            try {
                const response = await fetchContratoByID(String(contratoId));
                setSelectedContrato(response.contrato ? new ContratoEntity(response.contrato) : null);
            } catch (error) {
                console.error('Erro ao buscar contrato selecionado:', error);
                setSelectedContrato(null);
            }
        }, []);
        const resolveSelectedVendedor = useCallback(async (vendedorId?: number | null) => {
            if (!vendedorId) {
                setSelectedVendedor(null);
                return;
            }

            try {
                const { dataVendedor } = await fetchVendedor(String(vendedorId));
                setSelectedVendedor(new VendedorEntity(dataVendedor));
            } catch (error) {
                console.error('Erro ao buscar vendedor selecionado:', error);
                setSelectedVendedor(null);
            }
        }, []);
        const handleAllChanges = (event: any) => {
            const id = event?.target?.id;
            const type = event?.target?.type;
            const checked = event?.target?.checked;
            const value = event?.target?.value ?? event?.value ?? '';
            let newValue = type === 'checkbox' || type === 'switch' ? checked : value;
            const numericFields = [
                'inscricao_estadual',
                'inscricao_municipal',
                'telefone',
                'cep'
            ];
            if (numericFields.includes(id)) {
                newValue = String(newValue).replace(/\D/g, '');
            }
            const camposEndereco = [
                'cep',
                'logradouro',
                'bairro',
                'numero',
                'uf',
                'municipio',
                'codigo_municipio',
                'codigo_pais',
                'complemento',
                'nome_pais',
                'telefone'
            ];
            setPessoa((prev) => {
                const pessoaAnterior = new PessoaEntity(prev);

                if (camposEndereco.includes(id)) {
                    return pessoaAnterior.copyWith({
                        endereco: {
                            ...pessoaAnterior.endereco,
                            [id]: newValue
                        }
                    });
                }
                return pessoaAnterior.copyWith({
                    [id]: newValue
                });
            });
        };
        const handleDropdownChange = (event: DropdownChangeEvent) => {
            const pessoaInstance = pessoa instanceof PessoaEntity ? pessoa : new PessoaEntity(pessoa);
            setPessoa(pessoaInstance.copyWith({ [event.target.id]: event.value }));
        };
        const handleDropdownChangeEndereco = (event: DropdownChangeEvent) => {
            const updatedEndereco = {
                ...pessoa.endereco,
                [event.target.id]: event.value
            };
            setPessoa((prev) => prev.copyWith({ endereco: updatedEndereco }));
        };
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) event.preventDefault();
            msgs.current?.clear();
            if (isLoadingBtnCreated) return;
            const isValid = validatePessoaForm();
            if (!isValid) {
                setTouchedFields((prev) => ({ ...prev, submit: true }));
                return;
            }
            setIsLoadingBtnCreated(true);
            try {
                if (isEditMode && pessoaId) {
                    const updated = await updatePessoa(pessoaId, pessoa, setErrors, msgs, router, setPessoa, redirectAfterSave ?? true);
                    if (updated) {
                        await onSaved?.(updated);
                        if (!onSaved) {
                            onClose?.();
                        }
                    }
                } else {
                    const created = await createdPessoa(pessoa, setErrors, msgs, router, setPessoa, redirectAfterSave ?? true);
                    if (created) {
                        await onSaved?.(created);
                        if (!onSaved) {
                            onClose?.();
                        }
                    }
                }
            } finally {
                setIsLoadingBtnCreated(false);
                setStateDisableBtnCreatedClienteFornecedor(false);
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
        const openEditVendedorDialog = async (vendedorSelecionado: VendedorEntity | null) => {
            const vendedorId =
                vendedorSelecionado?.id ??
                selectedVendedor?.id ??
                pessoa.id_vendedor_padrao ??
                null;

            if (!vendedorId) {
                return;
            }

            setIsVendedorDialogLoading(true);
            try {
                const vendedorIdAsString = String(vendedorId);
                const { dataVendedor } = await fetchVendedor(vendedorIdAsString);
                setPreloadedVendedor(dataVendedor);
                setEditingVendedorId(vendedorIdAsString);
                setVendedorDialogKey((current) => current + 1);
                setShowModalVendedor(true);
            } catch (error) {
                console.error('Erro ao pré-carregar vendedor para edição:', error);
                setIsVendedorDialogLoading(false);
            }
        };
        const closeVendedorDialog = () => {
            setShowModalVendedor(false);
            setEditingVendedorId(null);
            setIsVendedorDialogLoading(true);
            setPreloadedVendedor(null);
        };
        const openCreateContratoDialog = () => {
            setIsContratoDialogLoading(true);
            setEditingContratoId(null);
            setPreloadedContrato(null);
            setContratoDialogKey((current) => current + 1);
            setShowModalContrato(true);
        };
        const openEditContratoDialog = async (contratoSelecionado: ContratoEntity | null) => {
            const contratoId =
                contratoSelecionado?.id ??
                selectedContrato?.id ??
                pessoa.id_contrato ??
                null;

            if (!contratoId) {
                return;
            }

            setIsContratoDialogLoading(true);
            try {
                const contratoIdAsString = String(contratoId);
                console.log('[PessoaForm] abrindo edicao de contrato', { contratoId: contratoIdAsString, contratoSelecionado });
                const contratoPrecarregado = await fetchContratosById(contratoIdAsString);
                console.log('[PessoaForm] preload do contrato concluido', contratoPrecarregado);
                setPreloadedContrato(contratoPrecarregado);
                setEditingContratoId(contratoIdAsString);
                setContratoDialogKey((current) => current + 1);
                setShowModalContrato(true);
            } catch (error) {
                console.error('Erro ao pré-carregar contrato para edição:', error);
                setIsContratoDialogLoading(false);
            }
        };
        const closeContratoDialog = () => {
            console.log('[PessoaForm] closeContratoDialog chamado', {
                editingContratoId,
                showModalContrato
            });
            setShowModalContrato(false);
            setEditingContratoId(null);
            setPreloadedContrato(null);
            window.setTimeout(() => {
                setIsContratoDialogLoading(false);
            }, 200);
        };
        const handleContratoFormChange = (updatedContrato: ContratoEntity) => {
            setContrato(updatedContrato);
        };
        const handleVendedorSaved = (created: VendedorEntity) => {
            closeVendedorDialog();
            setSelectedVendedor(created);
            handleAllChanges({
                target: { id: 'id_vendedor_padrao', value: created.id, type: 'input' }
            });
            setReloadKeyVendedor((current) => current + 1);
        };
        const handleContratoSaved = async (created: ContratoEntity) => {
            console.log('[PessoaForm] handleContratoSaved chamado', created);
            setIsContratoDialogLoading(true);
            let contratoAtualizado = created;

            try {
                if (created?.id) {
                    const response = await fetchContratoByID(String(created.id));
                    contratoAtualizado = new ContratoEntity(response.contrato);
                }

                setSelectedContrato(contratoAtualizado);
                setPessoa((prev) =>
                    prev.copyWith({
                        id_contrato: contratoAtualizado.id
                    })
                );
                setErrors((prevErrors) => {
                    const newErrors = { ...prevErrors };
                    delete newErrors.selectedContrato;
                    return newErrors;
                });
                setContrato(
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
                        id_clientes_contrato: [0]
                    })
                );
                setReloadKeyContratoDropdown((current) => current + 1);
            } catch (error) {
                console.error('[PessoaForm] erro ao recarregar contrato salvo:', error);
            } finally {
                closeContratoDialog();
            }
        };
        const handleVendedorChange = (vendedorSelecionado: VendedorEntity | null) => {
            setSelectedVendedor(vendedorSelecionado);
            handleAllChanges({
                target: { id: 'id_vendedor_padrao', value: vendedorSelecionado?.id ?? null, type: 'input' }
            });
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedVendedor;
                return newErrors;
            });
        };
        const handleContatoChange = (event: DropdownChangeEvent) => {
            const selected = (event.value as string | null) ?? null;
            setSelectedContato(selected);
            const updatedPessoa = pessoa.copyWith(mapContatoSelectionToFlags(selected));
            setPessoa(updatedPessoa);
            validateFieldsPessoa(updatedPessoa, setErrors, msgs);
        };
        const handleCNAEChange = (cnae: TableCNAEEntity | null) => {
            setSelectedCNAE(cnae);
            const updatedPessoa = pessoa.copyWith({
                cnae_fiscal: cnae?.codigo ?? null
            });
            setPessoa(updatedPessoa);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.cnae_fiscal;
                return newErrors;
            });
        };
        const handleContratoChange = (contrato: ContratoEntity | null) => {
            setSelectedContrato(contrato);
            const updatedPessoa = pessoa.copyWith({
                id_contrato: contrato?.id ?? null
            });
            setPessoa(updatedPessoa);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedContrato;
                return newErrors;
            });
        };
        const handleErrorsChange = (updatedErrors: Record<string, string>) => {
            setErrors(updatedErrors);
        };
        const handleValidateCnpj = () => {
            setTouchedFields((prev) => ({ ...prev, cnpj: true }));
            validatePessoaForm();
        };
        const handleSearchPessoaCnpj = async () => {
            setLoadingCnpj(true);
            await handleSearchCNPJ(pessoa?.cnpj ?? '', setPessoa, setErrors, msgs);
            setLoadingCnpj(false);
            setTouchedFields((prev) => ({ ...prev, cnpj: true }));
        };
        const listagemPessoaID = useCallback(async (currentPessoaId: string) => {
            try {
                setIsLoading(true);
                const { dataPessoa, selectedContrato: selectedContratoPrecarregado } = await fetchPessoasById(currentPessoaId);
                const pessoaEntity = new PessoaEntity(dataPessoa);
                setPessoa(pessoaEntity);
                setSelectedContato(mapPessoaContatoToSelection(dataPessoa));
                await resolveSelectedContrato(
                    dataPessoa.id_contrato ?? null,
                    selectedContratoPrecarregado ?? (dataPessoa as PessoaEntity & { contrato?: Partial<ContratoEntity> }).contrato ?? null,
                    false
                );
                setSelectedCNAE(
                    dataPessoa.cnae_fiscal
                        ? new TableCNAEEntity({
                            id: 0,
                            codigo: dataPessoa.cnae_fiscal,
                            descricao: dataPessoa.cnae_fiscal
                        })
                        : null
                );
                await resolveSelectedVendedor(dataPessoa.id_vendedor_padrao ?? null);
            } finally {
                setIsLoading(false);
            }
        }, [resolveSelectedContrato, resolveSelectedVendedor]);
        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));
        useEffect(() => {
            onPessoaChangeRef.current = onPessoaChange;
        }, [onPessoaChange]);
        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);
        useEffect(() => {
            if (pessoaId) {
                setIsEditMode(true);

                if (preloadedPessoa?.dataPessoa?.id && String(preloadedPessoa.dataPessoa.id) === String(pessoaId)) {
                    const pessoaPrecarregada = new PessoaEntity(preloadedPessoa.dataPessoa);
                    const contratoPrecarregado =
                        preloadedPessoa.selectedContrato ??
                        buildContratoSelectionFromResumo(
                            (preloadedPessoa.dataPessoa as PessoaEntity & { contrato?: Partial<ContratoEntity> }).contrato ?? null,
                            preloadedPessoa.dataPessoa.id_contrato ?? null
                        );

                    setPessoa(pessoaPrecarregada);
                    setSelectedContato(mapPessoaContatoToSelection(preloadedPessoa.dataPessoa));
                    setSelectedContrato(contratoPrecarregado);
                    setSelectedCNAE(
                        preloadedPessoa.dataPessoa.cnae_fiscal
                            ? new TableCNAEEntity({
                                id: 0,
                                codigo: preloadedPessoa.dataPessoa.cnae_fiscal,
                                descricao: preloadedPessoa.dataPessoa.cnae_fiscal
                            })
                            : null
                    );
                    setSelectedVendedor(preloadedPessoa.selectedVendedor ?? null);
                    setIsLoading(false);

                    if (!contratoPrecarregado && preloadedPessoa.dataPessoa.id_contrato) {
                        void resolveSelectedContrato(preloadedPessoa.dataPessoa.id_contrato, null, true);
                    }

                    if (!preloadedPessoa.selectedVendedor && preloadedPessoa.dataPessoa.id_vendedor_padrao) {
                        void resolveSelectedVendedor(preloadedPessoa.dataPessoa.id_vendedor_padrao ?? null);
                    }

                    return;
                }

                listagemPessoaID(pessoaId).finally(() => setIsLoading(false));
                return;
            }

            setIsEditMode(false);
            setIsLoading(false);
        }, [listagemPessoaID, pessoaId, preloadedPessoa, resolveSelectedContrato, resolveSelectedVendedor]);
        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validatePessoaForm();
            }
        }, [touchedFields, validatePessoaForm]);
        useEffect(() => {
            onPessoaChangeRef.current?.(pessoa);
        }, [pessoa]);
        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);
        useEffect(() => {
            if (Object.keys(errors).length > 0) {
                syncExpandedSectionWithErrors(errors);
            }
        }, [errors, syncExpandedSectionWithErrors]);
        useEffect(() => {
            onLoadingChange?.(isLoading || isLoadingBtnCreated);
        }, [isLoading, isLoadingBtnCreated, onLoadingChange]);
        useEffect(() => {
            console.log('[PessoaForm] estado do dialog de contrato alterado', {
                showModalContrato,
                editingContratoId,
                isContratoDialogLoading
            });
        }, [showModalContrato, editingContratoId, isContratoDialogLoading]);
        if (isLoading && pessoaId) {
            return <LoadingScreen loadingText="Carregando informações do Cliente ou Fornecedor selecionado..." />;
        }
        const isSubmitDisabled =
            stateDisableBtnCreatedClienteFornecedor ||
            isLoadingBtnCreated ||
            Object.keys(errors).length > 0 ||
            (pessoa.tipo_pessoa === 'PESSOA_JURIDICA' && !pessoa.cnpj) ||
            (pessoa.tipo_pessoa === 'PESSOA_FISICA' && !pessoa.cpf) ||
            (pessoa.tipo_pessoa === 'ESTRANGEIRO' && !pessoa.documento_estrangeiro) ||
            !pessoa?.razao_social ||
            (pessoa.tipo_pessoa !== 'PESSOA_FISICA' && !pessoa.codigo_regime_tributario) ||
            !pessoa.contribuinte ||
            !pessoa.endereco ||
            !pessoa.email;
        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        return (
            <>
                <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                    <Messages ref={msgs} className="custom-messages" />
                    <div className="scrollable-container shared-form-content">
                        <div className="custom-flex-col">
                            <SectionCard
                                icon={<i className="pi pi-user" />}
                                title="Dados do Cliente"
                                collapsible
                                expanded={isSectionExpanded('dados-cliente')}
                                onToggle={() => toggleSection('dados-cliente')}
                            >
                                <SectionGrid minColumnWidth="220px">
                                    <PessoaFields
                                        pessoa={pessoa}
                                        errors={errors}
                                        selectedContato={selectedContato}
                                        selectedCNAE={selectedCNAE}
                                        loadingCnpj={loadingCnpj}
                                        hasFocused={hasFocused}
                                        onFocusFirstField={() => setHasFocused(true)}
                                        onChange={handleAllChanges}
                                        onDropdownChange={handleDropdownChange}
                                        onContatoChange={handleContatoChange}
                                        onCNAEChange={handleCNAEChange}
                                        onSearchCnpj={handleSearchPessoaCnpj}
                                        onValidateCnpj={handleValidateCnpj}
                                        fetchAllCnae={fetchAllCnae}
                                        fetchFilteredCnae={fetchFilteredCnae}
                                    />
                                </SectionGrid>
                            </SectionCard>
                           
                            <SectionCard
                                icon={<i className="pi pi-map-marker" />}
                                title="Endereço"
                                collapsible
                                expanded={isSectionExpanded('endereco')}
                                onToggle={() => toggleSection('endereco')}
                            >
                                <SectionGrid minColumnWidth="220px">
                                    <EnderecoForm
                                        endereco={pessoa?.endereco}
                                        telefone={pessoa?.endereco?.telefone}
                                        errors={errors}
                                        onChange={handleAllChanges}
                                        onCepSearch={() => handleSearchCep(pessoa.endereco?.cep || '', setLoadingCep, setPessoa, setError, msgs)}
                                        onDropdownChange={handleDropdownChange}
                                        onDropdownChangeEndereco={handleDropdownChangeEndereco}
                                        getCitiesFromState={getCitiesFromState}
                                        loadingCep={loadingCep}
                                        nomePaisObrigatorio
                                        codigoPaisObrigatorio
                                        codigoMunicipioObrigatorio
                                        compactSection
                                    />
                                </SectionGrid>
                            </SectionCard>
                             <SectionCard
                                icon={<i className="pi pi-link" />}
                                title="Relações"
                                collapsible
                                expanded={isSectionExpanded('relacoes')}
                                onToggle={() => toggleSection('relacoes')}
                            >
                                <SectionGrid minColumnWidth="220px">
                                    <div className='grid formgrid p-0'>
                                        {isMobile ? (
                                            <>
                                                <div className="col-4 lg:col-4 w-full">
                                                    <MobileSearchPicker<ContratoEntity>
                                                        selectedItem={selectedContrato}
                                                        onItemChange={handleContratoChange}
                                                        fetchAllItems={listTheContrato}
                                                        fetchFilteredItems={fetchFilteredContrato}
                                                        fetchItemsPage={fetchContratoMobilePage}
                                                        optionLabel="descricao"
                                                        optionValue="id"
                                                        topLabel="Contrato:"
                                                        loadMoreRows={20}
                                                        placeholder="Selecione o Contrato"
                                                        dialogTitle="Selecionar o Contrato"
                                                        hasError={!!errors.selectedContrato}
                                                        errorMessage={errors.selectedContrato}
                                                        onAddClick={openCreateContratoDialog}
                                                        onEditClick={openEditContratoDialog}
                                                        autoLoadAndSelectSingle
                                                    />
                                                </div>
                                                <div className="col-4 lg:col-4 w-full">
                                                    <MobileSearchPicker<VendedorEntity>
                                                        selectedItem={selectedVendedor}
                                                        onItemChange={handleVendedorChange}
                                                        fetchAllItems={listTheVendedor}
                                                        fetchFilteredItems={fetchFilteredVendedor}
                                                        fetchItemsPage={fetchVendedorMobilePage}
                                                        optionLabel="razao_social"
                                                        optionValue="id"
                                                        topLabel="Vendedor:"
                                                        loadMoreRows={20}
                                                        placeholder="Selecione o Vendedor"
                                                        dialogTitle="Selecionar o Vendedor"
                                                        hasError={!!errors.selectedVendedor}
                                                        errorMessage={errors.selectedVendedor}
                                                        onAddClick={openCreateVendedorDialog}
                                                        onEditClick={openEditVendedorDialog}
                                                        autoLoadAndSelectSingle
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="col-4 lg:col-4">
                                                    <ContratoDropdownField
                                                        selectedContrato={selectedContrato}
                                                        selectedContratoId={pessoa.id_contrato ?? null}
                                                        onContratoChange={handleContratoChange}
                                                        reloadKey={reloadKeyContrato + reloadKeyContratoDropdown}
                                                        hasError={!!errors.selectedContrato}
                                                        errorMessage={errors.selectedContrato}
                                                        showAddButton
                                                        onAddClick={openCreateContratoDialog}
                                                        onEditClick={openEditContratoDialog}
                                                        autoSelectSingle={false}
                                                    />
                                                </div>
                                                <div className="col-4 lg:col-4">
                                                    <VendedorDropdownField
                                                        selectedVendedor={selectedVendedor}
                                                        selectedVendedorId={pessoa.id_vendedor_padrao ?? null}
                                                        reloadKey={reloadKeyVendedor}
                                                        onVendedorChange={handleVendedorChange}
                                                        onAddClick={openCreateVendedorDialog}
                                                        onEditClick={openEditVendedorDialog}
                                                        hasError={!!errors.selectedVendedor}
                                                        errorMessage={errors.selectedVendedor}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </SectionGrid>
                            </SectionCard>
                        </div>
                    </div>
                    <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                        {showBTNPGCreatedAll && (
                            <BTNPGCreatedAll
                                onClick={async () => await handleSubmit()}
                                disabled={isSubmitDisabled}
                                label="Salvar"
                                icon="pi pi-save"
                            />
                        )}
                        {showBTNPGCreatedDialog && (
                            <BTNPGCreatedDialog
                                onClick={async () => await handleSubmit()}
                                disabled={isSubmitDisabled}
                                onBackClick={onBackClick}
                                onClose={onClose}
                                label="Salvar"
                                icon="pi pi-save"
                            />
                        )}
                    </div>
                </div>
                <DialogFilter
                    header={editingVendedorId ? "Editar Vendedor" : "Adicionar Vendedor"}
                    visible={showModalVendedor}
                    onHide={closeVendedorDialog}
                    loading={isVendedorDialogLoading}
                    loadingText={editingVendedorId ? 'Carregando informações do Vendedor...' : 'Abrindo cadastro de Vendedor...'}
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
                <DialogFilter
                    header={editingContratoId ? "Editar Contrato" : "Adicionar Contrato"}
                    visible={showModalContrato}
                    onHide={closeContratoDialog}
                    loading={isContratoDialogLoading}
                    loadingText={editingContratoId ? 'Carregando informações do Contrato...' : 'Abrindo cadastro de Contrato...'}
                >
                    <ContratoFormCreated
                        key={`${editingContratoId ?? 'novo'}-${contratoDialogKey}`}
                        msgs={msgs}
                        ref={formContratoRef}
                        contrato={contrato}
                        initialId={editingContratoId}
                        preloadedContrato={preloadedContrato}
                        setContrato={setContrato}
                        onContratoChange={handleContratoFormChange}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handleContratoSaved}
                        onLoadingChange={setIsContratoDialogLoading}
                        onClose={closeContratoDialog}
                        showBTNPGCreatedDialog
                        onBackClick={closeContratoDialog}
                    />
                </DialogFilter>
            </>
        );
    }
);
PessoaFormContainer.displayName = 'PessoaFormContainer';
function isPessoaFormProps(props: FormPessoaCreatedProps): props is PessoaFormProps {
    return 'msgs' in props;
}
export const FormCreatedPessoa = forwardRef<PessoaFormRef, FormPessoaCreatedProps>((props, ref) => {
    if (isPessoaFormProps(props)) {
        return <PessoaFormContainer {...props} ref={ref} />;
    }
    return <PessoaFields {...props} />;
});
FormCreatedPessoa.displayName = 'FormCreatedPessoa';

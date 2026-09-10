'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { TableService } from '@/app/entity/TableServiceEntity';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { TableCodigoNBSEntity } from '@/app/entity/TableCodigoNBS';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { SectionCard, SectionGrid } from '@/app/components/cardForm/SectionCard';
import { useSectionCardFlow } from '@/app/components/cardForm/useSectionCardFlow';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { TableClassificacaoTributariaEntity } from '@/app/entity/TableClassificacaoTributariaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { fetchAllCodigoNBS, fetchFilteredCodigoNBS } from '@/app/components/fetchAll/listAllCodigoNBS/controller';
import { fetchFilteredCnae } from '@/app/components/fetchAll/listAllCnae/controller';
import { fetchAllTabelaServico, fetchFilteredTabelaServico } from '@/app/components/fetchAll/listAllTableService/controller';
import { fetchAllClassificacaoTributaria, fetchFilteredClassificacaoTributaria } from '@/app/components/fetchAll/listAllClassficacaoTributaria/controller';
import {
    createEmptyPerfilTributario,
    FormCreatedPerfilTributarioProps,
    PerfilTributarioFormProps,
    PerfilTributarioFormRef,
    PerfilTributarioRecommendations,
    perfilTributarioSectionFlowConfig
} from '../types/perfilTributario';
import { PerfilTributarioEntity } from '@/app/entity/perfilTributarioEntity';
import {
    createPerfilTributario,
    fetchPerfilTributarioByID,
    fetchPerfilTributarioRecommendations,
    updatePerfilTributario
} from '../controller/controller';
import { getPerfilTributarioValidationErrors, validateFieldsPerfilTributario } from '../controller/validation';
import { EmpresaPerfilTributarioFields, NomeFields, PerfilFields, PerfilTributarioAvancadaFields, PerfilTributarioFields } from './perfilTributario';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { createEmptyServico } from '../../servicos/types/servico';
import { fetchCompanyDropdownByID } from '@/app/(main)/configuracoes/empresas/controller/controller';

const PERFIL_TRIBUTARIO_LOG_PREFIX = '[perfilTributario]';

export const PerfilTributarioFormContainer = forwardRef<PerfilTributarioFormRef, PerfilTributarioFormProps>(
    ({ initialId, preloadedPerfilTributario, msgs, onPerfilTributarioChange, onErrorsChange, redirectAfterSave, onClose, onSaved, onLoadingChange, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
        const router = useRouter();
        const perfilTributarioId = initialId;
        const onPerfilTributarioChangeRef = useRef(onPerfilTributarioChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [isEditMode, setIsEditMode] = useState(false);
        const [servico, setServico] = useState<ServiceEntity>(createEmptyServico());
        const [perfilTributario, setPerfilTributario] = useState<PerfilTributarioEntity>(createEmptyPerfilTributario());
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [selectedService, setSelectedService] = useState<ServiceEntity | null>(null);
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [selectedPerfilTributario, setSelectedPerfilTributario] = useState<PerfilTributarioEntity | null>(null);
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [stateDisableBtnCreatedPerfilTributario, setStateDisableBtnCreatedPerfilTributario] = useState(false);
        const [selectedCodigoServico, setSelectedCodigoServico] = useState<TableService | null>(null);
        const [selectedCodigoNBS, setSelectedCodigoNBS] = useState<TableCodigoNBSEntity | null>(null);
        const [selectedCodigoCNAE, setSelectedCodigoCNAE] = useState<TableCNAEEntity | null>(null);
        const [selectedClassificacaoTributaria, setSelectedClassificacaoTributaria] = useState<TableClassificacaoTributariaEntity | null>(null);
        const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity | null>(null);
        const [recommendations, setRecommendations] = useState<PerfilTributarioRecommendations | null>(null);
        const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
        const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
        const recommendationRequestIdRef = useRef(0);
        const lastRecommendationCompanyIdRef = useRef<number | null>(null);
        const {isSectionExpanded, toggleSection, syncExpandedSectionWithErrors} = useSectionCardFlow({sections: perfilTributarioSectionFlowConfig,initialExpandedId: 'empresa'});
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) event.preventDefault();
            if (isLoadingBtnCreated) return;
            const isValid = validateFieldsPerfilTributario(perfilTributario, setErrors, msgs);
            if (!isValid) {
                setTouchedFields((prev) => ({ ...prev, submit: true }));
                return;
            }
            console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} submit iniciado`, {
                modo: isEditMode ? 'edicao' : 'criacao',
                perfilTributarioId: perfilTributarioId ?? null,
                id_empresa: perfilTributario.id_empresa ?? null,
                payload: perfilTributario
            });
            setIsLoadingBtnCreated(true);
            try {
                if (isEditMode && perfilTributarioId) {
                    const updated = await updatePerfilTributario(perfilTributarioId, perfilTributario, setErrors, msgs, router, setPerfilTributario, redirectAfterSave ?? true);
                    if (updated) {
                        await onSaved?.(updated);
                        if (!onSaved) {
                            onClose?.();
                        }
                    }
                } else {
                    const created = await createPerfilTributario(perfilTributario, setErrors, msgs, router, setPerfilTributario, redirectAfterSave ?? true);
                    await onSaved?.(created);
                    if (!onSaved) {
                        onClose?.();
                    }
                }
            } finally {
                setIsLoadingBtnCreated(false);
                setStateDisableBtnCreatedPerfilTributario(false);
            }
        };
        const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
            let value = event.target.value;

            if (event.target.type === 'checkbox' || event.target.type === 'switch') {
                value = event.target.checked;
            } else if (event.target.type === 'number') {
                value = value === '' ? null : Number(value);
            }
            setPerfilTributario(perfilTributario.copyWith({ [event.target.id]: value }));
        };
       const handleClassificacaoTributariaChange = (classificacaoTributaria: TableClassificacaoTributariaEntity | null) => {
            setSelectedClassificacaoTributaria(classificacaoTributaria);
            const updatedClassificacaoTributaria = perfilTributario.copyWith({ codigo_classificacao_tributaria: classificacaoTributaria?.codigo || '' });
            setPerfilTributario(updatedClassificacaoTributaria);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.codigo_classificacao_tributaria;
                return newErrors;
            });
        };
        const handleCodigoServiceChange = (codigoService: TableService | null) => {
            const selectedCodigo =
                codigoService?.codigo ||
                codigoService?.descricao?.split(' - ')[0]?.trim() ||
                '';
            setSelectedCodigoServico(codigoService);
            const updatedCodigoService = perfilTributario.copyWith({ item_lista_servico: selectedCodigo });
            setPerfilTributario(updatedCodigoService);
            console.log('Codigo do servico selecionado:', {
                selectedOption: codigoService,
                item_lista_servico: selectedCodigo
            });
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.item_lista_servico;
                return newErrors;
            });
            setTouchedFields((prev) => ({
                ...prev,
                item_lista_servico: true
            }));
        };
        const handleCodigoNBSChange = (codigoNBS: TableCodigoNBSEntity | null) => {
            setSelectedCodigoNBS(codigoNBS);
            const updatedCodigoNBS = perfilTributario.copyWith({ codigo_nbs: codigoNBS?.codigo || '' });
            setPerfilTributario(updatedCodigoNBS);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.codigo_nbs;
                return newErrors;
            });
        };
        const handleCodigoCNAEChange = (codigoCNAE: TableCNAEEntity | null) => {
            setSelectedCodigoCNAE(codigoCNAE);
            const updatedCodigoCNAE = perfilTributario.copyWith({ codigo_cnae: codigoCNAE?.codigo || '' });
            setPerfilTributario(updatedCodigoCNAE);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.codigo_cnae;
                return newErrors;
            });
        };
        const handleDropdownChange = (event: DropdownChangeEvent) => {
            const updatedPerfilTributario = perfilTributario.copyWith({ [event.target.id]: event.value });
            setPerfilTributario(updatedPerfilTributario);
        };
        const handleNumberChange = (event: InputNumberValueChangeEvent) => {
            const updatedPerfilTributario= perfilTributario.copyWith({ [event.target.id]: event.value ?? 0 });
            setPerfilTributario(updatedPerfilTributario);
            setTouchedFields((prev) => ({ ...prev, [event.target.id]: true }));
            validateFieldsPerfilTributario(updatedPerfilTributario, setErrors, msgs);
        };
        const handleServicoChange = (service: ServiceEntity | null) => {
                   if (!service) {
                       setSelectedService(null);
                       return;
                   }
                   setSelectedService(service);
                   setServico((prev) => {
                       const updated = {
                           ...prev,
                           item_lista_servico: service.codigo || '',
                           descricao: prev.descricao && prev.descricao.trim() !== '' ? prev.descricao : service.descricao || prev.descricao
                       };
                       return new ServiceEntity(updated);
                   });
       
                   setErrors((prev) => {
                       const newErrors = { ...prev };
                       delete newErrors.item_lista_servico;
                       return newErrors;
                   });
                   setTouchedFields((prev) => ({
                       ...prev,
                       item_lista_servico: true
                   }));
        };
        const handlePerfilTributarioChange = (nextPerfilTributario: PerfilTributarioEntity | null) => {
            setSelectedPerfilTributario(nextPerfilTributario);
        };
        const handleEmpresaChange = async (empresa: CompanyEntity | null) => {
            setSelectedEmpresa(empresa);
            recommendationRequestIdRef.current += 1;
            const requestId = recommendationRequestIdRef.current;
            console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} handleEmpresaChange chamado`, {
                requestId,
                empresaIdRecebido: empresa?.id ?? null,
                empresaSelecionada: empresa
            });

            if (!empresa?.id || empresa.id <= 0) {
                const clearedPerfilTributarioPayload = {
                    id_empresa: null,
                    codigo_cnae: '',
                    item_lista_servico: '',
                    codigo_nbs: '',
                    codigo_indicador_operacao: '',
                    codigo_classificacao_tributaria: ''
                };
                lastRecommendationCompanyIdRef.current = null;
                setRecommendations(null);
                setRecommendationsError(null);
                setSelectedCodigoCNAE(null);
                setSelectedCodigoServico(null);
                setSelectedCodigoNBS(null);
                setSelectedClassificacaoTributaria(null);
                console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} empresa invalida ou removida`, {
                    requestId,
                    empresaIdRecebido: empresa?.id ?? null,
                    payload: clearedPerfilTributarioPayload
                });
                setPerfilTributario((current) => current.copyWith(clearedPerfilTributarioPayload));
                return;
            }

            const empresaId = empresa.id;
            if (lastRecommendationCompanyIdRef.current === empresaId) {
                console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} recomendacoes ignoradas porque a empresa nao mudou`, {
                    requestId,
                    empresaId
                });
                return;
            }

            lastRecommendationCompanyIdRef.current = empresaId;
            const nextPerfilTributarioPayload = {
                id_empresa: empresaId,
                codigo_cnae: '',
                item_lista_servico: '',
                codigo_nbs: '',
                codigo_indicador_operacao: '',
                codigo_classificacao_tributaria: ''
            };
            setRecommendations(null);
            setRecommendationsError(null);
            setSelectedCodigoCNAE(null);
            setSelectedCodigoServico(null);
            setSelectedCodigoNBS(null);
            setSelectedClassificacaoTributaria(null);
            console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} atualizando estado com empresa selecionada`, {
                requestId,
                empresaId,
                payload: nextPerfilTributarioPayload
            });
            setPerfilTributario((current) => current.copyWith(nextPerfilTributarioPayload));
            setIsLoadingRecommendations(true);

            try {
                console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} buscando recomendacoes para empresa`, {
                    requestId,
                    empresaId
                });
                const nextRecommendations = await fetchPerfilTributarioRecommendations(empresaId);
                if (requestId !== recommendationRequestIdRef.current) {
                    console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} resposta ignorada por existir uma selecao mais recente`, {
                        requestId,
                        currentRequestId: recommendationRequestIdRef.current,
                        empresaId
                    });
                    return;
                }

                console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} recomendacoes recebidas`, {
                    requestId,
                    empresaId,
                    totalCNAEs: nextRecommendations.cnaes?.length ?? 0,
                    totalServicos: nextRecommendations.servicos?.length ?? 0,
                    totalNBS: nextRecommendations.nbs?.length ?? 0,
                    totalClassificacoes: nextRecommendations.classificacoes_tributarias?.length ?? 0,
                    totalCorrelacoes: nextRecommendations.correlacoes?.length ?? 0
                });
                setRecommendations(nextRecommendations);
                console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} listas de recomendacoes atualizadas`, {
                    requestId,
                    empresaId,
                    preenchimentoAutomatico: false
                });
            } catch (error) {
                if (requestId === recommendationRequestIdRef.current) {
                    setRecommendationsError('Não foi possível carregar as recomendações da empresa.');
                    console.error(`${PERFIL_TRIBUTARIO_LOG_PREFIX} erro ao carregar recomendacoes da empresa`, {
                        requestId,
                        empresaId,
                        error
                    });
                }
            } finally {
                if (requestId === recommendationRequestIdRef.current) {
                    setIsLoadingRecommendations(false);
                }
            }
        };
        const handleDescriptionBlur = () => {
            setTouchedFields((prev) => ({ ...prev, nome: true }));
            validateFieldsPerfilTributario(perfilTributario, setErrors, msgs);
        };
        const listagemPerfilTributarioID = async (id: string) => {
            try {
                setIsLoading(true);
                const { perfilTributario: loadedPerfilTributario } = await fetchPerfilTributarioByID(id);

                setPerfilTributario(loadedPerfilTributario);

                const [codigoNBSOptions, codigoCNAEOptions, classificacaoOptions, codigoServicoOptions, empresa] = await Promise.all([
                    loadedPerfilTributario.codigo_nbs
                        ? fetchFilteredCodigoNBS(loadedPerfilTributario.codigo_nbs)
                        : Promise.resolve([]),
                    loadedPerfilTributario.codigo_cnae
                        ? fetchFilteredCnae(loadedPerfilTributario.codigo_cnae)
                        : Promise.resolve([]),
                    loadedPerfilTributario.codigo_classificacao_tributaria
                        ? fetchFilteredClassificacaoTributaria(loadedPerfilTributario.codigo_classificacao_tributaria)
                        : Promise.resolve([]),
                    loadedPerfilTributario.item_lista_servico
                        ? fetchFilteredTabelaServico(loadedPerfilTributario.item_lista_servico)
                        : Promise.resolve([]),
                    loadedPerfilTributario.id_empresa
                        ? fetchCompanyDropdownByID(String(loadedPerfilTributario.id_empresa))
                        : Promise.resolve(null)
                ]);

                setSelectedEmpresa(empresa);

                if (empresa?.id) {
                    recommendationRequestIdRef.current += 1;
                    const requestId = recommendationRequestIdRef.current;
                    const empresaId = empresa.id;
                    lastRecommendationCompanyIdRef.current = empresaId;
                    setRecommendations(null);
                    setRecommendationsError(null);
                    setIsLoadingRecommendations(true);

                    try {
                        console.log(`${PERFIL_TRIBUTARIO_LOG_PREFIX} buscando recomendacoes para perfil carregado`, {
                            requestId,
                            empresaId
                        });
                        const nextRecommendations = await fetchPerfilTributarioRecommendations(empresaId);
                        if (requestId === recommendationRequestIdRef.current) {
                            setRecommendations(nextRecommendations);
                        }
                    } catch (error) {
                        if (requestId === recommendationRequestIdRef.current) {
                            setRecommendationsError('NÃ£o foi possÃ­vel carregar as recomendaÃ§Ãµes da empresa.');
                            console.error(`${PERFIL_TRIBUTARIO_LOG_PREFIX} erro ao carregar recomendacoes do perfil`, {
                                requestId,
                                empresaId,
                                error
                            });
                        }
                    } finally {
                        if (requestId === recommendationRequestIdRef.current) {
                            setIsLoadingRecommendations(false);
                        }
                    }
                }

                setSelectedCodigoNBS(
                    codigoNBSOptions.find((option: TableCodigoNBSEntity) => String(option.codigo) === String(loadedPerfilTributario.codigo_nbs)) ?? null
                );
                setSelectedCodigoCNAE(
                    codigoCNAEOptions.find((option: TableCNAEEntity) => String(option.codigo) === String(loadedPerfilTributario.codigo_cnae)) ?? null
                );
                setSelectedClassificacaoTributaria(
                    classificacaoOptions.find((option: TableClassificacaoTributariaEntity) => String(option.codigo) === String(loadedPerfilTributario.codigo_classificacao_tributaria)) ?? null
                );
                setSelectedCodigoServico(
                    codigoServicoOptions.find((option) => String(option.codigo) === String(loadedPerfilTributario.item_lista_servico)) ?? null
                );
            } finally {
                setIsLoading(false);
            }
        };
        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));

        useEffect(() => {
            onPerfilTributarioChangeRef.current = onPerfilTributarioChange;
        }, [onPerfilTributarioChange]);

        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);

        useEffect(() => {
            if (initialId) {
                setIsEditMode(true);
                if (preloadedPerfilTributario?.perfilTributario?.id && String(preloadedPerfilTributario.perfilTributario.id) === String(initialId)) {
                    setPerfilTributario(preloadedPerfilTributario.perfilTributario);
                    setSelectedCodigoNBS(preloadedPerfilTributario.selectedCodigoNBS);
                    setSelectedCodigoCNAE(preloadedPerfilTributario.selectedCodigoCNAE);
                    setSelectedClassificacaoTributaria(preloadedPerfilTributario.selectedClassificacaoTributaria);
                    setSelectedCodigoServico(preloadedPerfilTributario.selectedCodigoServico);
                    setIsLoading(false);
                    return;
                }
                listagemPerfilTributarioID(initialId).finally(() => setIsLoading(false));
                return;
            }

            setIsEditMode(false);
            setIsLoading(false);
        }, [initialId, preloadedPerfilTributario]);

        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validateFieldsPerfilTributario(perfilTributario, setErrors, msgs);
            }
        }, [msgs, perfilTributario, touchedFields]);
        useEffect(() => {
            onPerfilTributarioChangeRef.current?.(perfilTributario);
        }, [perfilTributario]);

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
        if (isLoading && initialId) {
            return <LoadingScreen loadingText="Carregando informações do serviço selecionado..." />;
        }
        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        const isSubmitDisabledByValidation = Object.keys(getPerfilTributarioValidationErrors(perfilTributario)).length > 0;
        const isSubmitDisabled =
            stateDisableBtnCreatedPerfilTributario ||
            isLoadingBtnCreated ||
            isSubmitDisabledByValidation;
        const isEmpresaCardComplete = Boolean(
            perfilTributario.id_empresa &&
            perfilTributario.codigo_cnae &&
            perfilTributario.item_lista_servico &&
            perfilTributario.codigo_nbs &&
            perfilTributario.codigo_indicador_operacao
        );
            
        const perfilTributarioFieldsProps = {
            perfilTributario,
            errors,
            selectedPerfilTributario,
            selectedCodigoCNAE,
            selectedCodigoNBS,
            selectedClassificacaoTributaria,
            selectedCodigoServico,
            onChange: handleAllChanges,
            onDropdownChange: handleDropdownChange,
            onNumberChange: handleNumberChange,
            onServicoChange: handleServicoChange,
            onPerfilTributarioChange: handlePerfilTributarioChange,
            onClassificacaoTributariaChange: handleClassificacaoTributariaChange,
            onCodigoCNAEChange: handleCodigoCNAEChange,
            onDescriptionBlur: handleDescriptionBlur,
            fetchServiceTable: fetchAllTabelaServico,
            fetchAllClassificacaoTributaria,
            fetchFilteredClassificacaoTributaria,
            onCodigoServicoChange: handleCodigoServiceChange,
            onCodigoNBSChange: handleCodigoNBSChange,
            fetchAllCodigoServico: fetchAllTabelaServico,
            fetchFilteredCodigoServico: fetchFilteredTabelaServico,
            fetchAllCodigoNBS,
            fetchFilteredCodigoNBS,
        };
        return (
            <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container shared-form-content">
                    <div className="custom-flex-col">
                        <SectionCard
                            icon={<i className="pi pi-building" />}
                            title="Empresa"
                            collapsible
                            expanded={isSectionExpanded('empresa')}
                            onToggle={() => toggleSection('empresa')}
                        >
                            <SectionGrid minColumnWidth="220px">
                                <EmpresaPerfilTributarioFields
                                    perfilTributario={perfilTributario}
                                    errors={errors}
                                    selectedEmpresa={selectedEmpresa}
                                    selectedCodigoCNAE={selectedCodigoCNAE}
                                    selectedCodigoNBS={selectedCodigoNBS}
                                    selectedCodigoServico={selectedCodigoServico}
                                    selectedClassificacaoTributaria={selectedClassificacaoTributaria}
                                    recommendations={recommendations}
                                    isLoadingRecommendations={isLoadingRecommendations}
                                    recommendationsError={recommendationsError}
                                    onEmpresaChange={handleEmpresaChange}
                                    onCodigoCNAEChange={handleCodigoCNAEChange}
                                    onCodigoServicoChange={handleCodigoServiceChange}
                                    onCodigoNBSChange={handleCodigoNBSChange}
                                    onClassificacaoTributariaChange={handleClassificacaoTributariaChange}
                                    onDropdownChange={handleDropdownChange}
                                />
                            </SectionGrid>
                        </SectionCard>
                        <SectionCard
                            icon={<i className="pi pi-file-edit" />}
                            title="Descrição"
                            collapsible
                            disabled={!isEmpresaCardComplete}
                            expanded={isEmpresaCardComplete && isSectionExpanded('dados-perfilTributario')}
                            onToggle={() => toggleSection('dados-perfilTributario')}
                        >
                            <SectionGrid minColumnWidth="220px">
                                <NomeFields {...perfilTributarioFieldsProps} />
                            </SectionGrid>
                        </SectionCard>
                        <SectionCard
                            icon={<i className="pi pi-percentage" />}
                            title="Tributações"
                            collapsible
                            disabled={!isEmpresaCardComplete}
                            expanded={isEmpresaCardComplete && isSectionExpanded('tributacoes')}
                            onToggle={() => toggleSection('tributacoes')}
                        >
                            <SectionGrid minColumnWidth="220px">
                                <PerfilTributarioFields {...perfilTributarioFieldsProps} />
                            </SectionGrid>
                        </SectionCard>
                        <SectionCard
                            icon={<i className="pi pi-calculator" />}
                            title="Informações Tributárias Avançadas"
                            collapsible
                            disabled={!isEmpresaCardComplete}
                            expanded={isEmpresaCardComplete && isSectionExpanded('informacoes-tributarias-avancadas')}
                            onToggle={() => toggleSection('informacoes-tributarias-avancadas')}
                        >
                            <SectionGrid minColumnWidth="220px">
                                <PerfilTributarioAvancadaFields {...perfilTributarioFieldsProps} />
                            </SectionGrid>
                        </SectionCard>
                    </div>
                </div>
                <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                    {showBTNPGCreatedAll && (
                        <BTNPGCreatedAll
                            onClick={handleSubmit}
                            label="Salvar"
                            disabled={isSubmitDisabled}
                            icon="pi pi-save"
                        />
                    )}

                    {showBTNPGCreatedDialog && (
                        <BTNPGCreatedDialog
                            onClick={handleSubmit}
                            label="Salvar"
                            onBackClick={onBackClick}
                            onClose={onClose}
                            disabled={isSubmitDisabled}
                            icon="pi pi-save"
                        />
                    )}
                </div>
            </div>
        );
    }
);
PerfilTributarioFormContainer.displayName = 'PerfilTributarioFormContainer';

function isPerfilTributarioFormProps(props: FormCreatedPerfilTributarioProps): props is PerfilTributarioFormProps {
    return 'msgs' in props;
}
export const FormCreatedPerfilTributario = forwardRef<PerfilTributarioFormRef, FormCreatedPerfilTributarioProps>((props, ref) => {
    if (isPerfilTributarioFormProps(props)) {
        return <PerfilTributarioFormContainer {...props} ref={ref} />;
    }
    return <PerfilFields {...props} />;
});
FormCreatedPerfilTributario.displayName = 'FormCreatedPerfilTributario';

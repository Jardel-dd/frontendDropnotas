'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { SectionCard, SectionGrid } from '@/app/components/cardForm/SectionCard';
import { useSectionCardFlow } from '@/app/components/cardForm/useSectionCardFlow';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { fetchAllPerfilTributario, fetchFilteredPerfilTributario } from '@/app/(main)/cadastro/perfilTributario/controller/controller';
import { getServicoValidationErrors, validateFieldsServicos } from '@/app/(main)/cadastro/servicos/controller/validation';
import { ServicoDescricaoFields, ServicoFields, ServicoVinculosFields } from './servico';
import { createServico, fetchServiceFormDataByID, updateServico } from '@/app/(main)/cadastro/servicos/controller/controller';
import { createEmptyServico, FormCreatedServicoProps, ServiceFormProps, ServiceFormRef, servicoSectionFlowConfig } from '../types/servico';
import { PerfilTributarioEntity } from '@/app/entity/perfilTributarioEntity';
import { FormCreatedPerfilTributario } from '@/app/(main)/cadastro/perfilTributario/form/controller';
import { createEmptyPerfilTributario } from '@/app/(main)/cadastro/perfilTributario/types/perfilTributario';
import FormEmpresaCreated from '@/app/(main)/configuracoes/empresas/form/controller';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';

export const ServicoFormContainer = forwardRef<ServiceFormRef, ServiceFormProps>(
    ({ initialId, preloadedServico, msgs, onServicoChange, onErrorsChange, redirectAfterSave, onClose, onSaved, onLoadingChange, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
        const router = useRouter();
        const servicoId = initialId;
        const onServicoChangeRef = useRef(onServicoChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [isEditMode, setIsEditMode] = useState(false);
        const [servico, setServico] = useState<ServiceEntity>(createEmptyServico());
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [stateDisableBtnCreatedService, setStateDisableBtnCreatedService] = useState(false);
        const [selectedPerfilTributario, setSelectedPerfilTributario] = useState<PerfilTributarioEntity | null>(null);
        const [selectedEmpresas, setSelectedEmpresas] = useState<CompanyEntity[]>([]);
        const [showModalPerfilTributario, setShowModalPerfilTributario] = useState(false);
        const [showModalEmpresa, setShowModalEmpresa] = useState(false);
        const [isPerfilTributarioDialogLoading, setIsPerfilTributarioDialogLoading] = useState(false);
        const [isEmpresaDialogLoading, setIsEmpresaDialogLoading] = useState(false);
        const [perfilTributarioDialogKey, setPerfilTributarioDialogKey] = useState(0);
        const [empresaDialogKey, setEmpresaDialogKey] = useState(0);
        const {
            isSectionExpanded,
            toggleSection,
            syncExpandedSectionWithErrors
        } = useSectionCardFlow({
            sections: servicoSectionFlowConfig,
            initialExpandedId: 'dados-servico'
        });

        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) event.preventDefault();
            if (isLoadingBtnCreated) return;

            const isValid = validateFieldsServicos(servico, setErrors, msgs);
            if (!isValid) {
                setTouchedFields((prev) => ({ ...prev, submit: true }));
                return;
            }

            setIsLoadingBtnCreated(true);
            try {
                if (isEditMode && servicoId) {
                    const updated = await updateServico(servicoId, servico, setErrors, msgs, router, setServico, redirectAfterSave ?? true);
                    if (updated) {
                        await onSaved?.(updated);
                        if (!onSaved) {
                            onClose?.();
                        }
                    }
                } else {
                    const created = await createServico(servico, setErrors, msgs, router, setServico, redirectAfterSave ?? true);
                    await onSaved?.(created);
                    if (!onSaved) {
                        onClose?.();
                    }
                }
            } finally {
                setIsLoadingBtnCreated(false);
                setStateDisableBtnCreatedService(false);
            }
        };

        const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
            let value = event.target.value;

            if (event.target.type === 'checkbox' || event.target.type === 'switch') {
                value = event.target.checked;
            } else if (event.target.type === 'number') {
                value = value === '' ? null : Number(value);
            }

            setServico((prev) => prev.copyWith({ [event.target.id]: value }));
        };

        const handlePerfilTributarioChange = (perfilTributario: PerfilTributarioEntity | null) => {
            setSelectedPerfilTributario(perfilTributario);
            const updatedServico = servico.copyWith({ id_perfil_tributario: perfilTributario?.id ?? null });
            setServico(updatedServico);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.id_perfil_tributario;
                return newErrors;
            });
            setTouchedFields((prev) => ({
                ...prev,
                id_perfil_tributario: true
            }));
        };

        const handleCompanyChange = (event: { value: CompanyEntity[] }) => {
            const companies = Array.isArray(event.value) ? event.value : [];
            const companyIds = companies
                .map((company) => Number(company.id))
                .filter((companyId) => Number.isFinite(companyId) && companyId > 0);

            setSelectedEmpresas(companies);
            const updatedServico = servico.copyWith({ id_empresas: companyIds });
            setServico(updatedServico);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.id_empresas;
                return newErrors;
            });
            setTouchedFields((prev) => ({
                ...prev,
                id_empresas: true
            }));
        };

        const openCreatePerfilTributarioDialog = () => {
            setIsPerfilTributarioDialogLoading(true);
            setPerfilTributarioDialogKey((current) => current + 1);
            setShowModalPerfilTributario(true);
        };

        const closePerfilTributarioDialog = () => {
            setShowModalPerfilTributario(false);
            setIsPerfilTributarioDialogLoading(false);
        };

        const handlePerfilTributarioSaved = async (created: PerfilTributarioEntity) => {
            handlePerfilTributarioChange(created);
            closePerfilTributarioDialog();
        };

        const openCreateEmpresaDialog = () => {
            setIsEmpresaDialogLoading(true);
            setEmpresaDialogKey((current) => current + 1);
            setShowModalEmpresa(true);
        };

        const closeEmpresaDialog = () => {
            setShowModalEmpresa(false);
            setIsEmpresaDialogLoading(false);
        };

        const handleEmpresaSaved = async (created: CompanyEntity) => {
            const empresasAtualizadas = [
                ...selectedEmpresas.filter((empresa) => empresa.id !== created.id),
                created
            ];

            setSelectedEmpresas(empresasAtualizadas);
            setServico((current) => current.copyWith({
                id_empresas: empresasAtualizadas
                    .map((empresa) => Number(empresa.id))
                    .filter((empresaId) => Number.isFinite(empresaId) && empresaId > 0)
            }));
            setErrors((previous) => {
                const updated = { ...previous };
                delete updated.id_empresas;
                return updated;
            });
            closeEmpresaDialog();
        };

        const handleNumberChange = (event: InputNumberValueChangeEvent) => {
            const updatedServico = servico.copyWith({ [event.target.id]: event.value ?? 0 });
            setServico(updatedServico);
            setTouchedFields((prev) => ({ ...prev, [event.target.id]: true }));
            validateFieldsServicos(updatedServico, setErrors, msgs);
        };

        const handleDescriptionBlur = () => {
            setTouchedFields((prev) => ({ ...prev, descricao: true }));
            validateFieldsServicos(servico, setErrors, msgs);
        };

        const listagemServicosID = async (id: string) => {
            try {
                setIsLoading(true);
                const serviceFormData = await fetchServiceFormDataByID(id);
                setServico(serviceFormData.servico);
                setSelectedPerfilTributario(serviceFormData.selectedPerfilTributario);
                setSelectedEmpresas(serviceFormData.selectedEmpresas);
            } finally {
                setIsLoading(false);
            }
        };

        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));

        useEffect(() => {
            onServicoChangeRef.current = onServicoChange;
        }, [onServicoChange]);

        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);

        useEffect(() => {
            if (initialId) {
                setIsEditMode(true);

                if (preloadedServico?.servico?.id && String(preloadedServico.servico.id) === String(initialId)) {
                    setServico(preloadedServico.servico);
                    setSelectedPerfilTributario(preloadedServico.selectedPerfilTributario);
                    setSelectedEmpresas(preloadedServico.selectedEmpresas);
                    setIsLoading(false);
                    return;
                }

                listagemServicosID(initialId).finally(() => setIsLoading(false));
                return;
            }

            setIsEditMode(false);
            setSelectedPerfilTributario(null);
            setSelectedEmpresas([]);
            setIsLoading(false);
        }, [initialId, preloadedServico]);

        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validateFieldsServicos(servico, setErrors, msgs);
            }
        }, [msgs, servico, touchedFields]);

        useEffect(() => {
            onServicoChangeRef.current?.(servico);
        }, [servico]);

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
            return <LoadingScreen loadingText="Carregando informacoes do servico selecionado..." />;
        }

        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        const isSubmitDisabledByValidation = Object.keys(getServicoValidationErrors(servico)).length > 0;
        const isSubmitDisabled =
            stateDisableBtnCreatedService ||
            isLoadingBtnCreated ||
            isSubmitDisabledByValidation;
        const servicoFieldsProps = {
            servico,
            errors,
            selectedPerfilTributario,
            selectedEmpresas,
            onChange: handleAllChanges,
            onNumberChange: handleNumberChange,
            onPerfilTributarioChange: handlePerfilTributarioChange,
            onCompanyChange: handleCompanyChange,
            onAddPerfilTributario: openCreatePerfilTributarioDialog,
            onAddEmpresa: openCreateEmpresaDialog,
            onDescriptionBlur: handleDescriptionBlur,
            fetchAllPerfilTributario,
            fetchFilteredPerfilTributario
        };

        return (
            <>
            <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container shared-form-content">
                    <div className="custom-flex-col">
                        <SectionCard
                            icon={<i className="pi pi-file-edit" />}
                            title="Dados do Serviço"
                            collapsible
                            expanded={isSectionExpanded('dados-servico')}
                            onToggle={() => toggleSection('dados-servico')}
                        >
                            <SectionGrid minColumnWidth="220px">
                                <ServicoDescricaoFields {...servicoFieldsProps} />
                            </SectionGrid>
                        </SectionCard>
                        <SectionCard
                            icon={<i className="pi pi-link" />}
                            title="Vínculos"
                            collapsible
                            expanded={isSectionExpanded('vinculos')}
                            onToggle={() => toggleSection('vinculos')}
                        >
                            <SectionGrid minColumnWidth="220px">
                                <ServicoVinculosFields {...servicoFieldsProps} />
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
            <DialogFilter
                header="Adicionar Perfil Tributário"
                visible={showModalPerfilTributario}
                onHide={closePerfilTributarioDialog}
                loading={isPerfilTributarioDialogLoading}
                loadingText="Abrindo cadastro de Perfil Tributário..."
            >
                <FormCreatedPerfilTributario
                    key={perfilTributarioDialogKey}
                    msgs={msgs}
                    perfilTributario={createEmptyPerfilTributario()}
                    redirectAfterSave={false}
                    onSaved={handlePerfilTributarioSaved}
                    onLoadingChange={setIsPerfilTributarioDialogLoading}
                    onClose={closePerfilTributarioDialog}
                    showBTNPGCreatedDialog
                    onBackClick={closePerfilTributarioDialog}
                />
            </DialogFilter>
            <DialogFilter
                header="Adicionar Empresa"
                visible={showModalEmpresa}
                onHide={closeEmpresaDialog}
                loading={isEmpresaDialogLoading}
                loadingText="Abrindo cadastro de Empresa..."
            >
                <FormEmpresaCreated
                    key={empresaDialogKey}
                    msgs={msgs}
                    empresa={{}}
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
ServicoFormContainer.displayName = 'ServicoFormContainer';

function isServiceFormProps(props: FormCreatedServicoProps): props is ServiceFormProps {
    return 'msgs' in props;
}

export const FormCreatedServico = forwardRef<ServiceFormRef, FormCreatedServicoProps>((props, ref) => {
    if (isServiceFormProps(props)) {
        return <ServicoFormContainer {...props} ref={ref} />;
    }

    return <ServicoFields {...props} />;
});
FormCreatedServico.displayName = 'FormCreatedServico';

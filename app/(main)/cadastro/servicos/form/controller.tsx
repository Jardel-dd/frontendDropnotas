'use client';
import '@/app/styles/styledGlobal.css';
import { ServicoFields } from './servico';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { TableCodigoNBSEntity } from '@/app/entity/TableCodigoNBS';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { fetchServicesByID } from '@/app/(main)/cadastro/servicos/controller/controller';
import { searchServiceTable } from '@/app/components/fetchAll/listAllTableService/controller';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import { validateFieldsServicos } from '@/app/(main)/cadastro/servicos/controller/validation';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { createServico, updateServico } from '@/app/(main)/cadastro/servicos/controller/controller';
import { TableClassificacaoTributariaEntity } from '@/app/entity/TableClassificacaoTributariaEntity';
import {createEmptyServico, FormCreatedServicoProps, ServiceFormProps, ServiceFormRef} from '../types/servico';
import { fetchAllCodigoNBS, fetchFilteredCodigoNBS } from '@/app/components/fetchAll/listAllCodigoNBS/controller';
import { fetchAllClassificacaoTributaria, fetchFilteredClassificacaoTributaria } from '@/app/components/fetchAll/listAllClassficacaoTributaria/controller';

export const ServicoFormContainer = forwardRef<ServiceFormRef, ServiceFormProps>(
    ({ initialId, msgs, onServicoChange, onErrorsChange, redirectAfterSave, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
        const router = useRouter();
        const servicoId = initialId;
        const onServicoChangeRef = useRef(onServicoChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [isEditMode, setIsEditMode] = useState(false);
        const [servico, setServico] = useState<ServiceEntity>(createEmptyServico());
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [selectedService, setSelectedService] = useState<ServiceEntity | null>(null);
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [stateDisableBtnCreatedService, setStateDisableBtnCreatedService] = useState(false);
        const [selectedCodigoNBS, setSelectedCodigoNBS] = useState<TableCodigoNBSEntity | null>(null);
        const [selectedClassificacaoTributaria, setSelectedClassificacaoTributaria] = useState<TableClassificacaoTributariaEntity | null>(null);

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
                    await updateServico(servicoId, servico, setErrors, msgs, router, setServico, redirectAfterSave ?? true);
                } else {
                    const created = await createServico(servico, setErrors, msgs, router, setServico, redirectAfterSave ?? true);
                    onSaved?.(created);
                }

                onClose?.();
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

            setServico(servico.copyWith({ [event.target.id]: value }));
        };
        const handleClassificacaoTributariaChange = (classificacaoTributaria: TableClassificacaoTributariaEntity | null) => {
            setSelectedClassificacaoTributaria(classificacaoTributaria);
            const updatedClassificacaoTributaria = servico.copyWith({ codigo_classificacao_tributaria: classificacaoTributaria?.codigo || '' });
            setServico(updatedClassificacaoTributaria);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.codigo_classificacao_tributaria;
                return newErrors;
            });
        };
        const handleCodigoNBSChange = (codigoNBS: TableCodigoNBSEntity | null) => {
            setSelectedCodigoNBS(codigoNBS);
            const updatedCodigoNBS = servico.copyWith({ codigo_nbs: codigoNBS?.codigo || '' });
            setServico(updatedCodigoNBS);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.codigo_nbs;
                return newErrors;
            });
        };
        const handleDropdownChange = (event: DropdownChangeEvent) => {
            const updatedService = servico.copyWith({ [event.target.id]: event.value });
            setServico(updatedService);
        };
        const handleNumberChange = (event: InputNumberValueChangeEvent) => {
            const updatedServico = servico.copyWith({ [event.target.id]: event.value ?? 0 });
            setServico(updatedServico);
            setTouchedFields((prev) => ({ ...prev, [event.target.id]: true }));
            validateFieldsServicos(updatedServico, setErrors, msgs);
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
        const handleDescriptionBlur = () => {
            setTouchedFields((prev) => ({ ...prev, descricao: true }));
            validateFieldsServicos(servico, setErrors, msgs);
        };
        const listagemServicosID = async (id: string) => {
            try {
                setIsLoading(true);
                const { servico } = await fetchServicesByID(id);
                const entidade = new ServiceEntity(servico);

                setServico(
                    new ServiceEntity({
                        ...entidade,
                        item_lista_servico: '010501'
                    })
                );

                if (entidade.codigo_nbs) {
                    setSelectedCodigoNBS(
                        new TableCodigoNBSEntity({
                            id: 0,
                            codigo: entidade.codigo_nbs,
                            descricao: entidade.codigo_nbs
                        })
                    );
                }

                if (entidade.codigo_classificacao_tributaria) {
                    setSelectedClassificacaoTributaria(
                        new TableClassificacaoTributariaEntity({
                            id: 0,
                            codigo: entidade.codigo_classificacao_tributaria,
                            descricao: entidade.codigo_classificacao_tributaria,
                            codigoCst: entidade.codigo_classificacao_tributaria
                        })
                    );
                }

                const allServices = await searchServiceTable();
                const itemCodigo = entidade.item_lista_servico?.split(' - ')[0];
                const matchedServico = allServices.find((option: ServiceEntity) => option.codigo === itemCodigo);
                setSelectedService(matchedServico ?? null);
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
                listagemServicosID(initialId).finally(() => setIsLoading(false));
                return;
            }

            setIsLoading(false);
        }, [initialId]);
        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validateFieldsServicos(servico, setErrors, msgs);
            }
        }, [servico]);
        useEffect(() => {
            onServicoChangeRef.current?.(servico);
        }, [servico]);
        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);
        if (isLoading && initialId) {
            return <LoadingScreen loadingText="Carregando informacoes do Servico selecionado..." />;
        }
        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        const isSubmitDisabled =
            stateDisableBtnCreatedService ||
            isLoadingBtnCreated ||
            Object.keys(errors).length > 0 ||
            !servico.descricao?.trim() ||
            !servico.valor_servico ||
            !servico.codigo_situacao_tributaria ||
            !servico.codigo_classificacao_tributaria ||
            !servico.codigo_situacao_tributaria_regular ||
            !servico.item_lista_servico ||
            !servico.iss_retido ||
            !servico.exigibilidade_iss ||
            !servico.responsavel_retencao ||
            !servico.codigo_indicador_operacao;
        return (
            <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container shared-form-content">
                    <div className="custom-flex-col">
                        <ServicoFields
                            servico={servico}
                            errors={errors}
                            selectedService={selectedService}
                            selectedCodigoNBS={selectedCodigoNBS}
                            selectedClassificacaoTributaria={selectedClassificacaoTributaria}
                            onChange={handleAllChanges}
                            onDropdownChange={handleDropdownChange}
                            onNumberChange={handleNumberChange}
                            onServicoChange={handleServicoChange}
                            onCodigoNBSChange={handleCodigoNBSChange}
                            onClassificacaoTributariaChange={handleClassificacaoTributariaChange}
                            onDescriptionBlur={handleDescriptionBlur}
                            fetchServiceTable={searchServiceTable}
                            fetchAllClassificacaoTributaria={fetchAllClassificacaoTributaria}
                            fetchFilteredClassificacaoTributaria={fetchFilteredClassificacaoTributaria}
                            fetchAllCodigoNBS={fetchAllCodigoNBS}
                            fetchFilteredCodigoNBS={fetchFilteredCodigoNBS}
                        />
                    </div>
                </div>
                <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                    {showBTNPGCreatedAll && (
                        <BTNPGCreatedAll
                            onClick={handleSubmit}
                            label="Salvar"
                            disabled={isSubmitDisabled}
                        />
                    )}

                    {showBTNPGCreatedDialog && (
                        <BTNPGCreatedDialog
                            onClick={handleSubmit}
                            label="Salvar"
                            onBackClick={onBackClick}
                            onClose={onClose}
                            disabled={isSubmitDisabled}
                        />
                    )}
                </div>
            </div>
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

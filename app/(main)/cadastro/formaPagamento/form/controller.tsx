import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { FormaPagamentoFields } from './formaPagamento';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { validateFieldsFormaPagamento } from '../controller/validation';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { createdFormaPagamento, fetchFormaPagamentoByID, updateFormaPagamento } from '../controller/controller';
import { createEmptyFormaPagamento, toFormaPagamentoEntity, FormCreatedFormaPagamentoProps, FormaPagamentoFormProps, FormaPagamentoFormRef } from '../types/formaPagamento';

export const FormaPagamentoFormContainer = forwardRef<FormaPagamentoFormRef, FormaPagamentoFormProps>(
    ({ initialId, preloadedFormaPagamento, msgs, onFormaPagamentoChange, onErrorsChange, redirectAfterSave, onSaved, onClose, onLoadingChange, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
        const router = useRouter();
        const onFormaPagamentoChangeRef = useRef(onFormaPagamentoChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [isEditMode, setIsEditMode] = useState(false);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoEntity>(createEmptyFormaPagamento());
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [stateDisableBtnCreatedFormaPagamento, setStateDisableBtnCreatedFormaPagamento] = useState(false);
        const handleAllChanges = (event: {
            target: {
                id: string;
                value: any;
                checked?: any;
                type: string;
            };
        }) => {
            const { id, type, checked } = event.target;
            let value = event.target.value;
            if (type === 'checkbox' || type === 'switch') {
                value = Boolean(checked);
            } else if (type === 'number') {
                value = value === '' ? 0 : Number(value);
            }
            setFormaPagamento(
                toFormaPagamentoEntity({
                    ...formaPagamento,
                    [id]: value
                })
            );
        };
        const handleDropdownChange = (event: DropdownChangeEvent) => {
            setFormaPagamento(
                toFormaPagamentoEntity({
                    ...formaPagamento,
                    [event.target.id]: event.value
                })
            );
        };
        const handleValidateDescricao = () => {
            setTouchedFields((prev) => ({
                ...prev,
                descricao: true
            }));
            validateFieldsFormaPagamento(formaPagamento, setErrors, msgs);
        };
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) {
                event.preventDefault();
            }

            msgs.current?.clear();

            if (isLoadingBtnCreated) {
                return;
            }

            const isValid = validateFieldsFormaPagamento(formaPagamento, setErrors, msgs);

            if (!isValid) {
                setTouchedFields((prev) => ({
                    ...prev,
                    submit: true
                }));
                return;
            }

            setIsLoadingBtnCreated(true);
            setStateDisableBtnCreatedFormaPagamento(true);

            try {
                if (isEditMode && initialId) {
                    const updated = await updateFormaPagamento(initialId, formaPagamento, msgs, router, setErrors, setIsLoading, redirectAfterSave ?? true);
                    if (updated) {
                        await onSaved?.(updated);
                        if (!onSaved) {
                            onClose?.();
                        }
                    }
                    return;
                }

                const created = await createdFormaPagamento(formaPagamento, msgs, router, setFormaPagamento, setErrors, setIsLoading, redirectAfterSave ?? true);

                if (created) {
                    await onSaved?.(created);
                    if (!onSaved) {
                        onClose?.();
                    }
                }
            } finally {
                setStateDisableBtnCreatedFormaPagamento(false);
                setIsLoadingBtnCreated(false);
            }
        };
        const listagemFormaPagamentoID = async (id: string) => {
            try {
                setIsLoading(true);
                const { formaPagamento } = await fetchFormaPagamentoByID(id);
                setFormaPagamento(toFormaPagamentoEntity(formaPagamento));
            } finally {
                setIsLoading(false);
            }
        };
        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));
        useEffect(() => {
            onFormaPagamentoChangeRef.current = onFormaPagamentoChange;
        }, [onFormaPagamentoChange]);
        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);
        useEffect(() => {
            if (initialId) {
                setIsEditMode(true);
                setIsLoading(true);

                if (preloadedFormaPagamento && String(preloadedFormaPagamento.id) === String(initialId)) {
                    const formaPagamentoPrecarregada = toFormaPagamentoEntity(preloadedFormaPagamento);
                    setFormaPagamento(formaPagamentoPrecarregada);
                    setIsLoading(false);
                    return;
                }

                listagemFormaPagamentoID(initialId).finally(() => setIsLoading(false));
                return;
            }
            setIsLoading(false);
        }, [initialId, preloadedFormaPagamento]);

        useEffect(() => {
            if (Object.values(touchedFields).some(Boolean)) {
                validateFieldsFormaPagamento(formaPagamento, setErrors, msgs);
            }
        }, [formaPagamento, touchedFields, msgs]);

        useEffect(() => {
            onFormaPagamentoChangeRef.current?.(formaPagamento);
        }, [formaPagamento]);

        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);

        useEffect(() => {
            onLoadingChange?.(isLoading || isLoadingBtnCreated);
        }, [isLoading, isLoadingBtnCreated, onLoadingChange]);

        if (isLoading && initialId) {
            return <LoadingScreen loadingText="Carregando informações da Forma de Pagamento selecionada..." />;
        }

        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        const isSubmitDisabled =
            stateDisableBtnCreatedFormaPagamento || isLoadingBtnCreated || Object.keys(errors).length > 0 || !formaPagamento.descricao?.trim() || !formaPagamento.tipo_forma_pagamento || !formaPagamento.tipo_taxa || !formaPagamento.valor_taxa;

        return (
            <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container shared-form-content">
                    <div className="custom-flex-col">
                        <FormaPagamentoFields formaPagamento={formaPagamento} errors={errors} onChange={handleAllChanges} onDropdownChange={handleDropdownChange} onValidateDescricao={handleValidateDescricao} />
                    </div>
                </div>
                <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                    {showBTNPGCreatedAll && <BTNPGCreatedAll label="Salvar" disabled={isSubmitDisabled} onClick={handleSubmit} icon="pi pi-save" />}
                    {showBTNPGCreatedDialog && <BTNPGCreatedDialog label="Salvar" disabled={isSubmitDisabled} icon="pi pi-save" onClick={handleSubmit} onBackClick={onBackClick} onClose={onClose} />}
                </div>
            </div>
        );
    }
);
FormaPagamentoFormContainer.displayName = 'FormaPagamentoFormContainer';
function isFormaPagamentoFormProps(props: FormCreatedFormaPagamentoProps): props is FormaPagamentoFormProps {
    return 'msgs' in props;
}
export const FormCreatedFormaPagamento = forwardRef<FormaPagamentoFormRef, FormCreatedFormaPagamentoProps>((props, ref) => {
    if (isFormaPagamentoFormProps(props)) {
        return <FormaPagamentoFormContainer {...props} ref={ref} />;
    }
    return <FormaPagamentoFields {...props} />;
});
FormCreatedFormaPagamento.displayName = 'FormCreatedFormaPagamento';


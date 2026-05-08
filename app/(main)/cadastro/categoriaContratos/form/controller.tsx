'use client';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { validateFieldsCategoriaContrato } from '../controller/validate';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import { useEffect, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { createdCategoriaContrato, fetchCategoriaContratoByID, updateCategoriaContrato } from '../controller/controller';
import type { CategoriaContratoFormProps, CategoriaContratoFormRef,FormCategoriaContratoCreatedProps} from '../types/categoriaContratos';
import { CategoriaContratoFields } from './categoriaContratos';
export type { CategoriaContratoFieldsProps,CategoriaContratoFormProps,CategoriaContratoFormRef,FormCategoriaContratoCreatedProps} from '../types/categoriaContratos';
export const CategoriaContratoFormContainer = forwardRef<CategoriaContratoFormRef, CategoriaContratoFormProps>(({
            initialId,
            msgs,
            onCategoriaContratoChange,
            onErrorsChange,
            redirectAfterSave,
            onSaved,
            onClose,
            showBTNPGCreatedDialog,
            showBTNPGCreatedAll,
            onBackClick
        }: CategoriaContratoFormProps,
        ref
    ) => {
        const router = useRouter();
        const categoriaContratoId = initialId;
        const onCategoriaContratoChangeRef = useRef(
            onCategoriaContratoChange
        );
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [isEditMode, setIsEditMode] = useState(false);
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] =
            useState(false);
        const [errors, setErrors] = useState<{
            [key: string]: string;
        }>({});
        const [categoriaContrato, setCategoriaContrato] =
            useState<CategoryContratosEntity>(
                new CategoryContratosEntity({
                    id: 0,
                    descricao: '',
                    observacoes: '',
                    ativo: true
                })
            );
        const [touchedFields, setTouchedFields] = useState<{
            [key: string]: boolean;
        }>({});
        const [
            stateDisableBtnCreatedCategoriaContrato,
            setStateDisableBtnCreatedCategoriaContrato
        ] = useState(false);

        const handleAllChanges = (event: {
            target: {
                id: string;
                value: any;
                checked?: any;
                type: string;
            };
        }) => {
            const updatedCategoriaContrato =
                categoriaContrato.copyWith({
                    [event.target.id]:
                        event.target.type === 'checkbox' ||
                        event.target.type === 'switch'
                            ? event.target.checked
                            : event.target.value
                });

            setCategoriaContrato(updatedCategoriaContrato);
        };

        const handleValidateDescricao = () => {
            setTouchedFields((prev) => ({
                ...prev,
                descricao: true
            }));
            validateFieldsCategoriaContrato(
                categoriaContrato,
                setErrors,
                msgs
            );
        };

        const handleSubmit = async (e?: React.FormEvent) => {
            if (e) {
                e.preventDefault();
            }

            msgs.current?.clear();

            if (isLoadingBtnCreated) {
                return;
            }

            setIsLoadingBtnCreated(true);
            setStateDisableBtnCreatedCategoriaContrato(true);

            try {
                if (isEditMode && categoriaContratoId) {
                    await updateCategoriaContrato(
                        categoriaContratoId,
                        categoriaContrato,
                        msgs,
                        router,
                        setErrors,
                        setIsLoading,
                        redirectAfterSave ?? false
                    );
                    onSaved?.(categoriaContrato);
                    onClose?.();
                    return;
                }

                const created = await createdCategoriaContrato(
                    categoriaContrato,
                    msgs,
                    router,
                    setCategoriaContrato,
                    setErrors,
                    setIsLoading,
                    redirectAfterSave ?? false
                );

                if (created) {
                    onSaved?.(created);
                    onClose?.();
                }
            } catch (error) {
                console.error(
                    'Erro ao salvar categoria de contrato:',
                    error
                );
            } finally {
                setIsLoading(false);
                setStateDisableBtnCreatedCategoriaContrato(false);
                setIsLoadingBtnCreated(false);
            }
        };

        const listagemCategoriaContratoID = async (
            id: string
        ) => {
            setIsLoading(true);

            try {
                const response =
                    await fetchCategoriaContratoByID(id);
                const categoria =
                    new CategoryContratosEntity({
                        ...response.categoriaContrato,
                        id: Number(id)
                    });

                setCategoriaContrato(categoria);
            } finally {
                setIsLoading(false);
            }
        };

        useImperativeHandle(ref, () => ({
            handleSave: async () => {
                await handleSubmit();
            }
        }));

        useEffect(() => {
            onCategoriaContratoChangeRef.current =
                onCategoriaContratoChange;
        }, [onCategoriaContratoChange]);

        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);

        useEffect(() => {
            if (categoriaContratoId) {
                setIsEditMode(true);
                listagemCategoriaContratoID(
                    categoriaContratoId
                ).finally(() => setIsLoading(false));
                return;
            }

            setIsLoading(false);
        }, [categoriaContratoId]);

        useEffect(() => {
            if (
                Object.values(touchedFields).some(
                    (touched) => touched
                )
            ) {
                validateFieldsCategoriaContrato(
                    categoriaContrato,
                    setErrors,
                    msgs
                );
            }
        }, [categoriaContrato, touchedFields, msgs]);

        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);

        useEffect(() => {
            onCategoriaContratoChangeRef.current?.(
                categoriaContrato
            );
        }, [categoriaContrato]);

        if (isLoading && categoriaContratoId) {
            return (
                <LoadingScreen loadingText="Carregando informações da Categoria de Contrato selecionada..." />
            );
        }

        const isDialogMode = Boolean(
            showBTNPGCreatedDialog || onClose || onBackClick
        );

        return (
            <div
                className={`shared-form-layout ${
                    isDialogMode
                        ? 'shared-form-dialog-layout'
                        : 'shared-form-page-layout'
                }`}
            >
                <CategoriaContratoFields
                    categoriaContrato={categoriaContrato}
                    errors={errors}
                    onChange={handleAllChanges}
                    onValidateDescricao={handleValidateDescricao}
                />
                <div
                    className={`StyleContainer-btn-Created shared-form-footer ${
                        isDialogMode
                            ? 'shared-form-dialog-footer'
                            : ''
                    }`}
                    style={{ marginTop: 'auto' }}
                >
                    {showBTNPGCreatedAll && (
                        <BTNPGCreatedAll
                            label="Salvar"
                            disabled={
                                stateDisableBtnCreatedCategoriaContrato ||
                                Object.keys(errors).length > 0 ||
                                !categoriaContrato.descricao
                            }
                            onClick={handleSubmit}
                            icon="pi pi-save"
                        />
                    )}
                    {showBTNPGCreatedDialog && (
                        <BTNPGCreatedDialog
                            label="Salvar"
                            disabled={
                                stateDisableBtnCreatedCategoriaContrato ||
                                Object.keys(errors).length > 0 ||
                                !categoriaContrato.descricao
                            }
                            onClick={handleSubmit}
                            onBackClick={onBackClick}
                            onClose={onClose}
                            icon="pi pi-save"
                        />
                    )}
                </div>
            </div>
        );
    }
);
CategoriaContratoFormContainer.displayName =
    'CategoriaContratoFormContainer';
function isCategoriaContratoFormProps(
    props: FormCategoriaContratoCreatedProps
): props is CategoriaContratoFormProps {
    return 'msgs' in props;
}
const FormCategoriaContratoCreated = forwardRef<
    CategoriaContratoFormRef,
    FormCategoriaContratoCreatedProps
>((props, ref) => {
    if (isCategoriaContratoFormProps(props)) {
        return (
            <CategoriaContratoFormContainer
                {...props}
                ref={ref}
            />
        );
    }

    return <CategoriaContratoFields {...props} />;
});
FormCategoriaContratoCreated.displayName =
    'FormCategoriaContratoCreated';
export default FormCategoriaContratoCreated;

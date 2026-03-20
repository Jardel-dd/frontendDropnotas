'use client';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { InputSwitch } from 'primereact/inputswitch';
import Input from '@/app/shared/include/input/input-all';
import { DropdownChangeEvent } from 'primereact/dropdown';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState
} from 'react';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import {
    FormaPagamentoEntity,
    TipoFormaPagamento
} from '@/app/entity/FormaPagamento';
import {
    tipo_forma_pagamento,
    valor_taxa
} from '@/app/shared/optionsDropDown/options';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { validateFieldsFormaPagamento } from '../controller/validation';
import {
    createdFormaPagamento,
    fetchFormaPagamentoByID,
    updateFormaPagamento
} from '../controller/controller';
import type {
    FormCreatedFormaPagamentoProps,
    FormaPagamentoFieldsProps,
    FormaPagamentoFormProps,
    FormaPagamentoFormRef
} from '../types/formaPagamento';
export type {
    FormCreatedFormaPagamentoProps,
    FormaPagamentoFieldsProps,
    FormaPagamentoFormProps,
    FormaPagamentoFormRef
} from '../types/formaPagamento';

const createEmptyFormaPagamento = () =>
    new FormaPagamentoEntity({
        ativo: true,
        id: 0,
        descricao: '',
        observacao: '',
        aplicar_taxa_servico: false,
        tipo_forma_pagamento: '' as TipoFormaPagamento,
        tipo_taxa: '',
        valor_taxa: 0
    });
const toFormaPagamentoEntity = (
    formaPagamento?: Partial<FormaPagamentoEntity> | null
) =>
    new FormaPagamentoEntity({
        ...createEmptyFormaPagamento(),
        ...(formaPagamento ?? {})
    });
export function FormaPagamentoFields({
    formaPagamento,
    errors,
    onChange,
    onDropdownChange,
    onValidateDescricao
}: FormaPagamentoFieldsProps) {
    return (
        <>
            <div className="grid formgrid">
                <div className="col-12 lg:col-12 mt-1">
                    <Input
                        value={formaPagamento.descricao || ''}
                        onChange={onChange}
                        label="Descricao completa"
                        id="descricao"
                        hasError={!!errors.descricao}
                        errorMessage={errors.descricao}
                        onBlur={onValidateDescricao}
                        autoFocus
                        topLabel="Descricao:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 lg:col-3 mt-1">
                    <Dropdown
                        id="tipo_forma_pagamento"
                        value={formaPagamento.tipo_forma_pagamento ?? ''}
                        options={tipo_forma_pagamento}
                        onChange={onDropdownChange}
                        label="Selecione a forma de pagamento"
                        hasError={!!errors.tipo_forma_pagamento}
                        errorMessage={errors.tipo_forma_pagamento}
                        topLabel="Forma de pagamento:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 lg:col-3 mt-1">
                    <Dropdown
                        id="tipo_taxa"
                        value={formaPagamento.tipo_taxa ?? ''}
                        options={valor_taxa}
                        onChange={onDropdownChange}
                        label="Tipo da Taxa"
                        hasError={!!errors.tipo_taxa}
                        errorMessage={errors.tipo_taxa}
                        topLabel="Tipo da Taxa:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 lg:col-3 mt-1">
                    <Input
                        value={String(formaPagamento.valor_taxa ?? '')}
                        onChange={onChange}
                        label="Valor da Taxa"
                        id="valor_taxa"
                        type="number"
                        hasError={!!errors.valor_taxa}
                        errorMessage={errors.valor_taxa}
                        topLabel="Valor da Taxa:"
                        showTopLabel
                        required
                    />
                </div>
                <div className="col-12 lg:col-12 mt-1">
                    <InputTextarea
                        value={formaPagamento.observacao || ''}
                        onChange={onChange}
                        rows={5}
                        cols={30}
                        label=""
                        id="observacao"
                        topLabel="Consideracoes finais:"
                        showTopLabel
                    />
                </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
                <InputSwitch
                    checked={formaPagamento.aplicar_taxa_servico ?? false}
                    onChange={(event) =>
                        onChange({
                            target: {
                                id: 'aplicar_taxa_servico',
                                value: event.value,
                                checked: event.value,
                                type: 'switch'
                            }
                        })
                    }
                />
                <span style={{ alignItems: 'center', display: 'flex' }}>
                    Aplicar Taxa Servico
                </span>
            </div>
        </>
    );
}
const FormaPagamentoFormContainer = forwardRef<
    FormaPagamentoFormRef,
    FormaPagamentoFormProps
>(
    (
        {
            initialId,
            msgs,
            onFormaPagamentoChange,
            onErrorsChange,
            redirectAfterSave,
            onSaved,
            onClose,
            showBTNPGCreatedDialog,
            showBTNPGCreatedAll,
            onBackClick
        },
        ref
    ) => {
        const router = useRouter();
        const onFormaPagamentoChangeRef = useRef(onFormaPagamentoChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [isEditMode, setIsEditMode] = useState(false);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] =
            useState(false);
        const [formaPagamento, setFormaPagamento] =
            useState<FormaPagamentoEntity>(createEmptyFormaPagamento());
        const [touchedFields, setTouchedFields] = useState<
            Record<string, boolean>
        >({});
        const [
            stateDisableBtnCreatedFormaPagamento,
            setStateDisableBtnCreatedFormaPagamento
        ] = useState(false);
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
            validateFieldsFormaPagamento(
                formaPagamento,
                setErrors,
                msgs
            );
        };

        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) {
                event.preventDefault();
            }

            msgs.current?.clear();

            if (isLoadingBtnCreated) {
                return;
            }

            const isValid = validateFieldsFormaPagamento(
                formaPagamento,
                setErrors,
                msgs
            );

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
                    await updateFormaPagamento(
                        initialId,
                        formaPagamento,
                        msgs,
                        router,
                        setErrors,
                        setIsLoading,
                        redirectAfterSave ?? true
                    );
                    onSaved?.(formaPagamento);
                    onClose?.();
                    return;
                }

                const created = await createdFormaPagamento(
                    formaPagamento,
                    msgs,
                    router,
                    setFormaPagamento,
                    setErrors,
                    setIsLoading,
                    redirectAfterSave ?? true
                );

                if (created) {
                    onSaved?.(created);
                    onClose?.();
                }
            } finally {
                setStateDisableBtnCreatedFormaPagamento(false);
                setIsLoadingBtnCreated(false);
            }
        };

        const listagemFormaPagamentoID = async (id: string) => {
            try {
                setIsLoading(true);
                const { formaPagamento } =
                    await fetchFormaPagamentoByID(id);
                setFormaPagamento(
                    toFormaPagamentoEntity(formaPagamento)
                );
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
                listagemFormaPagamentoID(initialId).finally(() =>
                    setIsLoading(false)
                );
                return;
            }

            setIsLoading(false);
        }, [initialId]);

        useEffect(() => {
            if (Object.values(touchedFields).some(Boolean)) {
                validateFieldsFormaPagamento(
                    formaPagamento,
                    setErrors,
                    msgs
                );
            }
        }, [formaPagamento, touchedFields, msgs]);

        useEffect(() => {
            onFormaPagamentoChangeRef.current?.(formaPagamento);
        }, [formaPagamento]);

        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);

        if (isLoading && initialId) {
            return (
                <LoadingScreen loadingText="Carregando informacoes da Forma de Pagamento selecionada..." />
            );
        }

        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        const isSubmitDisabled =
            stateDisableBtnCreatedFormaPagamento ||
            isLoadingBtnCreated ||
            Object.keys(errors).length > 0 ||
            !formaPagamento.descricao?.trim() ||
            !formaPagamento.tipo_forma_pagamento ||
            !formaPagamento.tipo_taxa ||
            !formaPagamento.valor_taxa;

        return (
            <div
                className={`shared-form-layout ${
                    isDialogMode
                        ? 'shared-form-dialog-layout'
                        : 'shared-form-page-layout'
                }`}
            >
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container shared-form-content">
                    <div className="custom-flex-col">
                        <FormaPagamentoFields
                            formaPagamento={formaPagamento}
                            errors={errors}
                            onChange={handleAllChanges}
                            onDropdownChange={handleDropdownChange}
                            onValidateDescricao={
                                handleValidateDescricao
                            }
                        />
                    </div>
                </div>
                <div
                    className={`StyleContainer-btn-Created shared-form-footer ${
                        isDialogMode
                            ? 'shared-form-dialog-footer'
                            : ''
                    }`}
                >
                    {showBTNPGCreatedAll && (
                        <BTNPGCreatedAll
                            label="Salvar"
                            disabled={isSubmitDisabled}
                            onClick={handleSubmit}
                        />
                    )}
                    {showBTNPGCreatedDialog && (
                        <BTNPGCreatedDialog
                            label="Salvar"
                            disabled={isSubmitDisabled}
                            onClick={handleSubmit}
                            onBackClick={onBackClick}
                            onClose={onClose}
                        />
                    )}
                </div>
            </div>
        );
    }
);

FormaPagamentoFormContainer.displayName =
    'FormaPagamentoFormContainer';

function isFormaPagamentoFormProps(
    props: FormCreatedFormaPagamentoProps
): props is FormaPagamentoFormProps {
    return 'msgs' in props;
}

const FormFormaPagamentoCreated = forwardRef<
    FormaPagamentoFormRef,
    FormCreatedFormaPagamentoProps
>((props, ref) => {
    if (isFormaPagamentoFormProps(props)) {
        return (
            <FormaPagamentoFormContainer
                {...props}
                ref={ref}
            />
        );
    }

    return <FormaPagamentoFields {...props} />;
});

FormFormaPagamentoCreated.displayName =
    'FormFormaPagamentoCreated';

export default FormFormaPagamentoCreated;

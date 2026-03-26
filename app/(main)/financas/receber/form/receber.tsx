'use client';

import '@/app/styles/styledGlobal.css';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Input from '@/app/shared/include/input/input-all';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { ContasReceberEntity } from '@/app/entity/contasReceberEntity';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { fetchFilteredPessoas, listThePessoas } from '@/app/(main)/cadastro/pessoas/controller/controller';
import { fetchAllVendedores, fetchFilteredVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
import { createdContasReceber } from '../controller/controller';
import { validateFieldsContasReceber } from '../controller/validation';
import type {
    ContasReceberFieldsProps,
    ContasReceberFormProps,
    ContasReceberFormRef,
    FormCreatedContasReceberProps
} from '../types/receber';
import FormaPagamentoDropdownField from '@/app/(main)/cadastro/formaPagamento/dropDown/formaPagamento';

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const createEmptyContasReceber = () =>
    new ContasReceberEntity({
        ativo: true,
        id: 0,
        descricao: '',
        id_forma_pagamento: 0,
        id_vendedor: 0,
        id_cliente: 0,
        valor_original: 0,
        data_vencimento: getTodayDate(),
        observacao: ''
    });

const toContasReceberEntity = (contasReceber?: Partial<ContasReceberEntity> | null) =>
    new ContasReceberEntity({
        ...createEmptyContasReceber(),
        ...(contasReceber ?? {})
    });

const getInitialContasReceber = (contasReceber?: Partial<ContasReceberEntity> | null) =>
    toContasReceberEntity({
        ...(contasReceber ?? {}),
        data_vencimento: contasReceber?.data_vencimento || getTodayDate()
    });

export function ContasReceberFields({
    contasReceber,
    errors,
    selectedCliente,
    selectedVendedor,
    selectedFormaPagamento,
    onChange,
    onClienteChange,
    onVendedorChange,
    onFormaPagamentoChange,
    onValidateDescricao
}: ContasReceberFieldsProps) {
    return (
        <div className="grid formgrid">
            <div className="col-12 mt-1">
                <Input
                    id="descricao"
                    value={contasReceber.descricao || ''}
                    onChange={onChange}
                    label="Descricao completa"
                    hasError={!!errors.descricao}
                    errorMessage={errors.descricao}
                    onBlur={onValidateDescricao}
                    autoFocus
                    topLabel="Descricao:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 mt-1">
                <DropdownSearch<PessoaEntity>
                    id="selectedCliente"
                    selectedItem={selectedCliente}
                    onItemChange={onClienteChange}
                    fetchAllItems={listThePessoas}
                    fetchFilteredItems={fetchFilteredPessoas}
                    optionLabel="razao_social"
                    optionValue="id"
                    placeholder="Selecione o Cliente"
                    hasError={!!errors.selectedCliente}
                    errorMessage={errors.selectedCliente}
                    topLabel="Cliente:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 mt-1">
                <DropdownSearch<VendedorEntity>
                    id="selectedVendedor"
                    selectedItem={selectedVendedor}
                    onItemChange={onVendedorChange}
                    fetchAllItems={fetchAllVendedores}
                    fetchFilteredItems={fetchFilteredVendedor}
                    optionLabel="razao_social"
                    optionValue="id"
                    placeholder="Selecione o Vendedor"
                    hasError={!!errors.selectedVendedor}
                    errorMessage={errors.selectedVendedor}
                    topLabel="Vendedor:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 mt-1">
                <FormaPagamentoDropdownField
                    selectedFormaPagamento={selectedFormaPagamento}
                    onFormaPagamentoChange={onFormaPagamentoChange}
                    hasError={!!errors.selectedFormaPagamento}
                    errorMessage={errors.selectedFormaPagamento}
                />
            </div>
            <div className="col-12 lg:col-4 mt-1">
                <CustomInputNumber
                    id="valor_original"
                    value={Number(contasReceber.valor_original ?? 0)}
                    onChange={onChange}
                    hasError={!!errors.valor_original}
                    errorMessage={errors.valor_original}
                    topLabel="Valor original:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 mt-1">
                <Input
                    id="data_vencimento"
                    value={contasReceber.data_vencimento || ''}
                    onChange={onChange}
                    label="Data de vencimento"
                    type="date"
                    hasError={!!errors.data_vencimento}
                    errorMessage={errors.data_vencimento}
                    topLabel="Data de vencimento:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 mt-1">
                <InputTextarea
                    id="observacao"
                    value={contasReceber.observacao || ''}
                    onChange={onChange}
                    label="Observacao"
                    rows={5}
                    cols={30}
                    topLabel="Observacao:"
                    showTopLabel
                />
                <div style={{ height: 15, display: 'flex', alignItems: 'flex-end' }}>
                    {errors.observacao && <small className="p-error block">{errors.observacao}</small>}
                </div>
            </div>
        </div>
    );
}

const ContasReceberFormContainer = forwardRef<ContasReceberFormRef, ContasReceberFormProps>(
    (
        {
            contasReceber: initialContasReceber,
            msgs,
            onContasReceberChange,
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
        const onContasReceberChangeRef = useRef(onContasReceberChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoading, setIsLoading] = useState(false);
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [contasReceber, setContasReceber] = useState<ContasReceberEntity>(() => getInitialContasReceber(initialContasReceber));
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [stateDisableBtnCreatedContasReceber, setStateDisableBtnCreatedContasReceber] = useState(false);
        const [selectedCliente, setSelectedCliente] = useState<PessoaEntity | null>(null);
        const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
        const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<FormaPagamentoEntity | null>(null);

        const validateContasReceberForm = () =>
            validateFieldsContasReceber(contasReceber, setErrors, msgs, selectedCliente, selectedVendedor, selectedFormaPagamento);

        const handleAllChanges = (event: {
            target: {
                id: string;
                value: any;
                checked?: any;
                type: string;
            };
            value?: any;
        }) => {
            const { id, type, checked } = event.target;
            let value = event.target.value ?? event.value ?? '';

            if (type === 'checkbox' || type === 'switch') {
                value = Boolean(checked);
            } else if (['id_cliente', 'id_vendedor', 'id_forma_pagamento', 'valor_original'].includes(id)) {
                value = value === '' ? 0 : Number(value);
            }

            setContasReceber((prev) =>
                toContasReceberEntity({
                    ...prev,
                    [id]: value
                })
            );
        };

        const clearFieldError = (field: string) => {
            setErrors((prevErrors) => {
                if (!prevErrors[field]) {
                    return prevErrors;
                }

                const nextErrors = { ...prevErrors };
                delete nextErrors[field];
                return nextErrors;
            });
        };

        const handleClienteChange = (cliente: PessoaEntity | null) => {
            setSelectedCliente(cliente);
            handleAllChanges({
                target: {
                    id: 'id_cliente',
                    value: cliente?.id ?? 0,
                    type: 'input'
                }
            });
            clearFieldError('selectedCliente');
        };

        const handleVendedorChange = (vendedor: VendedorEntity | null) => {
            setSelectedVendedor(vendedor);
            handleAllChanges({
                target: {
                    id: 'id_vendedor',
                    value: vendedor?.id ?? 0,
                    type: 'input'
                }
            });
            clearFieldError('selectedVendedor');
        };

        const handleFormaPagamentoChange = (formaPagamento: FormaPagamentoEntity | null) => {
            setSelectedFormaPagamento(formaPagamento);
            handleAllChanges({
                target: {
                    id: 'id_forma_pagamento',
                    value: formaPagamento?.id ?? 0,
                    type: 'input'
                }
            });
            clearFieldError('selectedFormaPagamento');
        };

        const handleValidateDescricao = () => {
            setTouchedFields((prev) => ({
                ...prev,
                descricao: true
            }));
            validateContasReceberForm();
        };
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) {
                event.preventDefault();
            }

            msgs.current?.clear();

            if (isLoadingBtnCreated) {
                return;
            }

            const isValid = validateContasReceberForm();

            if (!isValid) {
                setTouchedFields((prev) => ({
                    ...prev,
                    submit: true
                }));
                return;
            }

            setIsLoading(true);
            setIsLoadingBtnCreated(true);
            setStateDisableBtnCreatedContasReceber(true);

            try {
                const created = await createdContasReceber(contasReceber, msgs, router, setContasReceber, setErrors, setIsLoading, redirectAfterSave ?? true);

                if (created) {
                    onSaved?.(created);
                    onClose?.();
                }
            } finally {
                setStateDisableBtnCreatedContasReceber(false);
                setIsLoadingBtnCreated(false);
            }
        };
        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));

        useEffect(() => {
            onContasReceberChangeRef.current = onContasReceberChange;
        }, [onContasReceberChange]);

        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);

        useEffect(() => {
            if (Object.values(touchedFields).some(Boolean)) {
                validateContasReceberForm();
            }
        }, [contasReceber, selectedCliente, selectedVendedor, selectedFormaPagamento, touchedFields]);

        useEffect(() => {
            onContasReceberChangeRef.current?.(contasReceber);
        }, [contasReceber]);

        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);

        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        const isSubmitDisabled =
            stateDisableBtnCreatedContasReceber ||
            isLoading ||
            isLoadingBtnCreated ||
            Object.keys(errors).length > 0 ||
            !contasReceber.descricao?.trim() ||
            !contasReceber.id_cliente ||
            !contasReceber.id_vendedor ||
            !contasReceber.id_forma_pagamento ||
            !contasReceber.valor_original ||
            Number(contasReceber.valor_original) <= 0 ||
            !contasReceber.data_vencimento ||
            !contasReceber.observacao?.trim();

        return (
            <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container shared-form-content">
                    <div className="custom-flex-col">
                        <ContasReceberFields
                            contasReceber={contasReceber}
                            errors={errors}
                            selectedCliente={selectedCliente}
                            selectedVendedor={selectedVendedor}
                            selectedFormaPagamento={selectedFormaPagamento}
                            onChange={handleAllChanges}
                            onClienteChange={handleClienteChange}
                            onVendedorChange={handleVendedorChange}
                            onFormaPagamentoChange={handleFormaPagamentoChange}
                            onValidateDescricao={handleValidateDescricao}
                        />
                    </div>
                </div>
                <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                    {showBTNPGCreatedAll && <BTNPGCreatedAll label="Salvar" disabled={isSubmitDisabled} onClick={handleSubmit} />}
                    {showBTNPGCreatedDialog && <BTNPGCreatedDialog label="Salvar" disabled={isSubmitDisabled} onClick={handleSubmit} onBackClick={onBackClick} onClose={onClose} />}
                </div>
            </div>
        );
    }
);

ContasReceberFormContainer.displayName = 'ContasReceberFormContainer';

function isContasReceberFormProps(props: FormCreatedContasReceberProps): props is ContasReceberFormProps {
    return 'msgs' in props;
}

const FormContasReceberCreated = forwardRef<ContasReceberFormRef, FormCreatedContasReceberProps>((props, ref) => {
    if (isContasReceberFormProps(props)) {
        return <ContasReceberFormContainer {...props} ref={ref} />;
    }

    return <ContasReceberFields {...props} />;
});

FormContasReceberCreated.displayName = 'FormContasReceberCreated';

export default FormContasReceberCreated;

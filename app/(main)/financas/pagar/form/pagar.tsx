'use client';

import '@/app/styles/styledGlobal.css';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Input from '@/app/shared/include/input/input-all';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { FormaPagamentoEntity } from '@/app/entity/FormaPagamento';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { createdContasPagar } from '../controller/controller';
import { validateFieldsContasPagar } from '../controller/validation';
import type {
    ContasPagarFieldsProps,
    ContasPagarFormProps,
    ContasPagarFormRef,
    FormCreatedContasPagarProps
} from '../types/pagar';
import { ContasPagarEntity } from '@/app/entity/contasPagarEntity';
const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const createEmptyContasPagar = () =>
    new ContasPagarEntity({
        ativo: true,
        id: 0,
        descricao: '',
        id_fornecedor: 0,
        valor_original: 0,
        valor_total: 0,
        data_vencimento: getTodayDate(),
        observacao: ''
    });
const toContasPagarEntity = (contasPagar?: Partial<ContasPagarEntity> | null) =>
    new ContasPagarEntity({
        ...createEmptyContasPagar(),
        ...(contasPagar ?? {})
    });

const getInitialContasPagar = (contasPagar?: Partial<ContasPagarEntity> | null) =>
    toContasPagarEntity({
        ...(contasPagar ?? {}),
        data_vencimento: contasPagar?.data_vencimento || getTodayDate()
    });

const listTheFornecedores = async (): Promise<PessoaEntity[]> => {
    try {
        const response = await api.get('/pessoa', {
            params: {
                fornecedor: true
            }
        });
        if (response.data && Array.isArray(response.data.content)) {
            console.log('🟡 Fornecedores retornados:', response.data.content);
            return response.data.content;
        }
        return [];
    } catch (error) {
        console.error(' Erro ao buscar fornecedores:', error);
        return [];
    }
};
const fetchFilteredFornecedores = async (termo: string): Promise<PessoaEntity[]> => {
    try {
        const response = await api.get('/pessoa', {
            params: {
                termo,
                fornecedor: true
            }
        });
        if (response.data && Array.isArray(response.data.content)) {

            const filtrados = response.data.content.filter(
                (pessoa: PessoaEntity) => pessoa.pessoa_fornecedor === true
            );
            return filtrados;
        }
        return [];
    } catch (error) {
        console.error('Erro ao filtrar fornecedores:', error);
        return [];
    }
};
export function ContasPagarFields({
    contasPagar,
    errors,
    selectedCliente,
    onChange,
    onClienteChange,
    onValidateDescricao
}: ContasPagarFieldsProps) {
    return (
        <div className="grid formgrid">
            <div className="col-12">
                <Input
                    id="descricao"
                    value={contasPagar.descricao || ''}
                    onChange={onChange}
                    label="Descrição completa"
                    hasError={!!errors.descricao}
                    errorMessage={errors.descricao}
                    onBlur={onValidateDescricao}
                    autoFocus
                    topLabel="Descrição:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 ">
                <DropdownSearch<PessoaEntity>
                    id="selectedCliente"
                    selectedItem={selectedCliente}
                    onItemChange={onClienteChange}
                    fetchAllItems={listTheFornecedores}
                    fetchFilteredItems={fetchFilteredFornecedores}
                    optionLabel="razao_social"
                    optionValue="id"
                    placeholder="Selecione o Fornecedor"
                    hasError={!!errors.selectedCliente}
                    errorMessage={errors.selectedCliente}
                    topLabel="Fornecedor:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 ">
                <CustomInputNumber
                    id="valor_original"
                    value={Number(contasPagar.valor_original ?? 0)}
                    onChange={onChange}
                    hasError={!!errors.valor_original}
                    errorMessage={errors.valor_original}
                    topLabel="Valor:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 ">
                <CustomInputNumber
                    id="valor_total"
                    value={Number(contasPagar.valor_total ?? 0)}
                    onChange={onChange}
                    hasError={!!errors.valor_total}
                    errorMessage={errors.valor_total}
                    topLabel="Valor Total:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 ">
                <Input
                    id="data_vencimento"
                    value={contasPagar.data_vencimento || ''}
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
            <div className="col-12 ">
                <InputTextarea
                    id="observacao"
                    value={contasPagar.observacao || ''}
                    onChange={onChange}
                    label="Observação"
                    rows={5}
                    cols={30}
                    topLabel="Observação:"
                    showTopLabel
                />
            </div>
        </div>
    );
}
const ContasPagarFormContainer = forwardRef<ContasPagarFormRef, ContasPagarFormProps>(
    (
        {
            contasPagar: initialContasPagar,
            msgs,
            onContasPagarChange,
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
        const onContasPagarChangeRef = useRef(onContasPagarChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoading, setIsLoading] = useState(false);
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [contasPagar, setContasPagar] = useState<ContasPagarEntity>(() => getInitialContasPagar(initialContasPagar));
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [stateDisableBtnCreatedContasPagar, setStateDisableBtnCreatedContasPagar] = useState(false);
        const [selectedCliente, setSelectedCliente] = useState<PessoaEntity | null>(null);
        const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
        const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<FormaPagamentoEntity | null>(null);
        const validateContasPagarForm = () =>
            validateFieldsContasPagar(contasPagar, setErrors, msgs, selectedCliente);
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
            } else if (['id_cliente', 'id_vendedor', 'id_forma_pagamento', 'valor_original', 'valor_total', 'id_fornecedor'].includes(id)) {
                value = value === '' ? 0 : Number(value);
            }
            setContasPagar((prev) =>
                toContasPagarEntity({
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
                    id: 'id_fornecedor',
                    value: cliente?.id ?? 0,
                    type: 'input'
                }
            });
            clearFieldError('selectedCliente');
        };
        const handleValidateDescricao = () => {
            setTouchedFields((prev) => ({
                ...prev,
                descricao: true
            }));
            validateContasPagarForm();
        };
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) {
                event.preventDefault();
            }
            msgs.current?.clear();
            if (isLoadingBtnCreated) {
                return;
            }
            const isValid = validateContasPagarForm();
            if (!isValid) {
                setTouchedFields((prev) => ({
                    ...prev,
                    submit: true
                }));
                return;
            }
            setIsLoading(true);
            setIsLoadingBtnCreated(true);
            setStateDisableBtnCreatedContasPagar(true);
            try {
                console.log(' salvar:', {
                    ...contasPagar,
                    valor_original: Number(contasPagar.valor_original ?? 0),
                    valor_total: Number(contasPagar.valor_total ?? 0)
                });
                const created = await createdContasPagar(contasPagar, msgs, router, setContasPagar, setErrors, setIsLoading, redirectAfterSave ?? true);

                if (created) {
                    onSaved?.(created);
                    onClose?.();
                }
            } finally {
                setStateDisableBtnCreatedContasPagar(false);
                setIsLoadingBtnCreated(false);
            }
        };
        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));
        useEffect(() => {
            onContasPagarChangeRef.current = onContasPagarChange;
        }, [onContasPagarChange]);
        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);
        useEffect(() => {
            if (Object.values(touchedFields).some(Boolean)) {
                validateContasPagarForm();
            }
        }, [contasPagar, selectedCliente, selectedVendedor, selectedFormaPagamento, touchedFields]);
        useEffect(() => {
            onContasPagarChangeRef.current?.(contasPagar);
        }, [contasPagar]);
        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);
        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        const isSubmitDisabled =
            stateDisableBtnCreatedContasPagar ||
            isLoading ||
            isLoadingBtnCreated ||
            Object.keys(errors).length > 0 ||
            !contasPagar.descricao?.trim() ||
            !contasPagar.id_fornecedor ||
            !contasPagar.valor_original ||
            Number(contasPagar.valor_original) <= 0 ||
            !contasPagar.valor_total ||
            Number(contasPagar.valor_total) <= 0 ||
            !contasPagar.data_vencimento

        return (
            <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container shared-form-content">
                    <div className="custom-flex-col">
                        <ContasPagarFields
                            contasPagar={contasPagar}
                            errors={errors}
                            selectedCliente={selectedCliente}
                            onChange={handleAllChanges}
                            onClienteChange={handleClienteChange}
                            onValidateDescricao={handleValidateDescricao}
                        />
                    </div>
                </div>
                <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                    {showBTNPGCreatedAll && 
                    <BTNPGCreatedAll label="Salvar" disabled={isSubmitDisabled} onClick={handleSubmit} icon="pi pi-save" />}
                    {showBTNPGCreatedDialog && 
                    <BTNPGCreatedDialog label="Salvar" disabled={isSubmitDisabled} onClick={handleSubmit} 
                    onBackClick={onBackClick} onClose={onClose} icon="pi pi-save"/>}
                </div>
            </div>
        );
    }
);
ContasPagarFormContainer.displayName = 'ContasPagarFormContainer';

function isContasPagarFormProps(props: FormCreatedContasPagarProps): props is ContasPagarFormProps {
    return 'msgs' in props;
}

const FormContasPagarCreated = forwardRef<ContasPagarFormRef, FormCreatedContasPagarProps>((props, ref) => {
    if (isContasPagarFormProps(props)) {
        return <ContasPagarFormContainer {...props} ref={ref} />;
    }

    return <ContasPagarFields {...props} />;
});

FormContasPagarCreated.displayName = 'FormContasPagarCreated';

export default FormContasPagarCreated;

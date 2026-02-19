'use client';
import "./style.css";
import LoadingScreen from "@/app/loading";
import { useRouter } from "next/navigation";
import { Messages } from "primereact/messages";
import { InputSwitch } from "primereact/inputswitch";
import { useTheme } from "../../isDarkMode/isDarkMode";
import Input from "@/app/shared/include/input/input-all";
import { DropdownChangeEvent } from "primereact/dropdown";
import Dropdown from "@/app/shared/include/dropdown/dropdown";
import { Mandatory } from "@/app/shared/mandatory/InputMandatory";
import { RefObject, useEffect, useState, forwardRef } from "react";
import InputTextarea from "@/app/shared/include/inputTextArea/InputTextarea";
import BTNPGCreatedAll from "../../buttonsComponent/btnCreatedAll/btn-created-all";
import { FormaPagamentoEntity, TipoFormaPagamento } from "@/app/entity/FormaPagamento";
import { tipo_forma_pagamento, valor_taxa } from "@/app/shared/optionsDropDown/options";
import BTNPGCreatedDialog from "../../buttonsComponent/btnCreatedAll/btn-created-dialog";
import { fetchFormaPagamentoByID } from "../../fetchAll/listAllFormaPagamentos/controller";
import { validateFieldsFormaPagamento } from "@/app/(main)/cadastro/formaPagamento/controller/validation";
import { createdFormaPagamento, updateFormaPagamento } from "@/app/(main)/cadastro/formaPagamento/controller/controller";
export interface FormaPagamentoFormRef {
    handleSave: () => Promise<void>;
};
interface FormaPagamentoFormProps {
    formaPagamento: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onFormaPagamentoChange?: (servico: FormaPagamentoEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setFormaPagamento: React.Dispatch<React.SetStateAction<FormaPagamentoEntity>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: FormaPagamentoEntity) => void;
    onClose?: () => void,
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
};
const FormaPagamentoForm = forwardRef<FormaPagamentoFormRef, FormaPagamentoFormProps>(({
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
}: FormaPagamentoFormProps, ref) => {
    const router = useRouter();
    const formaPagamentoId = initialId;
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoEntity>(
        new FormaPagamentoEntity({
            ativo: true,
            id: 0,
            descricao: '',
            observacao: '',
            aplicar_taxa_servico: false,
            tipo_forma_pagamento: '' as TipoFormaPagamento,
            tipo_taxa: '',
            valor_taxa: 0,
        }
    ));
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [stateDisableBtnCreatedFormaPagamento, setStateDisableBtnCreatedFormaPagamento] = useState(false);
   const handleAllChanges = (event: {
    target: { id: string; value: any; checked?: any; type: string }
}) => {
    const formaPagamentoInstance =
        formaPagamento instanceof FormaPagamentoEntity
            ? formaPagamento
            : new FormaPagamentoEntity(formaPagamento);
    const _formaPagamento = formaPagamentoInstance.copyWith({
        [event.target.id]:
            (event.target.type === "checkbox" || event.target.type === "switch")
                ? event.target.checked
                : event.target.value,
    });
    setFormaPagamento(_formaPagamento);
};

    const handleDropdownChange = (e: DropdownChangeEvent) => {
        const formaPagamentoInstance = formaPagamento instanceof FormaPagamentoEntity ? formaPagamento : new FormaPagamentoEntity(formaPagamento);
        const _formaPagamento = formaPagamentoInstance.copyWith({ [e.target.id]: e.value });
        setFormaPagamento(_formaPagamento);
    };
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setStateDisableBtnCreatedFormaPagamento(true);
        try {
            if (isEditMode && formaPagamentoId) {
                await updateFormaPagamento(
                    formaPagamentoId,
                    formaPagamento,
                    msgs,
                    router,
                    setErrors,
                    setIsLoading,
                    redirectAfterSave ?? true
                );
            } else {
                const created = await createdFormaPagamento(
                    formaPagamento,
                    msgs,
                    router,
                    setFormaPagamento,
                    setErrors,
                    setIsLoading,
                    redirectAfterSave ?? true
                );
                console.log("formaPagamento", formaPagamento)
                if (created) {
                    onSaved?.(created);
                }
            }
            onClose?.();
        } finally {
            setStateDisableBtnCreatedFormaPagamento(false);
        }
    };
    const ListagemFormaPagamentoID = async (formaPagamentoId: string) => {
        setIsLoading(true);
        const { formaPagamento } = await fetchFormaPagamentoByID(formaPagamentoId);
        setFormaPagamento(formaPagamento);
    };
    useEffect(() => {
        if (onFormaPagamentoChange) {
            onFormaPagamentoChange(formaPagamento);
        }
    }, [formaPagamento, onFormaPagamentoChange]);
    useEffect(() => {
        if (onErrorsChange) {
            onErrorsChange(errors);
        }
    }, [errors, onErrorsChange]);
    useEffect(() => {
        if (formaPagamentoId) {
            setIsEditMode(true);
            ListagemFormaPagamentoID(formaPagamentoId).finally(() => setIsLoading(false));
        }
    }, [formaPagamentoId]);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsFormaPagamento(formaPagamento, setErrors, msgs);
        }
    }, [formaPagamento]);
    if (isLoading && formaPagamentoId) {
        return <LoadingScreen loadingText="Carregando informações da Forma de Pagamento selecionada..." />;
    };
    return (
        <>
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container" >
                    <div className="custom-flex-col">
                        <div className="grid formgrid">
                            <div className="col-12 lg:col-12 mt-1">
                                <Input
                                    value={formaPagamento.descricao || ''}
                                    onChange={handleAllChanges}
                                    label="Descrição completa do serviço"
                                    id="descricao"
                                    hasError={!!errors.descricao}
                                    errorMessage={errors.descricao}
                                    onBlur={() => {
                                        setTouchedFields((prev) => ({ ...prev, descricao: true }));
                                        validateFieldsFormaPagamento(formaPagamento, setErrors, msgs);
                                    }}
                                    autoFocus
                                     topLabel="Descrição:"
                                        showTopLabel
                                        required
                                />
                            </div>
                            <div className="col-12 lg:col-3 mt-1">
                                <Dropdown
                                    id="tipo_forma_pagamento"
                                    value={formaPagamento.tipo_forma_pagamento ?? ''}
                                    options={tipo_forma_pagamento}
                                    onChange={handleDropdownChange}
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
                                    onChange={handleDropdownChange}
                                    label="Tipo da Taxa"
                                    hasError={!!errors.tipo_taxa}
                                    errorMessage={errors.tipo_taxa}
                                     topLabel="Tipo da Taxa:"
                                        showTopLabel
                                        required
                                />
                            </div>
                            <div className="col-12 lg:col-3 mt-1" >
                                <Input
                                    value={String(formaPagamento.valor_taxa || '')}
                                    onChange={handleAllChanges}
                                    label="Valor da Taxa"
                                    id="valor_taxa"
                                    type='number'
                                    hasError={!!errors.valor_taxa}
                                    errorMessage={errors.valor_taxa}
                                     topLabel="Valor da Taxa:"
                                        showTopLabel
                                        required
                                />
                            </div>
                            <div className="col-12  lg:col-12 mt-1"  >
                                    <InputTextarea
                                        value={formaPagamento.observacao || ''}
                                        onChange={handleAllChanges}
                                        rows={5}
                                        cols={30}
                                        label={''}
                                        id='observacao'
                                        topLabel="Considerações finais:"
                                        showTopLabel
                                        required
                                    />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <InputSwitch
                            checked={formaPagamento.aplicar_taxa_servico ?? false}
                            onChange={(event) => {
                                handleAllChanges(
                                    {
                                        target: { id: "aplicar_taxa_servico", value: event.value, type: "input" }
                                    }
                                )
                            }}
                        />
                        <span style={{ alignItems: "center", display: "flex" }}>Aplicar Taxa Serviço</span>
                    </div>
                    </div>
            <div className="StyleContainer-btn-Created">
                {showBTNPGCreatedAll && (
                    <BTNPGCreatedAll
                        label="Salvar"
                        disabled={
                            stateDisableBtnCreatedFormaPagamento ||
                            Object.keys(errors).length > 0 ||
                            !formaPagamento.descricao ||
                            !formaPagamento.tipo_forma_pagamento ||
                            !formaPagamento.valor_taxa
                        }
                        onClick={handleSubmit}
                    />
                )}
                {showBTNPGCreatedDialog && (
                    <BTNPGCreatedDialog
                        label="Salvar"
                        disabled={
                            stateDisableBtnCreatedFormaPagamento ||
                            Object.keys(errors).length > 0 ||
                            !formaPagamento.descricao ||
                            !formaPagamento.tipo_forma_pagamento ||
                            !formaPagamento.valor_taxa
                        }
                        onClick={handleSubmit}
                        onBackClick={onBackClick}
                        onClose={onClose}
                    />
                )}
            </div>
        </>
    );
}
);
FormaPagamentoForm.displayName = "FormaPagamentoForm";
export default FormaPagamentoForm;

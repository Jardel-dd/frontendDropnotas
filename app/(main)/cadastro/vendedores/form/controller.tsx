'use client';
import './style.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { VendedorFields } from './vendedor';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { getCitiesFromState } from '@/app/entity/maps';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { handleSearchCep } from '@/app/components/seachs/searchCep/controller';
import { handleSearchCNPJ } from '@/app/components/seachs/searchCnpj/controller';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import EnderecoForm from '@/app/components/enderecos/enderecoFormComponent/enderecoForm';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import { validateFieldsVendedor } from '@/app/(main)/cadastro/vendedores/controller/validate';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import {createEmptyVendedor, FormCreatedVendedorProps, VendedorFormProps, VendedorFormRef} from '../types/vendedor';
import { createdVendedor, fetchVendedor, updateVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';

export const VendedorFormContainer = forwardRef<VendedorFormRef, VendedorFormProps>(
    ({ initialId, msgs, onVendedorChange, 
        onErrorsChange, redirectAfterSave, onClose, onSaved, 
        showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
        const router = useRouter();
        const vendedorId = initialId;
        const onVendedorChangeRef = useRef(onVendedorChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [hasFocused, setHasFocused] = useState(false);
        const [isEditMode, setIsEditMode] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [loadingCep, setLoadingCep] = useState(false);
        const [loadingCnpj, setLoadingCnpj] = useState(false);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [stateDisableBtnCreatedVendedor, setStateDisableBtnCreatedVendedor] = useState(false);
        const [vendedor, setVendedor] = useState<VendedorEntity>(createEmptyVendedor());

        const handleAllChanges = (event: any) => {
            const id = event?.target?.id;
            const type = event?.target?.type;
            const checked = event?.target?.checked;
            const value = event?.target?.value ?? event?.value ?? '';
            const newValue = type === 'checkbox' || type === 'switch' ? checked : value;
            const camposEndereco = ['cep', 'logradouro', 'bairro', 'numero', 'uf', 'municipio', 'codigo_municipio', 'codigo_pais', 'complemento', 'nome_pais'];
            setVendedor((prev) => {
                const vendedorAnterior = new VendedorEntity(prev);

                if (camposEndereco.includes(id)) {
                    return vendedorAnterior.copyWith({
                        endereco: {
                            ...vendedorAnterior.endereco,
                            [id]: newValue
                        }
                    });
                }

                return vendedorAnterior.copyWith({
                    [id]: newValue
                });
            });
        };
        const handleDropdownChange = (event: DropdownChangeEvent) => {
            const vendedorInstance = vendedor instanceof VendedorEntity ? vendedor : new VendedorEntity(vendedor);
            setVendedor(vendedorInstance.copyWith({ [event.target.id]: event.value }));
        };
        const handleDropdownChangeEndereco = (event: DropdownChangeEvent) => {
            const updatedEndereco = {
                ...vendedor.endereco,
                [event.target.id]: event.value
            };
            setVendedor((prev) => prev.copyWith({ endereco: updatedEndereco }));
        };
        const handleValidateCnpj = () => {
            setTouchedFields((prev) => ({ ...prev, cnpj: true }));
            validateFieldsVendedor(vendedor, setErrors, msgs);
        };
        const handleSearchVendedorCnpj = async () => {
            setLoadingCnpj(true);
            await handleSearchCNPJ(vendedor?.cnpj ?? '', setVendedor, setErrors, msgs);
            setLoadingCnpj(false);
            setTouchedFields((prev) => ({ ...prev, cnpj: true }));
        };
        const handleValidateTelefone = () => {
            setTouchedFields((prev) => ({ ...prev, telefone: true }));
            validateFieldsVendedor(vendedor, setErrors, msgs);
        };
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) event.preventDefault();
            if (isLoadingBtnCreated) return;
            const isValid = validateFieldsVendedor(vendedor, setErrors, msgs);
            if (!isValid) {
                setTouchedFields((prev) => ({ ...prev, submit: true }));
                return;
            }
            setIsLoadingBtnCreated(true);
            try {
                if (isEditMode && vendedorId) {
                    await updateVendedor(vendedorId, vendedor, setErrors, msgs, router, setVendedor, redirectAfterSave ?? true);
                } else {
                    const created = await createdVendedor(vendedor, setErrors, msgs, router, redirectAfterSave ?? true, setVendedor);
                    onSaved?.(created);
                }
                onClose?.();
            } finally {
                setIsLoadingBtnCreated(false);
                setStateDisableBtnCreatedVendedor(false);
            }
        };
        const listagemVendedorID = async (currentVendedorId: string) => {
            try {
                setIsLoading(true);
                const { dataVendedor } = await fetchVendedor(currentVendedorId);
                setVendedor(dataVendedor);
            } finally {
                setIsLoading(false);
            }
        };
        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));
        useEffect(() => {
            onVendedorChangeRef.current = onVendedorChange;
        }, [onVendedorChange]);
        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);
        useEffect(() => {
            if (vendedorId) {
                setIsEditMode(true);
                listagemVendedorID(vendedorId).finally(() => setIsLoading(false));
                return;
            }

            setIsLoading(false);
        }, [vendedorId]);
        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validateFieldsVendedor(vendedor, setErrors, msgs);
            }
        }, [vendedor]);
        useEffect(() => {
            onVendedorChangeRef.current?.(vendedor);
        }, [vendedor]);
        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);
        if (isLoading && vendedorId) {
            return <LoadingScreen loadingText="Carregando informacoes do Vendedor selecionado..." />;
        }
        const isSubmitDisabled =
            stateDisableBtnCreatedVendedor ||
            isLoadingBtnCreated ||
            Object.keys(errors).length > 0 ||
            (vendedor.tipo_pessoa === 'PESSOA_JURIDICA' && !vendedor.cnpj) ||
            (vendedor.tipo_pessoa === 'PESSOA_FISICA' && !vendedor.cpf) ||
            (vendedor.tipo_pessoa === 'PESSOA_FISICA' && !vendedor.rg) ||
            (vendedor.tipo_pessoa === 'ESTRANGEIRO' && !vendedor.documento_estrangeiro) ||
            !vendedor?.razao_social ||
            vendedor.percentual_comissao === null ||
            !vendedor.endereco;
        const isDialogMode = Boolean(showBTNPGCreatedDialog || onClose || onBackClick);

        return (
            <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container shared-form-content">
                    <div className="custom-flex-col">
                        <VendedorFields
                            vendedor={vendedor}
                            errors={errors}
                            loadingCnpj={loadingCnpj}
                            hasFocused={hasFocused}
                            onFocusFirstField={() => setHasFocused(true)}
                            onChange={handleAllChanges}
                            onDropdownChange={handleDropdownChange}
                            onSearchCnpj={handleSearchVendedorCnpj}
                            onValidateCnpj={handleValidateCnpj}
                            onValidateTelefone={handleValidateTelefone}
                        />
                        <EnderecoForm
                            endereco={vendedor?.endereco}
                            telefone={vendedor?.telefone}
                            errors={errors}
                            onChange={handleAllChanges}
                            onCepSearch={() => handleSearchCep(vendedor.endereco?.cep || '', setLoadingCep, setVendedor, setError, msgs)}
                            onDropdownChange={handleDropdownChange}
                            onDropdownChangeEndereco={handleDropdownChangeEndereco}
                            getCitiesFromState={getCitiesFromState}
                            loadingCep={loadingCep}
                            exibirTelefone={false}
                            nomePaisObrigatorio
                        />
                    </div>
                </div>
                <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                    {showBTNPGCreatedAll && (
                        <BTNPGCreatedAll
                            label="Salvar"
                            disabled={isSubmitDisabled}
                            onClick={handleSubmit}
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
VendedorFormContainer.displayName = 'VendedorFormContainer';
function isVendedorFormProps(props: FormCreatedVendedorProps): props is VendedorFormProps {
    return 'msgs' in props;
}
export const FormCreatedVendedor = forwardRef<VendedorFormRef, FormCreatedVendedorProps>((props, ref) => {
    if (isVendedorFormProps(props)) {
        return <VendedorFormContainer {...props} ref={ref} />;
    }
    return <VendedorFields {...props} />;
});
FormCreatedVendedor.displayName = 'FormCreatedVendedor';

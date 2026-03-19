'use client';
import './style.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { getCitiesFromState } from '@/app/entity/maps';
import Input from '@/app/shared/include/input/input-all';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { IconPorcentagem } from '@/app/utils/icons/icons';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import { DropDownTipoPessoa } from '@/app/shared/optionsDropDown/options';
import { validateFieldsVendedor } from '@/app/(main)/cadastro/vendedores/controller/validate';
import { createdVendedor, fetchVendedor, updateVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
import { handleSearchCNPJ } from '@/app/components/seachs/searchCnpj/controller';
import EnderecoForm from '@/app/components/enderecos/enderecoFormComponent/enderecoForm';
import { handleSearchCep } from '@/app/components/seachs/searchCep/controller';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import {
    FormCreatedVendedorProps,
    VendedorFieldsProps,
    VendedorFormProps,
    VendedorFormRef
} from '../types/vendedor';

const createEmptyVendedor = () =>
    new VendedorEntity({
        id: 0,
        razao_social: '',
        nome_fantasia: '',
        cpf: null,
        rg: null,
        email: '',
        documento_estrangeiro: null,
        cnpj: null,
        inscricao_estadual: '',
        inscricao_municipal: '',
        atividade_principal: '',
        codigo_regime_tributario: '',
        tipo_pessoa: 'PESSOA_JURIDICA',
        contribuinte: '',
        telefone: '',
        endereco: {} as EnderecoEntity,
        arquivo_contrato: '',
        percentual_comissao: 0,
        id_vendedor_padrao: null,
        ativo: true,
        pais: ''
    });

export function VendedorFields({
    vendedor,
    errors,
    loadingCnpj,
    hasFocused,
    onFocusFirstField,
    onChange,
    onDropdownChange,
    onSearchCnpj,
    onValidateCnpj,
    onValidateTelefone
}: VendedorFieldsProps) {
    return (
        <div className="grid formgrid mt-3">
            <div className="col-12 lg:col-3 mt-1">
                <Dropdown
                    id="tipo_pessoa"
                    value={vendedor?.tipo_pessoa || ''}
                    options={DropDownTipoPessoa}
                    onChange={onDropdownChange}
                    optionLabel="name"
                    optionValue="code"
                    label=""
                    hasError={!!errors.tipoPessoa}
                    errorMessage={errors.tipoPessoa}
                    showTopLabel
                    required
                    topLabel="Tipo de Pessoa:"
                />
            </div>
            {vendedor?.tipo_pessoa === 'PESSOA_JURIDICA' && (
                <>
                    <div className="col-12 lg:col-3 mt-1">
                        <InputMaskDrop
                            id="cnpj"
                            value={vendedor.cnpj || ''}
                            onChange={(event) => {
                                onChange({
                                    target: {
                                        id: event.target.id,
                                        value: event.value,
                                        type: 'text'
                                    }
                                });
                            }}
                            onClickSearch={onSearchCnpj}
                            placeholder="99.999.999/9999-99"
                            mask="99.999.999/9999-99"
                            iconRight="pi pi-search"
                            outlined={false}
                            useRightButton
                            hasError={!!errors.cnpj}
                            errorMessage={errors.cnpj}
                            disabledRightButton={(vendedor.cnpj || '').replace(/\D/g, '').length !== 14}
                            loading={loadingCnpj}
                            onBlur={onValidateCnpj}
                            autoFocus={!hasFocused}
                            onFocus={onFocusFirstField}
                            showTopLabel
                            required
                            topLabel="CNPJ:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Input
                            id="razao_social"
                            value={vendedor?.razao_social || ''}
                            onChange={onChange}
                            label="Nome ou Razao Social do contato:"
                            hasError={!!errors.razao_social}
                            errorMessage={errors.razao_social}
                            showTopLabel
                            required
                            topLabel="Razao Social:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Input
                            value={vendedor?.nome_fantasia || ''}
                            onChange={onChange}
                            label="Nome Fantasia"
                            id="nome_fantasia"
                            showTopLabel
                            topLabel="Nome Fantasia:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Input
                            value={vendedor.percentual_comissao ?? 0}
                            onChange={onChange}
                            label="Comissao"
                            id="percentual_comissao"
                            type="number"
                            useRightButton
                            hasError={!!errors.percentual_comissao}
                            errorMessage={errors.percentual_comissao}
                            iconLeft={<IconPorcentagem isDarkMode={false} />}
                            showTopLabel
                            required
                            topLabel="Comissao:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <InputMaskDrop
                            id="telefone"
                            value={vendedor.telefone || ''}
                            onChange={onChange}
                            placeholder="+55 (99) 9999-9999"
                            mask="+99 (99) 99999-9999"
                            outlined={false}
                            hasError={!!errors.telefone}
                            errorMessage={errors.telefone}
                            onClickSearch={function (): void {}}
                            showTopLabel
                            topLabel="Telefone:"
                            onBlur={onValidateTelefone}
                        />
                    </div>
                </>
            )}
            {vendedor?.tipo_pessoa === 'PESSOA_FISICA' && (
                <>
                    <div className="col-12 lg:col-2 mt-1">
                        <InputMaskDrop
                            id="cpf"
                            value={vendedor.cpf || ''}
                            onChange={onChange}
                            placeholder="999.999.999-99"
                            mask="999.999.999-99"
                            iconRight="pi pi-search"
                            outlined
                            hasError={!!errors.cpf}
                            errorMessage={errors.cpf}
                            onClickSearch={function (): void {}}
                            autoFocus={!hasFocused}
                            onFocus={onFocusFirstField}
                            showTopLabel
                            required
                            topLabel="CPF:"
                        />
                    </div>
                    <div className="col-12 lg:col-2 mt-1">
                        <InputMaskDrop
                            id="rg"
                            value={vendedor.rg || ''}
                            onChange={onChange}
                            placeholder="99.999.999-9"
                            mask="99.999.999-9"
                            iconRight="pi pi-search"
                            outlined
                            hasError={!!errors.rg}
                            errorMessage={errors.rg}
                            onClickSearch={function (): void {}}
                            showTopLabel
                            required
                            topLabel="RG:"
                        />
                    </div>
                    <div className="col-12 lg:col-5 mt-1">
                        <Input
                            id="razao_social"
                            value={vendedor?.razao_social || ''}
                            onChange={onChange}
                            label="Nome:"
                            hasError={!!errors.razao_social}
                            errorMessage={errors.razao_social}
                            showTopLabel
                            required
                            topLabel="Nome:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Input
                            value={vendedor.percentual_comissao ?? 0}
                            onChange={onChange}
                            label="Comissao"
                            id="percentual_comissao"
                            type="number"
                            useRightButton
                            hasError={!!errors.percentual_comissao}
                            errorMessage={errors.percentual_comissao}
                            iconLeft={<IconPorcentagem isDarkMode={false} />}
                            showTopLabel
                            required
                            topLabel="Comissao:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <InputMaskDrop
                            id="telefone"
                            value={vendedor.telefone || ''}
                            onChange={onChange}
                            placeholder="+55 (99) 9999-9999"
                            mask="+55 (99) 9999-9999"
                            outlined={false}
                            hasError={!!errors.telefone}
                            errorMessage={errors.telefone}
                            onClickSearch={function (): void {}}
                            showTopLabel
                            topLabel="Telefone:"
                        />
                    </div>
                </>
            )}
            {vendedor?.tipo_pessoa === 'ESTRANGEIRO' && (
                <>
                    <div className="col-12 lg:col-5 mt-1">
                        <Input
                            value={vendedor.documento_estrangeiro || ''}
                            onChange={onChange}
                            label="Documento de identificacao"
                            id="documento_estrangeiro"
                            hasError={!!errors.documentoEstrangeiro}
                            errorMessage={errors.documentoEstrangeiro}
                            showTopLabel
                            required
                            topLabel="Documento de identificacao:"
                        />
                    </div>
                    <div className="col-12 lg:col-4 mt-1">
                        <Input
                            value={vendedor.percentual_comissao ?? 0}
                            onChange={onChange}
                            label="Comissao"
                            id="percentual_comissao"
                            type="number"
                            useRightButton
                            hasError={!!errors.percentual_comissao}
                            errorMessage={errors.percentual_comissao}
                            iconLeft={<IconPorcentagem isDarkMode={false} />}
                            showTopLabel
                            required
                            topLabel="Comissao:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <InputMaskDrop
                            id="telefone"
                            value={vendedor.telefone || ''}
                            onChange={onChange}
                            placeholder="+55 (99) 9999-9999"
                            mask="+55 (99) 9999-9999"
                            outlined={false}
                            hasError={!!errors.telefone}
                            errorMessage={errors.telefone}
                            onClickSearch={function (): void {}}
                            showTopLabel
                            required
                            topLabel="Telefone:"
                        />
                    </div>
                    <div className="col-12 lg:col-6 mt-1">
                        <Input
                            value={vendedor.pais || ''}
                            onChange={onChange}
                            label="Nome do Pais"
                            id="pais"
                            hasError={!!errors.pais}
                            errorMessage={errors.pais}
                            showTopLabel
                            required
                            topLabel="Nome do Pais:"
                        />
                    </div>
                </>
            )}
            {vendedor?.tipo_pessoa === 'ESTRANGEIRO_NO_BRASIL' && (
                <>
                    <div className="col-12 lg:col-4 mt-1">
                        <Input
                            value={vendedor.documento_estrangeiro || ''}
                            onChange={onChange}
                            label="Documento de identificacao"
                            id="documento_estrangeiro"
                            hasError={!!errors.documento_estrangeiro}
                            errorMessage={errors.documento_estrangeiro}
                            showTopLabel
                            required
                            topLabel="Doc de identificacao:"
                        />
                    </div>
                    <div className="col-12 lg:col-2 mt-1">
                        <Input
                            value={vendedor.percentual_comissao ?? 0}
                            onChange={onChange}
                            label="Comissao"
                            id="percentual_comissao"
                            type="number"
                            useRightButton
                            hasError={!!errors.percentual_comissao}
                            errorMessage={errors.percentual_comissao}
                            iconLeft={<IconPorcentagem isDarkMode={false} />}
                            showTopLabel
                            required
                            topLabel="Comissao:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <InputMaskDrop
                            id="telefone"
                            value={vendedor.telefone || ''}
                            onChange={onChange}
                            placeholder="+55 (99) 9999-9999"
                            mask="+55 (99) 9999-9999"
                            outlined={false}
                            hasError={!!errors.telefone}
                            errorMessage={errors.telefone}
                            onClickSearch={function (): void {}}
                            showTopLabel
                            topLabel="Telefone:"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
const VendedorFormContainer = forwardRef<VendedorFormRef, VendedorFormProps>(
    ({ initialId, msgs, onVendedorChange, onErrorsChange, redirectAfterSave, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
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
VendedorFormContainer.displayName = 'VendedorFormContainer';

function isVendedorFormProps(props: FormCreatedVendedorProps): props is VendedorFormProps {
    return 'msgs' in props;
}
const FormCreatedVendedor = forwardRef<VendedorFormRef, FormCreatedVendedorProps>((props, ref) => {
    if (isVendedorFormProps(props)) {
        return <VendedorFormContainer {...props} ref={ref} />;
    }

    return <VendedorFields {...props} />;
});
FormCreatedVendedor.displayName = 'FormCreatedVendedor';
export default FormCreatedVendedor;

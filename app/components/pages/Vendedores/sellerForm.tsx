'use client';
import './style.css';
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
import { RefObject, useEffect, useState, forwardRef } from 'react';
import { handleSearchCep } from '../../seachs/searchCep/controller';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import { handleSearchCNPJ } from '../../seachs/searchCnpj/controller';
import { DropDownTipoPessoa } from '@/app/shared/optionsDropDown/options';
import { fetchVendedor } from '../../fetchAll/listAllVendedores/controller';
import EnderecoForm from '../../enderecos/enderecoFormComponent/enderecoForm';
import BTNPGCreatedAll from '../../buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '../../buttonsComponent/btnCreatedAll/btn-created-dialog';
import { validateFieldsVendedor } from '@/app/(main)/cadastro/vendedores/controller/validate';
import { createdVendedor, updateVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
export interface VendedorFormRef {
    handleSave: () => Promise<void>;
}
interface VendedorFormProps {
    vendedor: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onVendedorChange?: (servico: VendedorEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setVendedor: React.Dispatch<React.SetStateAction<VendedorEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: VendedorEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
const VendedorForm = forwardRef<VendedorFormRef, VendedorFormProps>(({ initialId, msgs, onVendedorChange, onErrorsChange, redirectAfterSave, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }: VendedorFormProps, ref) => {
    const router = useRouter();
    const vendedorId = initialId;
    const [isLoading, setIsLoading] = useState(true);
    const [hasFocused, setHasFocused] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingCep, setLoadingCep] = useState<boolean>(false);
    const [loadingCnpj, setLoadingCnpj] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [stateDisableBtnCreatedVendedor, setStateDisableBtnCreatedVendedor] = useState(false);
    const [vendedor, setVendedor] = useState<VendedorEntity>(
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
            ativo: true
        })
    );
    const handleAllChanges = (event: any) => {
        const id = event?.target?.id;
        const type = event?.target?.type;
        const checked = event?.target?.checked;
        const value = event?.target?.value ?? event?.value ?? '';
        const newValue = type === 'checkbox' || type === 'switch' ? checked : value;
        const camposEndereco = ['cep', 'logradouro', 'bairro', 'numero', 'uf', 'municipio', 'codigo_municipio', 'codigo_pais', 'complemento', 'nome_pais'];
        setVendedor((prev) => {
            const preVendedor = new VendedorEntity(prev);
            if (camposEndereco.includes(id)) {
                return preVendedor.copyWith({
                    endereco: {
                        ...preVendedor.endereco,
                        [id]: newValue
                    }
                });
            } else {
                return preVendedor.copyWith({
                    [id]: newValue
                });
            }
        });
    };
    const handleDropdownChange = (e: DropdownChangeEvent) => {
        const vendedorInstance = vendedor instanceof VendedorEntity ? vendedor : new VendedorEntity(vendedor);
        const _vendedor = vendedorInstance.copyWith({ [e.target.id]: e.value });
        setVendedor(_vendedor);
    };
    const handleDropdownChangeEnderco = (e: DropdownChangeEvent) => {
        const updatedEndereco = {
            ...vendedor.endereco,
            [e.target.id]: e.value
        };
        setVendedor((prev) => prev.copyWith({ endereco: updatedEndereco }));
    };
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
         if (isLoadingBtnCreated) return;
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
            setStateDisableBtnCreatedVendedor(false);
        }
    };
    const ListagemVendedorID = async (vendedorId: string) => {
        try {
            setIsLoading(true);
            const { dataVendedor } = await fetchVendedor(vendedorId);
            setVendedor(dataVendedor);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (onVendedorChange) {
            onVendedorChange(vendedor);
        }
    }, [vendedor, onVendedorChange]);
    useEffect(() => {
        if (onErrorsChange) {
            onErrorsChange(errors);
        }
    }, [errors, onErrorsChange]);
    useEffect(() => {
        if (vendedorId) {
            setIsEditMode(true);
            ListagemVendedorID(vendedorId).finally(() => setIsLoading(false));
        } 
    }, [vendedorId]);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsVendedor(vendedor, setErrors, msgs);
        }
    }, [vendedor]);
    if (isLoading && vendedorId) {
        return <LoadingScreen loadingText="Carregando informações do Vendedor selecionado..." />;
    }
    return (
        <>
            <Messages ref={msgs} className="custom-messages" />
            <div className="scrollable-container">
                <div className="custom-flex-col">
                    <div className="grid formgrid mt-3">
                        <div className="col-12 lg:col-3 mt-1">
                            <Dropdown
                                id="tipo_pessoa"
                                value={vendedor?.tipo_pessoa || ''}
                                options={DropDownTipoPessoa}
                                onChange={handleDropdownChange}
                                optionLabel="name"
                                optionValue="code"
                                label={''}
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
                                        onChange={(e) => {
                                            handleAllChanges({
                                                target: {
                                                    id: e.target.id,
                                                    value: e.value,
                                                    type: 'text'
                                                }
                                            });
                                        }}
                                        onClickSearch={async () => {
                                            setLoadingCnpj(true);
                                            await handleSearchCNPJ(vendedor?.cnpj ?? '', setVendedor, setErrors, msgs);
                                            setLoadingCnpj(false);
                                        }}
                                        placeholder="99.999.999/9999-99"
                                        mask="99.999.999/9999-99"
                                        iconRight="pi pi-search"
                                        outlined={false}
                                        useRightButton={true}
                                        hasError={!!errors.cnpj}
                                        errorMessage={errors.cnpj}
                                        disabledRightButton={(vendedor.cnpj || '').replace(/\D/g, '').length !== 14}
                                        loading={loadingCnpj}
                                        onBlur={() => {
                                            setTouchedFields((prev) => ({ ...prev, cnpj: true }));
                                            validateFieldsVendedor(vendedor, setErrors, msgs);
                                        }}
                                        autoFocus={!hasFocused}
                                        onFocus={() => setHasFocused(true)}
                                        showTopLabel
                                        required
                                        topLabel="CNPJ:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <Input
                                        id="razao_social"
                                        value={vendedor?.razao_social || ''}
                                        onChange={handleAllChanges}
                                        label="Nome ou Razão Social do contato:"
                                        hasError={!!errors.razao_social}
                                        errorMessage={errors.razao_social}
                                        showTopLabel
                                        required
                                        topLabel="Razão Social:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <Input value={vendedor?.nome_fantasia || ''} onChange={handleAllChanges} label="Nome Fantasia" id="nome_fantasia" showTopLabel topLabel="Nome Fantasia:" />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <Input
                                        value={vendedor.percentual_comissao ?? 0}
                                        onChange={handleAllChanges}
                                        label="Comissão"
                                        id="percentual_comissao"
                                        type="number"
                                        useRightButton={true}
                                        hasError={!!errors.percentual_comissao}
                                        errorMessage={errors.percentual_comissao}
                                        iconLeft={<IconPorcentagem isDarkMode={false} />}
                                        showTopLabel
                                        required
                                        topLabel="Comissão:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <InputMaskDrop
                                        id="telefone"
                                        value={vendedor.telefone || ''}
                                        onChange={handleAllChanges}
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
                        {vendedor?.tipo_pessoa === 'PESSOA_FISICA' && (
                            <>
                                <div className="col-12 lg:col-2 mt-1">
                                    <InputMaskDrop
                                        id="cpf"
                                        value={vendedor.cpf || ''}
                                        onChange={handleAllChanges}
                                        placeholder="999.999.999-99"
                                        mask="999.999.999-99"
                                        iconRight="pi pi-search"
                                        outlined={true}
                                        hasError={!!errors.cpf}
                                        errorMessage={errors.cpf}
                                        onClickSearch={function (): void {}}
                                        autoFocus={!hasFocused}
                                        onFocus={() => setHasFocused(true)}
                                        showTopLabel
                                        required
                                        topLabel="CPF:"
                                    />
                                </div>
                                <div className="col-12 lg:col-2 mt-1">
                                    <InputMaskDrop
                                        id="rg"
                                        value={vendedor.rg || ''}
                                        onChange={handleAllChanges}
                                        placeholder="99.999.999-9"
                                        mask="99.999.999-9"
                                        iconRight="pi pi-search"
                                        outlined={true}
                                        hasError={!!errors.rg}
                                        errorMessage={errors.rg}
                                        onClickSearch={function (): void {}}
                                        showTopLabel
                                        required
                                        topLabel="RG:"
                                    />
                                </div>
                                <div className="col-12 lg:col-5 mt-1">
                                    <Input id="razao_social" value={vendedor?.razao_social || ''} onChange={handleAllChanges} label="Nome:" hasError={!!errors.razao_social} errorMessage={errors.razao_social} showTopLabel required topLabel="Nome:" />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <Input
                                        value={vendedor.percentual_comissao ?? 0}
                                        onChange={handleAllChanges}
                                        label="Comissão"
                                        id="percentual_comissao"
                                        type="number"
                                        useRightButton={true}
                                        hasError={!!errors.percentual_comissao}
                                        errorMessage={errors.percentual_comissao}
                                        iconLeft={<IconPorcentagem isDarkMode={false} />}
                                        showTopLabel
                                        required
                                        topLabel="Comissão:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <InputMaskDrop
                                        id="telefone"
                                        value={vendedor.telefone || ''}
                                        onChange={handleAllChanges}
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
                                        onChange={handleAllChanges}
                                        label="Documento de identificação"
                                        id="documento_estrangeiro"
                                        hasError={!!errors.documentoEstrangeiro}
                                        errorMessage={errors.documentoEstrangeiro}
                                        showTopLabel
                                        required
                                        topLabel="Documento de identificação:"
                                    />
                                </div>
                                <div className="col-12 lg:col-4 mt-1">
                                    <Input
                                        value={vendedor.percentual_comissao ?? 0}
                                        onChange={handleAllChanges}
                                        label="Comissão"
                                        id="percentual_comissao"
                                        type="number"
                                        useRightButton={true}
                                        hasError={!!errors.percentual_comissao}
                                        errorMessage={errors.percentual_comissao}
                                        iconLeft={<IconPorcentagem isDarkMode={false} />}
                                        showTopLabel
                                        required
                                        topLabel="Comissão:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <InputMaskDrop
                                        id="telefone"
                                        value={vendedor.telefone || ''}
                                        onChange={handleAllChanges}
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
                                    <Input value={vendedor.pais || ''} onChange={handleAllChanges} label="Documento de identificação" 
                                    id="pais" hasError={!!errors.pais} errorMessage={errors.pais} showTopLabel required topLabel="Nome do País:" />
                                </div>
                            </>
                        )}
                        {vendedor?.tipo_pessoa === 'ESTRANGEIRO_NO_BRASIL' && (
                            <>
                                <div className="col-12 lg:col-4 mt-1">
                                    <Input
                                        value={vendedor.documento_estrangeiro || ''}
                                        onChange={handleAllChanges}
                                        label="Documento de identificação"
                                        id="documento_estrangeiro"
                                        hasError={!!errors.documento_estrangeiro}
                                        errorMessage={errors.documento_estrangeiro}
                                        showTopLabel
                                        required
                                        topLabel="Doc de identificação:"
                                    />
                                </div>
                                <div className="col-12 lg:col-2 mt-1">
                                    <Input
                                        value={vendedor.percentual_comissao ?? 0}
                                        onChange={handleAllChanges}
                                        label="Comissão"
                                        id="percentual_comissao"
                                        type="number"
                                        useRightButton={true}
                                        hasError={!!errors.percentual_comissao}
                                        errorMessage={errors.percentual_comissao}
                                        iconLeft={<IconPorcentagem isDarkMode={false} />}
                                        showTopLabel
                                        required
                                        topLabel="Comissão:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <InputMaskDrop
                                        id="telefone"
                                        value={vendedor.telefone || ''}
                                        onChange={handleAllChanges}
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
                    <EnderecoForm
                        endereco={vendedor?.endereco}
                        telefone={vendedor?.telefone}
                        errors={errors}
                        onChange={handleAllChanges}
                        onCepSearch={() => handleSearchCep(vendedor.endereco?.cep || '', setLoadingCep, setVendedor, setError, msgs)}
                        onDropdownChange={handleDropdownChange}
                        onDropdownChangeEndereco={handleDropdownChangeEnderco}
                        getCitiesFromState={getCitiesFromState}
                        loadingCep={loadingCep}
                        exibirTelefone={false}
                        nomePaisObrigatorio={true}
                    />
                </div>
            </div>
            <div className="StyleContainer-btn-Created">
                {showBTNPGCreatedAll && (
                    <BTNPGCreatedAll
                        label="Salvar"
                        disabled={
                            stateDisableBtnCreatedVendedor ||
                            Object.keys(errors).length > 0 ||
                            (vendedor.tipo_pessoa === 'PESSOA_JURIDICA' && !vendedor.cnpj) ||
                            (vendedor.tipo_pessoa === 'PESSOA_FISICA' && !vendedor.cpf) ||
                            (vendedor.tipo_pessoa === 'PESSOA_FISICA' && !vendedor.rg) ||
                            (vendedor.tipo_pessoa === 'ESTRANGEIRO' && !vendedor.documento_estrangeiro) ||
                            !vendedor?.razao_social ||
                            vendedor.percentual_comissao === null ||
                            !vendedor.endereco
                        }
                        onClick={handleSubmit}
                    />
                )}
                {showBTNPGCreatedDialog && (
                    <BTNPGCreatedDialog
                        onClick={handleSubmit}
                        label="Salvar"
                        onBackClick={onBackClick}
                        onClose={onClose}
                        disabled={
                            stateDisableBtnCreatedVendedor ||
                            Object.keys(errors).length > 0 ||
                            (vendedor.tipo_pessoa === 'PESSOA_JURIDICA' && !vendedor.cnpj) ||
                            (vendedor.tipo_pessoa === 'PESSOA_FISICA' && !vendedor.cpf) ||
                            (vendedor.tipo_pessoa === 'PESSOA_FISICA' && !vendedor.rg) ||
                            (vendedor.tipo_pessoa === 'ESTRANGEIRO' && !vendedor.documento_estrangeiro) ||
                            !vendedor?.razao_social ||
                            vendedor.percentual_comissao === null ||
                            !vendedor.endereco
                        }
                    />
                )}
            </div>
        </>
    );
});
VendedorForm.displayName = 'VendedorForm';
export default VendedorForm;

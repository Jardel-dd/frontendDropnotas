'use client';
import '@/app/styles/styledGlobal.css';
import { Divider } from 'primereact/divider';
import { Messages } from 'primereact/messages';
import {
    contribuinteOptions,
    DropDownTipoPessoa,
    OptionsTipoContrato,
    regimeTributarioPessoaOptions
} from '@/app/shared/optionsDropDown/options';
import { getCitiesFromState } from '@/app/entity/maps';
import Input from '@/app/shared/include/input/input-all';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import LoadingScreenComponent from '@/app/loading/loadingComponent';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import { VendedorFormRef } from '../../vendedores/types/vendedor';
import { handleSearchCep } from '@/app/components/seachs/searchCep/controller';
import { handleSearchCNPJ } from '@/app/components/seachs/searchCnpj/controller';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import CNAEDropdownField from '@/app/components/fetchAll/listAllCnae/cnaeFiscal';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import VendedorForm from '../../vendedores/form/vendedor';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import EnderecoForm from '@/app/components/enderecos/enderecoFormComponent/enderecoForm';
import { validateFieldsPessoa } from '@/app/(main)/cadastro/pessoas/controller/validate';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import { fetchAllCnae, fetchFilteredCnae } from '@/app/components/fetchAll/listAllCnae/controller';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import VendedorDropdownField from '@/app/(main)/cadastro/vendedores/dropDown/DropdownVendedor';
import { FormPessoaCreatedProps, PessoaFieldsProps, PessoaFormProps, PessoaFormRef } from '../types/pessoa';
import { createdPessoa, fetchPessoasById, updatePessoa } from '@/app/(main)/cadastro/pessoas/controller/controller';

const mapPessoaContatoToSelection = (pessoa: Pick<PessoaEntity, 'pessoa_cliente' | 'pessoa_fornecedor'>): string | null => {
    if (pessoa.pessoa_cliente && pessoa.pessoa_fornecedor) return 'AMBOS';
    if (pessoa.pessoa_cliente) return 'pessoa_cliente';
    if (pessoa.pessoa_fornecedor) return 'pessoa_fornecedor';
    return null;
};

const mapContatoSelectionToFlags = (selectedContato: string | null) => ({
    pessoa_cliente: selectedContato === 'AMBOS' || selectedContato === 'pessoa_cliente',
    pessoa_fornecedor: selectedContato === 'AMBOS' || selectedContato === 'pessoa_fornecedor'
});

export function PessoaFields({
    pessoa,
    errors,
    selectedContato,
    selectedCNAE,
    loadingCnpj,
    hasFocused,
    onFocusFirstField,
    onChange,
    onDropdownChange,
    onContatoChange,
    onCNAEChange,
    onSearchCnpj,
    onValidateCnpj,
    fetchAllCnae,
    fetchFilteredCnae
}: PessoaFieldsProps) {
    const reloadKeyCNAE = 0;
    return (
        <div className="grid formgrid">
            <div className="col-12 lg:col-3 mt-1">
                <Dropdown
                    id="tipo_pessoa"
                    value={pessoa?.tipo_pessoa || ''}
                    options={DropDownTipoPessoa}
                    onChange={onDropdownChange}
                    optionLabel="name"
                    optionValue="code"
                    label=""
                    hasError={!!errors.tipoPessoa}
                    errorMessage={errors.tipoPessoa}
                    topLabel="Tipo de Pessoa:"
                    showTopLabel
                    required
                />
            </div>
            {pessoa?.tipo_pessoa === 'PESSOA_JURIDICA' && (
                <>
                    <div className="col-12 lg:col-3 mt-1">
                        <InputMaskDrop
                            id="cnpj"
                            value={pessoa.cnpj || ''}
                            onChange={(e) => {
                                onChange({
                                    target: {
                                        id: e.target.id,
                                        value: e.value,
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
                            disabledRightButton={(pessoa.cnpj || '').replace(/\D/g, '').length !== 14}
                            loading={loadingCnpj}
                            onBlur={onValidateCnpj}
                            autoFocus={!hasFocused}
                            onFocus={onFocusFirstField}
                            showTopLabel
                            required
                            topLabel="CNPJ:"
                        />
                    </div>
                    <div className="col-12 lg:col-6 mt-1">
                        <Input
                            id="razao_social"
                            value={pessoa?.razao_social || ''}
                            onChange={onChange}
                            label="Nome ou Razao Social do contato:"
                            hasError={!!errors.razao_social}
                            errorMessage={errors.razao_social}
                            showTopLabel
                            required
                            topLabel="Nome ou Razao Social do contato:"
                        />
                    </div>
                    <div className="col-12 lg:col-6 mt-1">
                        <Input
                            value={pessoa?.nome_fantasia || ''}
                            onChange={onChange}
                            label="Nome Fantasia"
                            id="nome_fantasia"
                            hasError={!!errors.nome_fantasia}
                            errorMessage={errors.nome_fantasia}
                            showTopLabel
                            required
                            topLabel="Nome Fantasia:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Dropdown
                            id="codigo_regime_tributario"
                            value={pessoa?.codigo_regime_tributario ?? ''}
                            options={regimeTributarioPessoaOptions}
                            onChange={onDropdownChange}
                            label="Selecione um Regime Tributario"
                            hasError={!!errors.selectedRegime}
                            errorMessage={errors.selectedRegime}
                            showTopLabel
                            required
                            topLabel="Codigo Regime Tributario:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Dropdown
                            id="contribuinte"
                            value={pessoa.contribuinte ?? ''}
                            options={contribuinteOptions}
                            onChange={onDropdownChange}
                            optionValue="code"
                            label="Contribuinte"
                            hasError={!!errors.contribuinte}
                            errorMessage={errors.contribuinte}
                            showTopLabel
                            topLabel="Contribuinte:"
                            required
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Input
                            value={pessoa.inscricao_estadual || ''}
                            onChange={onChange}
                            label="Inscricao Estadual"
                            id="inscricao_estadual"
                            hasError={!!errors.inscricao_estadual}
                            errorMessage={errors.inscricao_estadual}
                            showTopLabel
                            required
                            topLabel="Inscricao Estadual:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Input
                            value={pessoa.inscricao_municipal || ''}
                            onChange={onChange}
                            label="Inscricao Municipal"
                            id="inscricao_municipal"
                            hasError={!!errors.inscricao_municipal}
                            errorMessage={errors.inscricao_municipal}
                            showTopLabel
                            required
                            topLabel="Inscricao Municipal:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Input
                            value={pessoa.atividade_principal || ''}
                            onChange={onChange}
                            label="Atividade Principal"
                            id="atividade_principal"
                            hasError={!!errors.atividade_principal}
                            errorMessage={errors.atividade_principal}
                            showTopLabel
                            topLabel="Atividade Principal:"
                        />
                    </div>
                </>
            )}
            {pessoa?.tipo_pessoa === 'PESSOA_FISICA' && (
                <>
                    <div className="col-12 lg:col-2 mt-1">
                        <InputMaskDrop
                            id="cpf"
                            value={pessoa.cpf || ''}
                            onChange={onChange}
                            placeholder="999.999.999-99"
                            mask="999.999.999-99"
                            iconRight="pi pi-search"
                            outlined
                            hasError={!!errors.cpf}
                            errorMessage={errors.cpf}
                            onClickSearch={function (): void { }}
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
                            value={pessoa.rg || ''}
                            onChange={onChange}
                            placeholder="99.999.999-9"
                            mask="99.999.999-9"
                            iconRight="pi pi-search"
                            outlined
                            hasError={!!errors.rg}
                            errorMessage={errors.rg}
                            onClickSearch={function (): void { }}
                            showTopLabel
                            required
                            topLabel="RG:"
                        />
                    </div>
                    <div className="col-12 lg:col-5 mt-1">
                        <Input
                            id="razao_social"
                            value={pessoa?.razao_social || ''}
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
                        <Dropdown
                            id="codigo_regime_tributario"
                            value={pessoa?.codigo_regime_tributario ?? ''}
                            options={regimeTributarioPessoaOptions}
                            onChange={onDropdownChange}
                            label="Selecione um Regime Tributario"
                            hasError={!!errors.selectedRegime}
                            errorMessage={errors.selectedRegime}
                            showTopLabel
                            required
                            topLabel="Codigo Regime Tributario:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Dropdown
                            id="contribuinte"
                            value={pessoa.contribuinte || ''}
                            options={contribuinteOptions}
                            onChange={onDropdownChange}
                            placeholder="Selecione o Contribuinte"
                            optionValue="code"
                            label=""
                            hasError={!!errors.contribuinte}
                            errorMessage={errors.contribuinte}
                            showTopLabel
                            required
                            topLabel="Contribuinte:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Input
                            value={pessoa.inscricao_estadual || ''}
                            onChange={onChange}
                            label="Inscricao Estadual"
                            id="inscricao_estadual"
                            hasError={!!errors.inscricao_estadual}
                            errorMessage={errors.inscricao_estadual}
                            showTopLabel
                            required
                            topLabel="Inscricao Estadual:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <Input
                            value={pessoa.inscricao_municipal || ''}
                            onChange={onChange}
                            label="Inscricao Municipal"
                            id="inscricao_municipal"
                            hasError={!!errors.inscricao_municipal}
                            errorMessage={errors.inscricao_municipal}
                            showTopLabel
                            required
                            topLabel="Inscricao Municipal:"
                        />
                    </div>
                    <div className="col-12 lg:col-3 mt-1">
                        <div className="p-field">
                            <CNAEDropdownField
                                selectedCNAE={selectedCNAE}
                                onCNAEChange={onCNAEChange}
                                fetchAllCnae={fetchAllCnae}
                                fetchFilteredCnae={fetchFilteredCnae}
                                hasError={!!errors.cnae_fiscal}
                                errorMessage={errors.cnae_fiscal}
                                showTopLabel
                                topLabel="CNAE Fiscal:"
                            />
                        </div>
                    </div>
                </>
            )}
            {pessoa?.tipo_pessoa === 'ESTRANGEIRO' && (
                <>
                    <div className="col-12 lg:col-3 mt-1">
                        <Input
                            value={pessoa.documento_estrangeiro || ''}
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
                    <div className="col-12 lg:col-3 mt-1">
                        <Input
                            value={pessoa.pais || ''}
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
            {pessoa?.tipo_pessoa === 'ESTRANGEIRO_NO_BRASIL' && (
                <div className="col-12 lg:col-3 mt-1">
                    <Input
                        value={pessoa.documento_estrangeiro || ''}
                        onChange={onChange}
                        label="Documento de identificacao"
                        id="documento_estrangeiro"
                        hasError={!!errors.documento_estrangeiro}
                        errorMessage={errors.documento_estrangeiro}
                        showTopLabel
                        required
                        topLabel="Documento de identificacao:"
                    />
                </div>
            )}
            <div className="col-12 mt-1 lg:col-3">
                <DropdownSearch<TableCNAEEntity>
                    id="cnae_fiscal"
                    selectedItem={selectedCNAE}
                    key={reloadKeyCNAE}
                    onItemChange={onCNAEChange}
                    fetchAllItems={fetchAllCnae}
                    fetchFilteredItems={fetchFilteredCnae}
                    optionLabel="descricao"
                    optionValue="id"
                    placeholder="Selecione CNAE"
                    hasError={!!errors.cnae_fiscal}
                    errorMessage={errors.cnae_fiscal}
                    topLabel="CNAE Fiscal"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-3 mt-1">
                <Dropdown
                    id="selectedContato"
                    value={selectedContato}
                    onChange={onContatoChange}
                    options={OptionsTipoContrato}
                    optionLabel="label"
                    optionValue="value"
                    label=""
                    placeholder="Selecione o Contato"
                    hasError={!!errors.selectedContato}
                    errorMessage={errors.selectedContato}
                    showTopLabel
                    required
                    topLabel="Tipo de contato:"
                />
            </div>
            <div className="col-12 mt-1 lg:col-6">
                <Input
                    value={pessoa?.email || ''}
                    onChange={onChange}
                    label="E-mail"
                    id="email"
                    type="email"
                    hasError={!!errors.email}
                    errorMessage={errors.email}
                    topLabel="E-mail:"
                    showTopLabel
                    required
                />
            </div>
        </div>
    );
}
const PessoaFormContainer = forwardRef<PessoaFormRef, PessoaFormProps>(
    (
        {
            initialId,
            msgs,
            onPessoaChange,
            onErrorsChange,
            redirectAfterSave,
            onClose,
            onSaved,
            showBTNPGCreatedDialog,
            showBTNPGCreatedAll,
            onBackClick
        },
        ref
    ) => {
        const router = useRouter();
        const searchParams = useSearchParams();
        const pessoaId = initialId;
        const formRef = useRef<VendedorFormRef>(null);
        const onPessoaChangeRef = useRef(onPessoaChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [hasFocused, setHasFocused] = useState(false);
        const [isEditMode, setIsEditMode] = useState(false);
        const [error, setError] = useState<string | null>(null);
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
        const [reloadKeyVendedor, setReloadKeyVendedor] = useState(0);
        const [loadingCep, setLoadingCep] = useState(false);
        const [loadingCnpj, setLoadingCnpj] = useState(false);
        const [showModalVendedor, setShowModalVendedor] = useState(false);
        const [selectedContato, setSelectedContato] = useState<string | null>(null);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [selectedCNAE, setSelectedCNAE] = useState<TableCNAEEntity | null>(null);
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
        const [stateDisableBtnCreatedClienteFornecedor, setStateDisableBtnCreatedClienteFornecedor] = useState(false);
        const [pessoa, setPessoa] = useState<PessoaEntity>(
            new PessoaEntity({
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
                cnae_fiscal: null,
                data_fundacao: '',
                pessoa_cliente: false,
                pessoa_fornecedor: false,
                codigo_regime_tributario: '',
                tipo_pessoa: 'PESSOA_JURIDICA',
                contribuinte: '',
                endereco: {} as EnderecoEntity,
                arquivo_contrato: '',
                id_vendedor_padrao: null,
                ativo: true,
                pais: ''
            })
        );
        const validatePessoaForm = () => validateFieldsPessoa(pessoa, setErrors, msgs, selectedVendedor);
        const handleAllChanges = (event: any) => {
            const id = event?.target?.id;
            const type = event?.target?.type;
            const checked = event?.target?.checked;
            const value = event?.target?.value ?? event?.value ?? '';
            let newValue = type === 'checkbox' || type === 'switch' ? checked : value;
            const numericFields = [
                'inscricao_estadual',
                'inscricao_municipal',
                'telefone',
                'cep'
            ];
            if (numericFields.includes(id)) {
                newValue = String(newValue).replace(/\D/g, '');
            }
            const camposEndereco = [
                'cep',
                'logradouro',
                'bairro',
                'numero',
                'uf',
                'municipio',
                'codigo_municipio',
                'codigo_pais',
                'complemento',
                'nome_pais',
                'telefone'
            ];
            setPessoa((prev) => {
                const pessoaAnterior = new PessoaEntity(prev);

                if (camposEndereco.includes(id)) {
                    return pessoaAnterior.copyWith({
                        endereco: {
                            ...pessoaAnterior.endereco,
                            [id]: newValue
                        }
                    });
                }
                return pessoaAnterior.copyWith({
                    [id]: newValue
                });
            });
        };
        const handleDropdownChange = (event: DropdownChangeEvent) => {
            const pessoaInstance = pessoa instanceof PessoaEntity ? pessoa : new PessoaEntity(pessoa);
            setPessoa(pessoaInstance.copyWith({ [event.target.id]: event.value }));
        };
        const handleDropdownChangeEndereco = (event: DropdownChangeEvent) => {
            const updatedEndereco = {
                ...pessoa.endereco,
                [event.target.id]: event.value
            };
            setPessoa((prev) => prev.copyWith({ endereco: updatedEndereco }));
        };
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) event.preventDefault();
            msgs.current?.clear();
            if (isLoadingBtnCreated) return;
            const isValid = validatePessoaForm();
            if (!isValid) {
                setTouchedFields((prev) => ({ ...prev, submit: true }));
                return;
            }
            setIsLoadingBtnCreated(true);
            try {
                if (isEditMode && pessoaId) {
                    await updatePessoa(pessoaId, pessoa, setErrors, msgs, router, setPessoa);
                } else {
                    const created = await createdPessoa(pessoa, setErrors, msgs, router, setPessoa, redirectAfterSave ?? true);
                    if (created) {
                        onSaved?.(created);
                    }
                }
            } finally {
                setIsLoadingBtnCreated(false);
                setStateDisableBtnCreatedClienteFornecedor(false);
            }
        };
        const handleVendedor = (updatedVendedor: VendedorEntity) => {
            setVendedor(updatedVendedor);
        };
        const handleVendedorSaved = (created: VendedorEntity) => {
            setShowModalVendedor(false);
            setSelectedVendedor(created);
            handleAllChanges({
                target: { id: 'id_vendedor_padrao', value: created.id, type: 'input' }
            });
            setReloadKeyVendedor((current) => current + 1);
        };
        const handleVendedorChange = (vendedorSelecionado: VendedorEntity | null) => {
            setSelectedVendedor(vendedorSelecionado);
            handleAllChanges({
                target: { id: 'id_vendedor_padrao', value: vendedorSelecionado?.id ?? null, type: 'input' }
            });
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedVendedor;
                return newErrors;
            });
        };
        const handleContatoChange = (event: DropdownChangeEvent) => {
            const selected = (event.value as string | null) ?? null;
            setSelectedContato(selected);
            const updatedPessoa = pessoa.copyWith(mapContatoSelectionToFlags(selected));
            setPessoa(updatedPessoa);
            validateFieldsPessoa(updatedPessoa, setErrors, msgs, selectedVendedor);
        };
        const handleCNAEChange = (cnae: TableCNAEEntity | null) => {
            setSelectedCNAE(cnae);
            const updatedPessoa = pessoa.copyWith({
                cnae_fiscal: cnae?.codigo ?? null
            });
            setPessoa(updatedPessoa);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.cnae_fiscal;
                return newErrors;
            });
        };
        const handleErrorsChange = (updatedErrors: Record<string, string>) => {
            setErrors(updatedErrors);
        };
        const handleValidateCnpj = () => {
            setTouchedFields((prev) => ({ ...prev, cnpj: true }));
            validatePessoaForm();
        };
        const handleSearchPessoaCnpj = async () => {
            setLoadingCnpj(true);
            await handleSearchCNPJ(pessoa?.cnpj ?? '', setPessoa, setErrors, msgs);
            setLoadingCnpj(false);
            setTouchedFields((prev) => ({ ...prev, cnpj: true }));
        };
        const listagemPessoaID = async (currentPessoaId: string) => {
            try {
                setIsLoading(true);
                const { dataPessoa } = await fetchPessoasById(currentPessoaId);
                const pessoaEntity = new PessoaEntity(dataPessoa);
                setPessoa(pessoaEntity);
                setSelectedContato(mapPessoaContatoToSelection(dataPessoa));
                setSelectedCNAE(
                    dataPessoa.cnae_fiscal
                        ? new TableCNAEEntity({
                            id: 0,
                            codigo: dataPessoa.cnae_fiscal,
                            descricao: dataPessoa.cnae_fiscal
                        })
                        : null
                );
                setSelectedVendedor(null);
            } finally {
                setIsLoading(false);
            }
        };
        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));
        useEffect(() => {
            onPessoaChangeRef.current = onPessoaChange;
        }, [onPessoaChange]);
        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);
        useEffect(() => {
            if (pessoaId) {
                setIsEditMode(true);
                listagemPessoaID(pessoaId).finally(() => setIsLoading(false));
                return;
            }

            setIsLoading(false);
        }, [pessoaId]);
        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validatePessoaForm();
            }
        }, [pessoa, selectedVendedor]);
        useEffect(() => {
            onPessoaChangeRef.current?.(pessoa);
        }, [pessoa]);
        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);
        if (isLoading && pessoaId) {
            return <LoadingScreenComponent fullScreen={false} loadingText="Carregando informacoes do Cliente ou Fornecedor selecionado..." />;
        }
        const isSubmitDisabled =
            stateDisableBtnCreatedClienteFornecedor ||
            isLoadingBtnCreated ||
            Object.keys(errors).length > 0 ||
            (pessoa.tipo_pessoa === 'PESSOA_JURIDICA' && !pessoa.cnpj) ||
            (pessoa.tipo_pessoa === 'PESSOA_FISICA' && !pessoa.cpf) ||
            (pessoa.tipo_pessoa === 'PESSOA_FISICA' && !pessoa.rg) ||
            (pessoa.tipo_pessoa === 'ESTRANGEIRO' && !pessoa.documento_estrangeiro) ||
            !pessoa?.razao_social ||
            !pessoa.codigo_regime_tributario ||
            !pessoa.contribuinte ||
            (!selectedVendedor && !pessoa.id_vendedor_padrao) ||
            !pessoa.endereco ||
            !pessoa.email;
        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        return (
            <>
                <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                    <Messages ref={msgs} className="custom-messages" />
                    <div className="scrollable-container shared-form-content">
                        <div className="custom-flex-col">
                            <PessoaFields
                                pessoa={pessoa}
                                errors={errors}
                                selectedContato={selectedContato}
                                selectedCNAE={selectedCNAE}
                                loadingCnpj={loadingCnpj}
                                hasFocused={hasFocused}
                                onFocusFirstField={() => setHasFocused(true)}
                                onChange={handleAllChanges}
                                onDropdownChange={handleDropdownChange}
                                onContatoChange={handleContatoChange}
                                onCNAEChange={handleCNAEChange}
                                onSearchCnpj={handleSearchPessoaCnpj}
                                onValidateCnpj={handleValidateCnpj}
                                fetchAllCnae={fetchAllCnae}
                                fetchFilteredCnae={fetchFilteredCnae}
                            />
                            <Divider align="center" className="form-divider">
                                <span>Vendedor</span>
                            </Divider>
                            <div className="col-12 lg:col-3">
                                <VendedorDropdownField
                                    selectedVendedor={selectedVendedor}
                                    selectedVendedorId={pessoa.id_vendedor_padrao ?? null}
                                    reloadKey={reloadKeyVendedor}
                                    onVendedorChange={handleVendedorChange}
                                    onAddClick={() => setShowModalVendedor(true)}
                                    hasError={!!errors.selectedVendedor}
                                    errorMessage={errors.selectedVendedor}
                                />
                            </div>
                            <EnderecoForm
                                endereco={pessoa?.endereco}
                                telefone={pessoa?.endereco?.telefone}
                                errors={errors}
                                onChange={handleAllChanges}
                                onCepSearch={() => handleSearchCep(pessoa.endereco?.cep || '', setLoadingCep, setPessoa, setError, msgs)}
                                onDropdownChange={handleDropdownChange}
                                onDropdownChangeEndereco={handleDropdownChangeEndereco}
                                getCitiesFromState={getCitiesFromState}
                                loadingCep={loadingCep}
                            />
                        </div>
                    </div>
                    <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                        {showBTNPGCreatedAll && (
                            <BTNPGCreatedAll
                                onClick={async () => await handleSubmit()}
                                disabled={isSubmitDisabled}
                                icon=""
                                label="Salvar"
                            />
                        )}
                        {showBTNPGCreatedDialog && (
                            <BTNPGCreatedDialog
                                onClick={async () => await handleSubmit()}
                                disabled={isSubmitDisabled}
                                icon=""
                                onBackClick={onBackClick}
                                onClose={onClose}
                                label="Salvar"
                            />
                        )}
                    </div>
                </div>
                <DialogFilter header="Adicionar Vendedor" visible={showModalVendedor} onHide={() => setShowModalVendedor(false)}>
                    <VendedorForm
                        msgs={msgs}
                        ref={formRef}
                        vendedor={vendedor}
                        initialId={null}
                        setVendedor={setVendedor}
                        onVendedorChange={handleVendedor}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handleVendedorSaved}
                        onClose={() => setShowModalVendedor(false)}
                        showBTNPGCreatedDialog
                        onBackClick={() => setShowModalVendedor(false)}
                    />
                </DialogFilter>
            </>
        );
    }
);
PessoaFormContainer.displayName = 'PessoaFormContainer';
function isPessoaFormProps(props: FormPessoaCreatedProps): props is PessoaFormProps {
    return 'msgs' in props;
}
const FormPessoaCreated = forwardRef<PessoaFormRef, FormPessoaCreatedProps>((props, ref) => {
    if (isPessoaFormProps(props)) {
        return <PessoaFormContainer {...props} ref={ref} />;
    }
    return <PessoaFields {...props} />;
});
FormPessoaCreated.displayName = 'FormPessoaCreated';
export default FormPessoaCreated;

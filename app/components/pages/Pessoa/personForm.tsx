'use client';
import './style.css';
import '@/app/styles/styledGlobal.css';
import { Divider } from 'primereact/divider';
import { Messages } from 'primereact/messages';
import { getCitiesFromState } from '@/app/entity/maps';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import Input from '@/app/shared/include/input/input-all';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import LoadingScreenComponent from '@/app/loading/loadingComponent';
import { handleSearchCep } from '../../seachs/searchCep/controller';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import CustomMultiSelect from '@/app/shared/include/multSelect/Input';
import { handleSearchCNPJ } from '../../seachs/searchCnpj/controller';
import CNAEDropdownField from '../../fetchAll/listAllCnae/cnaeFiscal';
import VendedorForm, { VendedorFormRef } from '../Vendedores/sellerForm';
import { RefObject, useEffect, useState, forwardRef, useRef } from 'react';
import { fetchPessoasById } from '../../fetchAll/listAllPessoas/controller';
import { CreatedDialog } from '../../dialogs/dialogCreatedComponent/dialog';
import EnderecoForm from '../../enderecos/enderecoFormComponent/enderecoForm';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import BTNPGCreatedAll from '../../buttonsComponent/btnCreatedAll/btn-created-all';
import { fetchAllCnae, fetchFilteredCnae } from '../../fetchAll/listAllCnae/controller';
import BTNPGCreatedDialog from '../../buttonsComponent/btnCreatedAll/btn-created-dialog';
import { validateFieldsPessoa } from '@/app/(main)/cadastro/clientesFornecedores/controller/validate';
import { fetchAllVendedores, fetchFilteredVendedor } from '../../fetchAll/listAllVendedores/controller';
import { createdPessoa, updatePessoa } from '@/app/(main)/cadastro/clientesFornecedores/controller/controller';
import { contribuinteOptions, DropDownTipoPessoa, OptionsTipoContrato, regimeTributarioPessoaOptions } from '@/app/shared/optionsDropDown/options';
export interface PessoaFormRef {
    handleSave: () => Promise<void>;
}
interface PessoaFormProps {
    pessoa: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onPessoaChange?: (servico: PessoaEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setPessoa: React.Dispatch<React.SetStateAction<PessoaEntity[]>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: PessoaEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
const PessoaForm = forwardRef<PessoaFormRef, PessoaFormProps>(({ 
    initialId, onPessoaChange, onErrorsChange, redirectAfterSave, 
    onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll,
     onBackClick }: PessoaFormProps, ref) => {
    const router = useRouter();
    const pessoaId = initialId;
    const msgs = useRef<Messages>(null);
    const searchParams = useSearchParams();
    const vendedorId = searchParams.get('id');
    const formRef = useRef<VendedorFormRef>(null);
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
    const [loadingCep, setLoadingCep] = useState<boolean>(false);
    const [loadingCnpj, setLoadingCnpj] = useState<boolean>(false);
    const [showModalVendedor, setShowModalVendedor] = useState(false);
    const [selectedContato, setSelectedContato] = useState<any[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [selectedCNAE, setSelectedCNAE] = useState<TableCNAEEntity | null>(null);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
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
            cnae_fiscal: '',
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
    const handleAllChanges = (event: any) => {
        const id = event?.target?.id;
        const type = event?.target?.type;
        const checked = event?.target?.checked;
        const value = event?.target?.value ?? event?.value ?? '';
        const newValue = type === 'checkbox' || type === 'switch' ? checked : value;
        const camposEndereco = ['cep', 'logradouro', 'bairro', 'numero', 'uf', 'municipio', 'codigo_municipio', 'codigo_pais', 'complemento', 'nome_pais', 'telefone'];
        setPessoa((prev) => {
            const prePessoa = new PessoaEntity(prev);
            if (camposEndereco.includes(id)) {
                return prePessoa.copyWith({
                    endereco: {
                        ...prePessoa.endereco,
                        [id]: newValue
                    }
                });
            } else {
                return prePessoa.copyWith({
                    [id]: newValue
                });
            }
        });
    };
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        msgs.current?.clear();
        try {
            if (isEditMode && pessoaId) {
                await updatePessoa(pessoaId, pessoa, setErrors, msgs, router, setPessoa);
            } else {
                await createdPessoa(pessoa, setErrors, msgs, router, setPessoa, redirectAfterSave ?? true);
                console.log('pessoa', pessoa);
            }
        } finally {
            setStateDisableBtnCreatedClienteFornecedor(false);
        }
    };
    const handleVendedor = (updatedVendedor: VendedorEntity) => {
        setVendedor(updatedVendedor);
    };
    const handleVendedorSaved = (created: VendedorEntity) => {
        setShowModalVendedor(false);
        setSelectedVendedor(created);
        setReloadKeyVendedor((k) => k + 1);
        console.log('pessoa', pessoa);
    };
    const handleVendedorChange = (vendedor: VendedorEntity | null) => {
        setSelectedVendedor(vendedor);
        if (vendedor) {
            console.log(` vendedor ID: ${vendedor.id} | Descrição: ${vendedor.razao_social}`);
            handleAllChanges({
                target: { id: 'id_vendedor_padrao', value: vendedor.id, type: 'input' }
            });
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedVendedor;
            return newErrors;
        });
    };
    const handleDropdownChange = (e: DropdownChangeEvent) => {
        const pessoaInstance = pessoa instanceof PessoaEntity ? pessoa : new PessoaEntity(pessoa);
        const _pessoa = pessoaInstance.copyWith({ [e.target.id]: e.value });
        setPessoa(_pessoa);
    };
    const handleDropdownChangeEnderco = (e: DropdownChangeEvent) => {
        const updatedEndereco = {
            ...pessoa.endereco,
            [e.target.id]: e.value
        };
        setPessoa((prev) => prev.copyWith({ endereco: updatedEndereco }));
    };
    const handleContatoChange = (event: any) => {
        const selected = event.value;
        setSelectedContato(selected);
        const contatoStatus: Record<string, boolean> = OptionsTipoContrato.reduce((acc, option) => {
            acc[option.value] = selected.includes(option.value);
            return acc;
        }, {} as Record<string, boolean>);

        const updatedPessoa = pessoa.copyWith({
            ...contatoStatus
        });
        setPessoa(updatedPessoa);
        validateFieldsPessoa(pessoa, setErrors, msgs, selectedVendedor);
    };
    const handleCNAEChange = (cnae: TableCNAEEntity | null) => {
        setSelectedCNAE(cnae);
        const updatedPessoa = pessoa.copyWith({
            cnae_fiscal: cnae?.codigo || ''
        });
        setPessoa(updatedPessoa);
        handleAllChanges({
            target: { id: 'cnae_fiscal', value: cnae?.codigo || '', type: 'input' }
        });
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.cnae_fiscal;
            return newErrors;
        });
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    const ListagemClientesFornecedoresID = async (pessoaId: string) => {
        try {
            setIsLoading(true);
            const { dataPessoa } = await fetchPessoasById(pessoaId);
            const contatoSelecionado: string[] = [];
            if (dataPessoa.pessoa_cliente) contatoSelecionado.push('pessoa_cliente');
            if (dataPessoa.pessoa_fornecedor) contatoSelecionado.push('pessoa_fornecedor');
            const pessoaEntity = new PessoaEntity(dataPessoa);
            setPessoa(pessoaEntity);
            const vendedores = await fetchAllVendedores();
            const vendedorSelecionado = vendedores.find((vendedor) => vendedor.id === dataPessoa.id_vendedor_padrao);
            setSelectedVendedor(vendedorSelecionado ?? null);
            setSelectedContato(contatoSelecionado);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (pessoaId) {
            setIsEditMode(true);
            ListagemClientesFornecedoresID(pessoaId).finally(() => setIsLoading(false));
        }
    }, [pessoaId]);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsPessoa(pessoa, setErrors, msgs, selectedVendedor);
        }
    }, [pessoa]);
    if (isLoading && pessoaId) {
        return <LoadingScreenComponent fullScreen={false} loadingText="Carregando informações do Cliente ou Fornecedor selecionado..." />;
    }
    return (
        <>
            <Messages ref={msgs} className="custom-messages" />
            <div className="scrollable-container">
                <div className="custom-flex-col">
                    <div className="grid formgrid">
                        <div className="col-12 lg:col-3 mt-1">
                            <Dropdown
                                id="tipo_pessoa"
                                value={pessoa?.tipo_pessoa || ''}
                                options={DropDownTipoPessoa}
                                onChange={handleDropdownChange}
                                optionLabel="name"
                                optionValue="code"
                                label={''}
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
                                            await handleSearchCNPJ(pessoa?.cnpj ?? '', setPessoa, setErrors, msgs);
                                            setLoadingCnpj(false);
                                        }}
                                        placeholder="99.999.999/9999-99"
                                        mask="99.999.999/9999-99"
                                        iconRight="pi pi-search"
                                        outlined={false}
                                        useRightButton={true}
                                        hasError={!!errors.cnpj}
                                        errorMessage={errors.cnpj}
                                        disabledRightButton={(pessoa.cnpj || '').replace(/\D/g, '').length !== 14}
                                        loading={loadingCnpj}
                                        onBlur={() => {
                                            setTouchedFields((prev) => ({ ...prev, cnpj: true }));
                                            validateFieldsPessoa(pessoa, setErrors, msgs, selectedVendedor);
                                        }}
                                        autoFocus={!hasFocused}
                                        onFocus={() => setHasFocused(true)}
                                        showTopLabel
                                        required
                                        topLabel="CNPJ:"
                                    />
                                </div>
                                <div className="col-12 lg:col-6 mt-1">
                                    <Input
                                        id="razao_social"
                                        value={pessoa?.razao_social || ''}
                                        onChange={handleAllChanges}
                                        label="Nome ou Razão Social do contato:"
                                        hasError={!!errors.razao_social}
                                        errorMessage={errors.razao_social}
                                        showTopLabel
                                        required
                                        topLabel="Nome ou Razão Social do contato:"
                                    />
                                </div>
                                <div className="col-12 lg:col-6 mt-1">
                                    <Input
                                        value={pessoa?.nome_fantasia || ''}
                                        onChange={handleAllChanges}
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
                                        onChange={handleDropdownChange}
                                        label="Selecione um Regime Tributário"
                                        hasError={!!errors.selectedRegime}
                                        errorMessage={errors.selectedRegime}
                                        showTopLabel
                                        required
                                        topLabel="Código Regime Tributário:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <Dropdown
                                        id="contribuinte"
                                        value={pessoa.contribuinte ?? ''}
                                        options={contribuinteOptions}
                                        onChange={handleDropdownChange}
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
                                        onChange={handleAllChanges}
                                        label="Inscrição Estadual"
                                        id="inscricao_estadual"
                                        hasError={!!errors.inscricao_estadual}
                                        errorMessage={errors.inscricao_estadual}
                                        showTopLabel
                                        required
                                        topLabel="Inscrição Estadual:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <Input
                                        value={pessoa.inscricao_municipal || ''}
                                        onChange={handleAllChanges}
                                        label="Inscrição Municipal"
                                        id="inscricao_municipal"
                                        hasError={!!errors.inscricao_municipal}
                                        errorMessage={errors.inscricao_municipal}
                                        showTopLabel
                                        required
                                        topLabel="Inscrição Municipal:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <Input
                                        value={pessoa.atividade_principal || ''}
                                        onChange={handleAllChanges}
                                        label="Atividade Principal"
                                        id="atividade_principal"
                                        hasError={!!errors.atividade_principal}
                                        errorMessage={errors.atividade_principal}
                                        showTopLabel
                                        topLabel="Atividade Principal:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <CNAEDropdownField
                                        selectedCNAE={selectedCNAE}
                                        onCNAEChange={handleCNAEChange}
                                        fetchAllCnae={fetchAllCnae}
                                        fetchFilteredCnae={fetchFilteredCnae}
                                        hasError={!!errors.cnae_fiscal}
                                        errorMessage={errors.cnae_fiscal}
                                        showTopLabel
                                        topLabel="CNAE Fiscal:"
                                        required
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
                                        value={pessoa.rg || ''}
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
                                    <Input id="razao_social" value={pessoa?.razao_social || ''} onChange={handleAllChanges} label="Nome:" hasError={!!errors.razao_social} errorMessage={errors.razao_social} showTopLabel required topLabel="Nome:" />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <Dropdown
                                        id="codigo_regime_tributario"
                                        value={pessoa?.codigo_regime_tributario ?? ''}
                                        options={regimeTributarioPessoaOptions}
                                        onChange={handleDropdownChange}
                                        label="Selecione um Regime Tributário"
                                        hasError={!!errors.selectedRegime}
                                        errorMessage={errors.selectedRegime}
                                        showTopLabel
                                        required
                                        topLabel="Código Regime Tributário:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <Dropdown
                                        id="contribuinte"
                                        value={pessoa.contribuinte || ''}
                                        options={contribuinteOptions}
                                        onChange={handleDropdownChange}
                                        placeholder="Selecione o Contribuinte"
                                        optionValue="code"
                                        label={''}
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
                                        onChange={handleAllChanges}
                                        label="Inscrição Estadual"
                                        id="inscricao_estadual"
                                        hasError={!!errors.inscricao_estadual}
                                        errorMessage={errors.inscricao_estadual}
                                        showTopLabel
                                        required
                                        topLabel="Inscrição Estadual:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <Input
                                        value={pessoa.inscricao_municipal || ''}
                                        onChange={handleAllChanges}
                                        label="Inscrição Municipal"
                                        id="inscricao_municipal"
                                        hasError={!!errors.inscricao_municipal}
                                        errorMessage={errors.inscricao_municipal}
                                        showTopLabel
                                        required
                                        topLabel="Inscrição Municipal:"
                                    />
                                </div>
                                <div className="col-12 lg:col-3 mt-1">
                                    <div className="p-field">
                                        <CNAEDropdownField
                                            selectedCNAE={selectedCNAE}
                                            onCNAEChange={handleCNAEChange}
                                            fetchAllCnae={fetchAllCnae}
                                            fetchFilteredCnae={fetchFilteredCnae}
                                            hasError={!!errors.cnae_fiscal}
                                            errorMessage={errors.cnae_fiscal}
                                            showTopLabel
                                            topLabel="CNAE Fiscal:"
                                            required
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
                                <div className="col-12 lg:col-3 mt-1">
                                    <Input value={pessoa.pais || ''} onChange={handleAllChanges} label="Documento de identificação" id="pais" hasError={!!errors.pais} errorMessage={errors.pais} showTopLabel required topLabel="Nome do País:" />
                                </div>
                            </>
                        )}
                        {pessoa?.tipo_pessoa === 'ESTRANGEIRO_NO_BRASIL' && (
                            <>
                                <div className="col-12 lg:col-3 mt-1">
                                    <Input
                                        value={pessoa.documento_estrangeiro || ''}
                                        onChange={handleAllChanges}
                                        label="Documento de identificação"
                                        id="documento_estrangeiro"
                                        hasError={!!errors.documento_estrangeiro}
                                        errorMessage={errors.documento_estrangeiro}
                                        showTopLabel
                                        required
                                        topLabel="Documento de identificação:"
                                    />
                                </div>
                            </>
                        )}
                        <div className="col-12 lg:col-3 mt-1">
                            <CustomMultiSelect
                                id="selectedContato"
                                selectedItems={selectedContato}
                                onChange={handleContatoChange}
                                options={OptionsTipoContrato}
                                optionLabel="label"
                                placeholder="Selecione o Contato"
                                maxSelectedLabels={2}
                                showChips={false}
                                hasError={!!errors.selectedContato}
                                errorMessage={errors.selectedContato}
                                showTopLabel
                                required
                                topLabel="Tipo de contrato:"
                            />
                        </div>
                    </div>
                    <Divider align="center" className="form-divider">
                        <span>Vendedor</span>
                    </Divider>
                    <div className="grid formgrid mt-3">
                        <div className="col-12 mb-1 lg:col-3 lg:mb-0">
                            <DropdownSearch<VendedorEntity>
                                id="selectedVendedor"
                                key={reloadKeyVendedor}
                                selectedItem={selectedVendedor}
                                onItemChange={handleVendedorChange}
                                fetchAllItems={fetchAllVendedores}
                                fetchFilteredItems={fetchFilteredVendedor}
                                optionLabel="razao_social"
                                placeholder="Selecione o Vendedor"
                                hasError={!!errors.selectedVendedor}
                                errorMessage={errors.selectedVendedor}
                                onAddClick={() => setShowModalVendedor(true)}
                                showAddButton
                                autoSelectSingle
                                showTopLabel
                                required
                                topLabel="Vendedor:"
                            />
                        </div>
                    </div>
                    <EnderecoForm
                        endereco={pessoa?.endereco}
                        telefone={pessoa?.endereco.telefone}
                        errors={errors}
                        onChange={handleAllChanges}
                        onCepSearch={() => handleSearchCep(pessoa.endereco?.cep || '', setLoadingCep, setPessoa, setError, msgs)}
                        onDropdownChange={handleDropdownChange}
                        onDropdownChangeEndereco={handleDropdownChangeEnderco}
                        getCitiesFromState={getCitiesFromState}
                        loadingCep={loadingCep}
                    />
                </div>
                <div className="grid formgrid">
                    <div className="col-12 mb-1 lg:col-6 lg:mb-0">
                        <Input value={pessoa?.email || ''} onChange={handleAllChanges} label="E-mail" id="email" type="email" hasError={!!errors.email} errorMessage={errors.email} topLabel="E-mail:" showTopLabel />
                    </div>
                </div>
            </div>
            <div className="StyleContainer-btn-Created">
                {showBTNPGCreatedAll && (
                    <BTNPGCreatedAll
                        onClick={async () => await handleSubmit()}
                        disabled={
                            stateDisableBtnCreatedClienteFornecedor ||
                            Object.keys(errors).length > 0 ||
                            (pessoa.tipo_pessoa === 'PESSOA_JURIDICA' && !pessoa.cnpj) ||
                            (pessoa.tipo_pessoa === 'PESSOA_FISICA' && !pessoa.cpf) ||
                            (pessoa.tipo_pessoa === 'PESSOA_FISICA' && !pessoa.rg) ||
                            (pessoa.tipo_pessoa === 'ESTRANGEIRO' && !pessoa.documento_estrangeiro) ||
                            !pessoa?.razao_social ||
                            !pessoa.codigo_regime_tributario ||
                            !pessoa.contribuinte ||
                            typeof pessoa.pessoa_cliente !== 'boolean' ||
                            typeof pessoa.pessoa_fornecedor !== 'boolean' ||
                            !selectedVendedor ||
                            !pessoa.endereco ||
                            !pessoa.email
                        }
                        icon={''}
                        label={'Salvar'}
                    />
                )}
                {showBTNPGCreatedDialog && (
                    <BTNPGCreatedDialog
                        onClick={async () => await handleSubmit()}
                        disabled={
                            stateDisableBtnCreatedClienteFornecedor ||
                            Object.keys(errors).length > 0 ||
                            (pessoa.tipo_pessoa === 'PESSOA_JURIDICA' && !pessoa.cnpj) ||
                            (pessoa.tipo_pessoa === 'PESSOA_FISICA' && !pessoa.cpf) ||
                            (pessoa.tipo_pessoa === 'PESSOA_FISICA' && !pessoa.rg) ||
                            (pessoa.tipo_pessoa === 'ESTRANGEIRO' && !pessoa.documento_estrangeiro) ||
                            !pessoa?.razao_social ||
                            !pessoa.codigo_regime_tributario ||
                            !pessoa.contribuinte ||
                            typeof pessoa.pessoa_cliente !== 'boolean' ||
                            typeof pessoa.pessoa_fornecedor !== 'boolean' ||
                            !selectedVendedor ||
                            !pessoa.endereco ||
                            !pessoa.email
                        }
                        icon={''}
                        onBackClick={onBackClick}
                        onClose={onClose}
                        label={'Salvar'}
                    />
                )}
            </div>
            <CreatedDialog header="Adicionar Vendedor" visible={showModalVendedor} onHide={() => setShowModalVendedor(false)}>
                <VendedorForm
                    msgs={msgs}
                    ref={formRef}
                    vendedor={vendedor}
                    initialId={vendedorId}
                    setVendedor={setVendedor}
                    onVendedorChange={handleVendedor}
                    onErrorsChange={handleErrorsChange}
                    redirectAfterSave={false}
                    onSaved={handleVendedorSaved}
                    onClose={() => setShowModalVendedor(false)}
                    showBTNPGCreatedDialog={true}
                    onBackClick={() => setShowModalVendedor(false)}
                />
            </CreatedDialog>
        </>
    );
    
});
PessoaForm.displayName = 'PessoaForm';
export default PessoaForm;

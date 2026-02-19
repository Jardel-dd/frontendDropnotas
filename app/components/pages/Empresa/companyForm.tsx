'use client';
import './style-Created-Company.css';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Divider } from 'primereact/divider';
import { Messages } from 'primereact/messages';
import IconVisible from '@/app/shared/IconVisible';
import { useTheme } from '../../isDarkMode/isDarkMode';
import { getCitiesFromState } from '@/app/entity/maps';
import Input from '@/app/shared/include/input/input-all';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { IconPorcentagem } from '@/app/utils/icons/icons';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { MultiSelectChangeEvent } from 'primereact/multiselect';
import { Mandatory } from '@/app/shared/mandatory/InputMandatory';
import { handleSearchCep } from '../../seachs/searchCep/controller';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import CustomMultiSelect from '@/app/shared/include/multSelect/Input';
import { handleSearchCNPJ } from '../../seachs/searchCnpj/controller';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { RefObject, useEffect, useState, forwardRef, useRef } from 'react';
import { fetchCompanyByID } from '../../fetchAll/listAllCompany/controller';
import { CustomInputNumber } from '@/app/shared/include/inputReal/inputReal';
import EnderecoForm from '../../enderecos/enderecoFormComponent/enderecoForm';
import { useIsDesktop, useIsMobile } from '../../responsiveCelular/responsive';
import BTNPGCreatedAll from '../../buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '../../buttonsComponent/btnCreatedAll/btn-created-dialog';
import { fetchFilteredUserConta, fetchUserConta } from '../../fetchAll/listUsersConta/controller';
import { validateFieldsEmpresas } from '@/app/(main)/configuracoes/empresas/controller/validation';
import { fetchAllCnae, fetchFilteredCnae, findCNAEByCodigo } from '../../fetchAll/listAllCnae/controller';
import { convertCertificadoToBase64, convertLogoToBase64, createdEmpresa, updateEmpresa } from '@/app/(main)/configuracoes/empresas/controller/controller';
import { incentivoFiscal, prestacaoSus, regimeEspecialTributarioOptionsCompany, regimeTributarioOptions, tipo_rps } from '@/app/shared/optionsDropDown/options';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';

export interface EmpresaFormRef {
    handleSave: () => Promise<void>;
}
interface EmpresaFormProps {
    empresa: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onEmpresaChange?: (servico: CompanyEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setEmpresa: React.Dispatch<React.SetStateAction<CompanyEntity>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: CompanyEntity) => void;
    onClose?: () => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
const EmpresaForm = forwardRef<EmpresaFormRef, EmpresaFormProps>(({ initialId, msgs, onEmpresaChange, onErrorsChange, redirectAfterSave, onSaved, onClose, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }: EmpresaFormProps, ref) => {
    const router = useRouter();
    const empresaId = initialId;
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const { isDarkMode } = useTheme();
    const toast = useRef<Toast>(null);
    const fileUploadRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [reloadKeyCNAE, setReloadKeyCNAE] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [empresa, setEmpresa] = useState<CompanyEntity>(
        new CompanyEntity({
            id: 0,
            id_usuarios_acesso: [0],
            cnpj: '',
            razao_social: '',
            nome_fantasia: '',
            logo_empresa: '',
            atividade_principal: '',
            inscricao_estadual: '',
            inscricao_municipal: '',
            codigo_regime_tributario: '',
            tipo_rps: '',
            endereco: {} as EnderecoEntity,
            cnaes_secundarios: ['0'],
            certificado_digital: '',
            data_vencimento_certificado_digital: '',
            senha_certificado_digital: '',
            nome_certificado_digital: '',
            serie_emissao_nfse: '',
            proximo_numero_rps: null,
            proximo_numero_lote: null,
            aliquota_iss: null,
            cnae_fiscal: '',
            prestacao_sus: false,
            regime_especial_tributacao: '',
            incentivo_fiscal: false,
            email: '',
            telefone: '',
            ativo: true,
            aliquota_pis: 0,
            aliquota_cofins: 0,
            aliquota_inss: 0,
            aliquota_ir: 0,
            aliquota_csll: 0,
            aliquota_outras_retencoes: 0,
            aliquota_deducoes: 0,
            percentual_desconto_incondicionado: 0,
            percentual_desconto_condicionado: 0
        })
    );
    const [loadingCep, setLoadingCep] = useState<boolean>(false);
    const [loadingCnpj, setLoadingCnpj] = useState<boolean>(false);
    const [logoAlterada, setLogoAlterada] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [userConta, setUserConta] = useState<UsuarioContaEntity[]>([]);
    const [loadingFileUpload, setLoadingFileUpload] = useState<boolean>(false);
    const [selectedCNAE, setSelectedCNAE] = useState<TableCNAEEntity | null>(null);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [selectedUserConta, setSelectedUserConta] = useState<UsuarioContaEntity[]>([]);
    const [stateDisableBtnCreatedCompany, setStateDisableBtnCreatedCompany] = useState(false);
    const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
        const { id, value, checked, type } = event.target;
        const newValue = type === 'checkbox' || type === 'switch' ? checked : value;
        const camposEndereco = ['cep', 'logradouro', 'bairro', 'numero', 'uf', 'municipio', 'codigo_municipio', 'codigo_pais', 'complemento', 'nome_pais'];
        setEmpresa((prev) => {
            const empresaInstanciada = new CompanyEntity(prev);
            if (camposEndereco.includes(id)) {
                return empresaInstanciada.copyWith({
                    endereco: {
                        ...empresaInstanciada.endereco,
                        [id]: newValue
                    }
                });
            } else {
                return empresaInstanciada.copyWith({
                    [id]: newValue
                });
            }
        });
    };
    const handleNumberChange = (e: InputNumberValueChangeEvent) => {
        const _empresa = empresa.copyWith({
            [e.target.id]: e.value ?? 0
        });
        setEmpresa(_empresa);
        setTouchedFields((prev) => ({
            ...prev,
            [e.target.id]: true
        }));
        validateFieldsEmpresas(empresa, selectedUserConta[0], setErrors, msgs);
    };
    const handleDropdownChangeEnderco = (e: DropdownChangeEvent) => {
        const updatedEndereco = {
            ...empresa.endereco,
            [e.target.id]: e.value
        };
        setEmpresa((prev) => prev.copyWith({ endereco: updatedEndereco }));
    };
    const handleDropdownChange = (e: DropdownChangeEvent) => {
        const _company = empresa.copyWith({
            [e.target.id]: e.value
        });
        setEmpresa(_company);
    };
    const handleCNAEChange = (cnae: TableCNAEEntity | null) => {
        setSelectedCNAE(cnae);
        const updatedEmpresa = empresa.copyWith({
            cnae_fiscal: cnae?.codigo || ''
        });
        setEmpresa(updatedEmpresa);
        handleAllChanges({
            target: { id: 'cnae_fiscal', value: cnae?.codigo || '', type: 'input' }
        });
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.cnae_fiscal;
            return newErrors;
        });
    };
    const handleUserChange = (e: MultiSelectChangeEvent) => {
        const selected = e.value as UsuarioContaEntity[];
        setSelectedUserConta(selected);
        const selectedIds = selected.map((user) => user.id);
        handleAllChanges({
            target: { id: 'id_usuarios_acesso', value: selectedIds, type: 'input' }
        });
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedUserConta;
            return newErrors;
        });
    };
    const handleFileChangeCertificado = (event: FileUploadSelectEvent) => {
        if (event.files && event.files.length > 0) {
            setErrors((prev) => ({ ...prev, certificado_digital: '' }));
            convertCertificadoToBase64(event.files as File[], setEmpresa, toast, msgs, (empresaAtualizada) => {
                validateFieldsEmpresas(empresa, selectedUserConta[0], setErrors, msgs);
            });
        }
    };
    const handleRemoveFile = () => {
        setEmpresa((prev) => prev.copyWith({ certificado_digital: '' }));
        setErrors((prev) => ({ ...prev, certificado_digital: '' }));
        fileUploadRef.current.clear();
    };
    const handleFileChangeLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files);
            convertLogoToBase64(files, setEmpresa, toast, msgs);
            setLogoAlterada(true);
        }
    };
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        msgs.current?.clear();
        setStateDisableBtnCreatedCompany(true);
        try {
            const data = { ...empresa };
            if (data.cnpj) {
                data.cnpj = data.cnpj.replace(/\D/g, '');
            }
            if (isEditMode && empresaId) {
                updateEmpresa(empresaId, data as CompanyEntity, selectedUserConta, setErrors, msgs, router, redirectAfterSave ?? true);
            } else {
                const created = await createdEmpresa(data as CompanyEntity, selectedUserConta, setErrors, msgs, router, setEmpresa as React.Dispatch<React.SetStateAction<Partial<CompanyEntity>>>, setSelectedUserConta, redirectAfterSave ?? true);
                if (created) {
                    onSaved?.(created);
                }
            }
            onClose?.();
        } finally {
            setStateDisableBtnCreatedCompany(false);
        }
    };
    const handleDeleteClick = () => {
        setEmpresa((prevEmpresa) =>
            prevEmpresa.copyWith({
                ...prevEmpresa,
                logo_empresa: ''
            })
        );
    };
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };
    const ListagemEmpresaID = async (empresaId: string) => {
        try {
            setIsLoading(true);
            const { empresa, userConta, selectedUserConta } = await fetchCompanyByID(empresaId);
            setEmpresa(empresa);
            setUserConta(userConta);
            setSelectedUserConta(selectedUserConta);
            const allCnaes = await fetchAllCnae();
            console.log('CNAE fiscal vindo do backend:', empresa.cnae_fiscal);
            console.log('Todos os CNAEs disponíveis:', allCnaes);
            const selected = findCNAEByCodigo(empresa.cnae_fiscal, allCnaes);
            console.log('CNAE encontrado:', selected);
            setSelectedCNAE(selected ?? null);
        } finally {
            setIsLoading(false);
        }
    };
    const handleIconClick = () => {
        console.log('Abrindo seletor de arquivos...');
        fileInputRef.current?.click();
    };
    useEffect(() => {
        if (onEmpresaChange) {
            onEmpresaChange(empresa);
        }
    }, [empresa, onEmpresaChange]);
    useEffect(() => {
        if (onErrorsChange) {
            onErrorsChange(errors);
        }
    }, [errors, onErrorsChange]);
    useEffect(() => {
        if (empresaId) {
            setIsEditMode(true);
            ListagemEmpresaID(empresaId).finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [empresaId]);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsEmpresas(empresa, selectedUserConta[0], setErrors, msgs);
        }
    }, [empresa]);
    if (isLoading && empresaId) {
        return <LoadingScreen loadingText="Carregando informações da Empresa selecionada..." />;
    }
    return (
        <>
            <Messages ref={msgs} className="custom-messages" />
            <div className="scrollable-container">
                <div className="mb-4 lg:mb-0 custom-container">
                    <div className="custom-flex-row">
                        <div className="w-full">
                            {isMobile && (
                                <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center', padding: '1rem' }}>
                                    <div className="image-upload-containerMobile">
                                        {empresa.logo_empresa ? (
                                            <>
                                                <img src={empresa.logo_empresa} alt="Uploaded" className="img-cover" />
                                                <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Delete" onClick={handleDeleteClick} className="button-Imagem-Logo-top-right" />
                                            </>
                                        ) : (
                                            <>
                                                <Button icon="pi pi-upload" rounded text severity="success" aria-label="Search" onClick={handleIconClick} className="button-Imagem-Logo-top-right" />
                                                <div className="flex-Img-Logo-center">
                                                    <i className="pi pi-images image-icon"></i>
                                                </div>
                                            </>
                                        )}
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChangeLogo} />
                                    </div>
                                </div>
                            )}
                            <div className="grid formgrid">
                                <div className="col-12 lg:col-4 mt-1">
                                    <InputMaskDrop
                                        id="cnpj"
                                        value={empresa.cnpj || ''}
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
                                            await handleSearchCNPJ(empresa?.cnpj ?? '', setEmpresa, setErrors, msgs, selectedUserConta);
                                            setLoadingCnpj(false);
                                        }}
                                        placeholder="99.999.999/9999-99"
                                        mask="99.999.999/9999-99"
                                        iconRight="pi pi-search"
                                        outlined={false}
                                        useRightButton={true}
                                        hasError={!!errors.cnpj}
                                        errorMessage={errors.cnpj}
                                        disabledRightButton={(empresa.cnpj || '').replace(/\D/g, '').length !== 14}
                                        loading={loadingCnpj}
                                        onBlur={() => {
                                            setTouchedFields((prev) => ({ ...prev, cnpj: true }));
                                            validateFieldsEmpresas(empresa, selectedUserConta[0], setErrors, msgs);
                                        }}
                                        autoFocus={true}
                                        topLabel="CNPJ:"
                                        showTopLabel
                                        required
                                    />
                                </div>
                                <div className="col-12  lg:col-8 mt-1 ">
                                    <Input
                                        value={empresa.razao_social || ''}
                                        onChange={handleAllChanges}
                                        label="Razão Social"
                                        id="razao_social"
                                        hasError={!!errors.razao_social}
                                        errorMessage={errors.razao_social}
                                        topLabel="Razão Social:"
                                        showTopLabel
                                        required
                                    />
                                </div>
                                <div className="col-12  lg:col-6  mt-1">
                                    <Input
                                        value={empresa.nome_fantasia || ''}
                                        onChange={handleAllChanges}
                                        label="Nome Fantasia"
                                        id="nome_fantasia"
                                        hasError={!!errors.nome_fantasia}
                                        errorMessage={errors.nome_fantasia}
                                        topLabel="Nome Fantasia:"
                                        showTopLabel
                                        required
                                    />
                                </div>
                                <div className="col-12  lg:col-6 mt-1">
                                    <Input
                                        value={empresa.atividade_principal || ''}
                                        onChange={handleAllChanges}
                                        label="Atividade Principal"
                                        id="atividade_principal"
                                        hasError={!!errors.atividade_principal}
                                        errorMessage={errors.atividade_principal}
                                        topLabel="Atividade Principal:"
                                        showTopLabel
                                        required
                                    />
                                </div>
                                <div className="col-12  lg:col-4 mt-1">
                                    <div className="p-field">
                                        <Input
                                            value={empresa.inscricao_estadual || ''}
                                            onChange={handleAllChanges}
                                            label="Inscrição Estadual"
                                            id="inscricao_estadual"
                                            type="number"
                                            hasError={!!errors.inscricao_estadual}
                                            errorMessage={errors.inscricao_estadual}
                                            topLabel="Inscrição Estadual:"
                                            showTopLabel
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-12  lg:col-4 mt-1">
                                    <Input
                                        value={empresa.inscricao_municipal || ''}
                                        onChange={handleAllChanges}
                                        label="Inscrição Municipal"
                                        id="inscricao_municipal"
                                        type="number"
                                        hasError={!!errors.inscricao_municipal}
                                        errorMessage={errors.inscricao_municipal}
                                        topLabel="Inscrição Municipal:"
                                        showTopLabel
                                        required
                                    />
                                </div>
                                <div className="col-12  lg:col-4 mt-1">
                                    <div className="p-field">
                                        <Dropdown
                                            id="codigo_regime_tributario"
                                            value={empresa.codigo_regime_tributario ?? ''}
                                            options={regimeTributarioOptions}
                                            onChange={handleDropdownChange}
                                            label="Selecione um Regime Tributário"
                                            hasError={!!errors.selectedRegime}
                                            errorMessage={errors.selectedRegime}
                                            topLabel="Código Regime Tributário:"
                                            showTopLabel
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {isDesktop && (
                            <div className="image-upload-containerDeskTop">
                                {empresa.logo_empresa ? (
                                    <>
                                        <img src={empresa.logo_empresa} alt="Logo da Empresa" className="img-cover" style={{ borderRadius: '7px' }} />
                                        <Button icon="pi pi-trash" rounded text severity="danger" aria-label="Delete" onClick={handleDeleteClick} className="button-Imagem-Logo-top-right" />
                                    </>
                                ) : (
                                    <>
                                        <Button icon="pi pi-upload" rounded text severity="success" aria-label="Search" onClick={handleIconClick} className="button-Imagem-Logo-top-right" />
                                        <div className="flex-Img-Logo-center">
                                            <i className="pi pi-images image-icon"></i>
                                        </div>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChangeLogo} />
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <EnderecoForm
                        endereco={empresa.endereco}
                        telefone={empresa.telefone}
                        errors={errors}
                        onChange={handleAllChanges}
                        onCepSearch={() => handleSearchCep(empresa.endereco?.cep || '', setLoadingCep, setEmpresa, setError, msgs)}
                        onDropdownChange={handleDropdownChange}
                        onDropdownChangeEndereco={handleDropdownChangeEnderco}
                        getCitiesFromState={getCitiesFromState}
                        loadingCep={loadingCep}
                    />
                    <Divider align="center" className="form-divider">
                        <span>Acesso a Empresa</span>
                    </Divider>

                    <div className="grid formgrid">
                        <div className="col-12 mb-1 lg:col-6 lg:mb-0">
                            <div className="p-field">
                                <CustomMultiSelect
                                    id={''}
                                    selectedItems={selectedUserConta}
                                    onChange={handleUserChange}
                                    fetchAllItems={fetchUserConta}
                                    fetchFilteredItems={fetchFilteredUserConta}
                                    options={userConta}
                                    hasError={!!errors.selectedUserConta}
                                    errorMessage={errors.selectedUserConta}
                                    optionLabel="nome"
                                    placeholder={'Selecione os Usuários'}
                                    showChips={true}
                                    topLabel="Usuários:"
                                    showTopLabel
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <Divider align="center" className="form-divider">
                        <span> Configuração da Nota Fiscal Eletrônica de Serviços (NFSe)</span>
                    </Divider>
                    <div className="grid formgrid">
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Input
                                value={empresa.serie_emissao_nfse ?? ''}
                                onChange={handleAllChanges}
                                label="Série"
                                id="serie_emissao_nfse"
                                hasError={!!errors.serie_emissao_nfse}
                                errorMessage={errors.serie_emissao_nfse}
                                topLabel=" Série:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Input
                                value={String(empresa.proximo_numero_rps ?? '')}
                                onChange={handleAllChanges}
                                label="Número RPS"
                                id="proximo_numero_rps"
                                hasError={!!errors.proximo_numero_rps}
                                errorMessage={errors.proximo_numero_rps}
                                topLabel=" Proximo número RPS:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Input
                                value={String(empresa.proximo_numero_lote ?? '')}
                                onChange={handleAllChanges}
                                label="Próximo número do lote na NFSe"
                                id="proximo_numero_lote"
                                hasError={!!errors.proximo_numero_lote}
                                errorMessage={errors.proximo_numero_lote}
                                topLabel="Próximo número lote NFSe:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Dropdown
                                id="tipo_rps"
                                value={empresa.tipo_rps ?? ''}
                                options={tipo_rps}
                                onChange={handleDropdownChange}
                                label="Selecione o Tipo de RPS"
                                hasError={!!errors.tipo_rps}
                                errorMessage={errors.tipo_rps}
                                topLabel="Tipo de RPS:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Input
                                value={empresa.aliquota_iss?.toString() ?? 0}
                                onChange={handleAllChanges}
                                label="Alíquota ISS"
                                id="aliquota_iss"
                                type="number"
                                hasError={!!errors.aliquota_iss}
                                errorMessage={errors.aliquota_iss}
                                topLabel="Alíquota ISS:"
                                showTopLabel
                                required
                                iconLeft={<IconPorcentagem isDarkMode={false} />}
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <CustomInputNumber
                                id="aliquota_pis"
                                value={empresa.aliquota_pis || 0}
                                onChange={handleNumberChange}
                                label="Alíquota PIS"
                                useRightButton={true}
                                outlined={true}
                                hasError={!!errors.aliquota_pis}
                                errorMessage={errors.aliquota_pis}
                                topLabel="Alíquota PIS:"
                                showTopLabel
                                required
                                iconLeft={<IconPorcentagem isDarkMode={false} />}
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <CustomInputNumber
                                id="aliquota_cofins"
                                value={empresa.aliquota_cofins || 0}
                                onChange={handleNumberChange}
                                label="Alíquota COFINS"
                                useRightButton={true}
                                outlined={true}
                                hasError={!!errors.aliquota_cofins}
                                errorMessage={errors.aliquota_cofins}
                                topLabel="Alíquota COFINS:"
                                showTopLabel
                                required
                                iconLeft={<IconPorcentagem isDarkMode={false} />}
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <CustomInputNumber
                                id="aliquota_inss"
                                value={empresa.aliquota_inss || ''}
                                onChange={handleNumberChange}
                                label="Alíquota INSS"
                                useRightButton={true}
                                outlined={true}
                                hasError={!!errors.aliquota_inss}
                                errorMessage={errors.aliquota_inss}
                                topLabel="Alíquota INSS:"
                                showTopLabel
                                required
                                iconLeft={<IconPorcentagem isDarkMode={false} />}
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <CustomInputNumber
                                id="aliquota_ir"
                                value={empresa.aliquota_ir || 0}
                                onChange={handleNumberChange}
                                label="Alíquota IR"
                                useRightButton={true}
                                outlined={true}
                                hasError={!!errors.aliquota_ir}
                                errorMessage={errors.aliquota_ir}
                                topLabel="Alíquota IR:"
                                showTopLabel
                                required
                                iconLeft={<IconPorcentagem isDarkMode={false} />}
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <CustomInputNumber
                                id="aliquota_csll"
                                value={empresa.aliquota_csll || 0}
                                onChange={handleNumberChange}
                                label="Alíquota CSLL"
                                useRightButton={true}
                                outlined={true}
                                hasError={!!errors.aliquota_csll}
                                errorMessage={errors.aliquota_csll}
                                topLabel="Alíquota CSLL:"
                                showTopLabel
                                required
                                iconLeft={<IconPorcentagem isDarkMode={false} />}
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Input
                                id="aliquota_outras_retencoes"
                                type="number"
                                value={empresa.aliquota_outras_retencoes ?? 0}
                                onChange={handleAllChanges}
                                label="Outras Retenções"
                                hasError={!!errors.aliquota_outras_retencoes}
                                errorMessage={errors.aliquota_outras_retencoes}
                                topLabel="Outras Retenções:"
                                showTopLabel
                                required
                                iconLeft={<IconPorcentagem isDarkMode={false} />}
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Input
                                id="aliquota_deducoes"
                                type="number"
                                value={empresa.aliquota_deducoes ?? 0}
                                onChange={handleAllChanges}
                                label="Alíquota Deduções"
                                hasError={!!errors.aliquota_deducoes}
                                errorMessage={errors.aliquota_deducoes}
                                topLabel=" Alíquota Deduções:"
                                showTopLabel
                                required
                                iconLeft={<IconPorcentagem isDarkMode={false} />}
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Input
                                id="percentual_desconto_incondicionado"
                                type="number"
                                value={empresa.percentual_desconto_incondicionado ?? 0}
                                onChange={handleAllChanges}
                                label="Desconto Incondicionado"
                                hasError={!!errors.percentual_desconto_incondicionado}
                                errorMessage={errors.percentual_desconto_incondicionado}
                                topLabel="Desconto Incondicionado:"
                                showTopLabel
                                required
                                iconLeft={<IconPorcentagem isDarkMode={false} />}
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Input
                                id="percentual_desconto_condicionado"
                                type="number"
                                value={empresa.percentual_desconto_condicionado ?? 0}
                                onChange={handleAllChanges}
                                label="Desconto Incondicionado"
                                hasError={!!errors.percentual_desconto_condicionado}
                                errorMessage={errors.percentual_desconto_condicionado}
                                topLabel="Desconto Condicionado:"
                                showTopLabel
                                required
                                iconLeft={<IconPorcentagem isDarkMode={false} />}
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <DropdownSearch<TableCNAEEntity>
                                id="cnae_fiscal"
                                selectedItem={selectedCNAE}
                                key={reloadKeyCNAE}
                                onItemChange={handleCNAEChange}
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
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Dropdown
                                id="prestacao_sus"
                                value={empresa.prestacao_sus ?? null}
                                options={prestacaoSus}
                                onChange={handleDropdownChange}
                                label="Selecione a Prestação SUS"
                                hasError={!!errors.prestacao_sus}
                                errorMessage={errors.prestacao_sus}
                                topLabel="Prestação SUS:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Dropdown
                                id="regime_especial_tributacao"
                                value={empresa.regime_especial_tributacao ?? ''}
                                options={regimeEspecialTributarioOptionsCompany}
                                onChange={handleDropdownChange}
                                label="Selecione um Regime Especial Tributário"
                                hasError={!!errors.regime_especial_tributacao}
                                errorMessage={errors.regime_especial_tributacao}
                                topLabel="Regime Especial Tributário:"
                                showTopLabel
                                required
                            />
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Dropdown
                                id="incentivo_fiscal"
                                value={empresa.incentivo_fiscal ?? null}
                                options={incentivoFiscal}
                                onChange={handleDropdownChange}
                                label="Selecione a incentivo Fiscal"
                                hasError={!!errors.incentivo_fiscal}
                                errorMessage={errors.incentivo_fiscal}
                                topLabel="Icentivo Fiscal:"
                                showTopLabel
                                required
                            />
                        </div>
                    </div>
                    <Divider align="center" className="form-divider">
                        <span> Certificado Digital</span>
                    </Divider>
                    <div className="grid formgrid">
                        <div className="col-12 mt-1 lg:col-3 ">
                            <label className="filter-label flex my-1 items-center">
                                Certificado Digital:
                                <Mandatory />
                            </label>
                            <Toast ref={toast}></Toast>
                            <div className="file-upload-container" style={{ display: 'flex', alignItems: 'center' }}>
                                <FileUpload
                                    ref={fileUploadRef}
                                    name="file"
                                    url="./upload"
                                    id="certificado_digital"
                                    customUpload
                                    chooseLabel={empresa.nome_certificado_digital || 'Upload Certificado A1'}
                                    mode="basic"
                                    disabled={loadingFileUpload}
                                    accept=".pfx,.p12,.cer,.crt,.cert"
                                    onSelect={handleFileChangeCertificado}
                                    onClear={() => {
                                        setEmpresa((prev) =>
                                            prev.copyWith({
                                                certificado_digital: '',
                                                nome_certificado_digital: '',
                                                data_vencimento_certificado_digital: ''
                                            })
                                        );
                                        setErrors((prev) => ({ ...prev, certificado_digital: '' }));
                                    }}
                                    className={`p-fileupload-basic w-full ${isDarkMode ? 'dark-mode' : 'light-mode'} ${errors.certificado_digital ? 'p-invalid' : ''}`}
                                    withCredentials={false}
                                />
                                {empresa.certificado_digital && <Button icon="pi pi-trash" outlined severity="danger" aria-label="Cancel" onClick={handleRemoveFile} style={{ width: '10%', marginLeft: '1rem' }} />}
                            </div>
                            {errors.certificado_digital && <small className="p-error">{errors.certificado_digital}</small>}
                        </div>
                        <div className="col-12 mt-1 lg:col-3 ">
                            <Input
                                value={empresa.senha_certificado_digital || ''}
                                onChange={handleAllChanges}
                                label="Senha"
                                id="senha_certificado_digital"
                                type={isPasswordVisible ? 'text' : 'password'}
                                useRightButton={true}
                                outlined={true}
                                iconLeft={'pi pi-key'}
                                iconRight={<IconVisible isPasswordVisible={isPasswordVisible} />}
                                onClick={togglePasswordVisibility}
                                hasError={!!errors.senha_certificado_digital}
                                errorMessage={errors.senha_certificado_digital}
                                topLabel="Senha:"
                                showTopLabel
                                required
                            />
                        </div>
                        {empresaId && (
                            <>
                                <div className="col-12 mb-1 lg:col-6 lg:mb-0">
                                    <Input
                                        value={empresa.data_vencimento_certificado_digital || ''}
                                        onChange={handleAllChanges}
                                        label=""
                                        id="data_vencimento_certificado_digital"
                                        useRightButton={true}
                                        outlined={true}
                                        readOnly={true}
                                        topLabel="Data vencimento Certificado:"
                                        showTopLabel
                                    />
                                </div>
                                <div className="col-12 mb-1 lg:col-6 lg:mb-0" style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="flex justify-center items-center col-12 mb-1 lg:col-12 lg:mb-0">
                                        <label className="mr-2" htmlFor="status">
                                            Status do Certificado Digital:
                                        </label>
                                        <Tag severity={empresa.status_certificado_digital?.toUpperCase() === 'EXPIRADO' ? 'danger' : 'success'} value={empresa.status_certificado_digital || ''} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="StyleContainer-btn-Created">
                {showBTNPGCreatedAll && (
                    <BTNPGCreatedAll
                        label="Salvar"
                        disabled={
                            stateDisableBtnCreatedCompany ||
                            Object.keys(errors).length > 0 ||
                            !empresa.cnpj ||
                            !empresa.razao_social ||
                            !empresa.nome_fantasia ||
                            !empresa.atividade_principal ||
                            !empresa.inscricao_municipal ||
                            !empresa.codigo_regime_tributario ||
                            !empresa.endereco ||
                            !empresa.serie_emissao_nfse ||
                            !empresa.proximo_numero_rps ||
                            !empresa.proximo_numero_lote ||
                            empresa.aliquota_iss === null ||
                            empresa.aliquota_iss === undefined ||
                            !empresa.cnae_fiscal ||
                            typeof empresa.prestacao_sus !== 'boolean' ||
                            !empresa.regime_especial_tributacao ||
                            typeof empresa.incentivo_fiscal !== 'boolean' ||
                            !empresa.tipo_rps ||
                            (!empresa.certificado_digital && !empresa.nome_certificado_digital) ||
                            !empresa.senha_certificado_digital ||
                            !selectedUserConta
                        }
                        onClick={handleSubmit}
                    />
                )}
                {showBTNPGCreatedDialog && (
                    <BTNPGCreatedDialog
                        label="Salvar"
                        disabled={
                            stateDisableBtnCreatedCompany ||
                            Object.keys(errors).length > 0 ||
                            !empresa.cnpj ||
                            !empresa.razao_social ||
                            !empresa.nome_fantasia ||
                            !empresa.atividade_principal ||
                            !empresa.inscricao_municipal ||
                            !empresa.codigo_regime_tributario ||
                            !empresa.endereco ||
                            !empresa.serie_emissao_nfse ||
                            !empresa.proximo_numero_rps ||
                            !empresa.proximo_numero_lote ||
                            empresa.aliquota_iss === null ||
                            empresa.aliquota_iss === undefined ||
                            !empresa.cnae_fiscal ||
                            typeof empresa.prestacao_sus !== 'boolean' ||
                            !empresa.regime_especial_tributacao ||
                            typeof empresa.incentivo_fiscal !== 'boolean' ||
                            !empresa.tipo_rps ||
                            (!empresa.certificado_digital && !empresa.nome_certificado_digital) ||
                            !empresa.senha_certificado_digital ||
                            !selectedUserConta
                        }
                        onClick={handleSubmit}
                        onBackClick={onBackClick}
                        onClose={onClose}
                    />
                )}
            </div>
        </>
    );
});
EmpresaForm.displayName = 'EmpresaForm';
export default EmpresaForm;

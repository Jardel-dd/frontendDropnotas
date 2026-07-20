'use client';
import { Toast } from 'primereact/toast';
import { EmpresaFields } from './empresa';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { MultiSelectChangeEvent } from 'primereact/multiselect';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { handleSearchCep } from '@/app/components/seachs/searchCep/controller';
import { handleSearchCNPJ } from '@/app/components/seachs/searchCnpj/controller';
import { fetchFilteredCnae, findCNAEByCodigo } from '@/app/components/fetchAll/listAllCnae/controller';
import { createEmptyUserConta } from '@/app/(main)/cadastro/usuarios/types/usuario';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import type {  EmpresaFormProps, EmpresaFormRef, FormEmpresaCreatedProps } from '../types/empresa';
import { validateFieldsEmpresas } from '@/app/(main)/configuracoes/empresas/controller/validation';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { FormCreatedUsuario, UsuarioFormRef } from '@/app/(main)/cadastro/usuarios/form/controller';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { convertCertificadoToBase64, convertLogoToBase64, createdEmpresa, fetchCompanyFormDataByID, updateEmpresa } from '@/app/(main)/configuracoes/empresas/controller/controller';
export type { EmpresaFieldsProps, EmpresaFormProps, EmpresaFormRef } from '../types/empresa';

const TELEFONE_OBRIGATORIO = true;
const EmpresaFormContainer = forwardRef<EmpresaFormRef, EmpresaFormProps>(
    (
        {
            initialId,
            preloadedEmpresa,
            msgs,
            onEmpresaChange,
            onErrorsChange,
            redirectAfterSave,
            onSaved,
            onClose,
            onLoadingChange,
            showBTNPGCreatedDialog,
            showBTNPGCreatedAll,
            onBackClick
        },
        ref
    ) => {
        const router = useRouter();
        const empresaId = initialId;
        const isMobile = useIsMobile();
        const isDesktop = useIsDesktop();
        const { isDarkMode } = useTheme();
        const toastRef = useRef<Toast>(null);
        const [loadingFileUpload] = useState(false);
        const formRef = useRef<UsuarioFormRef>(null);
        const fileUploadRef = useRef<FileUpload>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);
        const onEmpresaChangeRef = useRef(onEmpresaChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [isEditMode, setIsEditMode] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [empresa, setEmpresa] = useState<CompanyEntity>(
            new CompanyEntity({
                id: 0,
                id_usuarios_acesso: [],
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
        const [loadingCep, setLoadingCep] = useState(false);
        const [loadingCnpj, setLoadingCnpj] = useState(false);
        const [logoAlterada, setLogoAlterada] = useState(false);
        const [reloadKeyUserConta, setReloadKeyUserConta] = useState(0);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);
        const [showModalUserConta, setShowModalUserConta] = useState(false);
        const [editingUserContaId, setEditingUserContaId] = useState<string | null>(null);
        const [userConta, setUserConta] = useState<UsuarioContaEntity[]>([]);
        const [userContaForm, setUserContaForm] = useState<UsuarioContaEntity>(createEmptyUserConta());
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [selectedCNAE, setSelectedCNAE] = useState<TableCNAEEntity | null>(null);
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [selectedUserConta, setSelectedUserConta] = useState<UsuarioContaEntity[]>([]);
        const [stateDisableBtnCreatedCompany, setStateDisableBtnCreatedCompany] = useState(false);
        const hasExistingCertificate = Boolean(empresa.nome_certificado_digital);
        const hasNewCertificateUpload = Boolean(empresa.certificado_digital);
        const shouldRequireCertificatePassword = !isEditMode || hasNewCertificateUpload || !hasExistingCertificate;
        const validateEmpresaForm = (empresaAtual = empresa, selectedUser = selectedUserConta[0]) =>
            validateFieldsEmpresas(
                empresaAtual,
                selectedUser,
                setErrors,
                msgs,
                TELEFONE_OBRIGATORIO,
                shouldRequireCertificatePassword
            );
        const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
            const { id, value, checked, type } = event.target;
            let newValue = type === 'checkbox' || type === 'switch' ? checked : value;
            const numericFields = ['inscricao_estadual', 'inscricao_municipal'];

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
                'nome_pais'
            ];

            setEmpresa((prev) => {
                const empresaInstanciada = new CompanyEntity(prev);

                if (camposEndereco.includes(id)) {
                    return empresaInstanciada.copyWith({
                        endereco: {
                            ...empresaInstanciada.endereco,
                            [id]: newValue
                        }
                    });
                }

                return empresaInstanciada.copyWith({
                    [id]: newValue
                });
            });
        };
        const handleNumberChange = (event: InputNumberValueChangeEvent) => {
            const updatedEmpresa = empresa.copyWith({
                [event.target.id]: event.value ?? 0
            });

            setEmpresa(updatedEmpresa);
            setTouchedFields((prev) => ({
                ...prev,
                [event.target.id]: true
            }));
            validateEmpresaForm(updatedEmpresa);
        };
        const handleDropdownChangeEndereco = (event: DropdownChangeEvent) => {
            const updatedEndereco = {
                ...empresa.endereco,
                [event.target.id]: event.value
            };

            setEmpresa((prev) => prev.copyWith({ endereco: updatedEndereco }));
        };
        const handleDropdownChange = (event: DropdownChangeEvent) => {
            const updatedCompany = empresa.copyWith({
                [event.target.id]: event.value
            });

            setEmpresa(updatedCompany);
        };
        const handleCNAEChange = (cnae: TableCNAEEntity | null) => {
            setSelectedCNAE(cnae);

            const updatedEmpresa = empresa.copyWith({
                cnae_fiscal: cnae?.codigo || ''
            });

            setEmpresa(updatedEmpresa);
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.cnae_fiscal;
                return newErrors;
            });
        };
        const handleUserChange = (event: MultiSelectChangeEvent) => {
            const selected = event.value as UsuarioContaEntity[];
            const selectedIds = selected.map((user) => user.id);

            setSelectedUserConta(selected);
            handleAllChanges({
                target: { id: 'id_usuarios_acesso', value: selectedIds, type: 'input' }
            });
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedUserConta;
                return newErrors;
            });
        };
        const handleUserContaFormChange = (updatedUserConta: UsuarioContaEntity) => {
            setUserContaForm(updatedUserConta);
        };
        const openCreateUserContaDialog = () => {
            setEditingUserContaId(null);
            setUserContaForm(createEmptyUserConta());
            setShowModalUserConta(true);
        };
        const openEditUserContaDialog = (userContaSelecionado: UsuarioContaEntity) => {
            if (!userContaSelecionado?.id) {
                return;
            }

            setEditingUserContaId(String(userContaSelecionado.id));
            setShowModalUserConta(true);
        };
        const closeUserContaDialog = () => {
            setShowModalUserConta(false);
            setEditingUserContaId(null);
            setUserContaForm(createEmptyUserConta());
        };
        const handleFileChangeCertificado = (event: FileUploadSelectEvent) => {
            if (event.files && event.files.length > 0) {
                setErrors((prev) => ({ ...prev, certificado_digital: '' }));
                convertCertificadoToBase64(event.files as File[], setEmpresa, toastRef, msgs, () => {
                    validateEmpresaForm();
                });
            }
        };
        const handleClearCertificado = () => {
            setEmpresa((prev) =>
                prev.copyWith({
                    certificado_digital: '',
                    nome_certificado_digital: '',
                    data_vencimento_certificado_digital: '',
                    status_certificado_digital: '',
                    senha_certificado_digital: ''
                })
            );
            setErrors((prev) => ({
                ...prev,
                certificado_digital: '',
                senha_certificado_digital: ''
            }));
        };
        const handleRemoveFile = () => {
            setEmpresa((prev) =>
                prev.copyWith({
                    certificado_digital: '',
                    nome_certificado_digital: '',
                    data_vencimento_certificado_digital: '',
                    status_certificado_digital: '',
                    senha_certificado_digital: ''
                })
            );
            setErrors((prev) => ({
                ...prev,
                certificado_digital: '',
                senha_certificado_digital: ''
            }));
            fileUploadRef.current?.clear();
        };
        const handleUserContaSaved = (created: UsuarioContaEntity) => {
            const replaceOrAppendUser = (lista: UsuarioContaEntity[]) => {
                const existingIndex = lista.findIndex((user) => user.id === created.id);

                if (existingIndex === -1) {
                    return [...lista, created];
                }

                return lista.map((user) => (user.id === created.id ? created : user));
            };
            const updatedSelectedUsers = replaceOrAppendUser(selectedUserConta);

            closeUserContaDialog();
            setSelectedUserConta(updatedSelectedUsers);
            setUserConta((prevUsers) => {
                return replaceOrAppendUser(prevUsers);
            });
            handleAllChanges({
                target: { id: 'id_usuarios_acesso', value: updatedSelectedUsers.map((user) => user.id), type: 'input' }
            });
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedUserConta;
                return newErrors;
            });
            setUserContaForm(createEmptyUserConta());
            setReloadKeyUserConta((current) => current + 1);
        };
        const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
        };
        const handleFileChangeLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files && event.target.files.length > 0) {
                const files = Array.from(event.target.files);
                convertLogoToBase64(files, setEmpresa, toastRef, msgs);
                setLogoAlterada(true);
            }
        };
        const handleDeleteLogo = () => {
            setLogoAlterada(true);
            setEmpresa((prevEmpresa) =>
                prevEmpresa.copyWith({
                    ...prevEmpresa,
                    logo_empresa: ''
                })
            );
        };
        const handleTogglePasswordVisibility = () => {
            setIsPasswordVisible((prev) => !prev);
        };
        const handleValidateCnpj = () => {
            setTouchedFields((prev) => ({ ...prev, cnpj: true }));
            validateEmpresaForm();
        };
        const handleSearchEmpresaCnpj = async () => {
            setLoadingCnpj(true);
            const cnpjData = await handleSearchCNPJ(empresa?.cnpj ?? '', setEmpresa, setErrors, msgs, selectedUserConta);

            if (cnpjData?.cnae_fiscal) {
                const cnaeOptions = await fetchFilteredCnae(cnpjData.cnae_fiscal);
                setSelectedCNAE(findCNAEByCodigo(cnpjData.cnae_fiscal, cnaeOptions));
            } else {
                setSelectedCNAE(null);
            }

            setLoadingCnpj(false);
            setTouchedFields((prev) => ({ ...prev, cnpj: true }));
        };
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) event.preventDefault();
            msgs.current?.clear();

            if (isLoadingBtnCreated) return;

            setIsLoadingBtnCreated(true);

            try {
                const data = { ...empresa };

                if (data.cnpj) {
                    data.cnpj = data.cnpj.replace(/\D/g, '');
                }

                if (isEditMode && empresaId) {
                    const updated = await updateEmpresa(empresaId, data as CompanyEntity, selectedUserConta, logoAlterada, setErrors, msgs, router, redirectAfterSave ?? true);

                    if (updated) {
                        await onSaved?.(updated);
                        if (!onSaved) {
                            onClose?.();
                        }
                    }
                } else {
                    const created = await createdEmpresa(
                        data as CompanyEntity,
                        selectedUserConta,
                        setErrors,
                        msgs,
                        router,
                        setEmpresa as Dispatch<SetStateAction<Partial<CompanyEntity>>>,
                        setSelectedUserConta,
                        redirectAfterSave ?? true
                    );

                    if (created) {
                        await onSaved?.(created);
                        if (!onSaved) {
                            onClose?.();
                        }
                    }
                }
            } finally {
                setStateDisableBtnCreatedCompany(false);
                setIsLoadingBtnCreated(false);
            }
        };
        const listagemEmpresaID = async (currentEmpresaId: string) => {
            try {
                setIsLoading(true);
                const companyFormData = await fetchCompanyFormDataByID(currentEmpresaId);
                setEmpresa(companyFormData.empresa);
                setLogoAlterada(false);
                setUserConta(companyFormData.userConta);
                setSelectedUserConta(companyFormData.selectedUserConta);
                setSelectedCNAE(companyFormData.selectedCNAE);
            } finally {
                setIsLoading(false);
            }
        };
        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));
        useEffect(() => {
            onEmpresaChangeRef.current = onEmpresaChange;
        }, [onEmpresaChange]);
        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);
        useEffect(() => {
            if (empresaId) {
                setIsEditMode(true);

                if (preloadedEmpresa?.empresa?.id && String(preloadedEmpresa.empresa.id) === String(empresaId)) {
                    setEmpresa(preloadedEmpresa.empresa);
                    setLogoAlterada(false);
                    setUserConta(preloadedEmpresa.userConta);
                    setSelectedUserConta(preloadedEmpresa.selectedUserConta);
                    setSelectedCNAE(preloadedEmpresa.selectedCNAE);
                    setIsLoading(false);
                    return;
                }

                listagemEmpresaID(empresaId).finally(() => setIsLoading(false));
                return;
            }

            setIsEditMode(false);
            setIsLoading(false);
        }, [empresaId, preloadedEmpresa]);
        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validateFieldsEmpresas(
                    empresa,
                    selectedUserConta[0],
                    setErrors,
                    msgs,
                    TELEFONE_OBRIGATORIO,
                    shouldRequireCertificatePassword
                );
            }
        }, [empresa, selectedUserConta, touchedFields, msgs, shouldRequireCertificatePassword]);
        useEffect(() => {
            onEmpresaChangeRef.current?.(empresa);
        }, [empresa]);
        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);
        useEffect(() => {
            onLoadingChange?.(isLoading || isLoadingBtnCreated);
        }, [isLoading, isLoadingBtnCreated, onLoadingChange]);
        if (isLoading && empresaId) {
            return <LoadingScreen loadingText="Carregando informações da Empresa selecionada..." />;
        }
        const isDialogMode = Boolean(showBTNPGCreatedDialog || onClose || onBackClick);
        const hasValidUserContaSelection =
            selectedUserConta.length > 0 ||
            (Array.isArray(empresa.id_usuarios_acesso) && empresa.id_usuarios_acesso.some((id) => Number(id) > 0));
        const isSubmitDisabled =
            stateDisableBtnCreatedCompany ||
            Object.keys(errors).length > 0 ||
            !empresa.cnpj ||
            !empresa.razao_social ||
            !empresa.nome_fantasia ||
            !empresa.atividade_principal ||
            !empresa.inscricao_municipal ||
            !empresa.codigo_regime_tributario ||
            (TELEFONE_OBRIGATORIO && !empresa.telefone) ||
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
            (shouldRequireCertificatePassword && !empresa.senha_certificado_digital) ||
            !hasValidUserContaSelection;

        return (
            <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                <Messages ref={msgs} className="custom-messages" />
                <EmpresaFields
                    empresa={empresa}
                    empresaId={empresaId}
                    errors={errors}
                    loadingCnpj={loadingCnpj}
                    loadingCep={loadingCep}
                    loadingFileUpload={loadingFileUpload}
                    isMobile={isMobile}
                    isDesktop={isDesktop}
                    isDarkMode={isDarkMode}
                    isPasswordVisible={isPasswordVisible}
                    isCertificatePasswordRequired={shouldRequireCertificatePassword}
                    selectedCNAE={selectedCNAE}
                    userConta={userConta}
                    selectedUserConta={selectedUserConta}
                    toastRef={toastRef}
                    fileUploadRef={fileUploadRef}
                    fileInputRef={fileInputRef}
                    onChange={handleAllChanges}
                    onDropdownChange={handleDropdownChange}
                    onDropdownChangeEndereco={handleDropdownChangeEndereco}
                    onNumberChange={handleNumberChange}
                    onUserChange={handleUserChange}
                    onOpenUserContaModal={openCreateUserContaDialog}
                    onEditUserConta={openEditUserContaDialog}
                    onCNAEChange={handleCNAEChange}
                    onSearchCnpj={handleSearchEmpresaCnpj}
                    onValidateCnpj={handleValidateCnpj}
                    onLogoChange={handleFileChangeLogo}
                    onDeleteLogo={handleDeleteLogo}
                    onRemoveFile={handleRemoveFile}
                    onFileChangeCertificado={handleFileChangeCertificado}
                    onClearCertificado={handleClearCertificado}
                    onTogglePasswordVisibility={handleTogglePasswordVisibility}
                    onCepSearch={() => handleSearchCep(empresa.endereco?.cep || '', setLoadingCep, setEmpresa, setError, msgs)}
                />
                <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                    {showBTNPGCreatedAll && (
                        <BTNPGCreatedAll
                            label="Salvar"
                            disabled={isSubmitDisabled || isLoadingBtnCreated}
                            onClick={handleSubmit}
                            icon="pi pi-save"
                        />
                    )}
                    {showBTNPGCreatedDialog && (
                        <BTNPGCreatedDialog
                            label="Salvar"
                            disabled={isSubmitDisabled || isLoadingBtnCreated}
                            onClick={handleSubmit}
                            onBackClick={onBackClick}
                            onClose={onClose}
                            icon="pi pi-save"
                        />
                    )}
                </div>
                 <DialogFilter header={editingUserContaId ? 'Editar Usuários' : 'Adicionar Usuários'} visible={showModalUserConta} onHide={closeUserContaDialog}>
                        <FormCreatedUsuario
                            key={`${editingUserContaId ?? 'novo'}-${reloadKeyUserConta}`}
                            msgs={msgs}
                            ref={formRef}
                            userConta={userContaForm}
                            initialId={editingUserContaId}
                            setUserConta={setUserContaForm}
                            onUserContaChange={handleUserContaFormChange}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            showBTNPGCreatedDialog={true}
                            onSaved={handleUserContaSaved}
                            onClose={closeUserContaDialog}
                            onBackClick={closeUserContaDialog}
                        />
                    </DialogFilter>
            </div>
            
        );
    }
);
EmpresaFormContainer.displayName = 'EmpresaFormContainer';
function isEmpresaFormProps(props: FormEmpresaCreatedProps): props is EmpresaFormProps {
    return 'msgs' in props;
}
export const FormEmpresaCreated = forwardRef<EmpresaFormRef, FormEmpresaCreatedProps>((props, ref) => {
    if (isEmpresaFormProps(props)) {
        return <EmpresaFormContainer {...props} ref={ref} />;
    }

    return <EmpresaFields {...props} />;
});
FormEmpresaCreated.displayName = 'FormEmpresaCreated';

export default FormEmpresaCreated;

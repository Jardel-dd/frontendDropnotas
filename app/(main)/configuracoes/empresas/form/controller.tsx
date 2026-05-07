'use client';
import { Toast } from 'primereact/toast';
import { EmpresaFields } from './empresa';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { MultiSelectChangeEvent } from 'primereact/multiselect';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload';
import { handleSearchCep } from '@/app/components/seachs/searchCep/controller';
import { handleSearchCNPJ } from '@/app/components/seachs/searchCnpj/controller';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import type {  EmpresaFormProps, EmpresaFormRef, FormEmpresaCreatedProps } from '../types/empresa';
import { validateFieldsEmpresas } from '@/app/(main)/configuracoes/empresas/controller/validation';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { convertCertificadoToBase64, convertLogoToBase64, createdEmpresa, fetchCompanyByID, resolveLogoEmpresaSource, updateEmpresa } from '@/app/(main)/configuracoes/empresas/controller/controller';
import { FormCreatedUsuario, UsuarioFormRef } from '@/app/(main)/cadastro/usuarios/form/controller';
import { createEmptyUserConta } from '@/app/(main)/cadastro/usuarios/types/usuario';

export type { EmpresaFieldsProps, EmpresaFormProps, EmpresaFormRef } from '../types/empresa';

const EmpresaFormContainer = forwardRef<EmpresaFormRef, EmpresaFormProps>(
    (
        {
            initialId,
            msgs,
            onEmpresaChange,
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
        const [loadingCep, setLoadingCep] = useState(false);
        const [loadingCnpj, setLoadingCnpj] = useState(false);
        const [logoAlterada, setLogoAlterada] = useState(false);
        const [reloadKeyUserConta, setReloadKeyUserConta] = useState(0);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);
        const [showModalUserConta, setShowModalUserConta] = useState(false);
        const [userConta, setUserConta] = useState<UsuarioContaEntity[]>([]);
        const [userContaForm, setUserContaForm] = useState<UsuarioContaEntity>(createEmptyUserConta());
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [selectedCNAE, setSelectedCNAE] = useState<TableCNAEEntity | null>(null);
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [selectedUserConta, setSelectedUserConta] = useState<UsuarioContaEntity[]>([]);
        const [stateDisableBtnCreatedCompany, setStateDisableBtnCreatedCompany] = useState(false);
        const validateEmpresaForm = (empresaAtual = empresa, selectedUser = selectedUserConta[0]) => validateFieldsEmpresas(empresaAtual, selectedUser, setErrors, msgs);
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
                    data_vencimento_certificado_digital: ''
                })
            );
            setErrors((prev) => ({ ...prev, certificado_digital: '' }));
        };
        const handleRemoveFile = () => {
            setEmpresa((prev) => prev.copyWith({ certificado_digital: '' }));
            setErrors((prev) => ({ ...prev, certificado_digital: '' }));
            fileUploadRef.current?.clear();
        };
        const handleUserContaSaved = (created: UsuarioContaEntity) => {
            const userAlreadyExists = selectedUserConta.some((user) => user.id === created.id);
            const updatedSelectedUsers = userAlreadyExists ? selectedUserConta : [...selectedUserConta, created];

            setShowModalUserConta(false);
            setSelectedUserConta(updatedSelectedUsers);
            setUserConta((prevUsers) => {
                const existsInOptions = prevUsers.some((user) => user.id === created.id);
                return existsInOptions ? prevUsers : [...prevUsers, created];
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
            await handleSearchCNPJ(empresa?.cnpj ?? '', setEmpresa, setErrors, msgs, selectedUserConta);
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
                        onSaved?.(updated);
                        onClose?.();
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
                        onSaved?.(created);
                        onClose?.();
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
                const { empresa, userConta, selectedUserConta } = await fetchCompanyByID(currentEmpresaId);
                const logoEmpresaSource = await resolveLogoEmpresaSource(empresa.logo_empresa);
                const empresaNormalizada = new CompanyEntity({
                    ...empresa,
                    logo_empresa: logoEmpresaSource,
                    aliquota_outras_retencoes: empresa.aliquota_outras_retencoes ?? 0,
                    aliquota_deducoes: empresa.aliquota_deducoes ?? 0,
                    percentual_desconto_incondicionado: empresa.percentual_desconto_incondicionado ?? 0,
                    percentual_desconto_condicionado: empresa.percentual_desconto_condicionado ?? 0
                });

                setEmpresa(empresaNormalizada);
                setLogoAlterada(false);
                setUserConta(userConta);
                setSelectedUserConta(selectedUserConta);
                setSelectedCNAE(null);
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
                listagemEmpresaID(empresaId).finally(() => setIsLoading(false));
                return;
            }

            setIsLoading(false);
        }, [empresaId]);
        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validateFieldsEmpresas(empresa, selectedUserConta[0], setErrors, msgs);
            }
        }, [empresa, selectedUserConta, touchedFields, msgs]);
        useEffect(() => {
            onEmpresaChangeRef.current?.(empresa);
        }, [empresa]);
        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);
        if (isLoading && empresaId) {
            return <LoadingScreen loadingText="Carregando informações da Empresa selecionada..." />;
        }
        const isDialogMode = Boolean(showBTNPGCreatedDialog || onClose || onBackClick);
        const isSubmitDisabled =
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
            !selectedUserConta;

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
                    onOpenUserContaModal={() => setShowModalUserConta(true)}
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
                        />
                    )}
                    {showBTNPGCreatedDialog && (
                        <BTNPGCreatedDialog
                            label="Salvar"
                            disabled={isSubmitDisabled || isLoadingBtnCreated}
                            onClick={handleSubmit}
                            onBackClick={onBackClick}
                            onClose={onClose}
                        />
                    )}
                </div>
                 <DialogFilter header="Adicionar Usuários" visible={showModalUserConta} onHide={() => setShowModalUserConta(false)}>
                        <FormCreatedUsuario
                            key={reloadKeyUserConta}
                            msgs={msgs}
                            ref={formRef}
                            userConta={userContaForm}
                            initialId={null}
                            setUserConta={setUserContaForm}
                            onUserContaChange={handleUserContaFormChange}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            showBTNPGCreatedDialog={true}
                            onSaved={handleUserContaSaved}
                            onClose={() => setShowModalUserConta(false)}
                            onBackClick={() => setShowModalUserConta(false)}
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

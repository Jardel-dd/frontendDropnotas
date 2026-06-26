'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { UsuarioFields } from './usuario';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import Input from '@/app/shared/include/input/input-all';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { MultiSelectChangeEvent } from 'primereact/multiselect';
import { validateEmail } from '@/app/utils/validateForms/validateEmail';
import { validateFieldsUserConta } from '../controller/validation';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { EmpresaFormRef } from '@/app/(main)/configuracoes/empresas/types/empresa';
import FormPermissoesCreated from '@/app/(main)/cadastro/permissoes/form/controller';
import FormEmpresaCreated from '@/app/(main)/configuracoes/empresas/form/controller';
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { PermissoesFormRef } from '@/app/(main)/cadastro/permissoes/types/perfilUsuario';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { alterarEmailUsuario, convertProfileUserToBase64, createUsuario, fetchUserContaCreated, updateUsuario } from '../controller/controller';
import {createEmptyEmpresaUsuario,createEmptyPerfilUsuario,createEmptyUserConta,FormCreatedUsuarioProps,UsuarioFormProps,UsuarioFormRef} from '../types/usuario';
export type { UsuarioFieldsProps, UsuarioFormProps, UsuarioFormRef } from '../types/usuario';

export const UsuarioFormContainer = forwardRef<UsuarioFormRef, UsuarioFormProps>(
    ({ initialId, msgs, onUserContaChange,
         onErrorsChange, onSaved, onClose, showBTNPGCreatedDialog, 
         showBTNPGCreatedAll, onBackClick }, ref) => {
        const router = useRouter();
        const userContaID = initialId;
        const toast = useRef<Toast>(null);
        const empresaFormRef = useRef<EmpresaFormRef>(null);
        const permissoesFormRef = useRef<PermissoesFormRef>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);
        const onUserContaChangeRef = useRef(onUserContaChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
        const [isLoading, setIsLoading] = useState(true);
        const [isEditMode, setIsEditMode] = useState(false);
        const [empresa, setEmpresa] = useState<CompanyEntity>(createEmptyEmpresaUsuario());
        const [perfilUser, setPerfilUser] = useState<PerfilUser>(createEmptyPerfilUsuario());
        const [userConta, setUserConta] = useState<UsuarioContaEntity>(createEmptyUserConta());
        const [empresasOptions, setEmpresasOptions] = useState<CompanyEntity[]>([]);
        const [reloadKeyPerfilUser, setReloadKeyPerfilUser] = useState(0);
        const [showModalEmpresa, setShowModalEmpresa] = useState(false);
        const [showModalPerfilUser, setShowModalPerfilUser] = useState(false);
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);
        const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
        const [confirmPassword, setConfirmPassword] = useState('');
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity[]>([]);
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [selectedPerfilUser, setSelectedPerfilUser] = useState<PerfilUser | null>(null);
        const [stateDisableBtnCreatedUserConta, setStateDisableBtnCreatedUserConta] = useState(false);
        const [showChangeEmailDialog, setShowChangeEmailDialog] = useState(false);
        const [newEmail, setNewEmail] = useState('');
        const [changeEmailError, setChangeEmailError] = useState('');
        const [isChangingEmail, setIsChangingEmail] = useState(false);

        const validateUsuarioForm = (
            nextUserConta = userConta,
            nextConfirmPassword = confirmPassword,
            nextPerfilUser = selectedPerfilUser,
            nextSelectedEmpresa = selectedEmpresa
        ) => validateFieldsUserConta(nextUserConta, nextConfirmPassword, nextPerfilUser, nextSelectedEmpresa, setErrors, msgs, userContaID ?? undefined);

        const clearError = (field: string) => {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[field];
                return newErrors;
            });
        };

        const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
            const { id, type, checked, value } = event.target;
            const newValue = type === 'checkbox' || type === 'switch' ? checked : value;

            setUserConta((prev) => prev.copyWith({ [id]: newValue }));
        };

        const handlePerfilUserSaved = (created: PerfilUser) => {
            setShowModalPerfilUser(false);
            setPerfilUser(created);
            setSelectedPerfilUser(created);
            clearError('selectedPerfilUser');
            setReloadKeyPerfilUser((prev) => prev + 1);
        };

        const handleCompanyChange = (event: MultiSelectChangeEvent) => {
            const selected = event.value as CompanyEntity[];
            const selectedIds = selected.map((company) => company.id);

            setSelectedEmpresa(selected);
            handleAllChanges({
                target: { id: 'id_empresas_acesso', value: selectedIds, type: 'input' }
            });
            clearError('selectedEmpresa');
        };

        const handlePerfilUserChange = (nextPerfilUser: PerfilUser | null) => {
            setSelectedPerfilUser(nextPerfilUser);
            clearError('selectedPerfilUser');
        };

        const handlePerfilUser = (updatedPerfilUser: PerfilUser) => {
            setPerfilUser(updatedPerfilUser);
        };

        const handleEmpresa = (updatedEmpresa: CompanyEntity) => {
            setEmpresa(updatedEmpresa);
        };

        const handleErrorsChange = (updatedErrors: Record<string, string>) => {
            setErrors(updatedErrors);
        };

        const handleFileChangeLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files) {
                const files = Array.from(event.target.files);
                convertProfileUserToBase64(files, setUserConta, toast, msgs);
            }
        };

        const validatePasswordConfirmation = (value = confirmPassword) => {
            if (value !== userConta.senha) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    confirmPassword: 'Este campo não coincide com a senha, por favor, verifique.'
                }));
                return;
            }

            clearError('confirmPassword');
        };

        const handleConfirmPasswordChange = (value: string) => {
            setConfirmPassword(value);
            setTouchedFields((prev) => ({ ...prev, confirmPassword: true }));
            validatePasswordConfirmation(value);
        };

        const togglePasswordVisibility = () => {
            setIsPasswordVisible((prev) => !prev);
            setIsConfirmPasswordVisible((prev) => !prev);
        };

        const handleTriggerProfileImageUpload = () => {
            fileInputRef.current?.click();
        };

        const handleEmpresaSaved = (created: CompanyEntity) => {
            setShowModalEmpresa(false);
            setSelectedEmpresa((prev) => {
                const updatedCompanies = [...prev, created];
                handleAllChanges({
                    target: {
                        id: 'id_empresas_acesso',
                        value: updatedCompanies.map((company) => company.id),
                        type: 'input'
                    }
                });
                return updatedCompanies;
            });
            setEmpresasOptions((prev) => [...prev, created]);
            clearError('selectedEmpresa');
        };

        const handleOpenChangeEmailDialog = () => {
            if (!userContaID) {
                return;
            }

            setNewEmail(userConta.email || '');
            setChangeEmailError('');
            setShowChangeEmailDialog(true);
        };

        const handleCloseChangeEmailDialog = (force = false) => {
            if (isChangingEmail && !force) {
                return;
            }

            setShowChangeEmailDialog(false);
            setNewEmail('');
            setChangeEmailError('');
        };

        const handleChangeEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
            setNewEmail(event.target.value);

            if (changeEmailError) {
                setChangeEmailError('');
            }
        };

        const handleChangeEmailSubmit = async () => {
            if (!userContaID) {
                return;
            }

            const normalizedEmail = newEmail.trim();

            if (!normalizedEmail) {
                setChangeEmailError('Informe o novo e-mail.');
                return;
            }

            if (!validateEmail(normalizedEmail)) {
                setChangeEmailError('Email inválido. Por favor, digite um email válido.');
                return;
            }

            if (normalizedEmail === (userConta.email || '').trim()) {
                setChangeEmailError('Informe um e-mail diferente do atual.');
                return;
            }

            setIsChangingEmail(true);

            try {
                const changed = await alterarEmailUsuario(userContaID, normalizedEmail, msgs);

                if (!changed) {
                    return;
                }

                setUserConta((prev) => prev.copyWith({ email: normalizedEmail }));
                handleCloseChangeEmailDialog(true);
            } finally {
                setIsChangingEmail(false);
            }
        };

        const handleSubmit = async (event?: React.FormEvent) => {
            try {
                if (isEditMode && userContaID) {
                    await updateUsuario(userContaID, userConta, confirmPassword, selectedEmpresa, selectedPerfilUser, setErrors, msgs, router, setUserConta, setSelectedEmpresa, setSelectedPerfilUser);
                    onSaved?.(userConta);
                    onClose?.();
                    return;
                }

                await createUsuario(userConta, selectedEmpresa, selectedPerfilUser, setErrors, msgs, router, setUserConta, setSelectedEmpresa, setSelectedPerfilUser);
                onSaved?.(userConta);
                onClose?.();
            } finally {
                setIsLoadingBtnCreated(false);
                setStateDisableBtnCreatedUserConta(false);
            }
        };

        const listagemUserID = async (currentUserContaID: string) => {
            try {
                setIsLoading(true);
                const { userConta, empresa, perfilUser, empresaList, selectedEmpresa } = await fetchUserContaCreated(currentUserContaID);
                setUserConta(new UsuarioContaEntity(userConta));
                setPerfilUser(perfilUser);
                setEmpresa(empresa);
                setEmpresasOptions(empresaList);
                setSelectedEmpresa(selectedEmpresa);
                setSelectedPerfilUser(perfilUser?.id ? perfilUser : null);
            } finally {
                setIsLoading(false);
            }
        };

        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));

        useEffect(() => {
            onUserContaChangeRef.current = onUserContaChange;
        }, [onUserContaChange]);

        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);

        useEffect(() => {
            if (userContaID) {
                setIsEditMode(true);
                listagemUserID(userContaID).finally(() => setIsLoading(false));
                return;
            }

            setSelectedPerfilUser(null);
            setSelectedEmpresa([]);
            setIsLoading(false);
        }, [userContaID]);

        useEffect(() => {
            if (Object.values(touchedFields).some(Boolean)) {
                validateFieldsUserConta(userConta, confirmPassword, selectedPerfilUser, selectedEmpresa, setErrors, msgs, userContaID ?? undefined);
            }
        }, [userConta, confirmPassword, selectedPerfilUser, selectedEmpresa, touchedFields, msgs, userContaID]);

        useEffect(() => {
            onUserContaChangeRef.current?.(userConta);
        }, [userConta]);

        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);

        if (isLoading && userContaID) {
            return <LoadingScreen loadingText="Carregando informações do usuário selecionado..." />;
        }

        const hasSelectedEmpresa = selectedEmpresa.length > 0 || (userConta.id_empresas_acesso?.length ?? 0) > 0;
        const isDialogMode = Boolean(showBTNPGCreatedDialog || onClose || onBackClick);
        // const isSubmitDisabled =
        //     stateDisableBtnCreatedUserConta ||
        //     isLoadingBtnCreated ||
        //     Object.keys(errors).length > 0 ||
        //     !userConta.nome?.trim() ||
        //     !hasSelectedEmpresa;

        return (
            <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container shared-form-content">
                    <div className="custom-flex-col">
                        <UsuarioFields
                            userConta={userConta}
                            userContaID={userContaID}
                            confirmPassword={confirmPassword}
                            errors={errors}
                            isPasswordVisible={isPasswordVisible}
                            isConfirmPasswordVisible={isConfirmPasswordVisible}
                            selectedPerfilUser={selectedPerfilUser}
                            selectedEmpresa={selectedEmpresa}
                            empresasOptions={empresasOptions}
                            reloadKeyPerfilUser={reloadKeyPerfilUser}
                            fileInputRef={fileInputRef}
                            onChange={handleAllChanges}
                            onConfirmPasswordChange={handleConfirmPasswordChange}
                            onValidateConfirmPassword={() => validateUsuarioForm()}
                            onValidateNome={() => {
                                setTouchedFields((prev) => ({ ...prev, nome: true }));
                                validateUsuarioForm();
                            }}
                            onPerfilUserChange={handlePerfilUserChange}
                            onCompanyChange={handleCompanyChange}
                            onFileChangeLogo={handleFileChangeLogo}
                            onTogglePasswordVisibility={togglePasswordVisibility}
                            onTriggerProfileImageUpload={handleTriggerProfileImageUpload}
                            onOpenPerfilUserModal={() => setShowModalPerfilUser(true)}
                            onOpenEmpresaModal={() => setShowModalEmpresa(true)}
                            onOpenChangeEmailModal={handleOpenChangeEmailDialog}
                        />
                    </div>
                </div>
                <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                    {showBTNPGCreatedAll && <BTNPGCreatedAll onClick={handleSubmit} label="Salvar" icon="pi pi-save" disabled={false}/>}
                    {showBTNPGCreatedDialog && <BTNPGCreatedDialog onClick={handleSubmit} label="Salvar" onBackClick={onBackClick} onClose={onClose} icon="pi pi-save" disabled={false}/>}
                </div>

                <DialogFilter
                    header="Alterar E-mail"
                    visible={showChangeEmailDialog}
                    onHide={() => handleCloseChangeEmailDialog()}
                    onSave={handleChangeEmailSubmit}
                    onCancel={() => handleCloseChangeEmailDialog()}
                    showSaveButton
                    showCancelButton
                    saveLabel="Alterar"
                    cancelLabel="Cancelar"
                    saveDisabled={isChangingEmail || !newEmail.trim()}
                    cancelDisabled={isChangingEmail}
                    loading={isChangingEmail}
                    loadingText="Alterando e-mail..."
                    width="32rem"
                    breakpoints={{ '960px': '90vw', '640px': '95vw' }}
                >
                    <div className="grid formgrid">
                        <div className="col-12">
                            <Input
                                id="novo_email"
                                value={newEmail}
                                onChange={handleChangeEmailInput}
                                label="Digite o novo E-mail"
                                type="email"
                                hasError={!!changeEmailError}
                                errorMessage={changeEmailError}
                                iconLeft="pi pi-at"
                                topLabel="Novo E-mail:"
                                showTopLabel
                                autoFocus
                                required
                            />
                        </div>
                    </div>
                </DialogFilter>

                <DialogFilter header="Adicionar Perfil deste Usuário" visible={showModalPerfilUser} onHide={() => setShowModalPerfilUser(false)}>
                    <FormPermissoesCreated
                        msgs={msgs}
                        ref={permissoesFormRef}
                        perfilUser={perfilUser}
                        initialId={null}
                        setPerfilUser={setPerfilUser}
                        onPerfilUserChange={handlePerfilUser}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handlePerfilUserSaved}
                        onClose={() => setShowModalPerfilUser(false)}
                        showBTNPGCreatedDialog={true}
                        onBackClick={() => setShowModalPerfilUser(false)}
                    />
                </DialogFilter>

                <DialogFilter header="Adicionar Empresa" visible={showModalEmpresa} onHide={() => setShowModalEmpresa(false)}>
                    <FormEmpresaCreated
                        msgs={msgs}
                        ref={empresaFormRef}
                        empresa={empresa}
                        initialId={null}
                        setEmpresa={setEmpresa}
                        onEmpresaChange={handleEmpresa}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        showBTNPGCreatedAll={true}
                        onSaved={handleEmpresaSaved}
                        onClose={() => setShowModalEmpresa(false)}
                        onBackClick={() => setShowModalEmpresa(false)}
                    />
                </DialogFilter>
            </div>
        );
    }
);
UsuarioFormContainer.displayName = 'UsuarioFormContainer';
function isUsuarioFormProps(props: FormCreatedUsuarioProps): props is UsuarioFormProps {
    return 'msgs' in props;
}
export const FormCreatedUsuario = forwardRef<UsuarioFormRef, FormCreatedUsuarioProps>((props, ref) => {
    if (isUsuarioFormProps(props)) {
        return <UsuarioFormContainer {...props} ref={ref} />;
    }

    return <UsuarioFields {...props} />;
});
FormCreatedUsuario.displayName = 'FormCreatedUsuario';

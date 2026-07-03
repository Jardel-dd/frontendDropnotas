'use client';
import '@/app/styles/styledGlobal.css';
import { Button } from 'primereact/button';
import IconVisible from '@/app/shared/IconVisible';
import Input from '@/app/shared/include/input/input-all';
import type { UsuarioFieldsProps } from '../types/usuario';
import CustomMultiSelect from '@/app/shared/include/multSelect/Input';
import PerfilUserDropdownField from '../../permissoes/dropdown/perfilUsuario';
export type { UsuarioFieldsProps, UsuarioFormProps, UsuarioFormRef } from '../types/usuario';
import { fetchFilteredEmpresa, listTheEmpresa } from '@/app/(main)/configuracoes/empresas/controller/controller';

export function UsuarioFields({
    userConta,
    userContaID,
    confirmPassword,
    errors,
    isPasswordVisible,
    isConfirmPasswordVisible,
    selectedPerfilUser,
    selectedEmpresa,
    empresasOptions,
    reloadKeyPerfilUser,
    fileInputRef,
    onChange,
    onConfirmPasswordChange,
    onValidateConfirmPassword,
    onValidateNome,
    onPerfilUserChange,
    onCompanyChange,
    onFileChangeLogo,
    onTogglePasswordVisibility,
    onTriggerProfileImageUpload,
    onOpenPerfilUserModal,
    onOpenEmpresaModal,
    onOpenChangeEmailModal
}: UsuarioFieldsProps) {
    return (
        <div className="grid formgrid">
            <div className="col-12">
                <div className="centered-container">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div
                            className="image-upload-containerDeskTopFotoUserConta"
                            onClick={onTriggerProfileImageUpload}
                            style={{
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '130px',
                                height: '130px',
                                borderRadius: '50%',
                                overflow: 'hidden'
                            }}
                        >
                            {userConta.foto_perfil ? (
                                <img
                                    src={userConta.foto_perfil.startsWith('data:image') ? userConta.foto_perfil : userConta.foto_perfil}
                                    alt="Foto de perfil"
                                    className="img-cover"
                                />
                            ) : (
                                <i className="pi pi-images custom-textUser"></i>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" style={{ display: 'none' }} onChange={onFileChangeLogo} />
                        <div style={{ marginTop: '0.5rem' }}>
                            <Button type="button" style={{ height: '2rem', width: '100%' }} label="Trocar Foto" severity="secondary" outlined onClick={onTriggerProfileImageUpload} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12">
                <Input
                    id="nome"
                    value={userConta.nome || ''}
                    onChange={onChange}
                    label="Digite o Nome"
                    icon="pi pi-user"
                    useRightButton
                    outlined
                    iconLeft="pi pi-user"
                    hasError={!!errors.nome}
                    errorMessage={errors.nome}
                    onBlur={onValidateNome}
                    autoFocus
                    topLabel="Nome:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12">
                {userContaID && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', height:"20px", gap:"10px" }}>
                        {onOpenChangeEmailModal && (
                            <Button
                                type="button"
                                label="Trocar E-mail"
                                severity="secondary"
                                outlined
                                onClick={onOpenChangeEmailModal}
                            />
                        )}
                        <Button type="button" label="Recuperação de Senha" severity="secondary" outlined />
                    </div>
                )}
                <Input
                    id="email"
                    value={userConta.email || ''}
                    onChange={onChange}
                    label="Digite o E-mail"
                    type="email"
                    useRightButton
                    outlined
                    readOnly={Boolean(userContaID)}
                    hasError={!!errors.email}
                    errorMessage={errors.email}
                    iconLeft="pi pi-at"
                    topLabel="E-mail:"
                    showTopLabel
                    required
                />
            </div>
            {userContaID ? null : (
                <>
                    <div className="col-12 ">
                        <Input
                            value={userConta.senha || ''}
                            onChange={onChange}
                            label="Digite a Senha"
                            id="senha"
                            type={isPasswordVisible ? 'text' : 'password'}
                            useRightButton
                            outlined
                            iconLeft="pi pi-key"
                            hasError={!!errors.senha}
                            errorMessage={errors.senha}
                            topLabel="Senha:"
                            showTopLabel
                            required
                            iconRight={
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        onTogglePasswordVisibility();
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <IconVisible isPasswordVisible={isPasswordVisible} />
                                </button>
                            }
                        />
                    </div>

                    <div className="col-12">
                        <Input
                            value={confirmPassword}
                            label="Digite a Confirmação de senha"
                            id="confirmPassword"
                            type={isConfirmPasswordVisible ? 'text' : 'password'}
                            useRightButton
                            outlined
                            hasError={!!errors.confirmPassword}
                            errorMessage={errors.confirmPassword}
                            iconLeft="pi pi-key"
                            topLabel="Confirmação de senha:"
                            showTopLabel
                            required
                            iconRight={
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        onTogglePasswordVisibility();
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <IconVisible isPasswordVisible={isConfirmPasswordVisible} />
                                </button>
                            }
                            onChange={(event) => onConfirmPasswordChange(event.target.value)}
                            onBlur={onValidateConfirmPassword}
                        />
                    </div>
                </>
            )}

            <div className="col-12">
                <PerfilUserDropdownField
                    selectedPerfilUser={selectedPerfilUser}
                    onPerfilUserChange={onPerfilUserChange}
                    reloadKey={reloadKeyPerfilUser}
                    hasError={!!errors.selectedPerfilUser}
                    errorMessage={errors.selectedPerfilUser}
                    showAddButton
                    onAddClick={onOpenPerfilUserModal}
                    autoSelectSingle
                />
            </div>
            <div className="col-12">
                <CustomMultiSelect
                    id="selectedEmpresa"
                    selectedItems={selectedEmpresa}
                    onChange={onCompanyChange}
                    options={empresasOptions}
                    optionLabel="razao_social"
                    dataKey="id"
                    initialSelectedValues={userConta.id_empresas_acesso ?? []}
                    placeholder="Selecione as Empresas"
                    maxSelectedLabels={3}
                    fetchFilteredItems={fetchFilteredEmpresa}
                    fetchAllItems={listTheEmpresa}
                    hasError={!!errors.selectedEmpresa}
                    errorMessage={errors.selectedEmpresa}
                    showChips
                    autoSelectSingle
                    showAddButton
                    onAddClick={onOpenEmpresaModal}
                    topLabel="Empresa"
                    showTopLabel
                    required
                />
            </div>
        </div>
    );
}

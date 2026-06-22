'use client';
import './style.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { PermissoesFields } from './permissoes';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { TreeCheckboxSelectionKeys } from 'primereact/tree';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import '@/app/(main)/cadastro/permissoes/created/TreeStyles.css';
import { permissoes } from '@/app/shared/optionsDropDown/options';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import { validateFieldsPerfilUser } from '@/app/(main)/cadastro/permissoes/controller/validate';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { createdPerfilUser, fetchPerfilUserByID, updatePerfilUser } from '@/app/(main)/cadastro/permissoes/controller/controller';
import { buildAllSelectedKeys, createEmptyPerfilUser, permissionNodeKeys, type FormCreatedPermissoesProps, type PermissoesFormProps, type PermissoesFormRef } from '../types/perfilUsuario';

export const PermissoesFormContainer = forwardRef<PermissoesFormRef, PermissoesFormProps>(({ initialId, msgs, onPerfilUserChange, onErrorsChange, redirectAfterSave, onSaved, onClose, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
    const router = useRouter();
    const onPerfilUserChangeRef = useRef(onPerfilUserChange);
    const onErrorsChangeRef = useRef(onErrorsChange);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [perfilUser, setPerfilUser] = useState<PerfilUser>(createEmptyPerfilUser());
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<TreeCheckboxSelectionKeys>({});
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const [stateDisableBtnCreatedPerfilUser, setStateDisableBtnCreatedPerfilUser] = useState(false);

    const validatePermissoesForm = () => validateFieldsPerfilUser(perfilUser, null, selectedKeys, setErrors, msgs);

    const handleAllChanges = (event: {
        target: {
            id: string;
            value: any;
            checked?: any;
            type: string;
        };
    }) => {
        const updatedPerfilUser = perfilUser.copyWith({
            [event.target.id]: event.target.type === 'checkbox' || event.target.type === 'switch' ? event.target.checked : event.target.value
        });
        setPerfilUser(updatedPerfilUser);
    };

    const handleDropdownChange = (event: DropdownChangeEvent) => {
        setPerfilUser(
            perfilUser.copyWith({
                [event.target.id]: event.value
            })
        );
    };
    const handleSelectionChange = (nextSelectedKeys: TreeCheckboxSelectionKeys) => {
        setSelectedKeys(nextSelectedKeys);
        validateFieldsPerfilUser(perfilUser, null, nextSelectedKeys, setErrors, msgs);
    };
    const allPermissionsSelected = permissionNodeKeys.length > 0 && permissionNodeKeys.every((key) => selectedKeys[key]?.checked);
    const handleToggleAllPermissions = () => {
        const nextSelectedKeys = allPermissionsSelected ? {} : buildAllSelectedKeys();
        setSelectedKeys(nextSelectedKeys);
        validateFieldsPerfilUser(perfilUser, null, nextSelectedKeys, setErrors, msgs);
    };
    const handleValidateNome = () => {
        setTouchedFields((prev) => ({
            ...prev,
            nome: true
        }));
        validatePermissoesForm();
    };
    const handleSubmit = async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }

        msgs.current?.clear();

        if (isLoadingBtnCreated) {
            return;
        }

        const isValid = validatePermissoesForm();
        if (!isValid) {
            setTouchedFields((prev) => ({
                ...prev,
                submit: true
            }));
            return;
        }

        setIsLoadingBtnCreated(true);

        try {
            if (isEditMode && initialId) {
                await updatePerfilUser(initialId, perfilUser, [], selectedKeys, setErrors, msgs, router, permissoes);
                onSaved?.(perfilUser);
                onClose?.();
                return;
            }

            const created = await createdPerfilUser(perfilUser, [], setPerfilUser, selectedKeys, setErrors, msgs, router, permissoes, redirectAfterSave ?? true);

            if (created) {
                onSaved?.(created);
                onClose?.();
            }
        } finally {
            setIsLoadingBtnCreated(false);
            setStateDisableBtnCreatedPerfilUser(false);
        }
    };
    useImperativeHandle(ref, () => ({
        handleSave: handleSubmit
    }));
    useEffect(() => {
        onPerfilUserChangeRef.current = onPerfilUserChange;
    }, [onPerfilUserChange]);

    useEffect(() => {
        onErrorsChangeRef.current = onErrorsChange;
    }, [onErrorsChange]);

    useEffect(() => {
        if (initialId) {
            setIsEditMode(true);
            fetchPerfilUserByID(initialId, setPerfilUser, setSelectedKeys, setIsLoading);
            return;
        }

        setIsLoading(false);
    }, [initialId]);

    useEffect(() => {
        if (Object.values(touchedFields).some(Boolean)) {
            validatePermissoesForm();
        }
    }, [perfilUser, selectedKeys, touchedFields]);

    useEffect(() => {
        onPerfilUserChangeRef.current?.(perfilUser);
    }, [perfilUser]);

    useEffect(() => {
        onErrorsChangeRef.current?.(errors);
    }, [errors]);

    if (isLoading && initialId) {
        return <LoadingScreen loadingText="Carregando informações da Permissão selecionada..." />;
    }

    const isDialogMode = Boolean(showBTNPGCreatedDialog);
    const isSubmitDisabled =
        stateDisableBtnCreatedPerfilUser || isLoadingBtnCreated || Object.keys(errors).length > 0 || !perfilUser.nome || !perfilUser.ordemServicoTipoVisualizacao || !perfilUser.contratoTipoVisualizacao || !perfilUser.nfseTipoVisualizacao;

    return (
        <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
            <Messages ref={msgs} className="custom-messages" />
            <div className="scrollable-container shared-form-content">
                <PermissoesFields
                    perfilUser={perfilUser}
                    errors={errors}
                    selectedKeys={selectedKeys}
                    allPermissionsSelected={allPermissionsSelected}
                    isLoading={isLoading}
                    onChange={handleAllChanges}
                    onDropdownChange={handleDropdownChange}
                    onSelectionChange={handleSelectionChange}
                    onToggleAllPermissions={handleToggleAllPermissions}
                    onValidateNome={handleValidateNome}
                />
            </div>
            <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                {showBTNPGCreatedAll && <BTNPGCreatedAll label="Salvar" disabled={isSubmitDisabled} onClick={handleSubmit} icon="pi pi-save" />}
                {showBTNPGCreatedDialog && <BTNPGCreatedDialog label="Salvar" disabled={isSubmitDisabled} onClick={handleSubmit} onBackClick={onBackClick} onClose={onClose} icon="pi pi-save" />}
            </div>
        </div>
    );
});
PermissoesFormContainer.displayName = 'PermissoesFormContainer';
function isPermissoesFormProps(props: FormCreatedPermissoesProps): props is PermissoesFormProps {
    return 'msgs' in props;
}
export const FormPermissoesCreated = forwardRef<PermissoesFormRef, FormCreatedPermissoesProps>((props, ref) => {
    if (isPermissoesFormProps(props)) {
        return <PermissoesFormContainer {...props} ref={ref} />;
    }
    return <PermissoesFields {...props} />;
});
FormPermissoesCreated.displayName = 'FormPermissoesCreated';
export default FormPermissoesCreated;


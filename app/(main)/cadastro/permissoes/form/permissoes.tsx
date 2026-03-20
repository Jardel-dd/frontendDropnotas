'use client';
import './style.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import Input from '@/app/shared/include/input/input-all';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import '@/app/(main)/cadastro/permissoes/created/TreeStyles.css';
import { Tree, TreeCheckboxSelectionKeys } from 'primereact/tree';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { permissoes, tiposVisualizacaoPermissoes } from '@/app/shared/optionsDropDown/options';
import { validateFieldsPerfilUser } from '@/app/(main)/cadastro/permissoes/controller/validate';
import { createdPerfilUser, fetchPerfilUserByID, updatePerfilUser } from '@/app/(main)/cadastro/permissoes/controller/controller';
import type { FormCreatedPermissoesProps, PermissoesFieldsProps, PermissoesFormProps, PermissoesFormRef } from '../types/perfilUsuario';

export type { FormCreatedPermissoesProps, PermissoesFieldsProps, PermissoesFormProps, PermissoesFormRef } from '../types/perfilUsuario';

const createEmptyPerfilUser = () =>
    new PerfilUser({
        ativo: true,
        id: 0,
        nome: '',
        perfilUsuario: false,
        perfilUsuarioCadastrar: false,
        perfilUsuarioAlterar: false,
        perfilUsuarioDesativar: false,
        perfilUsuarioPesquisar: false,
        usuarioConta: false,
        usuarioContaCadastrar: false,
        usuarioContaAlterar: false,
        usuarioContaDesativar: false,
        usuarioContaPesquisar: false,
        empresa: false,
        empresaCadastrar: false,
        empresaAlterar: false,
        empresaDesativar: false,
        empresaPesquisar: false,
        pessoa: false,
        pessoaCadastrar: false,
        pessoaAlterar: false,
        pessoaDesativar: false,
        pessoaPesquisar: false,
        vendedor: false,
        vendedorCadastrar: false,
        vendedorAlterar: false,
        vendedorDesativar: false,
        vendedorPesquisar: false,
        servico: false,
        servicoCadastrar: false,
        servicoAlterar: false,
        servicoDesativar: false,
        servicoPesquisar: false,
        ordemServico: false,
        ordemServicoCadastrar: false,
        ordemServicoAlterar: false,
        ordemServicoDesativar: false,
        ordemServicoPesquisar: false,
        ordemServicoTipoVisualizacao: '',
        contrato: false,
        contratoCadastrar: false,
        contratoAlterar: false,
        contratoDesativar: false,
        contratoPesquisar: false,
        contratoTipoVisualizacao: '',
        categoriaContrato: false,
        categoriaContratoCadastrar: false,
        categoriaContratoAlterar: false,
        categoriaContratoDesativar: false,
        categoriaContratoPesquisar: false,
        formaPagamento: false,
        formaPagamentoCadastrar: false,
        formaPagamentoAlterar: false,
        formaPagamentoDesativar: false,
        formaPagamentoPesquisar: false,
        nfseCadastrar: false,
        nfseAlterar: false,
        nfseDesativar: false,
        nfsePesquisar: false,
        integracaoCadastrar: false,
        integracaoAlterar: false,
        integracaoDesativar: false,
        integracaoPesquisar: false,
        nfseTipoVisualizacao: ''
    });

export function PermissoesFields({ perfilUser, errors, selectedKeys, isLoading, onChange, onDropdownChange, onSelectionChange, onValidateNome }: PermissoesFieldsProps) {
    return (
        <div className="grid formgrid">
            <div className="col-12 lg:col-4 mt-1">
                <Input
                    value={perfilUser.nome || ''}
                    onChange={onChange}
                    label="Digite o nome da permissao"
                    id="nome"
                    hasError={!!errors.nome}
                    errorMessage={errors.nome}
                    onBlur={onValidateNome}
                    autoFocus
                    topLabel="Nome da Permissao:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 mt-1">
                <Dropdown
                    value={perfilUser.ordemServicoTipoVisualizacao || ''}
                    onChange={onDropdownChange}
                    options={tiposVisualizacaoPermissoes}
                    id="ordemServicoTipoVisualizacao"
                    label="Selecione o tipo de visualizacao de ordens de servico"
                    hasError={!!errors.selectedordemServicoTipoVisualizacao}
                    errorMessage={errors.selectedordemServicoTipoVisualizacao}
                    topLabel="Tipo de Visualizacao da Ordem de Servico:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 mt-1">
                <Dropdown
                    value={perfilUser.contratoTipoVisualizacao || ''}
                    onChange={onDropdownChange}
                    id="contratoTipoVisualizacao"
                    options={tiposVisualizacaoPermissoes}
                    label="Selecione o tipo de visualizacao de contratos"
                    hasError={!!errors.contratoTipoVisualizacao}
                    errorMessage={errors.contratoTipoVisualizacao}
                    topLabel="Tipo de Visualizacao do Contrato:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-4 mt-1">
                <Dropdown
                    value={perfilUser.nfseTipoVisualizacao || ''}
                    onChange={onDropdownChange}
                    id="nfseTipoVisualizacao"
                    options={tiposVisualizacaoPermissoes}
                    label="Selecione o tipo de visualizacao da Nota Fiscal"
                    hasError={!!errors.nfseTipoVisualizacao}
                    errorMessage={errors.nfseTipoVisualizacao}
                    topLabel="Tipo de Visualizacao da Nota Fiscal:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-12 mt-3">
                <Tree
                    id="selectedPerfilUser"
                    value={permissoes}
                    selectionMode="checkbox"
                    selectionKeys={selectedKeys}
                    onSelectionChange={(event) => onSelectionChange(event.value as TreeCheckboxSelectionKeys)}
                    className={`w-full custom-multiselect ${errors.selectedPerfilUser ? 'tree-error' : ''}`}
                    disabled={isLoading}
                />
                {errors.selectedPerfilUser && <small className="p-error">{errors.selectedPerfilUser}</small>}
            </div>
        </div>
    );
}

const PermissoesFormContainer = forwardRef<PermissoesFormRef, PermissoesFormProps>(({ initialId, msgs, onPerfilUserChange, onErrorsChange, redirectAfterSave, onSaved, onClose, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
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
        return <LoadingScreen loadingText="Carregando informacoes da Permissao selecionada..." />;
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
                    isLoading={isLoading}
                    onChange={handleAllChanges}
                    onDropdownChange={handleDropdownChange}
                    onSelectionChange={handleSelectionChange}
                    onValidateNome={handleValidateNome}
                />
            </div>
            <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                {showBTNPGCreatedAll && <BTNPGCreatedAll label="Salvar" disabled={isSubmitDisabled} onClick={handleSubmit} />}
                {showBTNPGCreatedDialog && <BTNPGCreatedDialog label="Salvar" disabled={isSubmitDisabled} onClick={handleSubmit} onBackClick={onBackClick} onClose={onClose} />}
            </div>
        </div>
    );
});
PermissoesFormContainer.displayName = 'PermissoesFormContainer';
function isPermissoesFormProps(props: FormCreatedPermissoesProps): props is PermissoesFormProps {
    return 'msgs' in props;
}
const FormPermissoesCreated = forwardRef<PermissoesFormRef, FormCreatedPermissoesProps>((props, ref) => {
    if (isPermissoesFormProps(props)) {
        return <PermissoesFormContainer {...props} ref={ref} />;
    }

    return <PermissoesFields {...props} />;
});
FormPermissoesCreated.displayName = 'FormPermissoesCreated';
export default FormPermissoesCreated;

'use client';
import "./style.css";
import LoadingScreen from "@/app/loading";
import { useRouter } from "next/navigation";
import { Messages } from "primereact/messages";
import { useTheme } from "../../isDarkMode/isDarkMode";
import Input from "@/app/shared/include/input/input-all";
import { DropdownChangeEvent } from "primereact/dropdown";
import { PerfilUser } from "@/app/entity/PerfilUsuarioEntity";
import Dropdown from "@/app/shared/include/dropdown/dropdown";
import { Tree, TreeCheckboxSelectionKeys } from "primereact/tree";
import { RefObject, useEffect, useState, forwardRef } from "react";
import BTNPGCreatedAll from "../../buttonsComponent/btnCreatedAll/btn-created-all";
import { fetchPerfilUserByID } from "../../fetchAll/listAllPerfilUsuarios/controller";
import BTNPGCreatedDialog from "../../buttonsComponent/btnCreatedAll/btn-created-dialog";
import { permissoes, tiposVisualizacaoPermissoes } from '@/app/shared/optionsDropDown/options';
import { validateFieldsPerfilUser } from "@/app/(main)/cadastro/perfilUsuario/controller/validate";
import { createdPerfilUser, updatePerfilUser } from "@/app/(main)/cadastro/perfilUsuario/controller/controller";
export interface PermissoesFormRef {
    handleSave: () => Promise<void>;
};
interface PermissoesFormProps {
    perfilUser: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onPerfilUserChange?: (perfilUser: PerfilUser) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setPerfilUser: React.Dispatch<React.SetStateAction<PerfilUser>>;
    redirectAfterSave?: boolean;
    onSaved?: (created: PerfilUser) => void;
    onClose?: () => void,
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;

};
const PerfilUserChangeForm = forwardRef<PermissoesFormRef, PermissoesFormProps>(({
    initialId,
    msgs,
    onPerfilUserChange,
    onErrorsChange,
    redirectAfterSave,
    onSaved,
    onClose,
    showBTNPGCreatedDialog,
    showBTNPGCreatedAll,
    onBackClick
}: PermissoesFormProps, ref) => {
    const router = useRouter();
    const perfilUserId = initialId;
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [perfilUser, setPerfilUser] = useState<PerfilUser>(
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
            nfseTipoVisualizacao:""
        }));
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
    const [selectedPerfilUser, setSelectedPerfilUser] = useState<PerfilUser>();
    const [selectedKeys, setSelectedKeys] = useState<TreeCheckboxSelectionKeys>({});
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [stateDisableBtnCreatedPerfilUser, setStateDisableBtnCreatedPerfilUser] = useState(false);
    const handleAllChanges = (event: {
        target: { id: string; value: any; checked?: any; type: string }
    }) => {
        const _perfilUser = perfilUser!.copyWith({
            [event.target.id]:
                (event.target.type === "checkbox" || event.target.type === "switch")
                    ? event.target.checked : event.target.value,
        });
        setPerfilUser(_perfilUser);

    };
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
         if (isLoadingBtnCreated) return;
        setIsLoadingBtnCreated(true);
        try {
            if (isEditMode && perfilUserId) {
                await updatePerfilUser(
                    perfilUserId,
                    perfilUser,
                    selectedPerfilUser ? [selectedPerfilUser] : [],
                    selectedKeys,
                    setErrors,
                    msgs,
                    router,
                    permissoes
                );
            } else {
                const created = await createdPerfilUser(
                    perfilUser,
                    selectedPerfilUser ? [selectedPerfilUser] : [],
                    setPerfilUser,
                    selectedKeys,
                    setErrors,
                    msgs,
                    router,
                    permissoes,
                    redirectAfterSave ?? true

                );
                console.log("perfilUser", perfilUser)
                if (created) {
                    onSaved?.(created);
                }
            }
            onClose?.();
        } finally {
            setStateDisableBtnCreatedPerfilUser(false);
        }
    };
    const handleDropdownChange = (e: DropdownChangeEvent) => {
        const _perfilUser = perfilUser.copyWith({
            [e.target.id]: e.value,
        });
        setPerfilUser(_perfilUser);
    };
    useEffect(() => {
        if (perfilUserId) {
            setIsEditMode(true);
            fetchPerfilUserByID(perfilUserId, setPerfilUser, setSelectedKeys, setIsLoading);
        } else {
            setIsLoading(false);
        }
    }, [perfilUserId]);
    useEffect(() => {
        if (onPerfilUserChange) {
            onPerfilUserChange(perfilUser);
        }
    }, [perfilUser, onPerfilUserChange]);
    useEffect(() => {
        if (onErrorsChange) {
            onErrorsChange(errors);
        }
    }, [errors, onErrorsChange]);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsPerfilUser(perfilUser, selectedPerfilUser ? [selectedPerfilUser] : [], selectedKeys, setErrors, msgs);
        }
    }, [perfilUser]);
    if (isLoading && perfilUserId) {
        return <LoadingScreen loadingText="Carregando informações da Categoria de Contrato selecionada..." />;
    };
    return (
        <>
            <Messages ref={msgs} className="custom-messages" />
            <div className="scrollable-container" >
                <div className="grid formgrid">
                    <div className="col-12  lg:col-4 mt-1">
                        <Input
                            value={perfilUser.nome || ''}
                            onChange={handleAllChanges}
                            label="Digite o nome da permissão"
                            id="nome"
                            hasError={!!errors.nome}
                            errorMessage={errors.nome}
                            onBlur={() => {
                                setTouchedFields((prev) => ({ ...prev, nome: true }));
                                validateFieldsPerfilUser(perfilUser, selectedPerfilUser ? [selectedPerfilUser] : null, selectedKeys, setErrors, msgs);
                            }}
                            autoFocus
                            topLabel="Nome da Permissão:"
                            showTopLabel
                            required
                        />
                    </div>
                    <div className="col-12 lg:col-4 mt-1">
                        <Dropdown
                            value={perfilUser.ordemServicoTipoVisualizacao || ''}
                            onChange={handleDropdownChange}
                            options={tiposVisualizacaoPermissoes}
                            id='ordemServicoTipoVisualizacao'
                            label="Selecione o tipo de visualização de ordens de serviço"
                            hasError={!!errors.selectedordemServicoTipoVisualizacao}
                            errorMessage={errors.selectedordemServicoTipoVisualizacao}
                            topLabel="Tipo de Visualização da Ordem de Serviço:"
                            showTopLabel
                            required
                        />
                    </div>
                    <div className="col-12 lg:col-4 mt-1">
                        <Dropdown
                            value={perfilUser.contratoTipoVisualizacao || ''}
                            onChange={handleDropdownChange}
                            id='contratoTipoVisualizacao'
                            options={tiposVisualizacaoPermissoes}
                            label="Selecione o tipo de visualização de contratos"
                            hasError={!!errors.contratoTipoVisualizacao}
                            errorMessage={errors.contratoTipoVisualizacao}
                            topLabel="Tipo de Visualização do Contrato:"
                            showTopLabel
                            required
                        />
                    </div>
                       <div className="col-12 lg:col-4 mt-1">
                        <Dropdown
                            value={perfilUser.nfseTipoVisualizacao || ''}
                            onChange={handleDropdownChange}
                            id='nfseTipoVisualizacao'
                            options={tiposVisualizacaoPermissoes}
                            label="Selecione o tipo de visualização da Nota Fiscal"
                            hasError={!!errors.nfseTipoVisualizacao}
                            errorMessage={errors.nfseTipoVisualizacao}
                            topLabel="Tipo de Visualização da Nota Fiscal:"
                            showTopLabel
                            required
                        />
                    </div>
                    <div className="col-12  lg:col-12 mt-3">
                        <Tree
                            id="selectedPerfilUser"
                            value={permissoes}
                            selectionMode="checkbox"
                            selectionKeys={selectedKeys}
                            onSelectionChange={(e) => {
                                const selectedKeys = e.value as TreeCheckboxSelectionKeys;
                                setSelectedKeys(selectedKeys);
                                validateFieldsPerfilUser(
                                    perfilUser,
                                    selectedPerfilUser ? [selectedPerfilUser] : null,
                                    selectedKeys,
                                    setErrors,
                                    msgs
                                );
                            }}
                            className={`w-full custom-multiselect ${errors.selectedPerfilUser ? 'tree-error' : ''}`}
                            disabled={isLoading}
                        />
                        {errors.selectedPerfilUser && (
                            <small className="p-error">{errors.selectedPerfilUser}</small>
                        )}
                    </div>
                </div>
            </div>
            <div className="StyleContainer-btn-Created" >
                {showBTNPGCreatedAll && (
                    <BTNPGCreatedAll
                        label="Salvar"
                        disabled={
                            stateDisableBtnCreatedPerfilUser ||
                            Object.keys(errors).length > 0 ||
                            !perfilUser.nome ||
                            !perfilUser.ordemServicoTipoVisualizacao ||
                            !perfilUser.contratoTipoVisualizacao
                        }
                        onClick={handleSubmit}
                    />
                )}
                {showBTNPGCreatedDialog && (
                    <BTNPGCreatedDialog
                        label="Salvar"
                        disabled={
                            stateDisableBtnCreatedPerfilUser ||
                            Object.keys(errors).length > 0 ||
                            !perfilUser.nome ||
                            !perfilUser.ordemServicoTipoVisualizacao ||
                            !perfilUser.contratoTipoVisualizacao
                        }
                        onClick={handleSubmit}
                        onBackClick={onBackClick}
                        onClose={onClose}
                    />
                )}
            </div>
        </>
    );
}
);
PerfilUserChangeForm.displayName = "PerfilUserChangeForm";
export default PerfilUserChangeForm;

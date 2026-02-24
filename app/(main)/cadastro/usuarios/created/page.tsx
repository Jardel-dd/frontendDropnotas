'use client';
import './styledUsuarios.css';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import IconVisible from '@/app/shared/IconVisible';
import { useRef, useState, useEffect } from 'react';
import Input from '@/app/shared/include/input/input-all';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { useRouter, useSearchParams } from 'next/navigation';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { MultiSelectChangeEvent } from 'primereact/multiselect';
import { validateFieldsUserConta } from '../controller/validation';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import EmpresaForm from '@/app/components/pages/Empresa/companyForm';
import CustomMultiSelect from '@/app/shared/include/multSelect/Input';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { convertProfileUserToBase64, create, update } from '../controller/controller';
import { CreatedDialog } from '@/app/components/dialogs/dialogCreatedComponent/dialog';
import { fetchUserContaCreated } from '@/app/components/fetchAll/listUsersConta/controller';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import PerfilUserChangeForm, { PermissoesFormRef } from '@/app/components/pages/Permissoes/permissoesForm';
import { fetchFilteredCompany, listTheCompany } from '@/app/components/fetchAll/listAllCompany/controller';
import { fetchAllPerfilUsuarios, fetchFilteredPerfilUsuarios } from '@/app/components/fetchAll/listAllPerfilUsuarios/controller';

export default function CriarUserConta() {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const searchParams = useSearchParams();
    const empresaId = searchParams.get('id');
    const userContaID = searchParams.get('id');
    const perfilUserId = searchParams.get('id');
    const formRef = useRef<PermissoesFormRef>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
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
    const [empresasOptions, setEmpresasOptions] = useState<CompanyEntity[]>([]);
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
                   nfseTipoVisualizacao:''
               }));
   
    const [userConta, setUserConta] = useState<UsuarioContaEntity>(
        new UsuarioContaEntity({
            ativo: true,
            foto_perfil: '',
            nome: '',
            email: '',
            senha: ''
        })
    );
    const [reloadKeyEmpresa, setReloadKeyEmpresa] = useState(0);
    const [reloadKeyUserConta, setReloadKeyUserConta] = useState(0);
    const [showModalEmpresa, setShowModalEmpresa] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showModalUserConta, setShowModalUserConta] = useState(false);
    const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
    const [showModalPerfilUser, setShowModalPerfilUser] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity[]>([]);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [selectedPerfilUser, setSelectedPerfilUser] = useState<PerfilUser | null>(null);
    const [selectedUserConta, setSelectedUserConta] = useState<PerfilUser | null>(null);
    const [stateDisableBtnCreatedUseConta, setStateDisableBtnCreatedUserConta] = useState(false);
    const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
        const id = event.target.id;
        const type = event.target.type;
        const checked = event.target.checked;
        const value = event.target.value;
        const newValue = type === 'checkbox' || type === 'switch' ? checked : value;
        setUserConta((prev) => {
            const userContaInstanciada = new UsuarioContaEntity(prev);
            return userContaInstanciada.copyWith({
                [id]: newValue
            });
        });
    };
    const handlePerfilUserSaved = (created: PerfilUser) => {
        setShowModalUserConta(false);
        setSelectedUserConta(created);
        setReloadKeyUserConta((k) => k + 1);
    };
    const handleCompanyChange = (e: MultiSelectChangeEvent) => {
        console.log('Empresa selecionado:', e.value);
        const selected = e.value as CompanyEntity[];
        setSelectedEmpresa(selected);
        const selectedIds = selected.map((user) => user.id);
        handleAllChanges({
            target: { id: 'id_empresas_acesso', value: selectedIds, type: 'input' }
        });
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedEmpresa;
            return newErrors;
        });
    };
    const handlePerfilUserChange = (perfilUser: PerfilUser | null) => {
        setSelectedPerfilUser(perfilUser);
        if (perfilUser) {
            handleAllChanges({
                target: { id: 'id_perfil_usuario', value: perfilUser.id, type: 'input' }
            });
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedVendedor;
            return newErrors;
        });
    };
    const handlePerfilUser = (updatedPerfilUser: PerfilUser) => {
        setPerfilUser(updatedPerfilUser);
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
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        msgs.current?.clear();
         if (isLoadingBtnCreated) return;
        setIsLoadingBtnCreated(true);
        const isValid = validateFieldsUserConta(userConta, confirmPassword, selectedPerfilUser, selectedEmpresa, setErrors, msgs);
        if (!isValid) return;
        {
            if (isEditMode && userContaID) {
                update(userContaID, userConta, confirmPassword, selectedEmpresa, selectedPerfilUser, setErrors, msgs, router, setUserConta, setSelectedEmpresa, setSelectedPerfilUser);
            } else {
                create(userConta, selectedEmpresa, selectedPerfilUser, setErrors, msgs, router, setUserConta, setSelectedEmpresa, setSelectedPerfilUser);
            }
        }
    };
    const validatePasswordConfirmation = (confirmPassword: string) => {
        if (confirmPassword !== userConta.senha) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: 'Este campo não coincide com a senha, por favor, verifique.'
            }));
        } else {
            setErrors((prevErrors) => {
                const { confirmPassword, ...rest } = prevErrors;
                return rest;
            });
        }
    };
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };
    const handleContainerClick = () => {
        fileInputRef.current?.click();
    };
    const handleEmpresaSaved = (created: CompanyEntity) => {
        setShowModalEmpresa(false);
        setSelectedEmpresa((prev) => [...prev, created]);
        setReloadKeyEmpresa((k) => k + 1);
    };
    const handleEmpresa = (updatedEmpresa: CompanyEntity) => {
        setEmpresa(updatedEmpresa);
    };
    const ListagemUserID = async (userContaID: string) => {
        try {
            setIsLoading(true);
            const { userConta, empresa, perfilUser, selectedEmpresa } = await fetchUserContaCreated(userContaID);
            setUserConta(userConta);
            setPerfilUser(perfilUser);
            setEmpresa(empresa);
            setSelectedEmpresa(selectedEmpresa);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (userContaID) {
            setIsEditMode(true);
            ListagemUserID(userContaID).finally(() => setIsLoading(false));
        } else {
            Promise.all([fetchAllPerfilUsuarios(), listTheCompany()])
                .then(([perfilUser, empresa]) => {
                    setSelectedPerfilUser(null);
                    setEmpresa(empresa);
                    setSelectedEmpresa(selectedEmpresa);
                })
                .finally(() => setIsLoading(false));
        }
    }, [userContaID]);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsUserConta(userConta, confirmPassword, selectedPerfilUser, selectedEmpresa, setErrors, msgs);
        }
    }, [userConta]);
    if (isLoading && userContaID) {
        return <LoadingScreen loadingText={'Carregando informações do usuário selecionado...'} />;
    }
    return (
        <>
            <div className="p-fluid">
                <Messages ref={msgs} className="custom-messages" />
                <div className="card styled-container-main-all-routes">
                    <div className="scrollable-container">
                        <div className="custom-flex-row">
                            <div className="w-full">
                                <div className="centered-container">
                                    <div style={{ flexDirection: 'column', display: 'flex' }}>
                                        <div
                                            className="image-upload-containerDeskTopFotoUserConta"
                                            onClick={handleContainerClick}
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
                                            {userConta.foto_perfil || userConta.foto_perfil ? (
                                                <img src={userConta.foto_perfil?.startsWith('data:image') ? userConta.foto_perfil : userConta.foto_perfil} alt="Uploaded" className="img-cover" />
                                            ) : (
                                                <i className="pi pi-images custom-textUser"></i>
                                            )}
                                        </div>
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" style={{ display: 'none' }} onChange={handleFileChangeLogo} />
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <Button type="button" style={{ height: '2rem', width: '100%' }} label="Trocar Foto" severity="secondary" outlined onClick={handleContainerClick} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 lg:col-12 mt-1">
                                        <Input
                                            id="nome"
                                            value={userConta.nome || ''}
                                            onChange={handleAllChanges}
                                            label="Digite o Nome"
                                            icon="pi pi-user"
                                            useRightButton={true}
                                            outlined={true}
                                            iconLeft={'pi pi-user'}
                                            hasError={!!errors.nome}
                                            errorMessage={errors.nome}
                                            onBlur={() => {
                                                setTouchedFields((prev) => ({ ...prev, descricao: true }));
                                                validateFieldsUserConta(userConta, confirmPassword, selectedPerfilUser, selectedEmpresa, setErrors, msgs);
                                            }}
                                            autoFocus
                                            topLabel="Nome:"
                                            showTopLabel
                                            required
                                        />
                                </div>
                                <div className="col-12 lg:col-12 mt-1">
                                        <Input
                                            id="email"
                                            value={userConta.email || ''}
                                            onChange={handleAllChanges}
                                            label="Digite o E-mail"
                                            type="email"
                                            icon="pi pi-maçã"
                                            useRightButton={true}
                                            outlined={true}
                                            hasError={!!errors.email}
                                            errorMessage={errors.email}
                                            iconLeft={'pi pi-at'}
                                            topLabel="E-mail:"
                                            showTopLabel
                                            required
                                        />
                                </div>
                                {userContaID ? (
                                    <div style={{ width: '99%', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button style={{ width: '15%', height: '10px' }} label="Trocar Senha" severity="secondary" outlined />
                                    </div>
                                ) : (
                                    <>
                                        <div className="col-12 lg:col-12 mt-1">
                                                <Input
                                                    value={userConta.senha || ''}
                                                    onChange={handleAllChanges}
                                                    label="Digite a Senha"
                                                    id="senha"
                                                    type={isPasswordVisible ? 'text' : 'password'}
                                                    useRightButton={true}
                                                    outlined={true}
                                                    iconLeft={'pi pi-key'}
                                                    hasError={!!errors.senha}
                                                    errorMessage={errors.senha}
                                                    topLabel="Senha:"
                                                    showTopLabel
                                                    required
                                                    iconRight={
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                togglePasswordVisibility();
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
                                        <div className="col-12 lg:col-12 mt-1">
                                                <Input
                                                    value={confirmPassword}
                                                    label="Digite a Confirmação de senha"
                                                    id="confirmPassword"
                                                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                                                    useRightButton={true}
                                                    outlined={true}
                                                    hasError={!!errors.confirmPassword}
                                                    errorMessage={errors.confirmPassword}
                                                    iconLeft={'pi pi-key'}
                                                    topLabel="Confirmação de senha:"
                                                    showTopLabel
                                                    required
                                                    iconRight={
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                togglePasswordVisibility();
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
                                                    onChange={(e) => {
                                                        setConfirmPassword(e.target.value);
                                                        validatePasswordConfirmation(e.target.value);
                                                    }}
                                                    onBlur={() => {
                                                        validateFieldsUserConta(userConta, confirmPassword, selectedPerfilUser, selectedEmpresa, setErrors, msgs);
                                                    }}
                                                />
                                        </div>
                                    </>
                                )}
                                <div className="col-12 lg:col-12 mt-1">
                                        <DropdownSearch<PerfilUser>
                                            id="selectedPerfilUser"
                                            selectedItem={selectedPerfilUser}
                                            onItemChange={handlePerfilUserChange}
                                            fetchAllItems={fetchAllPerfilUsuarios}
                                            fetchFilteredItems={fetchFilteredPerfilUsuarios}
                                            optionLabel="nome"
                                            placeholder="Selecione a permissão"
                                            hasError={!!errors.selectedPerfilUser}
                                            errorMessage={errors.selectedPerfilUser}
                                            autoSelectSingle
                                            showAddButton
                                            onAddClick={() => setShowModalPerfilUser(true)}
                                            topLabel="Permissões deste Usuário:"
                                            showTopLabel
                                            required
                                        />
                                </div>
                                <div className="col-12 lg:col-12 mt-1">
                                        <CustomMultiSelect
                                            id="selectedEmpresa"
                                            selectedItems={selectedEmpresa}
                                            onChange={handleCompanyChange}
                                            options={empresasOptions}
                                            optionLabel="razao_social"
                                            placeholder="Selecione as Empresas"
                                            maxSelectedLabels={3}
                                            fetchFilteredItems={fetchFilteredCompany}
                                            fetchAllItems={listTheCompany}
                                            hasError={!!errors.selectedEmpresa}
                                            errorMessage={errors.selectedEmpresa}
                                            showChips={true}
                                            autoSelectSingle
                                            showAddButton
                                            onAddClick={() => setShowModalEmpresa(true)}
                                            topLabel="Empresa"
                                            showTopLabel
                                            required
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="custom-flex-bottom">
                        <BTNPGCreatedAll
                            onClick={async () => await handleSubmit()}
                            label="Salvar"
                            disabled={stateDisableBtnCreatedUseConta || Object.keys(errors).length > 0 || !userConta.nome || !userConta.email || (!userContaID && !userConta.senha) || !selectedPerfilUser || !selectedEmpresa}
                            icon=""
                        />
                    </div>
                    <CreatedDialog header="Adicionar Perfil deste Usuário" visible={showModalPerfilUser} onHide={() => setShowModalPerfilUser(false)}>
                        <PerfilUserChangeForm
                            msgs={msgs}
                            ref={formRef}
                            perfilUser={perfilUser}
                            initialId={perfilUserId}
                            setPerfilUser={setPerfilUser}
                            onPerfilUserChange={handlePerfilUser}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            onSaved={handlePerfilUserSaved}
                            onClose={() => setShowModalPerfilUser(false)}
                            showBTNPGCreatedDialog={true}
                            onBackClick={() => setShowModalPerfilUser(false)}
                        />
                    </CreatedDialog>
                    <CreatedDialog header="Adicionar Empresa" visible={showModalEmpresa} onHide={() => setShowModalEmpresa(false)}>
                        <EmpresaForm
                            msgs={msgs}
                            ref={formRef}
                            empresa={empresa}
                            initialId={empresaId}
                            setEmpresa={setEmpresa}
                            onEmpresaChange={handleEmpresa}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            showBTNPGCreatedAll={true}
                            onSaved={handleEmpresaSaved}
                            onClose={() => setShowModalEmpresa(false)}
                            onBackClick={() => setShowModalEmpresa(false)}
                        />
                    </CreatedDialog>
                </div>
            </div>
        </>
    );
}

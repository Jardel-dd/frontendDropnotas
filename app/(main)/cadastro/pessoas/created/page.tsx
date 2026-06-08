'use client';
import './styles.css';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { Divider } from 'primereact/divider';
import { Messages } from '@/app/components/messages/GlobalMessages';
import { useEffect, useRef, useState } from 'react';
import { FormCreatedPessoa } from '../form/controller';
import { getCitiesFromState } from '@/app/entity/maps';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { VendedorFormRef } from '../../vendedores/types/vendedor';
import { FormCreatedVendedor } from '../../vendedores/form/controller';
import { ContratoFormCreated } from '@/app/(main)/contrato/form/controller';
import { ContratoFormRef, PreloadedContratoData } from '@/app/(main)/contrato/types/contratos';
import VendedorDropdownField from '../../vendedores/dropDown/DropdownVendedor';
import { fetchVendedor } from '@/app/(main)/cadastro/vendedores/controller/controller';
import { handleSearchCep } from '../../../../components/seachs/searchCep/controller';
import { handleSearchCNPJ } from '../../../../components/seachs/searchCnpj/controller';
import { validateFieldsPessoa } from '@/app/(main)/cadastro/pessoas/controller/validate';
import DialogFilter from '../../../../components/dialogs/dialogFilterComponents/dialogFilter';
import EnderecoForm from '../../../../components/enderecos/enderecoFormComponent/enderecoForm';
import BTNPGCreatedAll from '../../../../components/buttonsComponent/btnCreatedAll/btn-created-all';
import { fetchAllCnae, fetchFilteredCnae } from '../../../../components/fetchAll/listAllCnae/controller';
import { createdPessoa, fetchPessoasById, updatePessoa } from '@/app/(main)/cadastro/pessoas/controller/controller';
import { fetchContratoByID, fetchContratosById } from '@/app/(main)/contrato/controller/controller';
const mapPessoaContatoToSelection = (pessoa: Pick<PessoaEntity, 'pessoa_cliente' | 'pessoa_fornecedor'>): string | null => {
    if (pessoa.pessoa_cliente && pessoa.pessoa_fornecedor) return 'AMBOS';
    if (pessoa.pessoa_cliente) return 'pessoa_cliente';
    if (pessoa.pessoa_fornecedor) return 'pessoa_fornecedor';
    return null;
};
const mapContatoSelectionToFlags = (selectedContato: string | null) => ({
    pessoa_cliente: selectedContato === 'AMBOS' || selectedContato === 'pessoa_cliente',
    pessoa_fornecedor: selectedContato === 'AMBOS' || selectedContato === 'pessoa_fornecedor'
});
export default function PessoaPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pessoaId = searchParams.get('id');
    const msgs = useRef<Messages | null>(null);
    const formRef = useRef<VendedorFormRef>(null);
    const formContratoRef = useRef<ContratoFormRef>(null);
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
    const [vendedorDialogKey, setVendedorDialogKey] = useState(0);
    const [contratoDialogKey, setContratoDialogKey] = useState(0);
    const [loadingCep, setLoadingCep] = useState<boolean>(false);
    const [loadingCnpj, setLoadingCnpj] = useState<boolean>(false);
    const [showModalVendedor, setShowModalVendedor] = useState(false);
    const [editingVendedorId, setEditingVendedorId] = useState<string | null>(null);
    const [showModalContrato, setShowModalContrato] = useState(false);
    const [editingContratoId, setEditingContratoId] = useState<string | null>(null);
    const [isVendedorDialogLoading, setIsVendedorDialogLoading] = useState(true);
    const [isContratoDialogLoading, setIsContratoDialogLoading] = useState(true);
    const [preloadedVendedor, setPreloadedVendedor] = useState<VendedorEntity | null>(null);
    const [preloadedContrato, setPreloadedContrato] = useState<PreloadedContratoData | null>(null);
    const [selectedContato, setSelectedContato] = useState<string | null>(null);
    const [selectedContrato, setSelectedContrato] = useState<ContratoEntity | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
    const [selectedCNAE, setSelectedCNAE] = useState<TableCNAEEntity | null>(null);
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
    const [reloadKeyContrato] = useState(0);
    const [reloadKeyContratoDropdown, setReloadKeyContratoDropdown] = useState(0);
    const [stateDisableBtnCreatedClienteFornecedor, setStateDisableBtnCreatedClienteFornecedor] = useState(false);
    const [contrato, setContrato] = useState<ContratoEntity>(
        new ContratoEntity({
            ativo: true,
            id: 0,
            descricao: '',
            valor_servico: null,
            periodicidade: '',
            emitir_boleto: false,
            enviar_email: false,
            enviar_whatsapp: false,
            id_servico: null,
            id_empresa: null,
            id_categoria_contrato: null,
            id_forma_pagamento: null,
            id_clientes_contrato: [0]
        })
    );
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
            cnae_fiscal: null,
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
    const validatePessoaForm = () => validateFieldsPessoa(pessoa, setErrors, msgs, selectedVendedor, selectedContrato);
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
            }

            return prePessoa.copyWith({
                [id]: newValue
            });
        });
    };
    const handleDropdownChange = (e: DropdownChangeEvent) => {
        const pessoaInstance = pessoa instanceof PessoaEntity ? pessoa : new PessoaEntity(pessoa);
        setPessoa(pessoaInstance.copyWith({ [e.target.id]: e.value }));
    };
    const handleDropdownChangeEnderco = (e: DropdownChangeEvent) => {
        const updatedEndereco = {
            ...pessoa.endereco,
            [e.target.id]: e.value
        };
        setPessoa((prev) => prev.copyWith({ endereco: updatedEndereco }));
    };
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        msgs.current?.clear();
        if (isLoadingBtnCreated) return;

        const isValid = validatePessoaForm();
        if (!isValid) {
            setTouchedFields((prev) => ({ ...prev, submit: true }));
            return;
        }

        setIsLoadingBtnCreated(true);
        try {
            if (isEditMode && pessoaId) {
                await updatePessoa(pessoaId, pessoa, setErrors, msgs, router, setPessoa);
            } else {
                await createdPessoa(pessoa, setErrors, msgs, router, setPessoa, true);
            }
        } finally {
            setIsLoadingBtnCreated(false);
            setStateDisableBtnCreatedClienteFornecedor(false);
        }
    };
    const handleVendedor = (updatedVendedor: VendedorEntity) => {
        setVendedor(updatedVendedor);
    };
    const openCreateVendedorDialog = () => {
        setIsVendedorDialogLoading(true);
        setEditingVendedorId(null);
        setPreloadedVendedor(null);
        setVendedorDialogKey((current) => current + 1);
        setShowModalVendedor(true);
    };
    const openEditVendedorDialog = async (vendedorSelecionado: VendedorEntity) => {
        if (!vendedorSelecionado?.id) {
            return;
        }

        setIsVendedorDialogLoading(true);
        try {
            const vendedorId = String(vendedorSelecionado.id);
            const { dataVendedor } = await fetchVendedor(vendedorId);
            setPreloadedVendedor(dataVendedor);
            setEditingVendedorId(vendedorId);
            setVendedorDialogKey((current) => current + 1);
            setShowModalVendedor(true);
        } catch (error) {
            console.error('Erro ao pré-carregar vendedor para edição:', error);
            setIsVendedorDialogLoading(false);
        }
    };
    const closeVendedorDialog = () => {
        setShowModalVendedor(false);
        setEditingVendedorId(null);
        setIsVendedorDialogLoading(true);
        setPreloadedVendedor(null);
    };
    const openCreateContratoDialog = () => {
        setIsContratoDialogLoading(true);
        setEditingContratoId(null);
        setPreloadedContrato(null);
        setContratoDialogKey((current) => current + 1);
        setShowModalContrato(true);
    };
    const openEditContratoDialog = async (contratoSelecionado: ContratoEntity) => {
        if (!contratoSelecionado?.id) {
            return;
        }

        setIsContratoDialogLoading(true);
        try {
            const contratoId = String(contratoSelecionado.id);
            console.log('[PessoaPage] abrindo edicao de contrato', { contratoId, contratoSelecionado });
            const contratoPrecarregado = await fetchContratosById(contratoId);
            console.log('[PessoaPage] preload do contrato concluido', contratoPrecarregado);
            setPreloadedContrato(contratoPrecarregado);
            setEditingContratoId(contratoId);
            setContratoDialogKey((current) => current + 1);
            setShowModalContrato(true);
        } catch (error) {
            console.error('Erro ao pré-carregar contrato para edição:', error);
            setIsContratoDialogLoading(false);
        }
    };
    const closeContratoDialog = () => {
        console.log('[PessoaPage] closeContratoDialog chamado', {
            editingContratoId,
            showModalContrato
        });
        setShowModalContrato(false);
        setEditingContratoId(null);
        setPreloadedContrato(null);
        window.setTimeout(() => {
            setIsContratoDialogLoading(false);
        }, 200);
    };
    const handleContratoFormChange = (updatedContrato: ContratoEntity) => {
        setContrato(updatedContrato);
    };
    const handleVendedorSaved = (created: VendedorEntity) => {
        closeVendedorDialog();
        setSelectedVendedor(created);
        handleAllChanges({
            target: { id: 'id_vendedor_padrao', value: created.id, type: 'input' }
        });
        setReloadKeyVendedor((k) => k + 1);
    };
    const handleContratoSaved = async (created: ContratoEntity) => {
        console.log('[PessoaPage] handleContratoSaved chamado', created);
        setIsContratoDialogLoading(true);
        let contratoAtualizado = created;

        try {
            if (created?.id) {
                const response = await fetchContratoByID(String(created.id));
                contratoAtualizado = new ContratoEntity(response.contrato);
            }

            setSelectedContrato(contratoAtualizado);
            setPessoa((prev) =>
                prev.copyWith({
                    id_contrato: contratoAtualizado.id
                })
            );
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedContrato;
                return newErrors;
            });
            setContrato(
                new ContratoEntity({
                    ativo: true,
                    id: 0,
                    descricao: '',
                    valor_servico: null,
                    periodicidade: '',
                    emitir_boleto: false,
                    enviar_email: false,
                    enviar_whatsapp: false,
                    id_servico: null,
                    id_empresa: null,
                    id_categoria_contrato: null,
                    id_forma_pagamento: null,
                    id_clientes_contrato: [0]
                })
            );
            setReloadKeyContratoDropdown((current) => current + 1);
        } catch (error) {
            console.error('[PessoaPage] erro ao recarregar contrato salvo:', error);
        } finally {
            closeContratoDialog();
        }
    };
    const handleVendedorChange = (vendedorSelecionado: VendedorEntity | null) => {
        setSelectedVendedor(vendedorSelecionado);
        handleAllChanges({
            target: { id: 'id_vendedor_padrao', value: vendedorSelecionado?.id ?? null, type: 'input' }
        });
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedVendedor;
            return newErrors;
        });
    };
    const handleContatoChange = (event: DropdownChangeEvent) => {
        const selected = (event.value as string | null) ?? null;
        setSelectedContato(selected);
        const updatedPessoa = pessoa.copyWith(mapContatoSelectionToFlags(selected));

        setPessoa(updatedPessoa);
        validateFieldsPessoa(updatedPessoa, setErrors, msgs, selectedVendedor, selectedContrato);
    };
    const handleCNAEChange = (cnae: TableCNAEEntity | null) => {
        setSelectedCNAE(cnae);
        const updatedPessoa = pessoa.copyWith({
            cnae_fiscal: cnae?.codigo ?? null
        });
        setPessoa(updatedPessoa);
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.cnae_fiscal;
            return newErrors;
        });
    };
    const handleContratoChange = (contrato: ContratoEntity | null) => {
        setSelectedContrato(contrato);
        setPessoa((prev) =>
            prev.copyWith({
                id_contrato: contrato?.id ?? null
            })
        );
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedContrato;
            return newErrors;
        });
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    const handleValidateCnpj = () => {
        setTouchedFields((prev) => ({ ...prev, cnpj: true }));
        validatePessoaForm();
    };
    const handleSearchPessoaCnpj = async () => {
        setLoadingCnpj(true);
        await handleSearchCNPJ(pessoa?.cnpj ?? '', setPessoa, setErrors, msgs);
        setLoadingCnpj(false);
        setTouchedFields((prev) => ({ ...prev, cnpj: true }));
    };
    const listagemPessoaID = async (currentPessoaId: string) => {
        try {
            setIsLoading(true);
            const { dataPessoa } = await fetchPessoasById(currentPessoaId);
            const pessoaEntity = new PessoaEntity(dataPessoa);
            setPessoa(pessoaEntity);
            setSelectedContato(mapPessoaContatoToSelection(dataPessoa));
            setSelectedContrato(null);
            setSelectedCNAE(
                dataPessoa.cnae_fiscal
                    ? new TableCNAEEntity({
                        id: 0,
                        codigo: dataPessoa.cnae_fiscal,
                        descricao: dataPessoa.cnae_fiscal
                    })
                    : null
            );

            setSelectedVendedor(null);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (pessoaId) {
            setIsEditMode(true);
            listagemPessoaID(pessoaId).finally(() => setIsLoading(false));
            return;
        }

        setIsLoading(false);
    }, [pessoaId]);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validatePessoaForm();
        }
    }, [pessoa, selectedVendedor]);
    if (isLoading && pessoaId) {
        return <LoadingScreen loadingText="Carregando informações do Cliente ou Fornecedor selecionado..." />;
    }
    const isSubmitDisabled =
        stateDisableBtnCreatedClienteFornecedor ||
        isLoadingBtnCreated ||
        Object.keys(errors).length > 0 ||
        (pessoa.tipo_pessoa === 'PESSOA_JURIDICA' && !pessoa.cnpj) ||
        (pessoa.tipo_pessoa === 'PESSOA_FISICA' && !pessoa.cpf) ||
        (pessoa.tipo_pessoa === 'ESTRANGEIRO' && !pessoa.documento_estrangeiro) ||
        !pessoa?.razao_social ||
        (pessoa.tipo_pessoa !== 'PESSOA_FISICA' && !pessoa.codigo_regime_tributario) ||
        !pessoa.contribuinte ||
        !pessoa.endereco ||
        !pessoa.email;

    return (
        <div className="card styled-container-main-all-routes">
            <Messages ref={msgs} className="custom-messages" />
            <div className="scrollable-container ">
                <div className="custom-flex-col">
                    <FormCreatedPessoa
                        pessoa={pessoa}
                        errors={errors}
                        selectedContato={selectedContato}
                        selectedContrato={selectedContrato}
                        selectedCNAE={selectedCNAE}
                        loadingCnpj={loadingCnpj}
                        hasFocused={hasFocused}
                        reloadKeyContrato={reloadKeyContrato + reloadKeyContratoDropdown}
                        onAddContato={() => {}}
                        onFocusFirstField={() => setHasFocused(true)}
                        onChange={handleAllChanges}
                        onDropdownChange={handleDropdownChange}
                        onContatoChange={handleContatoChange}
                        onAddContrato={openCreateContratoDialog}
                        onEditContrato={openEditContratoDialog}
                        onContratoChange={handleContratoChange}
                        onCNAEChange={handleCNAEChange}
                        onSearchCnpj={handleSearchPessoaCnpj}
                        onValidateCnpj={handleValidateCnpj}
                        fetchAllCnae={fetchAllCnae}
                        fetchFilteredCnae={fetchFilteredCnae}
                    />
                    <Divider align="center" className="form-divider">
                        <span>Vendedor</span>
                    </Divider>
                    <div className="col-12 lg:col-3 ">
                        <VendedorDropdownField
                            selectedVendedor={selectedVendedor}
                            selectedVendedorId={pessoa.id_vendedor_padrao ?? null}
                            reloadKey={reloadKeyVendedor}
                            onVendedorChange={handleVendedorChange}
                            onAddClick={openCreateVendedorDialog}
                            onEditClick={openEditVendedorDialog}
                            hasError={!!errors.selectedVendedor}
                            errorMessage={errors.selectedVendedor}
                        />
                    </div>
                    <EnderecoForm
                        endereco={pessoa?.endereco}
                        telefone={pessoa?.endereco?.telefone}
                        errors={errors}
                        onChange={handleAllChanges}
                        onCepSearch={() => handleSearchCep(pessoa.endereco?.cep || '', setLoadingCep, setPessoa, setError, msgs)}
                        onDropdownChange={handleDropdownChange}
                        onDropdownChangeEndereco={handleDropdownChangeEnderco}
                        getCitiesFromState={getCitiesFromState}
                        loadingCep={loadingCep}
                    />
                </div>
            </div>
            <div className="StyleContainer-btn-Created">
                <BTNPGCreatedAll
                    onClick={async () => await handleSubmit()}
                    disabled={isSubmitDisabled}
                    icon={''}
                    label={'Salvar'}
                />
            </div>
            <DialogFilter
                header={editingVendedorId ? "Editar Vendedor" : "Adicionar Vendedor"}
                visible={showModalVendedor}
                onHide={closeVendedorDialog}
                loading={isVendedorDialogLoading}
                loadingText={editingVendedorId ? 'Carregando informações do Vendedor...' : 'Abrindo cadastro de Vendedor...'}
            >
                <FormCreatedVendedor
                    key={`${editingVendedorId ?? 'novo'}-${vendedorDialogKey}`}
                    msgs={msgs}
                    ref={formRef}
                    vendedor={vendedor}
                    initialId={editingVendedorId}
                    preloadedVendedor={preloadedVendedor}
                    setVendedor={setVendedor}
                    onVendedorChange={handleVendedor}
                    onErrorsChange={handleErrorsChange}
                    redirectAfterSave={false}
                    onSaved={handleVendedorSaved}
                    onLoadingChange={setIsVendedorDialogLoading}
                    onClose={closeVendedorDialog}
                    showBTNPGCreatedDialog={true}
                    onBackClick={closeVendedorDialog}
                />
            </DialogFilter>
            <DialogFilter
                header={editingContratoId ? "Editar Contrato" : "Adicionar Contrato"}
                visible={showModalContrato}
                onHide={closeContratoDialog}
                loading={isContratoDialogLoading}
                loadingText={editingContratoId ? 'Carregando informações do Contrato...' : 'Abrindo cadastro de Contrato...'}
            >
                <ContratoFormCreated
                    key={`${editingContratoId ?? 'novo'}-${contratoDialogKey}`}
                    msgs={msgs}
                    ref={formContratoRef}
                    contrato={contrato}
                    initialId={editingContratoId}
                    preloadedContrato={preloadedContrato}
                    setContrato={setContrato}
                    onContratoChange={handleContratoFormChange}
                    onErrorsChange={handleErrorsChange}
                    redirectAfterSave={false}
                    onSaved={handleContratoSaved}
                    onLoadingChange={setIsContratoDialogLoading}
                    onClose={closeContratoDialog}
                    showBTNPGCreatedDialog={true}
                    onBackClick={closeContratoDialog}
                />
            </DialogFilter>
        </div>
    );
}


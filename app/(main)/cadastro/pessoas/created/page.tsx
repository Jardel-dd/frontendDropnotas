'use client';
import './styles.css';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import { Divider } from 'primereact/divider';
import { Messages } from 'primereact/messages';
import { useEffect, useRef, useState } from 'react';
import { FormCreatedPessoa } from '../form/controller';
import { getCitiesFromState } from '@/app/entity/maps';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { VendedorFormRef } from '../../vendedores/types/vendedor';
import { FormCreatedVendedor } from '../../vendedores/form/controller';
import VendedorDropdownField from '../../vendedores/dropDown/DropdownVendedor';
import { handleSearchCep } from '../../../../components/seachs/searchCep/controller';
import { handleSearchCNPJ } from '../../../../components/seachs/searchCnpj/controller';
import { validateFieldsPessoa } from '@/app/(main)/cadastro/pessoas/controller/validate';
import DialogFilter from '../../../../components/dialogs/dialogFilterComponents/dialogFilter';
import EnderecoForm from '../../../../components/enderecos/enderecoFormComponent/enderecoForm';
import BTNPGCreatedAll from '../../../../components/buttonsComponent/btnCreatedAll/btn-created-all';
import { fetchAllCnae, fetchFilteredCnae } from '../../../../components/fetchAll/listAllCnae/controller';
import { createdPessoa, fetchPessoasById, updatePessoa } from '@/app/(main)/cadastro/pessoas/controller/controller';
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
    const [loadingCep, setLoadingCep] = useState<boolean>(false);
    const [loadingCnpj, setLoadingCnpj] = useState<boolean>(false);
    const [showModalVendedor, setShowModalVendedor] = useState(false);
    const [selectedContato, setSelectedContato] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
    const [selectedCNAE, setSelectedCNAE] = useState<TableCNAEEntity | null>(null);
    const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
    const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
    const [stateDisableBtnCreatedClienteFornecedor, setStateDisableBtnCreatedClienteFornecedor] = useState(false);
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
    const validatePessoaForm = () => validateFieldsPessoa(pessoa, setErrors, msgs, selectedVendedor);
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
    const handleVendedorSaved = (created: VendedorEntity) => {
        setShowModalVendedor(false);
        setSelectedVendedor(created);
        handleAllChanges({
            target: { id: 'id_vendedor_padrao', value: created.id, type: 'input' }
        });
        setReloadKeyVendedor((k) => k + 1);
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
        validateFieldsPessoa(updatedPessoa, setErrors, msgs, selectedVendedor);
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
        (pessoa.tipo_pessoa === 'PESSOA_FISICA' && !pessoa.rg) ||
        (pessoa.tipo_pessoa === 'ESTRANGEIRO' && !pessoa.documento_estrangeiro) ||
        !pessoa?.razao_social ||
        !pessoa.codigo_regime_tributario ||
        !pessoa.contribuinte ||
        (!selectedVendedor && !pessoa.id_vendedor_padrao) ||
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
                        selectedCNAE={selectedCNAE}
                        loadingCnpj={loadingCnpj}
                        hasFocused={hasFocused}
                        onFocusFirstField={() => setHasFocused(true)}
                        onChange={handleAllChanges}
                        onDropdownChange={handleDropdownChange}
                        onContatoChange={handleContatoChange}
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
                            onAddClick={() => setShowModalVendedor(true)}
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
            <DialogFilter header="Adicionar Vendedor" visible={showModalVendedor} onHide={() => setShowModalVendedor(false)}>
                <FormCreatedVendedor
                    msgs={msgs}
                    ref={formRef}
                    vendedor={vendedor}
                    initialId={null}
                    setVendedor={setVendedor}
                    onVendedorChange={handleVendedor}
                    onErrorsChange={handleErrorsChange}
                    redirectAfterSave={false}
                    onSaved={handleVendedorSaved}
                    onClose={() => setShowModalVendedor(false)}
                    showBTNPGCreatedDialog={true}
                    onBackClick={() => setShowModalVendedor(false)}
                />
            </DialogFilter>
        </div>
    );
}

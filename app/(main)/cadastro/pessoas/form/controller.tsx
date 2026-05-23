'use client';
import '@/app/styles/styledGlobal.css';
import { PessoaFields } from './pessoa';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation';
import { Divider } from 'primereact/divider';
import { Messages } from 'primereact/messages';
import { getCitiesFromState } from '@/app/entity/maps';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { TableCNAEEntity } from '@/app/entity/TableCNAEEntity';
import { VendedorFormRef } from '../../vendedores/types/vendedor';
import { FormCreatedVendedor } from '../../vendedores/form/controller';
import { handleSearchCep } from '@/app/components/seachs/searchCep/controller';
import { handleSearchCNPJ } from '@/app/components/seachs/searchCnpj/controller';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import EnderecoForm from '@/app/components/enderecos/enderecoFormComponent/enderecoForm';
import { validateFieldsPessoa } from '@/app/(main)/cadastro/pessoas/controller/validate';
import { FormPessoaCreatedProps, PessoaFormProps, PessoaFormRef } from '../types/pessoa';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import VendedorDropdownField from '@/app/(main)/cadastro/vendedores/dropDown/DropdownVendedor';
import { fetchAllCnae, fetchFilteredCnae } from '@/app/components/fetchAll/listAllCnae/controller';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { createdPessoa, fetchPessoasById, updatePessoa } from '@/app/(main)/cadastro/pessoas/controller/controller';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
export const mapPessoaContatoToSelection = (pessoa: Pick<PessoaEntity, 'pessoa_cliente' | 'pessoa_fornecedor'>): string | null => {
    if (pessoa.pessoa_cliente && pessoa.pessoa_fornecedor) return 'AMBOS';
    if (pessoa.pessoa_cliente) return 'pessoa_cliente';
    if (pessoa.pessoa_fornecedor) return 'pessoa_fornecedor';
    return null;
};
export const mapContatoSelectionToFlags = (selectedContato: string | null) => ({
    pessoa_cliente: selectedContato === 'AMBOS' || selectedContato === 'pessoa_cliente',
    pessoa_fornecedor: selectedContato === 'AMBOS' || selectedContato === 'pessoa_fornecedor'
});
const PessoaFormContainer = forwardRef<PessoaFormRef, PessoaFormProps>(
    (
        {
            initialId,
            msgs,
            onPessoaChange,
            onErrorsChange,
            redirectAfterSave,
            onClose,
            onSaved,
            showBTNPGCreatedDialog,
            showBTNPGCreatedAll,
            onBackClick
        },
        ref
    ) => {
        const router = useRouter();
        const pessoaId = initialId;
        const formRef = useRef<VendedorFormRef>(null);
        const onPessoaChangeRef = useRef(onPessoaChange);
        const onErrorsChangeRef = useRef(onErrorsChange);
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
        const [loadingCep, setLoadingCep] = useState(false);
        const [loadingCnpj, setLoadingCnpj] = useState(false);
        const [showModalVendedor, setShowModalVendedor] = useState(false);
        const [selectedContato, setSelectedContato] = useState<string | null>(null);
        const [selectedContrato, setSelectedContrato] = useState<ContratoEntity | null>(null);
        const [errors, setErrors] = useState<Record<string, string>>({});
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [selectedCNAE, setSelectedCNAE] = useState<TableCNAEEntity | null>(null);
        const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
        const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
        const [reloadKeyContrato] = useState(0);
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
        const validatePessoaForm = () => validateFieldsPessoa(pessoa, setErrors, msgs, selectedVendedor, selectedContrato);
        const handleAllChanges = (event: any) => {
            const id = event?.target?.id;
            const type = event?.target?.type;
            const checked = event?.target?.checked;
            const value = event?.target?.value ?? event?.value ?? '';
            let newValue = type === 'checkbox' || type === 'switch' ? checked : value;
            const numericFields = [
                'inscricao_estadual',
                'inscricao_municipal',
                'telefone',
                'cep'
            ];
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
                'nome_pais',
                'telefone'
            ];
            setPessoa((prev) => {
                const pessoaAnterior = new PessoaEntity(prev);

                if (camposEndereco.includes(id)) {
                    return pessoaAnterior.copyWith({
                        endereco: {
                            ...pessoaAnterior.endereco,
                            [id]: newValue
                        }
                    });
                }
                return pessoaAnterior.copyWith({
                    [id]: newValue
                });
            });
        };
        const handleDropdownChange = (event: DropdownChangeEvent) => {
            const pessoaInstance = pessoa instanceof PessoaEntity ? pessoa : new PessoaEntity(pessoa);
            setPessoa(pessoaInstance.copyWith({ [event.target.id]: event.value }));
        };
        const handleDropdownChangeEndereco = (event: DropdownChangeEvent) => {
            const updatedEndereco = {
                ...pessoa.endereco,
                [event.target.id]: event.value
            };
            setPessoa((prev) => prev.copyWith({ endereco: updatedEndereco }));
        };
        const handleSubmit = async (event?: React.FormEvent) => {
            if (event) event.preventDefault();
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
                    const created = await createdPessoa(pessoa, setErrors, msgs, router, setPessoa, redirectAfterSave ?? true);
                    if (created) {
                        onSaved?.(created);
                    }
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
            setReloadKeyVendedor((current) => current + 1);
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
            const updatedPessoa = pessoa.copyWith({
                id_contrato: contrato?.id ?? null
            });
            setPessoa(updatedPessoa);
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
        useImperativeHandle(ref, () => ({
            handleSave: handleSubmit
        }));
        useEffect(() => {
            onPessoaChangeRef.current = onPessoaChange;
        }, [onPessoaChange]);
        useEffect(() => {
            onErrorsChangeRef.current = onErrorsChange;
        }, [onErrorsChange]);
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
        useEffect(() => {
            onPessoaChangeRef.current?.(pessoa);
        }, [pessoa]);
        useEffect(() => {
            onErrorsChangeRef.current?.(errors);
        }, [errors]);
        if (isLoading && pessoaId) {
            return <LoadingScreen  loadingText="Carregando informacoes do Cliente ou Fornecedor selecionado..." />;
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
            (!selectedContrato && !pessoa.id_contrato) ||
            !pessoa.endereco ||
            !pessoa.email;
        const isDialogMode = Boolean(showBTNPGCreatedDialog);
        return (
            <>
                <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
                    <Messages ref={msgs} className="custom-messages" />
                    <div className="scrollable-container shared-form-content">
                        <div className="custom-flex-col">
                            <PessoaFields
                                pessoa={pessoa}
                                errors={errors}
                                selectedContato={selectedContato}
                                selectedContrato={selectedContrato}
                                selectedCNAE={selectedCNAE}
                                loadingCnpj={loadingCnpj}
                                hasFocused={hasFocused}
                                reloadKeyContrato={reloadKeyContrato}
                                onAddContato={() => {}}
                                onFocusFirstField={() => setHasFocused(true)}
                                onChange={handleAllChanges}
                                onDropdownChange={handleDropdownChange}
                                onContatoChange={handleContatoChange}
                                onAddContrato={() => {}}
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
                            <div className="col-12 lg:col-3">
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
                                onDropdownChangeEndereco={handleDropdownChangeEndereco}
                                getCitiesFromState={getCitiesFromState}
                                loadingCep={loadingCep}
                            />
                        </div>
                    </div>
                    <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`}>
                        {showBTNPGCreatedAll && (
                            <BTNPGCreatedAll
                                onClick={async () => await handleSubmit()}
                                disabled={isSubmitDisabled}
                                label="Salvar"
                                icon="pi pi-save"
                            />
                        )}
                        {showBTNPGCreatedDialog && (
                            <BTNPGCreatedDialog
                                onClick={async () => await handleSubmit()}
                                disabled={isSubmitDisabled}
                                onBackClick={onBackClick}
                                onClose={onClose}
                                label="Salvar"
                                icon="pi pi-save"
                            />
                        )}
                    </div>
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
                        showBTNPGCreatedDialog
                        onBackClick={() => setShowModalVendedor(false)}
                    />
                </DialogFilter>
            </>
        );
    }
);
PessoaFormContainer.displayName = 'PessoaFormContainer';
function isPessoaFormProps(props: FormPessoaCreatedProps): props is PessoaFormProps {
    return 'msgs' in props;
}
export const FormCreatedPessoa = forwardRef<PessoaFormRef, FormPessoaCreatedProps>((props, ref) => {
    if (isPessoaFormProps(props)) {
        return <PessoaFormContainer {...props} ref={ref} />;
    }
    return <PessoaFields {...props} />;
});
FormCreatedPessoa.displayName = 'FormCreatedPessoa';

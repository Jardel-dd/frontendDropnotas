'use client';
import 'primeicons/primeicons.css';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { Messages } from 'primereact/messages';
import { IconReal } from '@/app/utils/icons/icons';
import { InputSwitch } from 'primereact/inputswitch';
import Input from '@/app/shared/include/input/input-all';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { useRouter, useSearchParams } from 'next/navigation';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { MultiSelectChangeEvent } from 'primereact/multiselect';
import PessoaForm from '@/app/components/pages/Pessoa/personForm';
import EmpresaForm from '@/app/components/pages/Empresa/companyForm';
import { InputNumberValueChangeEvent } from 'primereact/inputnumber';
import ServiceForm from '@/app/components/pages/Servicos/serviceForm';
import CustomMultiSelect from '@/app/shared/include/multSelect/Input';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import { useRef, useState, useEffect, RefObject, forwardRef } from 'react';
import { OptionsPeriodicidade } from '@/app/shared/optionsDropDown/options';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import { VendedorFormRef } from '@/app/components/pages/Vendedores/sellerForm';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { validateFieldsContrato } from '@/app/(main)/contrato/controller/validation';
import { CreatedDialog } from '@/app/components/dialogs/dialogCreatedComponent/dialog';
import { FormaPagamentoEntity, TipoFormaPagamento } from '@/app/entity/FormaPagamento';
import FormaPagamentoForm from '@/app/components/pages/FormaPagamento/formaPagamentoForm';
import { fetchContratosById } from '@/app/components/fetchAll/listAllContratos/controller';
import { createContrato, updateContrato } from '@/app/(main)/contrato/controller/controller';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import CategoriaContratoForm from '@/app/components/pages/CategoriaContratos/categoriaContratosForm';
import { fetchFilteredCompany, listTheCompany } from '@/app/components/fetchAll/listAllCompany/controller';
import { fetchFilteredService, listTheService } from '@/app/components/fetchAll/listAllService/controller';
import { fetchAllPessoas, fetchFilteredPessoas } from '@/app/components/fetchAll/listAllPessoas/controller';
import { fetchFilteredFormaPagamento, listTheFormaPagamento } from '@/app/components/fetchAll/listAllFormaPagamentos/controller';
import { fetchFilteredCategoriaContrato, listTheCategoriaContrato } from '@/app/components/fetchAll/listAllCategoriaContrato/controller';
export interface ContratoFormRef {
    handleSave: () => Promise<void>;
}
interface ContratoFormProps {
    contrato: any;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onContratoChange?: (contrato: ContratoEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setContrato: React.Dispatch<React.SetStateAction<ContratoEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: ContratoEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}

const ContratoForm = forwardRef<ContratoFormRef, ContratoFormProps>(({ initialId, onContratoChange, onErrorsChange, redirectAfterSave, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }: ContratoFormProps, ref) => {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages>(null);
    const searchParams = useSearchParams();
    const pessoaId = searchParams.get('id');
    const empresaId = searchParams.get('id');
    const servicosId = searchParams.get('id');
    const contratoId = searchParams.get('id');
    const formRef = useRef<VendedorFormRef>(null);
    const formaPagamentoId = searchParams.get('id');
    const categoriaContratoId = searchParams.get('id');
    const [isLoading, setIsLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [servico, setServico] = useState<ServiceEntity>(
        new ServiceEntity({
            ativo: true,
            id: null,
            descricao: '',
            descricao_completa: '',
            codigo: '',
            item_lista_servico: '',
            exigibilidade_iss: '',
            iss_retido: 'NAO',
            codigo_municipio: '',
            numero_processo: '',
            responsavel_retencao: '',
            codigo_cnae: '',
            valor_servico: null
        })
    );
    const [pessoa, setPessoa] = useState<PessoaEntity[]>([
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
            cnae_fiscal: '',
            data_fundacao: '',
            pessoa_cliente: false,
            pessoa_fornecedor: false,
            codigo_regime_tributario: '',
            tipo_pessoa: 'PESSOA_JURIDICA',
            contribuinte: '',
            // telefone: '',
            endereco: {} as EnderecoEntity,
            arquivo_contrato: '',
            id_vendedor_padrao: null,
            ativo: true,
            pais: ''
        })
    ]);
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
    const [reloadKeyPessoa, setReloadKeyPessoa] = useState(0);
    const [reloadKeyEmpresa, setReloadKeyEmpresa] = useState(0);
    const [reloadKeyServico, setReloadKeyServico] = useState(0);
    const [showModalPessoa, setShowModalPessoa] = useState(false);
    const [showModalServico, setShowModalServico] = useState(false);
    const [showModalEmpresa, setShowModalEmpresa] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [selectedPessoa, setSelectedPessoa] = useState<PessoaEntity[]>([]);
    const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity[]>([]);
    const [reloadKeyFormaPagamento, setReloadKeyFormaPagamento] = useState(0);
    const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoEntity>(
        new FormaPagamentoEntity({
            ativo: true,
            id: 0,
            descricao: '',
            aplicar_taxa_servico: false,
            observacao: '',
            tipo_forma_pagamento: '' as TipoFormaPagamento,
            tipo_taxa: '',
            valor_taxa: 0
        })
    );
    const [showModalFormaPagamento, setShowModalFormaPagamento] = useState(false);
    const [reloadKeyCategoriaContrato, setReloadKeyCategoriaContrato] = useState(0);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const [selectedCompany, setSelectedCompany] = useState<CompanyEntity | null>(null);
    const [selectedService, setSelectedService] = useState<ServiceEntity | null>(null);
    const [showModalCategoriaContrato, setShowModalCategoriaContrato] = useState(false);
    const [categoriaContrato, setCategoriaContrato] = useState<CategoryContratosEntity>(
        new CategoryContratosEntity({
            id: 0,
            descricao: '',
            observacoes: '',
            ativo: true
        })
    );
    const [stateDisableBtnCreatedContrato, setStateDisableBtnCreatedContrato] = useState(false);
    const [selectedFormadePagamento, setSelectedFormadePagamento] = useState<FormaPagamentoEntity | null>(null);
    const [selectedCategoriaContrato, setSelectedCategoriaContrato] = useState<CategoryContratosEntity | null>(null);
    const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
        const _contrato = contrato!.copyWith({
            [event.target.id]: event.target.type === 'checkbox' || event.target.type === 'switch' ? event.target.checked : event.target.value
        });
        setContrato(_contrato);
        if (touchedFields[event.target.id]) {
            validateFieldsContrato(_contrato, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa[0], setErrors, msgs);
        }
    };
    const handleServico = (updatedServico: ServiceEntity) => {
        setServico(updatedServico);
    };
    const handleServicoChange = (service: ServiceEntity | null) => {
        console.log(' Serviço selecionado:', service);
        setSelectedService(service);
        if (service) {
            console.log(` Serviço ID: ${service.id} | Descrição: ${service.descricao}`);
            handleAllChanges({
                target: { id: 'id_servico', value: service.id, type: 'input' }
            });
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.service;
            return newErrors;
        });
    };
    const handleServiceSaved = (created: ServiceEntity) => {
        setShowModalServico(false);
        setSelectedService(created);
        setReloadKeyServico((k) => k + 1);
    };
    const handleFormaPagamentoChange = (fp: FormaPagamentoEntity | null) => {
        setSelectedFormadePagamento(fp);
        console.log('[Dropdown] formaPagamento selecionado:', fp);
        if (fp) {
            console.log(`[Dropdown] ID: ${fp.id} | Descrição: ${fp.descricao}`);
            handleAllChanges({
                target: { id: 'id_forma_pagamento', value: fp.id, type: 'input' }
            });
        }
        setErrors((prev) => {
            const next = { ...prev };
            delete next.formaPagamento;
            delete next.selectedFormadePagamento;
            return next;
        });
    };
    const handleFormaPagamento = (updatedFormaPagamento: FormaPagamentoEntity) => {
        setFormaPagamento(updatedFormaPagamento);
    };
    const handleFormaPagamentoSaved = async (created: FormaPagamentoEntity) => {
        try {
            setShowModalFormaPagamento(false);
            const createdId = Number((created as any).id ?? (created as any).id_forma_pagamento);
            const all = await listTheFormaPagamento();
            const match = all.find((f: any) => Number(f.id) === createdId);
            if (match) {
                setSelectedFormadePagamento(match);
                handleAllChanges({
                    target: { id: 'id_forma_pagamento', value: match.id, type: 'input' }
                });
            } else {
                const fallback = new FormaPagamentoEntity({
                    ...created,
                    id: createdId
                } as any);
                setSelectedFormadePagamento(fallback);
                handleAllChanges({
                    target: { id: 'id_forma_pagamento', value: createdId, type: 'input' }
                });
                setReloadKeyFormaPagamento((k) => k + 1);
            }

            console.log('[handleFormaPagamentoSaved] Selecionado ID:', createdId);
        } catch (e) {
            console.error('[handleFormaPagamentoSaved] erro:', e);
            setReloadKeyFormaPagamento((k) => k + 1);
        }
    };
    const handleCategoriaContratoSaved = (created: CategoryContratosEntity) => {
        setShowModalCategoriaContrato(false);
        setSelectedCategoriaContrato(created);
        setReloadKeyCategoriaContrato((k) => k + 1);
    };
    const handleCategoriaContrato = (updatedCategoriaContrato: CategoryContratosEntity) => {
        setCategoriaContrato(updatedCategoriaContrato);
    };
    const handleCategoriaContratoChange = (categoriaContrato: CategoryContratosEntity | null) => {
        console.log(' Categoria selecionada:', categoriaContrato);
        setSelectedCategoriaContrato(categoriaContrato);
        if (categoriaContrato) {
            handleAllChanges({
                target: { id: 'id_categoria_contrato', value: categoriaContrato.id, type: 'input' }
            });
            console.log(` Categoria ID: ${categoriaContrato.id} | Descrição: ${categoriaContrato.descricao}`);
        } else {
            console.log('Nenhuma categoria selecionada (valor nulo).');
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.categoriaContrato;
            return newErrors;
        });
    };
    const handlePessoaSaved = (created: PessoaEntity) => {
        setShowModalPessoa(false);
        setSelectedPessoa((prev) => [...prev, created]);
        setReloadKeyPessoa((k) => k + 1);
    };
    const handlePessoaContrato = (updatedPessoa: PessoaEntity) => {
        setPessoa([updatedPessoa]);
    };
    const handlePessoaChange = (e: MultiSelectChangeEvent) => {
        const selected = e.value as PessoaEntity[];
        setSelectedPessoa(selected);
        const selectedIds = selected.map((user) => user.id);
        handleAllChanges({
            target: { id: 'id_clientes_contrato', value: selectedIds, type: 'input' }
        });
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedUserConta;
            return newErrors;
        });
    };
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        msgs.current?.clear();
        const isValid = validateFieldsContrato(contrato, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa[0], setErrors, msgs);
        if (isValid) {
            if (isEditMode && contratoId) {
                await updateContrato(contratoId, contrato, setErrors, msgs, router, setContrato);
            } else {
                await createContrato(
                    contrato,
                    selectedCategoriaContrato,
                    selectedCompany!,
                    selectedFormadePagamento!,
                    selectedPessoa,
                    setSelectedCategoriaContrato,
                    setSelectedCompany,
                    setSelectedFormadePagamento,
                    setSelectedPessoa,
                    setErrors,
                    msgs,
                    router
                );
            }
        }
    };
    const handleDropdownChange = (e: DropdownChangeEvent) => {
        const _contrato = contrato.copyWith({
            [e.target.id]: e.value
        });
        setContrato(_contrato);
    };
    const handleNumberChange = (e: InputNumberValueChangeEvent) => {
        const _contrato = contrato.copyWith({
            [e.target.id]: e.value ?? 0
        });
        setContrato(_contrato);
        setTouchedFields((prev) => ({
            ...prev,
            [e.target.id]: true
        }));
        validateFieldsContrato(contrato, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa[0], setErrors, msgs);
    };
    const handleCompanyChange = (empresa: CompanyEntity | null) => {
        setSelectedCompany(empresa);
        if (empresa) {
            handleAllChanges({
                target: { id: 'id_empresa', value: empresa.id, type: 'input' }
            });
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedCompany;
            return newErrors;
        });
    };
    const handleEmpresa = (updatedEmpresa: CompanyEntity) => {
        setEmpresa(updatedEmpresa);
    };
    const handleEmpresaSaved = (created: CompanyEntity) => {
        setShowModalEmpresa(false);
        setSelectedEmpresa((prev) => [...prev, created]);
        setReloadKeyEmpresa((k) => k + 1);
    };
    const ListagemContratoID = async (contratoId: string) => {
        try {
            setIsLoading(true);
            const { dataContrato, selectedEmpresa, selectedService, selectedCategoriaContrato, selectedFormaPagamento, selectedPessoa, pessoa } = await fetchContratosById(contratoId);
            setContrato(dataContrato);
            setSelectedCompany(selectedEmpresa);
            setSelectedService(selectedService);
            setSelectedCategoriaContrato(selectedCategoriaContrato);
            setSelectedFormadePagamento(selectedFormaPagamento);
            setPessoa(pessoa);
            setSelectedPessoa(selectedPessoa);
            console.log('Contrato ID:', dataContrato.id);
            console.log('dataContrato', dataContrato);
        } catch (error) {
            console.error('Erro ao carregar contrato:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleErrorsChange = (updatedErrors: Record<string, string>) => {
        setErrors(updatedErrors);
    };
    useEffect(() => {
        if (contratoId) {
            setIsEditMode(true);
            ListagemContratoID(contratoId);
        } else {
            setSelectedPessoa([]);
            setIsLoading(false);
        }
    }, [contratoId]);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFieldsContrato(contrato, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa[0], setErrors, msgs);
        }
    }, [contrato]);
    if (isLoading && contratoId) {
        return <LoadingScreen loadingText={'Carregando informações do Contrato selecionado...'} />;
    }
    return (
        <>
            <div className="p-fluid">
                <Messages ref={msgs} className="custom-messages" />
                <div className="card styled-container-main-all-routes">
                    <div className="scrollable-container">
                        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                            <div className="custom-flex-row">
                                <div className="w-full">
                                    <div className="grid formgrid ">
                                        <div className="col-12 mb-1 lg:col-9 lg:mb-0 ">
                                            <Input
                                                id="descricao"
                                                value={contrato.descricao || ''}
                                                onChange={handleAllChanges}
                                                hasError={!!errors.descricao}
                                                errorMessage={errors.descricao}
                                                label={'Descrição do Contrato'}
                                                onBlur={() => {
                                                    setTouchedFields((prev) => ({ ...prev, descricao: true }));
                                                    validateFieldsContrato(contrato, selectedCompany, selectedService, selectedCategoriaContrato, selectedFormadePagamento, selectedPessoa[0], setErrors, msgs);
                                                }}
                                                autoFocus={true}
                                                topLabel="Descrição:"
                                                showTopLabel
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-1 lg:col-3 lg:mb-0">
                                            <CustomInputNumber
                                                id="valor_servico"
                                                value={contrato.valor_servico || 0}
                                                onChange={handleNumberChange}
                                                label="Valor Serviços"
                                                useRightButton={true}
                                                outlined={true}
                                                hasError={!!errors.valor_servico}
                                                errorMessage={errors.valor_servico}
                                                iconLeft={<IconReal isDarkMode={false} />}
                                                topLabel="Valor Serviço:"
                                                showTopLabel
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-1 lg:col-3 lg:mb-0">
                                            <Dropdown
                                                id="periodicidade"
                                                value={contrato.periodicidade ?? ''}
                                                options={OptionsPeriodicidade}
                                                onChange={handleDropdownChange}
                                                label="Selecione a Periodicidade"
                                                hasError={!!errors.periodicidade}
                                                errorMessage={errors.periodicidade}
                                                topLabel="Periodicidade:"
                                                showTopLabel
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-1 lg:col-3 lg:mb-0 ">
                                            <DropdownSearch<CompanyEntity>
                                                id="selectedCompany"
                                                selectedItem={selectedCompany}
                                                key={reloadKeyEmpresa}
                                                onItemChange={handleCompanyChange}
                                                fetchAllItems={listTheCompany}
                                                fetchFilteredItems={fetchFilteredCompany}
                                                optionLabel="razao_social"
                                                optionValue="id"
                                                placeholder="Selecione a Empresa"
                                                hasError={!!errors.selectedCompany}
                                                errorMessage={errors.selectedCompany}
                                                autoSelectSingle
                                                showAddButton
                                                onAddClick={() => setShowModalEmpresa(true)}
                                                topLabel="Empresa:"
                                                showTopLabel
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-1 lg:col-3 lg:mb-0 ">
                                            <DropdownSearch<ServiceEntity>
                                                id="selectedService"
                                                key={reloadKeyServico}
                                                selectedItem={selectedService}
                                                onItemChange={handleServicoChange}
                                                fetchAllItems={listTheService}
                                                fetchFilteredItems={fetchFilteredService}
                                                optionLabel="descricao"
                                                optionValue="id"
                                                placeholder="Selecione o Serviço"
                                                hasError={!!errors.selectedService}
                                                errorMessage={errors.selectedService}
                                                autoSelectSingle
                                                showAddButton
                                                onAddClick={() => setShowModalServico(true)}
                                                topLabel="Serviço:"
                                                showTopLabel
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-1 lg:col-3 lg:mb-0 ">
                                            <DropdownSearch<CategoryContratosEntity>
                                                id="selectedCategoriaContrato"
                                                key={reloadKeyCategoriaContrato}
                                                selectedItem={selectedCategoriaContrato}
                                                onItemChange={handleCategoriaContratoChange}
                                                fetchAllItems={listTheCategoriaContrato}
                                                fetchFilteredItems={fetchFilteredCategoriaContrato}
                                                optionLabel="descricao"
                                                optionValue="id"
                                                placeholder="Selecione a Categoria de Contratos"
                                                hasError={!!errors.selectedCategoriaContrato}
                                                errorMessage={errors.selectedCategoriaContrato}
                                                autoSelectSingle
                                                showAddButton
                                                onAddClick={() => setShowModalCategoriaContrato(true)}
                                                topLabel="Categoria de Contratos:"
                                                showTopLabel
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-1 lg:col-3 lg:mb-0 ">
                                            <DropdownSearch<FormaPagamentoEntity>
                                                id="selectedFormadePagamento"
                                                key={reloadKeyFormaPagamento}
                                                selectedItem={selectedFormadePagamento}
                                                onItemChange={handleFormaPagamentoChange}
                                                fetchAllItems={listTheFormaPagamento}
                                                fetchFilteredItems={fetchFilteredFormaPagamento}
                                                optionLabel="descricao"
                                                optionValue="id"
                                                placeholder="Selecione a Forma de Pagamento"
                                                hasError={!!errors.selectedFormadePagamento}
                                                errorMessage={errors.selectedFormadePagamento}
                                                autoSelectSingle={false}
                                                showAddButton
                                                onAddClick={() => setShowModalFormaPagamento(true)}
                                                topLabel="Forma de pagamento:"
                                                showTopLabel
                                                required
                                            />
                                        </div>
                                        <div className="col-12 mb-1 lg:col-6 lg:mb-0 ">
                                            <CustomMultiSelect
                                                id="selectedPessoa"
                                                selectedItems={selectedPessoa}
                                                onChange={handlePessoaChange}
                                                fetchAllItems={fetchAllPessoas}
                                                fetchFilteredItems={fetchFilteredPessoas}
                                                options={pessoa}
                                                hasError={!!errors.selectedPessoa}
                                                errorMessage={errors.selectedPessoa}
                                                optionLabel="razao_social"
                                                placeholder="Selecione o Cliente ou Fornecedor"
                                                showChips={true}
                                                autoSelectSingle
                                                showAddButton
                                                onAddClick={() => setShowModalPessoa(true)}
                                                topLabel="Cliente ou Fornecedor:"
                                                showTopLabel
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid formgrid mt-3 gap-2 p-2">
                                        <div className="flex items-center gap-2">
                                            <InputSwitch
                                                checked={contrato.emitir_boleto ?? false}
                                                onChange={(event) => {
                                                    handleAllChanges({
                                                        target: { id: 'emitir_boleto', value: event.value, type: 'input' }
                                                    });
                                                }}
                                            />
                                            <span style={{ alignItems: 'center', display: 'flex' }}>Enviar Boleto</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <InputSwitch
                                                checked={contrato.enviar_email ?? false}
                                                onChange={(event) => {
                                                    handleAllChanges({
                                                        target: {
                                                            id: 'enviar_email',
                                                            value: event.value,
                                                            type: 'input'
                                                        }
                                                    });
                                                }}
                                            />
                                            <span style={{ alignItems: 'center', display: 'flex' }}>Enviar Email</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <InputSwitch
                                                checked={contrato.enviar_whatsapp ?? false}
                                                onChange={(event) => {
                                                    handleAllChanges({
                                                        target: { id: 'enviar_whatsapp', value: event.value, type: 'input' }
                                                    });
                                                }}
                                            />
                                            <span style={{ alignItems: 'center', display: 'flex' }}>Enviar WhatsApp</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="StyleContainer-btn-Created">
                        {showBTNPGCreatedAll && (
                            <BTNPGCreatedAll
                                onClick={async () => await handleSubmit()}
                                label={'Salvar'}
                                disabled={
                                    stateDisableBtnCreatedContrato ||
                                    Object.keys(errors).length > 0 ||
                                    !contrato.descricao ||
                                    !contrato.valor_servico ||
                                    !selectedCompany ||
                                    !selectedService ||
                                    !selectedCategoriaContrato ||
                                    !selectedFormadePagamento ||
                                    !selectedPessoa ||
                                    !contrato.periodicidade
                                }
                            />
                        )}
                        {showBTNPGCreatedDialog && (
                            <BTNPGCreatedDialog
                                onClick={async () => await handleSubmit()}
                                disabled={
                                    stateDisableBtnCreatedContrato ||
                                    Object.keys(errors).length > 0 ||
                                    !contrato.descricao ||
                                    !contrato.valor_servico ||
                                    !selectedCompany ||
                                    !selectedService ||
                                    !selectedCategoriaContrato ||
                                    !selectedFormadePagamento ||
                                    !selectedPessoa ||
                                    !contrato.periodicidade
                                }
                                icon={''}
                                onBackClick={onBackClick}
                                onClose={onClose}
                                label={'Salvar'}
                            />
                        )}
                    </div>
                    <CreatedDialog header="Adicionar Serviço" visible={showModalServico} onHide={() => setShowModalServico(false)}>
                        <ServiceForm
                            msgs={msgs}
                            ref={formRef}
                            servico={servico}
                            initialId={servicosId}
                            setServico={setServico}
                            onServicoChange={handleServico}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            onSaved={handleServiceSaved}
                            onClose={() => setShowModalServico(false)}
                            showBTNPGCreatedDialog={true}
                            onBackClick={() => setShowModalServico(false)}
                        />
                    </CreatedDialog>
                    <CreatedDialog header="Adicionar Forma de Pagamento" visible={showModalFormaPagamento} onHide={() => setShowModalFormaPagamento(false)}>
                        <FormaPagamentoForm
                            msgs={msgs}
                            ref={formRef}
                            formaPagamento={formaPagamento}
                            initialId={formaPagamentoId}
                            setFormaPagamento={setFormaPagamento}
                            onFormaPagamentoChange={handleFormaPagamento}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            onSaved={handleFormaPagamentoSaved}
                            onClose={() => setShowModalFormaPagamento(false)}
                            showBTNPGCreatedDialog={true}
                            onBackClick={() => setShowModalFormaPagamento(false)}
                        />
                    </CreatedDialog>
                    <CreatedDialog header="Adicionar Categoria de Contratos" visible={showModalCategoriaContrato} onHide={() => setShowModalCategoriaContrato(false)}>
                        <CategoriaContratoForm
                            msgs={msgs}
                            ref={formRef}
                            categoriaContrato={categoriaContrato}
                            initialId={categoriaContratoId}
                            setCategoriaContrato={setCategoriaContrato}
                            onCategoriaContratoChange={handleCategoriaContrato}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            onSaved={handleCategoriaContratoSaved}
                            onClose={() => setShowModalCategoriaContrato(false)}
                            showBTNPGCreatedDialog={true}
                            onBackClick={() => setShowModalCategoriaContrato(false)}
                        />
                    </CreatedDialog>
                    <CreatedDialog header="Adicionar Cliente ou Fornecedor" visible={showModalPessoa} onHide={() => setShowModalPessoa(false)}>
                        <PessoaForm
                            msgs={msgs}
                            ref={formRef}
                            pessoa={pessoa}
                            initialId={pessoaId}
                            setPessoa={setPessoa}
                            onPessoaChange={handlePessoaContrato}
                            onErrorsChange={handleErrorsChange}
                            redirectAfterSave={false}
                            onSaved={handlePessoaSaved}
                            onClose={() => setShowModalPessoa(false)}
                            showBTNPGCreatedDialog={true}
                            onBackClick={() => setShowModalPessoa(false)}
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
});
ContratoForm.displayName = 'ContratoForm';
export default ContratoForm;

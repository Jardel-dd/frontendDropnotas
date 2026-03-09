'use client';

import LoadingScreen from '@/app/loading';
import PessoaForm from '../Pessoa/personForm';
import { Messages } from 'primereact/messages';
import EmpresaForm from '../Empresa/companyForm';
import ServiceForm from '../Servicos/serviceForm';
import { IconNumero } from '@/app/utils/icons/icons';
import { InputSwitch } from 'primereact/inputswitch';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import Input from '@/app/shared/include/input/input-all';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { useRouter, useSearchParams } from 'next/navigation';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { DatePicker } from '../../calendarComponent/datePicker';
import { ServiceOrderEntity } from '@/app/entity/ServiceOrderEntity';
import FormaPagamentoForm from '../FormaPagamento/formaPagamentoForm';
import { forwardRef, RefObject, useEffect, useRef, useState } from 'react';
import VendedorForm, { VendedorFormRef } from '../Vendedores/sellerForm';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import { CategoryContratosEntity } from '@/app/entity/CategoryContratEntity';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { DetalServiceOSEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import BTNPGCreatedAll from '../../buttonsComponent/btnCreatedAll/btn-created-all';
import { createdOrdemServico } from '@/app/(main)/ordemServicos/controller/controller';
import BTNPGCreatedDialog from '../../buttonsComponent/btnCreatedAll/btn-created-dialog';
import { validateFieldsOrdemServico } from '@/app/(main)/ordemServicos/controller/validation';
import { fetchFilteredService, listTheService } from '../../fetchAll/listAllService/controller';
import { fetchFilteredPessoas, listThePessoas } from '../../fetchAll/listAllPessoas/controller';
import { fetchFilteredCompany, listTheCompany } from '../../fetchAll/listAllCompany/controller';
import { fetchOrdemServiceByID } from '@/app/components/fetchAll/listAllOrdemServices/controller';
import { fetchAllVendedores, fetchFilteredVendedor } from '../../fetchAll/listAllVendedores/controller';
import { FormaPagamentoEntity, Formas_recebimento, TipoFormaPagamento } from '@/app/entity/FormaPagamento';
import { fetchFilteredFormaPagamento, listTheFormaPagamento } from '../../fetchAll/listAllFormaPagamentos/controller';
import DialogFilter from '../../dialogs/dialogFilterComponents/dialogFilter';

export interface OrdemServicoFormRef {
    handleSave: () => Promise<void>;
}
interface OrdemServicoFormProps {
    ordemServico: ServiceOrderEntity;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onOrdemServicoChange?: (servico: ServiceOrderEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setOrdemServico: React.Dispatch<React.SetStateAction<ServiceOrderEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: ServiceOrderEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
const OrdemServicoForm = forwardRef<OrdemServicoFormRef, OrdemServicoFormProps>(
    ({ ordemServico, initialId, msgs, onOrdemServicoChange, onErrorsChange, setOrdemServico, redirectAfterSave = true, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
        const router = useRouter();
        const searchParams = useSearchParams();
        const pessoaId = searchParams.get('id');
        const empresaId = searchParams.get('id');
        const servicosID = searchParams.get('id');
        const ordemServicoID = searchParams.get('id');
        const [loading, setLoading] = useState(false);
        const formRef = useRef<VendedorFormRef>(null);
        const formaPagamentoId = searchParams.get('id');
        const vendedorId = searchParams.get('id');
        const [emitirOS, setEmitirOS] = useState<ServiceOrderEntity>(
            new ServiceOrderEntity({
                id: 0,
                numero: 0,
                ativo: true,
                descricao: '',
                consideracoes_finais: '',
                data_hora_inicio: new Date(),
                data_hora_prevista: new Date(),
                data_hora_conclusao: new Date(),
                observacao_servico: '',
                observacao_interna: '',
                servicos: new DetalServiceOSEntity({
                    id_servico: 0,
                    descricao: '',
                    descricao_completa: '',
                    codigo: '',
                    quantidade: 1,
                    valor_servico: 0,
                    valor_desconto: 0
                }),
                formas_recebimento: new Formas_recebimento({
                    id_forma_recebimento: 0,
                    valor_taxa: 0,
                    valor_recebido: 0,
                    percentual_taxa: 0
                }),
                id_vendedor: 0,
                id_forma_pagamento: 0,
                id_cliente: 0,
                id_empresa: 0,
                orcar: true
            })
        );
        const [isLoading, setIsLoading] = useState(true);
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
        const [isEditMode, setIsEditMode] = useState(false);
        const [reloadKeyPessoa, setReloadKeyPessoa] = useState(0);
        const [reloadKeyVendedor, setReloadKeyVendedor] = useState(0);
        const [reloadKeyServico, setReloadKeyServico] = useState(0);
        const [showModalPessoa, setShowModalPessoa] = useState(false);
        const [showModalEmpresa, setShowModalEmpresa] = useState(false);
        const [showModalServico, setShowModalServico] = useState(false);
        const [showModalVendedor, setShowModalVendedor] = useState(false);
        const [errors, setErrors] = useState<{ [key: string]: string }>({});
        const [reloadKeyFormaPagamento, setReloadKeyFormaPagamento] = useState(0);
        const [selectedPessoa, setSelectedPessoa] = useState<PessoaEntity[]>([]);
        const [formaPagamento, setFormaPagamento] = useState<FormaPagamentoEntity>(
            new FormaPagamentoEntity({
                ativo: true,
                id: null,
                descricao: '',
                aplicar_taxa_servico: false,
                observacao: '',
                tipo_forma_pagamento: '' as TipoFormaPagamento,
                tipo_taxa: '',
                valor_taxa: 0
            })
        );
        const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
        const [showModalFormaPagamento, setShowModalFormaPagamento] = useState(false);
        const [selectedCliente, setSelectedCliente] = useState<PessoaEntity | null>(null);
        const [selectedService, setSelectedService] = useState<ServiceEntity | null>(null);
        const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity | null>(null);
        const [selectedServico, setSelectedServico] = useState<ServiceEntity | null>(null);
        const [selectedVendedor, setSelectedVendedor] = useState<VendedorEntity | null>(null);
        const [stateDisableBtnCreatedOrdemServico, setStateDisableBtnCreatedOrdemServico] = useState(false);
        const [selectedCategoriaContrato, setSelectedCategoriaContrato] = useState<CategoryContratosEntity | null>(null);
        const [selectedFormaPagamento, setSelectedFormaPagamento] = useState<FormaPagamentoEntity | null>(null);
        const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
            const { id, value, checked, type } = event.target;
            let newValue: any = type === 'checkbox' || type === 'switch' ? !!checked : type === 'number' ? Number(value) : value;
            if (newValue instanceof Date) {
                newValue = new Date(newValue.getTime());
            }
            setEmitirOS((prev) => {
                const state = prev as any;
                if (id.includes('.')) {
                    const [parent, child] = id.split('.');
                    return prev.copyWith({
                        [parent]: state[parent]?.copyWith ? state[parent].copyWith({ [child]: newValue }) : { ...state[parent], [child]: newValue }
                    });
                }
                return prev.copyWith({
                    [id]: newValue
                });
            });
        };

        const handleEmpresaChange = (empresa: CompanyEntity | null) => {
            setSelectedEmpresa(empresa);
            if (empresa) {
                setSelectedEmpresa(empresa);
                handleAllChanges({
                    target: { id: 'id_empresa', value: empresa.id, type: 'input' }
                });
            }
            setErrors((prevErrors: any) => {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedEmpresa;
                return newErrors;
            });
        };
        const handleServicoChange = (servico: ServiceEntity | null) => {
            if (!servico) {
                return;
            }
            setSelectedServico(servico);
            setEmitirOS((prev) =>
                prev.copyWith({
                    servicos: new DetalServiceOSEntity({
                        id_servico: servico.id,
                        descricao: servico.descricao,
                        codigo: servico.codigo ?? '',
                        descricao_completa: servico.descricao_completa ?? '',
                        valor_servico: servico.valor_servico ?? 0,
                        valor_desconto: servico.valor_desconto ?? 0
                    })
                })
            );
            setErrors((prevErrors: any) => {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedService;
                return newErrors;
            });
        };
        const handleFormaPagamentoChange = (fp: FormaPagamentoEntity | null) => {
            if (!fp) return;
            setSelectedFormaPagamento(fp);
            setEmitirOS((prev) =>
                prev.copyWith({
                    id_forma_pagamento: fp.id,
                    formas_recebimento: new Formas_recebimento({
                        id_forma_recebimento: fp.id,
                        valor_taxa: fp.valor_taxa,
                        valor_recebido: fp.valor_recebido,
                        percentual_taxa: fp.percentual_taxa
                    })
                })
            );
            setErrors((prevErrors: any) => {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedFormaPagamento;
                return newErrors;
            });
        };
        const handleVendedorChange = (vendedor: VendedorEntity | null) => {
            if (!vendedor) return;
            setSelectedVendedor(vendedor);
            handleAllChanges({
                target: { id: 'id_vendedor', value: vendedor.id, type: 'input' }
            });
            setErrors((prevErrors: any) => {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedVendedor;
                return newErrors;
            });
        };
        const handlePessoaChange = (pessoa: PessoaEntity | null) => {
            setSelectedCliente(pessoa);
            if (pessoa) {
                setSelectedCliente(pessoa);
                handleAllChanges({
                    target: { id: 'id_cliente', value: pessoa.id, type: 'input' }
                });
            }
            setErrors((prevErrors: any) => {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedCliente;
                return newErrors;
            });
        };
        const ListagemOrdemServicoID = async (ordemServicoID: string) => {
            console.log(' Buscando Ordem de Serviço pelo ID:', ordemServicoID);
            try {
                setIsLoading(true);
                const { dataOrdemServico, selectedEmpresa, selectedCliente, selectedService, selectedVendedor, selectedCategoriaContrato, selectedFormaPagamento } = await fetchOrdemServiceByID(ordemServicoID);
                setEmitirOS(dataOrdemServico);
                console.log('dataOrdemServico ID:', dataOrdemServico.id);
                setSelectedEmpresa(selectedEmpresa);
                setSelectedCliente(selectedCliente);
                setSelectedServico(selectedService);
                setSelectedVendedor(selectedVendedor);
                setSelectedCategoriaContrato(selectedCategoriaContrato);
                setSelectedFormaPagamento(selectedFormaPagamento);
                console.log('dataOrdemServico', dataOrdemServico);
            } catch (error) {
                console.error('Erro ao carregar contrato:', error);
            } finally {
                setIsLoading(false);
            }
        };
        const handleServiceSaved = (created: ServiceEntity) => {
            setShowModalServico(false);
            setSelectedService(created);
            setReloadKeyServico((k) => k + 1);
        };
        const handlePessoa = (updatedPessoa: PessoaEntity) => {
            setPessoa([updatedPessoa]);
        };
        const handleVendedor = (updatedVendedor: VendedorEntity) => {
            setVendedor(updatedVendedor);
        };
        const handleVendedorSaved = (created: VendedorEntity) => {
            setShowModalVendedor(false);
            setSelectedVendedor(created);
            setReloadKeyVendedor((k) => k + 1);
        };
        const handlePessoaSaved = (created: PessoaEntity) => {
            setShowModalPessoa(false);
            setSelectedPessoa((prev) => [...prev, created]);
            setReloadKeyPessoa((k) => k + 1);
        };
        const handleServico = (updatedServico: ServiceEntity) => {
            setServico(updatedServico);
        };
        const handleEmpresa = (updatedEmpresa: CompanyEntity) => {
            setEmpresa(updatedEmpresa);
        };
        const handleErrorsChange = (updatedErrors: Record<string, string>) => {
            setErrors(updatedErrors);
        };
        const handleDateChange = (field: keyof ServiceOrderEntity, value: Date | null) => {
            setEmitirOS((prev) =>
                prev.copyWith({
                    [field]: value
                })
            );
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
                    setSelectedFormaPagamento(match);
                    handleAllChanges({
                        target: { id: 'id_forma_pagamento', value: match.id, type: 'input' }
                    });
                } else {
                    const fallback = new FormaPagamentoEntity({
                        ...created,
                        id: createdId
                    } as any);
                    setSelectedFormaPagamento(fallback);
                    handleAllChanges({
                        target: { id: 'id_forma_pagamento', value: createdId, type: 'input' }
                    });
                    setReloadKeyFormaPagamento((k) => k + 1);
                }
            } catch (e) {
                setReloadKeyFormaPagamento((k) => k + 1);
            }
        };
        useEffect(() => {
            const numeroOSParam = searchParams.get('numero');
            const idParam = searchParams.get('id');
            if (numeroOSParam && !idParam) {
                setEmitirOS((prev) =>
                    prev.copyWith({
                        numero: Number(numeroOSParam)
                    })
                );
            }
        }, [searchParams]);
        useEffect(() => {
            if (ordemServicoID) {
                setIsEditMode(true);
                ListagemOrdemServicoID(ordemServicoID).finally(() => setIsLoading(false));
            }
        }, [ordemServicoID]);
        useEffect(() => {
            if (Object.values(touchedFields).some((touched) => touched)) {
                validateFieldsOrdemServico(emitirOS, selectedEmpresa, selectedCliente, selectedServico, selectedVendedor, selectedFormaPagamento, setErrors, msgs);
            }
        }, [emitirOS]);
        if (loading) {
            return <LoadingScreen loadingText="Carregando dados para emissão da Ordem de Serviço..." />;
        }
        return (
            <>
                <Messages ref={msgs} className="custom-messages" />
                <div className="scrollable-container">
                    <div className="grid formgrid">
                        <div className="col-12 lg:col-3 mt-1 ">
                            <Input value={emitirOS.numero || ''} onChange={handleAllChanges} label="Descrição" id="numero" disabled iconLeft={<IconNumero isDarkMode={false} />} showTopLabel required topLabel="Número:" />
                        </div>
                        <div className="col-12 lg:col-12 mt-1">
                            <Input
                                value={emitirOS.descricao || ''}
                                onChange={handleAllChanges}
                                label="Descrição"
                                id="descricao"
                                hasError={!!errors.descricao}
                                errorMessage={errors.descricao}
                                showTopLabel
                                required
                                topLabel="Descrição:"
                                autoFocus
                                onBlur={() => {
                                    setTouchedFields((prev) => ({ ...prev, descricao: true }));
                                    validateFieldsOrdemServico(emitirOS, selectedEmpresa, selectedCliente, selectedServico, selectedVendedor, selectedFormaPagamento, setErrors, msgs);
                                }}
                            />
                        </div>
                        <div className="col-12 lg:col-6 mt-1">
                            <DropdownSearch<CompanyEntity>
                                id="selectedEmpresa"
                                selectedItem={selectedEmpresa}
                                onItemChange={handleEmpresaChange}
                                fetchAllItems={listTheCompany}
                                fetchFilteredItems={fetchFilteredCompany}
                                optionLabel="razao_social"
                                placeholder="Selecione a Empresa"
                                hasError={!!errors.selectedEmpresa}
                                errorMessage={errors.selectedEmpresa}
                                autoSelectSingle
                                showAddButton
                                onAddClick={() => setShowModalEmpresa(true)}
                                showTopLabel
                                required
                                topLabel="Empresa:"
                            />
                        </div>
                        <div className="col-12 lg:col-6 mt-1">
                            <DropdownSearch<PessoaEntity>
                                id="selectedCliente"
                                key={reloadKeyPessoa}
                                selectedItem={selectedCliente}
                                onItemChange={handlePessoaChange}
                                fetchAllItems={listThePessoas}
                                fetchFilteredItems={fetchFilteredPessoas}
                                optionLabel="razao_social"
                                optionValue="id"
                                placeholder="Selecione o Cliente"
                                hasError={!!errors.selectedCliente}
                                errorMessage={errors.selectedCliente}
                                autoSelectSingle
                                showAddButton
                                onAddClick={() => setShowModalPessoa(true)}
                                showTopLabel
                                required
                                topLabel="Cliente ou Fornecedor:"
                            />
                        </div>
                        <div className="col-12 lg:col-6 mt-1">
                            <DropdownSearch<VendedorEntity>
                                id="selectedVendedor"
                                selectedItem={selectedVendedor}
                                onItemChange={handleVendedorChange}
                                fetchAllItems={fetchAllVendedores}
                                fetchFilteredItems={fetchFilteredVendedor}
                                optionLabel="razao_social"
                                placeholder="Selecione o Vendedor"
                                hasError={!!errors.selectedVendedor}
                                errorMessage={errors.selectedVendedor}
                                autoSelectSingle={false}
                                showAddButton
                                onAddClick={() => setShowModalVendedor(true)}
                                showTopLabel
                                required
                                topLabel="Vendedor:"
                            />
                        </div>
                        <div className="col-12 lg:col-6 mt-1">
                            <DropdownSearch<FormaPagamentoEntity>
                                id="selectedFormaPagamento"
                                key={reloadKeyFormaPagamento}
                                selectedItem={selectedFormaPagamento}
                                onItemChange={handleFormaPagamentoChange}
                                fetchAllItems={listTheFormaPagamento}
                                fetchFilteredItems={fetchFilteredFormaPagamento}
                                optionLabel="descricao"
                                optionValue="id"
                                placeholder="Selecione a Forma de Pagamento"
                                hasError={!!errors.selectedFormaPagamento}
                                errorMessage={errors.selectedFormaPagamento}
                                autoSelectSingle={false}
                                showAddButton
                                onAddClick={() => setShowModalFormaPagamento(true)}
                                showTopLabel
                                required
                                topLabel="Forma de Pagamento:"
                            />
                        </div>
                        <div className="col-12 lg:col-6 mt-1">
                            <DropdownSearch<ServiceEntity>
                                id="selectedService"
                                selectedItem={selectedServico}
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
                                showTopLabel
                                required
                                topLabel="Serviço:"
                            />
                        </div>
                        <div className="col-12 lg:col-4 mt-1">
                            <Input
                                min={1}
                                value={emitirOS.servicos.quantidade || ''}
                                onChange={handleAllChanges}
                                label="Ex: 3 serviços iguais "
                                id="servicos.quantidade"
                                type="number"
                                showTopLabel
                                topLabel="Quantidade de serviços:"
                                hasError={!!errors['servicos.quantidade']}
                                errorMessage={errors['servicos.quantidade']}
                            />
                        </div>
                    </div>
                    <div className="grid formgrid w-full">
                        <div className="col-12 lg:col-4 mt-1 ">
                            <DatePicker value={emitirOS.data_hora_inicio ?? null} onChange={(date) => handleDateChange('data_hora_inicio', date)} showTopLabel topLabel="Data início" />
                        </div>
                        <div className="col-12 lg:col-4 mt-1 ">
                            <DatePicker value={emitirOS.data_hora_prevista ?? null} onChange={(date) => handleDateChange('data_hora_prevista', date)} showTopLabel topLabel="Data prevista" />
                        </div>
                        <div className="col-12 lg:col-4 mt-1 ">
                            <DatePicker value={emitirOS.data_hora_conclusao ?? null} onChange={(date) => handleDateChange('data_hora_conclusao', date)} showTopLabel topLabel="Data conclusão" />
                        </div>
                    </div>
                    <div className="grid formgrid w-full">
                        <div className="col-12 lg:col-12 mt-1">
                            <InputTextarea value={emitirOS.consideracoes_finais || ''} onChange={handleAllChanges} rows={5} cols={30} label={''} id="consideracoes_finais" showTopLabel topLabel="Considerações finais:" />
                        </div>
                        <div className="col-12 lg:col-12 mt-1">
                            <InputTextarea value={emitirOS.observacao_interna || ''} onChange={handleAllChanges} rows={5} cols={30} label={''} id="observacao_interna" showTopLabel topLabel="Observações internas:" />
                        </div>
                        <div className="col-12 lg:col-12 mt-1">
                            <InputTextarea value={emitirOS.observacao_servico || ''} onChange={handleAllChanges} rows={5} cols={30} label={''} id="observacao_servico" showTopLabel topLabel="Observações do Serviço:" />
                        </div>
                        <div className="flex items-center gap-2 p-2 mt-3">
                            <InputSwitch
                                id="orcar"
                                checked={emitirOS.orcar ?? false}
                                onChange={(event) =>
                                    handleAllChanges({
                                        target: { id: 'orcar', value: event.value, type: 'input' }
                                    })
                                }
                            />
                            <span style={{ alignItems: 'center', display: 'flex' }}>Orçar</span>
                        </div>
                    </div>
                </div>
                <div className="StyleContainer-btn-Created" style={{ marginTop: 'auto' }}>
                    {showBTNPGCreatedAll && (
                        <BTNPGCreatedAll
                            onClick={async () => {
                                if (!emitirOS) return;
                                await createdOrdemServico(emitirOS, selectedEmpresa, selectedCliente, selectedServico, selectedVendedor, selectedFormaPagamento, setErrors, setEmitirOS, true, router, msgs);
                                console.log('emitirOS', emitirOS);
                            }}
                            label="Emitir Ordem"
                            disabled={
                                stateDisableBtnCreatedOrdemServico ||
                                Object.keys(errors).length > 0 ||
                                !emitirOS.descricao?.trim() ||
                                !emitirOS.id_empresa ||
                                !emitirOS.id_cliente ||
                                !emitirOS.id_vendedor ||
                                !emitirOS.id_forma_pagamento ||
                                !emitirOS.servicos.quantidade
                            }
                            icon=""
                        />
                    )}
                    {showBTNPGCreatedDialog && (
                        <BTNPGCreatedDialog
                            onClick={async () => {
                                if (!emitirOS) return;
                                await createdOrdemServico(emitirOS, selectedEmpresa, selectedCliente, selectedServico, selectedVendedor, selectedFormaPagamento, setErrors, setEmitirOS, true, router, msgs);
                                console.log('emitirOS', emitirOS);
                            }}
                            label="Emitir Ordem"
                            disabled={stateDisableBtnCreatedOrdemServico || Object.keys(errors).length > 0 || !emitirOS.descricao?.trim() || !emitirOS.id_empresa || !emitirOS.id_cliente || !emitirOS.id_vendedor || !emitirOS.servicos.quantidade}
                            icon=""
                        />
                    )}
                </div>
                <DialogFilter header="Adicionar Empresa" visible={showModalEmpresa} onHide={() => setShowModalEmpresa(false)}>
                    <EmpresaForm msgs={msgs} ref={formRef} empresa={empresa} initialId={empresaId} setEmpresa={setEmpresa} onEmpresaChange={handleEmpresa} onErrorsChange={handleErrorsChange} redirectAfterSave={true} showBTNPGCreatedAll={true} />
                </DialogFilter>
                <DialogFilter header="Adicionar Serviço" visible={showModalServico} onHide={() => setShowModalServico(false)}>
                    <ServiceForm
                        msgs={msgs}
                        ref={formRef}
                        servico={servico}
                        initialId={servicosID}
                        setServico={setServico}
                        onServicoChange={handleServico}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handleServiceSaved}
                        onClose={() => setShowModalServico(false)}
                        showBTNPGCreatedDialog={true}
                        onBackClick={() => setShowModalServico(false)}
                    />
                </DialogFilter>
                <DialogFilter header="Adicionar Cliente ou Fornecedor" visible={showModalPessoa} onHide={() => setShowModalPessoa(false)}>
                    <PessoaForm
                        msgs={msgs}
                        ref={formRef}
                        pessoa={pessoa}
                        initialId={pessoaId}
                        setPessoa={setPessoa}
                        onPessoaChange={handlePessoa}
                        onErrorsChange={handleErrorsChange}
                        redirectAfterSave={false}
                        onSaved={handlePessoaSaved}
                        onClose={() => setShowModalPessoa(false)}
                        showBTNPGCreatedDialog={true}
                        onBackClick={() => setShowModalPessoa(false)}
                    />
                </DialogFilter>
                <DialogFilter header="Adicionar Forma de Pagamento" visible={showModalFormaPagamento} onHide={() => setShowModalFormaPagamento(false)}>
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
                </DialogFilter>
                <DialogFilter header="Adicionar Vendedor" visible={showModalVendedor} onHide={() => setShowModalVendedor(false)}>
                    <VendedorForm
                        msgs={msgs}
                        ref={formRef}
                        vendedor={vendedor}
                        initialId={vendedorId}
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
            </>
        );
    }
);

OrdemServicoForm.displayName = 'OrdemServicoForm';

export default OrdemServicoForm;

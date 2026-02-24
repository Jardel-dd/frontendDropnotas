'use client';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { Messages } from 'primereact/messages';
import { getCitiesFromState } from '@/app/entity/maps';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { useRouter, useSearchParams } from 'next/navigation';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { DatePicker } from '../../calendarComponent/datePicker';
import { NfsEntity, PrepararNfs } from '@/app/entity/NfsEntity';
import NotaServico from '@/app/(main)/notaServico/emitirNfsE/nfse';
import { forwardRef, RefObject, useEffect, useRef, useState } from 'react';
import { DetalTomadorEntity, PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity, DetalPrestadorEntity } from '@/app/entity/CompanyEntity';
import BTNPGCreatedAll from '../../buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '../../buttonsComponent/btnCreatedAll/btn-created-dialog';
import { createdNotaServico, prepararNotaServico } from '@/app/(main)/notaServico/controller/controller';
import { DetalPrestadorValoresEntity, DetalServiceEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import { incentivoFiscal, prestacaoSus, regimeEspecialTributarioOptionsCompany, tipo_rps } from '@/app/shared/optionsDropDown/options';

export interface NotaServicoFormRef {
    handleSave: () => Promise<void>;
}
interface NotaServicoFormProps {
    notaServico: NfsEntity;
    initialId?: string | null;
    onSuccess?: () => void;
    msgs: RefObject<Messages | null>;
    onNotaServicoChange?: (nota: NfsEntity) => void;
    onErrorsChange?: (errors: Record<string, string>) => void;
    setNotaServico: React.Dispatch<React.SetStateAction<NfsEntity>>;
    redirectAfterSave?: boolean;
    onClose?: () => void;
    onSaved?: (created: NfsEntity) => void;
    showBTNPGCreatedDialog?: boolean;
    showBTNPGCreatedAll?: boolean;
    onBackClick?: () => void;
}
const NotaServicoForm = forwardRef<NotaServicoFormRef, NotaServicoFormProps>(
    ({ notaServico, initialId, onSuccess, msgs, onNotaServicoChange, onErrorsChange, setNotaServico, redirectAfterSave, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
        const router = useRouter();
        const toast = useRef<Toast>(null);
        const searchParams = useSearchParams();
        const [errors, setErrors] = useState<any>({});
        const [loading, setLoading] = useState(false);
        const [loadingCep, setLoadingCep] = useState(false);
        const [gerarNfse, setGerarNfse] = useState<NfsEntity>(
            new NfsEntity({
                referencia: '',
                competencia: '',
                regime_especial_tributacao: '',
                prestador: new DetalPrestadorEntity({
                    cpf_cnpj: 0,
                    inscricao_municipal: '',
                    razao_social: '',
                    nome_fantasia: '',
                    telefone: 0,
                    email: '',
                    prestacao_sus: false,
                    optante_simples_nacional: false,
                    incentivo_fiscal: false,
                    endereco: new EnderecoEntity({
                        cep: '',
                        logradouro: '',
                        complemento: '',
                        numero: '',
                        bairro: '',
                        municipio: '',
                        codigo_municipio: '',
                        codigo_pais: '',
                        nome_pais: '',
                        uf: '',
                        telefone: ''
                    })
                }),
                servico: new DetalServiceEntity({
                    id_servico: 0,
                    descricao: '',
                    descricao_completa: '',
                    codigo: '',
                    codigo_municipio: '',
                    valor_total: 0,
                    valores: new DetalPrestadorValoresEntity({
                        base_calculo: 0,
                        valor_servico: 0,
                        aliquota_iss: 0,
                        aliquota_deducoes: 0,
                        aliquota_pis: 0,
                        aliquota_cofins: 0,
                        aliquota_inss: 0,
                        aliquota_ir: 0,
                        aliquota_csll: 0,
                        aliquota_outras_retencoes: 0,
                        percentual_desconto_incondicionado: 0,
                        percentual_desconto_condicionado: 0
                    })
                }),
                tomador: new DetalTomadorEntity({
                    cpf_cnpj: 0,
                    razao_social: '',
                    email: '',
                    endereco: new EnderecoEntity({
                        cep: '',
                        logradouro: '',
                        complemento: '',
                        numero: '',
                        bairro: '',
                        municipio: '',
                        codigo_municipio: '',
                        codigo_pais: '',
                        nome_pais: '',
                        uf: '',
                        telefone: ''
                    })
                })
            })
        );
        const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
        const [dateRange, setDateRange] = useState<Date[] | null>([new Date(), new Date()]);
        const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity | null>(null);
        const [selectedCliente, setSelectedCliente] = useState<PessoaEntity | null>(null);
        const [selectedServico, setSelectedServico] = useState<ServiceEntity | null>(null);
        const handleAllChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any, bloco: 'prestador' | 'tomador' | 'servico' = 'prestador') => {
            const id = e?.target?.id ?? e?.id;
            const value = e?.target?.value ?? e?.value ?? '';
            if (!id) return;
            setGerarNfse((prev) => {
                const nfse = prev instanceof NfsEntity ? prev : new NfsEntity(prev);

                return nfse.copyWith({
                    [bloco]: (nfse[bloco] as any)?.copyWith ? (nfse[bloco] as any).copyWith({ [id]: value }) : { ...nfse[bloco], [id]: value }
                });
            });
        };
        const handleNumberChange = (e: any) => {
            const { id, value } = e.target;
            const _gerarNfse = gerarNfse.copyWith({
                servico: gerarNfse.servico.copyWith({
                    valores: gerarNfse.servico.valores.copyWith({
                        [id]: Number(value)
                    })
                })
            });
            setGerarNfse(_gerarNfse);
        };
        const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            msgs.current?.clear();
             if (isLoadingBtnCreated) return;
        setIsLoadingBtnCreated(true);
            const validationErrors: { [key: string]: string } = {};
            if (!gerarNfse.competencia) validationErrors.competencia = 'Competência é obrigatória';
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                msgs.current?.show({
                    severity: 'error',
                    summary: 'Erro de validação',
                    detail: 'Por favor, preencha todos os campos obrigatórios',
                    life: 5000
                });
                return;
            }
            try {
                setLoading(true);
                console.log('Dados que serão enviados:', gerarNfse);
                await createdNotaServico(gerarNfse, setErrors, msgs, router);
            } catch (error) {
                console.error('Erro ao submeter NFS-e:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao emitir NFS-e'
                });
            } finally {
                setLoading(false);
            }
        };
        const handleDropdownChange = (e: DropdownChangeEvent) => {
            const { id, value } = e.target;
            const _gerarNfse = gerarNfse.copyWith({
                prestador: {
                    ...gerarNfse.prestador,
                    [id]: value
                }
            });
            setGerarNfse(_gerarNfse);
        };
        const handleDropdownChangeRegime = (e: DropdownChangeEvent) => {
            const _gerarNfse = gerarNfse.copyWith({
                [e.target.id]: e.value
            });
            setGerarNfse(_gerarNfse);
        };
        const handleInputChangeEnderecoPrestador = (e: React.ChangeEvent<HTMLInputElement>) => {
            const field = e.target.id;
            const value = e.target.value;
            setGerarNfse((prev: NfsEntity) =>
                prev.copyWith({
                    prestador: new DetalPrestadorEntity({
                        ...prev.prestador,
                        endereco: new EnderecoEntity({
                            ...prev.prestador.endereco,
                            [field]: value
                        })
                    })
                })
            );
        };
        const handleEnderecoChangePrestador = (e: React.ChangeEvent<HTMLInputElement>) => {
            const field = e.target.id;
            const enderecoFields = ['cep', 'logradouro', 'complemento', 'numero', 'bairro', 'municipio', 'codigo_municipio', 'uf', 'nome_pais', 'codigo_pais'];
            if (enderecoFields.includes(field)) {
                handleInputChangeEnderecoPrestador(e);
            } else {
                handleAllChanges(e, 'prestador');
            }
        };
        const handleInputChangeEnderecoTomador = (e: React.ChangeEvent<HTMLInputElement>) => {
            const field = e.target.id;
            const value = e.target.value;
            setGerarNfse((prev: NfsEntity) =>
                prev.copyWith({
                    tomador: new DetalTomadorEntity({
                        ...prev.tomador,
                        endereco: new EnderecoEntity({
                            ...prev.tomador.endereco,
                            [field]: value
                        })
                    })
                })
            );
        };
        const handleEnderecoChangeTomador = (e: React.ChangeEvent<HTMLInputElement>) => {
            const field = e.target.id;
            const enderecoFields = ['cep', 'logradouro', 'complemento', 'numero', 'bairro', 'municipio', 'codigo_municipio', 'uf', 'nome_pais', 'codigo_pais'];
            if (enderecoFields.includes(field)) {
                handleInputChangeEnderecoTomador(e);
            } else {
                handleAllChanges(e, 'tomador');
            }
        };
        useEffect(() => {
            const id_empresa = Number(searchParams.get('id_empresa'));
            const id_cliente = Number(searchParams.get('id_cliente'));
            const id_servico = Number(searchParams.get('id_servico'));
            if (id_empresa && id_cliente && id_servico) {
                const prepararEmissao = async () => {
                    setLoading(true);
                    try {
                        const payload = new PrepararNfs({
                            id_empresa,
                            id_cliente,
                            id_servico
                        });
                        const response = await prepararNotaServico(payload, selectedEmpresa, selectedCliente, selectedServico, setErrors, toast, router);
                        if (response?.nfse) {
                            const nfse = response.nfse;
                            setGerarNfse(
                                new NfsEntity({
                                    ...nfse,
                                    prestador: nfse.prestador,
                                    tomador: nfse.tomador,
                                    servico: new DetalServiceEntity({
                                        ...nfse.servico,
                                        valores: nfse.servico.valores instanceof DetalPrestadorValoresEntity ? nfse.servico.valores : new DetalPrestadorValoresEntity(nfse.servico.valores)
                                    })
                                })
                            );
                            console.log('Preparada:', response.nfse);
                        }
                    } catch (error) {
                        console.error('Erro ao preparar emissão:', error);
                        toast.current?.show({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Falha ao preparar a emissão da NFS-e'
                        });
                    } finally {
                        setLoading(false);
                    }
                };

                prepararEmissao();
            }
        }, [searchParams]);
        if (loading) {
            return <LoadingScreen loadingText="Emitindo NFS-e..." />;
        }
        return (
            <>
                <div className="scrollable-container">
                    <Messages ref={msgs} className="custom-messages" />
                    <div className="grid formgrid  ">
                        <div className="col-4  lg:col-3 ">
                            <DatePicker
                                value={dateRange ? dateRange[0] : new Date()}
                                onChange={(date) => {
                                    setDateRange(date ? [date] : null);
                                    if (date) {
                                        const formatted = date.toISOString().split('T')[0];
                                        setGerarNfse((prev: NfsEntity) => prev.copyWith({ competencia: formatted }));
                                    }
                                }}
                                label="Competência:"
                                showTopLabel
                                topLabel="Competência:"
                            />
                        </div>
                        <div className="col-5 lg:col-4 ">
                            <Dropdown
                                id="regime_especial_tributacao"
                                value={gerarNfse.regime_especial_tributacao ?? ''}
                                options={regimeEspecialTributarioOptionsCompany}
                                onChange={handleDropdownChangeRegime}
                                label={'Selecione o Regime Tributário'}
                                showTopLabel
                                required
                                topLabel="Regime Especial Tributário:"
                            />
                        </div>
                    </div>
                    <NotaServico
                        nfseGerada={gerarNfse}
                        handleAllChanges={handleAllChanges}
                        handleDropdownChange={handleDropdownChange}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        handleSearchCep={() => {}}
                        setLoadingCep={setLoadingCep}
                        setNfs={() => {}}
                        setError={setErrors}
                        msgs={msgs}
                        router={router}
                        handleNumberChange={handleNumberChange}
                        setNfseGerada={setGerarNfse}
                        tipo_rps={tipo_rps}
                        prestacaoSus={prestacaoSus}
                        incentivoFiscal={incentivoFiscal}
                        handleDropdownChangeEnderecoPrestador={handleEnderecoChangePrestador}
                        handleDropdownChangeEnderecoTomador={handleEnderecoChangeTomador}
                        getCitiesFromState={getCitiesFromState}
                        loadingCep={loadingCep}
                    />
                </div>
                <div className="StyleContainer-btn-Created" style={{ marginTop: 'auto' }}>
                    {showBTNPGCreatedAll && (
                        <BTNPGCreatedAll
                            onClick={async () => {
                                if (!gerarNfse) return;
                                setLoading(true);
                                try {
                                    await createdNotaServico(gerarNfse, setErrors, msgs, router);
                                } catch (error) {
                                    console.log('Erro ao emitir NFS-e:', error);

                                    toast.current?.show({
                                        severity: 'error',
                                        summary: 'Erro',
                                        detail: 'Falha ao emitir NFS-e'
                                    });
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            label="Emitir NFS-E"
                            disabled={false}
                            icon=""
                        />
                    )}
                    {showBTNPGCreatedDialog && (
                        <BTNPGCreatedDialog
                            onClick={async () => {
                                if (!gerarNfse) return;
                                setLoading(true);
                                try {
                                    await createdNotaServico(gerarNfse, setErrors, msgs, router);
                                } catch (error) {
                                    console.log('Erro ao emitir NFS-e:', error);

                                    toast.current?.show({
                                        severity: 'error',
                                        summary: 'Erro',
                                        detail: 'Falha ao emitir NFS-e'
                                    });
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            label="Emitir NFS-E"
                            disabled={false}
                            icon=""
                        />
                    )}
                </div>
            </>
        );
    }
);
NotaServicoForm.displayName = 'NotaServicoForm';
export default NotaServicoForm;

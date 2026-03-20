'use client';

import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { Messages } from 'primereact/messages';
import { getCitiesFromState } from '@/app/entity/maps';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { useRouter, useSearchParams } from 'next/navigation';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { DatePicker } from '@/app/components/calendarComponent/datePicker';
import { NfsEntity, PrepararNfs } from '@/app/entity/NfsEntity';
import NotaServico from '@/app/(main)/notaServico/emitirNfsE/nfse';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { DetalTomadorEntity, PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity, DetalPrestadorEntity } from '@/app/entity/CompanyEntity';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { createdNotaServico, prepararNotaServico } from '@/app/(main)/notaServico/controller/controller';
import { DetalPrestadorValoresEntity, DetalServiceEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import { incentivoFiscal, prestacaoSus, regimeEspecialTributarioOptionsCompany, tipo_rps } from '@/app/shared/optionsDropDown/options';
import type { FormCreatedNotaServicoProps, NotaServicoFieldsProps, NotaServicoFormProps, NotaServicoFormRef } from '../types/notaServico';

export type { FormCreatedNotaServicoProps, NotaServicoFieldsProps, NotaServicoFormProps, NotaServicoFormRef } from '../types/notaServico';

const createEmptyNfse = () =>
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
            codigo: '',
            iss_retido: '',
            item_lista_servico: '',
            codigo_municipio: '',
            numero_processo: '',
            exigibilidade_iss: '',
            responsavel_retencao: '',
            municipio_incidencia: '',
            codigo_nbs: '',
            codigo_tributacao_municipio: '',
            tributacao_issqn: '',
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
    });

export function NotaServicoFields({
    gerarNfse,
    errors,
    loadingCep,
    dateRange,
    onDateChange,
    onChange,
    onNumberChange,
    onDropdownChange,
    onDropdownChangeRegime,
    onDropdownChangeEnderecoPrestador,
    onDropdownChangeEnderecoTomador,
    onSubmit,
    msgs,
    router,
    setErrors,
    setLoadingCep,
    setGerarNfse
}: NotaServicoFieldsProps) {
    return (
        <>
            <div className="grid formgrid">
                <div className="col-4 lg:col-3">
                    <DatePicker value={dateRange ? dateRange[0] : new Date()} onChange={onDateChange} label="Competencia:" showTopLabel topLabel="Competencia:" />
                </div>
                <div className="col-5 lg:col-4">
                    <Dropdown
                        id="regime_especial_tributacao"
                        value={gerarNfse.regime_especial_tributacao ?? ''}
                        options={regimeEspecialTributarioOptionsCompany}
                        onChange={onDropdownChangeRegime}
                        label="Selecione o Regime Tributario"
                        showTopLabel
                        required
                        topLabel="Regime Especial Tributario:"
                    />
                </div>
            </div>
            <NotaServico
                nfseGerada={gerarNfse}
                handleAllChanges={onChange}
                handleDropdownChange={onDropdownChange}
                handleSubmit={onSubmit}
                errors={errors}
                handleSearchCep={() => {}}
                setLoadingCep={setLoadingCep}
                setNfs={() => {}}
                setError={setErrors}
                msgs={msgs}
                router={router}
                handleNumberChange={onNumberChange}
                setNfseGerada={setGerarNfse}
                tipo_rps={tipo_rps}
                prestacaoSus={prestacaoSus}
                incentivoFiscal={incentivoFiscal}
                handleDropdownChangeEnderecoPrestador={onDropdownChangeEnderecoPrestador}
                handleDropdownChangeEnderecoTomador={onDropdownChangeEnderecoTomador}
                getCitiesFromState={getCitiesFromState}
                loadingCep={loadingCep}
            />
        </>
    );
}

const NotaServicoFormContainer = forwardRef<NotaServicoFormRef, NotaServicoFormProps>(({ notaServico, msgs, onNotaServicoChange, onErrorsChange, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const searchParams = useSearchParams();
    const onNotaServicoChangeRef = useRef(onNotaServicoChange);
    const onErrorsChangeRef = useRef(onErrorsChange);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);
    const [gerarNfse, setGerarNfse] = useState<NfsEntity>(notaServico instanceof NfsEntity ? notaServico : createEmptyNfse());
    const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
    const [dateRange, setDateRange] = useState<Date[] | null>([new Date(), new Date()]);
    const [selectedEmpresa] = useState<CompanyEntity | null>(null);
    const [selectedCliente] = useState<PessoaEntity | null>(null);
    const [selectedServico] = useState<ServiceEntity | null>(null);

    const handleAllChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any, bloco: 'prestador' | 'tomador' | 'servico' = 'prestador') => {
        const id = e?.target?.id ?? e?.id;
        const value = e?.target?.value ?? e?.value ?? '';
        if (!id) return;
        setGerarNfse((prev) => {
            const nfse = prev instanceof NfsEntity ? prev : new NfsEntity(prev);

            return nfse.copyWith({
                [bloco]: (nfse[bloco] as any)?.copyWith
                    ? (nfse[bloco] as any).copyWith({
                          [id]: value
                      })
                    : { ...nfse[bloco], [id]: value }
            });
        });
    };

    const handleNumberChange = (e: any, bloco: 'prestador' | 'tomador' | 'servico' = 'servico') => {
        const { id, value } = e.target;
        setGerarNfse((prev) =>
            prev.copyWith({
                [bloco]: (prev[bloco] as any).copyWith({
                    valores: (prev[bloco] as any).valores.copyWith({
                        [id]: Number(value)
                    })
                })
            })
        );
    };

    const handleDropdownChange = (e: DropdownChangeEvent, bloco: 'prestador' | 'tomador' | 'servico' = 'prestador') => {
        const { id, value } = e.target;
        setGerarNfse((prev) =>
            prev.copyWith({
                [bloco]: {
                    ...prev[bloco],
                    [id]: value
                }
            })
        );
    };

    const handleDropdownChangeRegime = (e: DropdownChangeEvent) => {
        setGerarNfse((prev) =>
            prev.copyWith({
                [e.target.id]: e.value
            })
        );
    };

    const handleInputChangeEnderecoPrestador = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.target.id;
        const value = e.target.value;
        setGerarNfse((prev) =>
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
            return;
        }
        handleAllChanges(e, 'prestador');
    };

    const handleInputChangeEnderecoTomador = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.target.id;
        const value = e.target.value;
        setGerarNfse((prev) =>
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
            return;
        }
        handleAllChanges(e, 'tomador');
    };

    const handleDateChange = (date: Date | null) => {
        setDateRange(date ? [date] : null);
        if (!date) return;
        const formatted = date.toISOString().split('T')[0];
        setGerarNfse((prev) => prev.copyWith({ competencia: formatted }));
        setErrors((prev) => {
            const next = { ...prev };
            delete next.competencia;
            return next;
        });
    };

    const handleSubmit = async (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }

        msgs.current?.clear();

        if (isLoadingBtnCreated) {
            return;
        }

        const validationErrors: Record<string, string> = {};
        if (!gerarNfse.competencia) {
            validationErrors.competencia = 'Competencia e obrigatoria';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            msgs.current?.show({
                severity: 'error',
                summary: 'Erro de validacao',
                detail: 'Por favor, preencha todos os campos obrigatorios',
                life: 5000
            });
            return;
        }

        setIsLoadingBtnCreated(true);

        try {
            setLoading(true);
            await createdNotaServico(gerarNfse, setErrors, msgs, router);
            onSaved?.(gerarNfse);
            onClose?.();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao emitir NFS-e'
            });
        } finally {
            setLoading(false);
            setIsLoadingBtnCreated(false);
        }
    };

    useImperativeHandle(ref, () => ({
        handleSave: handleSubmit
    }));

    useEffect(() => {
        onNotaServicoChangeRef.current = onNotaServicoChange;
    }, [onNotaServicoChange]);

    useEffect(() => {
        onErrorsChangeRef.current = onErrorsChange;
    }, [onErrorsChange]);

    useEffect(() => {
        onNotaServicoChangeRef.current?.(gerarNfse);
    }, [gerarNfse]);

    useEffect(() => {
        onErrorsChangeRef.current?.(errors);
    }, [errors]);

    useEffect(() => {
        const id_empresa = Number(searchParams.get('id_empresa'));
        const id_cliente = Number(searchParams.get('id_cliente'));
        const id_servico = Number(searchParams.get('id_servico'));

        if (!id_empresa || !id_cliente || !id_servico) {
            return;
        }

        const prepararEmissao = async () => {
            setLoading(true);
            try {
                const payload = new PrepararNfs({
                    id_empresa,
                    id_cliente,
                    id_servico
                });
                const response = await prepararNotaServico(payload, selectedEmpresa, selectedCliente, selectedServico, setErrors, msgs, router);

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
                }
            } catch (error) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao preparar a emissao da NFS-e'
                });
            } finally {
                setLoading(false);
            }
        };

        prepararEmissao();
    }, [searchParams]);

    if (loading) {
        return <LoadingScreen loadingText="Emitindo NFS-e..." />;
    }

    const isDialogMode = Boolean(showBTNPGCreatedDialog);

    return (
        <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
            <div className="scrollable-container shared-form-content">
                <Messages ref={msgs} className="custom-messages" />
                <NotaServicoFields
                    gerarNfse={gerarNfse}
                    errors={errors}
                    loadingCep={loadingCep}
                    dateRange={dateRange}
                    onDateChange={handleDateChange}
                    onChange={handleAllChanges}
                    onNumberChange={handleNumberChange}
                    onDropdownChange={handleDropdownChange}
                    onDropdownChangeRegime={handleDropdownChangeRegime}
                    onDropdownChangeEnderecoPrestador={handleEnderecoChangePrestador}
                    onDropdownChangeEnderecoTomador={handleEnderecoChangeTomador}
                    onSubmit={handleSubmit}
                    msgs={msgs}
                    router={router}
                    setErrors={setErrors}
                    setLoadingCep={setLoadingCep}
                    setGerarNfse={setGerarNfse}
                />
            </div>
            <div className={`StyleContainer-btn-Created shared-form-footer ${isDialogMode ? 'shared-form-dialog-footer' : ''}`} style={{ marginTop: 'auto' }}>
                {showBTNPGCreatedAll && <BTNPGCreatedAll onClick={handleSubmit} label="Emitir NFS-E" disabled={isLoadingBtnCreated} icon="" />}
                {showBTNPGCreatedDialog && <BTNPGCreatedDialog onClick={handleSubmit} label="Emitir NFS-E" disabled={isLoadingBtnCreated} icon="" onBackClick={onBackClick} onClose={onClose} />}
            </div>
        </div>
    );
});
NotaServicoFormContainer.displayName = 'NotaServicoFormContainer';
function isNotaServicoFormProps(props: FormCreatedNotaServicoProps): props is NotaServicoFormProps {
    return 'msgs' in props;
}
const FormNotaServicoCreated = forwardRef<NotaServicoFormRef, FormCreatedNotaServicoProps>((props, ref) => {
    if (isNotaServicoFormProps(props)) {
        return <NotaServicoFormContainer {...props} ref={ref} />;
    }
    return <NotaServicoFields {...props} />;
});
FormNotaServicoCreated.displayName = 'FormNotaServicoCreated';
export default FormNotaServicoCreated;

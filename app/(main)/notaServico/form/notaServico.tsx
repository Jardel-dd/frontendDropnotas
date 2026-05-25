'use client';
import { Toast } from 'primereact/toast';
import LoadingScreen from '@/app/loading';
import { Messages } from 'primereact/messages';
import { getCitiesFromState } from '@/app/entity/maps';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { useRouter, useSearchParams } from 'next/navigation';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { NfsEntity, PrepararNfs } from '@/app/entity/NfsEntity';
import NotaServico from '@/app/(main)/notaServico/emitirNfsE/nfse';
import { DatePicker } from '@/app/components/calendarComponent/datePicker';
import { ContatoEntity, DetalTomadorEntity, PessoaEntity } from '@/app/entity/PessoaEntity';
import {  DetalServiceEntity, ServiceEntity } from '@/app/entity/ServiceEntity';
import { CompanyEntity, DetalPrestadorEntity } from '@/app/entity/CompanyEntity';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { validateFieldsNotaServico } from '@/app/(main)/notaServico/controller/validation';
import BTNPGCreatedAll from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-all';
import BTNPGCreatedDialog from '@/app/components/buttonsComponent/btnCreatedAll/btn-created-dialog';
import { incentivoFiscal, prestacaoSus, regimeEspecialTributarioOptionsCompany, tipo_rps } from '@/app/shared/optionsDropDown/options';
export type { FormCreatedNotaServicoProps, NotaServicoFieldsProps, NotaServicoFormProps, NotaServicoFormRef } from '../types/notaServico';
import { createEmptyNfse, type FormCreatedNotaServicoProps, type NotaServicoFieldsProps, type NotaServicoFormProps, type NotaServicoFormRef } from '../types/notaServico';
import { createdNotaServico, fetchNotaServicoByID, normalizeNfseServiceValores, prepararCorrecaoNotaServico, prepararNotaServico } from '@/app/(main)/notaServico/controller/controller';

const buildEnderecoEntity = (endereco?: Partial<EnderecoEntity> | null) =>
    new EnderecoEntity({
        cep: endereco?.cep ?? '',
        logradouro: endereco?.logradouro ?? '',
        complemento: endereco?.complemento ?? '',
        numero: endereco?.numero ?? '',
        bairro: endereco?.bairro ?? '',
        municipio: endereco?.municipio ?? '',
        codigo_municipio: endereco?.codigo_municipio ?? '',
        codigo_pais: endereco?.codigo_pais ?? '',
        nome_pais: endereco?.nome_pais ?? '',
        uf: endereco?.uf ?? '',
        telefone: endereco?.telefone ?? ''
});
const buildContatoEntity = (contato?: Partial<ContatoEntity> | string | null) =>
    new ContatoEntity({
        email: typeof contato === 'string' ? contato : contato?.email ?? ''
    });
const parseCompetenciaDate = (competencia?: string | null) => {
    if (!competencia) {
        return null;
    }

    const [year, month, day] = competencia.split('T')[0].split('-').map(Number);

    if (!year || !month || !day) {
        return null;
    }

    const parsedDate = new Date(year, month - 1, day);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};
const buildNotaServicoFromResponse = (nfseData?: Partial<NfsEntity>) => {
    const notaData = nfseData ?? {};
    const emptyNfse = createEmptyNfse();

    return new NfsEntity({
        ...emptyNfse,
        ...notaData,
        prestador: new DetalPrestadorEntity({
            ...emptyNfse.prestador,
            ...(notaData.prestador ?? {}),
            endereco: buildEnderecoEntity(notaData.prestador?.endereco)
        }),
        tomador: new DetalTomadorEntity({
            ...emptyNfse.tomador,
            ...(notaData.tomador ?? {}),
            contato: buildContatoEntity((notaData.tomador as any)?.contato ?? (notaData.tomador as any)?.email),
            endereco: buildEnderecoEntity(notaData.tomador?.endereco)
        }),
        servico: new DetalServiceEntity({
            ...emptyNfse.servico,
            ...(notaData.servico ?? {}),
            valores: normalizeNfseServiceValores(notaData.servico?.valores)
        })
    });
};
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
        <div className="shared-form-tabbed-layout">
            <div className="grid formgrid">
              <div className="col-12 lg:col-3">
                    <DatePicker
                     value={dateRange ? dateRange[0] : new Date()} 
                     onChange={onDateChange} 
                     label="Competência:" 
                     showTopLabel 
                     topLabel="Competência:" 
                     required
                     />
                     </div>
                <div className="col-12 lg:col-3" >
                    <Dropdown
                        id="regime_especial_tributacao"
                        value={gerarNfse.regime_especial_tributacao ?? ''}
                        options={regimeEspecialTributarioOptionsCompany}
                        onChange={onDropdownChangeRegime}
                        label="Selecione o Regime Tributario"
                        hasError={!!errors.regime_especial_tributacao}
                        errorMessage={errors.regime_especial_tributacao}
                        showTopLabel
                        required
                        topLabel="Regime Especial Tributário:"
                    />
                </div>
            </div>
            <div className="shared-form-tabbed-body">
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
            </div>
        </div>
    );
}
const NotaServicoFormContainer = forwardRef<NotaServicoFormRef, NotaServicoFormProps>(({ notaServico, initialId, msgs, onNotaServicoChange, onErrorsChange, onClose, onSaved, showBTNPGCreatedDialog, showBTNPGCreatedAll, onBackClick }, ref) => {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const searchParams = useSearchParams();
    const correctionReference = searchParams.get('referencia');
    const hasInitialId = Boolean(initialId);
    const hasCorrectionReference = Boolean(correctionReference);
    const hasPrepararParams = Boolean(searchParams.get('id_empresa') && searchParams.get('id_cliente') && searchParams.get('id_servico'));
    const onNotaServicoChangeRef = useRef(onNotaServicoChange);
    const onErrorsChangeRef = useRef(onErrorsChange);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(hasPrepararParams || hasCorrectionReference || hasInitialId);
    const [loadingText, setLoadingText] = useState(
        hasPrepararParams
            ? 'Preparando NFS-e...'
            : hasCorrectionReference || hasInitialId
              ? 'Carregando NFS-e para correcao...'
              : 'Emitindo NFS-e...'
    );
    const [loadingCep, setLoadingCep] = useState(false);
    const [gerarNfse, setGerarNfse] = useState<NfsEntity>(notaServico instanceof NfsEntity ? notaServico : createEmptyNfse());
    const [isLoadingBtnCreated, setIsLoadingBtnCreated] = useState(false);
    const [isValidationActive, setIsValidationActive] = useState(false);
    const [dateRange, setDateRange] = useState<Date[] | null>([new Date(), new Date()]);
    const [selectedEmpresa] = useState<CompanyEntity | null>(null);
    const [selectedCliente] = useState<PessoaEntity | null>(null);
    const [selectedServico] = useState<ServiceEntity | null>(null);

    const handleAllChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any, bloco: 'prestador' | 'tomador' | 'servico' = 'prestador', subBloco?: "contato") => {
        const id = e?.target?.id ?? e?.id;
        const value = e?.target?.value ?? e?.value ?? '';
        if (!id) return;

        setGerarNfse((prev) => {
            const nfse = prev instanceof NfsEntity ? prev : new NfsEntity(prev);
            const blocoAtual = nfse[bloco] as any;
            const updateField = (target: any) =>
                target?.copyWith
                    ? target.copyWith({
                          [id]: value
                      })
                    : {
                          ...(target ?? {}),
                          [id]: value
                      };

            return nfse.copyWith({
                [bloco]: subBloco
                    ? blocoAtual?.copyWith
                        ? blocoAtual.copyWith({
                              [subBloco]: updateField(blocoAtual?.[subBloco])
                          })
                        : {
                              ...(blocoAtual ?? {}),
                              [subBloco]: updateField(blocoAtual?.[subBloco])
                          }
                    : updateField(blocoAtual)
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
        setIsValidationActive(true);
        const isValid = validateFieldsNotaServico(gerarNfse, setErrors, msgs, true);
        if (!isValid) {
            return;
        }
        setIsLoadingBtnCreated(true);

        try {
            setLoadingText('Emitindo NFS-e...');
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
        if (!isValidationActive) {
            return;
        }

        validateFieldsNotaServico(gerarNfse, setErrors);
    }, [gerarNfse, isValidationActive]);
    useEffect(() => {
        const id_empresa = Number(searchParams.get('id_empresa'));
        const id_cliente = Number(searchParams.get('id_cliente'));
        const id_servico = Number(searchParams.get('id_servico'));

        if (hasCorrectionReference || initialId || !id_empresa || !id_cliente || !id_servico) {
            return;
        }
        const prepararEmissao = async () => {
            setLoadingText('Preparando NFS-e...');
            setLoading(true);
            try {
                const payload = new PrepararNfs({
                    id_empresa,
                    id_cliente,
                    id_servico
                });
                const response = await prepararNotaServico(payload, selectedEmpresa, selectedCliente, selectedServico, setErrors, msgs, router);

                if (response?.nfse) {
                    const notaServicoPreparada = buildNotaServicoFromResponse(response.nfse);
                    const competenciaDate = parseCompetenciaDate(notaServicoPreparada.competencia);

                    setGerarNfse(notaServicoPreparada);
                    setDateRange(competenciaDate ? [competenciaDate] : [new Date()]);
                    setIsValidationActive(true);
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
    }, [hasCorrectionReference, initialId, msgs, router, searchParams, selectedCliente, selectedEmpresa, selectedServico]);
    useEffect(() => {
        if (!correctionReference || hasPrepararParams) {
            return;
        }

        const carregarNotaParaCorrecao = async () => {
            setLoadingText('Carregando NFS-e para correcao...');
            setLoading(true);

            try {
                const response = await prepararCorrecaoNotaServico(
                    {
                        referencia: correctionReference
                    },
                    msgs
                );
                const notaServicoCarregada = buildNotaServicoFromResponse(response?.nfse ?? response);
                const competenciaDate = parseCompetenciaDate(notaServicoCarregada.competencia);

                setGerarNfse(notaServicoCarregada);
                setDateRange(competenciaDate ? [competenciaDate] : [new Date()]);
                setIsValidationActive(true);
            } finally {
                setLoading(false);
            }
        };

        carregarNotaParaCorrecao().catch(() => undefined);
    }, [correctionReference, hasPrepararParams, initialId, msgs]);
    useEffect(() => {
        if (!initialId || hasPrepararParams || hasCorrectionReference) {
            return;
        }

        const carregarNotaPorId = async () => {
            setLoadingText('Carregando NFS-e para correcao...');
            setLoading(true);

            try {
                const response = await fetchNotaServicoByID(initialId);
                const notaServicoCarregada = buildNotaServicoFromResponse(response?.nfse ?? response);
                const competenciaDate = parseCompetenciaDate(notaServicoCarregada.competencia);

                setGerarNfse(notaServicoCarregada);
                setDateRange(competenciaDate ? [competenciaDate] : [new Date()]);
                setIsValidationActive(true);
            } catch (error) {
                msgs.current?.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Nao foi possivel carregar a NFS-e para correcao.',
                    life: 5000
                });
            } finally {
                setLoading(false);
            }
        };

        carregarNotaPorId();
    }, [hasCorrectionReference, hasPrepararParams, initialId, msgs]);
    if (loading) {
        return <LoadingScreen loadingText={loadingText} />;
    }
    const isDialogMode = Boolean(showBTNPGCreatedDialog);
    const isSubmitDisabled = isLoadingBtnCreated || (isValidationActive && Object.keys(errors).length > 0);

    return (
        <div className={`shared-form-layout ${isDialogMode ? 'shared-form-dialog-layout' : 'shared-form-page-layout'}`}>
            <div className="shared-form-tabbed-content">
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
                {showBTNPGCreatedAll && <BTNPGCreatedAll onClick={handleSubmit} label="Emitir" disabled={isSubmitDisabled} icon="pi pi-save" />}
                {showBTNPGCreatedDialog && <BTNPGCreatedDialog 
                onClick={handleSubmit} label="Emitir" disabled={isSubmitDisabled} icon="pi pi-save" onBackClick={onBackClick} onClose={onClose} />}
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

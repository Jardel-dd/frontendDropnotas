'use client';
import './styled.css';
import '@/app/styles/styledGlobal.css';
import LoadingScreen from '@/app/loading';
import React, { useEffect, useState } from 'react';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import PieChart from '@/app/components/chartsComponent/charts';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { filterOptions } from '@/app/shared/optionsDropDown/options';
import { formatCurrency } from '@/app/shared/traducaoBr/formatCurrency';
import { fetchRelatorioRecebimentos, mapDateRangeToIso } from './controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { fetchFilteredCompany, listTheCompany } from '@/app/components/fetchAll/listAllCompany/controller';
import { fetchFilteredPessoas, listThePessoas } from '@/app/components/fetchAll/listAllPessoas/controller';
import { Button } from 'primereact/button';
import { DateRangeValue, todayRange } from '@/app/components/calendarComponent/dataRangerPicker';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
const RelatoriosRecebimentos: React.FC = () => {
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const [loading, setLoading] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<CompanyEntity | null>(null);
    const [selectedPessoa, setSelectedPessoa] = useState<PessoaEntity | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [relatorio, setRelatorio] = useState<any | null>(null);
    const [dateRange, setDateRange] = useState<DateRangeValue>(todayRange);
    const [filterType, setFilterType] = useState<string | null>(null);
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
    const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
        let value = event.target.value;
        if (event.target.type === 'checkbox' || event.target.type === 'switch') {
            value = event.target.checked;
        } else if (event.target.type === 'number') {
            value = value === '' ? null : Number(value);
        }
        const _empresa = empresa!.copyWith({ [event.target.id]: value });
        setEmpresa(_empresa);
    };
    const handleCompanyChange = (empresa: CompanyEntity | null) => {
        setSelectedCompany(empresa);
        if (empresa) {
            handleAllChanges({
                target: {
                    id: 'id_empresa',
                    value: empresa ? empresa.id : null,
                    type: 'input'
                }
            });
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedCompany;
            return newErrors;
        });
    };
    const handlePessoaChange = (pessoa: PessoaEntity | null) => {
        setSelectedPessoa(pessoa);
        if (pessoa) {
            handleAllChanges({
                target: { id: 'id_empresa', value: empresa.id, type: 'input' }
            });
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedPessoa;
            return newErrors;
        });
    };
    const handleBuscarRelatorio = async () => {
        try {
            setLoading(true);

            const { dataInicio, dataFim } = mapDateRangeToIso(dateRange);
            const resultado = await fetchRelatorioRecebimentos({
                idEmpresa: selectedCompany?.id ?? null,
                idCliente: selectedPessoa?.id ?? null,
                dataInicio,
                dataFim
            });

            console.log('Relatório recebimentos:', resultado);
            setRelatorio(resultado);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleClearFilters = () => {
        setFilterType(null);
        handleCompanyChange(null);
        handlePessoaChange(null);
    };
    useEffect(() => {
        if (!dateRange) return;

        const buscar = async () => {
            try {
                setLoading(true);

                const { dataInicio, dataFim } = mapDateRangeToIso(dateRange);
                const resultado = await fetchRelatorioRecebimentos({
                    idEmpresa: selectedCompany?.id ?? null,
                    idCliente: selectedPessoa?.id ?? null,
                    dataInicio,
                    dataFim
                });
                console.log('Relatório recebimentos:', resultado);
                setRelatorio(resultado);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        buscar();
    }, [dateRange, selectedCompany, selectedPessoa]);
    return (
        <div className="p-fluid">
            <div className="card styled-container-main-all-routes w-full">
                <div className="scrollable-container">
                    {loading && <LoadingScreen loadingText={'Carregando...'} />}
                    <div className="row flex w-full">
                        <div className=" mt-2 p-2">
                            <div className="col-12 mb-0 lg:col-12 lg:mb-0 p-0 w-full ">
                                <label className="filter-label">Filtar por Data:</label>
                                {/* <DateRangeField value={dateRange} onChange={setDateRange} /> */}
                            </div>
                        </div>
                        <div className="col-12 mb-1 lg:col-3 lg:mb-0 w-2  ">
                            <div className="StyleDiv-row-filtro-all w-full ">
                                <label className="filter-label">Filtrar por:</label>
                                <div style={{ marginBottom: '3px' }}>{filterType && <Button label="Limpar filtro" outlined style={{ height: '3px' }} onClick={handleClearFilters} />}</div>
                            </div>
                            <div className="col-12 lg:col-3 w-full p-0">
                                <Dropdown
                                    value={filterType}
                                    options={filterOptions}
                                    onChange={(e) => {
                                        const novoFiltro = e.value as string | null;
                                        setFilterType(novoFiltro);
                                        if (novoFiltro === 'EMPRESA') handlePessoaChange(null);
                                        else if (novoFiltro === 'CLIENTES_FORNECEDORES') handleCompanyChange(null);
                                        else {
                                            handleCompanyChange(null);
                                            handlePessoaChange(null);
                                        }
                                    }}
                                    placeholder="Filtrar"
                                    optionLabel="label"
                                    optionValue="value"
                                    label={''}
                                />
                            </div>
                        </div>
                        {(filterType === 'EMPRESA' || filterType === 'AMBOS') && (
                            <>
                                <div className="col-12 lg:col-3 p-3 w-2">
                                    <label htmlFor="">Empresa:</label>
                                    <DropdownSearch<CompanyEntity>
                                        id="selectedCompany"
                                        selectedItem={selectedCompany}
                                        onItemChange={handleCompanyChange}
                                        fetchAllItems={listTheCompany}
                                        fetchFilteredItems={fetchFilteredCompany}
                                        optionLabel="razao_social"
                                        optionValue="id"
                                        placeholder="Selecione a Empresa"
                                    />
                                </div>
                            </>
                        )}
                        {(filterType === 'CLIENTES_FORNECEDORES' || filterType === 'AMBOS') && (
                            <>
                                <div className="col-12 lg:col-3 w-2 mt-2">
                                    <label htmlFor="">Cliente ou Fornecedor:</label>
                                    <DropdownSearch<PessoaEntity>
                                        id="selectedPessoa"
                                        selectedItem={selectedPessoa}
                                        onItemChange={handlePessoaChange}
                                        fetchAllItems={listThePessoas}
                                        fetchFilteredItems={fetchFilteredPessoas}
                                        optionLabel="razao_social"
                                        optionValue="id"
                                        placeholder=" Selecione o Cliente ou Fornecedor"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    {isMobile && (
                        <>
                            <div className="grid formgrid relatorio-cards">
                                <div className="card relatorio-card">
                                    <span className="relatorio-card-title">Valor Bruto</span>
                                    <strong className="relatorio-card-value">{formatCurrency(relatorio?.valorTotalBruto)}</strong>
                                </div>
                                <div className="card relatorio-card">
                                    <span className="relatorio-card-title">Descontos</span>
                                    <strong className="relatorio-card-value">{formatCurrency(relatorio?.valorTotalDescontos)}</strong>
                                </div>
                            </div>
                            <div className="grid formgrid" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className="card flex flex-column justify-content-center">
                                    <span className="relatorio-card-title">Valor Líquido</span>
                                    <strong className="relatorio-card-value">{formatCurrency(relatorio?.valorTotalLiquido)}</strong>
                                </div>

                                <div className="card flex flex-column justify-content-center">
                                    <span className="relatorio-card-title">Cancelados</span>
                                    <strong className="relatorio-card-value">{formatCurrency(relatorio?.valorTotalCancelados)}</strong>
                                </div>
                            </div>
                            <div className="grid formgrid" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className="card relatorio-card">
                                    <span className="relatorio-card-title">Não Cancelados</span>
                                    <strong className="relatorio-card-value">{formatCurrency(relatorio?.valorTotalNaoCancelados)}</strong>
                                </div>
                            </div>
                        </>
                    )}
                    {isDesktop && (
                        <>
                            <div className="grid formgrid relatorio-cards p-3">
                                <div className="card relatorio-card">
                                    <span className="relatorio-card-title">Valor Bruto</span>
                                    <strong className="relatorio-card-value">{formatCurrency(relatorio?.valorTotalBruto)}</strong>
                                </div>

                                <div className="card relatorio-card">
                                    <span className="relatorio-card-title">Descontos</span>
                                    <strong className="relatorio-card-value">{formatCurrency(relatorio?.valorTotalDescontos)}</strong>
                                </div>

                                <div className="card relatorio-card">
                                    <span className="relatorio-card-title">Valor Líquido</span>
                                    <strong className="relatorio-card-value">{formatCurrency(relatorio?.valorTotalLiquido)}</strong>
                                </div>

                                <div className="card relatorio-card">
                                    <span className="relatorio-card-title">Cancelados</span>
                                    <strong className="relatorio-card-value">{formatCurrency(relatorio?.valorTotalCancelados)}</strong>
                                </div>
                                <div className="card relatorio-card">
                                    <span className="relatorio-card-title">Não Cancelados</span>
                                    <strong className="relatorio-card-value">{formatCurrency(relatorio?.valorTotalNaoCancelados)}</strong>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="grid formgrid ">
                        <div className="col-12 mb-1 lg:col-6 lg:mb-0 ">
                            <PieChart
                                title="Status dos Serviços"
                                type="doughnut"
                                labels={['Abertas', 'Emitidas', 'Concluídas', 'Canceladas']}
                                values={[relatorio?.totalAberto || 0, relatorio?.totalEmitido || 0, relatorio?.totalConcluido || 0, relatorio?.totalCancelados || 0]}
                                legendPosition="bottom"
                                showPercentOnTooltip
                                percentDecimals={0}
                                disableAnimation
                                colors={['#3B82F6', '#10B981', '#6366F1', '#EF4444']}
                                hoverColors={['#60A5FA', '#34D399', '#818CF8', '#F97373']}
                            />
                        </div>
                        <div className="col-12 mb-1 lg:col-6 lg:mb-0 ">
                            <PieChart
                                title="Origem"
                                type="doughnut"
                                labels={['Ordem de Serviços', 'Notas Fiscais', 'Serviços']}
                                values={[relatorio?.totalOs || 0, relatorio?.totalNfse || 0, relatorio?.totalServicos || 0]}
                                legendPosition="bottom"
                                showPercentOnTooltip
                                percentDecimals={0}
                                disableAnimation
                                colors={['#3B82F6', '#10B981', '#6366F1']}
                                hoverColors={['#60A5FA', '#34D399', '#818CF8']}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RelatoriosRecebimentos;

'use client';
import './styled.css';
import dayjs from 'dayjs';
import '@/app/styles/styledGlobal.css';
import React, { useEffect, useState } from 'react';
import { PessoaEntity } from '@/app/entity/PessoaEntity';
import { CompanyEntity } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import PieChart from '@/app/components/chartsComponent/charts';
import { fetchDashboard, RelatorioDashboardParams } from './controller';
import { formatCurrency } from '@/app/shared/traducaoBr/formatCurrency';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { mapDateRangeToParams } from '@/app/components/calendarComponent/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import { fetchFilteredCompany, listTheCompany } from '@/app/components/fetchAll/listAllCompany/controller';
import { fetchFilteredPessoas, listThePessoas } from '@/app/components/fetchAll/listAllPessoas/controller';
import { DateRangePicker, DateRangeValue, todayRange } from '@/app/components/calendarComponent/dataRangerPicker';

const ComponentDashboard: React.FC = () => {
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const [loading, setLoading] = useState(false);
    const [relatorio, setRelatorio] = useState<any | null>(null);
    const [filterType, setFilterType] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [dateRange, setDateRange] = useState<DateRangeValue>(todayRange);
    const [selectedPessoa, setSelectedPessoa] = useState<PessoaEntity | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<CompanyEntity | null>(null);
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
                target: { id: 'id_pessoa', value: pessoa.id, type: 'input' }
            });
        }
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors.selectedPessoa;
            return newErrors;
        });
    };
    const handleClearFilters = () => {
        setFilterType(null);
        handleCompanyChange(null);
        handlePessoaChange(null);
    };
    const buscar = async () => {
        if (!dateRange) return;
        const [inicio, fim] = dateRange;
        if (!inicio || !fim) return;
        setLoading(true);
        try {
            const { data_hora_inicio, data_hora_fim } = mapDateRangeToParams([inicio, fim]);
            const params: RelatorioDashboardParams = {
                idEmpresa: selectedCompany?.id ?? null,
                idCliente: selectedPessoa?.id ?? null,
                data_hora_inicio,
                data_hora_fim
            };
            const resultado = await fetchDashboard(params);
            setRelatorio(resultado);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        buscar();
    }, [dateRange, selectedCompany, selectedPessoa]);
    return (
        <div className="p-fluid">
            <div className="p-0">
                {isMobile && (
                    <>
                        <div className="card styled-container-main-all-routes">
                            <div className="scrollable-container">
                                <div className="grid formgrid w-full" style={{ maxHeight: '74px' }}>
                                    <div className="col-10 mb-0 lg:col-12 lg:mb-0 p-0">
                                        <DateRangePicker
                                            showTopLabel
                                            topLabel="Filtar por Data:"
                                            onBuscar={(inicio: Date, fim: Date) => {
                                                setDateRange([dayjs(inicio), dayjs(fim)]);
                                            }}
                                        />
                                    </div>
                                    <div className="col-2 mb-0 lg:col-2" style={{ marginTop: '1px' }}>
                                        <div className="container-BTN-Filter-Created">
                                            <FilterOverlay onApply={buscar} onClear={handleClearFilters} buttonClassName="height-2-8rem-ml-1rem">
                                                <div className="col-12 lg:col-12 ">
                                                    <DropdownSearch<CompanyEntity>
                                                        id="selectedEmpresa"
                                                        selectedItem={selectedCompany}
                                                        onItemChange={handleCompanyChange}
                                                        fetchAllItems={listTheCompany}
                                                        fetchFilteredItems={fetchFilteredCompany}
                                                        optionLabel="razao_social"
                                                        optionValue="id"
                                                        topLabel="Empresa:"
                                                        showTopLabel
                                                        placeholder="Selecione a Empresa"
                                                    />
                                                </div>
                                                <div className="col-12 lg:col-12 ">
                                                    <DropdownSearch<PessoaEntity>
                                                        id="selectedPessoa"
                                                        selectedItem={selectedPessoa}
                                                        onItemChange={handlePessoaChange}
                                                        fetchAllItems={listThePessoas}
                                                        fetchFilteredItems={fetchFilteredPessoas}
                                                        optionLabel="razao_social"
                                                        optionValue="id"
                                                        topLabel="Cliente ou Fornecedor:"
                                                        showTopLabel
                                                        placeholder=" Selecione o Cliente ou Fornecedor"
                                                    />
                                                </div>
                                            </FilterOverlay>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid formgrid p-3">
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
                    </>
                )}
                {isDesktop && (
                    <>
                        <div className="card styled-container-main-all-routes">
                            <div className="scrollable-container">
                                <div className="grid formgrid">
                                    <div className="col-12 lg:col-3 container-input-search-all">
                                        <DateRangePicker
                                            showTopLabel
                                            topLabel="Filtar por Data:"
                                            onBuscar={(inicio: Date, fim: Date) => {
                                                setDateRange([dayjs(inicio), dayjs(fim)]);
                                            }}
                                        />
                                    </div>
                                    <div className="Container-Btn-Filter-Desktop">
                                        <FilterOverlay onApply={buscar} onClear={handleClearFilters} buttonClassName="Btn-Filter-Desktop">
                                            <div className="col-12 lg:col-12 ">
                                                <DropdownSearch<CompanyEntity>
                                                    id="selectedEmpresa"
                                                    selectedItem={selectedCompany}
                                                    onItemChange={handleCompanyChange}
                                                    fetchAllItems={listTheCompany}
                                                    fetchFilteredItems={fetchFilteredCompany}
                                                    optionLabel="razao_social"
                                                    optionValue="id"
                                                    topLabel="Empresa:"
                                                    showTopLabel
                                                    placeholder="Selecione a Empresa"
                                                />
                                            </div>
                                            <div className="col-12 lg:col-12 ">
                                                <DropdownSearch<PessoaEntity>
                                                    id="selectedPessoa"
                                                    selectedItem={selectedPessoa}
                                                    onItemChange={handlePessoaChange}
                                                    fetchAllItems={listThePessoas}
                                                    fetchFilteredItems={fetchFilteredPessoas}
                                                    optionLabel="razao_social"
                                                    optionValue="id"
                                                    topLabel="Cliente ou Fornecedor:"
                                                    showTopLabel
                                                    placeholder=" Selecione o Cliente ou Fornecedor"
                                                />
                                            </div>
                                        </FilterOverlay>
                                    </div>
                                </div>
                                <div className="grid formgrid relatorio-cards p-2">
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
                                <div className="grid formgrid p-3">
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
                    </>
                )}
            </div>
        </div>
    );
};
export default ComponentDashboard;
